# Sui entry functions and module initializers

[← Back to Move](./README.md)

## Why `entry` and `init` matter on Sui

Sui programming relies on package functions plus PTBs instead of legacy script-centric workflows. Two concepts are central:

- **`entry` functions:** transaction-callable interfaces for your package.
- **module **`init`** function:** one-time setup hook at publish time.

Designing these well is key for secure external APIs and safe package lifecycle management.

## `entry` functions in Sui context

An `entry` function is callable through transactions/PTBs. On Sui, entry design controls what external callers can do directly.

Practical guidance:

- Keep `entry` functions minimal and policy-focused.
- Push reusable internal logic to non-entry helper functions.
- Gate privileged behavior with capability objects, not with assumptions about caller intent.

Text first: simple entry shape:

```move
public entry fun mutate_state(app: &mut AppState, amount: u64) {
    assert!(amount > 0, 0);
    app.total = app.total + amount;
}
```

## Module initializers (`init`)

`init` runs once when a package/module is published and is commonly used to:

- mint admin or upgrade capabilities
- create singleton shared objects
- initialize immutable metadata

Important operational behavior: `init` is not a generic "run on every upgrade" hook; teams should treat first publish and later upgrades as distinct control points.

Text first: typical initializer pattern:

```move
module demo::admin {
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};

    public struct AdminCap has key, store { id: object::UID }

    fun init(ctx: &mut TxContext) {
        let cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(cap, tx_context::sender(ctx));
    }
}
```

## API boundary design pattern

A strong package design often uses:

- `entry` for external transaction API
- private/public(non-entry) helpers for internal composition
- capabilities created in `init` for admin paths

This creates explicit boundaries between public product behavior and privileged operational controls.

## Security checklist

- Do not expose raw privileged operations as unrestricted entry functions.
- Treat `init` outputs (caps, singleton handles) as high-value secrets/controls.
- Document which entry functions are safe for untrusted callers.
- Test invalid call sequences and capability-misuse attempts.

## Sui vs legacy scripts (mental model shift)

Instead of writing ad-hoc scripts per action, you typically:

1. expose stable entry APIs in modules,
2. compose calls via PTBs from wallet/client side,
3. enforce policy through objects/capabilities and function visibility.

---

## Further reading

- [Sui Move concepts — Entry functions](https://docs.sui.io/concepts/sui-move-concepts#entry-functions)
- [Sui Move concepts — Module initializers](https://docs.sui.io/concepts/sui-move-concepts#module-initializers)
- [Move Book (Sui) — Module initializer](https://move-book.com/programmability/module-initializer.html)
