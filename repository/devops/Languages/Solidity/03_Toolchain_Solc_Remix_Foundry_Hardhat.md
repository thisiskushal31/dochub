# Toolchain: solc, Remix, Foundry, and Hardhat

[← Back to Solidity](./README.md)

## What this chapter covers

The tools you will actually run: **`solc`**, **Remix** (doorway IDE), **Foundry** and **Hardhat** (production test/deploy), plus how they relate to **OpenZeppelin**, explorers, and JS/TS clients. Exists/missing per tool, so you do not pretend one stack is the whole world.

Assumes **Solidity 0.8.x** / snapshot **0.8.36**.

Remix is the microscope: you watch one contract live. Foundry and Hardhat are the workshop: the same compile, a hundred times, with tests. `solc` is the engine inside all three. You are allowed to love Remix and still refuse to release from it.

---

## 1. Concepts

### 1. What must exist in any serious workflow

| Job | Tool-shaped answer |
|-----|--------------------|
| Compile | `solc` (directly or wrapped) |
| Test | Foundry `forge test` and/or Hardhat `npx hardhat test` |
| Local chain | Anvil or Hardhat Network |
| Scripted deploy | `forge script` or Hardhat deploy scripts |
| Read/write from a shell | Foundry `cast` or a small JS/TS script |
| Click-around learning | Remix |

Missing any of compile + test + pin is not a “lightweight setup.” It is an unfinished one.

### 2. solc is the language compiler

`solc` turns Solidity into **bytecode**, **ABI**, and **metadata**. You can install it via:

- Foundry’s `svm` / `forge` (downloads solc as needed),
- Hardhat (solc-js or native, from config),
- OS packages / Docker / `solc-select`,
- Remix (browser build).

```bash
solc --version
solc --bin --abi --optimize --evm-version cancun Hello.sol
```

| Flag (idea) | Why it exists |
|-------------|---------------|
| `--bin` / `--abi` | Artifacts wallets and scripts need |
| `--optimize` / `--optimize-runs` | Codegen tradeoff (chapter **16**) |
| `--evm-version` | Hard-fork target |
| `--via-ir` | IR pipeline |
| `--standard-json` | The machine API CI and Hardhat use |

You rarely type all of that by hand once Foundry/Hardhat wrap it—but **incidents** still come down to “what solc flags produced this bytecode.”

### 3. Remix — doorway, not factory

**Remix** gives you an editor, compiler picker, debugger, and Remix VM. Use it to:

- learn compile → deploy → call,
- inspect a single function’s ABI,
- debug a revert on a tiny contract.

Do **not** use it as the only record of compiler settings for a funded deploy. Export or re-compile in the repo toolchain before you treat bytecode as official.

### 4. Foundry — Solidity-native tests and scripts

**Foundry** is a Rust-speed toolkit:

| Binary | Job |
|--------|-----|
| `forge` | Build, test, fmt, script, coverage |
| `cast` | RPC Swiss army knife (call, send, decode, keccak) |
| `anvil` | Local node (optionally fork) |
| `chisel` | Solidity REPL |

```bash
# Install Foundry from the official installer (getfoundry.sh), then:
foundryup
forge init myproj
forge build
forge test -vvv
```

Tests are **Solidity contracts** (`*.t.sol`) using `forge-std`. That is the point: the same language, cheatcodes for time/pranks/storage, fuzzing without leaving the repo.

`foundry.toml` is where `solc` version, `evm_version`, optimizer, and via-IR belong.

```toml
[profile.default]
src = "src"
out = "out"
solc_version = "0.8.36"
evm_version = "cancun"
optimizer = true
optimizer_runs = 200
```

Same facts in Hardhat live under `solidity: { version: "0.8.36", settings: { evmVersion: "cancun", optimizer: { enabled: true, runs: 200 } } }`. The file format changes; the sentence does not: **name the compiler, the fork, and the optimizer.**

### 5. Hardhat — JS/TS-native tests and plugins

**Hardhat** is a Node toolchain: compile, a local network, `ethers`/`viem` tests, and a large plugin ecosystem (verify, upgrades, gas reporter).

```bash
npm init -y
npm install --save-dev hardhat
npx hardhat init
npx hardhat compile
npx hardhat test
```

Choose Hardhat when the team already lives in TypeScript, needs those plugins, or shares test helpers with a dapp repo. Choose Foundry when you want Solidity tests, fuzzing defaults, and fast CI. **Many teams run both**: Foundry for invariant/fuzz, Hardhat for integration with a TS app. That is allowed. Pretending the other does not exist is not.

### 6. What each stack is bad at (exists / missing)

| Need | Remix | Foundry | Hardhat |
|------|-------|---------|---------|
| First 20 minutes | Excellent | After install | After Node/npm |
| Solidity unit + fuzz | Weak | Excellent | Plugins / extra work |
| TS dapp integration tests | Weak | Via FFI/cast | Excellent |
| Upgrade plugin culture | No | Possible, less “one plugin” | Strong (OZ plugins) |
| CI as source of truth | No | Yes | Yes |
| Debugger UX for beginners | Strong | `forge debug` / traces | Hardhat traces |

### 7. Ecosystem tools (lanes, not this chapter’s product manuals)

| Tool | Lane |
|------|------|
| **OpenZeppelin Contracts** | Implementations of common interfaces (use as dependency, not copy-paste folklore) |
| **Slither** | Static analysis (chapter **19**) |
| **Solhint** | Lint / style |
| **ethers.js / viem** | JS/TS clients |
| **cast** | Shell client |
| Explorer **verify** APIs | Source attestation (chapter **20**) |

---

## 2. Advanced concepts

### 1. Standard JSON is the real compiler API

GUIs and wrappers eventually send **Standard JSON** to `solc`. The input you should be able to name:

```json
{
  "language": "Solidity",
  "sources": { "src/V.sol": { "content": "..." } },
  "settings": {
    "optimizer": { "enabled": true, "runs": 200 },
    "viaIR": false,
    "evmVersion": "cancun",
    "remappings": ["@openzeppelin/=lib/openzeppelin-contracts/"],
    "outputSelection": { "*": { "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"] } },
    "metadata": { "bytecodeHash": "ipfs" }
  }
}
```

If verification fails, diff **this** JSON — not your memory of a Remix checkbox. `solc --standard-json` is what Foundry/Hardhat wrap.

Outputs that matter: `abi`, `evm.bytecode.object` (creation), `evm.deployedBytecode.object` (runtime), `metadata` (JSON string whose hash is in the CBOR tail).

### 2. Remappings and node_modules

Foundry: `remappings.txt` / `foundry.toml` (`@openzeppelin/=lib/openzeppelin-contracts/`).  
Hardhat: Node resolution (`@openzeppelin/contracts`).

Broken remaps compile *your* file against a *different* OZ than the lockfile. Treat remappings as supply chain. `forge remappings` prints what the compiler actually sees.

### 3. Nightly Foundry vs stable

`foundryup` can track nightly. Nightly cheatcodes move. CI should print `forge --version` and prefer a **known** tag for release pipelines.

### 4. Node LTS vs solc-js vs native solc

Hardhat may use a JavaScript solc or a native binary. Same version number ≠ identical binary. Performance and occasional edge bugs differ. Record which. Foundry’s `solc` is typically a native official build downloaded by version.

### 5. Docker and air-gapped CI

Do not `curl | bash` on a production runner as the only install story. Vendor a Foundry release, use a pinned image, or install `solc` from a known artifact. The handbook’s install one-liners are for **laptops**.

### 6. `cast` as the ABI/runtime scalpel

Staff-level debugging is often not a new test — it is:

```bash
cast sig "transfer(address,uint256)"
cast calldata "transfer(address,uint256)" 0x… 1ether
cast 4byte 0xa9059cbb
cast abi-decode "transfer(address,uint256)" <calldata without selector>
cast storage <addr> 0
cast index address <key> 0
```

Those commands are how you connect chapters **12** / **14** / **21** to a live address.

---

## 3. Applications and use cases

| Situation | Practical default |
|-----------|-------------------|
| Learning the language | Remix VM + this track |
| New protocol / library | Foundry first (`forge test` + fuzz) |
| Dapp monorepo with TS | Hardhat or Hardhat+Foundry |
| Incident: “what did this selector do?” | `cast` / explorer + ABI |
| Regulated release | Pinned solc + locked deps + verify |

---

## 4. Staff-level review checklist

- [ ] Repo documents **how to compile and test in one page** (Foundry, Hardhat, or both).
- [ ] `solc` version is in **config**, not only in tribal Slack.
- [ ] Remix is not the release compiler of record.
- [ ] Install instructions for CI do not depend on an unpinned nightly or a raw pipe-to-shell on shared runners.
- [ ] If both Foundry and Hardhat exist, **each** has a stated job (fuzz vs TS integration)—not two drifting sources of truth.
- [ ] Remappings / npm lockfile are reviewed like application code.

---

## References

- [Installing the Solidity compiler](https://docs.soliditylang.org/en/v0.8.36/installing-solidity.html)
- [Using the compiler](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [Foundry](https://getfoundry.sh/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Hardhat documentation](https://hardhat.org/docs)
- [Hardhat getting started](https://hardhat.org/hardhat-runner/docs/getting-started)
- [Remix IDE documentation](https://remix-ide.readthedocs.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [ethers.js](https://docs.ethers.org/)
- [viem](https://viem.sh/)
