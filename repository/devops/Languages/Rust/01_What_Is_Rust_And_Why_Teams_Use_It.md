# What is Rust and why teams use it

[← Back to Rust](./README.md)

## What this chapter covers

What Rust is as a language and platform, how its safety model differs from garbage-collected and unchecked-memory languages, why engineering teams adopt it, what costs to budget for, and where Rust shows up in real systems—CLIs, agents, infrastructure, networking, and embedded—so you can decide when it is the right tool and what “safe by default” actually means in practice.

---

## 1. Concepts

### 1. Language identity

**Rust** is a **systems programming language**: you control memory layout, calling conventions, and when resources are released, with performance and binary characteristics in the same league as C and C++. It is not a scripting language bolted onto a VM by default, and it is not a managed runtime that pauses the world for garbage collection in the usual sense.

The language ships with a strong **type system**, **algebraic data types** (`enum` with data), **traits** (shared behavior), and a **standard library** for I/O, collections, threading, and more. Compilation produces **native machine code** for a chosen target triple (for example `x86_64-unknown-linux-gnu` or `aarch64-apple-darwin`). You can also build for constrained environments with **`no_std`**, where the full standard library is unavailable.

Rust’s distinctive claim is **memory safety and thread safety without a garbage collector**, enforced primarily by the compiler through **ownership**, **borrowing**, and **lifetimes**. In **safe** Rust, classes of bugs that dominate C/C++ incident history—use-after-free, double-free, many buffer overruns, and data races—are rejected at compile time rather than deferred to runtime or production.

### 2. Memory safety without a garbage collector

Two common industry defaults:

| Model | How memory is reclaimed | Typical tradeoff |
|-------|-------------------------|------------------|
| **Manual** (C, much C++) | Programmer `free`/`delete` or RAII with discipline | Max control; easy to get wrong |
| **Garbage collected** (Go, Java, many managed runtimes) | Runtime traces or refcounts live objects | Convenience; pauses, less layout control |
| **Ownership (Rust)** | Each value has one owner; drop runs when owner leaves scope | Compile-time checks; learning curve |

In Rust, when a value’s owner goes out of scope, the compiler inserts a **drop** (destructor) for that type. Heap buffers behind `String` or `Vec` are freed then—deterministically, at a known program point—not when a GC cycle happens to run. You still allocate on the heap when types need it; you do not manually pair every `malloc` with `free` in safe code.

**Safe Rust** is the default: the type system and borrow checker forbid undefined behavior they can see. **`unsafe`** is an explicit opt-in for FFI, raw pointers, and other operations where the programmer must uphold invariants the compiler cannot check. Teams treat `unsafe` as a review boundary, not as everyday style.

“Memory safe” does not mean “bug free.” Logic errors, incorrect authorization, panics that abort a process, resource exhaustion, and supply-chain issues remain engineering problems. Rust removes a *category* of memory and concurrency defects from the default path; it does not replace testing, threat modeling, or operational discipline.

### 3. Fearless concurrency (the marketing phrase, the real rule)

Rust’s concurrency story rests on the same ownership rules: if two threads cannot simultaneously hold conflicting access to the same data, many **data races** cannot occur in safe code. Types carry marker traits such as **`Send`** (safe to move to another thread) and **`Sync`** (safe to share references across threads). The compiler rejects sharing patterns that would be races in languages that allow unchecked mutable aliasing.

You still design for **deadlocks**, **livelocks**, **incorrect algorithms**, and **async cancellation** pitfalls. “Fearless” means the type system backs shared-state concurrency; it does not mean concurrent systems are trivial.

### 4. Why teams use Rust

Adoption usually follows concrete engineering goals:

- **Correctness under performance pressure** — Networking stacks, parsers, crypto-adjacent code, and hot paths where GC jitter or C-style memory bugs are unacceptable.
- **Single static binaries** — Many CLI and agent deployments prefer a self-contained executable (with caveats around dynamic libc linking and feature flags) over shipping a large runtime.
- **Fear of undefined behavior in C/C++ estates** — Gradual rewrite or greenfield modules where memory safety is a product requirement.
- **Strong tooling defaults** — **Cargo** (build + dependencies), **rustfmt**, **Clippy**, and integrated docs raise the floor for new contributors.
- **Ecosystem fit** — WebAssembly targets, embedded (`no_std`), and a growing set of cloud-native and observability tools written in Rust.

Teams keep Rust when the **long-term cost of defects** and **operational binary simplicity** outweigh compile-time and onboarding costs. They avoid or limit Rust when the problem is a thin glue script, when the team cannot invest in ownership literacy, or when an existing managed stack already meets SLOs with less friction.

### 5. Costs and constraints you must budget

Honest adoption planning includes:

| Cost | What it looks like |
|------|--------------------|
| **Learning curve** | Ownership and lifetimes feel alien after GC languages; early velocity dips |
| **Compile times** | Large dependency graphs and generics-heavy crates can slow CI and local iteration |
| **Ecosystem choices** | Async often implies a runtime (for example Tokio); mixing runtimes is painful |
| **Unsafe and FFI** | Interop with C libraries reintroduces review burden at the boundary |
| **Hiring and review** | Fewer senior reviewers than for Java/Go/Python in many markets |
| **Incremental rewrite cost** | Dual stacks during migration; FFI surface area during the transition |

Compile time is not “slow forever”—incremental builds, shared CI caches, and workspace layout help—but **cold builds** of big graphs remain a planning input for monorepos and agents that rebuild often.

### 6. Where Rust shows up in engineering

| Domain | Typical artifacts | Why Rust |
|--------|-------------------|----------|
| **CLI tools** | `ripgrep`-class utilities, internal devops CLIs | Fast startup, single binary, safe parsing |
| **Agents and sidecars** | Node agents, log/metric shippers, policy agents | Low overhead, long-lived processes, fewer memory bugs |
| **Infrastructure and platforms** | Proxies, control-plane components, container tooling | Throughput + safety |
| **Networking and protocols** | Proxies, DNS, QUIC/HTTP stacks | Zero-copy-friendly designs, concurrency safety |
| **Embedded and firmware** | `no_std` crates, RTOS targets | No GC; precise control of resources |
| **Wasm and edge** | Portable modules | Small modules, sandboxed hosts |
| **Libraries consumed by other languages** | `cdylib` / FFI | Safe core with a thin C ABI |

You do not need to write Rust daily to encounter it: incident response, SBOM review, and platform ownership increasingly include Rust binaries in the graph.

### 7. How Rust relates to other languages you already know

- Versus **C/C++**: similar performance ambitions; much stronger default safety; different abstraction style (traits vs inheritance-heavy OOP).
- Versus **Go**: both target systems and cloud services; Go emphasizes simplicity and GC; Rust emphasizes zero-cost abstractions and compile-time memory rules.
- Versus **Java / C# / Python**: those optimize developer velocity with managed runtimes; Rust optimizes predictable resource use and safety without that runtime model.
- Versus **TypeScript on Node**: different problem class—Rust is for native artifacts and tight resource control, not primarily for UI or rapid scripting.

Choosing Rust is rarely “replace the whole company stack”; it is often “put Rust where memory bugs or performance ceilings hurt most.”

---

## 2. Advanced concepts

### 1. Safe, unsafe, and undefined behavior

**Undefined behavior (UB)** means the language no longer guarantees what the program does—optimizers may assume UB never happens. Safe Rust is designed so you cannot cause UB without using `unsafe` (or buggy `unsafe` in dependencies you call). That does not make every crate trustworthy: a dependency’s `unsafe` block can still be wrong. Staff review includes **where unsafe lives**, not only whether your crate’s `src/` has the keyword.

### 2. Drop, RAII, and deterministic cleanup

Rust leans on **RAII**: locks unlock when guards drop; files close when handles drop; custom types implement `Drop` for cleanup. That interacts with ownership: moving a value transfers the cleanup obligation. Leaking memory deliberately (`std::mem::forget`, reference cycles with `Rc`/`RefCell`) is possible but uncommon in well-reviewed code—know that “no GC” does not mean “impossible to leak.”

### 3. Editions are not language forks

Code written for **edition 2015**, **2018**, **2021**, or **2024** still compiles on a modern **stable** `rustc` when the crate declares that edition. Teams upgrade editions for new idioms and defaults, not because old editions stop working. A brownfield estate with mixed editions in one workspace is normal; see the toolchain chapter for the `edition` field and migration posture.

### 4. Panic versus unrecoverable failure

By default, a **panic** unwinds (or aborts, depending on profile) and is not the primary error-handling path for expected failures—those use `Result` and `Option`. Panics remain for programming bugs (“this invariant must hold”). In FFI or certain embedded profiles, panic strategy is a deployment decision. Do not treat “it compiled” as “it cannot crash.”

### 5. When Rust is the wrong default

- One-off glue that will run a handful of times and never be a product.
- Teams with no capacity to learn ownership, reviewing only for “green CI.”
- Domains where the dominant libraries and hiring market are firmly elsewhere and SLOs are already met.
- Ultra-fast prototyping of product UI where a managed stack ships value an order of magnitude faster.

Saying no is a staff skill. Forcing Rust into every service creates compile-time and hiring debt without safety payoff.

### 6. Organizational failure modes

- **Hero adoption** — one engineer rewrites a critical path; nobody else can review borrow-checker fights or `unsafe`.
- **Dependency sprawl** — Cargo makes pulling crates easy; supply-chain and MSRV discipline lag.
- **Async fashion** — marking everything `async` without a runtime and cancellation story.
- **C++ habits in Rust syntax** — excessive `clone()`, shared mutable state via interior mutability everywhere, or large `unsafe` regions “to make it compile.”

---

## 3. Applications and use cases

### Software engineering and architecture

- Prefer Rust for **boundaries that must not corrupt memory**: parsers of untrusted input, protocol codecs, sandboxed plugins, long-lived agents.
- Keep **domain logic** in safe Rust with clear module boundaries; isolate FFI and `unsafe` behind small APIs with documented invariants.
- Design for **testability**: pure functions and `Result`-based errors over global mutable state.
- Plan **onboarding**: pair ownership chapters (04–05) with a small internal crate before assigning production incidents.

### Security

- Memory safety reduces exploit classes that dominate native code; still validate **all untrusted input**, authenticate/authorize at boundaries, and audit **dependencies**.
- Treat `unsafe` and FFI as **high-risk surface**: require justification, tests, and preferably `#[forbid(unsafe_code)]` in crates that should stay pure safe.
- Lockfiles and crate provenance belong in the same security review as application code (later chapters cover supply chain in depth).

### Reliability and operations

- Native binaries simplify some deploys but still need **health checks**, **structured logging**, **metrics**, and **graceful shutdown**.
- Panics in worker threads or request handlers need a policy (catch_unwind is situational; often “crash and restart under supervisor” is clearer).
- Measure **RSS**, **startup time**, and **p99 latency** the same way you would for Go or C++ services.

### Performance and capacity

- Zero-cost abstractions are a design goal, not a guarantee that every crate is fast—profile before rewriting algorithms in `unsafe`.
- Binary size grows with features, panic machinery, and debug info; release profiles and feature flags are knobs for agents and embedded.
- Compile-time is part of developer productivity SLOs; invest in sccache or CI caching for large workspaces.

### Delivery and platform engineering

- Standardize **toolchain pins** (rustup toolchain file or CI image digest) so “works on my machine” matches production builders.
- Document **why Rust** in the service README: threat model or performance goal, not fashion.
- For polyglot platforms, define **ownership of the Rust pipeline** (who upgrades rustc, who reviews Clippy, who owns crate audits).

### Staff-level review checklist

- The problem statement names a **concrete benefit** (memory safety, latency, binary deploy, embedded constraints)—not “Rust is modern.”
- Team capacity includes **borrow-checker literacy** and at least one reviewer comfortable with `unsafe`/FFI if those appear.
- **Compile-time and CI** budgets are acknowledged; caching strategy exists for the expected graph size.
- **Unsafe and FFI inventory** is known or confirmed absent; policy for new `unsafe` is written.
- Success metrics (defect class reduction, p99, binary size, ops toil) are defined before a rewrite expands.
- Exit criteria exist for **not** using Rust when a managed language meets the bar.

---

## References

- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [Rust — Why Rust](https://www.rust-lang.org/)
- [Rust Standard Library](https://doc.rust-lang.org/stable/std/)
- [The Rustonomicon (unsafe Rust)](https://doc.rust-lang.org/nomicon/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
