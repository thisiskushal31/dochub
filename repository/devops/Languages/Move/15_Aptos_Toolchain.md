# Aptos toolchain (CLI, build, test, deploy)

[← Back to Move](./README.md)

## What is the Aptos toolchain?

The Aptos toolchain is the set of tools you use to author, test, verify, and publish Move packages on Aptos networks. The center of day-to-day work is the **Aptos CLI** with Move subcommands, plus network configuration and key management.

## Why toolchain discipline matters

On-chain code is hard to undo. Toolchain drift causes real incidents:

- bytecode mismatch between local and CI
- publish failures from wrong network profile or account
- hidden dependency changes from unpinned refs
- security regressions when tests/prover are skipped under release pressure

A good Aptos workflow is reproducible, auditable, and easy to operate under incident pressure.

## How to work (practical loop)

Typical loop:

1. Initialize or open package
2. Build
3. Test
4. (Optional but recommended) Prove/advanced checks
5. Simulate where possible
6. Publish with correct profile/account
7. Verify on-chain metadata and run smoke tests

## Project layout and manifest

Aptos Move packages follow standard Move package structure (`Move.toml`, `sources/`, optional `tests/`, `scripts/`, `examples/`).

Minimal manifest skeleton:

```toml
[package]
name = "my_aptos_pkg"
version = "0.0.1"

[addresses]
my_aptos_pkg = "_"

[dependencies]
# Prefer pinned revisions for reproducible CI
```

Use `[dev-addresses]` for local/test values so production address bindings remain explicit.

## Core Aptos CLI commands

The exact command set evolves, but this is the stable mental model:

```bash
# create package
aptos move init --name my_aptos_pkg

# compile
aptos move compile

# run unit tests
aptos move test

# run formal verification (if prover/tooling is installed)
aptos move prove
```

You will also use account/network commands to select profile, fund test accounts, and submit publish transactions.

## Testing strategy (basic to advanced)

- **Unit tests:** `#[test]`, `#[expected_failure]`, `#[test_only]`
- **Behavior tests:** include abort-code and permission boundary tests
- **Coverage-aware checks:** ensure critical authorization paths are exercised
- **Regression gates in CI:** build + test required before publish

Simple test shape:

```move
#[test(account = @0xC0FFEE)]
fun test_register(account: &signer) {
    // setup + assertion
}
```

## Formal verification in Aptos workflows

Aptos documentation and examples include Move Prover paths. In security-sensitive modules, treat proving as part of release quality, not optional polish:

- define abort conditions
- prove key invariants (supply, ownership, policy constraints)
- keep specs updated with logic changes

## Publish and upgrade workflow

Operationally, publish means more than “command succeeded”:

1. confirm profile/account/network
2. confirm package metadata and dependency expectations
3. publish
4. verify package state/metadata and entrypoint behavior
5. record release artifact hashes and CLI/compiler versions

For upgrades, align with Aptos package policy model (compatible/immutable constraints, dependency rules, ownership authority).

## Security and operations checklist

- **Keys:** separate deploy keys, admin keys, and emergency governance keys where policy allows.
- **Profiles:** prevent accidental mainnet publish by profile hardening in CI.
- **Dependencies:** pin revisions, review transitive packages.
- **Observability:** monitor failed txns/abort codes immediately after deploy.
- **Runbooks:** codify rollback/freeze/escalation paths before first mainnet release.

## Common failure modes

- unresolved named addresses in manifest
- wrong profile/network endpoint
- package upgrade policy mismatch
- missing resource registration assumptions in tests
- dependency API drift after unpinned updates

---

## Further reading

- [Aptos — Build](https://aptos.dev/build)
- [Aptos CLI](https://aptos.dev/tools/aptos-cli)
- [Move Book — Packages](https://move-language.github.io/move/packages.html)
- [Move Book — Unit testing](https://move-language.github.io/move/unit-testing.html)
- [Aptos move tutorial](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples/move-tutorial)
