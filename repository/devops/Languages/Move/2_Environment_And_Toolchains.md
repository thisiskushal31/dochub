# Environment and toolchains

[← Back to Move](./README.md)

## What is the “environment”?

The Move **environment** is everything around the source: the **package** layout, the **manifest** (`Move.toml`), compiler and **CLI** versions, target **network** (devnet, testnet, mainnet), and how **dependencies** are resolved. Move does not run as an interactive REPL against live chain state by default; the loop is **edit sources → build → test → publish or submit transactions**. Operators and security teams care about **reproducible builds** (pinned toolchains), **secret handling** (keys for publish), and **which bytecode** actually landed on chain.

## Why does toolchain choice matter?

Wrong CLI or compiler version can produce bytecode that **differs** from what auditors reviewed or what CI emitted. Dependencies pulled from moving Git branches can change behavior under you without a code edit in your repo. For **cybersecurity**, pinned revisions and checksums reduce supply-chain risk; for **operations**, aligned CLI and node/API versions reduce mysterious publish or simulation failures.

## How can I use it?

### Package layout

A package is a directory rooted at a manifest. Sources live under predictable paths; build output is generated and should usually be ignored in version control.

```
a_move_package
├── Move.toml          # name, version, addresses, dependencies
├── sources/           # modules (.move)
├── scripts/           # optional — Aptos / core-style transaction scripts
├── tests/             # optional — #[test] modules
├── examples/          # optional
└── build/             # generated — bytecode, metadata
```

**Move.toml** declares the package name, optional edition, **named addresses** (filled for production or overridden under `[dev-addresses]` for local work only), and **dependencies** (Git URL + branch or revision, or local path). Every named address used in code must resolve in the build you ship.

Example skeleton (names vary by stack; **Aptos** and **Sui** both use this general shape):

```toml
[package]
name = "MyApp"
version = "1.0.0"

[addresses]
my_app = "_"

[dependencies]
# Git dependency with pinned revision recommended for production builds
```

Local-only address overrides often live under **`[dev-addresses]`** so tests compile without committing real publisher addresses.

### Build, test, publish

**Build** type-checks and compiles modules (and scripts where applicable) into bytecode under **build/**. **Test** compiles with test hooks and runs unit tests in Move. **Publish** sends artifacts to a chain: **Aptos CLI** and **Sui CLI** each have their own commands, gas semantics, and package IDs. Simulation and dry-run flows exist on both stacks before spending real fees.

### Dependencies

Prefer **pinned revisions** for Git dependencies. Review transitive packages the same way you review npm or Cargo deps: who maintains them, what types they define, whether they could change under the same version tag.

### Aptos vs Sui commands

- **Aptos:** account creation, `aptos move build`, `aptos move test`, publish to chosen network; workflow assumes **account global storage** and scripts where used.
- **Sui:** `sui move build`, `sui move test`, publish; workflow assumes **objects** and **entry** / **PTB**-driven calls.

Pick one stack for a given product; mixing artifacts in one package without discipline causes confusion.

### Unit tests

The compiler exposes a **test** mode: **`#[test]`** marks functions the harness runs; **`#[test_only]`** keeps helpers out of production bytecode; **`#[expected_failure]`** asserts that a test aborts (optionally with a given code). Tests usually live under **`tests/`** or in **`#[test_only]`** modules.

```move
#[test]
fun two_plus_two() {
    assert!(2u64 + 2u64 == 4u64, 0);
}
```

**`signer`**-bearing tests use **`#[test(arg = @0xC0FFEE)]`**-style annotations so the harness injects addresses. Run via **`aptos move test`**, **`sui move test`**, or the legacy Move CLI **`move test`** depending on the stack.

### Standard library

Core Move ships **modules** such as **`vector`**, **`option`**, **`string`**, **`signer`**, **`bcs`**, and math helpers. Chains publish **additional** framework modules on-chain. You **`use`** std modules by name; exact paths differ slightly between Aptos and Sui editions—follow your stack’s prelude and framework docs.

## What are the use cases?

- **Software engineering:** local development, IDE integration, shared Make/CI jobs that run `move test` on every push.
- **Security:** reviewing `Move.toml` and lockfiles, auditing dependency repos, ensuring production builds use the same compiler as audit.
- **Operations:** release pipelines that promote bytecode from CI to staging to mainnet, key management for publish transactions, network selection and RPC health.

---

## Further reading

- [Move Book — Packages](https://move-language.github.io/move/packages.html)
- [Move Book — Unit tests](https://move-language.github.io/move/unit-testing.html)
- [Move Book — Standard library](https://move-language.github.io/move/standard-library.html)
- [Move Book — Creating coins (tutorial)](https://move-language.github.io/move/creating-coins.html)
- [Aptos — Build](https://aptos.dev/build)
- [Sui — Build with Move](https://docs.sui.io/build/move)
