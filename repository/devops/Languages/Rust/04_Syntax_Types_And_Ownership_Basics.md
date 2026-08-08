# Syntax, types, and ownership basics

[← Back to Rust](./README.md)

## What this chapter covers

The minimum language surface to read and write Rust programs: **`fn main`**, bindings with **`let` / `mut`**, **scalar** and introductory **compound** types, **expressions versus statements**, **`loop` / `while` / `for`**, **shadowing**, type annotations at **boundaries**, the **never type `!`**, and a first encounter with **ownership** through moving a `String`—enough to understand compiler errors you will hit immediately, before the full ownership chapter deepens the model.

---

## 1. Concepts

### 1. Programs start at `main`

A binary crate needs an entrypoint:

```rust
fn main() {
    println!("hello");
}
```

`fn` declares a function. `main` takes no parameters and returns `()` (the unit type) implicitly in the common case. Returning `Result` from `main` is allowed so you can use `?` for fallible setup—covered with error handling later. Until then, treat `main` as “run these statements/expressions in order.”

`println!` is a **macro** (note the `!`). Macros expand before type checking; formatting macros are how you print in idiomatic Rust rather than a bare `print` function with C-style varargs.

### 2. Bindings: `let` and `mut`

Bindings are created with **`let`**:

```rust
let x = 5;
```

By default, bindings are **immutable**: you cannot assign `x = 6`. Mutability is opt-in:

```rust
let mut count = 0;
count += 1;
```

Immutability-by-default pushes you to minimize accidental state changes. It is not a deep freeze of heap data through every path—**interior mutability** types exist for advanced cases—but for ordinary variables, `mut` is the flag reviewers look for.

Constants use **`const`** (and compile-time-known values) with explicit types; statics use **`static`**. Prefer `let` for ordinary local state; reach for `const` for named literals and true constants.

### 3. Scalar types

Rust’s core scalar types:

| Category | Types | Notes |
|----------|-------|-------|
| **Integers** | `i8`–`i128`, `u8`–`u128`, `isize`, `usize` | `usize`/`isize` pointer-sized; `u8` common for bytes |
| **Floating point** | `f32`, `f64` | `f64` is the usual default inference for floats |
| **Boolean** | `bool` | `true` / `false` |
| **Character** | `char` | Unicode scalar value, 4 bytes—not a single C `char` byte |

Integer literals can use underscores for readability (`1_000_000`) and suffixes (`42u8`). Overflow in debug builds panics for arithmetic that checks; release defaults wrap for some operations—know your profile when doing checked math. Prefer explicit `checked_*`, `saturating_*`, or `wrapping_*` methods when overflow is security-relevant.

Type inference usually fills types from context; annotate when inference cannot decide or when clarity matters:

```rust
let port: u16 = 8080;
```

### 4. Compound types (introduction)

Two built-in compound forms appear everywhere:

**Tuples** — fixed-length, mixed types:

```rust
let pair: (i32, f64) = (1, 2.5);
let (a, b) = pair;
```

**Arrays** — fixed-length, same type, stack-allocated as a value:

```rust
let xs: [i32; 3] = [1, 2, 3];
```

**Slices** (`&[T]`, `&str`) borrow a view into contiguous data—central to APIs, fully treated in the next chapter. **`Vec<T>`** and **`String`** are heap-growable counterparts in `std`; they own their buffers.

**Structs** and **enums** are the main user-defined compound types; they get their own chapter. For now, know that almost all domain modeling in Rust uses them rather than anonymous bags of fields.

### 5. Expressions versus statements

Rust is expression-oriented. Many constructs produce values:

```rust
let y = {
    let t = 3;
    t + 1  // no semicolon → expression value is 4
};
```

A **statement** performs an action and does not yield a value usefully (or yields `()`). A semicolon after an expression turns it into a statement that discards the value.

`if` and `match` are expressions: branches must agree on types when used as values.

```rust
let abs = if n >= 0 { n } else { -n };
```

`()` is the unit type—the value of functions that “return nothing” and of blocks that end with a statement.

### 6. Control flow: `loop`, `while`, and `for`

Three looping forms cover most everyday code:

| Form | Role |
|------|------|
| **`loop`** | Infinite loop until `break` (or `return` / panic). Prefer when the exit condition is in the middle or when you need a **value** from `break`. |
| **`while` condition** | Repeat while a `bool` expression is true. |
| **`for` pattern in iterator** | Iterate an `IntoIterator` (ranges, collections, adapters). Desugars to iterator consumption—see chapter 09 for `iter` vs `into_iter`. |

```rust
let mut n = 0;
while n < 3 {
    n += 1;
}
for i in 0..3 {
    let _ = i;
}
```

`continue` skips to the next iteration. Labels (`'outer: loop { … break 'outer; }`) disambiguate nested loops. Prefer `for` over index-managed `while` when you are walking a collection.

### 7. Shadowing

Rust allows **shadowing**: a new `let` with the same name in the same scope replaces the previous binding.

```rust
let spaces = "   ";
let spaces = spaces.len(); // now usize
```

Shadowing differs from mutation: you can change **type** across shadows, and you do not need `mut`. Used well, it transforms values through steps (`String` → parsed config). Used poorly, it obscures which binding a reader is looking at—prefer new names when both values matter simultaneously.

### 8. Ownership basics (teaser): moving a `String`

Every value has a single **owner**. When the owner goes out of scope, Rust drops the value.

For types that manage heap memory, such as **`String`**, assignment **moves** ownership rather than implicitly copying the buffer:

```rust
let s1 = String::from("hello");
let s2 = s1; // move: s1 is no longer valid
// println!("{s1}"); // compile error: borrow of moved value
println!("{s2}");
```

This is intentional: a shallow copy of a `String` handle would create two owners of one buffer (double-free risk). Rust forbids using `s1` after the move.

Types that are cheap and bitwise-copyable implement **`Copy`** (for example integers, `bool`, shared references). For those, assignment copies the value and both names remain valid. `String` is not `Copy`; use **`.clone()`** when you truly need a deep copy of the heap data.

```rust
let n1 = 5;
let n2 = n1; // Copy: n1 still usable
let s = String::from("x");
let t = s.clone(); // explicit heap clone
```

The next chapter expands this into borrowing, mutable references, slices, and lifetimes. The teaser is enough to interpret the most common beginner error: “value moved here.”

### 9. Functions and type annotations at boundaries

Function signatures usually spell parameter and return types:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

The last expression in a block is the return value when there is no semicolon (or use `return` early). Explicit signature types are the API contract; inference works inside function bodies.

**Inference limits:** rustc infers aggressively *inside* a function body from uses and annotations nearby, but **item boundaries** (function parameters, return types, `const`/`static` types, trait method signatures, and often struct fields you expose) generally need explicit types. Ambiguous literals (`Default::default()`, empty `vec![]` without a later use that pins `T`) also force annotations. When inference fails, annotate at the boundary rather than scattering turbofish everywhere.

---

## 2. Advanced concepts

### 1. `break` / `continue` and values from `loop`

`continue` and bare `break` work in all loop forms. **`loop` is special:** `break expr` makes the whole `loop` expression evaluate to `expr`, so you can write retry/search patterns without a mutable “result” slot:

```rust
let found = loop {
    let sample = next_sample();
    if sample.is_ready() {
        break sample; // type of `found` is the type of `sample`
    }
};
```

`while` and `for` do **not** take a value from `break` in the same way—their expression type is `()`. Use `loop` when the exit value is the point of the construct; use `while`/`for` when you only need side effects or iterator-driven traversal.

### 2. Why immutability is not “const everything”

`let x = vec![1, 2];` prevents rebinding/replacing `x`, but if you had `let mut x`, you could push. Separately, **`Cell` / `RefCell` / atomics / mutexes** allow mutation through shared references under rules—advanced tools that exist because exclusive `&mut` is not always how shared state works. Do not reach for them to silence the borrow checker casually.

### 3. Integer size and portability

`usize` is the type of container lengths and indices. Code that assumes `usize` is 64-bit breaks mental models on some embedded 32-bit targets. For on-wire formats, prefer fixed-width integers (`u32`, `u64`) with explicit endian conversion.

### 4. `char` versus UTF-8 bytes

A Rust `char` is a Unicode scalar value. A string `len()` counts **bytes** in UTF-8, not characters. Indexing a `String` with `s[0]` is not allowed as a byte-or-char ambiguity prevention—use iterators or careful slicing on char boundaries.

### 5. The never type `!`

The **never type** (`!`) is the type of computations that **do not produce a value** because they diverge: they panic, loop forever without breaking, or otherwise never reach a normal continuation. In type checking, `!` can coerce into any type, which is why `panic!("…")` or `return` can sit in one branch of an `if`/`match` while the other branch returns a real `T`.

You meet `!` mainly through:

- `panic!`, `todo!`, `unimplemented!`, `unreachable!`
- Functions declared `-> !` (for example a process that always exits)
- Infinite `loop { … }` with no `break`, in positions that need a type

You do **not** invent `!` as an everyday annotation for ordinary APIs. Prefer concrete success/error types (`Result`, enums) for recoverable control flow; reserve divergence for true “this path never returns.” Historical note: `!` spent years as a special unnameable/unstable story before becoming a stable primitive type—modern stable rustc treats it as a real type, but staff still rarely write `-> !` outside exit-only or panic-only helpers.

### 6. Edition notes affecting everyday syntax

- **`?` operator** — idiomatic error propagation. The old **`try!`** macro is **legacy**; new code and reviews should use **`?`**. You may still see `try!` in pre-`?` examples or very old crates—treat it as a rewrite hint, not a pattern to copy.
- **`dyn Trait`** — older editions allowed bare trait object syntax in more places; modern style is explicit `dyn`.
- Path and module syntax cleaned up in **2018**; reading 2015-era code may show more `extern crate` and `mod foo { }` patterns.

Modern rustc still compiles those older editions; prefer current idioms in new code.

### 7. `const` versus `static` (deeper)

Both name long-lived values, but they are not interchangeable:

| | `const` | `static` |
|--|---------|----------|
| **Meaning** | Named compile-time value; inlined/copied at use sites as the compiler chooses | A real item with a fixed memory address for the program’s lifetime |
| **Type** | Must be explicit | Must be explicit |
| **Mutability** | Immutable by nature | `static` is immutable; `static mut` exists but is `unsafe` to read/write—prefer interior mutability types instead |
| **When to use** | Limits, sizes, pure lookup tables, shared literals | Process-wide state that must have a stable address (rare in app code); FFI globals; `lazy_static` / `OnceLock` patterns for deferred init |

`const` items can be used in more compile-time contexts (array lengths, other consts). Prefer **`const`** for “named literal / pure value.” Reach for **`static`** only when you need identity (one location) or interoperability that requires an address—not as a substitute for ordinary `let` locals.

### 8. `const fn` (high level)

A function marked **`const fn`** may be called from constant contexts (initializing `const`/`static`, array sizes, and other compile-time evaluation) **when** its body stays within what the compiler allows in that context. The set of operations legal in `const fn` has grown over editions and releases; it is not “any Rust at compile time.”

Team intuition:

- Use `const fn` for small pure helpers (unit conversions, bit masks, simple constructors) you want usable both at runtime and in `const`.
- Do not assume heap allocation, I/O, or arbitrary trait methods work in `const`—many still do not, or only under narrow conditions.
- Calling a `const fn` at runtime is normal; the `const` marker expands *where* it can be evaluated, not that it always runs only at compile time.

When in doubt, keep compile-time logic boring and check the Reference / release notes rather than overclaiming “everything is constexpr.”

### 9. Declarative macros (`macro_rules!`) for teams

**`macro_rules!`** defines **declarative** (“by example”) macros: pattern → template expansion before type checking. You already use them via `println!`, `vec!`, and `assert!`.

When macros beat functions:

- Variadic or repeating syntax (`vec![a, b, c]`, custom `log!(level, "…", …)`).
- Needing to accept syntax that is not a normal value (export a mini-DSL at a crate boundary).
- Implementing patterns that must expand differently per token shape.

When functions (or generics) are better:

- Ordinary abstraction over values and types—clearer signatures, better error messages, no macro hygiene surprises.
- Anything reviewers can express with `impl Trait`, generics, or a plain helper.

**Hygiene intuition:** bindings introduced inside a macro body do not silently capture or collide with caller names the way naive textual substitution would; identifiers from the macro’s definition context and the call site are kept distinct unless the macro intentionally uses patterns that forward caller identifiers. Still write macros as if future readers will expand them mentally—prefer small, documented macros over clever ones.

Staff bar: new `macro_rules!` in application code needs a one-line justification; libraries may export macros, but functions remain the default API.

### 10. Common failure modes at this stage

| Symptom | Likely cause |
|---------|----------------|
| “cannot assign twice to immutable variable” | Missing `mut` |
| “value moved here” | Ownership transfer of `String`/`Vec`/etc. |
| “mismatched types” on `if` | Branches return different types |
| Overflow panic in debug | Arithmetic exceeded type range |
| Expected `()`, found `i32` | Extra semicolon discarded a return expression |
| “type annotations needed” | Inference failed at a boundary or unused generic |
| `break` value type mismatch | Arms of `break expr` disagree, or used on `while`/`for` expecting `()` |

---

## 3. Applications and use cases

### Software engineering

- Prefer small functions with explicit types at API boundaries; let inference work inside.
- Use `loop` + `break value` for search/retry that yields a result; use `for` for iterator walks.
- Use shadowing for staged parsing (`raw` → `trimmed` → `parsed`) when it improves clarity; otherwise name intermediates.
- Default to immutable bindings; justify every `mut` in review.

### Security

- Be explicit about integer widths for lengths and sizes from the network; check overflows.
- Do not treat `unwrap()` on parse results as acceptable at untrusted boundaries—progress to `Result` in the error-handling chapter.
- Remember UTF-8: validating text protocols needs encoding awareness, not C-string assumptions.

### Reliability

- Fail fast on impossible states with clear panics in internal code; use `Result` for expected failures once you reach that chapter.
- Keep `main` thin: parse args, call library functions, map errors to exit codes.

### DevOps / tooling literacy

- When reading Rust CLIs, start at `main.rs`, then follow `let` bindings into config structs.
- Binary size and performance are rarely about `let` vs `let mut`; focus on allocations (`String`/`Vec` growth) once profiling begins.

### Staff-level review checklist

- Public functions have clear parameter/return types; no surprise `mut` on arguments without need.
- No silent reliance on debug-only overflow panics for security checks.
- Moves of owned buffers (`String`, `Vec`) are intentional; accidental use-after-move is fixed by borrow/redesign, not by sprinkling `.clone()` everywhere without thought.
- New code avoids obsolete `try!` and 2015-only module noise unless maintaining that edition.
- Team agrees on formatting (`rustfmt`) so expression-vs-statement style stays consistent.

---

## References

- [The Rust Programming Language — Common Programming Concepts](https://doc.rust-lang.org/stable/book/ch03-00-common-programming-concepts.html)
- [The Rust Programming Language — Variables and Mutability](https://doc.rust-lang.org/stable/book/ch03-01-variables-and-mutability.html)
- [The Rust Programming Language — Control Flow](https://doc.rust-lang.org/stable/book/ch03-05-control-flow.html)
- [The Rust Programming Language — Understanding Ownership](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html)
- [The Rust Programming Language — Macros](https://doc.rust-lang.org/stable/book/ch20-05-macros.html)
- [The Rust Reference — Constant items](https://doc.rust-lang.org/stable/reference/items/constant-items.html)
- [The Rust Reference — Static items](https://doc.rust-lang.org/stable/reference/items/static-items.html)
- [The Rust Reference — Constant evaluation](https://doc.rust-lang.org/stable/reference/const_eval.html)
- [The Rust Reference — Macros by example](https://doc.rust-lang.org/stable/reference/macros-by-example.html)
- [The Rust Reference — Never type](https://doc.rust-lang.org/stable/reference/types/never.html)
- [Primitive Type `str`](https://doc.rust-lang.org/stable/std/primitive.str.html)
- [Primitive Type `!` (never)](https://doc.rust-lang.org/stable/std/primitive.never.html)
- [Struct `String`](https://doc.rust-lang.org/stable/std/string/struct.String.html)
- [The Rust Reference — Types](https://doc.rust-lang.org/stable/reference/types.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust By Example](https://doc.rust-lang.org/stable/rust-by-example/)
- [Rust By Example — loop / break / continue](https://doc.rust-lang.org/stable/rust-by-example/flow_control/loop.html)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
