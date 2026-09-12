# Events, custom errors, and NatSpec

[← Back to Solidity](./README.md)

## What this chapter covers

How contracts **talk outward**: **events** (logs), **custom errors** (revert data), and **NatSpec** (human/machine docs). Assumes **0.8.x** / **0.8.36**.

Storage is the truth the EVM keeps. **Events** are how you tell indexers and UIs that the truth changed. **Errors** are how you tell the caller *why* you refused. **NatSpec** is the man page wallets can show a human. Three channels, three jobs.

---

## 1. Concepts

### 0. One function that uses all three

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

/// @title Tip jar
/// @notice Anyone may tip the owner. Only the owner may empty it.
contract TipJar {
    address public immutable owner;

    error NotOwner(address caller);
    error EmptyJar();

    event Tipped(address indexed from, uint256 amount);
    event Emptied(uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Send ETH to the jar.
    function tip() external payable {
        if (msg.value == 0) revert EmptyJar(); // a dedicated ZeroTip error reads better in a real API
        emit Tipped(msg.sender, msg.value);
    }

    /// @notice Send the whole balance to the owner.
    function empty() external {
        if (msg.sender != owner) revert NotOwner(msg.sender);
        uint256 amt = address(this).balance;
        if (amt == 0) revert EmptyJar();
        emit Emptied(amt);
        (bool ok, ) = payable(owner).call{value: amt}("");
        require(ok, "send failed");
    }
}
```

**What just happened**

- A successful `tip` leaves no mystery: the `Tipped` log is what a dashboard filters on. The contract’s ETH balance went up; the event is how *people* notice.
- A stranger calling `empty` does not get a silent failure. They get `NotOwner(0xTheirAddress)`.
- `@notice` is what you want a wallet to show. `@dev` (not used here) is for the next engineer.

### 1. Events are logs, not storage

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);

function _move(address from, address to, uint256 amount) internal {
    // ... storage updates ...
    emit Transfer(from, to, amount);
}
```

An **event** writes to the transaction **receipt log**. Off-chain indexers (explorers, subgraphs, your backend) filter them. They are **not** readable from other contracts as a query API (except via specialized log-reading that contracts normally do not do).

| Piece | Role |
|-------|------|
| `indexed` (up to 3) | Topic — cheap to filter |
| Non-indexed args | Data blob — ABI-decoded by indexers |
| `emit` | Actually write the log |

If a state change matters to operators or users, **emit it**. Storage-only changes are invisible until someone traces the tx.

### 2. What to index

Index **addresses and discrete IDs** you will filter on. Do not index huge dynamic types expecting magic. `string indexed` hashes the content (you cannot recover the string from the topic). Prefer `address indexed` + `uint256` data.

### 3. Custom errors (again, as an API)

```solidity
/// @notice Caller is not the assigned operator.
error NotOperator(address caller);

function poke() external {
    if (msg.sender != operator) revert NotOperator(msg.sender);
}
```

Errors are part of the ABI. Clients and `cast` can decode them. Treat them like events for **failure**: stable names, useful fields, NatSpec.

Do not change error layouts casually—dashboards and tests bind to selectors.

### 4. NatSpec is the contract’s man page

```solidity
/// @title Minimal vault
/// @notice Holds ETH for a single owner. Not a general bank.
/// @dev Constructor sets owner to deployer.
contract MiniVault {
    /// @notice Withdraw the entire balance to the owner.
    /// @dev Reverts if caller is not owner.
    function withdraw() external { /* ... */ }
}
```

Tags you will actually use:

| Tag | Where |
|-----|--------|
| `@title` / `@author` | Contract |
| `@notice` | User-facing |
| `@dev` | Implementer notes |
| `@param` / `@return` | Functions |
| `@inheritdoc` | Overrides |

Wallets and explorers surface `@notice`. If you write nothing, they surface nothing.

`solc` can emit a userdoc/devdoc JSON. That is how some doc sites are built.

### 5. Events vs errors vs return values

| Channel | When |
|---------|------|
| **Return value** | Same-tx caller needs the result |
| **Event** | Off-chain observers need the fact |
| **Error** | The call must not proceed |

Do not emit `Success(true)` instead of returning. Do not revert without an error if a wallet should explain why.

---

## 2. Advanced concepts

### 1. How a log is actually laid out

`emit Transfer(from, to, amt)` with `from`/`to` indexed becomes an EVM `LOG3` (3 topics + data):

| Piece | Value |
|-------|--------|
| **address** | `address(this)` — the contract that emitted |
| **topic0** | `keccak256("Transfer(address,address,uint256)")` — full 32 bytes, not 4 |
| **topic1** | `from` left-padded to 32 bytes |
| **topic2** | `to` left-padded |
| **data** | ABI-encoded non-indexed args (`amt` as a 32-byte word) |

Rules that bite:

- Max **4 topics** including topic0 → at most **3** `indexed` fields (4 if `anonymous`, which has no topic0).
- `indexed` **dynamic** types (`string`, `bytes`, arrays) put `keccak256(value)` in the topic, **not** the value. You cannot recover the string from the topic.
- Non-indexed dynamics go in `data` with the usual ABI head/tail (chapter **14**).
- Indexers filter on address + topics. If you did not `indexed` the field ops query, they scan `data` (slow, expensive).

### 2. Anonymous events

`event Foo(...) anonymous;` has no topic-0 signature. You can index four fields. Filters cannot key off the event identity. Rarely what you want.

### 3. Gas of `emit`

`LOG0`…`LOG4` cost roughly: base + per topic + per byte of data (schedule-dependent). More indexed fields → higher topic count → higher gas, but cheaper / faster **filters** for indexers. Logging inside a hot loop is a gas weapon. Batch with a summary event if the per-item log is not required for accounting.

`emit` is not a storage write: logs are not accessible to contracts in later calls (no `SLOAD` of logs). Only off-chain consumers see them. That is why “emit then expect another contract to react in the same tx” does not work without an actual `CALL`.

### 4. Sensitive data in logs

Logs are **public forever** (and cheaper than storage, so people over-log). Do not emit PII, seed material, or “secret” codes. `private` state that you `emit` is not private. Bloom filters make *search* easier, not *hiding* possible.

### 5. Error selectors and revert data

```text
revert TooMuch(have, cap);
// returndata = selector (4) || abi.encode(have, cap)
// selector   = bytes4(keccak256("TooMuch(uint256,uint256)"))
```

Wallets that only know `Error(string)` show a hex blob for custom errors unless they have your ABI. Publish errors in the ABI JSON. Two errors with the same signature string collide like functions.

`require(cond, "msg")` is `Error(string)` (`0x08c379a0`). Prefer custom errors for the public surface.

### 6. NatSpec inheritance and JSON

`@inheritdoc` pulls parent docs. If you change behavior, rewrite `@notice` — inherited lies are worse than no docs. `solc` can emit a NatSpec JSON (`userdoc` / `devdoc`) next to the ABI; that is what some explorers show. It is not enforced at runtime.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Every value-moving path emits a stable event |
| **Systems** | Indexed fields match what ops actually query |
| **Security** | No secrets in logs; errors do not leak unexpected internals (but do not hide auth failures either) |
| **Operations** | Monitors subscribe to events; runbooks name them |
| **Software engineering** | NatSpec required on `external` functions in review |

---

## 4. Staff-level review checklist

- State changes that matter off-chain have **events**.
- `indexed` fields match filter needs (addresses/IDs).
- Custom errors are stable and documented.
- `external`/`public` functions have `@notice` at minimum.
- No PII or secrets in events.
- Tests assert events (`expectEmit`) on critical paths.

---

## References

- [Contracts — events](https://docs.soliditylang.org/en/v0.8.36/contracts.html#events)
- [NatSpec format](https://docs.soliditylang.org/en/v0.8.36/natspec-format.html)
- [Control structures — errors](https://docs.soliditylang.org/en/v0.8.36/control-structures.html)
- [ABI specification (events and errors)](https://docs.soliditylang.org/en/v0.8.36/abi-spec.html)
- [Style guide](https://docs.soliditylang.org/en/v0.8.36/style-guide.html)
