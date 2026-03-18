# Structs and resources

[← Back to Move](./README.md)

A **struct** is a user-defined data type with named or positional fields. Structs hold any non-reference type, including other structs. They are the building block for both "plain" data and for **resources**: values that represent assets and are subject to strict ownership rules.

By default, struct values are **linear** and **ephemeral**: they cannot be copied, cannot be dropped without being taken apart, and (in core Move and Aptos) cannot be stored in global storage unless the struct is given certain **abilities**. That design makes structs well suited to represent things like tokens or rights: you cannot duplicate them by accident and they must be explicitly moved or destroyed. Abilities (copy, drop, store, key) relax or extend this behavior; the next topic covers abilities in detail.

## Defining structs

Structs are defined only inside a module. Each field has a type; the struct can have a list of abilities after the name (e.g. `has copy, drop`).

```move
module 0x2::m {
    struct Foo { x: u64, y: bool }
    struct Bar {}
    struct Baz has copy, drop { x: u64, y: bool }
}
```

Structs cannot be recursive: a struct cannot contain a field of its own type (directly or indirectly). Names must start with a capital letter A–Z; the rest can be letters, digits, or underscores.

## Creating and destroying structs

You create a struct value by giving the struct name and a value for each field. For named fields you use `{ field: value }`; the order of fields does not matter. If a local variable has the same name as the field, you can use the shorthand `{ field }` instead of `{ field: field }`.

```move
let foo = Foo { x: 0, y: false };
let baz = Baz { foo };
```

To destroy a struct value you use **pattern matching**: you bind it to a pattern that matches its shape. That is the only way to "get rid of" a value that does not have the `drop` ability. You can bind fields to new variables or to wildcards, and you can nest patterns for nested structs.

```move
let foo = Foo { x: 3, y: false };
let Foo { x, y: foo_y } = foo;
// x and foo_y are now bound; foo is consumed
```

Only the module that defines the struct can pack (create) or unpack (destroy) values of that type. Field access is also restricted to the defining module. So the module fully controls how its types are constructed and deconstructed, which is how invariants (e.g. "no duplicate coins") are enforced.

## Borrowing and reading and writing fields

You can take a reference to a struct or to a field with `&` (immutable) or `&mut` (mutable). Reading through a reference or via the dot operator is allowed when the field type permits it; for non-copyable fields you may need to dereference a borrow explicitly. Writing a field (e.g. `foo.x = 42` or through `&mut`) requires the field type to have the `drop` ability where the old value is effectively discarded.

```move
let foo = Foo { x: 3, y: true };
let r = &foo;
let x = r.x;
let mut foo2 = Foo { x: 1, y: false };
foo2.x = 10;
```

Borrowing and assignment rules ensure that at any time there is at most one mutable reference or many immutable references, so the compiler can enforce safety without a runtime.

## Ownership and resources

When a struct has no `copy` and no `drop` ability, every value must be moved (ownership transferred) or destroyed by pattern matching before the function ends. You cannot copy it or "forget" it. That is what we mean by **resource**: a value that is unique and must be accounted for. It is ideal for representing money, tickets, or any asset that must not be duplicated or lost by accident.

If a struct does not represent such an asset, you can give it `copy` and `drop`. Then values can be copied and can be discarded when they go out of scope, similar to values in many other languages.

## Global storage and the `key` ability (core Move and Aptos)

In core Move and on Aptos, only structs with the `key` ability can be used as top-level entries in global storage (under an address). Any value stored inside a `key` struct must have the `store` ability. So `key` and `store` control what can live in persistent storage and under what key. The topic on global storage goes into the actual operations (move_to, borrow_global, etc.).

## Sui: objects and storage

On Sui, storage is object-centric. Structs with the `key` ability represent **objects**: each value has a unique ID and is the unit of storage and transfer. The `store` ability controls what can be stored inside an object and what can be transferred out of the defining module. The Sui Move book and the topic on the Sui object model cover this in detail.

## Why this matters across engineering

- **Application:** Structs and resources are how you model assets and state in contracts; abilities determine whether a value can be copied, discarded, or stored.
- **Systems:** The type system and bytecode enforce linearity and abilities; understanding structs and resources clarifies how the VM tracks ownership.
- **Security:** By default, no copy and no drop reduces double-spend and accidental loss; privileged pack/unpack in the defining module enables access control and invariants.
- **Operations:** Published modules define the struct types used on chain; upgrading or composing them requires understanding how structs and abilities interact.

---

## Further reading

- [The Move Book — Structs and Resources](https://move-language.github.io/move/structs-and-resources.html)
- [Move Book — Abilities](https://move-language.github.io/move/abilities.html)
- [Sui Move — Structs](https://move-book.com/)
- [Sui Move — Objects](https://docs.sui.io/concepts/sui-move-concepts)
