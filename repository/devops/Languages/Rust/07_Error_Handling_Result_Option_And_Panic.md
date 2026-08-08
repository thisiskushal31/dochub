# Error handling: `Result`, `Option`, and panic

[← Back to Rust](./README.md)

## What this chapter covers

Rust’s primary model for **recoverable** failure (`Result`, `Option`), the **`?` operator**, converting errors with **`From`/`Into`**, and when **`panic!`** (and `unwrap`/`expect`) is appropriate versus catastrophic. Library boundaries, binaries, abort vs unwind at a high level, and staff discipline so expected errors never become panics in reusable crates.

---

## 1. Concepts

### 1. Two channels: recoverable vs unrecoverable

Rust separates:

1. **Recoverable errors** — represented in the type system as `Result<T, E>` (or sometimes `Option<T>` for absence). Callers must acknowledge them to get `T`.
2. **Unrecoverable failure** — **panic**: the thread unwinds (by default) or aborts; stack is cleaned up or the process ends. Panics are for bugs and broken invariants, not for “file not found” in a library API.

This split is deliberate: recoverable failures stay visible in signatures; panics are not an alternative return path for normal control flow in libraries.

### 2. `Option<T>`: absence, not failure

`Option` means a value may be missing. It is not inherently an error—`HashMap::get` returns `Option<&V>` because missing keys are normal. Convert to `Result` at boundaries when absence should become a typed error (`ok_or` / `ok_or_else`).

Common methods: `map`, `and_then`, `unwrap_or`, `unwrap_or_else`, `ok_or`. Prefer these over nested `match` when the pipeline stays readable.

### 3. `Result<T, E>`: success or typed error

`Ok(T)` carries success; `Err(E)` carries failure information. `E` should be meaningful to the caller: an enum of domain failures, or a shared error type that implements `std::error::Error` when you need interoperability.

```rust
fn parse_port(s: &str) -> Result<u16, std::num::ParseIntError> {
    s.parse()
}
```

Libraries should return `Result`. Binaries may pattern-match at the top and exit with a code, log, or metrics.

### 4. The `?` operator (modern path)

`?` at the end of a `Result`-producing expression means: if `Err`, return that error from the enclosing function early (after conversion); if `Ok`, unwrap the success value and continue.

```rust
fn load_port(path: &str) -> Result<u16, Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string(path)?;
    let port: u16 = text.trim().parse()?;
    Ok(port)
}
```

The enclosing function must return a compatible `Result` (or `Option` when using `?` on `Option`). Error types must convert via `From` into the function’s error type.

**Edition / legacy note:** Older code may still use the **`try!`** macro (`try!(expr)`), which was the predecessor of `?`. Modern Rust uses `?`; when you see `try!` in brownfield crates, treat it as equivalent early-return sugar and prefer `?` in new code. `try!` was soft-deprecated in favor of `?` and may still appear in old examples and dependencies.

### 5. `From` / `Into` for error conversion

`?` relies on `From::from` to convert the inner error into the outer error type. Implementing `From<LowerLevelError> for MyError` (or using crates/patterns that generate conversions) lets call stacks bubble heterogeneous failures into one surface type.

`Into` is the reciprocal; prefer implementing `From` and getting `Into` for free. For application binaries, `Box<dyn std::error::Error + Send + Sync>` or a single app-level error enum are common. For libraries, prefer concrete error enums so callers can match without downcasting.

### 6. `unwrap`, `expect`, and discipline

`unwrap()` panics on `None`/`Err`. `expect("message")` panics with a message. They are acceptable when:

- You have proven the value is present (tests, invariants after validation).
- You are writing examples, prototypes, or `main` that should crash on misconfiguration.
- A programmer error occurred (corrupt internal state that indicates a bug).

They are **not** acceptable as the default path for expected I/O, parse, or network failures in library code. Prefer `?`, explicit `match`, or `map_err` that preserves context.

### 7. Panic vs `Result` at API boundaries

| Situation | Prefer |
|-----------|--------|
| User input wrong, file missing, network timeout | `Result` |
| Index out of range from untrusted input | `Result` or validated indexing |
| Internal invariant violated (“unreachable state”) | `panic!` / `unreachable!` after documenting invariant |
| Library public API for expected failures | **Never** panic as the contract |

Document panic conditions if a function panics on misuse (for example slicing with a bad range)—same expectation as “panics on overflow in debug” for some arithmetic APIs.

---

## 2. Advanced concepts

### 1. Abort vs unwind (high level)

Rust can handle panic by **unwinding** the stack (running destructors) or by **aborting** the process. Profile and `Cargo.toml` / target settings influence this (`panic = "abort"` is common for small binaries and some embedded targets).

Implications:

- Unwind runs `Drop` cleanups; code must be **exception-safe** if it uses `catch_unwind` or crosses FFI expecting unwind.
- Abort is simpler and smaller; no recovery on that thread/process.
- **`catch_unwind`** can intercept unwind panics in limited scenarios (for example isolating a plugin). It is not a substitute for `Result` in ordinary APIs, and it does not catch aborts.

Libraries that must not unwind across FFI boundaries often use `panic=abort` in the final artifact or carefully contain panics—chapter 14 covers FFI edges.

### 2. Combinators vs early return

Long chains of `map`/`and_then` can obscure failure points. Alternating clear `?` steps with focused combinators is usually more maintainable. Prefer adding context when mapping errors (`map_err`) so logs show *which* step failed.

### 3. `Option` and `Result` together

`Result<Option<T>, E>` means “operation may fail, and success may still be empty.” `Option<Result<T, E>>` is rarer and often confusing—normalize at API edges. Methods like `transpose` convert between `Option<Result<T, E>>` and `Result<Option<T>, E>`.

### 4. Custom error types

A library error enum typically:

- Lists domain variants with enough context (paths, status codes).
- Implements `Display` and `std::error::Error`.
- Implements `From` for lower-level errors you want to bubble with `?`.
- Avoids holding non-`'static` borrows in errors that must outlive the call (prefer owned `String` / `PathBuf` in error payloads).

### 5. Panics in tests and examples

Tests use `unwrap`/`expect` freely when failure should fail the test. Doc examples often unwrap for brevity; production library paths should still show `?` or proper handling in non-example code.

### 6. `todo!`, `unimplemented!`, `unreachable!`

These panic with intent signals. `todo!` / `unimplemented!` mark incomplete code. `unreachable!` documents arms the author believes cannot run—if they do, you have a bug. Prefer exhaustive matches that make `unreachable!` unnecessary when the type system can prove coverage.

---

## 3. Applications and use cases

### Software engineering

- Put `Result` in signatures early; do not “unwrap now, fix later” on shared modules.
- Keep error enums stable or `non_exhaustive` under semver.
- Separate validation errors (caller fixable) from internal faults (bugs).

### Library vs binary policy

- **Libraries:** expected failures → `Result`; document any panic-on-misuse.
- **Binaries/CLIs:** translate `Err` to exit codes, stderr messages, and structured logs at the rim; do not sprinkle `unwrap` through business logic.

### Security and privacy

- Error messages shown to clients must not leak secrets, tokens, or internal paths.
- Do not confuse “auth failed” with panic; fail closed with `Result` and audit logs.
- Panics that abort can be an availability issue under crafted input if you panic on bad data instead of rejecting with `Err`.

### Reliability and operations

- Metrics: count `Err` variants and panic hooks separately.
- Set a panic hook in services to log backtraces before abort/unwind ends the thread.
- Retries belong around `Result` errors classified as transient—not around panics.

### Performance

- `Result` is a value; for hot paths, avoid huge error payloads on the success path (niche layouts help for simple enums).
- Do not use panic for control flow—unwinding is expensive and opaque compared to `Result`.

### Staff-level review checklist

- Public library APIs do not use panic for expected errors.
- `unwrap`/`expect` in non-test code justified (invariant or fatal binary startup only).
- `?` used with intentional `From` conversions; context preserved where operators need it.
- Error types implement `Display` / `Error` when exposed across crates.
- No bare swallowing of `Err` (`let _ = ...`) without logging or metric.
- Panic strategy (`unwind` vs `abort`) known for the shipped artifact.
- User-facing error strings reviewed for information disclosure.

---

## References

- [The Book: Error Handling](https://doc.rust-lang.org/stable/book/ch09-00-error-handling.html)
- [The Book: Recoverable Errors with Result](https://doc.rust-lang.org/stable/book/ch09-02-recoverable-errors-with-result.html)
- [The Book: To panic! or Not to panic!](https://doc.rust-lang.org/stable/book/ch09-03-to-panic-or-not-to-panic.html)
- [Rust By Example: Error handling](https://doc.rust-lang.org/stable/rust-by-example/error.html)
- [Rust By Example: Result](https://doc.rust-lang.org/stable/rust-by-example/error/result.html)
- [Rust By Example: ? operator](https://doc.rust-lang.org/stable/rust-by-example/error/result/enter_question_mark.html)
- [std::result::Result](https://doc.rust-lang.org/stable/std/result/enum.Result.html)
- [std::option::Option](https://doc.rust-lang.org/stable/std/option/enum.Option.html)
- [std::error::Error](https://doc.rust-lang.org/stable/std/error/trait.Error.html)
- [std::panic](https://doc.rust-lang.org/stable/std/panic/index.html)
- [Cargo Book: The panic profile setting](https://doc.rust-lang.org/stable/cargo/reference/profiles.html#panic)
- [Edition Guide: Question mark operator](https://doc.rust-lang.org/edition-guide/rust-2018/error-handling-and-panics/the-question-mark-operator-for-easier-error-handling.html)
