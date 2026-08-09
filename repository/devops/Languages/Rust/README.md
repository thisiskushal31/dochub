# Rust

[← Back to Languages](../README.md)

Rust is a **systems programming language** that prioritizes **memory safety** and **fearless concurrency** without a garbage collector. The compiler enforces **ownership**, **borrowing**, and **lifetimes** so many classes of bugs (use-after-free, data races in safe code, classic buffer overruns) are rejected at compile time. Teams adopt Rust when they need **C/C++-class performance and control** with stronger default safety—CLIs, agents, networking stacks, embedded firmware, and performance-critical services.

This track teaches Rust as **systems work**: language and type system, software design, APIs and library boundaries, data and I/O, quality (tests, Clippy, rustfmt), security and supply chain, reliability and observability, performance and binary size, packaging and delivery (Cargo, crates.io, containers), and operations—**not** only as a syntax tour.

---

## Versions, editions, and which documentation to read

Rust releases on a **six-week train**: **stable**, **beta**, and **nightly** channels, managed with **rustup**. Language and library behavior are tied to the **stable** toolchain you pin in CI and production.

Separately, Rust uses **editions** (`2015`, `2018`, `2021`, `2024`) declared in `Cargo.toml`. An edition is a **compatibility epoch** for syntax and some idioms—not a different language. **Modern `rustc` still compiles older editions.** Brownfield crates on `edition = "2018"` or `"2021"` remain valid; you upgrade editions when you want newer defaults and syntax, not because the old edition stopped working. **Edition 2024** (with the 1.85 stable train) changes several staff-visible defaults—Cargo **resolver 3** (rust-version-aware), `unsafe extern` blocks, `#[unsafe(no_mangle)]`-style attributes, tighter `unsafe fn` body rules, and some temporary/borrow scopes. Chapters call these out where they affect review; older editions keep working until you migrate. This track includes those Edition 2024 staff notes plus **API-design patterns** (builder and typestate for safe configuration surfaces) without becoming a web/framework guide.

**Practical policy:** pin the toolchain (for example via `rust-toolchain.toml` or CI image); record `rustc --version` in release artifacts; keep a **Cargo.lock** for applications and a **container digest** (or base-image pin) for the system layer.

```bash
rustc --version
cargo --version
rustup show
```

---

## Chapter structure

Chapters `01`–`20` follow a consistent body shape:

1. **Concepts** (mechanics you can reason about in incidents)
2. **Advanced concepts** (edge cases, edition and legacy notes, failure modes)
3. **Applications and use cases** (production and governance patterns)
4. **Staff-level review checklist** (what staff enforce in review)

Links live in each chapter’s **References** section.

---

## Semantic model (why Rust feels different)

- **Ownership:** each value has one owner; when the owner goes out of scope, the value is dropped deterministically.
- **Borrowing:** you can lend immutable (`&T`) or mutable (`&mut T`) access under rules the compiler checks; you cannot have an active `&mut T` together with other borrows of the same value.
- **Lifetimes:** names that relate borrows to how long data lives; often inferred, sometimes written explicitly at API boundaries.
- **Traits:** shared behavior implemented for types; the backbone of generics and the standard library.
- **Safe by default, `unsafe` by exception:** safe Rust forbids undefined behavior the type system can prevent; `unsafe` is a deliberate, reviewable escape hatch for FFI and low-level work.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundations | 01–07 | Install toolchain; ownership, `Drop`/smart pointers; structs/enums/`let else`; typestate/builder instincts for configs; `Result`/`Error`; macros/`const`. |
| Abstraction and libraries | 08–11 | Traits/`Deref`/`AsRef` (API Guidelines literacy), RPIT capture, iterators, modules/semver, `std` ops map (`Instant`/`SystemTime`) + serde/secrets. |
| Runtime and systems | 12–14 | Atomics/threads/`Weak` cycles; async Pin/cancel/JoinSet and what a runtime *is*; `unsafe`/FFI and what soundness promises mean; `repr(C)`/Edition 2024 extern rules; when writing proc-macros makes sense (ch 03). |
| Production engineering | 15–20 | Tests/Miri/fuzz/snapshots, release tiers/portable CPU flags, supply chain, where Rust fits (CLI→embedded→WASM) and what frameworks are, tracing/diagnostics/`RUST_BACKTRACE`, competency map. |

Suggested order: **01 → 07**, then **08 → 11**, then **12 → 14**, then **15 → 20**. Revisit **05** for borrow-checker and `Drop` incidents; **07** before designing APIs; **03/04** before inventing macros; **13** before adopting an async runtime or HTTP framework; **14** before owning `unsafe`/FFI; **17** before untrusted deps or network-facing binaries; **18** before `no_std`/WASM bets; **19** before shipping service logging/metrics.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 1 | What is Rust and why teams use it | [01](./01_What_Is_Rust_And_Why_Teams_Use_It.md) |
| 2 | Toolchain: rustup, rustc, Cargo, and editions | [02](./02_Toolchain_Rustup_Rustc_Cargo_And_Editions.md) |
| 3 | Cargo projects, workspaces, proc-macro crates | [03](./03_Cargo_Projects_Crates_And_Workspaces.md) |
| 4 | Syntax, types, `const`/`const fn`, and `macro_rules!` | [04](./04_Syntax_Types_And_Ownership_Basics.md) |
| 5 | Ownership, borrowing, lifetimes, `Drop`, smart pointers | [05](./05_Ownership_Borrowing_And_Lifetimes.md) |
| 6 | Structs, enums, and pattern matching | [06](./06_Structs_Enums_And_Pattern_Matching.md) |
| 7 | Error handling: `Result`, `Option`, and panic | [07](./07_Error_Handling_Result_Option_And_Panic.md) |
| 8 | Traits, generics, const generics, advanced lifetimes | [08](./08_Traits_Generics_And_Advanced_Lifetimes.md) |
| 9 | Collections, iterators, and closures | [09](./09_Collections_Iterators_And_Closures.md) |
| 10 | Packages, modules, and visibility | [10](./10_Packages_Modules_And_Visibility.md) |
| 11 | `std` ops map + serde/config, secrets, platform quirks | [11](./11_Std_For_Operations_Fs_Process_Env_Net.md) |
| 12 | Concurrency: threads, sync, `OnceLock`, `Send`/`Sync` | [12](./12_Concurrency_Threads_Sync_Send_Sync.md) |
| 13 | Async Rust: runtimes, internals literacy, pitfalls | [13](./13_Async_Rust_Runtimes_And_Pitfalls.md) |
| 14 | Unsafe, FFI, Nomicon validity, `cdylib`/`staticlib` | [14](./14_Unsafe_FFI_And_Boundaries.md) |
| 15 | Testing, Clippy, rustfmt, docs, benches | [15](./15_Testing_Clippy_Rustfmt_And_Docs.md) |
| 16 | Cross-compile, targets, release/`panic` profiles | [16](./16_Cross_Compile_Targets_And_Release_Builds.md) |
| 17 | Security, supply chain, audit/deny, `build.rs` | [17](./17_Security_And_Supply_Chain.md) |
| 18 | Use cases: CLI, agents, infra, embedded stack, WASM | [18](./18_Use_Cases_CLI_Agents_Infra_Embedded.md) |
| 19 | Production: CI, containers, tracing/metrics | [19](./19_Production_CI_Containers_And_Observability.md) |
| 20 | Whole-engineering wrap and staff checklist | [20](./20_Whole_Engineering_Wrap_And_Staff_Checklist.md) |

---

## Deep-study workflow

1. Read each chapter with a **notebook of invariants** for your org (edition, MSRV if declared, feature flags, `unsafe` inventory, async runtime choice).
2. After chapters **04–07**, rewrite a small script from another language into Rust and note where ownership forced a redesign.
3. After chapters **11–13**, build one CLI that shells out or opens sockets and one small async fetch—measure compile time and binary size.
4. After chapters **15–19**, wire `cargo test`, Clippy, rustfmt, and dependency review into CI the way you would for any production language.

---

## Further reading

- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [Rust By Example](https://doc.rust-lang.org/stable/rust-by-example/)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [The Rust Reference](https://doc.rust-lang.org/stable/reference/)
- [Asynchronous Programming in Rust (Async Book)](https://rust-lang.github.io/async-book/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/)
- [The Embedded Rust Book](https://doc.rust-lang.org/stable/embedded-book/)

---

## References (hub links)

- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
- [The Rust Programming Language](https://www.rust-lang.org/)
- [crates.io](https://crates.io/)
- [rustup](https://rust-lang.github.io/rustup/)
