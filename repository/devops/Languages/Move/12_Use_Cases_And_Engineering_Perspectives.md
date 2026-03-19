# Use cases and engineering perspectives

[← Back to Move](./README.md)

## What is this topic for?

After **topics 1–11**, you have language, storage (for Aptos-style Move), references, functions, generics, VM, and audit patterns. This topic **ties Move to real work**: who builds what, what problems appear in each discipline, and how **basic → advanced** learning maps to **shipping and securing** systems.

## Why whole-engineering coverage?

Move sits in **Web3** stacks where **software engineers**, **security engineers**, **SREs**, and **product** teams interact. No single role owns “the contract.” Clear handoffs (API surface, upgrade policy, monitoring) reduce incidents.

## How do roles engage with Move?

| Lens | Typical focus |
|------|----------------|
| **Application / product** | User flows, entry points, asset design, gas cost to users, UX of errors |
| **Software engineering** | Module design, testing, refactors, SDK integration |
| **Systems** | VM performance, parallel execution characteristics, RPC and indexer behavior |
| **Security / cybersecurity** | Threat modeling, audits, key management, dependency supply chain |
| **Operations** | CI/CD for packages, network promotion, incident response, on-call runbooks |

**Beginners** should follow topics **1 → 12** in order, then choose **Aptos (13–19)** or **Sui (20–27)** before **comparison (28)**.

## What are representative use cases?

- **Fungible tokens** and **treasury** logic (mint/burn/transfer with caps).
- **NFTs** and **game items** (often object-heavy on Sui).
- **DeFi** primitives (pools, lending)—high audit and economic scrutiny.
- **Governance** and **multisig-controlled** upgrades.
- **Enterprise** workflows favoring account-centric models and verification tooling (common on Aptos-flavored deployments).
- **High-throughput consumer apps** favoring object-centric batching (common on Sui-flavored deployments).

**Fungible token (Aptos-style sketch):** balance per address, typed by phantom currency marker:

```move
struct Coin<phantom C> has store { value: u64 }
struct Balance<phantom C> has key { coin: Coin<C> }

public fun publish<C>(account: &signer) {
    move_to(account, Balance<C> { coin: Coin<C> { value: 0 } });
}
```

**NFT-style record (same storage model):** one **`key`** resource per collection item per owner, or a table keyed by id—design varies by product.

**Sui-style object:** types with **`key`** get a unique **`UID`** at creation; **`public entry`** transfers or mutates those objects in one PTB—see topics **20–27**.

Most nontrivial packages lean on the **standard library** (**`vector`**, **`option`**, **`string`**, encoding helpers) plus chain **framework** modules for coins, objects, and system hooks. The tutorial-style **creating coins** flow walks from publish through mint and balance—useful as an end-to-end mental model after topics **1–11**.

Use cases are **not** DevOps-only: they span **application security**, **platform reliability**, and **compliance-aware** design where applicable.

---

## Further reading

- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
- [The Move Book — Creating coins](https://move-language.github.io/move/creating-coins.html)
- [Standard library](https://move-language.github.io/move/standard-library.html)
