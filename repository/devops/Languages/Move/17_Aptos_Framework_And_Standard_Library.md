# Aptos framework and standard library

[← Back to Move](./README.md)

## What are the Aptos framework and stdlib layers?

On Aptos, your Move code builds on two major on-chain libraries:

- **Move stdlib layer** (core language utilities, collections, crypto helpers)
- **Aptos framework layer** (`0x1` modules for accounts, coins/fungible assets, code publishing, fees, governance, validation, and more)

Think of this as your platform API surface: contracts rarely operate in isolation from these modules.

## Why this matters in real projects

Framework choice determines:

- how accounts are created and managed
- how assets move and are registered
- how code is published/upgraded
- how fees, validation, and events are integrated

Security reviews and operational runbooks should always include framework module dependencies, not just your package code.

## How to navigate the layers

### Move stdlib (Aptos-shipped)

Common capabilities include:

- `vector`, tables/maps, options
- serialization helpers and type info
- cryptography primitives and signature utilities

Use these for reusable data and cryptographic logic without reinventing low-level machinery.

### Aptos framework (`0x1`)

High-impact modules include:

- **`account` / `aptos_account`**: account lifecycle, transfer patterns, capability flows
- **`code`**: package metadata, publish transaction path, upgrade policies
- **`coin` / fungible asset modules**: token/value plumbing
- **`transaction_validation` / `transaction_fee`**: prologue/epilogue and fee handling hooks
- **`resource_account`**: contract-owned account patterns

## Code publishing and upgrade policy (key concept)

Aptos framework exposes explicit package policy helpers (compatibility/immutability style). That means upgrades are governance decisions, not accidental side effects.

Illustrative policy shape:

```move
module 0x1::code {
    // Conceptual: real module is in Aptos framework.
    // upgrade_policy_compat() / upgrade_policy_immutable() style helpers
}
```

In practice, package metadata tracks upgrade number, dependencies, and policy constraints.

## Account and capability patterns

Aptos framework supports capability-oriented account management (rotation/signer capabilities, resource accounts, delegated permissions). This is useful for multisig/governance workflows and protocol-owned infrastructure.

## Security and cybersecurity perspective

Treat framework calls as trusted computing base edges:

- verify assumptions on permissions and signer usage
- pin to documented module behavior per network release
- re-check invariants on framework upgrades/forks

A large portion of Aptos incidents are integration and policy mistakes around framework expectations, not raw syntax bugs.

## Operations perspective

- capture framework module versions and assumptions in release docs
- include framework-dependent smoke tests after publish
- track deprecations and migration notes in Aptos releases

## Example: framework-aware transfer wrapper

```move
module 0xCAFE::payments {
    use std::signer;

    // Illustrative wrapper: real transfers often call aptos_account/coin/fa modules.
    public entry fun pay(_from: &signer, _to: address, _amount: u64) {
        // integrate framework transfer APIs + policy checks
    }
}
```

The point is architectural: your module owns business rules; framework modules own platform primitives.

---

## Further reading

- [Aptos Framework (GitHub)](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework)
- [Aptos — Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos standard library docs](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-stdlib/doc)
- [Aptos framework docs index](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-framework/doc)
