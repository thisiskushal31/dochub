# Sui toolchain (CLI, build, test, deploy)

[← Back to Move](./README.md)

## What is the Sui toolchain?

The Sui toolchain is the practical stack you use to build, test, publish, and operate Move packages on Sui. For most teams, the center is:

- `sui` CLI
- Move package files (`Move.toml`, source tree, lock files)
- local environment (`localnet`) and remote networks (devnet/testnet/mainnet)

## Why toolchain discipline matters

Move code safety is only part of production quality. You also need reproducibility, dependency pinning, reliable CI commands, and release governance.

Good toolchain hygiene prevents:

- "works on my machine" build drift
- accidental dependency upgrades
- unsafe package publish/upgrade flows

## Core commands you use every day

Text first: common command flow in package development:

```bash
sui move new my_pkg
cd my_pkg
sui move build
sui move test
```

Typical lifecycle adds:

- `sui move test --coverage`
- `sui move build --dump-bytecode-as-base64` (when needed for diagnostics/integration)
- client-side publish/upgrade transaction flows

## Package layout and manifests

A typical Move package includes:

- `Move.toml` for package metadata and dependencies
- `sources/*.move` for modules
- `tests/*.move` for unit tests
- `Move.lock` for dependency resolution lock state

Teams should commit lock files and pin dependency revisions for deterministic CI.

Text first: minimal `Move.toml` sketch:

```toml
[package]
name = "my_pkg"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
my_pkg = "0x0"
```

## Localnet, devnet, and release progression

A practical rollout path:

1. **Localnet:** rapid iteration, deterministic test loops.
2. **Devnet/Testnet:** integration with wallet/client/indexer flows.
3. **Mainnet:** controlled publish/upgrade after review and policy checks.

Operationally, keep separate profiles, wallets, and gas budgets per environment.

## Testing strategy

Use layered testing:

- **Unit tests** in Move for module invariants and negative paths.
- **Integration tests** through client/PTB calls for end-to-end object flows.
- **Gas-aware tests** for shared object contention and high-frequency paths.

## Publish and upgrade workflow

On Sui, packages are publishable/upgradable objects with capability-based governance. Production teams should:

- define an explicit release authority model (multisig/custody)
- enforce review gates before publish/upgrade
- document rollback and incident procedures

Text first: high-level publish and test invocation sketch:

```bash
# Compile and test first
sui move build
sui move test

# Then publish/upgrade via your approved transaction workflow
# (wallet or CI signer flow, depending on team policy)
```

## Common pitfalls to avoid

- Using floating dependency refs instead of pinned revisions.
- Mixing network profiles during publish.
- Treating shared-object performance as an afterthought.
- Deferring upgrade governance design until after first release.

---

## Further reading

- [Sui — Build with Move](https://docs.sui.io/build/move)
- [Sui CLI reference](https://docs.sui.io/references/cli)
- [Sui Move CLI](https://docs.sui.io/references/cli/move)
- [Move package management on Sui](https://docs.sui.io/guides/developer/sui-101/move-package-management)
