# Abilities

[← Back to Move](./README.md)

## What are abilities?

**Abilities** are permissions attached to struct types. They answer: may this value be **copied**? **discarded**? **nested inside stored data**? a **top-level storage key** (or **object** on Sui)? The compiler and bytecode verifier enforce them; getting them wrong is a common source of compile errors—and getting them right is central to **asset safety**.

## Why four abilities?

Together they partition operations so **scarce** values stay scarce and **storable** shapes stay serializable and safe.

| Ability | Rough meaning |
|---------|----------------|
| **copy** | Duplicate with `copy` / read through `&` as copy |
| **drop** | Discard implicitly or overwrite |
| **store** | May appear inside a stored value (with **key** parent on Aptos; inside objects on Sui per platform rules) |
| **key** | May be top-level in global storage (Aptos) or a top-level object (Sui) |

**key** structs must hold only **store** fields, not arbitrary **key** fields.

## How do you use them?

Annotation: `struct Name has copy, drop { ... }`. Primitives like **`u64`** have **copy**, **drop**, **store**. **`signer`** has **drop** only. **`vector<T>`** inherits abilities from **`T`**.

Generic example:

```move
struct Ignorable has drop { f: u64 }
struct Pair has copy, drop, store { x: u64, y: u64 }
struct Vault has key { balance: u64 }
```

For generics, **`Cup<T>`** only has **copy** if **`T`** has **copy**—so you cannot copy a vector of non-copyable resources.

```move
struct Cup<T> has store { item: T }
// Cup<u64> has copy, drop, store because u64 does.
// Cup<SomeResource> has only what SomeResource has—often no copy.
```

On **Sui**, **key** + **store** govern **objects** and what may be transferred across module lines; platform rules refine **store**.

## Engineering angles

- **Application:** Decide per type: currency-like (**key**, no copy/drop) vs config (**copy**, **drop**).
- **Systems:** Verifier rejects invalid ability combinations before deployment.
- **Security:** Linear types (**no copy/drop**) reduce duplication bugs; **key**/**store** gate persistence.
- **Operations:** Upgrades that change abilities are breaking; plan migrations.

---

## Further reading

- [The Move Book — Abilities](https://move-language.github.io/move/abilities.html)
- [Move Book (Sui) — Abilities](https://move-book.com/)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
