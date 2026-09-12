# Versions, pragmas, and pins

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper sources declare their language band, how **compiler version** and **EVM target** belong together in CI, and how to treat **0.4.x** vs brownfield **0.3.x**. After this chapter you should refuse “unpinned `vyper` in the pipeline” as casually as you refuse unpinned `solc`.

Default pin: **Vyper 0.4.3** / band **0.4.x**. For **0.4.3**, the compiler’s default EVM target is **prague** unless overridden—record that beside the language pin. Sibling pragma culture for Solidity lives in the [Solidity](../Solidity/README.md) track—same *pin discipline*, different compiler.

---

## 1. Concepts

### 1. Why versions show up twice

Two places matter:

| Place | What it answers |
|-------|-----------------|
| **Source pragma** | “What language rules did the author write against?” |
| **Installed compiler** | “What binary actually produced this bytecode?” |

They must be **compatible**. A pragma alone does not install the compiler. A compiler alone does not document intent for the next reader.

A third place joins them in practice: **CI / release metadata** (lockfile, build log, artifact sidecar). Staff treat that third place as part of the contract job.

### 2. Modern pragma form

Preferred in new **0.4.x** work:

```vyper
#pragma version ^0.4.0
```

Meaning (practical): this file expects a **0.4.x** compiler compatible with that caret range. Teams often tighten further (exact `0.4.3`) when policy demands bit-for-bit discipline.

Optional companions you will see in mature repos (full compile story in chapter **[12](./12_Compiling_Deploying_And_ABI.md)**):

```vyper
#pragma version ^0.4.0
#pragma evm-version prague
#pragma optimize gas
```

You do not need every pragma on day one. You do need a **policy** for which ones CI sets via flags vs source.

### 3. Legacy form you will still see

Older sources and tutorials use:

```vyper
# @version ^0.3.10
```

or similar `# @version` lines. Treat them as **real version declarations**, not comments to delete casually. When porting to 0.4.x, update the pragma **and** re-read release notes—syntax and module rules may have moved.

### 4. Pin the toolchain

```bash
pip install 'vyper==0.4.3'
vyper --version
```

Lock files (`requirements.txt`, `uv.lock`, poetry lock, etc.) should record the same pin CI uses. Floating `vyper` without a floor/ceiling is how “it compiled on Friday” becomes “mainnet bytecode we cannot rebuild.”

### 5. What a pin is for

| Goal | Habit |
|------|--------|
| **Reproducible artifacts** | Same source + same compiler + same settings → same bytecode |
| **Honest review** | Auditors know which language rules applied |
| **Safe upgrades** | Bumping 0.4.2 → 0.4.3 is a deliberate change with a diff and tests |
| **Explorer verification** | Verifiers need the compiler version and settings you claim |

### 6. Language pin vs EVM pin

| Pin | Typical declaration | Failure if wrong |
|-----|---------------------|------------------|
| **Vyper version** | `#pragma version` + `pip`/`==` | Syntax/semantics mismatch; unreproducible bytecode |
| **EVM version** | `#pragma evm-version` and/or `--evm-version` | Wrong opcode set vs chain; verify fails; strange runtime |

For **0.4.3**: default EVM target is **prague**. If your chain or verifier expects another fork ruleset, set it explicitly and document why. Compiling for the wrong EVM version can produce wrong or failing behavior—especially on private chains.

---

## 2. Advanced concepts

### 1. Official versioning guideline literacy

Vyper publishes a **versioning guideline**: how language/compiler changes are signaled and what consumers should expect when the version number moves. Staff do not need to recite every clause. They need the habit:

- read the guideline when bumping majors/minors,
- treat patch bumps as still requiring **compile + test**,
- never assume “Solidity 0.8 habits” map onto Vyper’s scheme.

Link lives in **References**.

### 2. Carets, exact pins, and policy

| Policy style | When it fits |
|--------------|--------------|
| `#pragma version ^0.4.0` + CI `==0.4.3` | Common: source allows 0.4 band; CI freezes patch |
| Exact pragma + exact CI | High assurance / formal bytecode match requirements |
| Wide open / no pin | Unacceptable for anything that holds value |

Document the policy in the repo once so every PR does not renegotiate it.

### 3. Flag vs pragma conflicts

If CLI/JSON settings disagree with source pragmas (for example EVM version), **0.4.x** compilers raise and refuse to continue. That is a feature. Fix the conflict deliberately; do not “workaround” by deleting the pragma.

### 4. 0.3.x brownfield

When you open a 0.3.x file:

- do not assume 0.4 module syntax,
- do not “just bump the pragma” without a port plan,
- keep the **historical compiler** available to rebuild old artifacts if you must verify or incident-response an old deploy.

Porting is a **project**, not a one-line edit. Label brownfield paths in the README so new hires do not “helpfully” retarget everything to latest.

### 5. Venom / experimental codegen (door only)

Some compiler paths or experimental codegen options exist for advanced users (`#pragma experimental-codegen` and related doors). They are **not** the default for CI. If a team opts in, policy must name who approved it, how artifacts are labeled, and how tests cover the path. Otherwise stay on the stable compile path for **0.4.3**.

### 6. Mixed Solidity / Vyper monorepos

Two compilers, two pins, two EVM-setting stories. Failure mode: one “crypto toolchain” myth that upgrades Foundry and accidentally upgrades Vyper—or the reverse. Track:

- `vyper==…` for `.vy` packages,
- `solc` / Foundry pin for `.sol` packages,
- which artifact is canonical per address.

Cross-link [Solidity](../Solidity/README.md) for the sibling pin culture; keep ownership maps in this repo’s ops docs.

### 7. Pragma is not a substitute for tests

A correct pragma prevents *some* accidental language mismatches. It does not prove invariants. Pins + Titanoboa (or equivalent) tests + review remain the release story (chapters **[03](./03_Toolchain_Vyper_Titanoboa_Brownie.md)**, **[13](./13_Testing_Contracts.md)**).

### 8. Advisory and bump playbooks

When a security advisory or release note lands for your pin:

1. Inventory which deployed bytecode was built with affected versions.
2. Bump in a dedicated PR: lockfile, CI image, docs.
3. Recompile, re-test, re-verify if you redeploy.
4. Record the old pin for historical verification forever.

Ops owns the inventory; engineers own the bump PR.

### 9. What belongs in the lockfile vs the pragma

| Concern | Prefer |
|---------|--------|
| Language band the source is written for | `#pragma version` in every `.vy` |
| Exact binary CI uses | Lockfile / image `vyper==0.4.3` |
| EVM fork ruleset | Pragma and/or CI flag; **prague** default on 0.4.3 |
| Optimize mode | Same channel as EVM—documented once |

Do not rely on “everyone knows we use prague.” Write it where release and verify can find it.

### 10. Reviewer questions that catch pin debt

- Can we rebuild last week’s mainnet bytecode from this commit?
- Does the explorer verify form show the same numbers as CI logs?
- If we bump only Titanoboa, did Vyper drift as a transitive dependency?

If any answer is “we think so,” the pin story is not done.

---

## 3. Applications and use cases

| Angle | How versioning shows up |
|-------|-------------------------|
| **Application** | Feature availability (modules, syntax) depends on band—design against the pin you ship. |
| **Systems** | Mixed Vyper/Solidity monorepos need **two** compiler pins, not one “crypto toolchain” myth. |
| **Security** | Audits list compiler versions; mismatches between claim and CI are findings. |
| **Ops** | Build matrices print `vyper --version` and EVM target; release tags store both; verifiers get the same numbers. |
| **SE** | Onboarding: “where is the pin?” is a day-one question, not a release-week surprise. |

**Whole-engineering picture:** version discipline is how language work becomes **reproducible operations**.

**Release sidecar (minimum):** compiler version, EVM version (explicitly `prague` if default), optimize mode, bytecode hash, ABI hash. If any field is missing from the release notes, the release is incomplete.

---

## 4. Staff-level review checklist

- Sources declare `#pragma version` (or documented legacy `# @version`) compatible with the CI compiler.
- CI installs an **exact** Vyper pin (default **0.4.3** unless policy says otherwise).
- Build logs capture `vyper --version` next to artifacts.
- EVM target is recorded with the pin; **0.4.3** default **prague** is acknowledged or overridden deliberately.
- Optimize mode and experimental flags match between CI and verify.
- 0.3.x code is labeled brownfield; pragma bumps without port notes are rejected.
- Experimental codegen is opt-in with written policy—not silent CI default.
- Solidity and Vyper pins are tracked separately in mixed repos.
- Verification / explorer submissions use the same compiler version and settings as the release build.
- Patch bumps include compile + Titanoboa (or documented suite) green before merge.

---

## References

- [Vyper versioning guideline](https://docs.vyperlang.org/en/stable/versioning.html)
- [Compiling a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Installing Vyper](https://docs.vyperlang.org/en/v0.4.3/installing-vyper.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
