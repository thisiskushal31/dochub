# Abilities

[← Back to Move](./README.md)

**Abilities** are a typing feature in Move that control what you are allowed to do with values of a given type. They gate specific operations (copy, drop, storage) so that the language can enforce linearity and storage rules at compile time. The compiler and the bytecode verifier rely on them; understanding abilities is essential for both writing correct code and for security and auditing.

## The four abilities

There are four abilities: **copy**, **drop**, **store**, and **key**. A struct is declared with zero or more of them using `has <ability>` (e.g. `struct Coin has store { value: u64 }`). The same abilities apply across Move deployments; the meaning of **storage** is defined by the deployment (e.g. global storage on Aptos, objects on Sui).

### copy

**copy** allows values of that type to be duplicated. It gates the `copy` operator on variables and copying through a reference (dereference `*e`). If a type has `copy`, every type inside it must also have `copy`. Without `copy`, a value can only be moved; you cannot clone it.

### drop

**drop** allows values to be discarded: not transferred, but effectively destroyed. It gates ignoring a value in a local variable, in a sequence of statements, overwriting a variable in an assignment, and overwriting through a reference (`*e1 = e2`). If a type has `drop`, every type inside it must have `drop`. Without `drop`, you must explicitly move or unpack the value before the function ends.

### store

**store** allows values to exist *inside* a value that lives in storage, but not necessarily as a top-level storage key by themselves. It is the only ability that does not gate a single operation; it gates *being stored* when combined with `key`. If a type has `store`, all types inside it must have `store`. On Sui, `store` also controls what can be stored inside an object and what can be transferred out of the defining module.

### key

**key** allows the type to serve as the key for storage: a top-level value in storage (under an address in core Move and Aptos, or as an object on Sui). It gates all storage operations (e.g. move_to, borrow_global, move_from on Aptos; object creation and transfer on Sui). If a type has `key`, every type inside it must have **store** (not key). So `key` is the only ability that imposes a different requirement on fields (store instead of key).

## Built-in types

Most primitive types have **copy**, **drop**, and **store**: for example `bool`, `u8`–`u256`, and `address`. The **signer** type has only **drop**: it cannot be copied and cannot be put into storage. **vector&lt;T&gt;** has copy, drop, and store only when `T` has the corresponding ability (see conditional abilities below). References `&` and `&mut` have copy and drop (for the reference itself), but they cannot appear in storage so they do not have store. No primitive has **key**; only user-defined structs can be storage keys or (on Sui) objects.

## Annotating structs

You declare abilities on a struct after the struct name and before (or in some dialects after) the field list. The fields must satisfy the ability rules: for the struct to have `copy`, every field must have `copy`; for `drop`, every field must have `drop`; for `store`, every field must have `store`; for `key`, every field must have `store`.

```move
struct Ignorable has drop { f: u64 }
struct Pair has copy, drop, store { x: u64, y: u64 }
struct Resource has key { value: u64 }
```

If a field type does not have the required ability, the struct cannot have that ability either.

## Conditional abilities and generics

When a struct is generic, e.g. `struct Cup<T> has copy, drop, store { item: T }`, not every instantiation has every ability. The type system checks the type argument: `Cup<u64>` has copy, drop, and store because `u64` does; `Cup<signer>` does not have copy or store because `signer` does not. So the abilities of a generic type depend on both the declaration and the type arguments. The same idea applies to the built-in `vector<T>`: you can copy or drop a vector only when the element type allows it.

```move
struct Cup<T> has copy, drop, store { item: T }

fun example(c: Cup<u64>) {
    let c2 = copy c;   // OK: Cup<u64> has copy
}

fun invalid(c: Cup<signer>) {
    let c2 = copy c;   // Error: Cup<signer> does not have copy
}
```

This keeps collections flexible while preserving safety: you cannot copy a container of non-copyable resources.

## Sui: key and store for objects

On Sui, a struct with **key** is an **object**: it has a unique ID and is the unit of storage and transfer. **store** controls what can be stored inside an object and what types can be transferred outside their defining module. The Sui Move book and the topic on the Sui object model describe the exact rules.

## Why this matters across engineering

- **Application:** Abilities decide whether a type is a one-off resource (no copy/drop) or a reusable value (copy/drop) and whether it can live in storage (store/key).
- **Systems:** The bytecode verifier enforces ability constraints; violations are caught at compile time or verification time.
- **Security:** Linear types (no copy/drop) prevent duplication and accidental loss of assets; key/store control what can persist and where.
- **Operations:** When publishing or upgrading modules, ability requirements affect which types can be stored or transferred and how they interact with the runtime.

---

## Further reading

- [The Move Book — Abilities](https://move-language.github.io/move/abilities.html)
- [Sui Move — Abilities](https://move-book.com/)
- [Sui Move — Objects](https://docs.sui.io/concepts/sui-move-concepts)
