# Events and NatSpec

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper contracts **speak outward**: **events** (EVM logs) and **NatSpec** (human- and tool-facing documentation). Assumes **Vyper 0.4.x** (pin **0.4.3**).

Storage is what the chain keeps. Events are what indexers, explorers, and UIs notice. NatSpec is the man page wallets and auditors read. Neither replaces the other.

For shared EVM log mental model and client decode habits, cross-link the [Solidity](../Solidity/README.md) events/NatSpec chapters when needed—Vyper’s surface is `event` / `log` and docstring tags below. ABI packaging of events is chapter **[12](./12_Compiling_Deploying_And_ABI.md)**; asserting them in tests is chapter **[13](./13_Testing_Contracts.md)**.

---

## 1. Concepts

### 1. Events are logs, not storage

```vyper
#pragma version ^0.4.0

event Payment:
    sender: indexed(address)
    amount: uint256

total_paid: uint256

@external
@payable
def pay():
    self.total_paid += msg.value
    log Payment(msg.sender, msg.value)
```

An event writes to the transaction **receipt**. Off-chain systems filter topics and decode data. Other contracts generally **cannot** “read your events” as an API—if another contract must react, use a call or shared state, not a log.

| Piece | Role |
|-------|------|
| `indexed(...)` | Topic — cheap to filter |
| Non-indexed fields | Data blob — ABI-decoded by indexers |
| `log EventName(...)` | Emit the log |

If a state change matters to operators or users, **log it**. Silent storage updates force everyone to trace calldata.

### 2. Declaring and indexing

Event declarations look like structs:

```vyper
event Transfer:
    sender: indexed(address)
    receiver: indexed(address)
    value: uint256

event Heartbeat:
    pass
```

Rules of thumb:

- Index **addresses and discrete IDs** you will filter on.
- Keep non-indexed payloads for amounts, flags, and blobs you decode in full.
- Topic count is bounded by the EVM (`LOG0`–`LOG4`); named events also reserve a topic for the event signature. Do not invent “index everything.”
- Dynamic types as indexed fields hash in ways that are awkward to recover—prefer addresses/`bytes32` IDs for topics.

Argument **order and types** in `log` must match the declaration. Renaming fields casually breaks indexers and tests.

### 3. Logging is part of the external API

Treat event names and layouts like ABI stability:

- Dashboards, subgraphs, and Titanoboa tests bind to them.
- Changing an indexed field or reordering args is a **breaking** client change.
- Emit **after** the meaningful state transition is decided (or document why not).

Events consume **gas for LOG opcodes**; they do not occupy contract storage. That is why they are good for notifications—and why spam-logging still hurts users.

### 4. NatSpec is the contract’s man page

Vyper supports Ethereum Natural Specification Format tags in docstrings (triple-quoted strings on contracts and functions). Typical tags:

| Tag | Audience |
|-----|----------|
| `@title` / `@author` | Contract identity |
| `@notice` | User-facing behavior |
| `@dev` | Implementer notes |
| `@param` / `@return` | Function arguments and results |
| `@custom:...` | Project-specific extensions when tools agree |

```vyper
"""
@title Tip jar
@notice Anyone may tip. Only the owner may empty.
@dev Owner set at deploy.
"""

owner: public(address)

@deploy
def __init__():
    self.owner = msg.sender

@external
@payable
def tip():
    """
    @notice Send ETH to the jar.
    """
    pass
```

`@notice` is what you want a wallet or explorer to surface. `@dev` is for the next engineer. Keep them honest: NatSpec that disagrees with code is worse than silence.

### 5. Events + NatSpec together

A mature external surface has:

1. **ABI functions** (chapters **[08](./08_Functions_Visibility_And_Mutability.md)** / **12**),
2. **Events** for observable success paths,
3. **NatSpec** that explains intent and failure expectations.

Reviewers read all three. Clients decode logs using the ABI’s event section—keep the compiler artifact and the docstring story aligned.

---

## 2. Advanced concepts

### 1. What not to put in events

| Temptation | Prefer |
|------------|--------|
| Secrets or auth material | Never—logs are public |
| Full storage dumps every tx | Emit deltas that operators need |
| Indexed huge strings | Index an ID; put text in data or off-chain |
| Events instead of access control | Auth is code; logs are narration |
| PII | Off-chain systems with policy—not chain logs |

### 2. Compatibility with ecosystem expectations

Token and vault ecosystems often expect **canonical event shapes** (for example ERC-20 `Transfer` / `Approval`). If you claim a standard, match the event layout clients already decode. Custom names for standard actions force every integrator to special-case you.

### 3. Anonymous-style and raw logging

Most application code should use declared `event` + `log`. Low-level `raw_log` (chapter **[09](./09_Built_In_Functions.md)**) is a specialist tool when you must control topics/data explicitly—document why. Prefer the high-level form for auditability.

### 4. Testing events

Titanoboa tests (chapter **13**) should assert **storage and events** for state-changing paths. An event assertion is how you lock the indexer contract. Brownie brownfield suites often do the same with their event helpers—keep the habit when you inherit those repos.

### 5. Version and toolchain notes

Pin **0.4.x** so event ABI JSON matches what clients generate against. Compiler upgrades can change metadata packaging; treat “same source, new compiler” as a release that needs client regression on log decode. Record EVM target (**prague** default on **0.4.3**) with the ABI publish step.

### 6. Admin and ops events

Privileged actions deserve first-class events: ownership transfer, pause/unpause, parameter changes, allowlist edits. If on-call cannot filter “something admin happened,” the incident will start with full-node archaeology.

### 7. NatSpec honesty checks

Reviewers should flag:

- `@notice` that claims “non-custodial” while an admin can seize,
- mutability docs that disagree with decorators,
- missing `@param` on complex externals that wallets surface,
- copy-pasted NatSpec from another protocol.

NatSpec is part of the security review surface when users rely on it.

---

## 3. Applications and use cases

| Role | “Done” looks like |
|------|-------------------|
| **Protocol engineer** | Every user-visible state change has a stable event |
| **Indexer / client engineer** | ABI events match subgraph handlers; NatSpec matches UX copy |
| **Security reviewer** | Sensitive flows leave an auditable trail; no secret-in-log |
| **Ops** | Alerts can filter on indexed fields without full-node archaeology |
| **Auditor** | NatSpec does not overclaim decentralization or safety |

**Smell:** critical admin actions with no events. The chain knows; your on-call does not.

**Smell:** event renamed in a “tiny refactor” without a client migration note.

---

## 4. Staff-level review checklist

- State changes that matter to users or ops emit events.
- Indexed fields are the ones filters actually use.
- Event layouts are treated as breaking API when changed.
- No secrets or raw authorization material in logs.
- NatSpec `@notice` / `@dev` match real behavior and mutability.
- Token/standard claims use expected event shapes.
- Tests assert key events, not only return values.
- ABI artifact published with the same compiler pin as deploy (**12**).
- Admin/parameter paths have dedicated events for monitoring.
- `raw_log` usage is justified or replaced with declared events.

---

## References

- [Event logging (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/event-logging.html)
- [NatSpec metadata (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/natspec.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
