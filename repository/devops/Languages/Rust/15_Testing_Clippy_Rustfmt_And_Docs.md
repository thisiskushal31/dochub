# Testing, Clippy, rustfmt, and docs

[← Back to Rust](./README.md)

## What this chapter covers

How **`cargo test`** organizes unit and integration tests, how **`#[cfg(test)]`** keeps test-only code out of release builds, how **Clippy**, **rustfmt**, and **rustdoc** raise the quality floor, how **doctests** keep examples honest, and how to wire these into **CI quality gates**. After this chapter you should treat format + lint + test + doc as one pipeline, not optional local taste.

---

## 1. Concepts

### 1. `cargo test` — unit and integration

**`cargo test`** builds the package(s) in test mode and runs:

| Kind | Location | Linkage |
|------|----------|---------|
| **Unit tests** | `#[cfg(test)] mod tests` inside source files | Same crate; can touch `priv` items |
| **Integration tests** | `tests/*.rs` | Separate crates linked to your **library** API only |
| **Doc tests** | Code blocks in `///` and `//!` docs | Compiled and run unless marked `ignore` / `no_run` |

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds() {
        assert_eq!(2 + 2, 4);
    }
}
```

Integration tests under `tests/` exercise the public surface the way dependents will. Binary-only crates without a `lib.rs` have a weaker integration-test story—split a library target when you need API-level tests.

Filters: `cargo test name_substring`. Options control threads, output capture, and `--nocapture` for debugging prints.

### 2. `#[cfg(test)]` and test-only helpers

**`#[cfg(test)]`** compiles items only when building tests. Use it for modules, helpers, and mocks that must not ship in production binaries. Conditional compilation also covers target OS and feature flags (`#[cfg(feature = "…")]`)—keep test cfgs orthogonal so release builds stay lean.

### 3. Assertions and failure styles

Common macros: **`assert!`**, **`assert_eq!`**, **`assert_ne!`**, **`panic!`**. For `Result`-heavy code, return `Result` from tests (`fn t() -> Result<(), E>`) and use `?`, or use dedicated assertion helpers. Prefer precise failures over opaque `unwrap` dumps when diagnosing CI flakes.

### 4. Clippy via rustup

**Clippy** is the official linter, installed as a rustup component:

```bash
rustup component add clippy
cargo clippy --all-targets --all-features -- -D warnings
```

Clippy encodes idioms and correctness nits beyond `rustc` warnings. In CI, deny warnings (`-D warnings`) so new lints cannot accumulate. Pin the toolchain so Clippy version matches `rustc` (components track the toolchain channel).

Not every lint is sacred forever—teams may `#[allow(clippy::…)]` with a comment, or configure `clippy.toml`. Allowlists should be rare and reviewed.

### 5. rustfmt / `cargo fmt`

**rustfmt** enforces a common layout:

```bash
rustup component add rustfmt
cargo fmt --all -- --check   # CI: fail if unformatted
cargo fmt --all              # local: rewrite
```

Formatting is not a design debate in review—run fmt before push. Commit `rustfmt.toml` only when you intentionally diverge from defaults; prefer defaults for ecosystem consistency.

### 6. rustdoc / `cargo doc`

**`cargo doc`** builds HTML docs from `///` (item) and `//!` (module/crate) comments. **`cargo doc --no-deps --open`** is the local loop. Public API documentation is part of the product for libraries; for binaries, document modules operators must configure.

Doc comments support Markdown. Link to other items with rustdoc’s intra-doc links so renames break CI via doctests or doc link checking when enabled.

### 7. Doctests

Examples in docs are compiled (and usually executed) by `cargo test`:

````rust
/// Adds one.
///
/// ```
/// assert_eq!(mycrate::add_one(1), 2);
/// ```
pub fn add_one(x: i32) -> i32 { x + 1 }
````

Marks: `ignore`, `no_run`, `should_panic`, `compile_fail` (for reference material). Doctests keep README-level examples from rotting—treat failures as real regressions.

### 8. CI quality gates (minimum bar)

A typical merge gate for Rust crates:

1. `cargo fmt --all -- --check`
2. `cargo clippy --all-targets --all-features -- -D warnings`
3. `cargo test --all-features` (and relevant feature matrices)
4. Optional: `cargo doc --no-deps` with warnings denied for public docs

Pin **rustup toolchain** (file or CI image digest) so gates match developer machines. Cache `target/` carefully; still run fmt/clippy on clean policy when supply-chain or toolchain bumps.

---

## 2. Advanced concepts

### 1. Feature matrices and `cfg`

Features change APIs and code paths. CI should test the feature combinations you ship, not only defaults. `--all-features` is a strong default for libraries; binaries may need explicit matrices if features conflict.

### 2. Workspace testing

In a workspace, `cargo test --workspace` exercises members. Integration tests and doctests still follow each package’s layout. Failures should name the member crate clearly in CI logs.

### 3. Performance and ignored tests

`#[ignore]` marks expensive tests; run with `cargo test -- --ignored` on a schedule. Do not hide flaky tests behind `ignore` permanently—quarantine with a ticket or fix.

### 4. Clippy pedantic / nursery groups

Optional lint groups are stricter and noisier. Adopt incrementally; turning on everything in a large brownfield crate creates review theater. Prefer a stable default deny set first.

### 5. Documentation as API freeze signal

For libraries, rustdoc is where semver intent becomes visible. Missing docs on public items can be denied via `#![deny(missing_docs)]` when the crate is a product boundary.

### 6. Edition and tooling notes

rustfmt and Clippy track the active toolchain. Edition upgrades can change idioms Clippy suggests; run Clippy after edition migration. Test and doc tooling work on stable; do not require nightly for the default quality bar unless a specific nightly feature is an explicit team choice.

### 7. Separating unit speed from integration depth

Keep unit tests fast and deterministic. Push network, filesystem, and subprocess checks to integration tests with tempdirs and timeouts (chapter 11 patterns). Flakes usually come from ambient environment, not from `assert_eq!`.

---

## 3. Applications and use cases

### Software engineering

- Put policy in CI, not in tribal “remember to fmt.”
- Use unit tests for invariants and edge cases; integration tests for CLI/contract behavior.
- Keep examples in rustdoc executable whenever feasible.

### Security

- Tests that fuzz parsers or reject hostile paths belong in CI for untrusted-input crates.
- Do not ship test keys or live credentials in fixtures; use ephemeral temps.
- Clippy correctness lints sometimes catch dangerous patterns—do not disable groups casually.

### Reliability and operations

- Same toolchain in CI and release builders reduces “green locally, red in pipeline.”
- Publish or archive `cargo test` logs on failure for incident-style debugging of flakes.
- Doc the quality gate in the contributor guide so forks behave.

### Performance

- Avoid unbounded `cargo test` parallelism on tiny CI runners if jobs thrash; tune jobs explicitly.
- Compile times dominate large workspaces—cache builds, but never skip Clippy on changed crates without a documented exception.

### Staff-level review checklist

- CI runs **fmt check**, **clippy with deny warnings**, and **tests** on the pinned toolchain.
- New public API has docs; examples that claim behavior are doctested or explicitly `no_run` with reason.
- `#[cfg(test)]` helpers do not leak into release artifacts.
- Feature combinations you ship are covered; `--all-features` conflicts are understood.
- `#[allow(clippy::…)]` has a justification comment; no repo-wide allow of broad groups without ADR.
- Flaky tests are fixed or quarantined with owners—not silently ignored.
- Contributors can run the same three commands locally before push.

---

## References

- [The Book — Writing Automated Tests](https://doc.rust-lang.org/stable/book/ch11-00-testing.html)
- [The Book — Test Organization](https://doc.rust-lang.org/stable/book/ch11-03-test-organization.html)
- [Cargo Book — `cargo test`](https://doc.rust-lang.org/stable/cargo/commands/cargo-test.html)
- [Cargo Book — `cargo fmt`](https://doc.rust-lang.org/stable/cargo/commands/cargo-fmt.html)
- [Cargo Book — `cargo clippy`](https://doc.rust-lang.org/stable/cargo/commands/cargo-clippy.html)
- [Cargo Book — `cargo doc`](https://doc.rust-lang.org/stable/cargo/commands/cargo-doc.html)
- [Clippy documentation](https://doc.rust-lang.org/stable/clippy/)
- [rustfmt documentation](https://doc.rust-lang.org/stable/rustfmt/)
- [The rustdoc Book](https://doc.rust-lang.org/stable/rustdoc/)
- [rustup book — components](https://rust-lang.github.io/rustup/concepts/components.html)
- [crates.io — registry overview](https://crates.io/)
