# Security design and review

[← Back to Vyper](./README.md)

## What this chapter covers

How to **review** Vyper systems on **0.4.x** (pin **0.4.3**): intentional language constraints as security features, `assert` style, CEI / nonreentrancy literacy, trust boundaries, module-export hazards, and a thicker **compiler advisory** habit. This is **defense and review** literacy—not exploit recipes.

Shared EVM bug classes (oracle trust, signature replay, upgrade admin) also appear in the [Solidity](../Solidity/README.md) security chapters. Use those for machine-level depth; use this chapter for Vyper-shaped expectations.

---

## 1. Concepts

### 1. Design constraints are security features

Vyper omits or restricts features that often create audit fog elsewhere:

| Constraint | Security intuition |
|------------|--------------------|
| No inheritance / modifiers | Behavior lives in readable composition (**11**) |
| No inline assembly | Fewer hidden footguns in Yul blobs |
| No unbounded loops / recursion | Gas and DoS shape stay reviewable (**07**, **18**) |
| Checked arithmetic by default | Unexpected wrap must be explicit (`unsafe_*`) |
| Opt-in `exports` | Public ABI is a conscious list |
| Boundable data (`Bytes[N]`, DynArray max, …) | Sizes visible in types (**05**) |
| Decidable gas bias | Worst-case call cost is a design conversation |

When a reviewer says “Vyper is safer,” they should mean **these constraints**—not “bugs impossible.” Money still moves; admins still exist; `raw_call` still reaches arbitrary code.

### 2. Trust boundaries (write them down)

| Input | Typical trust |
|-------|----------------|
| `msg.sender` | Key or controlling contract |
| Token / target address argument | **Untrusted** unless allowlisted |
| Oracle / external view | Honesty + liveness of that system |
| `block.timestamp` | Miner/builder influence; not RNG |
| Owner / admin | Compromise = protocol compromise |
| Module init args | Deploy-time root |
| Interface at address `X` | Code at `X` may change over time |

If the design needs an honest admin, say so in NatSpec and in the review notes.

### 3. `assert` and failure honesty

Vyper leans on `assert` / `raise` for invariants and access checks (**07**). Staff habits:

- Assert **conditions that must hold**, not hopes.
- Keep failure modes predictable for clients (who decode reverts).
- Do not use asserts as the only documentation—pair with NatSpec (**10**).
- Prefer clear auth helpers (often from an `ownable`-style module) over copy-pasted sender checks.
- Remember reasons are optional and size-capped—ops still need events for rich incident data.

### 4. Checks → effects → interactions (CEI)

When your contract calls out (`raw_call`, interface token transfer, ETH send), the callee may run code before your function finishes. Review habit:

1. **Checks** — auth and bounds.
2. **Effects** — update your storage.
3. **Interactions** — talk to the outside world.

Search for external interactions **between** storage updates. You do not need an exploit sketch to flag “interaction before effect.”

Language belts:

- `@nonreentrant` on sensitive externals,
- `#pragma nonreentrancy on` (0.4.2+) with explicit `@reentrant` opt-outs,
- still: CEI is trousers; locks are belts.

Read-only reentrancy (views observing mid-update state) is the same family of questions when other protocols read you mid-call—global lock behavior and view protection matter (**08**).

### 5. Built-in hotspots in review

From chapter **09**, prioritize inventory of:

- `raw_call` / `send` / value-bearing creates,
- `create_minimal_proxy_to` and implementation trust,
- `unsafe_*` math,
- `ecrecover` domain separation,
- legacy `selfdestruct` appearances,
- `@raw_return` proxy forwarders (encoding assumptions for callers).

Name them; require justification; do not demonstrate attacks in the PR thread.

### 6. Compiler advisories habit (thicker)

Compilers are software. Staff operating rhythm:

| Habit | Done looks like |
|-------|-----------------|
| **Subscribe / check** | Release notes + GitHub security advisories on a calendar, not only on incidents |
| **Pin** | Exact `vyper==x.y.z` (and EVM target, optimize mode, experimental flags) in lockfiles/CI |
| **Inventory** | Spreadsheet or config of **deployed bytecode → compiler pin → flags** for every production address |
| **Triage** | When an advisory lands: which pins affected? which addresses? urgency? |
| **Remediate** | Rebuild with fixed pin → retest (**13**) → re-verify (**12**) → coordinated redeploy/upgrade if required |
| **Refuse “latest”** | Untagged `pip install vyper` in prod CI is not a security strategy |

Shipping Vyper does not exempt you from compiler CVEs. Chapter **18** covers `CompilerPanic` vs user exceptions—panics and advisories both feed the same ops inventory.

### 7. What this chapter refuses

- Step-by-step exploit construction,
- copy-paste attacker contracts,
- “how to drain” narratives.

If a finding needs a proof of concept, keep it **minimal, private to the audit process**, and focused on demonstrating the invariant break—not on teaching weaponization. These chapters stay on the review side of that line.

---

## 2. Advanced concepts

### 1. Modules and confused deputies

`exports` and `uses` / `initializes` graphs can accidentally expose admin functions or initialize in the wrong order. Review the **final ABI** and **init sequence**, not only the leaf business function. File-scoped nonreentrancy pragmas do not automatically protect imported modules the way authors marked them—read the composition.

### 2. Interface trust is not code trust

`IERC20(token).transfer(...)` types the call; it does not prove `token` is the asset you meant. Allowlists, registries, or immutables set at deploy are the usual mitigations—document which. Address `code` / `is_contract` checks are snapshots, not forever guarantees (**05**).

### 3. Upgradeability and proxies

If you use minimal proxies, blueprints, or `@raw_return` forwarders, write the trust model: who can change implementation assumptions, what happens if implementation is replaced, and whether users understand they are not holding “unique” code. Storage layout overrides (**17**) are part of upgrade safety. Vyper’s simplicity does not erase proxy risk.

### 4. Economic and governance risk

Language review does not catch bad incentives, pause politics, or oracle choice. Separate **code review** from **mechanism review**; both are required for DeFi-shaped systems (chapter **15**).

### 5. Review order that scales

When time is short, walk the contract in this order:

1. **Assets and admins** — what can move value; who can pause/upgrade/set params.
2. **External calls** — every `raw_call`, token interface, send, create.
3. **Module surface** — `exports`, init graph, accidental exposure.
4. **Math and bounds** — `unsafe_*`, precision, loop/`Bytes` maxima.
5. **Mutability honesty** — `@view`/`@pure`/`@payable` vs reality.
6. **Client observability** — events for critical paths; NatSpec honesty.
7. **Compiler pin** — advisories checked against inventory.

Write findings as **invariant breaks** (“balances can disagree with total after X”) rather than as attack stories.

### 6. After the review

Track remediations to tests (**13**) and to compiler/verify notes (**12**, **18**). A closed finding without a regression test is a finding waiting to return. A pin bump without inventory update is an ops blind spot.

### 7. Cross-language estates

Mixed Vyper + Solidity systems need one threat model at the **ABI boundary**. Do not assume Vyper’s non-features protect a Solidity peripheral that holds the upgrade key. Point Solidity-side chapters at [Solidity](../Solidity/README.md); keep Vyper-shaped expectations here.

---

## 3. Applications and use cases

| Role | Security “done” |
|------|-----------------|
| **Engineer** | CEI on value paths; no silent `unsafe_*`; pins recorded; exports minimal |
| **Reviewer** | Trust boundaries written; exports audited; advisories checked against inventory |
| **Ops** | Deployed compiler versions + flags inventoried; emergency contacts known |
| **Auditor** | Vyper non-features understood; no false confidence |
| **Client engineer** | Does not treat “Vyper” as a substitute for simulating txs |

**Smell:** “We’re safe because it’s Vyper.” Safe is a property of **this** bytecode, config, and process.

---

## 4. Staff-level review checklist

- Intentional non-features understood; no missing-modifier confusion.
- Auth on every state-changing external; admin powers listed.
- CEI (or explicit lock rationale) on paths with external calls; nonreentrancy posture documented.
- Token/target addresses allowlisted or trust-justified.
- `raw_call` / create / `unsafe_*` / `ecrecover` / `@raw_return` inventory complete.
- Module `exports` and init order reviewed; no confused-deputy surface.
- Loop and bytes maxima enforced; gas griefing considered (**18**).
- Events present for critical actions; NatSpec does not overclaim.
- Compiler pin + EVM target + optimize + experimental codegen known.
- Recent advisories / release notes checked against that pin; inventory updated.
- Tests cover auth failures (**13**); verify story exists (**12**).
- Upgrade/proxy/layout assumptions written if applicable.
- Findings phrased as invariant breaks—not exploit tutorials.

---

## References

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Release notes (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/release-notes.html)
- [Built-in functions (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/built-in-functions.html)
- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Compiler exceptions (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiler-exceptions.html)
- [Solidity track](../Solidity/README.md) — shared EVM security review depth
- [Vyper GitHub](https://github.com/vyperlang/vyper) — advisories and releases
