# Cairo — Dictionaries

[← Cairo README](./README.md)

**Felt252Dict** is a key–value collection in the core library (similar to maps, hash tables, or associative arrays in other languages). The key type is restricted to **felt252**; the value type is generic (`Felt252Dict<T>`). Dictionaries let you simulate mutable storage over Cairo’s immutable memory by maintaining a list of entries (key, previous_value, new_value) and squashing them when the dictionary goes out of scope. This topic covers basic use, the entry list model, squashing, and destruction.

---

## Basic use

Create a dictionary with `Default::default()`. Use **insert(key, value)** to write and **get(key)** to read. All keys start with value zero; there is no delete. Re-inserting the same key overwrites the stored value from the prover’s perspective.

```cairo
use core::dict::Felt252Dict;

#[executable]
fn main() {
    let mut balances: Felt252Dict<u64> = Default::default();

    balances.insert('Alex', 100);
    balances.insert('Maria', 200);

    let alex_balance = balances.get('Alex');
    assert!(alex_balance == 100, "Balance is not 100");

    balances.insert('Alex', 200);
    let alex_balance_2 = balances.get('Alex');
    assert!(alex_balance_2 == 200, "Balance is not 200");
}
```

---

## How it works (entry list)

Cairo memory is immutable. **Felt252Dict** is implemented as a list of entries. Each entry has a **key**, **previous_value**, and **new_value**. Every `insert` or `get` appends an entry; for a given key, the “current” value is the **new_value** of the last entry for that key. There is no in-place overwrite. Lookup is O(n) in the number of entries.

---

## Squashing and destruction

Before a dictionary can go out of scope, it must be **squashed**: for each key, the chain of entries must be consistent (each entry’s **new_value** equals the next entry’s **previous_value**). **Felt252Dict** implements the **Destruct** trait so that when the value goes out of scope, the runtime calls squash. Types that contain a dictionary cannot use **Drop** and must use **Destruct** (derive or custom) so that the dictionary is squashed on scope exit.

---

## Entry and finalize

For more control, you can use **entry(key)**. It takes ownership of the dictionary and returns an entry object and the current value for that key. You update the entry, then **finalize** to get the dictionary back. This matches the underlying entry-list model and is useful when building custom patterns on top of the dict.

---

## Further reading

- [The Cairo Book — Dictionaries](https://www.starknet.io/cairo-book/ch03-02-dictionaries.html)
- [Cairo README](./README.md) — Topic index.
