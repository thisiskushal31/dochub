# Data locations: storage, memory, calldata, transient

[← Back to Solidity](./README.md)

## What this chapter covers

Where data **lives** for the duration of a call or a transaction: **storage**, **memory**, **calldata**, and **transient** (Cancun / **0.8.24+**). Alias rules, gas intuition, and why `private` is not confidentiality. Snapshot **0.8.36**.

If types (chapter **06**) are *what* a value is, locations are *where the sticky note is stuck*. Put the note on the wrong surface and you will think you edited the original when you only doodled on a photocopy.

---

## 1. Concepts

### 1. Four surfaces (one kitchen picture)

| Location | Kitchen picture | Lifetime | Typical use |
|----------|-----------------|----------|-------------|
| **storage** | Writing on the wall | Forever (until overwritten) | Contract state |
| **memory** | Scratch paper for this order | One message call | Temporary structs/arrays |
| **calldata** | The ticket the waiter handed you | One call’s input | `external` function args |
| **transient** | A sticky flag on the pass for *this ticket only* | One **transaction** (all subcalls) | Reentrancy locks |

Reference types **must** name a location. Value types in local variables live on the stack (you do not write `uint256 memory x`).

### 2. Watch alias vs copy in one contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Locations {
    uint256[] public items; // storage

    constructor() {
        items.push(10);
        items.push(20);
    }

    // `calldata` = read the caller's array from the input tape (no copy yet).
    function sum(uint256[] calldata xs) external pure returns (uint256 s) {
        for (uint256 i = 0; i < xs.length; ++i) {
            s += xs[i];
        }
    }

    function messWithCopy() external view returns (uint256 firstStorage) {
        uint256[] memory copy = items; // PHOTOCOPY into memory
        copy[0] = 999;                 // doodle on the photocopy
        firstStorage = items[0];       // still 10
    }

    function messWithAlias() external returns (uint256 firstStorage) {
        uint256[] storage ref = items; // same wall
        ref[0] = 999;                  // the wall changed
        firstStorage = items[0];       // 999
    }
}
```

**What just happened**

- `sum` never touches storage. `calldata` is the cheapest way to *read* a caller-supplied list.
- `messWithCopy`: `memory` is a copy. Changing `copy[0]` does not change `items`.
- `messWithAlias`: `storage ref` **is** `items`. Changing `ref[0]` changes the contract forever.

Getting `storage` vs `memory` wrong is the classic “I thought I had a copy” bug. When you see `uint256[] storage`, ask: *did we mean to alias the wall?*

### 3. Storage is the database

State variables are storage. Writes (`SSTORE`) dominate gas. Reads (`SLOAD`) are cheaper than writes, still not free.

```solidity
uint256 public total; // slot 0 if it is the first variable

function add(uint256 x) external {
    total += x; // SLOAD + checked add + SSTORE
}
```

### 4. Transient is per-transaction scratch (0.8.24+)

```solidity
error Locked();

uint256 transient locked; // not a permanent slot

modifier nonReentrant() {
    if (locked == 1) revert Locked();
    locked = 1;
    _;
    locked = 0;
}
```

Transient uses `TSTORE`/`TLOAD`. It **clears at the end of the transaction**, not at the end of one call — so later calls in the *same* tx (including callees) can see it. That is what you want for a reentrancy lock.

Needs an EVM version with those opcodes (**cancun** or later) and a chain that activated them.

A `bool` in **memory** cannot lock against a callee: they do not share your scratch paper. A `bool` in **storage** works on older forks and costs an SSTORE.

### 5. `private` does not hide storage

Anyone can `eth_getStorageAt`. `private` only stops other Solidity contracts from reading the **name**. Secrets do not belong in any of the four locations. Encryption with a key that is also on-chain is theater.

---

## 2. Advanced concepts

### 1. Assignment rules (alias vs copy)

| From → To | Behavior |
|-----------|----------|
| storage → local `storage` | **Reference** (alias) |
| storage → `memory` | **Copy** |
| `memory` → `memory` | Reference (same memory region) |
| `calldata` → `memory` | Copy |
| `memory` → storage | Copy into slots |
| `calldata` → local `calldata` | Reference into the input tape |

If two `storage` references alias, writes collide. Draw it when reviewing nested structs.

### 2. Packing rules (the actual ones)

For **value types** (not mappings / dynamic arrays):

1. Slots are 32 bytes. The first item in a slot is **lower-order aligned** (low bytes of the word).
2. A value occupies only as many bytes as its type needs (`uint128` → 16, `bool` → 1, `address` → 20, `bytes4` → 4).
3. If the next item does not fit the *remaining* bytes, it starts a **new** slot.
4. **Structs and array data always start a new slot**; their *internals* pack. Whatever follows a struct/array also starts a new slot.
5. Inheritance: C3 linearization, most base-ward first. Parent and child variables **may share a slot** if they fit.

```solidity
uint128 a; // slot 0, bytes 0–15
uint128 b; // slot 0, bytes 16–31  — packed
uint256 c; // slot 1               — does not fit remainder
```

**Worked word (lower-order aligned):** if `a = 0x11…1` (16 bytes of `0x11`) and `b = 0x22…2`, slot 0 reads as:

```text
0x2222222222222222222222222222222211111111111111111111111111111111
   \_______________ b (high 16) ______________/\_________ a (low 16) _________/
```

To write only `a` without clobbering `b`, the compiler (or your assembly) must `SLOAD`, mask, `OR`, `SSTORE`. That is why packing **helps** when fields change together and **hurts** when one packed field is written alone in a hot loop.

```solidity
struct S { uint128 x; uint64 y; uint64 z; } // one slot if alone
// vs
struct T { uint128 x; uint256 y; uint128 z; } // three slots — y breaks the pack
```

Official guidance: order members `uint128, uint128, uint256` not `uint128, uint256, uint128`.

Changing declaration **order** changes layout. That breaks proxies and `cast storage` notes. Freeze layout once you ship.

`constant` is not a slot. `immutable` is not a slot (baked into bytecode). `transient` uses the **same numbering rules** on a *separate* map — a `uint256 transient x` does not occupy persistent slot 0. Mappings and dynamic arrays each reserve a full slot for their base `p` even though the slot’s *contents* are empty (mappings) or a length (arrays) — they never share that slot with a neighbor.

### 3. Transient semantics (EIP-1153)

- Opcodes `TSTORE` / `TLOAD` — cheaper than a cold `SSTORE`.
- Visible to later calls in the **same transaction** (including callees) — that is why a transient lock works.
- **Reverted** if the call that wrote it reverts (same as storage).
- **Discarded** at the end of the transaction.
- Only **value types** (no transient mappings/arrays).
- Needs `evmVersion >= cancun` and a Cancun-capable chain.

A `bool` in **memory** cannot lock against a callee. A storage lock works on older forks and costs an SSTORE.

### 4. Memory layout (why assembly keeps breaking)

Solidity memory is a byte array. Conventionally:

| Region | Role |
|--------|------|
| `0x00`–`0x3f` | Scratch (hashing, etc.) |
| `0x40`–`0x5f` | **Free-memory pointer** |
| `0x60`–`0x7f` | Zero slot (the “empty” array/string) |
| `0x80` onward | Allocated objects |

Dynamic arrays / `bytes` / `string` in memory are typically `length` at `p`, data at `p+0x20`. Allocating without updating `mload(0x40)` is how assembly corrupts the next `abi.encode` (chapter **21**). Memory expansion is gas: you pay for the highest word touched.

### 4b. Calldata layout (external args)

For an `external` function, Solidity often leaves dynamic arguments in **calldata** (no copy). Offsets in the ABI head are relative to the start of the *arguments* region (after the 4-byte selector). Reading `calldataload(4)` is the first head word. Assembly that parses calldata must match chapter **14** or it will read the wrong word — especially for nested dynamics (`string[]`, tuples).

`calldata` slices (`bytes calldata b`) are `(offset, length)` pairs into the input tape — cheap to pass around, immutable.

### 5. `delete` and gas

`delete x` writes zero-state. For mappings, one key. For dynamic arrays, length → 0 (do not assume old element slots are magically cheap). Zeroing a previously non-zero slot may refund some gas under the current schedule; **do not design economics around refunds** — they change.

### 6. Custom storage layouts (0.8.29+)

`contract C is A, B layout at 42` shifts the whole linearized layout by a base slot (ERC-7201-adjacent). Namespaced storage for proxies belongs here, not as a first-project flourish. Test the slot of `owner` before you ship an upgrade.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | `calldata` in, `memory` for building returns, storage for truth |
| **Systems** | Minimize SSTORE; consider transient locks on Cancun |
| **Security** | No secrets in any location; understand aliasing |
| **Operations** | Slot layout documented if anyone reads storage raw |
| **Software engineering** | Location keywords explicit; no “it compiled” shrugs |

---

## 4. Staff-level review checklist

- [ ] Dynamic `external` params use `calldata` unless a write/resize is required.
- [ ] Storage references are intentional aliases, not accidents.
- [ ] Transient features gated on **evmVersion + chain** support.
- [ ] Layout order is stable if proxies or slot tooling exist.
- [ ] Comments never claim `private` storage is confidential.
- [ ] Reentrancy locks are storage or transient — not a memory bool.

---

## References

- [Data location and assignment behaviour](https://docs.soliditylang.org/en/v0.8.36/types.html#data-location)
- [Layout in storage](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_storage.html)
- [Layout in memory](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_memory.html)
- [Layout of calldata](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_calldata.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Ethereum: contract anatomy](https://ethereum.org/developers/docs/smart-contracts/anatomy/)
- [EIP-1153 (transient storage)](https://eips.ethereum.org/EIPS/eip-1153)
