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

### 9. Const generics

**Const generics** parameterize types and functions over **constant values**, not only types. Arrays are the everyday example: `[T; N]` is a different type for each length `N`.

```rust
fn sum_u8s<const N: usize>(xs: &[u8; N]) -> u32 {
    xs.iter().map(|&b| u32::from(b)).sum()
}
```

APIs use const generics for fixed-size buffers, cryptographic block sizes, small matrices, and “this handle is N bytes” without runtime `len` checks. Bounds on const parameters exist for some use cases but are narrower than type-trait bounds—keep const parameters simple (`usize` lengths are the common case).

Monomorphization applies: each distinct `N` can generate specialized code. That is desirable for small fixed `N` and costly if you instantiate huge families of lengths without need.

### 10. Associated constants

Traits and impls may declare **associated constants** alongside associated types and methods:

```rust
trait Packet {
    const MAX_LEN: usize;
}
```

Implementors supply `const MAX_LEN: usize = …;`. Associated consts document type-level facts (limits, discriminants, default capacities) that callers can use in generics and array sizes when the value is usable in a const context. Prefer them over magic numbers scattered across impls when every implementor must advertise the same kind of constant.

### 11. Conversion traits: `From`, `Into`, `TryFrom`

These `std::convert` traits are the idiomatic conversion surface:

| Trait | Role |
|-------|------|
| **`From<T> for U`** | Infallible `U::from(t)`; implement this for your conversions |
| **`Into<U> for T`** | Blanket-implemented via `From`; callers often prefer `.into()` |
| **`TryFrom<T> for U`** | Fallible conversion → `Result<U, E>` (parsing, range checks) |
| **`TryInto`** | Fallible counterpart callers use; prefer implementing `TryFrom` |

Team habits: implement **`From`** (or **`TryFrom`**) at crate boundaries instead of ad-hoc `to_foo()` methods for every direction; use **`TryFrom`** when the conversion can fail (bytes → typed id, `i64` → `u32`). Error types for `TryFrom` should be small and meaningful. Infallible `From` must not hide lossy casts—those belong in `TryFrom` or explicit methods named for the loss.

### 12. `Deref` / `DerefMut`: smart-pointer ergonomics (not inheritance)

**`Deref`** and **`DerefMut`** let a type present a “view” of an inner value so method calls and coercions can reach the target (`Box<T>`, `Rc<T>`, `Arc<T>`, `String`→`str`, `Vec<T>`→`[T]`). The compiler applies **deref coercion** in argument position and method resolution so you can pass `&String` where `&str` is expected, or call `str` methods on a `String`.

This is **not** classical inheritance: you do not get a subtype lattice, and implementing `Deref` does not make your wrapper a substitute for every API that names the inner type. Staff rule: implement `Deref` for true smart-pointer / newtype-to-inner ergonomics; do **not** use it to fake OO hierarchies or to hide costly conversions. Document whether `DerefMut` is offered (exclusive access to the inner value). Multiple layers of `Deref` are possible but hard to reason about in reviews—prefer a shallow, obvious target type.

### 13. `AsRef` / `AsMut` / `Borrow` / `ToOwned` at API boundaries

These conversion traits show up constantly at library edges:

| Trait | Role |
|-------|------|
| **`AsRef<T>`** / **`AsMut<T>`** | Cheap reference conversion (`Path`, `str`, `[u8]`, …)—accept `impl AsRef<Path>` so callers may pass `Path`, `PathBuf`, `str`, `String` |
| **`Borrow<T>`** | Hash-map key flexibility: owned keys with borrowed lookup (`String` keys, `&str` gets) under consistent `Hash`/`Eq` |
| **`ToOwned`** | Opposite direction of `Borrow`: clone-like to an owned form (`str` → `String`) |

Prefer **`AsRef`** for read-only “accept several path-like / bytes-like inputs.” Prefer **`Borrow`/`ToOwned`** when designing map/set key types. Do not implement these traits with surprising cost or with equality/hash that disagrees with the borrowed form—`HashMap` correctness depends on that contract. At public boundaries, choosing `AsRef`/`Borrow` carefully reduces forced allocations without pretending every type is interchangeable.

### 14. RPIT, Edition 2024 lifetime capture, and `use<…>`

**Return-position `impl Trait` (RPIT)** hides a concrete return type behind a trait bound (`fn items(&self) -> impl Iterator<Item = u32>`). Callers get static dispatch without naming the iterator type.

**Edition 2024 capture change (library-author awareness):** when no precise-capturing bound is written, Edition **2024** implicitly captures **in-scope lifetime parameters** in RPIT more aggressively than **2021** (aligned with `async fn` and several associated-RPIT cases). That can make an opaque type “see” a lifetime it did not capture before—tightening what callers may do with the return value (for example, whether the return can be treated as `'static`). Older editions still compile with their previous implicit rules on modern rustc.

**Precise capturing** with **`use<…>`** (available on recent stables in all editions) names exactly which generics/lifetimes the opaque captures, for example `impl Trait + use<'a, T>` or `impl Trait + use<>` to capture none. Migration via `cargo fix --edition` often inserts `use<…>` to preserve 2021 semantics (`impl_trait_overcaptures`). Prefer explicit `use<…>` on public RPIT when lifetime capture is part of the API contract; omit it in 2024 only when capturing everything in scope is intentional. Legacy `Captures<…>` / “outlives trick” patterns still work but are superseded for new APIs—prefer `use<…>` when touching those signatures.

### 15. `Display` versus `Debug` (brief)

**`Debug`** (`{:?}`) is for programmers—derive it on almost all data types used in logs and error reporting. **`Display`** (`{}`) is for end-user or stable textual forms; implement by hand and treat the string as part of the UX/API. Do not rely on `Debug` formatting as a public contract (it may change). Errors often implement both: `Display` for messages, `Debug` for diagnostics.

### 16. `#[must_use]` on `Result` and custom types

**`#[must_use]`** asks the compiler to warn when a value is produced and immediately discarded. `Result` in `std` is marked this way so ignoring an `Err` is noisy—callers must `?`, `match`, or explicitly acknowledge with `let _ = …` (and a reason).

Apply `#[must_use]` (optionally with a message) to:

- Custom result-like wrappers and builder `build()` returns that are dangerous to ignore.
- Handles whose construction has side effects that only complete when the value is used (less common—document clearly).

Do not sprinkle it on every type; reserve it for “discarding this is almost certainly a bug.” Pair with Clippy’s unused-result lints in CI. Returning `Result` already inherits the std attribute on that enum; your job is mainly not to defeat it (for example by converting to `()` too early without handling).

### 17. Marker traits overview: `Send`, `Sync`, `Copy`, `Clone`, `Sized`

These traits mostly carry **compile-time meaning** rather than large method suites. Tie them together when reviewing APIs:

| Trait | Role (short) |
|-------|----------------|
| **`Sized`** | Type has a known size at compile time; default bound on most generics (`T: Sized`). Unsized types (`str`, `[T]`, `dyn Trait`) appear behind pointers (`&`, `Box`). Opt out with `T: ?Sized` when you intentionally accept unsized `T`. |
| **`Copy`** | Value may be duplicated by bitwise copy; implies cheap, no resource ownership. Assignment does not move-from. Requires `Clone`. |
| **`Clone`** | Explicit `.clone()`; may be deep/expensive. Not every `Clone` type is `Copy`. |
| **`Send`** | Safe to transfer ownership to another thread (auto trait; chapter 12). |
| **`Sync`** | Safe to share references (`&T`) across threads (auto trait; `&T` is `Send` if `T` is `Sync`). |

Staff intuition: `Sized` shapes whether APIs take `T` or `Box<T>` / `&T`; `Copy`/`Clone` shape ownership ergonomics; `Send`/`Sync` shape concurrency bounds on generics (`T: Send + 'static` in spawn APIs). Do not invent manual impls of `Send`/`Sync` without `unsafe` and a concurrency review—auto traits are derived from fields.

### 18. Orphan rules in API design (reminder)

You may implement a trait for a type only if **your crate** defines the trait **or** the type (the **orphan rules** / coherence). Practical consequences:

- To add behavior to a foreign type under a foreign trait, wrap it in a **local newtype** and impl there (same pattern as chapter 06 newtypes and Advanced §5).
- Designing a **public trait** others will impl: keep it local to your crate so downstream can impl it for their types; sealing (private supertrait) blocks unwanted external impls when you need that.
- Avoid “utility traits” that exist only so you can impl them for `String`/`Vec`—coherence will refuse foreign-for-foreign.

Thin rule for reviews: if the compiler cites orphan/coherence, the fix is almost always a newtype or moving the trait—not `unsafe` or a dependency hack.

---

## 3. Applications and use cases

### Software engineering and API design

- Accept `impl Read` / `impl AsRef<Path>` for flexible callers; return concrete types or `impl Trait` when hiding iterators.
- Bound generics with the smallest trait set that still expresses the contract.
- Prefer `From` impls at crate boundaries for conversions rather than ad-hoc inherent methods named `to_*` everywhere.
- Mark discard-dangerous returns with `#[must_use]`; never silently ignore `Result` in library paths.

### Library design

- Public traits are semver-heavy: adding a required method without a default is breaking.
- Seal traits (private supertrait or private method) when you do not want downstream impls.
- Document ownership: whether implementors should be cheap to clone, `Send`, etc.
- State `Send`/`Sync`/`Clone` expectations in docs when thread or ownership contracts matter.
- Respect orphan rules: newtypes for foreign-trait-on-foreign-type; do not promise impls coherence forbids.

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
- `#[must_use]` applied where discarding a return is a bug; `Result` not ignored at call sites.
- `Sized` / `?Sized`, `Copy` vs `Clone`, and `Send`/`Sync` bounds match the API’s real constraints.
- Derived traits match domain semantics (`Eq` only when total equality holds).

---

## References

- [The Book: Generics](https://doc.rust-lang.org/stable/book/ch10-00-generics.html)
- [The Book: Traits](https://doc.rust-lang.org/stable/book/ch10-02-traits.html)
- [The Book: Validating References with Lifetimes](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html)
- [The Book: Trait Objects](https://doc.rust-lang.org/stable/book/ch17-02-trait-objects.html)
- [The Book: Advanced Traits](https://doc.rust-lang.org/stable/book/ch20-02-advanced-traits.html)
- [Rust By Example: Traits](https://doc.rust-lang.org/stable/rust-by-example/trait.html)
- [Rust By Example: Generics](https://doc.rust-lang.org/stable/rust-by-example/generics.html)
- [The Reference: Generics (const parameters)](https://doc.rust-lang.org/stable/reference/items/generics.html#const-generics)
- [std::fmt::Debug](https://doc.rust-lang.org/stable/std/fmt/trait.Debug.html)
- [std::fmt::Display](https://doc.rust-lang.org/stable/std/fmt/trait.Display.html)
- [std::clone::Clone](https://doc.rust-lang.org/stable/std/clone/trait.Clone.html)
- [std::marker::Copy](https://doc.rust-lang.org/stable/std/marker/trait.Copy.html)
- [std::marker::Send](https://doc.rust-lang.org/stable/std/marker/trait.Send.html)
- [std::marker::Sync](https://doc.rust-lang.org/stable/std/marker/trait.Sync.html)
- [std::marker::Sized](https://doc.rust-lang.org/stable/std/marker/trait.Sized.html)
- [std::convert::From](https://doc.rust-lang.org/stable/std/convert/trait.From.html)
- [std::convert::Into](https://doc.rust-lang.org/stable/std/convert/trait.Into.html)
- [std::convert::TryFrom](https://doc.rust-lang.org/stable/std/convert/trait.TryFrom.html)
- [std::iter::Iterator](https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html)
- [The Reference: Trait and lifetime bounds](https://doc.rust-lang.org/stable/reference/trait-bounds.html)
- [The Reference: Attribute `must_use`](https://doc.rust-lang.org/stable/reference/attributes/diagnostics.html#the-must_use-attribute)
- [Edition Guide: dyn Trait for trait objects](https://doc.rust-lang.org/edition-guide/rust-2018/trait-system/dyn-trait-for-trait-objects.html)
- [Edition Guide — RPIT lifetime capture rules](https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html)
- [Edition Guide — Rust 2024](https://doc.rust-lang.org/edition-guide/rust-2024/index.html)
- [std::ops::Deref](https://doc.rust-lang.org/stable/std/ops/trait.Deref.html)
- [std::ops::DerefMut](https://doc.rust-lang.org/stable/std/ops/trait.DerefMut.html)
- [std::convert::AsRef](https://doc.rust-lang.org/stable/std/convert/trait.AsRef.html)
- [std::borrow::Borrow](https://doc.rust-lang.org/stable/std/borrow/trait.Borrow.html)
- [std::borrow::ToOwned](https://doc.rust-lang.org/stable/std/borrow/trait.ToOwned.html)
- [The Reference: impl Trait](https://doc.rust-lang.org/stable/reference/types/impl-trait.html)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
