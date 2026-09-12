# Aptos account model and global storage

[← Back to Move](./README.md)

## What is the Aptos account/storage model?

Aptos uses an **account-addressed** state model: data and code are organized around addresses, and Move resources are stored under those addresses by type. This is the practical, chain-level realization of the core Move global storage model.

If you already read [Global storage](./6_Global_Storage.md), this topic is the Aptos-specific engineering layer: account resources, account authority patterns, transaction sequencing, and package metadata behavior.

## Why this model matters

The account model affects almost every engineering decision:

- **API design:** many entry points naturally take `&signer` or `address`.
- **Data modeling:** one top-level resource type per account address (per type).
- **Indexing:** account/resource maps are straightforward to query and monitor.
- **Security:** signer authority + capability delegation patterns are explicit.

For teams from EVM/account-based systems, this model is often easier to operationalize than object-graph-first systems.

## How storage works on Aptos

At a high level, each address hosts:

- **Module code** (published packages/modules)
- **Resource instances** keyed by Move type

The five core operators remain the working set:

| Operator | Aptos usage |
|---|---|
| `move_to<T>(&signer, T)` | publish resource under signer address |
| `move_from<T>(address)` | remove resource |
| `borrow_global<T>(address)` | immutable read |
| `borrow_global_mut<T>(address)` | mutable write |
| `exists<T>(address)` | existence guard |

These operators are constrained by the type system and verifier (e.g., `key`, module ownership of resource type, acquires discipline).

## Account resource concepts you should know

Aptos framework account modules expose concepts that matter operationally:

- **Authentication key** and key rotation flows
- **Sequence number** (replay/order mechanics)
- **Capability-based delegation** (e.g., signer capability, rotation capability patterns)
- **Resource accounts** for contract-managed authority and package ownership strategies

You do not need all details on day one, but production systems eventually rely on these mechanics.

## Aptos-flavored storage flow (register + mutate)

```move
module 0xCAFE::vault {
    use std::signer;

    struct Balance has key {
        amount: u64
    }

    public fun register(account: &signer) {
        move_to(account, Balance { amount: 0 });
    }

    public fun deposit(account: &signer, delta: u64) acquires Balance {
        let addr = signer::address_of(account);
        let b = borrow_global_mut<Balance>(addr);
        b.amount = b.amount + delta;
    }

    public fun read(addr: address): u64 acquires Balance {
        borrow_global<Balance>(addr).amount
    }
}
```

This pattern demonstrates the account-addressed flow most Aptos modules follow.

## Resource accounts (advanced but common)

Aptos resource-account tooling supports contract-oriented account ownership patterns:

- create a resource account
- publish code for that account
- optionally store/retrieve signer capability under controlled module logic

This is frequently used for protocol-owned modules and controlled upgrade/deployment flows.

## Package metadata and upgrades on Aptos

Aptos framework code management tracks package metadata (name, modules, deps, source digest, upgrade policy, upgrade number). In production this gives you a clear governance plane:

- who owns publishing authority
- what upgrade policy applies
- whether policy can be tightened
- how dependencies constrain upgrades

Treat package policy as security-critical configuration, not build trivia.

## Security and cybersecurity implications

- **Authority boundaries:** avoid replacing `&signer` checks with plain address-based trust.
- **Replay/ordering assumptions:** design with sequence/validation behavior in mind.
- **Upgrade governance:** immutable vs compatible policy must match threat model.
- **Dependency hygiene:** package dependencies can become policy and supply-chain risk.

## Operations guidance

- Track resource schemas per release (indexers and clients depend on shape stability).
- Simulate transactions before publish/upgrade in CI pipelines.
- Keep rollback and emergency freeze procedures aligned with package policy.

---

## Further reading

- [Move Book — Global storage structure](https://move-language.github.io/move/global-storage-structure.html)
- [Move Book — Global storage operators](https://move-language.github.io/move/global-storage-operators.html)
- [Aptos — Smart contracts](https://aptos.dev/build/smart-contracts)
- [Aptos framework `account`](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-framework)
- [Aptos framework `resource_account`](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-framework)
