# Ownership, borrowing, and lifetimes

[← Back to Rust](./README.md)

## What this chapter covers

The core memory model that makes Rust distinctive: **ownership rules**, stack versus heap intuition, **move / copy / clone**, shared and mutable **references**, the **slice** type, and **lifetime** intuition including **elision**—so you can explain why dangling references are rejected and how to redesign APIs when the borrow checker complains, without treating the compiler as random.

---

## 1. Concepts

### 1. The ownership rules

Rust’s ownership model rests on three rules:

1. Each value has a variable that is its **owner**.
2. There can be only **one owner** at a time.
3. When the owner goes **out of scope**, the value is **dropped** (resources released).

These rules are checked at compile time. They replace a large class of manual `free` discipline and remove the need for a tracing GC for ordinary owned values. Library types participate by implementing **`Drop`** when they own resources (heap buffers, file handles, locks).

Scopes are usually curly-brace blocks and function bodies. Nested scopes drop inner bindings first.

### 2. Stack and heap intuition

Rough mental model (implementation details can be more nuanced, but this model predicts everyday behavior):

| Location | What lives there | Examples |
|----------|------------------|----------|
| **Stack** | Fixed-size frames, fast allocate/deallocate | `i32`, `bool`, small `Copy` values, pointers/handles themselves |
| **Heap** | Dynamically sized or growable buffers | `String`’s UTF-8 bytes, `Vec`’s elements |

A `String` value on the stack holds a pointer, length, and capacity; the bytes live on the heap. Dropping the `String` frees that heap buffer. Moving the `String` moves the stack handle; it does not deep-copy the bytes.

You rarely call an allocator API directly in safe code—`Box`, `Vec`, `String`, and friends encapsulate allocation.

### 3. Move, copy, and clone

**Move** — transferring ownership. After `let b = a;` for a non-`Copy` type, `a` cannot be used. Function arguments move (or copy) the same way unless you pass a reference.

**Copy** — types that are trivially duplicable implement the **`Copy`** trait (and usually **`Clone`**). Assignment duplicates the bits; both variables remain valid. Integers, floats, `bool`, `char`, and shared references `&T` are `Copy`. Anything that owns a heap buffer or other resource is typically **not** `Copy`.

**Clone** — explicit duplication via **`.clone()`**, which can be deep (new heap allocation for `String`). Cloning is opt-in at the call site so cost is visible.

```rust
fn takes_ownership(s: String) {
    println!("{s}");
} // s dropped here

fn main() {
    let s = String::from("data");
    takes_ownership(s);
    // s is moved; cannot use s here
}
```

To use a value after passing it to a function without moving, **borrow** it instead.

### 4. References and borrowing

A **reference** lets you access a value without owning it. Creating a reference is **borrowing**.

- **`&T`** — shared, immutable borrow. Many `&T` to the same value may coexist.
- **`&mut T`** — exclusive, mutable borrow. Only one active `&mut T` at a time, and no overlapping `&T` to that value while it exists.

```rust
fn len(s: &String) -> usize {
    s.len()
}

fn push_exclaim(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut name = String::from("Rust");
    let n = len(&name);
    push_exclaim(&mut name);
    println!("{name} ({n})");
}
```

Borrowing rules prevent data races and iterator invalidation style bugs: you cannot mutate the underlying data through one path while another path assumes it is stable.

**Reborrowing** happens naturally when you pass `&mut T` into a function that needs a shorter mutable borrow; the compiler tracks borrow regions.

### 5. The slice type

A **slice** is a view onto a contiguous sequence: pointer + length, without owning the data.

| Type | Meaning |
|------|---------|
| `&[T]` | Slice of `T` elements |
| `&mut [T]` | Mutable slice |
| `&str` | Slice of UTF-8 string data (string slice) |

```rust
fn first_word(s: &str) -> &str {
    s.split_whitespace().next().unwrap_or("")
}

fn main() {
    let text = String::from("ship it");
    let w = first_word(&text);
    // text is still owned; w borrows into it
    println!("{w}");
}
```

APIs should prefer **`&str` over `&String`** and **`&[T]` over `&Vec<T>`** when they only need a view—callers with owned or borrowed data can both pass slices (deref coercion helps: `&String` coerces to `&str`).

Slicing syntax `s[start..end]` requires valid indices (and char boundaries for strings). Out-of-range panics at runtime; prefer checked methods when indices come from untrusted input.

### 6. Lifetimes: relating borrows to data

A **lifetime** is a name for the region of code during which a reference is valid. Most lifetimes are **inferred**. You write them explicitly when the compiler cannot tell how input and output borrows relate—especially in **struct fields that store references** and in some function signatures with multiple reference parameters.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() >= y.len() { x } else { y }
}
```

Here `'a` says: the returned reference is valid for as long as **both** inputs are. You cannot return a borrow of a local that dies at the end of the function—the compiler rejects that dangling reference.

You do not need to annotate every function. Start from the error message; add lifetimes when API contracts need to state relationships.

### 7. Lifetime elision

**Elision rules** let the compiler fill in lifetimes in common patterns so signatures stay readable. Intuition:

- Each input reference parameter gets its own lifetime parameter if needed.
- If there is exactly one input lifetime, it is assigned to all elided output lifetimes.
- If there are multiple input lifetimes but one is `&self` / `&mut self`, the output elided lifetimes use `self`’s lifetime.

When elision cannot pick a unique meaning, rustc asks for explicit annotations. That is a design signal: clarify which borrow outlives the call.

### 8. Dangling references are compile errors

Languages with unchecked pointers allow returning addresses of stack frames that are gone. Rust rejects this:

```rust
// Does not compile: returns reference to local
// fn bad() -> &str {
//     let s = String::from("nope");
//     &s
// }
```

The fix is usually to **return an owned value** (`String`) or to take a reference that the **caller** owns and return a sub-borrow tied to that caller’s data. The borrow checker is not being pedantic for sport—it is enforcing validity.

---

## 2. Advanced concepts

### 1. Aliasability XOR mutability

The slogan: either many readers **or** one writer (through references), not both at once for the same path. Interior mutability (`RefCell`, `Mutex`, atomics) selectively bends this under runtime or hardware rules; those types are the exception path and carry their own failure modes (`RefCell` panics on violation; `Mutex` can deadlock).

### 2. NLL and borrow regions

**Non-lexical lifetimes** (stabilized years ago) mean borrows often end after last use, not only at lexical scope end. Code that “looks” like it overlaps may compile because the mutable borrow ended earlier. When it still fails, restructure into smaller blocks or split data so borrows do not contend.

### 3. Partial moves

Moving one field out of a struct can make the whole struct partially moved and unusable until reconstructed. Pattern matching and `Option::take` patterns help. This surprises developers coming from GC languages where field assignment never “invalidates” the parent object.

### 4. `'static`

The **`'static`** lifetime means the data can live for the entire program run—string literals (`"hello"` has type `&'static str`), or owned data leaked/leaked-to-static intentionally. Requiring `'static` in APIs (common in thread spawning before scoped threads) often forces `'static` owned data (`String`) rather than borrowing locals—read such bounds carefully.

### 5. Edition and legacy notes

Ownership rules themselves are not edition-gated; they are foundational across **2015–2024**. What changes across editions is mostly surface syntax and idioms around modules, paths, and some patterns. Older materials may show:

- More explicit lifetime noise where elision now suffices.
- Pre-NLL examples that rearrange code unnecessarily.
- **`try!`** instead of **`?`** in fallible code adjacent to borrows—prefer `?` in modern code.

Crates on older editions still compile on modern rustc; ownership errors mean the same thing.

### 6. Failure modes and how to respond

| Compiler complaint | Productive response |
|--------------------|---------------------|
| value moved | Borrow (`&`/`&mut`), redesign to return ownership, or clone with eyes open |
| cannot borrow as mutable | End the immutable borrow first; split scopes; avoid holding iterators while mutating |
| missing lifetime specifier | Name how inputs/outputs relate; or return owned data |
| does not live long enough | Stop returning refs to locals; store owned data in structs |
| clone soup | Often a design smell—prefer borrowing APIs (`&str`, `&[T]`) |

Fighting the borrow checker with `unsafe` to “win” is almost always the wrong staff-level outcome.

### 7. `Drop`, RAII, and drop order

**RAII** in Rust means: owning a value ties resource lifetime to scope. When the owner goes out of scope, Rust runs **`Drop::drop`** (if implemented) and then releases the value’s memory. File handles, locks, sockets, and heap buffers all rely on this—`MutexGuard` unlocking on drop is the classic example.

**Drop order** (safe mental model for structs and locals):

- Local variables in a function are dropped in **reverse declaration order** at the end of their scope.
- Struct and tuple fields are dropped in **declaration order** (first field first), then the outer value finishes dropping.
- Moving a value out of a variable means that variable will not drop it later—the new owner will.

Custom `Drop` impls must not assume other fields or sibling locals still exist in unusual orders if you have been moving pieces around; keep destructors simple and panic-safe. Prefer composing types that already implement `Drop` over hand-rolled cleanup unless you own a raw resource.

### 8. `mem::forget`, leaks, and `ManuallyDrop`

Rust’s safety story is **not** “nothing can leak.” It is “safe code does not cause undefined behavior.” **Leaking** memory or skipping destructors is allowed in that sense—but it is usually a bug or a deliberate tradeoff.

| Tool | Meaning |
|------|---------|
| **`std::mem::forget(x)`** | Disposes of `x` **without running** its destructor. Ownership ends; `Drop` side effects (unlock, close, free via drop glue) do not run. |
| **Leak policy** | Libraries may leak under memory pressure or for `'static` promotion (`Box::leak`); document it. Accidental forget of a guard is a correctness bug (for example mutex left locked). |
| **`ManuallyDrop<T>`** | Wrapper that **suppresses** automatic drop of `T` until you explicitly `drop` / `take` it. Used when drop order must be controlled or when building `unsafe` abstractions. |

Staff rule: never `forget` a lock guard, file, or other RAII token to “fix” the borrow checker. Use `ManuallyDrop` only with a clear ownership protocol. Prefer redesign (owned values, scopes, `Option::take`) in safe application code.

### 9. Smart pointers: choosing `Box`, `Rc`, `Arc`, and `Cow`

| Type | Ownership model | Typical use |
|------|-----------------|-------------|
| **`Box<T>`** | Unique owned heap value | Large values, recursive types, trait objects (`Box<dyn Trait>`), stable addresses |
| **`Rc<T>`** | Single-threaded **reference-counted** shared ownership | Graphs/trees with shared nodes inside one thread; not `Send` |
| **`Arc<T>`** | Thread-safe reference-counted shared ownership | Shared immutable (or interior-mutable) state across threads—see concurrency chapter |
| **`Cow<'_, T>`** / **`Cow<'_, str>`** | **Clone-on-write** borrow-or-own | APIs that usually borrow (`&str`) but sometimes need to allocate an owned `String` |

Prefer **`&T` / `&mut T`** when a caller already owns the data. Use **`Box`** when you need heap indirection with one owner. Use **`Rc`/`Arc`** only when multiple owners must keep the value alive and lifetimes cannot express a single owner. Use **`Cow`** at boundaries that normalize input without forcing every caller to allocate.

### 10. Cloning `Arc`: cheap handle versus deep `Clone`

**`Arc::clone(&arc)`** (or `arc.clone()`) increments the reference count and produces another handle to the **same** allocation—cheap pointer-sized work, not a deep copy of `T`. Dropping a handle decrements; the inner value drops when the last strong reference is gone (`Weak` does not keep it alive).

By contrast, cloning the **inner** value (`(*arc).clone()` when `T: Clone`, or cloning a `Vec`/`String` you extracted) duplicates the payload and can allocate. Review habit: in hot paths, ask whether you needed another **handle** (`Arc::clone`) or another **copy of the data**. Shared immutable config behind `Arc` is a common agent pattern; deep-cloning large structures per request usually is not.

### 11. `Weak<T>`: breaking `Rc` / `Arc` cycles

**Strong** references (`Rc` / `Arc`) keep the allocation alive. If A owns B and B owns A through strong counts, neither count reaches zero—the cycle **leaks**. **`Weak<T>`** (from `std::rc` or `std::sync`) is a non-owning handle: it does not keep the value alive. Upgrade with **`upgrade()`** → `Option<Rc<T>>` / `Option<Arc<T>>` (None if already dropped).

Typical pattern: parent holds `Rc`/`Arc` children; child holds **`Weak`** back to parent (or cache → owner). Staff rule: any long-lived graph with back-edges should name which edges are weak. Prefer clear single-owner trees when you can; reach for `Weak` when shared ownership is real and cycles would otherwise form.

### 12. Interior mutability (reminder → chapter 12)

Ownership and borrowing assume **aliasability XOR mutability** through ordinary references. When you need mutation behind a shared `&` (or shared ownership), that is **interior mutability**: `Cell` / `RefCell` (single-threaded), `Mutex` / `RwLock` / atomics (multi-threaded). Those types enforce rules at runtime or with hardware atomics; they do not erase the ownership model—they localize where exclusivity is checked later. Details, failure modes (`RefCell` panic, mutex poison), and `Send`/`Sync` choice live in **chapter 12**. Do not invent ad hoc `unsafe` mutation to dodge the borrow checker.

### 13. Lifetime bounds on trait objects (`dyn Trait + 'a`)

A trait object carries not only the trait but often a **lifetime bound**: `dyn Trait + 'a` means every borrow inside the erased concrete type outlives `'a`. Common forms:

| Form | Intuition |
|------|-----------|
| **`dyn Trait + 'static`** | No short borrows; owned or `'static` data (typical for spawned tasks and many error objects) |
| **`dyn Trait + 'a`** | May borrow data tied to `'a` (borrowed trait objects, short-lived adapters) |
| **`Box<dyn Trait>`** | Often elides to `+ 'static` in practice for owned boxes—spell `'a` when the object borrows |

You write the bound when storing or returning trait objects that borrow. If the compiler demands `'static`, it is asking for owned data (or a longer borrow), not for a lifetime annotation ritual. Prefer owned `Box<dyn Trait>` at process-long boundaries; use `dyn Trait + 'a` when zero-copy adapters genuinely borrow caller buffers.

---

## 3. Applications and use cases

### Software engineering and API design

- Prefer **borrowing parameters** and **owned returns** when creating new data; prefer **borrowing returns** when pointing into caller-owned buffers (with correct lifetimes).
- Store owned data (`String`, `PathBuf`, `Vec`) in long-lived structs; store references only when a clear parent scope owns the backing memory (zero-copy parsers, arenas).
- Use slices at boundaries for flexibility and fewer needless allocations.

### Security

- Ownership prevents many memory-corruption exploits in safe Rust; still validate **index and length** logic—panics and logic bugs remain.
- Be cautious with `unsafe` transmute or raw pointers that bypass lifetimes; they reintroduce dangling-reference risk.
- Clever lifetime tricks in public APIs need documentation and tests; reviewers must understand what is borrowed.

### Reliability

- Prefer designs that fail at compile time over runtime borrow flags (`RefCell`) unless shared ownership is truly required.
- In concurrent code, ownership plus `Send`/`Sync` is your first line; locks own data they protect.
- Resource cleanup via `Drop` is reliable if ownership graphs stay clear—avoid cycles with `Rc`/`RefCell` unless necessary (`Weak` breaks cycles).

### Performance

- Moves of large `Vec`/`String` are cheap (pointer-sized handles); clones are expensive—measure before cloning in hot loops.
- Returning `&str` into caller buffers avoids allocation; returning `String` is clearer when the function creates new text.
- Slice-based APIs enable zero-copy parsing pipelines common in networking and observability agents.

### DevOps and operational code

- Config loaders: read into owned `String`/`Vec<u8>`, then expose `&str` views transiently during parse—or deserialize into owned structs for the process lifetime.
- Long-lived agents should own their configuration and buffers; short borrows live inside request/tick scopes.
- When wrapping C libraries, ownership of allocations must be documented on the safe API—lifetimes alone cannot save incorrect `free` in `unsafe` blocks.

### Staff-level review checklist

- Reviewers can state **who owns** each buffer and **when it drops** for hot paths under change.
- Public APIs use **`&str` / `&[T]`** (or clear owned types) rather than over-constraining on `&String` / `&Vec<_>`.
- Struct fields containing references have **documented lifetime bounds** and an obvious owner outside the struct.
- No new `unsafe` introduced solely to sidestep the borrow checker.
- `.clone()` in tight loops is justified with a comment or replaced by borrowing.
- Concurrent access patterns name the lock/ownership strategy; shared mutation is not “we'll add mutex later.”
- Tests or examples demonstrate non-dangling use of any returned references.
- Graphs with `Rc`/`Arc` back-edges use **`Weak`** (or a single-owner redesign); cycles are an explicit leak class.
- Trait objects that borrow spell **`dyn Trait + 'a`**; process-long objects are `'static` or owned.

---

## References

- [The Rust Programming Language — Understanding Ownership](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html)
- [The Rust Programming Language — References and Borrowing](https://doc.rust-lang.org/stable/book/ch04-02-references-and-borrowing.html)
- [The Rust Programming Language — The Slice Type](https://doc.rust-lang.org/stable/book/ch04-03-slices.html)
- [The Rust Programming Language — Validating References with Lifetimes](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html)
- [The Rust Programming Language — Smart Pointers](https://doc.rust-lang.org/stable/book/ch15-00-smart-pointers.html)
- [The Rust Programming Language — `Rc<T>` and the `Weak<T>` type](https://doc.rust-lang.org/stable/book/ch15-06-reference-cycles.html)
- [The Rust Programming Language — Using Trait Objects That Allow for Values of Different Types](https://doc.rust-lang.org/stable/book/ch17-02-trait-objects.html)
- [The Rustonomicon — Lifetimes](https://doc.rust-lang.org/nomicon/lifetimes.html)
- [The Rust Reference — Destructors](https://doc.rust-lang.org/stable/reference/destructors.html)
- [`Drop`](https://doc.rust-lang.org/stable/std/ops/trait.Drop.html)
- [`std::mem::forget`](https://doc.rust-lang.org/stable/std/mem/fn.forget.html)
- [`ManuallyDrop`](https://doc.rust-lang.org/stable/std/mem/struct.ManuallyDrop.html)
- [`Box`](https://doc.rust-lang.org/stable/std/boxed/struct.Box.html)
- [`Rc`](https://doc.rust-lang.org/stable/std/rc/struct.Rc.html)
- [`std::rc::Weak`](https://doc.rust-lang.org/stable/std/rc/struct.Weak.html)
- [`Arc`](https://doc.rust-lang.org/stable/std/sync/struct.Arc.html)
- [`std::sync::Weak`](https://doc.rust-lang.org/stable/std/sync/struct.Weak.html)
- [`Cow`](https://doc.rust-lang.org/stable/std/borrow/enum.Cow.html)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
