# Sui use cases and patterns

[← Back to Move](./README.md)

## Where Sui is strongest in practice

Sui is strongest when product state is naturally object-centric and benefits from explicit ownership and composable transaction flows.

Common fit domains:

- gaming assets and progression systems
- NFTs and dynamic collectibles
- marketplaces and object-exchange protocols
- social/profile/reputation objects
- high-throughput consumer interactions with mostly independent state

## Why these use cases fit Sui

These domains map well to:

- object identities (`UID`) as product primitives
- ownership modes (owned/shared/immutable) as business rules
- PTB composition for multi-step user actions
- capability objects for privileged control and moderation

## Pattern 1: shared coordination + owned user state

Use a shared root object for global coordination (matching, registry, policy), while storing user positions/items as owned objects.

This pattern improves concurrency and helps avoid shared-object bottlenecks.

## Pattern 2: capability-driven administration

Represent admin authority as explicit capability objects created at initialization. Gate sensitive operations (fees, listings, policy updates, upgrades) on capability references.

This creates auditable security boundaries and reduces implicit trust assumptions.

## Pattern 3: extensible state with dynamic fields

Attach optional or unbounded keyed data to parent objects with dynamic fields/object fields. Useful for inventories, plugin modules, user metadata, and sparse maps.

## Pattern 4: PTB-first client UX

Design Move APIs so clients can compose realistic flows in one PTB:

- split payment coin
- call contract logic
- transfer resulting object(s)
- settle leftovers

This lowers round trips and improves UX reliability under atomic execution.

## Example use-case sketch: game item crafting

Text first: simple item + workshop pattern.

```move
module demo::crafting {
    use sui::object;

    public struct Workshop has key, store {
        id: object::UID,
        recipes: u64,
    }

    public struct Item has key, store {
        id: object::UID,
        power: u64,
    }

    public entry fun craft(_shop: &mut Workshop, item: &mut Item) {
        item.power = item.power + 1;
    }
}
```

In production, this is usually combined with capability checks, payment logic, anti-abuse controls, and event/indexing strategy.

## When not to choose Sui

Reconsider Sui if your system is fundamentally account-ledger centric and your team/processes are already deeply optimized for account-global storage patterns on another Move runtime.

## Platform choice checklist

- **Domain model:** objects first, or account-ledger first?
- **Concurrency profile:** independent object updates or heavy shared state contention?
- **Security model:** capability/object custody maturity in your team?
- **Operations:** readiness for Sui-specific publish/upgrade and PTB client workflows?

---

## Further reading

- [Sui developer guides](https://docs.sui.io/guides)
- [Sui app examples](https://docs.sui.io/guides/developer/app-examples/)
- [Sui gaming concepts](https://docs.sui.io/concepts/gaming)
- [Create currencies and tokens on Sui](https://docs.sui.io/guides/developer/coin)
