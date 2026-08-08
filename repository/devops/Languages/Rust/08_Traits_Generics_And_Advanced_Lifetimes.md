# Traits, generics, and advanced lifetimes

[← Back to Rust](./README.md)

## What this chapter covers

How Rust shares behavior and abstracts over types: **traits**, **trait bounds**, **`where` clauses**, **`impl Trait`**, common **`std` traits**, **generics**, **lifetime parameters** on functions and structs, and the difference between **`dyn Trait`** (dynamic dispatch) and **`impl Trait`** (static dispatch). This chapter builds on ownership/lifetimes (05) and prepares for iterators (09) and module-scale API design (10).

---

## 1. Concepts

### 1. Traits: shared behavior

A **trait** defines method signatures (and optionally default implementations) that types can implement:

```rust
trait Summarize {
    fn summary(&self) -> String;
}

impl Summarize for Config {
    fn summary(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}
```

Traits are Rust’s primary interface mechanism—not classical inheritance. A type may implement many traits; a trait may be implemented for many types (including foreign types only under the **orphan rules**: either the trait or the type must be local to your crate).

### 2. Generics: code parameterized by types

Generic functions and types abstract over type parameters:

```rust
fn first<T>(items: &[T]) -> Option<&T> {
    items.get(0)
}
```

Monomorphization: the compiler generates specialized code per concrete type used, giving static dispatch and inlining opportunities at the cost of compile time and potential code size.

### 3. Trait bounds and `where` clauses

Restrict type parameters so you can call trait methods:

```rust
fn print_all<T: std::fmt::Display>(items: &[T]) {
    for item in items {
        println!("{item}");
    }
}

fn merge<T>(a: T, b: T) -> T
where
    T: Clone + PartialOrd,
{
    if a < b { b } else { a }.clone()
}
```

Inline bounds (`T: Display`) suit short signatures; **`where` clauses** stay readable when bounds multiply or involve complex types (`where for<'a> T: Read + 'a` patterns appear in advanced APIs).

### 4. `impl Trait` in argument and return position

**Argument position:** `fn f(x: impl Display)` is roughly sugar for a generic with a bound—callers pick the concrete type.

**Return position:** `fn f() -> impl Iterator<Item = u32>` means “some single concrete type implementing `Iterator`, chosen by the function body.” Callers cannot name that type and cannot typically vary it across branches unless the branches unify to one type (or you use `dyn Trait` / enum dispatch).

`impl Trait` hides types and keeps APIs flexible; it is still static dispatch for a single concrete type per call site (return position) or monomorphized parameter (argument position).

### 5. Common `std` traits you will see constantly

| Trait | Role |
|-------|------|
| `Debug` | `{:?}` formatting; derive for most data types |
| `Display` | User-facing `{}` formatting; implement by hand |
| `Clone` | Explicit deep(er) copy via `.clone()` |
| `Copy` | Implicit bitwise copy; only for simple value types |
| `From` / `Into` | Conversions; implement `From`, prefer `Into` at call sites |
| `Default` | `Default::default()` construction |
| `PartialEq` / `Eq` | Equality |
| `PartialOrd` / `Ord` | Ordering |
| `Hash` | Hashing for maps/sets |
| `Iterator` | The iteration protocol (chapter 09) |
| `Error` | Error trait object / interoperability (chapter 07) |
| `Send` / `Sync` | Auto traits for concurrency (chapter 12) |

Deriving (`#[derive(Debug, Clone)]`) is preferred when the derived semantics match field-wise behavior. Manual impls are required for `Display`, most `From` conversions, and custom equality.

### 6. Lifetime parameters on functions

When returning or storing references, lifetimes relate borrows to their sources:

```rust
fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}
```

`'a` is not “how long the program runs”; it is a name for a region the borrow checker uses to prove references remain valid. Elision rules cover many function signatures so you omit explicit parameters until the compiler asks.

### 7. Lifetime parameters on structs

Structs that hold references need lifetime parameters:

```rust
struct View<'a> {
    payload: &'a str,
}
```

`View<'a>` cannot outlive the data behind `'a`. This appears at parser and zero-copy API boundaries. Prefer owned fields (`String`, `Vec<u8>`) in long-lived or returned domain objects unless performance requires borrowing.

---

## 2. Advanced concepts

### 1. `dyn Trait` vs `impl Trait`

| | `impl Trait` | `dyn Trait` |
|--|--------------|-------------|
| Dispatch | Static (monomorphized / single concrete) | Dynamic (vtable) |
| Type size | Known concrete type | Fat pointer (`&dyn Trait`, `Box<dyn Trait>`) |
| Heterogeneous collections | Poor fit | Natural fit (`Vec<Box<dyn Trait>>`) |
| Cost | Inlining-friendly | Indirect calls; object-safe traits only |

**Object safety** restricts which traits can be made into trait objects (no generic methods, etc.). When a trait is not object-safe, use generics/`impl Trait` or redesign.

Use `dyn Trait` for plugin-style APIs, reduced codegen size, or mixed concrete types behind one interface. Use generics/`impl Trait` for hot paths and simple polymorphic functions.

### 2. Trait objects and lifetime bounds

`Box<dyn Error + Send + Sync + 'static>` is a common application error type: owned, thread-safe, and free of short borrows. When trait objects borrow, you will see `dyn Trait + 'a`.

### 3. Associated types vs generic type parameters

Traits may declare **associated types** (`Iterator::Item`) when each implementing type has one natural choice. Generic parameters on the trait (`trait Convert<T>`) allow multiple impls for different `T`. Prefer associated types for “this impl has exactly one Item”; prefer generics for families of conversions.

### 4. Default methods and supertraits

Traits can provide default method bodies. **Supertraits** (`trait Sub: Super`) require implementors to also implement `Super`, letting default methods call supertrait methods.

### 5. Orphan rules and newtypes

You cannot implement a foreign trait for a foreign type. Wrap the foreign type in a local newtype, then implement the trait for the wrapper. This preserves coherence (no conflicting impls across crates).

### 6. Higher-ranked lifetimes (awareness)

Bounds like `for<'a> F: Fn(&'a T)` appear with closures and callbacks that must work for *all* lifetimes. You rarely write these by hand at first; recognize them in compiler errors around closures and `Fn` traits.

### 7. Lifetime elision pitfalls

Returning a reference created inside a function without tying it to an input is impossible in safe Rust. Returning one of several input references may require an explicit lifetime so the checker knows they share a bound. Struct fields with multiple lifetimes (`'a`, `'b`) document independent borrow regions—keep APIs as simple as possible.

### 8. Edition note: `dyn` is explicit

Modern Rust requires the `dyn` keyword for trait objects (`&dyn Trait`). Very old code may omit it (`&Trait`). New code always writes `dyn`.

---

## 3. Applications and use cases

### Software engineering and API design

- Accept `impl Read` / `impl AsRef<Path>` for flexible callers; return concrete types or `impl Trait` when hiding iterators.
- Bound generics with the smallest trait set that still expresses the contract.
- Prefer `From` impls at crate boundaries for conversions rather than ad-hoc inherent methods named `to_*` everywhere.

### Library design

- Public traits are semver-heavy: adding a required method without a default is breaking.
- Seal traits (private supertrait or private method) when you do not want downstream impls.
- Document ownership: whether implementors should be cheap to clone, `Send`, etc.

### Performance

- Hot generic code monomorphizes—measure binary size if many concrete types instantiate large generic stacks.
- Prefer `impl Trait`/generics in inner loops; `dyn Trait` at configuration boundaries.

### Security and correctness

- Trait bounds encode capabilities (`Write` means you can emit bytes)—do not over-bound in ways that force callers into overly powerful types.
- Lifetimes on structs prevent dangling views into buffers; do not “fix” lifetime errors with `'static` transmute or unchecked escapes.

### Data and zero-copy pipelines

- Borrowed views (`struct Row<'a>`) parse without allocating; promote to owned types before storing in long-lived caches or sending across threads without careful `Send` design.

### Staff-level review checklist

- Public traits: object safety and semver impact understood.
- `dyn` vs generics chosen intentionally (flexibility/size vs speed/codegen).
- Lifetimes on structs justified; owned alternatives considered for simpler APIs.
- `From`/`Display`/`Debug` present where types cross crate or log boundaries.
- Bounds are minimal; no unnecessary `Clone + 'static` “to make it compile.”
- Orphan-rule workarounds use newtypes, not brittle hacks.
- Derived traits match domain semantics (`Eq` only when total equality holds).

---

## References

- [The Book: Generics](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [The Book: Traits](https://doc.rust-lang.org/stable/book/ch10-02-traits.html)
- [The Book: Validating References with Lifetimes](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html)
- [The Book: Trait Objects](https://doc.rust-lang.org/stable/book/ch17-02-trait-objects.html)
- [Rust By Example: Traits](https://doc.rust-lang.org/stable/rust-by-example/trait.html)
- [Rust By Example: Generics](https://doc.rust-lang.org/stable/rust-by-example/generics.html)
- [std::fmt::Debug](https://doc.rust-lang.org/stable/std/fmt/trait.Debug.html)
- [std::fmt::Display](https://doc.rust-lang.org/stable/std/fmt/trait.Display.html)
- [std::clone::Clone](https://doc.rust-lang.org/stable/std/clone/trait.Clone.html)
- [std::convert::From](https://doc.rust-lang.org/stable/std/convert/trait.From.html)
- [std::iter::Iterator](https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html)
- [The Reference: Trait and lifetime bounds](https://doc.rust-lang.org/stable/reference/trait-bounds.html)
- [Edition Guide: dyn Trait for trait objects](https://doc.rust-lang.org/edition-guide/rust-2018/trait-system/dyn-trait-for-trait-objects.html)
