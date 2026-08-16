# Testing contracts

[← Back to Vyper](./README.md)

## What this chapter covers

How to **prove** Vyper contracts behave: **Titanoboa** as the modern default, **Brownie** as brownfield literacy, fixtures as a mental model, and the **CI habit** that keeps pins honest. Assumes **Vyper 0.4.x** (pin **0.4.3**).

Testing here means state, events, reverts, and deploy configuration—not a DeFi strategy backtest. Shared EVM testing culture (fuzz mental model, fork caution) overlaps the [Solidity](../Solidity/README.md) track; the runner names below are Vyper’s. Toolchain map: chapter **[03](./03_Toolchain_Vyper_Titanoboa_Brownie.md)**. Artifacts under test: chapter **[12](./12_Compiling_Deploying_And_ABI.md)**.

---

## 1. Concepts

### 1. What “done” means for a Vyper test

A useful test:

1. Compiles with the **same pin** CI deploys (**12**)—including EVM target literacy (**prague** default on **0.4.3** unless overridden).
2. Exercises an **external** behavior users or admins actually call.
3. Asserts **storage** and, when relevant, **events** (**[10](./10_Events_And_NatSpec.md)**).
4. Expects **reverts** for auth and invariant failures—not only happy paths.
5. Runs headlessly in CI with no manual browser clicking.

If the suite only checks “it deploys,” you do not have tests yet.

### 2. Titanoboa — default for new work

**Titanoboa** is the Vyper-native testing environment highlighted for current docs: Pythonic, fast feedback, comfortable with modern Vyper. Staff default for **new** repos:

- Install into the project virtualenv beside the pinned `vyper`.
- Load contracts the way the project documents (Boa’s APIs evolve—follow current Titanoboa docs for exact calls).
- Prefer tests that read like: deploy → act → assert state/event/revert.

Mental model: you are driving the contract as a Python object that mirrors ABI methods, not pasting raw calldata by hand (unless you are testing encoding itself).

### 3. Fixtures mental model

Think in layers, even when the API names differ across Boa versions:

| Layer | Responsibility |
|-------|----------------|
| **Env fixture** | One Titanoboa/pytest environment per test or module |
| **Deploy fixture** | Compile/load `.vy` with the CI pin; return the contract handle |
| **Actor fixtures** | Distinct senders (owner, user, attacker, keeper) |
| **Time/value knobs** | Warp clocks; attach ETH deliberately for payable paths |
| **Token/interface mocks** | Minimal counterparts behind allowlists |

Rules that keep suites honest:

- Prefer **fresh deploy per test** for unit purity; share only when setup cost dominates and mutation is impossible to leak.
- Never leave `msg.sender` stuck as “whoever deployed” across auth tests.
- Name fixtures after roles (`owner_contract`, `user`) so failures read as product language.
- Put network/fork setup in labeled fixtures—not silently inside every unit test.

### 4. What to assert

| Assert | Why |
|--------|-----|
| Storage / public getters | Truth on-chain |
| Events | Indexer and client contract |
| Revert / reason | Access control and invariants |
| Balances (ETH/ERC-20 via interfaces) | Value movement |
| Module-exported ABI surface | `exports` actually exposed what you meant (**11**) |

Pair value-moving tests with the CEI review habit from chapter **[14](./14_Security_Design_And_Review.md)**—tests catch regressions; review catches structural order bugs tests might miss if poorly written.

### 5. Brownie — brownfield door

**Brownie** appears in older tutorials and established Python Ethereum repos. Treat it as:

- **Literacy** when you inherit a Brownie project,
- **not** the default greenfield choice when starting today.

Migration posture: keep Brownie green while you add Titanoboa for new modules, or plan a deliberate cutover. Do not run two conflicting compiler pins in one pipeline without naming which artifact is canonical.

### 6. CI pins

Minimum pipeline:

```text
install pinned vyper==0.4.3 (+ titanoboa pin)
print vyper --version (and record EVM target policy)
compile all compilation targets
run unit tests (pytest / boa)
(optional) integration on a fork — policy gated
publish ABI + bytecode artifacts from the same job
```

Fail the build on compiler warnings your team treats as errors. Cache responsibly; never cache “whatever vyper was on PyPI today.”

Lockfile must pin **both** `vyper` and the test runner. Titanoboa should not silently compile with a different Vyper than the release job.

Clients in [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) may have separate ABI tests—those consume artifacts from this pipeline, they do not replace it.

---

## 2. Advanced concepts

### 1. Property and fuzz thinking (light)

Even without a Foundry-shaped fuzzer in-process, you can:

- randomize bounded inputs in Python,
- test algebraic invariants (`totalSupply` vs sum of balances),
- assert monotonicity where the product claims it.

Heavy fuzz/invariant infrastructure often lives in Solidity/Foundry shops—borrow the **questions**, not necessarily the runner, or add a sibling suite when the repo is multi-language ([Solidity](../Solidity/README.md)).

### 2. Fork tests are a privilege

Mainnet forks catch integration surprises and cost time/flakes. Policy:

- unit tests = default PR gate,
- fork tests = nightly or labeled jobs,
- never require live privileged keys for CI.

Document RPC freshness expectations so “fork failed” is not misread as “contract broken.”

### 3. Testing modules

With 0.4 modules, tests should target the **final compilation target** (what you deploy), including `exports`. Optionally unit-test pure module helpers in isolation when they are nontrivial. Always include one test that fails if someone drops an `exports` line by accident.

### 4. Gas assertions — use sparingly

Gas tests drift with compiler versions and EVM targets. Prefer functional assertions; keep a few gas ceilings only where product SLOs demand them, pinned to the same optimize mode and EVM version as deploy.

### 5. Coverage is a flashlight, not a certificate

Line coverage on `.vy` helps find untested auth branches. It does not prove economic safety. Pair coverage with a review checklist (**14**).

### 6. Suggested first suite (shape, not a template dump)

For a small vault- or token-shaped contract, a staff-minimum suite usually includes:

1. Deploy with expected owner/immutables.
2. Happy path state change + matching event.
3. Unauthorized caller reverts.
4. Zero-amount or empty-edge revert if the product forbids it.
5. One interface call to an allowlisted token mock (if applicable).
6. Payable path with and without value (if payable exists).

Grow from there into invariants and module-export checks. Resist a single “god test” that deploys the world and asserts nothing sharp.

### 7. Local vs CI parity

Developers may use interactive Boa sessions; CI must run the **non-interactive** suite. Document the one command that must stay green. If someone can only reproduce failures in a notebook, the suite is not yet a gate.

### 8. Hypotheses for failing tests

When green locally and red in CI, check in order:

1. Vyper pin mismatch,
2. EVM target / optimize mismatch,
3. import path / cwd differences,
4. time-dependent tests without explicit warps,
5. shared fixture mutation across tests.

Most “flaky Vyper” stories are environment stories.

---

## 3. Applications and use cases

| Role | Testing focus |
|------|----------------|
| **Contract engineer** | Titanoboa unit tests per PR; pin in lockfile |
| **Security reviewer** | Ask for revert tests on every privileged path |
| **Ops** | CI red = no deploy; artifacts from the same job |
| **Client engineer** | Golden ABI fixtures from CI; smoke decode events |
| **Maintainer of Brownie repo** | Document brownfield; plan Boa for new code |

**Smell:** README says “run this notebook to test.” Notebooks are exploration; CI is the gate.

**Smell:** fork tests are the only coverage for ACL. Unit-test auth without a network.

---

## 4. Staff-level review checklist

- Titanoboa (or documented Brownie) suite runs in CI on every PR.
- Compiler pin in tests matches deploy pin (**0.4.x** / **0.4.3**).
- EVM target policy matches deploy (**prague** default literacy for 0.4.3).
- Happy path and auth failure paths both covered.
- Events asserted for user-visible state changes.
- Fixtures separate env, deploy, and actors; no sticky sender across auth tests.
- Module `exports` covered by at least one call test.
- Fork/mainnet tests are policy-gated, not silent PR blockers.
- No production private keys in CI.
- ABI artifacts used by clients come from the same pipeline.

---

## References

- [Testing a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts.html)
- [Testing with Titanoboa (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-titanoboa.html)
- [Testing with Brownie (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-brownie.html)
- [Compiling a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [Titanoboa on GitHub](https://github.com/vyperlang/titanoboa)
