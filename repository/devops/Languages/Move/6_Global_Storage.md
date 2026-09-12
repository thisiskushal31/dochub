# Global storage

[← Back to Move](./README.md)

## What is global storage?

In the **core** Move model and on **Aptos**, **global storage** is the only persistent store Move code can touch—no files, no arbitrary network I/O from the language. It is organized as a **forest of trees**: each **address** holds **at most one instance per resource type** and **named modules**. Programs **publish**, **read**, **mutate**, and **remove** resources through a small set of primitives.

**Sui** does **not** use this layout; state is **object-ledger**-centric. Anything describing **`move_to`** / **`borrow_global`** per address is **Aptos-style** (or pedagogical core Move), not Sui.

## Why a typed global store?

Scoping storage by **type** and **address** makes it clear **which module** owns the API for each resource. External modules cannot call **`move_to<T>`** for arbitrary **`T`**—only the module that defines **`T`** can touch its global instances. That supports **security reviews** and **predictable indexing** for indexers and ops tooling.

## How do the operations work?

Only types with **`key`** participate as top-level stored resources. The defining module controls all access.

| Operation | Effect | Aborts if |
|-----------|--------|-----------|
| `move_to<T>(&signer, T)` | Store `T` under signer’s address | `T` already present |
| `move_from<T>(address): T` | Remove and return `T` | No `T` at address |
| `borrow_global_mut<T>(address)` | `&mut T` | No `T` |
| `borrow_global<T>(address)` | `&T` | No `T` |
| `exists<T>(address)` | `bool` | Never |

**You cannot return** a reference into global storage from a function—the cell could be removed while the reference lived. **`acquires`** annotations tie static knowledge to borrow safety (see [Functions](./8_Functions_And_Visibility.md)).

**Generics:** the same module can expose storage APIs parameterized by types that satisfy abilities—**storage polymorphism**—still bounded by verification.

Typical publish-and-update flow in the defining module:

```move
module 0x2::wallet {
    use std::signer;

    struct Balance has key { amount: u64 }

    public fun register(account: &signer) {
        move_to(account, Balance { amount: 0 });
    }

    public fun deposit(account: &signer, add: u64) acquires Balance {
        let a = signer::address_of(account);
        let b = borrow_global_mut<Balance>(a);
        b.amount = b.amount + add;
    }

    public fun has_balance(addr: address): bool {
        exists<Balance>(addr)
    }
}
```

Calling **`register`** twice for the same account **aborts** (resource already present). **`deposit`** aborts if **`Balance`** was never published at that address.

## Failure and operations

These primitives **abort** on absence or double-publish. Callers use **`exists`** or module-specific checks. For **operations**, failed transactions should be logged and retried only with corrected arguments—on-chain state is authoritative.

## Sui contrast

Objects carry **`UID`**; **`key`** means something different in daily Sui development. Use Sui topics for publish, transfer, and shared objects.

---

## Further reading

- [The Move Book — Global Storage Structure](https://move-language.github.io/move/global-storage-structure.html)
- [The Move Book — Global Storage Operators](https://move-language.github.io/move/global-storage-operators.html)
- [Signer](https://move-language.github.io/move/signer.html)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
