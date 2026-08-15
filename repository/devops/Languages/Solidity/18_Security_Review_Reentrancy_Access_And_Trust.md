# Security review: reentrancy, access, and trust

[← Back to Solidity](./README.md)

## What this chapter covers

How to **review** Solidity systems: trust boundaries, **access control**, **reentrancy**, signatures, oracles, and upgrade assumptions. This is **defense and review literacy**. It does not teach how to attack live protocols or assemble exploit kits. Assumes **0.8.x** / **0.8.36**.

The useful question is not “could a genius break this?” It is: **who is allowed to do this, what do we update first, and what do we believe about the outside world?** If you can answer those three in a PR comment, you are already reviewing.

---

## 1. Concepts

### 1. The caller is not your friend

Anyone can call a `public`/`external` function with any calldata. There is no session cookie. **Authorization is code you wrote** (`msg.sender`, signatures, roles)—or it is absent.

Review question one: **who is allowed to do this, and what happens if they are not?**

### 2. Trust boundaries (write them down)

| Input | Typical trust |
|-------|----------------|
| `msg.sender` | Whoever holds that key or controlling contract |
| Token address passed by user | **Untrusted** unless allowlisted |
| Oracle price | The oracle’s honesty + liveness |
| `block.timestamp` / `prevrandao` | Producer influence; not RNG |
| Admin / owner | Operational key compromise = protocol compromise |
| Upgrade admin | Can change code — treat as root |

If a design needs an honest admin, say so. “Decentralized” and “one EOA owner” cannot both be the story.

### 3. Access control

```solidity
error NotOwner();

modifier onlyOwner() {
    if (msg.sender != owner) revert NotOwner();
    _;
}
```

Rules:

- authenticate with **`msg.sender`**, never `tx.origin`,
- prefer **roles** (admin vs pauser vs minter) over one god key when duties split,
- two-step ownership transfer (propose + accept) so a typo does not brick admin,
- use a maintained library (OZ `Ownable` / `AccessControl`) rather than a half-remembered snippet.

`private` functions are not an access-control strategy (chapter **11**).

### 4. Checks → effects → interactions (CEI)

Do **validation**, then **update your storage**, then **talk to another contract** (ETH `call`, token `transfer`, hook).

```solidity
function withdraw(uint256 amt) external {
    if (amt > balances[msg.sender]) revert TooMuch(); // check
    balances[msg.sender] -= amt;                      // effect
    (bool ok, ) = msg.sender.call{value: amt}("");    // interaction
    if (!ok) revert SendFailed();
}
```

If you interact first and update later, a callee may call back into you and observe **stale** balances. That class of bug is **reentrancy**. You do not need a novel to review it: **search for external calls in the middle of state updates.**

The *wrong* order looks like this (do not ship this). Notice the send happens while `balances` still says the user is rich:

```solidity
function withdrawWrong(uint256 amt) external {
    if (amt > balances[msg.sender]) revert TooMuch();
    (bool ok, ) = msg.sender.call{value: amt}(""); // interaction too early
    if (!ok) revert SendFailed();
    balances[msg.sender] -= amt; // effect too late
}
```

You do not need a second “attacker” contract to review this. You need to see that `call` runs *someone else’s code* before your books are updated. Fix: swap the last two steps (or use the full `PiggyPull` in chapter **15**).

Add a **reentrancy lock** (storage or transient, chapter **11**) when you must interact before all effects are finished, or when multiple functions share state the callee can re-enter. Locks are a belt; CEI is the trousers.

Read-only reentrancy (a `view` function used by another protocol while your state is mid-update) is the same review habit: **views must be safe mid-call or you must not expose inconsistent state.**

### 5. Pull over push (again)

Sending ETH or tokens to an unknown recipient can fail or callback. Credit-then-withdraw keeps your accounting consistent (chapter **15**).

### 6. Signatures

Off-chain approvals (permits, listings, meta-tx) need:

- **EIP-712** typed data + **domain separator** (`name`, `version`, `chainId`, `verifyingContract`),
- **nonce** (no replay),
- reject `ecrecover == address(0)`,
- a deadline if the intent is time-bounded.

A raw `keccak256(abi.encodePacked(who, amt))` signed blob is how replays and ambiguous encodings happen. Do not invent a signature scheme in a weekend.

### 7. What “random” and “price” are not

- `keccak256(abi.encode(block.prevrandao, msg.sender))` is **not** secure randomness for money.
- A single spot price from an AMM is **not** a manipulation-resistant oracle.

If funds depend on these, the design is incomplete. Use a dedicated randomness/oracle assumption and write it in the threat model.

---

## 2. Advanced concepts

### 1. Reentrancy, named precisely

Reentrancy is “callee runs *your* `external`/`public` function again before the first invocation finished.” Cross-function: they hit `withdraw` from inside `transfer`. Cross-contract: they hit a sibling that still trusts the old state. Read-only reentrancy: they hit a `view` that still reports pre-update numbers while a pair is mid-update — oracles and lending LTVs care.

**Defense that is actually a defense:**

1. **CEI** — write storage *before* any `CALL`.
2. **Lock** — `nonReentrant` (storage or transient) on the value-moving surface.
3. **Pull** — do not `CALL` an unknown recipient in a loop.
4. **Do not treat 2300 gas as a lock** (chapter **15**).

A lock that is applied to `withdraw` but not to `transfer` / `sweep` is a finding. A lock on a `view` is usually useless (and `view` + lock that writes is not `view`).

### 1b. CEI as a state machine (why “effects first” is not optional)

```text
checks:   require auth, amounts, pause
effects:  balances[x] = …; total = …;   // storage is the truth
interact: token.transfer / call{value}  // someone else’s code may run
```

Any storage read that a callee can observe (including via a `view` you expose) must already be consistent after `effects`. If you update `reserve0` then call a hook before updating `reserve1`, a read-only reentrant caller sees a torn pair. Fix patterns: lock around the whole update, or update all related slots before the external call, or make mid-update views revert (`require(!locked)`).

### 2. `delegatecall` and proxies

Untrusted `delegatecall` = untrusted storage writes. Recurring incident class: **implementation** left uninitialized so anyone can call `initialize` and become owner, then `upgradeTo` / `selfdestruct` (brownfield) the logic. If you use proxies you own: layout freeze, initializer access (`_disableInitializers` on the impl), admin key, and an upgrade runbook (chapter **20**). Default new systems to **non-upgradeable**.

### 3. Signature review (what “EIP-712” actually binds)

A useful signed message binds **all** of:

- **domain**: `name`, `version`, `chainId`, `verifyingContract` (and optionally `salt`),
- **struct hash** of the *action* (to, amount, deadline, …),
- **nonce** (or bitmap) so it cannot be replayed,
- **deadline**.

Digest construction (literacy):

```text
domainSeparator = keccak256(abi.encode(
  TYPEHASH_DOMAIN, nameHash, versionHash, chainId, verifyingContract))
structHash      = keccak256(abi.encode(TYPEHASH_ACTION, …fields…))
digest          = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash))
signer          = ecrecover(digest, v, r, s)  // check ≠ 0
```

`ecrecover` on a raw `keccak256(abi.encodePacked(to, amt))` binds none of that. Reject high-`s` malleability if you are not using a library that already does. `permit` / `permit2` are the same review with token-shaped fields.

### 4. Approval hazards (tokens)

Infinite `approve` + a compromised spender is a user-loss story. `increaseAllowance` / `permit` have their own footguns (front-runable `approve` from N→0→M). Review integrations against the **actual** token: fee-on-transfer, no return value, rebasing, callbacks (`ERC777`/`ERC1363`/`ERC721` `onReceived`). An imaginary ERC-20 is not in scope.

### 5. Front-running and ordering

Transactions are ordered by the producer/builder. “I check the price then swap in the same tx” is atomic for *you*; “I post a tx and hope nobody inserts one before it” is not. For users, slippage limits / min-out belong in the **same** tx. Do not build a handbook on extracting MEV; do require **user-protecting bounds** on swaps and listings.

### 6. Denial of service / liveness

Unbounded loops, a single `owner` who must call a function for everyone else to proceed, push-payments to a reverting receiver, and a token blacklist that bricks `transfer` inside your `withdraw` all halt systems. Review **liveness** as well as theft.

### 6b. Auth patterns that fail closed

| Pattern | Failure mode |
|---------|----------------|
| `tx.origin == owner` | Phishable via intermediate contract |
| `msg.sender == tx.origin` | Breaks legitimate contract wallets / account abstraction |
| Uninitialized `owner == 0` | First claimer wins — or nobody can call |
| Single EOA admin | Laptop compromise = protocol compromise |
| `onlyOwner` on `initialize` missing | Proxy impl takeover |

Prefer explicit roles (`AccessControl`), multisig/timelock for admin, and tests that `prank` a stranger on every privileged path.

Account abstraction (ERC-4337) and EIP-7702 (EOAs that can delegate code) make “caller is a simple EOA” a rotting assumption — chapter **24**. Your contracts should keep treating `msg.sender` as “the account that called,” period.

### 7. Compiler and dependency versions

An abandoned `solc` or an unpinned OZ major is a security finding (chapters **02**, **19**).

### 8. What not to put in this handbook

Step-by-step “how to drain X,” copy-paste attacker contracts aimed at live addresses, and weaponized PoCs. Reviewers describe **what to look for** and **how to structure safe code**. They do not publish ammunition.

---

## 3. Applications and use cases

| Lens | Review habit |
|------|----------------|
| **Application** | Every external function has an auth story (including “anyone”) |
| **Systems** | CEI + locks on value-moving paths |
| **Security** | Threat model lists oracles, admins, upgrades, tokens |
| **Operations** | Admin keys in custody, not in a laptop keystore |
| **Software engineering** | Findings tracked to tests; no “we’ll fix after launch” on auth |

---

## 4. Staff-level review checklist

- [ ] No `tx.origin` authentication.
- [ ] External calls occur **after** state updates, or a lock is present and justified.
- [ ] ETH/token out is pull-style when recipients are unconstrained.
- [ ] Roles are split or the single-admin risk is accepted **in writing**.
- [ ] Signatures are EIP-712 (or equivalent) with nonce + chain id.
- [ ] No funds depend on `prevrandao` / `blockhash` as randomness.
- [ ] Oracle/admin/upgrade trust is explicit.
- [ ] No untrusted `delegatecall`.
- [ ] Tests cover unauthorized callers and failed external calls.

---

## References

- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Common patterns](https://docs.soliditylang.org/en/v0.8.36/common-patterns.html)
- [Ethereum: smart contract security](https://ethereum.org/developers/docs/smart-contracts/security/)
- [OpenZeppelin Contracts (access, utils)](https://docs.openzeppelin.com/contracts)
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [Compiler security policy](https://github.com/argotorg/solidity/security/policy)
- [Known compiler bugs](https://docs.soliditylang.org/en/v0.8.36/bugs.html)
