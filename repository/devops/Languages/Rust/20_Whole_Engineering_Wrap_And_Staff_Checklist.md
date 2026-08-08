# Whole-engineering wrap and staff checklist

[← Back to Rust](./README.md)

## What this chapter covers

A **competency map** that ties chapters **01–19** into staff-level expectations across language, design, security, and delivery; a consolidated **checklist**; guidance on **when not to use Rust**; **migration** notes from C, Go, and Python scripts; and a **reading path** for brownfield `edition = "2018"` crates. Use this as a sign-off aid, not a substitute for the earlier chapters.

---

## 1. Concepts

### 1. Competency map (chapters → outcomes)

| Block | Chapters | You can… |
|-------|----------|----------|
| Foundations | 01–07 | Install toolchain; explain ownership/borrowing; model data with structs/enums; use `Result`/`Option` without panic-driven control flow. |
| Abstraction & libraries | 08–11 | Design traits and modules; use iterators idiomatically; perform operational I/O via `std`. |
| Runtime & systems | 12–14 | Reason about threads/`Send`/`Sync`; choose or refuse async deliberately; bound `unsafe` and FFI. |
| Production engineering | 15–19 | Test and lint; cross-compile and release; manage supply chain; place Rust in CLI/agent/infra/embedded contexts; ship with CI, containers, and observability. |

Suggested mastery order remains **01→07 → 08→11 → 12→14 → 15→20**, with revisits to **05** (borrow checker), **07** (errors), **13** (async), and **17** (deps) under incident pressure.

### 2. Role lenses (same language, different depth)

| Role | Must be solid on | Can defer initially |
|------|------------------|---------------------|
| Application / backend | 04–11, 07, 13, 15, 19 | Deep embedded/`no_std` |
| DevOps / SRE | 02–03, 11, 15–17, 19 | Advanced trait HRTB |
| Security | 05, 07, 14, 17 | Async runtime internals |
| Platform / infra | 01–07, 11–13, 16, 18–19 | Proc-macro authorship |
| Embedded / systems | 02, 05, 14, 16, 18 | Large async web stacks |

### 3. Whole-engineering domains (not “just DevOps”)

Rust fluency for staff work spans:

1. **Language & type system** — ownership, lifetimes, traits.
2. **Software design** — module boundaries, error types, feature flags.
3. **APIs & data** — serde-adjacent boundaries, I/O, wire formats.
4. **Quality** — tests, Clippy, rustfmt, docs.
5. **Security & supply chain** — `unsafe`, FFI, lockfiles, advisories.
6. **Reliability & observability** — panics, shutdown, logs, metrics.
7. **Performance & artifacts** — profiles, targets, binary size.
8. **Delivery** — CI matrix, containers, non-root, MSRV.

### 4. When not to use Rust

Prefer another tool when:

- The problem is a **short-lived script** with heavy OS glue and a team fluent in Python/Bash.
- The product is a **CRUD API** where team velocity and hiring dominate, and Go/Java/Kotlin already fit the org.
- You need **hot reload / exploratory notebooks** more than machine-code performance.
- No one will own **FFI/`unsafe`** but the design requires it.
- Compile-time and onboarding cost exceed the risk reduction from memory safety.

Rust is a poor trophy language. Choose it when failure modes (memory corruption, data races, long-running agents) justify the investment.

### 5. Migration notes

**From C:** Map pointers to owned values, `&T`/`&mut T`, or explicit raw pointers in `unsafe`. Replace ad-hoc free with `Drop`. Keep FFI thin; rewrite inward from boundaries. Do not wrap entire legacy modules in one giant `unsafe` block.

**From Go:** Interfaces ≈ traits (not identical). Goroutines ≠ threads or tasks without a runtime story. Errors as values map cleanly to `Result`; panics are not Go’s `panic`/`recover` culture—do not use them for routine control flow. Expect more upfront type design, less runtime reflection.

**From Python scripts:** Start with a small CLI binary and typed inputs/outputs. Avoid rewriting the data-science stack unless packaging and performance demand it. Use Python for orchestration if that is the team’s strength; use Rust for the hot or privileged helper.

---

## 2. Advanced concepts

### 1. Reading path for brownfield `edition = "2018"`

1. Confirm **toolchain**: `rust-toolchain.toml` / CI pin vs “whatever is on the laptop.”
2. Read **`Cargo.toml`**: edition, `rust-version`/MSRV, features, workspace members.
3. Map **binaries vs libs**; find `main` and public `lib` API.
4. Inventory **`unsafe`, FFI, `build.rs`**, and network/fs ambient authority.
5. Note **async runtime** (or absence) before changing concurrency.
6. Run **`cargo test`**, **`cargo clippy`**, **`cargo fmt --check`** as baseline.
7. Upgrade edition only with the Edition Guide checklist—not as a drive-by in a CVE patch.

Edition 2018/2021 crates remain first-class on modern stable rustc. Treat edition bumps as deliberate migrations.

### 2. Invariants notebook (staff habit)

Keep a living note per product: edition, MSRV, feature matrix, unsafe inventory, async runtime, release targets, strip/debuginfo policy, advisory triage owner. This notebook is the difference between a hero rewrite and operable ownership.

### 3. Failure modes that span chapters

| Symptom | Likely chapters |
|---------|-----------------|
| Borrow checker blockage at API edge | 05, 08 |
| Production panic loops | 07, 19 |
| “Works on my machine” binary | 16, 19 |
| Silent dependency drift | 03, 17 |
| Deadlocks / stuck runtime | 12, 13 |
| Memory unsafety reports | 14, 17 |

### 4. Legacy toolchain myths

- Nightly in production “for features” is a process smell; prefer stable.
- Missing `Cargo.lock` on an application is a delivery bug.
- “Safe Rust means secure product” is false (chapter 17).

---

## 3. Applications and use cases + staff checklist

### Consolidated staff checklist

**Language & design**

- [ ] Ownership/`Result` conventions are consistent at crate boundaries.
- [ ] Module visibility matches threat and API surface.
- [ ] Async/sync model is intentional and documented.

**Security & supply chain**

- [ ] `unsafe`/FFI inventory exists and is reviewed.
- [ ] Apps build with committed lockfile (`--locked` in CI).
- [ ] Advisory scanning and update discipline are owned.
- [ ] Secrets never ship in crates or images.

**Quality**

- [ ] Tests, rustfmt, and Clippy gates match repo policy.
- [ ] Public APIs have docs appropriate to consumers.

**Delivery & operations**

- [ ] Stable (and MSRV if declared) CI matrix is green.
- [ ] Release targets verified; musl/static claims checked.
- [ ] Containers multi-stage, non-root, pinned bases.
- [ ] Structured logs, metrics, health, graceful shutdown in place.

**Portfolio fit**

- [ ] Rust chosen for the right domain reasons (chapter 18)—or exit criteria defined for a rewrite.

### Use as a hiring / promotion rubric

- **Read/patch:** chapters 01–07 in practice.
- **Own a service:** through 15 and 19.
- **Staff:** can teach 05/14/17 tradeoffs and sign the consolidated checklist without hand-waving.

### What this track does not replace

- Framework manuals (web, game, GUI) after language foundation.
- Kubernetes/Terraform product docs for orchestration.
- Formal verification or org-specific secure-coding standards.
- Exhaustive `std` and crates.io catalogs—use official docs via References.

---

## References

- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
- [rustup book](https://rust-lang.github.io/rustup/)
- [crates.io](https://crates.io/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
