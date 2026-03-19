# Sui dynamic fields and collections

[← Back to Move](./README.md)

## Why dynamic fields exist

Fixed struct fields are not enough for many real products. You often need extensible, keyed data that grows with user behavior (inventory slots, per-user settings, per-market records, per-object attachments).

Sui dynamic fields provide this extensibility directly on objects.

## Dynamic field vs dynamic object field

Sui has two related mechanisms:

- **Dynamic field (`sui::dynamic_field`)** stores arbitrary values under a key.
- **Dynamic object field (`sui::dynamic_object_field`)** stores child objects while preserving object identity/access semantics.

Choose based on whether the value should remain a first-class object for external tooling/indexing patterns.

## Engineering trade-offs

Dynamic fields are powerful, but design matters:

- Great for sparse extensible state.
- Helpful for avoiding very large monolithic structs.
- Can become hard to audit if key naming and schema conventions are loose.

Use typed key wrappers and clear conventions for predictable audits and migrations.

## Minimal dynamic field example

Text first: this example models a registry object with keyed balances.

```move
module demo::registry {
    use sui::dynamic_field;
    use sui::object;

    public struct Registry has key, store {
        id: object::UID,
    }

    public struct BalanceKey has copy, drop, store {
        user: address,
    }

    public fun set_balance(reg: &mut Registry, user: address, amount: u64) {
        let key = BalanceKey { user };
        if (dynamic_field::exists_(&reg.id, key)) {
            *dynamic_field::borrow_mut<BalanceKey, u64>(&mut reg.id, key) = amount;
        } else {
            dynamic_field::add(&mut reg.id, key, amount);
        }
    }
}
```

## Collections and object graph patterns

Dynamic fields are often used to implement:

- key-value attachments on parent objects
- index-like structures for child records
- per-user maps under shared service roots
- modular feature extensions without changing base object layout

For high-scale systems, combine:

- shared root object for global coordination
- owned child objects or dynamic object fields for per-user mutable state

## Security and operations guidance

- Guard dynamic field mutation paths behind explicit authority checks.
- Document key schema and versioning strategy.
- Test deletion/update edge cases to avoid orphaned or unreachable state.
- Monitor gas behavior for high-churn field operations.

---

## Further reading

- [Dynamic (Object) fields](https://docs.sui.io/build/programming-with-objects/ch5-dynamic-fields)
- [Framework: `sui::dynamic_field`](https://docs.sui.io/references/framework/sui/dynamic_field)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
