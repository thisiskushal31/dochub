# Static analysis, SMTChecker, and audits

[← Back to Solidity](./README.md)

## What this chapter covers

How **machines and humans** review contracts: **Slither** (and similar analyzers), **Solhint**, Solidity’s **SMTChecker**, what an **audit** is for, and how to triage findings without treating any tool as a blessing. Assumes **0.8.x** / **0.8.36**.

A green CI is not a halo. Analyzers are extremely good at “this *shape* has hurt people before.” They are average at “your product idea is wrong.” Humans still have to read. Tools still have to run. Audits still have to match the commit you actually deploy.

---

## 1. Concepts

### 1. Three layers, none optional for serious value

| Layer | What it catches | What it misses |
|-------|-----------------|----------------|
| **Compiler + tests** | Broken builds, specified behavior | Unspecified attackers |
| **Static analysis / SMT** | Known patterns, some math properties | Economic design, novel logic |
| **Human review / audit** | Trust model, composition, “this is the wrong protocol” | Whatever you hid or rushed |

Ship with the first two in CI. Buy the third when the loss would matter. An audit is not a substitute for tests.

### 2. Slither — static analysis you will actually run

**Slither** walks the AST and flags detectors: reentrancy-shaped calls, unused return values, dangerous `delegatecall`, arbitrary `from` in transfers, and many more.

```bash
pipx install slither-analyzer   # or your org’s pinned image
slither . --filter-paths "lib|node_modules"
```

Triage rules:

- **Every finding gets a status:** fix, accept-with-reason, false-positive-with-reason.
- Do not `--exclude` a detector globally to silence one line.
- Re-run on the **same solc** you ship.

Slither is not an exploit engine in this handbook’s workflow. It is a **review input**. Read the detector name, read your code, decide.

### 3. Solhint — lint and some security nits

Solhint is ESLint-shaped: style + a smaller security set. Useful in editors and CI for consistency (named return vars, compiler version, `tx.origin`). It will not replace Slither or tests.

### 4. SMTChecker — formal-ish properties in `solc`

Solidity can encode properties and ask SMT solvers to look for counterexamples:

```solidity
function deposit() external payable {
    uint256 before = address(this).balance - msg.value;
    // ...
    assert(address(this).balance >= before);
}
```

Enable via `modelChecker` in Standard JSON / Foundry/Hardhat settings. Use it for **local math invariants**, not for “prove the protocol cannot lose money” in one click. Timeouts, false positives, and abstraction gaps are normal—treat results as leads.

### 5. What an audit is

An audit is a **time-boxed human review** (often with tools) against a **frozen commit**. You owe the auditors:

- spec / NatSpec,
- tests + how to run them,
- pinned compiler,
- known issues list,
- threat model (chapter **18**).

You owe yourself: time to **fix** and a **re-review** of diffs. “Audited” on a commit that later gained a new `withdraw` is marketing.

Bug bounties are a later layer: scoped, with a safe harbor, after you can actually patch or compensate.

---

## 2. Advanced concepts

### 1. Detector fatigue

Hundreds of informational findings train teams to ignore **high**. Configure severity gates: CI fails on high/medium you have not waived in a reviewed file.

### 2. What each tool actually sees

| Tool | Strength | Blind spot |
|------|----------|------------|
| **Solhint / solc warnings** | Style, visibility, `tx.origin`, floating pragma | Deep data-flow |
| **Slither** | Inheritance, reentrancy *patterns*, unused return, dangerous `delegatecall` | Needs compilation; false positives on unusual CEI |
| **SMTChecker** | Overflow, assert, some reentrancy/state, conditioned on solvers | Timeouts; loops; external calls it cannot model |
| **Foundry invariants / fuzz** | Real EVM execution, multi-tx sequences | Only properties you wrote |
| **Human review** | Trust, economics, “this admin is the protocol” | Fatigue, missed lines |

Do not play them against each other to dismiss both.

### 3. SMTChecker knobs (so “we ran it” means something)

`solc` settings you should be able to name:

- **`modelChecker.engine`**: `bmc` (bounded model check), `chc` (constrained Horn — usually stronger), `all`.
- **`targets`**: `assert`, `underflow`, `overflow`, `divByZero`, `constantCondition`, `popEmptyArray`, `outOfBounds`, `balance`.
- **`invariants`**: `contract`, `reentrancy` (when you opt in).
- **`timeout` / `bmcLoopIterations`**: without these, CI either hangs or proves nothing.
- **`contracts`**: which contracts to analyze (do not SMT the test mocks by accident).

A `require` is an **assumption** for the solver; an `assert` is a **property**. Putting user checks in `assert` both panics in prod *and* teaches SMT the wrong thing (chapter **09**).

SMT cannot replace tests: it does not know your token is fee-on-transfer unless you model that.

### 4. Formal verification beyond SMTChecker

Dedicated FV (Certora-style specs, etc.) is a specialist lane. This track only requires you to know it **exists** for high-value math. It is not a default for a weekend vault.

### 5. Supply chain of the tools

Pin Slither and Solhint versions. A random `pip install` on a developer laptop is not the CI story. Slither must compile with the **same** `solc` pin / remappings as tests or it analyzes a different program.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Properties in tests + a few SMT asserts on money math |
| **Systems** | Analyzer runs in CI on every PR |
| **Security** | Waivers are signed review comments, not `.gitignore` |
| **Operations** | Audit report + commit hash stored with the release |
| **Software engineering** | Findings become tests so they cannot regress |

---

## 4. Staff-level review checklist

- [ ] CI runs tests **and** at least one static analyzer on the contracts path.
- [ ] High/medium findings are fixed or waived with a **reason** in-repo.
- [ ] SMTChecker, if enabled, has a known config (not a one-off laptop flag).
- [ ] Audit scope matches the **commit being deployed**.
- [ ] Tool versions are pinned.
- [ ] No culture of `--exclude-informational` as a way to hide everything.

---

## References

- [SMTChecker and formal verification](https://docs.soliditylang.org/en/v0.8.36/smtchecker.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Slither](https://github.com/crytic/slither)
- [Solhint](https://protofire.github.io/solhint/)
- [Ethereum: smart contract security](https://ethereum.org/developers/docs/smart-contracts/security/)
- [Foundry Book — tests](https://book.getfoundry.sh/forge/tests)
