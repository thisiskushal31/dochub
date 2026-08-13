# Functions, visibility, modifiers, and payable

[← Back to Solidity](./README.md)

## What this chapter covers

How functions are declared, **visibility**, **state mutability** (`pure` / `view` / payable), **modifiers**, **overloading**, and **`receive` / `fallback`**. Assumes **0.8.x** / **0.8.36**.

A function is a door. Visibility says *who may knock*. Mutability says *whether the door changes the house*. `payable` says *whether coins are allowed through*. Modifiers are a porch light you reuse on several doors.

---

## 1. Concepts

### 1. A complete door, labeled

Order that reviewers expect: name, parameters, visibility, mutability, modifiers, returns.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Doors {
    address public owner;
    uint256 public stored;
    bool public paused;

    error NotOwner();
    error Paused();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _; // jump into the function body, then come back if you wrote more below
    }

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    // Write. Costs a transaction. Only the owner. Not while paused.
    function set(uint256 x) external onlyOwner whenNotPaused returns (uint256) {
        stored = x;
        return stored;
    }

    // Read. Usually a free call. Anyone.
    function get() external view returns (uint256) {
        return stored;
    }

    // Pure math. No storage, no chain context.
    function double(uint256 x) external pure returns (uint256) {
        return x * 2; // 0.8 checked multiply
    }

    function pause(bool v) external onlyOwner {
        paused = v;
    }
}
```

**What just happened**

| Function | Door policy |
|----------|-------------|
| `set` | Outside only, writes, owner, not paused |
| `get` | Outside only, reads, anyone |
| `double` | Outside only, no state at all |
| `pause` | Outside only, writes, owner |

`onlyOwner` and `whenNotPaused` run **left to right** before the body. Auth first, then pause, then work — that order is easier to review.

### 2. Visibility

| Keyword | Who can call |
|---------|----------------|
| `external` | Only from outside (or `this.f()`); calldata-friendly |
| `public` | Outside and inside; compiler may add a getter for public state |
| `internal` | This contract and children |
| `private` | This contract only (not children) |

**`private` / `internal` are not secrecy.** Other contracts cannot *name* the function; anyone can still read storage. Use visibility to shape the API, not to hide treasure.

Default for state variables is `internal`. Functions must state visibility explicitly.

Prefer **`external`** for the public API (calldata) and **`internal`** for helpers.

```solidity
function _bump(uint256 x) internal pure returns (uint256) {
    return x + 1; // helper: children can use it, wallets cannot click it
}
```

### 3. State mutability

| Keyword | Promise |
|---------|---------|
| (none) | May read and write state; may send/receive value only if also `payable` |
| `view` | Reads state (and chain context); no writes |
| `pure` | No state reads or writes; only inputs/locals |
| `payable` | May receive `msg.value` |

The compiler warns (and in many cases errors) if you lie. A `view` function that writes will not compile. Off-chain, `view`/`pure` are usually `eth_call`; a non-view needs a transaction.

### 4. Payable — coins through this door only

```solidity
mapping(address => uint256) public credit;

function deposit() external payable {
    // ETH is already on this contract's balance.
    // This line is *your* accounting of who sent it.
    credit[msg.sender] += msg.value;
}
```

Without `payable`, a non-zero `msg.value` **reverts**. Constructors can be `payable` to accept ETH at create.

Do not mark everything `payable` “just in case.” Accidental ETH with no accounting path is how funds get stuck.

### 5. `receive` and `fallback`

```solidity
// Plain ETH, empty calldata — “I just sent you coins.”
receive() external payable {
    credit[msg.sender] += msg.value;
}

// Someone called a function name we do not have.
fallback() external payable {
    revert("unknown function");
}
```

| Call shape | What runs |
|------------|-----------|
| Empty data + ETH | `receive` if present, else payable `fallback` |
| Non-empty unknown selector | `fallback` |
| Known selector | That function |

A fat `fallback` that tries to be a router is a review magnet. Prefer explicit functions.

### 6. Overloading

Two functions may share a name if parameter types differ. Selectors differ. ABI JSON lists both. Overload on `uint256` vs `uint8` is how humans call the wrong one. Prefer distinct names at the external surface (`setAmount` / `setFlag`).

---

## 2. Advanced concepts

### 1. `this.f()` vs `f()` — JUMP vs CALL

`f()` on an `internal`/`public` function is typically a **JUMP** (same context: `msg.sender`, `msg.value`, storage). `this.f()` is an **external `CALL`**:

- `msg.sender` becomes `address(this)`,
- you pay call gas,
- only `external`/`public` are reachable,
- reentrancy into other `external` functions is possible,
- `delegatecall` proxies: `this.f()` hits the *proxy’s* dispatcher, not a JUMP inside the implementation.

Using `this` to reach `external` functions from inside is a smell unless you can say why (sometimes: to force the proxy path).

### 2. Free getters and the ABI

`uint256 public n` generates `n()` as `external view` returning the value. For `mapping(address => uint256) public bal`, the getter is `bal(address)`. For nested mappings, **every** key is an argument. For public arrays, the getter takes an **index**, not the whole array (you cannot return an unbounded storage array that way). You cannot hide a public getter later without changing the variable.

### 3. Mutability is an opcode constraint

| Keyword | May read storage | May write storage | May `CALL` / log / create | Opcode flavour |
|---------|------------------|-------------------|---------------------------|----------------|
| (none) | yes | yes | yes | `CALL` |
| `view` | yes | no | no (with caveats) | `STATICCALL` from outside |
| `pure` | no | no | no | `STATICCALL`; compiler also forbids reads |
| `payable` | yes | yes | yes + accept value | `CALL` with value |

`view` functions compiled as `STATICCALL` from other contracts: an `SSTORE` / `LOG` / `CALL` with value **reverts**. `pure` is a Solidity promise; the EVM does not have a separate opcode. Cheating with assembly to read storage from `pure` is undefined as far as the type system is concerned — do not.

### 4. Modifiers are inlined, not functions

```solidity
modifier nonReentrant() {
    if (locked != 0) revert Locked();
    locked = 1;
    _;
    locked = 0;
}
```

`_;` is textual substitution of the body. Stack/local allocation is shared. Two modifiers stack in source order. A modifier that makes an **external call** before `_;` is a hidden interaction — CEI reviewers will flag it (chapter **18**). Keep modifiers tiny: auth, reentrancy flag, pause.

### 5. `virtual` / `override` / function selectors

Child functions that replace parents need `override`; parents that allow it need `virtual` (0.6+). Multiple inheritance needs `override(A, B)` (chapter **13**). Changing a function’s **parameter types** changes its selector — that is a new function, not an override. Changing only the return type is not enough to make a new external function (ABI: selector ignores returns).

### 6. Return tuples and named returns

```solidity
function pair() external pure returns (uint256 a, uint256 b) {
    a = 1;
    b = 2;
    // named returns; or `return (1, 2);` — pick one style per function
}
```

Unassigned named returns are **zero**. Forgetting to set them is a silent `return (0, 0)`. The ABI encodes the tuple as consecutive words (or head/tail if dynamic).

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Thin `external` API; fat `internal` helpers |
| **Systems** | `external` + `calldata` on large inputs |
| **Security** | `onlyOwner`-class modifiers; no `tx.origin`; payable only on intended entries |
| **Operations** | ABI lists exactly the functions ops think exist |
| **Software engineering** | Modifiers < 15 lines; overloads not on the external surface |

---

## 4. Staff-level review checklist

- [ ] Every function has explicit visibility and the right mutability.
- [ ] Public/external surface is intentional (no leftover `public` debug setters).
- [ ] `payable` / `receive` / `fallback` match the ETH policy.
- [ ] Modifiers do not hide external calls or state writes that belong in the body for CEI (chapter **18**).
- [ ] No `tx.origin` in modifiers.
- [ ] Overloads on the ABI are named clearly or removed.

---

## References

- [Contracts — functions, visibility, modifiers](https://docs.soliditylang.org/en/v0.8.36/contracts.html)
- [Structure of a contract](https://docs.soliditylang.org/en/v0.8.36/structure-of-a-contract.html)
- [Cheatsheet](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [Common patterns](https://docs.soliditylang.org/en/v0.8.36/common-patterns.html)
