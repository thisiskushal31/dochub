# Mappings, arrays, structs, and enums

[← Back to Solidity](./README.md)

## What this chapter covers

Composite data: **mappings**, **arrays**, **`bytes`/`string`**, **structs**, **enums**. How they sit in storage, what you cannot iterate, and patterns that stay gas-safe. Assumes **0.8.x** / **0.8.36**.

A mapping is a coat-check: you hand in a ticket (the key), you get a coat (the value). There is **no list of all tickets**. If you need “everyone who has a coat,” you keep your own guest list — and you accept that the guest list can get too long to walk in one transaction.

---

## 1. Concepts

### 0. A scoreboard you can actually picture

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Scoreboard {
    enum Phase {
        Signup,
        Live,
        Over
    }

    struct Player {
        uint64 points;
        bool signedUp;
    }

    Phase public phase = Phase.Signup;
    mapping(address => Player) public players;
    address[] public roster; // only if you truly need “all players”

    error WrongPhase(Phase have);
    error AlreadyIn();

    function signup() external {
        if (phase != Phase.Signup) revert WrongPhase(phase);
        Player storage p = players[msg.sender]; // alias *this* player's slot
        if (p.signedUp) revert AlreadyIn();
        p.signedUp = true;
        roster.push(msg.sender); // guest list — can grow without bound
    }

    function addPoints(address who, uint64 pts) external {
        if (phase != Phase.Live) revert WrongPhase(phase);
        players[who].points += pts; // missing key → zero-state Player, then add
    }
}
```

**What just happened**

- `players[addr]` is always “valid”: a missing player is zeros (`points == 0`, `signedUp == false`).
- You cannot `for (p in players)`. `roster` is the only way to walk names — and `signup` can make that walk expensive. Prefer events + an indexer if you only need the list *off-chain*.
- `Player storage p` is an alias (chapter **11**). `p.signedUp = true` writes the mapping.

### 1. Mappings — hash tables, not dictionaries you walk

```solidity
mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;
```

- Keys are not stored as a list. **You cannot iterate** “all keys.”
- Missing keys return **zero-state**.
- Keys cannot be `mapping`, `dynamic array`, `enum` (use underlying), or some reference types—stick to value types and `bytes`/`string`/`contract`.
- Only in **storage** (or as a storage reference).

If you need “all users,” keep an explicit `address[]` **and** accept that the array can become a DoS vector—or use off-chain indexers + events.

### 2. Arrays

| Kind | Example | Notes |
|------|---------|-------|
| Fixed | `uint256[3] three` | Length in the type |
| Dynamic storage | `uint256[] items` | `push` / `pop` |
| Dynamic memory | `new uint256[](n)` | Size fixed after create |
| `bytes` / `string` | `bytes blob` | Special-cased arrays |

```solidity
uint256[] public ids;

function add(uint256 id) external {
    ids.push(id);
}

function last() external view returns (uint256) {
    if (ids.length == 0) revert Empty();
    return ids[ids.length - 1];
}
```

Out-of-bounds access reverts. `pop` on empty reverts.

### 3. Structs

```solidity
struct Position {
    address owner;
    uint96 amount; // packing with the address in one slot? check layout
    bool active;
}

mapping(uint256 => Position) public positions;
```

Structs group fields. In storage they pack like consecutive state variables. In memory they do not pack the same way. Do not assume memory layout equals storage layout.

### 4. Enums

```solidity
enum Status {
    None,
    Open,
    Settled
}

Status public status;
```

Enums are uints underneath (0, 1, 2, …). Casting a raw integer that is out of range **reverts** in 0.8. Use enums for modes; do not use them as a substitute for a full state machine without events.

### 5. Iterable mapping pattern (when you truly need it)

```solidity
address[] public holders;
mapping(address => bool) public seen;

function _addHolder(address a) internal {
    if (!seen[a]) {
        seen[a] = true;
        holders.push(a);
    }
}
```

This is honest: you pay for the array. It is not “mapping grew a `.keys()`.” Chapter **09** still applies—do not loop the whole array in one user-paid tx if it can grow without bound.

---

## 2. Advanced concepts

### 1. Mapping slots — the real formula

State variables get slots in declaration order (chapter **11**). A mapping *declaration* occupies **one slot `p`** that stores nothing useful; values live at derived slots:

```text
mapping(K => V) at slot p:
  slot(value) = keccak256(h(key) . p)     // 32-byte key encoding, then 32-byte slot, keccak

nested mapping(K1 => mapping(K2 => V)):
  slot(inner)  = keccak256(h(k1) . p)
  slot(value)  = keccak256(h(k2) . slot(inner))
```

`h(key)` is the 32-byte ABI-style encoding of the key (`address` left-padded, `bytes`/`string` hashed first — see the layout-in-storage spec). Off-chain: `cast index address <key> <p>`. You hand-roll this for slot tests and assembly (chapter **21**).

**Key encoding (`h(k)`) — be exact:**

| Key type | `h(k)` |
|----------|--------|
| `uint*` / `int*` / `bytesN` / `address` / `bool` | padded to 32 bytes like ABI |
| `string` / `bytes` | `keccak256(raw content)` — **not** ABI-encoded with length |
| contract type | as `address` |

Worked sketch: `mapping(address => uint256) bal` at slot `0`, key `0xA11CE…`:

```text
mstore(0x00, left_pad_32(0xA11CE…))
mstore(0x20, 0x00…00)                 // slot p = 0
slot = keccak256(0x00..0x3f)
```

Then `sload(slot)` is the balance. If `cast storage` disagrees with `bal(addr)`, your padding or endianness is wrong.

### 2. Dynamic array slots

A `T[]` at slot `p` stores **length** at `p`. Element `i` starts at:

```text
slot(elem i) = keccak256(p) + i     // then pack if T is smaller than 32 bytes
```

Fixed-size `T[k]` is just `k` consecutive packed items starting at `p` — no keccak, no length word.

**Packed dynamic arrays:** for `uint24[]` at slot `p`, element `j` is not always `keccak256(p)+j`. Elements share slots: `floor(256/24) = 10` values per slot. Official formula idea:

```text
base = keccak256(p)
slot = base + floor(j / 10)
shift = (j % 10) * 24 bits
value = (sload(slot) >> shift) & mask24
```

Nested `uint24[][]`: apply keccak again for the outer index, then the packed rule for the inner. If you are writing slot tests for packed arrays, prefer `forge inspect` / storage layout JSON over hand arithmetic until you have a golden fixture.

**`push` / `pop`:** `push` increments length at `p` and writes the new element slot(s). `pop` decrements length and zeros the removed element’s bits (important for packed arrays — do not leave dirty bits). Out-of-bounds `pop` → Panic `0x31`.

### 3. Short `bytes` / `string` (the dirty-slot trick)

If `data.length < 32`, Solidity stores `length * 2` in the **low byte** of slot `p` and the bytes in the higher part of the same slot. If `length >= 32`, slot `p` stores `length * 2 + 1` and the data lives at `keccak256(p)` like a `bytes` array.

The low bit of the slot is therefore a **flag**: even = short, odd = long. Assembly that treats every `string` slot as a pointer is wrong. `0x22` Panic = “this storage byte array encoding is corrupt.”

Worked short string `"hi"` (length 2) in slot `p`:

```text
// low byte = 2 * 2 = 4 (even → short)
// data sits in the high bytes of the same word
slot_p ≈ 0x6869000…0004
```

Long string: low bit set, length encoded as `2*len+1`, payload at `keccak256(p)`, `keccak256(p)+1`, …

### 4. Nested mappings and allowances

`allowance[owner][spender]` is the ERC-20 shape. Clearing means write `0`. There is no “delete all spenders.” A third nesting (`operatorApprovals[owner][operator][id]`) is another keccak layer — same formula, one more hash.

### 5. Array gaps after `delete`

`delete ids[i]` zeros that index; **length stays**. Swap-and-pop if you need to remove:

```solidity
ids[i] = ids[ids.length - 1];
ids.pop();
```

Order changes. Document that. For structs-of-arrays, swap-and-pop every parallel array or you desync indices.

### 6. `bytes` vs `bytes32[]`

Lots of hashes? `bytes32[]` or a mapping. One blob? `bytes`. A `string` you never parse on-chain is often better as `bytes32` content hash + URI off-chain.

### 7. Structs in calldata vs memory packing

`external` functions can take `MyStruct calldata s` — no copy. Changing a field requires a `memory` copy.

**Memory structs do not pack** the way storage structs do: each value type typically occupies a full 32-byte memory word. `uint128` + `uint128` that shared a storage slot become two words in memory. Assembly that `mload`s a memory struct as if it were storage layout is a classic bug.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Mapping for “key → record”; events for enumeration off-chain |
| **Systems** | Avoid unbounded arrays in hot functions |
| **Security** | Zero default means “missing” — do not treat `0` as a valid ID if 0 is also a real id |
| **Operations** | Indexers listen to events, not storage walks |
| **Software engineering** | Structs named; enums exhaustive in `if`/`revert` |

---

## 4. Staff-level review checklist

- [ ] No code assumes it can list mapping keys without an auxiliary structure.
- [ ] User-grown arrays are not processed in one unbounded loop.
- [ ] Removal semantics (swap-and-pop vs gap) are documented and tested.
- [ ] Enum transitions are explicit; invalid raw casts cannot be forced.
- [ ] Packing in structs is intentional (names + comment or a layout test).

---

## References

- [Types — reference types](https://docs.soliditylang.org/en/v0.8.36/types.html#reference-types)
- [Layout in storage](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_storage.html)
- [Cheatsheet](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [Common patterns](https://docs.soliditylang.org/en/v0.8.36/common-patterns.html)
