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

### 4. `#[should_panic]` expectations

Some tests assert that code **panics** (invariant violations, intentional abort paths in test-only helpers):

```rust
#[test]
#[should_panic(expected = "index out of bounds")]
fn rejects_bad_index() {
    let v = vec![1];
    let _ = v[99];
}
```

- **`#[should_panic]`** — passes only if the test body panics.
- **`#[should_panic(expected = "...")]`** — passes only if the panic message contains the substring; tighter and preferred when messages are stable.
- Prefer testing **`Result`/`Option` error paths** over panics for production APIs; reserve `should_panic` for documented panic contracts or internal debug assertions.
- Panic text can change across Rust versions or refactors—keep `expected` strings short and owned by your crate’s messages when possible.

### 5. Clippy via rustup

**Clippy** is the official linter, installed as a rustup component:

```bash
rustup component add clippy
cargo clippy --all-targets --all-features -- -D warnings
```

Clippy encodes idioms and correctness nits beyond `rustc` warnings. In CI, deny warnings (`-D warnings`) so new lints cannot accumulate. Pin the toolchain so Clippy version matches `rustc` (components track the toolchain channel).

Not every lint is sacred forever—teams may `#[allow(clippy::…)]` with a comment, or configure `clippy.toml`. Allowlists should be rare and reviewed.

### 6. rustfmt / `cargo fmt`

**rustfmt** enforces a common layout:

```bash
rustup component add rustfmt
cargo fmt --all -- --check   # CI: fail if unformatted
cargo fmt --all              # local: rewrite
```

Formatting is not a design debate in review—run fmt before push. Commit `rustfmt.toml` only when you intentionally diverge from defaults; prefer defaults for ecosystem consistency.

### 7. rustdoc / `cargo doc`

**`cargo doc`** builds HTML docs from `///` (item) and `//!` (module/crate) comments. **`cargo doc --no-deps --open`** is the local loop. Public API documentation is part of the product for libraries; for binaries, document modules operators must configure.

Doc comments support Markdown. Link to other items with rustdoc’s intra-doc links so renames break CI via doctests or doc link checking when enabled.

### 8. Doctests

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

### 9. `cargo test --doc` versus the unit/integration matrix

`cargo test` runs a **matrix** of targets; knowing which knob you turned avoids false confidence:

| Command / focus | What runs |
|-----------------|-----------|
| `cargo test` (default) | Unit tests, integration tests under `tests/`, and **doctests** for the package |
| `cargo test --doc` | **Documentation tests only** |
| `cargo test --lib` / `--bins` / `--tests` | Narrow to library unit tests, binary tests, or integration targets |
| `cargo test --all-features` (+ explicit matrices) | Feature combinations you actually ship |

Use `--doc` when iterating on rustdoc examples without paying for a full suite. In CI, still run the **full** default (or an explicit matrix) so unit, integration, and doctests cannot drift independently. Binary-only packages without a library target have limited integration/doctest surface—split a `lib` when API contracts matter.

### 10. CI quality gates (minimum bar)

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

### 8. Property testing as a practice (ecosystem)

**Property-based testing** generates many inputs and checks invariants (“for all lists, sort is ordered”; “parse ∘ print is identity on a domain”). In Rust this is an **ecosystem** practice (proptest-class crates and similar), not a `std` or Cargo built-in. Adopt it for parsers, codecs, config round-trips, and pure functions with large input spaces where example tests only hit happy paths.

Staff rules:

- Pin property-testing crate **versions** in `Cargo.lock` / CI the same way you pin other test dependencies.
- Bound generation (size, recursive depth) so CI cannot run unbounded; fail fast with a seed for reproduction.
- Keep properties next to unit tests; do not replace targeted regression tests for known bugs.
- Treat flaky generators as defects—shrink and fix, or tighten the domain.

### 9. Benchmarks: `benches/` and Criterion-class tools

Microbenchmarks live under **`benches/`** and are wired as Cargo benchmark targets. Stable Cargo’s built-in bench harness is limited; many teams use **Criterion-class** ecosystem harnesses for statistics and comparison. Treat benches as **optional** engineering tools:

- Prefer **release-mode profiling** of real workloads for production decisions; microbenches lie about caches, I/O, and allocator behavior.
- Running noisy benches on every PR creates **CI noise** and false regressions—schedule them nightly or on demand, pin hardware where possible, and gate merges on correctness (test/clippy/fmt) first.
- Document how to run benches locally; do not require exotic nightly features for the default quality bar unless the team explicitly opts in.

### 10. Miri for undefined behavior in unsafe tests

**Miri** is an interpreter (rustup component, typically used with a nightly toolchain channel that provides it) that detects many classes of **undefined behavior** in unsafe code: invalid pointers, misalignment, borrow-model violations, and more. Pattern:

```bash
rustup component add miri
cargo miri test
```

**When to run:** crates that own `unsafe`, FFI shims, custom collections, or niche layout tricks—on PR for touched unsafe modules and/or on a scheduled job. Miri is slower than native tests and does not replace sanitizers or real-target runs; it is a **soundness** aid. Pure-safe application crates rarely need it on every merge.

### 11. Sanitizers awareness (ASan / TSan)

**AddressSanitizer** and **ThreadSanitizer** (and related) can be enabled via **rustc/cargo flags** (`-Z sanitizer=…` on toolchains that support them—often nightly, platform-limited). Use as an **optional CI or local** check for unsafe-heavy or FFI-heavy code; expect:

- Not all targets/OS combinations support every sanitizer.
- Higher memory/CPU cost; usually not the default merge gate for every crate.
- Complements Miri (different bug classes and fidelity)—neither is complete alone.

Document which sanitizers your org runs and on which OS images.

### 12. Fuzzing practice (cargo-fuzz class)

**Coverage-guided fuzzing** (cargo-fuzz and similar ecosystem tooling, typically libFuzzer-class under the hood) is the right practice for **untrusted parsers**, decoders, and config loaders. Treat fuzz targets as long-lived regression assets: pin toolchain/deps, corpus in CI artifacts or storage, and run fuzzing on a schedule or after parser changes—not only as a one-off demo. Fuzzing is ecosystem practice, not a `std` feature; still part of whole-engineering for hostile-input surfaces (pair with chapter 17 supply-chain discipline for fuzz deps).

### 13. Code coverage as practice

Measure **which tests exercise which lines/regions** with coverage tooling integrated with `cargo` (llvm-cov-class and similar ecosystem workflows). Goals: find untested error paths and unsafe modules—not a vanity percentage or a specific SaaS vendor. Fail CI on coverage only if the team owns a realistic policy (critical modules, not “100% or bust”). Store reports as build artifacts; keep the practice portable across forges.

### 14. Snapshot / golden testing (insta-class practice)

**Snapshot** (golden-file) tests assert that a rendered artifact—CLI help text, pretty-printed config, serialized diagnostics—matches a checked-in expected blob. Ecosystem crates in the **insta** class automate store/update/review of those blobs. Useful when:

- Output is large or formatting-sensitive and hand-written `assert_eq!` strings rot.
- You care that operator-facing text or config dumps stay stable across refactors.
- Reviewers want a diff of the golden file as the change surface.

Staff rules: commit goldens deliberately; require review when they change; keep snapshots **deterministic** (no timestamps, absolute paths, or host-dependent noise); prefer targeted unit assertions for small invariants and snapshots for whole surfaces. Snapshot testing is ecosystem practice, not a Cargo built-in—pin versions like any other test dependency.

### 15. Contract tests at I/O boundaries

Beyond in-process unit tests, **contract tests** lock the shape of data crossing a trust or process boundary: CLI stdout/stderr and exit codes, config file parse/print round-trips, HTTP request/response schemas you own, or subprocess argv conventions. Place them under `tests/` (or a dedicated crate) so they exercise the **public** surface the way operators and peers will. Fail closed on schema drift; keep fixtures sanitized (no live secrets). Pair with chapter 11 I/O patterns: tempdirs, timeouts, and explicit env—ambient home directories make contract suites flake.

### 16. `RUSTFLAGS` in CI (deny warnings—without overprescribing)

**`RUSTFLAGS`** (and Cargo’s `[build] rustflags` / target-specific config) pass extra flags to `rustc`. Teams sometimes set deny-warnings style flags in CI so new compiler warnings cannot accumulate. Prefer the **Clippy** `-D warnings` gate (and rustc’s own deny where you already use it) as the primary policy; reach for workspace-wide `RUSTFLAGS` only when you have a documented need (for example forcing a lint group the team owns).

Caution:

- Global `RUSTFLAGS` affect every crate in the graph build, including dependencies—surprises and slower builds are common.
- Do not copy laptop-only flags (for example CPU-specific codegen) into portable CI (chapter 16).
- Document the flag set next to the toolchain pin; changing `RUSTFLAGS` invalidates incremental/cache assumptions.

### 17. rust-analyzer / IDE (navigation, not a tutorial)

For day-to-day reading and review, install **rust-analyzer** (the official LSP implementation distributed via rustup/editor extensions) so jump-to-definition, find-references, and inline diagnostics match the pinned toolchain. Treat the IDE as a navigation aid: Cargo/`rustc`/Clippy in CI remain the source of truth. This handbook does not teach editor setup—use the rust-analyzer manual when wiring a new machine.

---

## 3. Applications and use cases

### Software engineering

- Put policy in CI, not in tribal “remember to fmt.”
- Use unit tests for invariants and edge cases; integration and **contract** tests for CLI/I/O boundary behavior; snapshots for large stable surfaces.
- Keep examples in rustdoc executable whenever feasible; use rust-analyzer for navigation, CI for truth.

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
- Keep microbenches out of the default merge gate; profile release builds for capacity decisions.

### Staff-level review checklist

- CI runs **fmt check**, **clippy with deny warnings**, and **tests** on the pinned toolchain.
- New public API has docs; examples that claim behavior are doctested or explicitly `no_run` with reason.
- `#[cfg(test)]` helpers do not leak into release artifacts.
- Feature combinations you ship are covered; `--all-features` conflicts are understood.
- `#[should_panic(expected = …)]` used only for true panic contracts; error paths prefer `Result` assertions.
- Doc, unit, and integration coverage are not confused—`--doc` alone is not a full gate.
- Property-test and bench dependencies (ecosystem) are version-pinned; benches are optional and not noisy merge blockers.
- Unsafe-heavy crates run **Miri** (and optionally sanitizers) on a defined cadence; platform limits documented.
- Untrusted parsers have fuzz targets; coverage used to find gaps—not as SaaS lock-in or vanity gates.
- Snapshot/golden tests (insta-class) used only for stable operator-facing surfaces; goldens reviewed on change.
- Contract tests cover CLI/config/I/O boundaries you own; fixtures have no secrets.
- CI `RUSTFLAGS` (if any) are documented and not over-applied to the whole dependency graph.
- `#[allow(clippy::…)]` has a justification comment; no repo-wide allow of broad groups without ADR.
- Flaky tests are fixed or quarantined with owners—not silently ignored.
- Contributors can run the same three commands locally before push; rust-analyzer recommended for navigation.

---

## References

- [The Book — Writing Automated Tests](https://doc.rust-lang.org/stable/book/ch11-00-testing.html)
- [The Book — Test Organization](https://doc.rust-lang.org/stable/book/ch11-03-test-organization.html)
- [Cargo Book — `cargo test`](https://doc.rust-lang.org/stable/cargo/commands/cargo-test.html)
- [Cargo Book — `cargo bench`](https://doc.rust-lang.org/stable/cargo/commands/cargo-bench.html)
- [Cargo Book — `cargo fmt`](https://doc.rust-lang.org/stable/cargo/commands/cargo-fmt.html)
- [Cargo Book — `cargo clippy`](https://doc.rust-lang.org/stable/cargo/commands/cargo-clippy.html)
- [Cargo Book — `cargo doc`](https://doc.rust-lang.org/stable/cargo/commands/cargo-doc.html)
- [rustdoc Book — Doctests](https://doc.rust-lang.org/stable/rustdoc/write-documentation/documentation-tests.html)
- [Clippy documentation](https://doc.rust-lang.org/stable/clippy/)
- [rustfmt documentation](https://doc.rust-lang.org/stable/rustfmt/)
- [The rustdoc Book](https://doc.rust-lang.org/stable/rustdoc/)
- [rustup book — components](https://rust-lang.github.io/rustup/concepts/components.html)
- [Miri (rust-lang/miri)](https://github.com/rust-lang/miri)
- [The rustc Book — Sanitizers](https://doc.rust-lang.org/rustc/sanitizer.html)
- [Rust Fuzz Book](https://rust-fuzz.github.io/book/)
- [The rustc Book — Codegen options (context for `RUSTFLAGS`)](https://doc.rust-lang.org/rustc/codegen-options/index.html)
- [The Cargo Book — Configuration (`build.rustflags`)](https://doc.rust-lang.org/cargo/reference/config.html)
- [rust-analyzer manual](https://rust-analyzer.github.io/manual.html)
- [crates.io — registry overview](https://crates.io/)
