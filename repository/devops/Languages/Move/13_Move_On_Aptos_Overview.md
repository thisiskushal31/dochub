# Move on Aptos: overview and when to use

[← Back to Move](./README.md)

## What is Move on Aptos?

**Move on Aptos** is an active Move implementation for an **account-centric** blockchain runtime. It keeps the core Move language model (resources, abilities, references, bytecode verification) and adds Aptos-specific execution and framework patterns: account resources, package publishing policy, transaction validation, and high-throughput execution strategies discussed in Aptos topics.

If core topics **1–12** taught the language, this topic answers the platform question: what changes when that language runs on Aptos.

## Why do teams choose Aptos?

Teams usually pick Aptos when they want:

- **Account/resource mental model** that feels natural for wallets, compliance logic, and ledger-style products.
- **Strong package governance** with explicit upgrade policy (compatible/immutable style policies in framework code paths).
- **Mature framework surface** (`0x1` modules for account, coin/FA, code publishing, fees, validation).
- **Throughput focus** with parallel execution architecture while preserving deterministic state transitions.

From a whole-engineering view: product teams get predictable account APIs, security teams get explicit signer/capability boundaries, and operations teams get clear deploy/upgrade workflows.

## How is Aptos different from core Move and Sui?

At a high level:

- **Core Move (legacy reference):** language semantics and VM model.
- **Aptos:** account-addressed storage and transaction-centric execution over that storage.
- **Sui:** object-centric storage and PTB-first composition model.

Aptos still uses the Move global storage operators (`move_to`, `borrow_global`, etc.) and account-address scoping as first-class patterns. This matters for schema design, indexer assumptions, and access-control style.

## Aptos architecture lenses (beginner to advanced)

### 1) Data and code layout

Each account address can hold:

- **Resources** keyed by type
- **Published modules/packages** keyed by module/package metadata

Aptos framework modules expose package metadata and policy concepts (e.g., package registry, upgrade policy), which shape real deployment governance.

### 2) Transaction lifecycle

A transaction path is roughly:

1. **Prologue/validation** checks (auth, replay protection, gas constraints, etc.).
2. **VM execution session** over a stable state view.
3. **Epilogue/fee handling** and state effects commit.

The exact prologue/epilogue wiring is chain/framework-specific and not identical to other Move chains.

### 3) Account authority and capabilities

Aptos combines **`signer` authority** with framework capabilities (rotation, signer capability patterns, resource accounts) for controlled automation and contract-account operations.

### 4) Package publishing and upgrades

Aptos framework code paths expose explicit publishing and upgrade policy checks. In practice, teams design around:

- Who can publish
- Compatibility expectations
- Immutable vs upgradable package strategy
- Dependency constraints

## Minimal Aptos-flavored module shape

Text first: this snippet is only a shape reference for Aptos-style account storage flow.

```move
module 0xCAFE::counter {
    use std::signer;

    struct Counter has key { n: u64 }

    public fun init(account: &signer) {
        move_to(account, Counter { n: 0 });
    }

    public fun bump(account: &signer) acquires Counter {
        let addr = signer::address_of(account);
        let c = borrow_global_mut<Counter>(addr);
        c.n = c.n + 1;
    }
}
```

This account-scoped pattern is canonical for Aptos-oriented Move tutorials and framework usage.

## When should you choose Aptos?

Prefer Aptos when your design benefits from:

- Account-centric permissioning and policy controls
- Stable package lifecycle governance
- Strong audit and verification discipline around transaction flows
- Team familiarity with account-based chain operations and tooling

If your product is fundamentally object-graph centric with PTB-heavy composition, evaluate Sui topics **20–27** in parallel before deciding.

## Engineering checklist before committing to Aptos

- **Application:** confirm account-scoped resources map cleanly to your domain model.
- **Systems:** benchmark throughput under your conflict profile (hot accounts/resources matter).
- **Security:** define signer/capability boundaries and upgrade policy early.
- **Operations:** pin CLI/compiler versions and formalize publish/rollback runbooks.

---

## Further reading

- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos Move developer](https://aptos.dev/network/blockchain/move)
- [Aptos — Smart contracts](https://aptos.dev/build/smart-contracts)
- [Aptos framework modules](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework)
