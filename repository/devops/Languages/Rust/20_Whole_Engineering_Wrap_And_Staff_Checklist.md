# Whole-engineering wrap and staff checklist

[← Back to Rust](./README.md)

## What this chapter covers

A **competency map** that ties chapters **01–19** into staff-level expectations across language, design, security, and delivery; a consolidated **checklist**; guidance on **when not to use Rust**; **migration** notes from C, Go, and Python scripts; and a **reading path** for brownfield `edition = "2018"` crates. Use this as a sign-off aid, not a substitute for the earlier chapters.

---

## 1. Concepts

### 1. Competency map (chapters → outcomes)

| Block | Chapters | You can… |
|-------|----------|----------|
| Foundations | 01–07 | Install toolchain; explain ownership/borrowing; model data with structs/enums; use `Result`/`Option` without panic-driven control flow; explain **Drop/RAII** and common smart pointers (`Box`, `Rc`/`Arc`, `RefCell`/`Mutex` at the literacy level); prefer **typestate/builder** shapes for dangerous configs over boolean soup. |
| Abstraction & libraries | 08–11 | Design traits and modules per **API Guidelines** literacy (naming, conversions, predictable builders); use iterators idiomatically; perform operational I/O via `std` (**`Instant` vs `SystemTime`**); keep **serde** (or equivalent) at trust boundaries for wire/config formats. |
| Runtime & systems | 12–14 | Reason about threads/`Send`/`Sync`, **`Weak` cycles**, and **atomics discipline**; choose or refuse async deliberately (**Pin**/cancellation); bound `unsafe` and FFI including **string/ABI edges** (Edition **2024** `unsafe extern` / unsafe attributes awareness); **consume** macros safely and know when **writing** macros/proc-macros is unjustified cost. |
| Production engineering | 15–19 | Test and lint (**Miri** when owning unsafe; snapshots/contracts where useful); cross-compile and release (**panic** profile, strip/debuginfo, **portable vs `target-cpu=native`**); manage supply chain (**audit/deny**, optional vet/crev, semver for libs); place Rust in CLI/agent/infra contexts; adopt **`no_std`/`alloc`/WASM only when needed**; ship with CI, containers, SBOM/provenance, **tracing/`log` bridge**, staging **`RUST_BACKTRACE`**, and health-probe semantics. |

Suggested mastery order remains **01→07 → 08→11 → 12→14 → 15→20**, with revisits to **05** (borrow checker), **07** (errors), **13** (async), and **17** (deps) under incident pressure.

### 2. Role lenses (same language, different depth)

| Role | Must be solid on | Can defer initially |
|------|------------------|---------------------|
| Application / backend | 04–11, 07, 13, 15, 19 (logging/tracing, serde boundaries, API Guidelines builders/typestate) | Deep embedded/`no_std`, writing proc-macros |
| DevOps / SRE | 02–03, 11, 15–17, 19 (CI cache keys, portable CPU flags, audit/deny, metrics, `RUST_BACKTRACE` staging) | Advanced trait HRTB |
| Security | 05, 07, 14, 17 (`build.rs`, proc-macros, deny policies, FFI strings, zeroization) | Async runtime internals |
| Platform / infra | 01–07, 11–13, 16, 18–19 (panic profile, agents/sidecars, privilege drop) | Proc-macro authorship; WASM unless required |
| Embedded / systems | 02, 05, 14, 16, 18 (`no_std`/`alloc`/HAL) | Large async web stacks |

### 3. Whole-engineering domains (not “just DevOps”)

Rust fluency for staff work spans:

1. **Language & type system** — ownership, lifetimes, traits, Drop/RAII, smart-pointer literacy.
2. **Software design** — module boundaries, error types, feature flags, macros (consume vs write).
3. **APIs & data** — serde (or equivalent) at boundaries, I/O, wire formats.
4. **Quality** — tests, Clippy, rustfmt, docs.
5. **Security & supply chain** — `unsafe`, FFI, lockfiles, cargo-audit/cargo-deny practices, build-time code.
6. **Reliability & observability** — panics, shutdown, tracing/logging policy, metrics, correlation/redaction.
7. **Performance & artifacts** — profiles (including `panic`), targets, binary size; `no_std`/WASM only when needed.
8. **Delivery** — CI matrix (toolchain in cache keys), containers, non-root, MSRV vs toolchain pins.

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

### 1. Reading path for brownfield editions (including → 2024)

1. Confirm **toolchain**: `rust-toolchain.toml` / CI pin vs “whatever is on the laptop.”
2. Read **`Cargo.toml`**: edition (`2018` / `2021` / `2024`), `rust-version`/MSRV, features, workspace members.
3. Map **binaries vs libs**; find `main` and public `lib` API; note **semver** promises if the crate is a library.
4. Inventory **`unsafe`, FFI, `build.rs`**, and network/fs ambient authority; for Edition **2024**, expect `unsafe extern` and `#[unsafe(no_mangle)]`-style attributes after migration.
5. Note **async runtime** (or absence), cancel/`select!` habits, and atomics/`Ordering` use before changing concurrency.
6. Run **`cargo test`**, **`cargo clippy`**, **`cargo fmt --check`** as baseline; add **`cargo miri test`** when the crate owns unsafe.
7. Upgrade edition only with the Edition Guide checklist (`cargo fix --edition` + human review)—not as a drive-by in a CVE patch.

Edition 2018/2021 crates remain first-class on modern stable rustc. Treat edition bumps—especially **2024** FFI/attribute syntax—as deliberate migrations.

### 2. Invariants notebook (staff habit)

Keep a living note per product: edition, MSRV/`rust-version`, toolchain pin, feature matrix, unsafe/FFI-string inventory, async runtime, release targets, **panic** profile, strip/debuginfo policy, portable vs native CPU flags, tracing/logging subscriber (+ `log` bridge) choice, staging `RUST_BACKTRACE` policy, advisory/deny triage owner, and whether `no_std`/`alloc` or WASM is in scope. This notebook is the difference between a hero rewrite and operable ownership.

### 3. Failure modes that span chapters

| Symptom | Likely chapters |
|---------|-----------------|
| Borrow checker blockage at API edge | 05, 08 |
| Production panic loops | 07, 16 (panic profile), 19 |
| “Works on my machine” binary | 02 (toolchain), 16, 19 |
| Silent dependency drift / advisory surprise | 03, 17 |
| Deadlocks / stuck runtime | 12, 13 |
| Memory unsafety reports | 14, 17 |
| Unusable production logs | 19 (tracing/logging policy) |
| Accidental `no_std`/WASM complexity | 18 |

### 4. Legacy toolchain myths

- Nightly in production “for features” is a process smell; prefer stable.
- Missing `Cargo.lock` on an application is a delivery bug.
- “Safe Rust means secure product” is false (chapter 17).

---

## 3. Applications and use cases + staff checklist

### Consolidated staff checklist

**Language & design**

- [ ] Ownership/`Result` conventions are consistent at crate boundaries.
- [ ] Drop/RAII and smart-pointer choices are understood at API edges; **`Weak`** (or redesign) breaks `Rc`/`Arc` cycles—no accidental leaks or interior-mutability sprawl.
- [ ] **Typestate / builder** patterns used for dangerous configs so illegal states are hard to construct (not a boolean soup of half-init options).
- [ ] **`Deref` / `AsRef` API hygiene** (API Guidelines literacy): conversions are intentional and documented—no surprising deref coercion or “stringly” `AsRef` surfaces that hide allocation/ownership costs.
- [ ] Time APIs: **`Instant`** for intervals/deadlines; **`SystemTime`** for wall clock—never confuse the two in probes or timeouts.
- [ ] Macros literacy: team can **consume** macros safely; **writing** macros/proc-macros is justified and reviewed.
- [ ] Serde (or equivalent) used at trust boundaries for config/wire formats—not ad-hoc parsers for hostile input.
- [ ] Module visibility matches threat and API surface.
- [ ] Async/sync model is intentional and documented (**Pin**/cancellation; no unbounded spawn).
- [ ] **Atomics discipline**: `Ordering` justified; no invented lock-free protocols for multi-location invariants.
- [ ] **Edition 2024 migration awareness** when bumping editions (especially `unsafe extern` and unsafe mangling attributes).

**Security & supply chain**

- [ ] `unsafe`/FFI inventory exists and is reviewed; **FFI strings** (`CStr`/`CString`/nul and encoding obligations) documented at each boundary; **Miri** (and sanitizers if adopted) for unsafe-owning crates.
- [ ] Apps build with committed lockfile (`--locked` in CI).
- [ ] Libraries follow **semver** (and crate compatibility) discipline for public API changes—not “just bump major when tired.”
- [ ] **cargo-audit** / **cargo-deny** (or equivalent) and update discipline are owned; optional vet/crev-class review only if org policy says so.
- [ ] `build.rs` / proc-macro trust reviewed for new deps; new crates pass maintainer/`unsafe`/license checklist—not download count alone.
- [ ] Secrets never in git; runtime injection only; never ship in crates or images; in-memory zeroization considered for long-lived credentials.

**Quality**

- [ ] Tests, rustfmt, and Clippy gates match repo policy; contract/snapshot tests where CLI/config surfaces need them.
- [ ] Public APIs have docs appropriate to consumers; fuzz/coverage practices for hostile parsers where relevant.

**Delivery & operations**

- [ ] Stable (and MSRV/`rust-version` if declared) CI matrix is green; toolchain pin distinct from advertised MSRV when both exist.
- [ ] Release targets verified (tier-aware); musl/static claims checked; **panic** profile (`unwind` vs `abort`) chosen deliberately.
- [ ] **Portable vs native CPU flags**: public/CI artifacts do not bake `target-cpu=native` or ambient laptop `RUSTFLAGS`.
- [ ] Containers multi-stage, non-root, pinned bases; SBOM/provenance per org policy.
- [ ] Tracing/logging policy (`log` facade vs `tracing` spans/subscribers + bridge); correlation IDs; redaction; OTel export optional.
- [ ] Metrics, health (readiness vs liveness—behavior over path names), graceful shutdown in place.
- [ ] **`RUST_BACKTRACE`** enabled in staging (prod policy documented); panic hooks structured.
- [ ] CI caches key on lockfile **and** rust-toolchain; advisory/deny job present.

**Portfolio fit**

- [ ] Rust chosen for the right domain reasons (chapter 18)—or exit criteria defined for a rewrite.
- [ ] **`no_std` / `alloc` / WASM (`wasm32` + host)** adopted only when the domain requires them—not as default complexity.

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
- [Edition Guide — Rust 2024](https://doc.rust-lang.org/edition-guide/rust-2024/index.html)
- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [The Cargo Book — Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [The Cargo Book — rust-version](https://doc.rust-lang.org/cargo/reference/rust-version.html)
- [The Cargo Book — SemVer compatibility](https://doc.rust-lang.org/cargo/reference/semver.html)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [The Embedded Rust Book](https://doc.rust-lang.org/stable/embedded-book/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
- [rustup book](https://rust-lang.github.io/rustup/)
- [RustSec](https://rustsec.org/)
- [crates.io](https://crates.io/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
