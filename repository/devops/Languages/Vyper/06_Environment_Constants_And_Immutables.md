# Environment, constants, and immutables

[← Back to Vyper](./README.md)

## What this chapter covers

Blockchain **environment** values (`msg`, `block`, `tx`-style data), and how **constants** vs **immutables** freeze configuration. After this chapter you should know what is safe to trust from the environment, what belongs in `constant`, and what belongs in immutable deploy-time config.

Pin: **Vyper 0.4.x** (**0.4.3**). Parallel globals literacy for Solidity lives in [Solidity](../Solidity/README.md)—same EVM ideas, check Vyper names for your pin. Mutability of *functions* that *read* these values is chapter **[08](./08_Functions_Visibility_And_Mutability.md)**; here the focus is **inputs and frozen policy**.

---

## 1. Concepts

### 1. Environment: who, what, when

When a function runs, the EVM provides context. Conceptually (names follow Vyper’s globals for your version):

| Family | Questions it answers |
|--------|----------------------|
| **`msg`** | Who called? How much ETH arrived with this call? What calldata? |
| **`block`** | What time/number/context does this block claim? |
| **`tx`** | What is the originating transaction’s origin / gas price story? |
| **`chain`** (as exposed) | Which chain identity binds this execution? |

Exact attribute lists are versioned—learn the set in docs for **0.4.3**. The *engineering* point is stable across versions: **environment is inputs**, not gospel about the off-chain world.

### 2. `msg.sender` literacy

`msg.sender` is the **immediate** caller: an EOA or another contract. It is the backbone of access control patterns (`assert msg.sender == self.owner`).

It is **not**:

- proof of human identity,
- proof of uniqueness across time,
- the same as “transaction origin” in all designs,
- automatically “the end user” when a router or multicall sits in front.

If a protocol needs “the user behind a router,” that is an explicit design (and often a footgun)—document it; don’t assume `msg.sender` is the wallet end user.

### 3. `msg.value` and payable paths

ETH attached to the call shows up as value. Only **payable** entry points should accept value (chapter **08**). Accounting must credit the right party and handle dust. Silent value acceptance on the wrong function is an ops and security defect.

Pair every payable path with: who is credited, which event fires, and what happens on zero value.

### 4. Block properties

Block timestamp and number are **miner/proposer-influenced within protocol rules**. Use them for coarse timing (unlock windows, epochs), not for high-precision randomness or fairness lotteries. Security reviews treat “timestamp dependence” as a design discussion, not free entropy.

Wide windows (hours/days) are usually fine. Second-precision races and “random” seeds from `block.*` are review magnets.

### 5. Constants

`constant` values are **fixed at compile time**. They are good for:

- mathematical coefficients,
- role identifiers that never change,
- inlined configuration that is truly universal for that bytecode.

```vyper
PRECISION: constant(uint256) = 10 ** 18
```

Changing a constant means **new bytecode**. That is a feature for auditability.

### 6. Immutables

**Immutables** are set **once at deployment** and then fixed for the life of that code. Typical uses: token addresses, treasury, scaling factors chosen per deploy.

| | **constant** | **immutable** | **storage config** |
|--|--------------|---------------|--------------------|
| When fixed | Compile time | Deploy / init time | Mutable by design |
| Per-deploy variance | No (same in bytecode) | Yes | Yes |
| Change later | Redeploy | Redeploy | Via your setters / governance |

Prefer immutables over storage slots for config that must never move—cheaper and clearer intent. Prefer storage when rotation is a product requirement (with events and tests).

---

## 2. Advanced concepts

### 1. Trust boundaries

| Source | Trust posture |
|--------|----------------|
| `msg.sender` | Trust for ACL **within** your threat model; contracts can be senders |
| `tx.origin` (if used) | Rarely appropriate for auth—phishing-shaped footguns in sibling ecosystems apply conceptually |
| `block.timestamp` | Bounded manipulability; OK for wide windows |
| Off-chain prices | **Not** in environment—need oracles/messengers with their own trust |
| Constructor args | Trust the deploy process; wrong admin is permanent if immutable |

Vyper will not invent an oracle for you. Missing price integrity is an application design gap.

### 2. Constructor-set immutables vs storage owners

Owners in storage can be transferred (if you write that). Immutables cannot. Pick deliberately:

- **immutable admin** → hard-fail upgrade/social recovery story must be external,
- **storage owner** → transfer/renounce paths need tests and events.

Document the choice in NatSpec (chapter **[10](./10_Events_And_NatSpec.md)**) so ops does not assume a rotation path that does not exist.

### 3. Chain id and cross-domain replay

When signing or binding domain separators, **chain id** and contract address matter. Environment (or explicit args) must match the deployment domain. This is shared EVM lore with Solidity—see [Solidity](../Solidity/README.md) when designing signed messages.

### 4. Gas and environment reads

Reading env vars is usually cheap compared to storage writes. Still, don’t sprinkle speculative reads; clarity beats micro-tweaks. Hot paths should make `msg.sender` checks obvious at the top of external functions.

### 5. Constants in interfaces and modules

Shared constants across modules should have a **single source of truth** to avoid drift (two `PRECISION` values that disagree). Composition without inheritance still needs package discipline (chapter **[11](./11_Interfaces_And_Modules.md)**).

### 6. Testing env

Titanoboa (chapters **[03](./03_Toolchain_Vyper_Titanoboa_Brownie.md)**, **[13](./13_Testing_Contracts.md)**) lets tests set caller, value, and time. Tests that never vary `msg.sender` miss ACL bugs. Tests that warp time without documenting assumptions miss window bugs. Tests that never attach `msg.value` miss payable accounting bugs.

### 7. What not to bake into constants

Do not hard-code as `constant`:

- addresses that differ per network unless you ship **per-chain bytecode** on purpose,
- fee recipients you might rotate,
- “temporary” pause flags,
- oracle addresses you expect to replace.

Those belong in immutables (per deploy), storage (mutable governance), or deploy scripts—not in a compile-time constant that forces a full rebuild for every environment.

### 8. Deploy runbooks and frozen args

Immutable constructor args are **release config**. Record them next to bytecode hash:

- who approved the addresses,
- which network they belong to,
- how verification will re-encode them.

Wrong immutable treasury is not a hotpatch; it is a redeploy (or a designed escape hatch you should have named earlier).

### 9. Decision table: where does this knobs live?

| Knob | `constant` | `immutable` | storage |
|------|------------|-------------|---------|
| Math scale factor forever | Yes | Rarely | No |
| Token address per chain deploy | No | Yes | Only if rotatable |
| Fee recipient that governance may change | No | No | Yes + events |
| Pause flag | No | No | Yes |
| Role id string / enum-like id | Often | Sometimes | Rarely |

If the team argues for more than five minutes, write the choice in NatSpec and move on—silence is how two engineers ship opposite assumptions.

### 10. Environment in reviews

A short review pass for env misuse:

- Auth via immediate caller vs “user behind router” without docs,
- Timestamp as randomness,
- Payable without accounting,
- Immutable admin with no external recovery story named.

You do not need exploit demos to raise these.

---

## 3. Applications and use cases

| Angle | How env/constants show up |
|-------|---------------------------|
| **Application** | Feature flags and fee constants as `constant`/`immutable` keep product params auditable. |
| **Systems** | Deploy scripts pass immutable constructor args; record them in release notes. |
| **Security** | ACL is `msg.sender`-shaped; timestamp and origin misuse are classic review themes. |
| **Ops** | Monitoring should alert on admin storage changes; immutables won’t “quietly rotate.” |
| **SE** | Glossary: constant vs immutable vs storage config—three words, three ops meanings. |

**Whole-engineering picture:** environment is the **call’s context**; constants/immutables are **frozen policy**.

**Smell:** a “constant” address that differs per staging/prod via copy-paste files. That is either per-chain bytecode (documented) or a misuse of `constant`.

---

## 4. Staff-level review checklist

- Access control uses immediate caller semantics intentionally; `tx.origin`-style auth is justified or absent.
- Payable functions alone accept value; accounting matches `msg.value`.
- Timestamps used only with appropriate tolerance; not as randomness.
- Compile-time fixed values are `constant`; per-deploy fixed values are immutable.
- Immutable constructor args are documented in deploy runbooks and release sidecars.
- Storage “config” that should never change is questioned—why not immutable?
- Tests cover multiple senders, value paths, and time windows for privileged functions.
- Cross-chain or signed-data designs bind chain identity explicitly.
- Module-shared constants have a single source of truth.
- Ops knows which admins can rotate and which cannot.

---

## References

- [Environment variables and constants (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/constants-and-vars.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Structure of a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/structure-of-a-contract.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
