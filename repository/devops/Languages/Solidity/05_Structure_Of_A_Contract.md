# Structure of a contract

[← Back to Solidity](./README.md)

## What this chapter covers

The **members** of a contract: state, constructor, functions, modifiers, events, errors, and nested types. How a contract is like a class — and how it is not (no instances in RAM, no destructor you call on Tuesday). Assumes **Solidity 0.8.x** (snapshot **0.8.36**).

If chapter **00** was “a sticky note,” this chapter is “everything that can live in the box.”

---

## 1. Concepts

### 1. A contract is the deployable unit

After deploy, users talk to **functions** (and public getters). They do not “construct again.” Here is one box with the usual furniture — read it top to bottom.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Piggy {
    // --- types that live *on* the contract ---
    error NotOwner(address caller);
    event Deposited(address indexed who, uint256 amt);

    // --- state: survives after the call ---
    address public immutable owner; // set once, inlined into bytecode
    uint256 public constant FEE_BPS = 0; // true literal (0% here, just to show constant)
    uint256 public total;               // ordinary storage; anyone can read via total()

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(msg.sender);
        _; // “now run the function body”
    }

    // Runs once, at create. Arguments come from the deploy transaction.
    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        total += msg.value;          // effect: remember the wei
        emit Deposited(msg.sender, msg.value);
    }

    function sweep() external onlyOwner {
        uint256 amt = address(this).balance;
        total = 0;
        (bool ok, ) = payable(owner).call{value: amt}("");
        require(ok, "send failed");
    }
}
```

**What just happened**

| You saw | Meaning |
|---------|---------|
| `error` / `event` | How the contract *fails* and *announces* (chapter **10**) |
| `immutable owner` | Config that differs per deploy, never changes |
| `constant FEE_BPS` | A number baked into the code |
| `total` | A slot that `deposit` updates |
| `constructor` | “Who is owner?” answered once |
| `onlyOwner` | A wrapper: check, then do the body |
| `deposit` / `sweep` | The actual API |

Users never call `constructor` later. They call `deposit` and (if they are owner) `sweep`. That is the whole shape of most contracts: **set once, then a small API.**

### 2. Member map

| Member | Role |
|--------|------|
| **State variables** | Persistent storage (or `constant` / `immutable`) |
| **Constructor** | One-time initialization |
| **Functions** | Callable code (including `receive` / `fallback`) |
| **Modifiers** | Wrappers that run before/around functions |
| **Events** | Log topics for indexers |
| **Errors** | Cheap, typed revert payloads |
| **Struct / enum / type** | Nested type definitions |
| **`using A for B`** | Attach library functions to a type |

Interfaces and abstract contracts are shapes that **cannot** (or cannot fully) be deployed—chapter **13**.

### 3. `constant` vs `immutable` vs storage

| Kind | When set | Where it lives | Gas intuition |
|------|----------|----------------|---------------|
| `constant` | Compile time | Inlined into bytecode | Cheapest |
| `immutable` | Constructor | In bytecode after create | Cheap reads |
| ordinary state | Anytime a function writes | Storage slots | Expensive writes |

```solidity
uint256 public constant MAX = 100;
address public immutable owner;

constructor() {
    owner = msg.sender; // fixed for the life of this deployment
}
```

Use `immutable` for addresses and config that must differ per deploy but never change. Use `constant` for true literals.

### 4. Constructor vs initializer (preview)

A normal contract uses `constructor`. **Proxy** systems run implementation code in another address’s storage and often replace constructors with **initializer functions** (who can call them, once?). That is chapter **20**, not the default. New designs: prefer a non-upgradeable contract until you have a reason.

### 5. Visibility is part of the structure

Every function and non-constant state variable has visibility (`public`, `external`, `internal`, `private`). It is not optional decoration—chapter **08**. Defaulting everything `public` is how accidental APIs ship.

### 6. Inheritance is composition of storage and code

`contract Child is Parent` merges parents’ members into one layout. Slot order depends on inheritance order. You must understand this before you upgrade or `delegatecall` (chapters **13**, **20**). For day-one structure: **inheritance is not a Java classpath**; it is a storage-layout decision.

---

## 2. Advanced concepts

### 1. Creation bytecode vs runtime bytecode

`solc` emits two blobs:

| Blob | What it is | Where you see it |
|------|------------|------------------|
| **Creation** (`evm.bytecode`) | Init code: constructor + a copy of runtime + (on the wire) ABI constructor args | The tx `data` of a deploy |
| **Runtime** (`evm.deployedBytecode`) | What `extcodesize` / `eth_getCode` return | The account’s code |

Constructor arguments are **not** inside the compiler’s bytecode object; wallets **append** them (ABI-encoded) to creation bytecode. Explorers that verify must reconstruct that concatenation. A metadata-only mismatch is usually the CBOR tail on the *runtime* (chapter **16**).

Constructor may `return` custom runtime via assembly (rare; proxies / clones). Normal Solidity: leftover code after the constructor is the runtime.

### 2. Empty contracts and “code size”

A contract with no functions still has a dispatcher stub + metadata. The opposite problem is the **24576-byte** runtime cap (EIP-170, Spurious Dragon). Fat inherited graphs hit it; then you split contracts or use libraries (chapter **13**). `extcodesize == 0` is **not** a reliable “is this an EOA?” check (EOAs have empty code; so do contracts-in-construction; so do some accounts after `selfdestruct` brownfield).

### 3. Nested contract definitions

You can declare a contract inside another. It is still a *separate* type to deploy (or `new`). It does not share storage automatically. Prefer separate files for anything staff must review.

### 4. Receive / fallback are members too

```solidity
receive() external payable {}              // empty calldata
fallback() external payable {}             // unknown selector
fallback(bytes calldata) external payable returns (bytes memory) {}
```

If you omit them, plain ETH transfers **revert** (except forced sends — chapter **15**). A payable `fallback` that does nothing is how contracts accidentally eat ETH and tokens’ `transfer` callbacks. Knowing whether your contract can accept ETH is a structural question.

### 5. Transient state as a member (0.8.24+)

```solidity
uint256 transient lock; // lasts the transaction, not the life of the contract
```

Same “declared on the contract” feeling as storage, different location (chapter **11**). Needs a Cancun-capable `evmVersion`. Does **not** appear in the persistent storage layout JSON.

### 6. `immutable` placement

`immutable` values are written **once** in the constructor and then **inlined into runtime bytecode** (a `PUSH32` of the value, typically). They are not `SLOAD`s. Changing an immutable requires a new deploy (or a proxy that does not use immutables for that field). You cannot read another contract’s immutables via `eth_getStorageAt`.

---

## 3. Applications and use cases

| Lens | Structural habit |
|------|------------------|
| **Application** | Small surface: constructor config + few external functions |
| **Systems** | `immutable` for addresses you would otherwise SLOAD every call |
| **Security** | No leftover `initialize` on a non-proxy; no accidental `payable` fallback |
| **Operations** | Constructor args recorded in the deploy script / runbook |
| **Software engineering** | One primary contract per file; types/errors grouped on purpose |

---

## 4. Staff-level review checklist

- State that never changes after deploy is `constant` or `immutable`, not a writable slot.
- Constructor arguments are **documented** and **tested** (wrong admin address is a class of incident).
- Visibility is explicit on every function.
- Inheritance list is short enough to draw on a whiteboard, including storage order.
- ETH-acceptance policy is intentional (`receive`/`fallback` present or absent on purpose).
- No initializer-without-constructor unless an upgrade pattern is an explicit project choice.

---

## References

- [Structure of a contract](https://docs.soliditylang.org/en/v0.8.36/structure-of-a-contract.html)
- [Contracts (functions, inheritance, …)](https://docs.soliditylang.org/en/v0.8.36/contracts.html)
- [Introduction to smart contracts](https://docs.soliditylang.org/en/v0.8.36/introduction-to-smart-contracts.html)
- [Style guide](https://docs.soliditylang.org/en/v0.8.36/style-guide.html)
