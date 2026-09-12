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

Calling most foreign functions is `unsafe` because the compiler cannot verify aliasing, lifetimes, nullability, or thread-safety of the C side. On the Rust export side, a **`pub extern "C" fn ...`** with **`#[no_mangle]`** (Edition **2021** and earlier) or **`#[unsafe(no_mangle)]`** (Edition **2024**) exposes symbols; those functions must uphold the ABI and must not unwind across FFI boundaries in ways the other language cannot handle (panic strategy matters).

Typical obligations:

- Pointers are non-null (or null is documented and handled)
- Buffers are large enough and aligned
- Ownership transfer matches documentation (who frees what)
- No use-after-free across the language boundary

### 4. Crate types for FFI: `rlib`, `cdylib`, `staticlib`

Cargo/crate type selection decides **what artifact** you hand to foreign linkers. Defaults and common FFI choices:

| Crate type | Role |
|------------|------|
| **`rlib`** | Default Rust static library form for Rust-to-Rust linking (normal `cargo build` library dependency). Not the usual deliverable to a pure C consumer. |
| **`cdylib`** | **C-compatible dynamic library** (`.so` / `.dylib` / `.dll`). Typical when a host language or process `dlopen`s / links your Rust plugin at runtime. |
| **`staticlib`** | **C-compatible static archive** (`.a` / `.lib`) for embedding Rust into a C/C++ binary at link time. |

Set via `Cargo.toml` (`[lib] crate-type = ["cdylib"]` or multiple types when you need both). Export only a deliberate C ABI surface from `cdylib`/`staticlib` crates; keep the rest of the Rust API internal. Symbol visibility, panic strategy, and allocator assumptions become part of the product contract for those artifacts. Prefer one primary FFI crate type per deliverable so CI and packaging stay obvious.

### 5. Exporting a C ABI: `#[no_mangle]` and `extern "C"`

To call Rust from C (or another C-ABI speaker), export functions with a stable symbol name and calling convention:

```rust
// Edition 2024 form — see Advanced §9; older editions often used bare #[no_mangle]
#[unsafe(no_mangle)]
pub extern "C" fn agent_version() -> u32 {
    1
}
```

- **`extern "C"`** selects the C calling convention (argument passing, return, name mangling rules for the ABI).
- **`#[no_mangle]` / `#[unsafe(no_mangle)]`** keeps the symbol name as written so C can declare `uint32_t agent_version(void);` without Rust’s default mangling (Edition **2024** requires the `unsafe(…)` attribute form).
- Prefer **`#[repr(C)]`** on structs that cross the boundary so field layout matches C expectations.
- Document nullability, thread-safety, and who frees returned pointers next to each export.
- Keep exports **thin**: validate inputs, call safe Rust internals, translate errors to integer/code enums the C side understands—do not panic out of the export (see panic section below).

Opaque handles (`*mut Handle`) plus explicit create/destroy functions are often clearer than exposing rich Rust structs directly.

### 6. `MaybeUninit`

**`MaybeUninit<T>`** represents memory that may not yet be a valid `T`. It is the correct tool for staged initialization, foreign out-parameters, and avoiding false “initialized” assumptions. Reading as `T` before initialization is UB. Convert with careful APIs (`assume_init` only when you have proven initialization).

This matters for FFI out-pointers and for manual allocation patterns that safe `Vec`/`Box` constructors would otherwise handle.

### 7. Soundness

A crate is **sound** if safe code cannot cause UB when using only its safe API—regardless of how adversarial the safe caller is. Unsoundness often looks like:

- An `unsafe` block that misses an edge case (alignment, aliasing, lifetime)
- A safe function that wraps unsound unsafe internally without enforcing preconditions
- Incorrect `unsafe impl Send/Sync`
- FFI bindings that mark safe wrappers around unchecked pointers

**Safe ≠ correct.** Soundness is specifically about UB. Logic bugs remain possible in fully safe code.

### 8. Minimize the unsafe surface

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

Unwinding from Rust into C (or the reverse) without an ABI that supports it is **undefined behavior**. C and most foreign runtimes do not run Rust drop glue or understand Rust panic payloads. A panic that crosses `extern "C"` is therefore a soundness and reliability incident, not a “caught exception.”

Staff practice at every export and every call into foreign code:

- **Catch at the boundary:** wrap Rust work in `std::panic::catch_unwind` (or equivalent) inside `extern "C"` exports; map `Err` to a documented error code / null handle; never let unwind escape.
- **Or abort:** compile or configure FFI-heavy libraries so panics **abort** the process rather than unwind—predictable death beats corrupted foreign stacks. Document that choice for `cdylib` / `staticlib` consumers.
- **Do not assume** foreign code is exception-safe if you call from Rust while a Rust panic is in flight; keep FFI calls outside unwind paths.
- Drop guards and locks held across a potential panic boundary need the same discipline as in threaded code: prefer catching before unlock semantics become ambiguous to the C side.
- Test the failure path: force a panic in an export under CI (debug builds) and assert you return an error code or abort—not a silent cross-language unwind.

Document the panic strategy next to the crate-type and ABI contract; reviewers treat changes here like API breaks.

### 5. `#[repr(C)]`, packed, and alignment for FFI

Default Rust struct layout is **not** a stable C ABI. For types that cross FFI:

- **`#[repr(C)]`** — field order and layout compatible with C on that target (the usual choice for shared structs).
- **`#[repr(C, packed)]` / packed variants** — reduce padding; field accesses may be unaligned—easy to get wrong with references and atomics. Prefer explicit padding fields over packed unless a wire format forces it.
- **Alignment** — mismatched align between Rust and C (or `#pragma pack`) is classic UB. Document and test `align_of` against the foreign header’s expectations.
- Enums need an agreed **`repr`** (often `repr(C)` or `repr(u32)`-style) if they cross the boundary at all; prefer integer codes over rich Rust enums in C APIs.

Opaque pointers (`*mut Handle`) plus create/destroy often beat exposing layout-sensitive structs.

### 6. Layout queries: `size_of`, `align_of`, `offset_of`

Use **`std::mem`** (and `core::mem` in `no_std`) to check what you claim about layouts:

- **`size_of::<T>()` / `align_of::<T>()`** — byte size and alignment of `T`.
- **`offset_of!(Type, field)`** — stable macro for field byte offsets (recent stable toolchains; keep MSRV in mind). Layout without an explicit `repr` can still change across compiles—do not freeze offsets for non-`repr(C)` types in FFI contracts.

Assert critical sizes/aligns in tests on every shipped target rather than assuming host layout equals target layout.

### 7. `PhantomData` for variance and drop ownership

**`PhantomData<T>`** is a zero-sized marker that tells the compiler how a type **behaves** with respect to `T` (variance, dropck, auto traits) even when `T` is not stored as a field. Common in unsafe wrappers: “we own a `T` logically,” “we borrow a `T`,” or “we are covariant over `T`.” Wrong `PhantomData` is a soundness bug class—document the ownership story next to it (Nomicon).

### 8. `NonNull<T>` versus `*mut T`

Both are raw pointers under the hood, but:

| Type | Role |
|------|------|
| **`*mut T` / `*const T`** | May be null; full programmer obligation on every use. |
| **`NonNull<T>`** | Guaranteed **non-null**; niche-optimized in `Option`; still may be dangling/unaligned—validity is not free. |

Prefer `NonNull` in unsafe data structures when null is never meaningful; convert at FFI edges where C uses nullable pointers.

### 9. Edition 2024: `unsafe extern` and unsafe attributes

Per the **Edition Guide** (state carefully; migrate with `cargo fix --edition` + human review):

- **Edition 2024 requires `unsafe extern "…" { … }`** on extern blocks. Items inside may be marked `safe` or `unsafe` fn/static; unmarked items default to unsafe to call. The `unsafe` on the block records that **signatures and linking are your responsibility**—the migration cannot verify C headers are correct.
- **`#[no_mangle]`**, **`#[export_name]`**, and **`#[link_section]`** must be written as **`#[unsafe(no_mangle)]`** (and similarly for the others) in Edition 2024. These attributes affect the global symbol namespace; misuse (for example colliding with `malloc`) can break safe-looking programs. Document a **SAFETY** rationale at each site.

Older editions can use the new forms on recent rustc; Edition 2024 makes them mandatory. Meaning of soundness does not change—only the syntax that highlights obligations.

### 10. Binding generation and bitness

`bindgen`-style workflows reduce transcription errors but do not prove semantic correctness (who owns a returned pointer?). Match platform `struct` layouts, `#[repr(C)]`, and integer widths. Test on every target you ship (chapter 16 covers targets).

### 11. Supply chain of unsafe

Your crate may be safe while a dependency’s `unsafe` is unsound. Audits and `cargo` tooling (later security chapter) treat transitive unsafe as part of your risk budget.

### 12. Passing strings across FFI (`CString` → `*const c_char`)

C APIs almost always want **nul-terminated** bytes (`*const c_char` / `*mut c_char`). Rust side:

1. Build **`CString`** from text (`CString::new` fails on interior `0` bytes—handle that `Result`).
2. Pass **`cstring.as_ptr()`** (or `into_raw` when transferring ownership) **only while** the owner lives, or after a documented handoff.
3. Document **who frees**:
   - Rust-owned buffer borrowed into C for the call → keep the `CString` alive across the call; do **not** let C `free` it.
   - Ownership transferred to C → use the foreign free API C documents (often not Rust’s allocator); pair with `CString::from_raw` only when you reclaimed a pointer you previously `into_raw`’d under the same allocator.
   - C returns a string → free with the C API (or wrap immediately into owned Rust data and free once).

Never pass `String::as_ptr()` as a C string (no guaranteed trailing nul; not the FFI type). Prefer chapter 11’s `CString`/`CStr` rules at the ops edge; this section is the ownership contract reviewers must see next to every export/import.

### 13. `core` / `alloc` / `std` layering (`no_std` + allocator awareness)

Rust’s library stack is layered:

| Crate | Provides | Typical consumers |
|-------|----------|-------------------|
| **`core`** | Language primitives, slices, `Option`/`Result`, no allocator assumption | `#![no_std]` firmware, kernels |
| **`alloc`** | Heap types (`Vec`, `String`, `Box`) when an allocator exists | `no_std` + allocator, some embedded |
| **`std`** | OS / threads / fs / net / env on top of `alloc`+`core` | Hosted CLIs, agents, servers |

`std` re-exports much of `core`/`alloc`. FFI and embedded work often targets **`no_std`** plus an explicit global allocator story. Awareness for staff: linking a `cdylib` into a foreign process may share or conflict with **that process’s allocator**; do not assume every heap pointer can be `free`d with the other language’s default free. Document allocator assumptions in the FFI crate README when you ship native artifacts (see also chapter 18 for `no_std` product shapes).

### 14. Custom global allocators (advanced opt-in)

Rust allows replacing the global allocator (`#[global_allocator]`, `GlobalAlloc` trait) with alternate implementations (jemalloc-/mimalloc-class crates in the ecosystem, or platform-specific ones). This is an **advanced, measured opt-in**:

- Change only with **benchmarks and production metrics** (RSS, fragmentation, latency tails)—not because a blog post named an allocator.
- Allocator choice interacts with FFI (who allocated a buffer), embedded constraints, and some sanitizer/tooling setups.
- Default system allocator is the correct starting point for most services; custom allocators are a capacity/latency experiment with a rollback plan.
- Do not cargo-cult a global allocator into every binary “for performance.”

Staff review asks for the measurement that justified the change and for FFI free-compatibility notes.

### 15. What `unsafe` is really asking of you

In safe Rust, the compiler refuses code that might break memory rules. The `unsafe` keyword means: **“I am taking responsibility for those rules myself.”** It does not mean the rules went away. If you break them, the program has **undefined behavior**—the compiler may assume impossible things, and failures can be silent or catastrophic.

Here is the idea of each rule, in plain language:

| Idea | What it means |
|------|----------------|
| **Validity** | Values must look like what their type claims. A `bool` is only true/false bits; a reference points at a real, correctly aligned object that is still alive; text in a `str` is real UTF-8. Fake bit patterns are not “clever”—they are broken. |
| **Aliasing** | You do not get to treat the same memory as uniquely mutable and shared at once. Either one writer, or many readers—not both. Tools like **Miri** check a precise version of this story. |
| **Provenance** | A pointer is not just a number. It “comes from” some allocation. Inventing addresses, or using one buffer’s pointer as if it belonged to another, can be wrong even when the numeric address looks plausible. Prefer the `ptr` APIs the docs describe. |
| **Initialization** | Do not read memory you have not written yet. `MaybeUninit` exists so you can build values carefully; claiming “it’s ready” before it is ready is undefined. |
| **Lifetimes you promised** | In unsafe code, a lifetime annotation is a promise *you* keep. Using a buffer after it was freed is the classic mistake. |
| **Panics across language borders** | A Rust panic unwinding into C (or the reverse) without an agreed boundary is undefined. Plan the edge (`catch_unwind`, the right `extern` ABI)—do not hope. |

Practical habit: every `unsafe` block says *why* it is sound; tests that hit that path run under **Miri** when you own the unsafe (chapter 15). “It did not crash in release” is not a proof. For the full deep dive, read the **Rustonomicon** via References—this section is only so you know what kind of promises you are making.

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
- FFI ownership (alloc/free), nullability, alignment, and threading are written down—including **string** buffers (`CString` lifetime vs `into_raw` / foreign free).
- Panic strategy across FFI is defined (catch, abort, or proven non-unwind) and tested.
- `cdylib` / `staticlib` / `rlib` choice matches the consumer; exports use `extern "C"` + mangling attributes with `repr(C)` where needed.
- Edition 2024 crates use `unsafe extern` and `#[unsafe(no_mangle)]` (etc.) with SAFETY notes; migration reviewed against real headers.
- Layout claims backed by `size_of` / `align_of` / `offset_of` tests on ship targets; packed/align hazards documented.
- `PhantomData` / `NonNull` choices match ownership and nullability stories.
- `MaybeUninit` and raw slices are initialized before reads.
- `no_std` / `alloc` / `std` layering and allocator handoff across FFI are documented when relevant.
- Custom **`#[global_allocator]`** changes cite measurements—not fashion.
- No casual `unsafe impl Send/Sync`.
- `forbid(unsafe_code)` applied where the crate should stay pure; inventory exists where not.
- Reviewers treat new `unsafe` like a security change, not a style nit.
- Safety comments say, in plain language, which rules from section 15 this block is upholding—not “trust me, it’s fine.”

---

## References

- [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [The Rustonomicon — FFI](https://doc.rust-lang.org/nomicon/ffi.html)
- [The Book — Unsafe Rust](https://doc.rust-lang.org/stable/book/ch19-01-unsafe-rust.html)
- [Embedded Rust Book — A `no_std` Rust Environment](https://docs.rust-embedded.org/book/intro/no-std.html)
- [The Rust Reference — Unsafety](https://doc.rust-lang.org/stable/reference/unsafety.html)
- [The Rust Reference — External blocks](https://doc.rust-lang.org/stable/reference/items/external-blocks.html)
- [The Rust Reference — Function ABI](https://doc.rust-lang.org/stable/reference/items/functions.html#extern-function-qualifier)
- [Cargo Book — Cargo Targets (`crate-type`)](https://doc.rust-lang.org/stable/cargo/reference/cargo-targets.html#the-crate-type-field)
- [`std::ptr`](https://doc.rust-lang.org/stable/std/ptr/)
- [`std::ptr::NonNull`](https://doc.rust-lang.org/stable/std/ptr/struct.NonNull.html)
- [`std::mem`](https://doc.rust-lang.org/stable/std/mem/)
- [`std::mem::offset_of`](https://doc.rust-lang.org/stable/std/mem/macro.offset_of.html)
- [`std::mem::MaybeUninit`](https://doc.rust-lang.org/stable/std/mem/union.MaybeUninit.html)
- [`std::marker::PhantomData`](https://doc.rust-lang.org/stable/std/marker/struct.PhantomData.html)
- [`std::panic::catch_unwind`](https://doc.rust-lang.org/stable/std/panic/fn.catch_unwind.html)
- [`std::ffi`](https://doc.rust-lang.org/stable/std/ffi/)
- [`std::ffi::CString`](https://doc.rust-lang.org/stable/std/ffi/struct.CString.html)
- [`std::ffi::CStr`](https://doc.rust-lang.org/stable/std/ffi/struct.CStr.html)
- [`std::alloc`](https://doc.rust-lang.org/stable/std/alloc/)
- [`std::alloc::GlobalAlloc`](https://doc.rust-lang.org/stable/std/alloc/trait.GlobalAlloc.html)
- [`core`](https://doc.rust-lang.org/stable/core/)
- [`alloc`](https://doc.rust-lang.org/stable/alloc/)
- [`extern` keyword](https://doc.rust-lang.org/stable/std/keyword.extern.html)
- [The Rust Reference — Type layout / `repr`](https://doc.rust-lang.org/stable/reference/type-layout.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Edition Guide — Unsafe extern blocks](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-extern.html)
- [Edition Guide — Unsafe attributes](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-attributes.html)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
