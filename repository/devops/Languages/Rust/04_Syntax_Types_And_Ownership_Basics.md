# Syntax, types, and ownership basics

[← Back to Rust](./README.md)

## What this chapter covers

The minimum language surface to read and write Rust programs: **`fn main`**, bindings with **`let` / `mut`**, **scalar** and introductory **compound** types, **expressions versus statements**, **shadowing**, and a first encounter with **ownership** through moving a `String`—enough to understand compiler errors you will hit immediately, before the full ownership chapter deepens the model.

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

### 6. Shadowing

Rust allows **shadowing**: a new `let` with the same name in the same scope replaces the previous binding.

```rust
let spaces = "   ";
let spaces = spaces.len(); // now usize
```

Shadowing differs from mutation: you can change **type** across shadows, and you do not need `mut`. Used well, it transforms values through steps (`String` → parsed config). Used poorly, it obscures which binding a reader is looking at—prefer new names when both values matter simultaneously.

### 7. Ownership basics (teaser): moving a `String`

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

### 8. Functions and type annotations at boundaries

Function signatures usually spell parameter and return types:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

The last expression in a block is the return value when there is no semicolon (or use `return` early). Explicit signature types are the API contract; inference works inside function bodies.

---

## 2. Advanced concepts

### 1. Why immutability is not “const everything”

`let x = vec![1, 2];` prevents rebinding/replacing `x`, but if you had `let mut x`, you could push. Separately, **`Cell` / `RefCell` / atomics / mutexes** allow mutation through shared references under rules—advanced tools that exist because exclusive `&mut` is not always how shared state works. Do not reach for them to silence the borrow checker casually.

### 2. Integer size and portability

`usize` is the type of container lengths and indices. Code that assumes `usize` is 64-bit breaks mental models on some embedded 32-bit targets. For on-wire formats, prefer fixed-width integers (`u32`, `u64`) with explicit endian conversion.

### 3. `char` versus UTF-8 bytes

A Rust `char` is a Unicode scalar value. A string `len()` counts **bytes** in UTF-8, not characters. Indexing a `String` with `s[0]` is not allowed as a byte-or-char ambiguity prevention—use iterators or careful slicing on char boundaries.

### 4. Divergence and `!`

The **never type** `!` is the type of expressions that do not return (for example `panic!` or infinite loops in type-checking positions). You will see it in enum variants and advanced APIs; beginners mostly meet it through panics and `todo!()`.

### 5. Edition notes affecting everyday syntax

- **`?` operator** — idiomatic error propagation; older code may still show the **`try!`** macro, which is obsolete for new code but may appear in ancient examples on old editions.
- **`dyn Trait`** — older editions allowed bare trait object syntax in more places; modern style is explicit `dyn`.
- Path and module syntax cleaned up in **2018**; reading 2015-era code may show more `extern crate` and `mod foo { }` patterns.

Modern rustc still compiles those older editions; prefer current idioms in new code.

### 6. Common failure modes at this stage

| Symptom | Likely cause |
|---------|----------------|
| “cannot assign twice to immutable variable” | Missing `mut` |
| “value moved here” | Ownership transfer of `String`/`Vec`/etc. |
| “mismatched types” on `if` | Branches return different types |
| Overflow panic in debug | Arithmetic exceeded type range |
| Expected `()`, found `i32` | Extra semicolon discarded a return expression |

---

## 3. Applications and use cases

### Software engineering

- Prefer small functions with explicit types at API boundaries; let inference work inside.
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
- [The Rust Programming Language — Understanding Ownership](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html)
- [Primitive Type `str`](https://doc.rust-lang.org/stable/std/primitive.str.html)
- [Struct `String`](https://doc.rust-lang.org/stable/std/string/struct.String.html)
- [The Rust Reference — Types](https://doc.rust-lang.org/stable/reference/types.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust By Example](https://doc.rust-lang.org/stable/rust-by-example/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
