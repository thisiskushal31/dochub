# Toolchain: vyper, Titanoboa, Brownie

[← Back to Vyper](./README.md)

## What this chapter covers

The practical tool map for Vyper work: the **`vyper` CLI** as the compiler of record, **Titanoboa** as the modern testing door, and **Brownie** as brownfield literacy—not the default for new suites. Assumes you can already compile a hello (chapter **[00](./00_First_Steps_Install_And_Hello.md)**) and pin a version (chapter **[02](./02_Versions_Pragmas_And_Pins.md)**).

Shared EVM testing intuition (forks, traces, invariant ideas) overlaps the [Solidity](../Solidity/README.md) toolchain world; the **first-class Vyper test stack** here is Titanoboa-centric. Testing workflows continue in chapter **[13](./13_Testing_Contracts.md)**; this chapter orients the tools.

---

## 1. Concepts

### 1. Three jobs, three tools

| Job | Default door | What “done” looks like |
|-----|--------------|-------------------------|
| **Compile** | `vyper` CLI | Bytecode + ABI from pinned compiler |
| **Test / prototype** | **Titanoboa** | Python tests that exercise `.vy` with asserts on state/events |
| **Legacy project** | **Brownie** | Existing suite still green; migration plan named |

Do not collapse these into “the Python crypto framework.” Compile pins and test runners are related but separable.

### 2. `vyper` CLI literacy

Core habits:

```bash
vyper --version
vyper contract.vy                 # bytecode (default)
vyper -f abi contract.vy
vyper -f bytecode contract.vy
vyper -f abi,bytecode contract.vy
vyper -p interfaces/ contract.vy  # import search path when needed
```

Staff should know how their repo wraps this (Makefile, tox, hatch, CI job). The wrapper must not hide the **version**. Flags for IR, assembly, storage layout, or experimental paths are advanced—use when reviewing or debugging, not as unexplained defaults.

For **0.4.3**, also know that EVM target defaults to **prague** and optimize mode defaults to **gas** unless you set otherwise (chapter **[12](./12_Compiling_Deploying_And_ABI.md)**).

### 3. Titanoboa as primary tests

**Titanoboa** is the modern Vyper-oriented testing approach: write tests in Python, load/compile Vyper contracts, call functions, assert storage and outcomes. It fits teams that already live in pytest-style workflows and want a **Vyper-first** path rather than forcing everything through a Solidity-native framework.

Mental model:

> test file → Titanoboa env → compile/load `.vy` with pinned vyper → call as Python-facing ABI → assert state / reverts / events

Exact APIs evolve; learn the **pattern** from current Titanoboa docs (References). Default: **new Vyper tests use Titanoboa** unless the repo already standardized elsewhere with eyes open.

Fixtures mental model (preview of **13**): one fixture builds the env and deploys; tests borrow that instance; privileged tests rebind `msg.sender`; value tests attach ETH deliberately. Prefer boring fixtures over clever shared mutable worlds.

### 4. Brownie as a door, not the front door

**Brownie** appears in older tutorials and production repos. It can compile and test Vyper in brownfield estates. For **new** work, prefer Titanoboa unless:

- the organization already runs Brownie at scale and migration cost dominates, or
- you are extending a Brownie project and consistency beats purity.

Label Brownie paths clearly in README so new hires do not assume it is the default for greenfield **0.4.x** work.

### 5. Where Solidity toolchains fit

Foundry/Hardhat are excellent for **Solidity-first** repos. Calling Vyper from them is possible in some setups but is a **bridge**, not the center of this track. If the codebase is Vyper-majority, keep Vyper’s compiler + Titanoboa as the source of truth; use [Solidity](../Solidity/README.md) tooling chapters when the sibling package is Solidity.

### 6. Install shape that scales

```text
project venv
├── vyper==0.4.3          # compiler of record
├── titanoboa (pinned)    # default test runner
├── pytest (pinned)       # usual driver
└── (optional) brownie    # brownfield only
```

One venv, one lockfile, one documented `pytest` (or `boa`) command. Titanoboa should not silently pull a different Vyper than CI deploys.

---

## 2. Advanced concepts

### 1. Compile once, test many

CI shape that scales:

1. Install pinned `vyper==0.4.3` (or team pin),
2. Compile (or let the test harness compile with that pin),
3. Run Titanoboa/pytest,
4. Publish artifacts (bytecode, ABI) with version + EVM metadata.

Avoid “developer laptop compiler ≠ CI compiler.” Chapter **02** is non-optional here.

### 2. Local chain vs fork vs pure unit

| Mode | Use |
|------|-----|
| **In-process / local boa env** | Fast unit and state tests |
| **Fork tests** | Integration against live protocol state (ops + security care about freshness and flakiness) |
| **Public testnet deploys** | Release rehearsal—not a substitute for automated asserts |

Pick the cheapest mode that proves the claim. Not every test needs a fork.

### 3. ABI as the integration contract

Frontends, backends, and sibling Solidity contracts depend on the **ABI**. Toolchain ownership includes:

- generating ABI from the same pin as bytecode,
- failing CI if ABI diffs are unexpected,
- versioning consumer packages when signatures change.

### 4. Debugging surfaces

When a test fails: read the revert, check mutability, check who `msg.sender` is in the test setup, check storage layout assumptions. Prefer **failing tests that name the invariant** over ad-hoc mainnet experiments. Security reviews want the invariant written down—not a transcript of console poking.

Interactive Titanoboa sessions are excellent for exploration. They are **not** the merge gate—CI is.

### 5. Dependency hygiene

Titanoboa, vyper, pytest, and any web3 stack should be pinned. “Latest Brownie + latest Vyper” combinations are a common brownfield footgun. Upgrade in deliberate PRs with green tests.

### 6. SE: one recommended path

Document in the repo:

- how to install,
- how to run tests,
- which tool is **canonical**,
- which tool is **legacy**.

Ambiguous READMEs produce divergent local setups and unreproducible incident response.

### 7. Artifact handoff to clients

The toolchain’s last mile is publishing:

- ABI JSON,
- address book (per chain),
- compiler version + EVM target + optimize mode,
- bytecode hash.

Client stacks in [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) should consume that bundle—not hand-typed selectors. Ownership of the publish step sits with ops/release, not “whoever remembered.”

### 8. When to bridge to Foundry

Borrow Foundry for Solidity packages, fuzz campaigns, or shared invariant runners in polyglot repos. Do not relocate Vyper’s compiler of record into a Solidity-only mental model. Keep `.vy` compile + Titanoboa green even if a sibling Foundry suite exists.

### 9. Who owns which button

| Button | Owner |
|--------|-------|
| `vyper` pin and compile job | Contract / release |
| Titanoboa suite green | Contract (reviewer asks) |
| Brownie legacy path | Named maintainer or migration RFC |
| ABI publish to clients | Release + client SE jointly |
| Fork RPC secrets | Ops—never in the contract repo casually |

Ambiguous ownership produces “the tests are green on my machine” incidents.

### 10. First-week toolchain check

A new engineer should, in one sitting:

1. Create venv, install lockfile,
2. Print `vyper --version`,
3. Run the canonical test command,
4. Point to where ABI artifacts are written.

If step 3 requires Slack archaeology, the *repo’s* toolchain docs are incomplete—not the language.

---

## 3. Applications and use cases

| Angle | Toolchain role |
|-------|----------------|
| **Application** | Fast feedback on state transitions before UI wiring. |
| **Systems** | ABI + bytecode artifacts feed deploy pipelines and cross-language callers. |
| **Security** | Tests encode invariants; reviewers ask which suite gates merge. |
| **Ops** | CI pins, caches, and artifact stores; no unversioned compile in release jobs. |
| **SE** | First-week check runs one documented test command; Brownie-only lore is quarantined. |

**Whole-engineering picture:** the toolchain is how language rules become **merge gates**.

**Smell:** README lists three ways to test and none is marked canonical. Pick one; archive the rest.

---

## 4. Staff-level review checklist

- `vyper --version` in CI matches the project pin (**0.4.3** / **0.4.x** policy).
- EVM target and optimize mode used by tests match deploy (**prague** default literacy for 0.4.3).
- New test code defaults to **Titanoboa** unless a written exception exists.
- Brownie usage is labeled brownfield with a maintenance or migration note.
- ABI and bytecode are produced from the same compiler invocation story.
- Fork tests are isolated and not the only coverage for critical invariants.
- Mixed Solidity/Vyper repos name which toolchain owns which package.
- README shows one canonical `install` + `test` path.
- Experimental compiler flags are not hidden in test helpers without comments.
- Client ABI artifacts come from the same pipeline that gates merge.

---

## References

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Installing Vyper](https://docs.vyperlang.org/en/v0.4.3/installing-vyper.html)
- [Testing with Titanoboa (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-titanoboa.html)
- [Testing with Brownie (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-brownie.html)
- [Compiling a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [Titanoboa on GitHub](https://github.com/vyperlang/titanoboa)
