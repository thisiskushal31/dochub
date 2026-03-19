# Sui object model (ownership, UID, key and store)

[← Back to Move](./README.md)

## Why the object model matters

Sui's object model is the core reason Move on Sui feels different from other Move runtimes. Instead of thinking in terms of account-scoped resources in global storage, you model state as **objects** with identity, ownership, and explicit transaction inputs.

This gives you a direct way to design:

- Asset lifecycles (mint, transfer, freeze, burn)
- Permission boundaries (owner/capability/shared governance)
- Concurrency boundaries (which objects can be mutated in parallel)

## Objects, identity, and `UID`

On Sui, an object type typically has:

- `key` ability
- First field `id: UID`

The `UID` gives object identity on chain. Object identity is fundamental for ownership transfer, indexing, and PTB composition.

Text first: minimal object definition shape:

```move
public struct Profile has key, store {
    id: sui::object::UID,
    nickname: std::string::String,
    reputation: u64,
}
```

## Ownership modes: owned, shared, immutable

Sui object ownership is an engineering design decision, not just a syntax detail.

- **Owned object:** controlled by an address (or parent object); ideal for user-specific state.
- **Shared object:** globally accessible mutable state with consensus-managed access; useful for marketplaces, game worlds, registries.
- **Immutable object:** globally readable, non-mutable state; useful for metadata/constants/policies that should never change.

Text first: conceptual ownership transition sketch:

```move
// Owned -> shared (one-way design choice in many app flows)
transfer::share_object(my_shared_state);

// Owned -> immutable (freeze)
transfer::public_freeze_object(metadata_obj);
```

## `key` and `store` in Sui context

In core Move, abilities control copy/drop/store/key semantics. On Sui:

- `key` marks object-like types with identity and storage behavior enforced by Sui runtime rules.
- `store` allows a value to be stored inside other structs/objects.

Practical implication: not every struct should be an object. Use object types for state that needs identity, transfer, indexing, and lifecycle operations. Use plain `store` structs for embedded data.

## No traditional global storage operators

Sui programming avoids the classic account-global operators (`move_to`, `borrow_global`, `move_from`) as the central model. Instead, object references and transaction inputs drive access patterns.

This improves predictability of access sets and supports higher parallelism when mutable object sets do not overlap.

## Object graph design patterns

Common patterns in production Sui apps:

- **Root object + dynamic fields** for extensible keyed sub-state.
- **Capability objects** for privileged actions (admin/update/mint).
- **Shared registry + owned positions** to balance global coordination with per-user concurrency.
- **Immutable config objects** for stable, auditable policy state.

## Security and performance implications

- Keep mutable shared objects minimal to reduce contention.
- Separate capability custody from everyday user objects.
- Prefer deterministic ownership transitions and explicit transfer points.
- Audit object wrapping/unwrapping and dynamic field access paths.

## Minimal object lifecycle example

Text first: this snippet shows create/transfer/mutate flow with an owned object.

```move
module demo::badge {
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};

    public struct Badge has key, store {
        id: object::UID,
        level: u8,
    }

    public entry fun mint(ctx: &mut TxContext) {
        let b = Badge { id: object::new(ctx), level: 1 };
        transfer::transfer(b, tx_context::sender(ctx));
    }

    public entry fun level_up(b: &mut Badge) {
        b.level = b.level + 1;
    }
}
```

---

## Further reading

- [Sui Move concepts — Objects](https://docs.sui.io/concepts/sui-move-concepts)
- [Sui object model](https://docs.sui.io/concepts/object-model)
- [Shared objects](https://docs.sui.io/concepts/object-ownership/shared)
- [Immutable objects](https://docs.sui.io/concepts/object-ownership/immutable)
- [Move Book (Sui) — Structs](https://move-book.com/reference/structs.html)
