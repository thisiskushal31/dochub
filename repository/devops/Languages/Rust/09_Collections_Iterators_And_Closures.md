# Collections, iterators, and closures

[← Back to Rust](./README.md)

## What this chapter covers

Everyday `std` collections—**`Vec`**, **`String`**, **`HashMap`**—and the **iterator** pipeline that transforms them. **Adapters** vs **consumers**, the three iteration modes (`iter` / `iter_mut` / `into_iter`), and **closures** with the `Fn` / `FnMut` / `FnOnce` trait hierarchy. This is the idiomatic core of data processing in Rust services and CLIs.

---

## 1. Concepts

### 1. `Vec<T>`: owned, growable arrays

`Vec<T>` stores contiguous heap-allocated elements with length and capacity. Push/pop at the end is amortized O(1). Indexing (`v[i]`) panics on bounds failure; `get` returns `Option`. Prefer iterators and `get` for untrusted indices.

Ownership: moving a `Vec` moves its buffer. Cloning is deep (element-wise). Slices (`&[T]`, `&mut [T]`) borrow into vectors and arrays without copying.

### 2. `String` and string slices

`String` is an owned UTF-8 byte buffer (`Vec<u8>` with UTF-8 invariants). `&str` is a borrowed string slice. APIs should often accept `impl AsRef<str>` or `&str` and return `String` when they need to allocate.

Indexing by byte index can panic if not on a char boundary—use char iterators or range APIs carefully. For binary data, use `Vec<u8>` / `&[u8]`, not `String`.

### 3. `HashMap<K, V>`

Hash maps store key-value pairs with average O(1) insert/lookup when keys implement `Eq + Hash`. Iteration order is not insertion order (unless you use a specialized map type from the ecosystem). Entry API (`entry`) avoids double lookups for insert-or-update patterns.

Default hashing is DoS-resistant for untrusted keys (SipHash-based); that costs some CPU versus weaker hashes. For trusted, hot keys, specialized hashers exist—measure before switching.

### 4. The iterator model

An **iterator** produces a sequence of `Item` values via `next() -> Option<Self::Item>`. Lazy **adapters** transform iterators without running until a **consumer** (or explicit loop) pulls values.

```rust
let sum: i32 = vec![1, 2, 3, 4]
    .iter()
    .filter(|n| *n % 2 == 0)
    .map(|n| n * 10)
    .sum();
```

Nothing runs until `sum` (a consumer) drives the chain. That avoids intermediate collections unless you ask for them (`collect`).

### 5. Adapters vs consumers

**Adapters** (return a new iterator): `map`, `filter`, `filter_map`, `take`, `skip`, `chain`, `enumerate`, `flat_map`, `inspect`, `cloned`, `copied`, …

**Consumers** (drive the iterator to produce a value or effect): `collect`, `sum`, `fold`, `for_each`, `count`, `any`, `all`, `find`, `nth`, …

`collect` is polymorphic via `FromIterator`—you often annotate the target: `collect::<Vec<_>>()` or `collect::<Result<Vec<_>, _>>()` for fallible maps.

### 6. `into_iter`, `iter`, `iter_mut`

| Method | Yields | Ownership |
|--------|--------|-----------|
| `into_iter()` | `T` | Consumes the collection |
| `iter()` | `&T` | Shared borrows |
| `iter_mut()` | `&mut T` | Exclusive borrows |

`for x in collection` desugars to `into_iter()`. For a `for` loop that should only borrow, write `for x in &collection` or `collection.iter()`. Choosing wrong is a common ownership fight: you moved the `Vec` when you only needed references.

### 7. Closures and capture

Closures are anonymous functions that may **capture** their environment:

```rust
let scale = 2;
let doubled: Vec<_> = nums.iter().map(|n| n * scale).collect();
```

Capture mode is inferred from use: immutable borrow, mutable borrow, or move. The `move` keyword forces ownership of captures—required when the closure outlives the current stack frame (threads, returned closures).

### 8. `Fn`, `FnMut`, `FnOnce`

Closures implement one or more of:

- **`FnOnce`** — callable once; may consume captured values.
- **`FnMut`** — callable multiple times; may mutate captures.
- **`Fn`** — callable multiple times without mutating captures.

Hierarchy: `Fn: FnMut: FnOnce`. Function pointers (`fn(i32) -> i32`) implement all three when signatures match. Generic APIs usually bound `F: FnMut(...)` for map-like callbacks, or `FnOnce` when the closure runs once (as in `unwrap_or_else`).

---

## 2. Advanced concepts

### 1. Fallible iteration

`collect::<Result<Vec<T>, E>>()` stops at the first `Err` when iterating `Result`s. Adapters like `map` returning `Result` need careful sequencing—prefer explicit loops with `?` when control flow clarity matters more than chain aesthetics.

### 2. `drain`, retaining, and mutating while iterating

You cannot hold an iterator that borrows a `Vec` and simultaneously `push` to that same `Vec`. Use indices carefully, `retain`, `drain`, or split collections. These APIs exist to express mutation patterns the borrow checker can prove safe.

### 3. Sizedness and `collect` targets

Many collections implement `FromIterator`. You can collect into `HashMap`, `String` (from chars), `Result`, and more. Type inference sometimes needs a turbofish or intermediate annotation.

### 4. Lazy vs eager mental model

Adapters are lazy; forgetting a consumer leaves work undone (and often a compiler warning for unused `must_use` iterators). Conversely, calling `collect` too early builds unnecessary vectors—keep data in iterator form across API layers when possible (`impl Iterator<Item = T>`).

### 5. Closure type identity

Each closure has a unique anonymous type. You cannot write two different closures into a bare `Vec` without `dyn Fn` or unifying via function pointers. Returning closures uses `impl Fn...` or `Box<dyn Fn...>`.

### 6. Performance notes

- Prefer `iter` + `copied`/`cloned` on `Copy` types over repeated indexing.
- `collect` into a `Vec` with known size can benefit from `size_hint`; adapters preserve hints when possible.
- `HashMap` lookup cost and allocation patterns matter in hot paths—batch and reuse maps when profiling says so.
- Avoid `clone` in `map` closures out of habit; borrow first.

### 7. `String` vs `Vec<u8>` at boundaries

Text protocols use `String`/`&str`. Opaque payloads and hashes stay bytes. Converting lossily between them is a source of bugs—be explicit at the edge (`from_utf8`, `from_utf8_lossy`) and handle `Result`.

---

## 3. Applications and use cases

### Software engineering

- Express pipelines as iterator chains when they stay linear and typed; switch to imperative loops for multi-step stateful parsing.
- Accept `impl IntoIterator` in helpers so callers can pass arrays, vecs, or maps’ iterators.

### Data processing and CLIs

- Stream lines with iterators over locked stdin/files instead of reading entire files when inputs are large (pair with chapter 11 I/O).
- Use `filter_map` to parse-and-skip bad records; count skips for metrics.

### API design

- Returning `impl Iterator` lets callers `take`/`filter` without your allocating a `Vec`. Document whether the iterator holds borrows (lifetimes) or is `'static`.
- Consuming `into_iter` in APIs makes ownership clear; borrowing APIs keep caller data intact.

### Reliability

- Do not use indexing for untrusted input—use `get` and `Result`.
- Treat UTF-8 errors as data errors (`Result`), not panics, at system boundaries.

### Performance and capacity

- `Vec::with_capacity` / `HashMap::with_capacity` when sizes are known.
- Reuse buffers across loop iterations in hot services to cut allocator traffic.

### Security

- Untrusted map keys: keep default hasher unless you have a measured, threat-modelled reason to change.
- Cap collection sizes when reading from the network to avoid memory exhaustion.

### Staff-level review checklist

- Iteration mode (`iter` / `iter_mut` / `into_iter`) matches ownership intent.
- Iterator chains are consumed deliberately; no accidental unused lazy chains.
- Closures use `move` only when needed; captures do not extend borrows unintentionally.
- `Fn`/`FnMut`/`FnOnce` bounds match how the callback is invoked.
- Untrusted indices and UTF-8 edges use fallible APIs.
- Collections exposed across threads meet `Send`/`Sync` requirements (chapter 12).
- Large inputs streamed; capacities bounded where denial-of-service matters.

---

## References

- [The Book: Common Collections](https://doc.rust-lang.org/stable/book/ch08-00-common-collections.html)
- [The Book: Closures](https://doc.rust-lang.org/stable/book/ch13-01-closures.html)
- [The Book: Processing a Series of Items with Iterators](https://doc.rust-lang.org/stable/book/ch13-02-iterators.html)
- [Rust By Example: Vectors](https://doc.rust-lang.org/stable/rust-by-example/std/vec.html)
- [Rust By Example: HashMap](https://doc.rust-lang.org/stable/rust-by-example/std/hash.html)
- [Rust By Example: Iterators](https://doc.rust-lang.org/stable/rust-by-example/trait/iter.html)
- [std::vec::Vec](https://doc.rust-lang.org/stable/std/vec/struct.Vec.html)
- [std::string::String](https://doc.rust-lang.org/stable/std/string/struct.String.html)
- [std::collections::HashMap](https://doc.rust-lang.org/stable/std/collections/struct.HashMap.html)
- [std::iter::Iterator](https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html)
- [std::ops::Fn](https://doc.rust-lang.org/stable/std/ops/trait.Fn.html)
- [std::ops::FnMut](https://doc.rust-lang.org/stable/std/ops/trait.FnMut.html)
- [std::ops::FnOnce](https://doc.rust-lang.org/stable/std/ops/trait.FnOnce.html)
