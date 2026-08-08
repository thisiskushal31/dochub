# Unsafe, FFI, and boundaries

[← Back to Rust](./README.md)

## What this chapter covers

What the **`unsafe`** keyword means (programmer-asserted invariants, not a free-for-all), how **raw pointers**, **FFI (`extern "C"`)**, and **`MaybeUninit`** fit, what **soundness** requires, and how teams **minimize unsafe surface** while still using it where systems work demands it. After this chapter you should review `unsafe` as a trust boundary—never claim it is “forbidden,” and never treat it as ordinary Rust.

---

## 1. Concepts

### 1. What `unsafe` means

In safe Rust, the compiler rejects programs that would cause **undefined behavior (UB)** of the kinds the type system tracks. **`unsafe`** marks places where **you** assert that additional invariants hold—invariants the compiler cannot check.

`unsafe` appears as:

- **`unsafe` blocks** — execute unsafe operations inside otherwise safe functions
- **`unsafe fn`** — callers must uphold documented preconditions
- **`unsafe trait` / `unsafe impl`** — implementing or using the trait has safety obligations (for example incorrect `Send`/`Sync` impls)
- **`unsafe` in FFI** — calling foreign functions or dereferencing foreign pointers

**`unsafe` does not turn off the borrow checker wholesale.** It allows a specific set of extra operations (dereference raw pointers, call `unsafe fn`, access mutable statics, implement unsafe traits, and so on). Everything else still type-checks.

Rust does **not** forbid `unsafe`. Production systems use it for FFI, performance-critical data structures, and OS interfaces. The engineering rule is **constraint and review**, not prohibition theater.

### 2. Raw pointers

**`*const T`** and **`*mut T`** are raw pointers: they may be null, dangling, or misaligned; they do not borrow-check. Creating pointers can be safe; **dereferencing** them requires `unsafe`. Safe references (`&T`, `&mut T`) must always be valid; raw pointers shift that obligation to the programmer at dereference time.

```rust
let mut x = 5;
let r: *mut i32 = &mut x;
unsafe {
    *r += 1;
}
```

Prefer safe abstractions (`slice::from_raw_parts` behind a checked API, owned wrappers) over scattering dereferences through business logic.

### 3. FFI and `extern "C"`

Foreign function interfaces connect Rust to C ABIs (and other languages that speak C ABI):

```rust
unsafe extern "C" {
    fn strlen(s: *const std::os::raw::c_char) -> usize;
}
```

Calling most foreign functions is `unsafe` because the compiler cannot verify aliasing, lifetimes, nullability, or thread-safety of the C side. On the Rust export side, **`#[no_mangle] pub extern "C" fn ...`** exposes symbols; those functions must uphold the ABI and must not unwind across FFI boundaries in ways the other language cannot handle (panic strategy matters).

Typical obligations:

- Pointers are non-null (or null is documented and handled)
- Buffers are large enough and aligned
- Ownership transfer matches documentation (who frees what)
- No use-after-free across the language boundary

### 4. `MaybeUninit`

**`MaybeUninit<T>`** represents memory that may not yet be a valid `T`. It is the correct tool for staged initialization, foreign out-parameters, and avoiding false “initialized” assumptions. Reading as `T` before initialization is UB. Convert with careful APIs (`assume_init` only when you have proven initialization).

This matters for FFI out-pointers and for manual allocation patterns that safe `Vec`/`Box` constructors would otherwise handle.

### 5. Soundness

A crate is **sound** if safe code cannot cause UB when using only its safe API—regardless of how adversarial the safe caller is. Unsoundness often looks like:

- An `unsafe` block that misses an edge case (alignment, aliasing, lifetime)
- A safe function that wraps unsound unsafe internally without enforcing preconditions
- Incorrect `unsafe impl Send/Sync`
- FFI bindings that mark safe wrappers around unchecked pointers

**Safe ≠ correct.** Soundness is specifically about UB. Logic bugs remain possible in fully safe code.

### 6. Minimize the unsafe surface

Staff practice:

- Push `unsafe` into **small modules** with documented **Safety** comments (preconditions, postconditions)
- Expose **safe APIs** that enforce checks (lengths, indices, state machines)
- Prefer battle-tested crates for common unsafe patterns over home-grown atomics/FFI
- Use `#![forbid(unsafe_code)]` in crates that must stay pure safe; allowlist crates that own the boundary
- Count and review every `unsafe` block in code review—same severity class as auth changes

---

## 2. Advanced concepts

### 1. Undefined behavior is not “weird but OK”

If UB occurs, optimizers may delete checks, reorder memory, or worse. “It worked in debug” is not evidence of soundness. Tools (`miri` on the nightly/tooling side for many patterns, sanitizers for some FFI) help but do not replace invariants documentation.

### 2. Aliasing and stacked borrows mental model

Safe references follow exclusive mutability rules. Inside `unsafe`, you must not create overlapping mutable references or invalidate references the safe world still holds. When in doubt, copy into owned buffers at the boundary instead of inventing clever aliasing.

### 3. `static mut` and mutable globals

Mutable statics require `unsafe` to access and are hard to get right under concurrency. Prefer `Mutex`, `OnceLock` / `LazyLock`-style patterns, or thread-locals with clear ownership. Global mutable state is an ops and test hazard even when sound.

### 4. Panic across FFI

Unwinding from Rust into C (or the reverse) without an ABI that supports it is UB. Use `catch_unwind` at boundaries when you must translate panics to error codes, or abort on panic in FFI-heavy libraries. Document the panic strategy for `cdylib` consumers.

### 5. Binding generation and bitness

`bindgen`-style workflows reduce transcription errors but do not prove semantic correctness (who owns a returned pointer?). Match platform `struct` layouts, `#[repr(C)]`, and integer widths. Test on every target you ship (chapter 16 covers targets).

### 6. Edition and language notes

`unsafe` semantics are foundational across editions. Newer editions may change syntax around unsafe extern blocks and related idioms—follow the Edition Guide when upgrading, and keep MSRV-aware CI. The meaning of “programmer upholds invariants” does not change with edition fashion.

### 7. Supply chain of unsafe

Your crate may be safe while a dependency’s `unsafe` is unsound. Audits and `cargo` tooling (later security chapter) treat transitive unsafe as part of your risk budget.

---

## 3. Applications and use cases

### Software engineering

- Design FFI crates as thin boundaries: convert C pointers to owned Rust types ASAP; do not leak raw pointers through the app.
- Write explicit **Safety** comments on every `unsafe` block stating which invariants justify it.
- Prefer `repr(C)` structs and clear ownership diagrams in docs for cross-language APIs.

### Security

- Memory unsafety at FFI is a classic exploit path—treat bindings like security-sensitive code.
- Validate lengths from untrusted peers before `from_raw_parts`.
- Do not expose `unsafe fn` in public APIs without ironclad docs and preferably safe wrappers.

### Reliability and operations

- Crashes in native extensions show up as process abort; capture build IDs and symbolize stacks.
- Version C libraries alongside Rust crates; ABI drift is an incident class.
- Feature-flag optional native deps so degraded modes remain possible.

### Performance

- Legitimate `unsafe` for skipping checks belongs behind measured hotspots, with safe fallbacks for tests.
- Do not use `unsafe` to silence borrow-checker complaints—restructure ownership instead.

### Staff-level review checklist

- Every `unsafe` block has a **Safety** justification tied to checked preconditions nearby.
- Public API is safe by default; `unsafe fn` is rare and documented.
- FFI ownership (alloc/free), nullability, alignment, and threading are written down.
- Panic strategy across FFI is defined (catch, abort, or proven non-unwind).
- `MaybeUninit` and raw slices are initialized before reads.
- No casual `unsafe impl Send/Sync`.
- `forbid(unsafe_code)` applied where the crate should stay pure; inventory exists where not.
- Reviewers treat new `unsafe` like a security change, not a style nit.

---

## References

- [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [The Rustonomicon — FFI](https://doc.rust-lang.org/nomicon/ffi.html)
- [The Book — Unsafe Rust](https://doc.rust-lang.org/stable/book/ch19-01-unsafe-rust.html)
- [The Rust Reference — Unsafety](https://doc.rust-lang.org/stable/reference/unsafety.html)
- [The Rust Reference — External blocks](https://doc.rust-lang.org/stable/reference/items/external-blocks.html)
- [`std::ptr`](https://doc.rust-lang.org/stable/std/ptr/)
- [`std::mem::MaybeUninit`](https://doc.rust-lang.org/stable/std/mem/union.MaybeUninit.html)
- [`std::ffi`](https://doc.rust-lang.org/stable/std/ffi/)
- [`extern` keyword](https://doc.rust-lang.org/stable/std/keyword.extern.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
