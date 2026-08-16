# Inheritance, interfaces, and libraries

[← Back to Solidity](./README.md)

## What this chapter covers

How contracts **compose**: **inheritance** (including C3 linearization), **`abstract`**, **interfaces**, **libraries** (`using for`, `DELEGATECALL` vs embedded), and why this is a **storage-layout** decision. Assumes **0.8.x** / **0.8.36**.

Inheritance is not a Java classpath. It is “glue these storage slots and functions into **one** address.” Interfaces are “I promise this menu.” Libraries are “shared tools” — usually *copied into you*, sometimes *delegatecalled*.

---

## 1. Concepts

### 1. Inheritance merges code and storage

```solidity
contract Ownable {
    address public owner;
    constructor() { owner = msg.sender; }
}

contract Vault is Ownable {
    // owner occupies the first slot(s) of Vault too
}
```

`Vault is Ownable` means Vault **is** Ownable: functions, modifiers, and **state** appear on the same address. Slot order follows the **linearization** of bases (left-to-right, C3). Draw the chain before you add a second parent.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

interface IVault {
    function deposit() external payable;
    function owner() external view returns (address);
}

abstract contract Ownable {
    address public owner;
    error NotOwner();
    constructor(address admin) {
        owner = admin;
    }
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }
}

contract Vault is Ownable, IVault {
    uint256 public total;

    constructor(address admin) Ownable(admin) {}

    function deposit() external payable {
        total += msg.value;
    }

    function sweep() external onlyOwner {
        (bool ok, ) = payable(owner).call{value: address(this).balance}("");
        require(ok);
        total = 0;
    }
}
```

**What just happened**

- `IVault` is the menu other contracts should use: `IVault(addr).deposit{value: 1 ether}()`.
- `Ownable` is abstract furniture. You cannot deploy it alone (if you leave it abstract / incomplete). `Vault` fills it in.
- On the chain there is **one** address. `owner` and `total` are two slots on that same address — not two objects in RAM.

Constructors run most-base-first. Pass arguments explicitly:

```solidity
contract Vault is Ownable {
    constructor(address admin) Ownable(admin) {}
}
```

(Your `Ownable` must declare `constructor(address)` for that to compile—OZ v5 does.)

### 2. `virtual` and `override`

```solidity
abstract contract Hook {
    function afterPay() internal virtual {}
}

contract Vault is Hook {
    function afterPay() internal override {
        // ...
    }
}
```

Parents that allow replacement mark `virtual`. Children mark `override`. Multiple parents: `override(A, B)`. Forgetting this is a 0.6+ compile error—good.

### 3. Abstract contracts

`abstract contract` may omit function bodies. You cannot deploy it. Use it for shared implementation + holes. If a contract has any unimplemented function, it must be abstract.

### 4. Interfaces — the ABI you promise

```solidity
interface IERC20 {
    function transfer(address to, uint256 amt) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}
```

Rules of thumb:

- functions are implicitly `virtual` and `external`,
- no state variables (constants of certain kinds may appear in newer versions—prefer purity),
- no constructor,
- may inherit other interfaces.

Call others through interfaces:

```solidity
IERC20(token).transfer(to, amt);
```

You get type checking on the **call site**. You do **not** get a guarantee the address implements the interface—that is runtime trust (or a token list / ERC-165).

### 5. Libraries

```solidity
library MathLib {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

using MathLib for uint256;
// or: using {MathLib.add} for uint256;
```

| Kind | How it runs |
|------|-------------|
| `internal` library functions | **Embedded** into the caller (like a include) |
| `public` / `external` library functions | Separate deploy + **`DELEGATECALL`** |

Internal/pure libraries are the usual choice. External libraries need a deployed address and `link` step; they also share the delegatecall storage warning: the library’s code runs with **your** storage if you are not careful with layouts. Prefer `internal` libraries unless you have a size/reason to link.

`using A for B` lets you write `a.add(b)`. `using {f} for B global` (0.8.13+) applies in the whole file graph—powerful, easy to overuse.

### 6. `super`

`super.foo()` calls the **next** contract in the linearized order, not “my parent’s parent” in source order. With multiple inheritance, read the linearization (`solc` can print it) before you rely on `super`.

---

## 2. Advanced concepts

### 1. Diamond inheritance and C3 (worked)

Solidity linearizes with **C3** (Python-like). In `contract D is B, C`, the **right-most** parent is more derived. `super` walks that list, not “the class written above me in the file.”

```text
    A
   / \
  B   C
   \ /
    D   declared as: contract D is B, C

C3 (simplified): D → C → B → A
storage: A's slots, then B's, then C's, then D's
         (adjacent value types across that boundary may still pack)
super.f() from D starts at C.f, then B.f, then A.f
```

If C3 cannot linearize (inconsistent `is` lists), **compile error**. Keep graphs boring enough to draw on a slide. `override(B, C)` is required when two parents expose the same `virtual` function.

### 1b. C3 in one paragraph (so you can re-derive it)

Merge the linearizations of the parents and the parent list itself, left-to-right, never picking a class that still appears in another list’s tail. Solidity’s `is` list is **most base-ward last** in source for the *parents you write*, and the right-most parent is the most derived among siblings — matching Python’s MRO idea. Storage walks **most base-ward first** along that MRO. When two bases both declare `uint64 x` and `uint64 y` that would pack, they can share a slot across the inheritance boundary — layout tests must use the *derived* contract’s linearized order, not “file order.”

`solc --storage-layout` / `forge inspect Contract storageLayout` is the ground truth. Argue with the JSON, not with intuition.

### 2. Shadowing state

A child declaring `address public owner` when a parent already has `owner` is a **different slot** (or a compile error, depending on version/visibility). You then have two owners. Do not redeclare parent state “for clarity.”

### 3. Constructor order

Bases run **most base-ward first**, following the linearization. Modifier arguments on the `is` list (`C is Ownable(msg.sender)`) are evaluated in the derived constructor’s context. Storage writes in a base constructor see only slots that already exist — which is why uninitialized-proxy implementations are a different story (chapter **20**): constructors do not run on `delegatecall` upgrades.

### 4. ERC-165

`supportsInterface(bytes4)` advertises interfaces (`0x01ffc9a7` for ERC-165 itself). Use it when you accept arbitrary contract addresses. A `true` return is not “this token is honest” — anyone can implement the function and lie.

### 5. Libraries: `DELEGATECALL` vs `JUMP`

| Kind | How | `address(this)` / storage |
|------|-----|---------------------------|
| `internal` library functions | Inlined / jumped into *your* bytecode | Yours |
| `public`/`external` library functions | Linked; typically **`DELEGATECALL`** to the library address | **Yours** (like a proxy) |
| `using L for T` | Syntax sugar over the above | Same |

External libraries need a **link** step (`solc --libraries` / Foundry `libraries`). The deployed library address is part of your bytecode. Changing it changes the contract. Prefer `internal` libraries unless you have a real reason to share one on-chain copy.

`using {L.f} for T` (0.8.13+) and `using L for T global` (0.8.19+, `using`-file) are file-level attachment — still the same call mechanics.

### 6. Code size (EIP-170) and splitting

Runtime bytecode must stay under **24576 bytes** (24 KiB) on Ethereum L1. Hit it? Extract `internal` libraries, split into satellite contracts you `call` (not `delegatecall` unless you meant it), or simplify inheritance. Do not “just crank optimizer runs” as the only plan (chapter **16**).

### 7. OpenZeppelin as a library, not a personality

Import **Ownable**, **ReentrancyGuard**, **ERC20** when you need those exact semantics. Read the version’s changelog (v4 vs v5 — constructors vs `_disableInitializers`, custom errors, etc.). Do not copy-paste a 2018 Ownable from memory.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Call others via interfaces; keep inheritance shallow |
| **Systems** | Internal libraries for math; watch 24KB |
| **Security** | Inheritance order reviewed like storage; no surprise `delegatecall` libraries |
| **Operations** | Linked library addresses recorded if you use external libraries |
| **Software engineering** | One reason per parent; interfaces in `I*.sol` |

---

## 4. Staff-level review checklist

- Inheritance graph fits on one slide; linearization is understood.
- No accidental state shadowing.
- External calls go through **interfaces**, not mystery `address.call`.
- Libraries are `internal` unless a link reason is written down.
- OZ (or similar) version is **pinned** and matches tests.
- `super` usage matches C3, not “the class I see above in the file.”

---

## References

- [Contracts — inheritance, interfaces, libraries](https://docs.soliditylang.org/en/v0.8.36/contracts.html)
- [Structure of a contract](https://docs.soliditylang.org/en/v0.8.36/structure-of-a-contract.html)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Style guide](https://docs.soliditylang.org/en/v0.8.36/style-guide.html)
- [EIP-165](https://eips.ethereum.org/EIPS/eip-165)
