# Structs and resources

[← Back to Move](./README.md)

## What are structs and resources?

A **struct** is a user-defined type with named fields. Structs model everything from plain records to **resources**: values that must not be copied or dropped casually. By default, without **`copy`** and **`drop`**, struct values behave like **linear** values—you must **move** them or **destructure** them explicitly before control flow ends. That is the main mechanism for representing **assets** and **capabilities** that must not be duplicated.

## Why does Move distinguish resources from plain data?

Double-spend and accidental loss of tokens are often **logic bugs** elsewhere. Here, the type system and verifier reject many illegal patterns at compile time. Only the **defining module** can **create** (pack) or **destroy** (unpack) a struct value, so invariants stay centralized.

## How do you define, use, and borrow them?

Structs live only inside modules. Names start with **A–Z**. No recursive struct fields.

```move
module 0x2::m {
    struct Foo { x: u64, y: bool }
    struct Baz has copy, drop { x: u64, y: bool }
}
```

**Construction:** `Foo { x: 0, y: false }`. **Destruction** (for non-drop types): pattern match `let Foo { x, y } = foo;`—only inside the defining module for types without public pack/unpack rules you expose.

Inside the defining module you can **unpack** a linear struct to end its lifetime—here **`Foo`** has no **drop**, so the value must be fully deconstructed:

```move
fun consume_foo(f: Foo) {
    let Foo { x: _, y: _ } = f;
}
```

**Field borrow:** `&s.f` / `&mut s.f` with the usual reference rules (see [References](./7_References_And_Ownership.md)). Writing through `&mut` requires the old field value to be droppable.

**Resources:** struct with neither **copy** nor **drop** must be fully accounted for—cannot copy, cannot leave on the stack unused. With **copy**/**drop**, values behave like ordinary value types.

## Global storage vs objects

On **Aptos** (and core Move), only structs with **`key`** can sit as top-level stored values under an address, with fields satisfying **`store`**. See [Global storage](./6_Global_Storage.md).

On **Sui**, **`key`** (with **`store`**) describes **objects** with unique IDs; storage is not the same address-keyed tree. See Sui object topics (20+).

## Engineering perspectives

- **Application:** Model coins, NFTs, roles, caps as structs; choose abilities deliberately.
- **Systems:** Linear values map cleanly to deterministic state transitions per transaction.
- **Security:** Private pack/unpack prevents arbitrary minting or tearing apart invariants from outside.
- **Operations:** Published modules fix the set of struct types clients and indexers must handle.

---

## Further reading

- [The Move Book — Structs and Resources](https://move-language.github.io/move/structs-and-resources.html)
- [The Move Book — Abilities](https://move-language.github.io/move/abilities.html)
- [Sui — Move concepts / objects](https://docs.sui.io/concepts/sui-move-concepts)
