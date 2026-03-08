# Cairo — Generic types and traits

[← Cairo README](./README.md)

**Generics** let you write code that works over many types without duplication. **Traits** define shared behavior (method signatures) that types can implement. Together they support reusable, type-safe APIs. This topic covers generic functions and structs, trait bounds, and defining and implementing traits.

---

## Generic functions

Declare type parameters in angle brackets. Use **trait bounds** so the compiler knows what operations are allowed (e.g. **Drop**, **Copy**, **PartialOrd**). Use **impl TraitName: Trait&lt;T&gt;** or the **+Trait&lt;T&gt;** shorthand for anonymous bounds.

```cairo
fn largest_list<T, impl TDrop: Drop<T>>(l1: Array<T>, l2: Array<T>) -> Array<T> {
    if l1.len() > l2.len() { l1 } else { l2 }
}

fn smallest_element<T, +PartialOrd<T>, +Copy<T>, +Drop<T>>(list: @Array<T>) -> T {
    let mut smallest = *list[0];
    let mut index = 1;
    while index < list.len() {
        if *list[index] < smallest { smallest = *list[index]; }
        index += 1;
    }
    smallest
}
```

---

## Generic structs and enums

Structs and enums can take type parameters. **Option&lt;T&gt;** and **Result&lt;T, E&gt;** are generic. When a generic type must be dropped, all of its type parameters must implement **Drop** (or you derive **Drop** when possible).

```cairo
#[derive(Drop)]
struct Wallet<T> {
    balance: T,
}

#[derive(Drop)]
struct Wallet2<T, U> {
    balance: T,
    address: U,
}
```

---

## Defining and implementing traits

A **trait** groups method signatures. Types implement the trait with **impl ImplName of Trait**. Methods can take **self** by value, snapshot (**@T**), or **ref**. Generic traits take type parameters (e.g. **Summary&lt;T&gt;**); each type can have its own implementation.

```cairo
#[derive(Drop)]
struct NewsArticle {
    headline: ByteArray,
    author: ByteArray,
    location: ByteArray,
    content: ByteArray,
}

trait Summary<T> {
    fn summarize(self: @T) -> ByteArray;
}

impl NewsArticleSummary of Summary<NewsArticle> {
    fn summarize(self: @NewsArticle) -> ByteArray {
        format!("{} by {} ({})", self.headline, self.author, self.location)
    }
}
```

Use **#[generate_trait]** on an impl to let the compiler generate the trait definition when you only need one implementation.

---

## Further reading

- [The Cairo Book — Generic Data Types](https://www.starknet.io/cairo-book/ch08-01-generic-data-types.html)
- [The Cairo Book — Traits in Cairo](https://www.starknet.io/cairo-book/ch08-02-traits-in-cairo.html)
- [Cairo README](./README.md) — Topic index.
