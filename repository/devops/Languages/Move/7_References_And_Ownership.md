# References and ownership

[← Back to Move](./README.md)

## What are references?

**`&T`** is an immutable reference; **`&mut T`** is mutable. References point at a value stored **elsewhere** (local, field, or global cell). Reads and writes go through operators described below. There is **no `null`**: references are always valid for their **lexical lifetime** in the transaction.

## Why a strict borrow model?

**Dangling references** to freed storage would break asset safety. Move forbids returning references into **global storage** and tracks **acquires** so a function cannot remove a cell while a borrow from the same module execution could still be assumed live. **Cybersecurity** reviews often verify that no API smuggles long-lived borrows across calls in ways that confuse clients—at the language level, the dangerous patterns are already rejected.

## How do reads, writes, and freeze work?

| Form | Role |
|------|------|
| `&e`, `&mut e` | Borrow whole value |
| `&e.f`, `&mut e.f` | Borrow field; chainable |
| `freeze(e)` | `&mut T` → `&T` |
| `*e` | Read (requires **copy** on `T`) |
| `*e1 = e2` | Write (requires **drop** on old `T`) |

No **references to references**. **`&mut T`** is usable where **`&T`** is needed via implicit **freeze** in many positions.

Local example: read through **`&`**, write through **`&mut`**, then freeze for a shared view:

```move
fun demo(x: &mut u64) {
    let r: &u64 = freeze(x);
    let _v = *r;
    *x = *x + 1;
}
```

Move allows **multiple copies** of the same reference value and overlapping field borrows in controlled patterns; **writes** through **`&mut`** still require **exclusive** access at that moment. The result matches **no dangling**, **no null**.

References **cannot** be fields of structs and **never** persist in global storage—they are **transaction-scoped**.

**Tuples** bundle values as **`(T1, T2, …)`**; **`()`** is the unit type used where no meaningful value is returned. You can pattern-match tuple results from functions.

Global borrows follow the same field rules but **cannot escape** the function; see [Global storage](./6_Global_Storage.md).

## Engineering note

**Systems:** Ephemeral references keep serialized state simple. **Security:** Resource reads through **`&`** cannot copy non-**copy** types. **Application:** Prefer returning **values** or **IDs**, not interior pointers, across module boundaries when designing APIs.

---

## Further reading

- [The Move Book — References](https://move-language.github.io/move/references.html)
- [Tuples](https://move-language.github.io/move/tuples.html)
- [Move Book (Sui) / Reference](https://move-book.com/)
