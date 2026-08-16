# Compiling, deploying, and ABI literacy

[← Back to Vyper](./README.md)

## What this chapter covers

How a `.vy` file becomes **bytecode + ABI**, what you must **pin** for reproducible builds, deploy literacy (without a vendor tutorial), and the **verify** door for explorers. Assumes **Vyper 0.4.x** (pin **0.4.3**).

Clients only know what you publish. Compiler version and EVM target are part of the contract job—not footnotes. For **0.4.3**, the compiler’s default EVM version is **prague**—treat that as literacy you record even when you keep the default.

Shared bytecode/ABI machine picture: [Solidity](../Solidity/README.md). Vyper CLI flags and artifact habits below. Testing the result: chapter **[13](./13_Testing_Contracts.md)**. Pins: chapter **[02](./02_Versions_Pragmas_And_Pins.md)**.

---

## 1. Concepts

### 1. What “compile” produces

The Vyper compiler turns sources (and imports/modules) into:

| Artifact | Why you care |
|----------|----------------|
| **Bytecode** (init + runtime) | What you deploy and what lives at the address |
| **ABI** (JSON) | How wallets, bots, and tests encode calls and events |
| **Metadata / layout** (when requested) | Verification, storage audits, upgrade planning |
| **Method identifiers** | Selector map for debugging and client checks |
| **Warnings / errors** | Version, type, and module well-formedness |

Staff sentence: **source + compiler version + settings = artifact.** Change any input, treat it as a new build.

### 2. Pin the compiler and the EVM target

```bash
vyper --version
python -c "import vyper; print(vyper.__version__)"
```

In source:

```vyper
#pragma version ^0.4.0
# optional: #pragma evm-version prague
# optional: #pragma optimize gas|codesize|none
```

Default: **0.4.3 / 0.4.x** in CI, locked the same way you lock any other build tool.

**Prague default literacy (0.4.3):** if you do not set `#pragma evm-version` or `--evm-version`, the compiler targets **prague**. Supported fork labels in this line include london, paris, shanghai, cancun, and prague (default). Compiling for the wrong EVM version can produce wrong or failing behavior—especially on private chains. Record the target beside the Vyper pin even when it is “prague by default.”

Optimization mode (`gas` default, `codesize`, `none`) must match between CI and the build you verify on an explorer. If CLI/JSON settings conflict with source pragmas, compilation should refuse—fix the conflict deliberately.

### 3. CLI literacy (not a flag encyclopedia)

Typical jobs:

```bash
vyper contract.vy
vyper -f abi,bytecode contract.vy
vyper -p interfaces/ -p modules/ contract.vy
vyper --evm-version prague --optimize gas contract.vy
```

- Compile a contract path; add `-p` for import search paths (modules/interfaces).
- Emit ABI-only or combined outputs depending on your pipeline.
- Prefer project-standard JSON / archive workflows when multiple files and paths must be hermetic.

Search path defaults can include environment discoverability for installed packages—**pin and vendor** what production builds import. Disable casual sys-path surprises in CI when policy requires hermeticity.

### 4. ABI is the product boundary

The ABI lists functions, events, and types clients use. It must match:

- what you **exported** from modules (chapter **[11](./11_Interfaces_And_Modules.md)**),
- what NatSpec promises (chapter **[10](./10_Events_And_NatSpec.md)**),
- what Titanoboa tests call (chapter **13**),
- mutability decorators (chapter **[08](./08_Functions_Visibility_And_Mutability.md)**).

Changing an external signature or event layout is a **client-breaking** release. Publish the ABI artifact next to the address and compiler metadata.

### 5. Deploy literacy

Deploy means: submit **creation transaction** with initcode (constructor/deploy function args ABI-encoded as required), receive an **address**, then treat that address as immutable code for practical purposes unless you deliberately built an upgrade story.

Checklist before mainnet:

1. Compiler pin and settings recorded (Vyper version, EVM target, optimize mode).
2. Constructor/immutables arguments reviewed (wrong admin = permanent).
3. ABI and bytecode hashes stored with the release.
4. Verification plan named (explorer / Sourcify-style door).
5. Client apps pointed at the new address + ABI together.
6. Titanoboa (or documented) suite green on the same pin.

You do not need a specific wallet brand to understand the job—you need ownership of artifacts.

### 6. The verify door

Verification publishes source (or metadata) so third parties can match bytecode. Staff habit:

- Verify with the **same** Vyper version and settings used to deploy—including **prague** (or your override) and optimize mode.
- Include import/module layout the compiler saw.
- Treat “verified” as **transparency**, not as a security audit.

If verification fails, fix the build reproducibility story—do not shrug and leave production unverified without a recorded exception.

---

## 2. Advanced concepts

### 1. Initcode vs runtime

Creation bytecode runs once (deploy/`__init__` / module inits). Runtime bytecode answers calls. Factories (`create_*`, chapter **[09](./09_Built_In_Functions.md)**) blur intuition—document which address holds implementation vs proxy vs blueprint.

### 2. Storage layout outputs

When modules `initializes` state, layout is part of the compilation story. Export layout JSON when you need upgrade reviews or storage audits. Reordering `initializes` is a layout change.

### 3. Experimental codegen / Venom

`#pragma experimental-codegen` (Venom-related experimental path) is an **opt-in** compiler door. Do not flip it in production CI without policy, golden tests, and a rollback pin. Direction of travel is covered in chapter **[16](./16_Where_Vyper_Is_Going_And_Adjacent_Doors.md)**; default narrative remains stable **0.4.x** codegen.

### 4. Archives and hermetic inputs

For multi-module projects, prefer compiler inputs that freeze sources and paths (archive / standard-json style flows in current docs). Reproducible verify depends on hermetic inputs more than on tribal knowledge of “it compiled on my laptop.”

JSON interface settings commonly carry `evmVersion` (default **prague** on 0.4.3), optimize mode, and output selection for ABI/bytecode—keep the checked-in settings file identical to CI.

### 5. Brownfield 0.3.x

Older pins and pragma styles (`# @version`) still appear in production. Never mix “I compiled with latest” and “they deployed with 0.3.x” when verifying. Porting forward is a release, not a silent toolchain bump.

### 6. What to hand a client engineer

Ship a small bundle, not a lore dump:

- address (per chain),
- ABI JSON,
- compiler version + EVM target (**prague** or override) + optimize mode,
- bytecode hash (creation and/or runtime as your process defines),
- event names that dashboards must index.

[TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) consumers should treat that bundle as the source of truth. If the app repo re-types the ABI by hand, expect drift.

### 7. Artifact store discipline

Release jobs should upload artifacts to a durable store (object storage, release asset, append-only registry). Chat paste of ABI hex is not a store. Incident response needs “bytecode hash for address X on chain Y” in minutes.

### 8. Release sidecar template (minimum fields)

Record at least:

- git commit SHA,
- `vyper` version (e.g. **0.4.3**),
- EVM version (**prague** or override),
- optimize mode,
- creation bytecode hash,
- runtime bytecode hash (if distinct in your process),
- ABI hash or ABI artifact URI,
- constructor/immutable args (decoded),
- verify URL or exception ticket.

If a field is missing, verification and incident response both slow down.

### 9. Common verify failures (ops literacy)

| Symptom | Likely cause |
|---------|----------------|
| Bytecode mismatch | Different Vyper patch or optimize mode |
| Opcode surprises | EVM target mismatch (forgot **prague** vs older fork) |
| Import errors on verify | Missing module/interface sources or paths |
| Metadata mismatch | Experimental flags only on one side |

Fix reproducibility; do not “verify close enough.”

---

## 3. Applications and use cases

| Role | Owns |
|------|------|
| **Contract engineer** | Pragma, exports, clean compile in CI |
| **Client engineer** | ABI consumption in TS/JS; address book discipline |
| **Ops / release** | Pins, artifact storage, verify submission |
| **Security reviewer** | Matching bytecode ↔ claimed source; settings honesty |
| **Integrator** | Immutable expectation: new bug ⇒ new deploy (unless upgrade design exists) |

**Smell:** ABI checked into the app repo with no compiler version. The next patch compile will drift silently.

**Smell:** “We deploy with prague defaults” said verbally but never written in the release sidecar.

---

## 4. Staff-level review checklist

- CI pins Vyper **0.4.x** (patch recorded) and EVM target.
- **0.4.3** prague default is acknowledged in docs/release notes or overridden deliberately.
- Optimize mode and experimental flags match deploy/verify.
- Import paths / modules hermetic; no mystery packages.
- ABI artifact published with address and bytecode hash.
- Constructor args and admin addresses double-checked.
- Verification planned with identical compiler settings.
- Module storage layout considered if upgrades exist.
- Clients updated atomically with address + ABI.
- Optimize mode chosen deliberately (`gas` vs `codesize` vs `none`); hot entrypoints re-measured after changes (chapter **19**).
- Artifact store location is known to ops—not only to one engineer.

---

## References

- [Compiling a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Deploying contracts (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/deploying-contracts.html)
- [Versioning guideline](https://docs.vyperlang.org/en/stable/versioning.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
