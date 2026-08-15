# Yul, assembly, and EVM internals literacy

[← Back to Solidity](./README.md)

## What this chapter covers

When **inline assembly** and **Yul** are justified, what **storage/memory/calldata** look like at the slot/byte level, and how to review assembly without becoming a compiler engineer. Default remains high-level Solidity **0.8.x** / **0.8.36**. Assembly is an exception you can explain.

High-level Solidity is the grown-up default: checked math, memory rules, readable calls. An `assembly` block is you taking the steering wheel and the airbags at once. That can be the right move for a well-tested `muldiv`. It is a poor personality.

---

## 1. Concepts

### 1. High-level Solidity is the default

The compiler knows about checked math, call safety, and memory expansion. Inline assembly **turns those off** for the block you write. You become responsible for:

- overflow,
- dirty high bits on narrow types,
- memory safety,
- not corrupting the free-memory pointer.

If you cannot say why Solidity cannot express the same idea, **do not open an `assembly` block**.

### 2. Yul is the IR dialect

**Yul** is the intermediate language `solc` can emit and that `assembly { ... }` accepts. Standalone Yul objects exist; most teams only meet Yul inside Solidity. via-IR (chapter **16**) is “compile *through* Yul,” not “you must write Yul.”

### 3. A minimal, justified sketch

```solidity
function addOne(uint256 x) internal pure returns (uint256 y) {
    assembly {
        // x is a stack value already; add 1
        y := add(x, 1)
        // NOTE: this wraps like EVM ADD — it is NOT 0.8 checked math
    }
}
```

This example is a **warning**, not a template: you just reintroduced wrap. Real justifications look like: a well-reviewed `keccak` of a struct, a storage-slot helper for ERC-7201, or a tiny `call` wrapper that already has tests.

### 4. Storage layout literacy

- Slots are 32 bytes, numbered from 0 in declaration order.
- Items smaller than 32 bytes **pack**; the first item in a slot is **lower-order aligned** (low bytes of the word).
- `mapping(k => v)` at slot `p` stores `v` at `keccak256(h(k) . p)`.
- Dynamic arrays store length at `p` and data at `keccak256(p)`.
- Short `bytes`/`string` (`length < 32`) live in slot `p` itself with `length * 2` in the low byte; long ones use `length * 2 + 1` at `p` and data at `keccak256(p)` (chapter **12**).

You need this to:

- read a slot in an incident (`cast storage`),
- review a proxy layout,
- understand why swapping two `uint128`s is an upgrade break.

You do not need to implement a compiler.

### 5. Memory literacy

Memory is a byte array. Solidity keeps a **free-memory pointer** at `0x40`. Scratch space exists at `0x00`–`0x3f`. If assembly writes memory and forgets to update `0x40`, later Solidity allocations clobber you (or you clobber them).

### 6. Calldata literacy

Calldata is the input tape: selector + ABI words. Assembly that parses calldata by hand must match the ABI spec or you will read the wrong word.

---

## 2. Advanced concepts

### 1. Two Yul dialects you will meet

- **Inline assembly** inside Solidity: can mention Solidity locals (`let x := slot`). The compiler allocates stack/memory around you.
- **Standalone Yul** (IR / `solc --strict-assembly`): a tiny language (`let`, `if`, `switch`, `function`, `for`). `viaIR` compiles Solidity → this, then to bytecode.

You do not need to write standalone Yul to ship. You do need to read a 15-line block without panicking.

### 2. Slot math you will actually type

```solidity
// mapping(address => uint256) balances;  // slot 0
function balanceSlot(address a) external pure returns (bytes32 s) {
    assembly {
        mstore(0x00, a)           // key, left-padded in the word
        mstore(0x20, 0)           // slot p = 0
        s := keccak256(0x00, 0x40)
    }
}

// ERC-1967 implementation slot = keccak256("eip1967.proxy.implementation") - 1
bytes32 constant IMPL = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
```

That is the same formula as chapter **12**. If your test’s `vm.load(addr, s)` does not match `balances(a)`, your encoding of `h(key)` is wrong — not the chain.

### 2b. Packed field extract / update (the assembly you will see)

```yul
// slot holds uint128 a (low) | uint128 b (high)
let word := sload(0)
let a := and(word, 0xffffffffffffffffffffffffffffffff)
let b := shr(128, word)

// write newA, keep b
let newWord := or(shl(128, b), and(newA, 0xffffffffffffffffffffffffffffffff))
sstore(0, newWord)
```

Missing the mask on `newA` is how you clobber `b`. The compiler emits this pattern for packed state; copy-paste only with tests that read *both* fields after a write.

### 3. Variable cleanup

Narrow types (`uint128`, `bool`) may have dirty high bits after `calldataload` / `sload` of a packed slot. The compiler **cleans** before using them as values (mask / compare). Your assembly may not. A dirty `bool` that is `0x02` can break `iszero` vs `eq(..., 1)` inconsistently. Read the variable-cleanup notes before shipping.

Cleanup is type-dependent: `uint160`/`address` mask to 160 bits; `bytes2` may need right-alignment awareness; boolean compare is not always `iszero`. When in doubt, use high-level Solidity for the compare and only assemble the hot arithmetic.

### 4. The free-memory pointer is a contract

```yul
let ptr := mload(0x40)
mstore(ptr, value)
mstore(0x40, add(ptr, 0x20))
```

Allocate **without** bumping `0x40` and the next `abi.encode` / high-level array write lands on top of you. Touching below `0x60` (scratch / zero slot) without restoring it is also a promise break. `memory-safe` means you kept these rules.

### 5. `memory-safe` assembly

`assembly ("memory-safe") { ... }` tells the optimizer it may assume you did not trash memory. A false promise is a **soundness** bug, not a style nit. If you are not sure, omit the annotation (the compiler treats the block as memory-unsafe and is more conservative).

### 6. Custom errors and `revert` in assembly

```yul
mstore(0x00, 0x08c379a000000000000000000000000000000000000000000000000000000000)
// or: mstore(0x00, shl(224, errorSelector))
mstore(0x04, 0x20)
// ... string payload ...
revert(0x00, length)
```

Easy to get **offset/length** wrong (wrong revert data, wallets show garbage). Prefer high-level `revert Error()` unless you are in a library that already standardized this.

### 7. When assembly *is* justified

| Justified | Not justified |
|-----------|----------------|
| Battle-tested math lib (muldiv) | Shaving 20 gas on an admin function |
| Namespaced storage slot helpers | “I saw it on a blog” |
| Very tight `call`/`returndatacopy` in a reviewed lib | Parsing JSON in assembly |
| Compiler cannot express a needed opcode | Bypassing checked math “for speed” on user balances |

Prefer importing a **maintained** library over writing a new one.

### 7b. Opcode vocabulary (read, do not memorize)

| Family | Examples | Literacy |
|--------|----------|----------|
| Stack | `DUP1`…`DUP16`, `SWAP1`…`SWAP16`, `POP` | Stack-too-deep starts here |
| Arithmetic | `ADD` `SUB` `MUL` `DIV` `SDIV` `MOD` `ADDMOD` `MULMOD` `EXP` | All wrap; checked math is Solidity’s wrapper |
| Comparison | `LT` `GT` `SLT` `EQ` `ISZERO` | |
| Bit | `AND` `OR` `XOR` `NOT` `SHL` `SHR` `SAR` `BYTE` | Packing masks |
| Env | `ADDRESS` `BALANCE` `CALLER` `CALLVALUE` `CALLDATALOAD` `CODESIZE` … | Globals |
| Storage | `SLOAD` `SSTORE` `TLOAD` `TSTORE` | Persistent vs transient |
| Memory | `MLOAD` `MSTORE` `MSTORE8` `MCOPY` | Free pointer discipline |
| Flow | `JUMP` `JUMPI` `JUMPDEST` `RETURN` `REVERT` `STOP` `INVALID` | |
| Call | `CALL` `STATICCALL` `DELEGATECALL` `CREATE` `CREATE2` | Chapter **15** |
| Log | `LOG0`…`LOG4` | Events |
| Hash | `KECCAK256` | Selectors, slots, EIP-712 |

Yul names these in lowercase (`add`, `sload`, `call`). Inline assembly may reference Solidity variables; the compiler decides whether they live on stack or in memory.

### 7c. A minimal `call` in Yul (so traces make sense)

```yul
let ok := call(gas(), addr, 0, add(data, 0x20), mload(data), 0, 0)
if iszero(ok) {
    returndatacopy(0, 0, returndatasize())
    revert(0, returndatasize())
}
```

That is “bubble the revert.” Swallowing `ok` without looking at returndata is how silent failures ship. Prefer high-level Solidity unless you are in a reviewed library that already standardized this.

### 8. EOF / experimental backends

EOF did not land as some compiler experiments assumed; later 0.8.x **removed** that backend. Do not write application code against experimental codegen (chapter **02**, **16**).

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Zero assembly in app contracts unless a named library |
| **Systems** | Slot maps in the ops doc for anything you will `cast storage` |
| **Security** | Assembly blocks get extra review + extra tests |
| **Operations** | Source maps kept for traces |
| **Software engineering** | Comment *why* above every `assembly` keyword |

---

## 4. Staff-level review checklist

- [ ] Each `assembly` block has a **written reason** and a test.
- [ ] No assembly on user-balance arithmetic unless it is a known, tested math primitive.
- [ ] Memory-safe annotations are true or absent.
- [ ] Storage packing / proxy slots have a layout test.
- [ ] New hires are not told “real Solidity is assembly.”

---

## References

- [Inline assembly](https://docs.soliditylang.org/en/v0.8.36/assembly.html)
- [Yul](https://docs.soliditylang.org/en/v0.8.36/yul.html)
- [Layout in storage](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_storage.html)
- [Layout in memory](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_memory.html)
- [Variable cleanup](https://docs.soliditylang.org/en/v0.8.36/internals/variable_cleanup.html)
- [IR-based codegen changes](https://docs.soliditylang.org/en/v0.8.36/ir-breaking-changes.html)
- [Foundry Book — cast](https://book.getfoundry.sh/cast/)
