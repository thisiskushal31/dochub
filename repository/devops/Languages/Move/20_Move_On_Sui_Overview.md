# Move on Sui: overview and when to use

[← Back to Move](./README.md)

## What is Move on Sui?

**Move on Sui** is an active Move implementation built around an **object-centric** execution model. It keeps core Move language safety (resource semantics, abilities, bytecode verification), but changes how state is modeled and executed:

- State is primarily represented as **objects** with unique IDs.
- Transaction inputs are explicit object references.
- The execution model is optimized for parallelism when transactions touch different objects.

If core topics **1-12** explained Move the language, this topic explains what changes when that language runs on Sui.

## Why teams choose Sui

Teams usually pick Sui when they need:

- **Object-first product design** (items, positions, inventories, profiles, capability objects).
- **High-throughput user flows** where many users mutate independent objects concurrently.
- **Composable transaction logic** using Programmable Transaction Blocks (PTBs).
- **Clear capability and ownership modeling** with owned/shared/immutable object patterns.

From an engineering perspective, this helps application teams model rich on-chain state, security teams reason about authority per object/capability, and operations teams manage package lifecycle with explicit upgrade controls.

## How Sui differs from legacy Move and Aptos

At a high level:

- **Legacy Move reference:** language and VM semantics, account/global-storage mental model.
- **Move on Aptos:** account-centric resources and transaction-centric execution.
- **Move on Sui:** object-centric storage and PTB-based transaction composition.

This difference affects data modeling, indexing, test strategy, gas behavior, and audit scope.

## Beginner-to-advanced architecture view

### 1) Data model

On Sui, important on-chain entities are objects:

- Objects with `key` have identity and can be passed through transactions.
- Object ownership determines who can mutate or access them.
- Many application patterns are expressed as object graphs rather than account resource tables.

### 2) Execution model

Transactions declare object inputs up front. This helps the runtime schedule independent transactions in parallel when they do not contend on mutable objects.

### 3) Programmability model

Sui replaces the legacy script-centric model with package functions plus PTBs. Entry points and object arguments are central to how applications expose APIs.

### 4) Package lifecycle

Publishing and upgrades are governed through package capabilities and policy. Production teams should design this governance up front (multisig/timelocks/process controls).

## Minimal Sui-flavored module shape

Text first: this snippet illustrates a basic Sui object lifecycle pattern, not a full production contract.

```move
module demo::counter {
    use sui::object;
    use sui::transfer;
    use sui::tx_context::TxContext;

    public struct Counter has key, store {
        id: object::UID,
        value: u64,
    }

    public entry fun create(ctx: &mut TxContext) {
        let c = Counter { id: object::new(ctx), value: 0 };
        transfer::transfer(c, tx_context::sender(ctx));
    }

    public entry fun bump(c: &mut Counter) {
        c.value = c.value + 1;
    }
}
```

## When should you choose Sui?

Prefer Sui when your product is naturally object-oriented and benefits from:

- Per-object authority and composable ownership states.
- PTB-driven multi-step user operations.
- Concurrency patterns where independent users mostly touch distinct objects.
- Rich asset and game-like models with evolving object relationships.

## Engineering checklist before committing to Sui

- **Application:** verify your domain maps cleanly to objects and capabilities.
- **Systems:** profile contention on shared objects; avoid unnecessary hot spots.
- **Security:** define ownership transitions, capability custody, and upgrade governance.
- **Operations:** pin toolchain versions, formalize publish/upgrade runbooks, monitor gas and storage behavior.

---

## Further reading

- [Build with Move (Sui)](https://docs.sui.io/build/move)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
- [Sui object model](https://docs.sui.io/concepts/object-model)
