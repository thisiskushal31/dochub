# Structs, enums, and pattern matching

[← Back to Rust](./README.md)

## What this chapter covers

How Rust models data and control flow over that data: **structs** (named fields, tuple structs, unit structs), **enums** (including the shapes of `Option` and `Result`), **methods** via `impl`, and **pattern matching** (`match`, `if let`, `while let`) with **exhaustive** checking. After ownership (chapters 04–05), this is the core of domain modeling and API design in idiomatic Rust.

---

## 1. Concepts

### 1. Named-field structs

A **struct** groups related data under one type name. Named fields are the usual choice for public domain types:

```rust
struct Config {
    host: String,
    port: u16,
    tls: bool,
}

let cfg = Config {
    host: String::from("127.0.0.1"),
    port: 8080,
    tls: true,
};
```

Field access uses `.`. Moving a non-`Copy` field out of a struct moves that field; the rest of the struct may become partially moved and unusable until reconstructed. Prefer borrowing fields (`&cfg.host`) when you only need to read.

**Update syntax** copies remaining fields from an existing value: `Config { port: 8443, ..cfg }`. That moves or copies fields from `cfg` into the new value—understand ownership when the source is not `Copy`.

### 2. Tuple structs and unit structs

A **tuple struct** has positional fields and a distinct type name—useful for newtypes and small wrappers:

```rust
struct Port(u16);
struct Meters(f64);
```

`Port(8080)` is not interchangeable with bare `u16` at the type level. That prevents mixing units and IDs accidentally.

A **unit struct** has no fields: `struct Marker;`. It is a zero-sized type (ZST) useful as a marker, phantom carrier, or type-level tag. Instantiation is just `Marker`.

### 3. Enums: one type, several variants

An **enum** defines a closed set of **variants**. Variants may carry data (tuple-like or struct-like) or none:

```rust
enum Event {
    Started,
    Progress { percent: u8 },
    Failed(String),
}
```

Enums are Rust’s algebraic data types: the compiler knows every variant. That enables exhaustive matching and keeps invalid states (for example “progress without a percent”) out of the type when you design variants carefully.

### 4. `Option` and `Result` as enum shapes

`Option<T>` is roughly `None | Some(T)`. `Result<T, E>` is roughly `Ok(T) | Err(E)`. They are ordinary enums in `std`, not magic—but they are the primary vocabulary for absence and recoverable failure (chapter 07). Reading and writing APIs that return these types is everyday Rust.

Prefer expressing “maybe missing” as `Option` rather than sentinel values (`-1`, empty string, null-like conventions from other languages). Prefer expressing “operation failed” as `Result` rather than out-parameters or global errno.

### 5. Methods and associated functions (`impl`)

Behavior lives in **`impl` blocks**:

```rust
impl Config {
    fn new(host: impl Into<String>, port: u16) -> Self {
        Self { host: host.into(), port, tls: false }
    }

    fn address(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }

    fn enable_tls(&mut self) {
        self.tls = true;
    }
}
```

- Methods take `self`, `&self`, or `&mut self` (by value, shared borrow, exclusive borrow).
- Associated functions (no `self`) are often constructors: `Config::new(...)`.
- Multiple `impl` blocks for the same type are allowed; split by concern when files grow.

Tuple structs and enums also get `impl` blocks. Enum methods often `match` on `self` internally so callers get a typed API instead of raw variants everywhere.

### 6. `match`: destructuring with exhaustiveness

`match` compares a value against patterns and runs the arm that fits. Patterns can bind fields, ignore with `_`, and nest:

```rust
fn describe(e: Event) -> &'static str {
    match e {
        Event::Started => "started",
        Event::Progress { percent: 100 } => "done",
        Event::Progress { .. } => "in progress",
        Event::Failed(_) => "failed",
    }
}
```

**Exhaustiveness** means every possible value of the scrutinee’s type must be covered (or handled by a catch-all `_` / `other`). The compiler rejects incomplete matches for enums and for integer/boolean ranges when it can prove gaps. That is a major reliability feature: adding a new enum variant forces updates at every exhaustive `match` (unless you used `_`, which deliberately opts out of that pressure).

Match arms may introduce bindings and can use **guards** (`if condition` after a pattern) for extra predicates. Guards do not make a pattern “cover” values the type system does not see—prefer encoding constraints in the type when practical.

### 7. `if let` and `while let`

When you care about **one** pattern and ignore the rest, `if let` avoids a full `match`:

```rust
if let Event::Failed(msg) = event {
    eprintln!("error: {msg}");
}
```

`while let` loops while a pattern keeps matching—common with iterators and channels:

```rust
while let Some(item) = queue.pop() {
    process(item);
}
```

These forms are sugar for `match` with one interesting arm and a silent discard of the rest. Prefer full `match` when multiple variants need distinct handling or when exhaustiveness should catch new variants.

### 8. Destructuring in bindings and parameters

Patterns appear beyond `match`: `let`, function parameters, and `for` loops can destructure structs, tuples, and enum variants. `ref` / `ref mut` (and modern binding modes) control whether bindings borrow or move. In current editions, match ergonomics often auto-borrow in ways that feel natural; when the compiler complains about moves, revisit whether you need `&` on the scrutinee or explicit borrows in patterns.

---

## 2. Advanced concepts

### 1. Visibility of fields and variants

Struct fields and enum variants are private to the parent module by default. `pub` on a struct does **not** automatically make fields public—export the type while keeping fields private, and expose constructors and getters. That preserves invariants (for example “port is never zero”) behind an API.

Public enum variants are part of your semver surface: adding a public variant is a breaking change for downstream exhaustive matches. Strategies: keep enums private; mark as `#[non_exhaustive]` so external crates must use wildcards; or provide methods that hide variant churn.

### 2. `#[non_exhaustive]` and API evolution

`#[non_exhaustive]` on structs or enums restricts construction and matching **outside the defining crate**. Downstream code cannot exhaustively match without `_`, and cannot build the struct with a literal that omits future fields. Use it for public types you expect to extend.

### 3. Pattern refutability

**Irrefutable** patterns always succeed (`let (a, b) = pair`). **Refutable** patterns might fail (`if let Some(x) = opt`). `let` and function parameters require irrefutable patterns; use `if let` / `match` for refutable ones. Mixing these up is a common beginner compile error.

### 4. Ownership inside matches

Matching by value can move payload out of an enum. Matching on a reference (`match &event`) borrows. Moving out of a borrowed value is rejected. For large payloads, match on references or use `as_ref()`-style helpers on `Option`/`Result` to avoid clones.

### 5. Newtype pattern vs type aliases

`type Port = u16` is only a name; `struct Port(u16)` is a distinct type. Prefer newtypes when you need methods, trait impls, or invariant enforcement. Prefer aliases for long generic types that should remain interchangeable.

### 6. Empty enums and niche optimization (awareness)

Enums with no variants (`enum Void {}`) are uninhabited and appear in advanced type-level tricks. More practically: `Option<&T>` and similar layouts often use **niche optimization** so `None` costs no extra space when the payload type has unused bit patterns. You do not need to manage this; know that wrapping in `Option` is often cheap for references and `NonZero*` types.

### 7. Edition note: match ergonomics

Older code sometimes writes explicit `ref` / `ref mut` everywhere. Modern editions rely more on **match ergonomics** (binding modes). Both compile; when reading legacy crates, treat verbose `ref` as style of its time, not a different language feature.

---

## 3. Applications and use cases

### Software engineering and domain modeling

- Model domain states as enums (`Connection::Connected { .. } | Connecting | Closed`) instead of booleans that allow impossible combinations.
- Keep structs small and focused; nest types rather than one mega-struct with twenty optional fields that are only valid in some modes.
- Put invariants in constructors (`Config::new` validates port ranges) and keep fields private.

### API and library boundaries

- Prefer returning enums/`Result` over out-parameters.
- Document whether public enums are closed or `non_exhaustive`.
- Expose methods that preserve meaning (`is_terminal_failure`) rather than forcing every caller to match internals.

### Data and parsing boundaries

- Represent wire or config variants as enums at the edge; convert to richer domain types inward.
- Use tuple structs for typed IDs (`UserId(u64)`) so logs and metrics do not mix unrelated integers.

### Reliability

- Exhaustive `match` on internal enums catches incomplete migrations when variants are added.
- Avoid `_ =>` on internal matches unless you consciously accept silence on new variants; prefer naming the ignored case or using `#[allow]` with a comment at review time.

### Performance

- Enums are tagged unions; large variant payloads dominate size—box large uncommon variants (`Failed(Box<ErrorDetail>)`) when stack size or moves matter.
- Unit and marker structs are ZSTs; they disappear at runtime and are free to thread through generics.

### Staff-level review checklist

- Public structs: fields private unless there is a deliberate, documented reason.
- Public enums: exhaustiveness / `non_exhaustive` / semver impact considered.
- No boolean soup where an enum would encode valid states.
- Matches on internal enums avoid silent `_` without justification.
- Methods take `&self` / `&mut self` / `self` appropriately; no unnecessary clones to satisfy the borrow checker.
- Newtypes used for units and IDs that cross API boundaries.
- `Option`/`Result` shapes used instead of sentinels at module edges.

---

## References

- [The Book: Using Structs](https://doc.rust-lang.org/stable/book/ch05-00-structs.html)
- [The Book: Enums and Pattern Matching](https://doc.rust-lang.org/stable/book/ch06-00-enums.html)
- [The Book: Method Syntax](https://doc.rust-lang.org/stable/book/ch05-03-method-syntax.html)
- [Rust By Example: Structs](https://doc.rust-lang.org/stable/rust-by-example/custom_types/structs.html)
- [Rust By Example: Enums](https://doc.rust-lang.org/stable/rust-by-example/custom_types/enum.html)
- [Rust By Example: match](https://doc.rust-lang.org/stable/rust-by-example/flow_control/match.html)
- [Rust By Example: if let](https://doc.rust-lang.org/stable/rust-by-example/flow_control/if_let.html)
- [std::option::Option](https://doc.rust-lang.org/stable/std/option/enum.Option.html)
- [std::result::Result](https://doc.rust-lang.org/stable/std/result/enum.Result.html)
- [The Reference: Items — Structures](https://doc.rust-lang.org/stable/reference/items/structs.html)
- [The Reference: Items — Enumerations](https://doc.rust-lang.org/stable/reference/items/enumerations.html)
- [The Reference: Patterns](https://doc.rust-lang.org/stable/reference/patterns.html)
