# Use cases: CLI, agents, infra, embedded

[← Back to Rust](./README.md)

## What this chapter covers

Where Rust shows up in real engineering portfolios: **CLI tools**, **observability and security agents**, **cloud-native sidecars**, **embedded / `no_std`**, and carefully scoped **WebAssembly**. How Rust sits beside **Go** and **C** in infrastructure stacks, and how to **read** other people’s Rust when you inherit a repo. This is a domain map, not a framework tour.

---

## 1. Concepts

### 1. Why these domains choose Rust

Teams pick Rust when they want:

- **Predictable performance** without a GC pause profile (agents on busy nodes, packet-adjacent paths).
- **Memory safety by default** for long-running or privileged processes.
- **Single static-ish binaries** that are easy to ship as CLIs or sidecars (subject to chapter 16 linkage checks).
- **Fearless concurrency** for multi-threaded collectors and servers—when the design fits ownership.

Costs: longer compile times, steeper onboarding than scripting, and ecosystem choices (especially async runtimes) that become architectural commitments.

### 2. CLI tools

Rust is a strong fit for developer and operator CLIs: argument parsing, structured output, exit codes, and fast local execution. Typical shape:

- Binary crate + small library crate for testable core logic.
- Clear `Result` error surfaces to users (human messages) vs logs (detail).
- Feature flags for optional backends.

**Ecosystem pattern — clap-class parsing:** most production CLIs use a derive-or-builder argument parser in the clap family (or a thin wrapper). Staff expectation is not that you memorize every attribute—know that flags, subcommands, env-backed options, and help text live in one structured definition, and that breaking CLI flags is a semver/product decision. Pair with:

- **Exit codes** — `0` on success; non-zero for user error vs unexpected failure (document the convention operators can script against).
- **`--version` / `-V`** — ship build identity (crate version; often git SHA via build-time env) so fleet support can answer “which binary is this?”
- Human-readable errors on stderr; machine output (`--json`) on stdout when both exist.

You will meet Rust CLIs as replacements for shell/Python glue when startup time, correctness, or distribution as one file matters.

### 3. Observability and security agents

Agents run on customer or fleet hosts with **high privilege** and **strict resource budgets**. Rust is used for collectors, eBPF-adjacent userland, endpoint components, and log/metric forwarders because crashes and memory corruption are operationally expensive.

Engineering constraints that dominate:

- **Privilege drop** — bind or open privileged resources, then drop to an unprivileged user/capabilities before handling untrusted input; never keep root for the steady state without a written exception. On **Unix-class** hosts, prefer dropping ambient **capabilities** (and switching UID/GID) after the privileged setup step when the OS allows—keep only the caps the steady-state path needs; document platform gaps (Windows service models differ). Awareness, not a portability tutorial.
- **Config reload** — SIGHUP or watched files that swap config atomically; in-flight work should finish on the old config or fail closed—document which.
- **Backpressure** — when sinks (HTTP, Kafka, disk) are slow, bound queues and shed or block upstream deliberately; unbounded channels are a memory DoS against yourself.
- Minimal allocations on hot paths where required.

Supply-chain discipline (chapter 17) is non-negotiable: agents are high-value targets.

### 4. Cloud-native sidecars and services

Sidecars (proxy helpers, auth filters, config agents) favor small images, fast startup, and boring operations. Rust services often sit next to Go control planes: Go for APIs and orchestration ergonomics, Rust for the data path or CPU-heavy filter. Neither language “wins” infrastructure—**interfaces and SLOs** do.

Patterns:

- gRPC/HTTP APIs with explicit timeouts and deadlines.
- Health and readiness endpoints for orchestrators.
- Graceful shutdown (chapter 19).
- Same **privilege drop / reload / backpressure** disciplines as agents when the sidecar touches the host network or secrets.

### 5. Embedded: `no_std`, `alloc`, and HALs

On microcontrollers and bare metal, crates often use **`#![no_std]`**: link **`core`** (language primitives, no OS) instead of full **`std`** (files, threads, networking, heap by default). Mental model:

| Layer | Role |
|-------|------|
| **`core`** | Always available in `no_std`; no allocator assumed |
| **`alloc`** | Optional heap (`Vec`, `String`, `Box`, …) **if** you provide a global allocator |
| **`std`** | Hosted environments with an OS-like runtime—usually absent on bare metal |

**`alloc` without full `std`:** sometimes the chip has a heap (you plug in a global allocator) but still has no real OS files, threads, or network. Then you keep `#![no_std]` and add the **`alloc`** crate so `Vec` and `String` exist without pretending you have Linux. Say who provides the allocator and what happens if allocation fails. Day-to-day work is flashing boards, linker scripts, and interrupt safety—not debating editions. Prefer a mature HAL for your chip over poking raw registers unless that risk is yours on purpose (chapter 14 still applies wherever `unsafe` appears).

**How embedded crates are usually layered**—each name is just “how close to the metal”:

| Layer | What it is |
|-------|------------|
| **PAC** (peripheral access) | The lowest Rust view of the chip: generated register access. Thin, chip-specific, often `unsafe` at the edge. |
| **HAL** (hardware abstraction) | Friendlier drivers for GPIO, UART, SPI, timers, and so on—built on the PAC so app code is less raw. |
| **BSP** (board support) | Glue for *your board*: which pin is which LED, how clocks are wired, onboard sensors. |
| **RTOS / small executor (optional)** | Something that schedules work on the MCU—a simple loop, a cooperative async executor, or a real-time OS. That choice is about latency, power, and product needs—not a Cargo default. |

Know which layer you own, and write down who owns interrupts and DMA. Edition still matters for syntax; **target, HAL, allocator, and how work is scheduled** matter more for shipping.

### 6. What WebAssembly is in a Rust project (optional)

**WebAssembly (WASM)** is a portable binary format: Rust can compile to a small module that runs inside a **host** (a browser, a WASM runtime, or your own embedder)—not as a normal native OS process. Target triple names change over time; remember the *idea*, not one string forever:

| Shape | Plain idea |
|-------|------------|
| **“Unknown” wasm32-style targets** | A sandboxed module that only talks to the world through functions the **host** imports/exports (for example a JS engine). No automatic Linux filesystem. |
| **WASI-style targets** | The module expects a small, capability-based “system” API (files, clocks, args, …) that a **WASI-capable host** provides—still not a full desktop OS. |

Treat WASM as an **optional** shape, not the default for every service.

- **Size matters** — download and startup cost dominate; watch dependencies and release size (chapter 16).
- **The host is the sandbox** — the module only gets what the host allows. Do not assume disk or network exist.
- **Skip WASM when** you need full POSIX/`std`, your crates are not WASM-ready, you need threading the host does not offer, or a normal CLI/sidecar is simpler for the same threat model.

A WASM file alone does nothing. Something must **load** it, set memory/fuel limits, grant capabilities, and decide trust (“untrusted plugin” vs “our own module in our process”). Version that guest/host contract when either side upgrades. Prove the exact target + host in CI; re-check when the toolchain moves. Deeper WASI platform detail lives in host docs via References.

### 7. Reading others’ Rust

When joining a brownfield crate:

1. Read `Cargo.toml` — edition, features, binary vs lib, workspace members.
2. Skim `README` and `src/main.rs` / `lib.rs` module tree.
3. Note async runtime (`tokio`, others) or plain threads.
4. Search for `unsafe`, `build.rs`, and FFI.
5. Run `cargo test` and `cargo clippy` before large edits.

Ownership-heavy APIs are often clearer once you find the **owned vs borrowed** convention at module boundaries.

---

## 2. Advanced concepts

### 1. Rust beside Go and C

| Concern | Typical Go strength | Typical Rust strength | Typical C strength |
|---------|---------------------|-----------------------|--------------------|
| Team velocity for CRUD APIs | High | Medium | Low |
| GC-sensitive latency | Weaker | Strong | Strong (manual) |
| Memory safety default | GC + bounds | Ownership | Manual |
| Existing POSIX/kernel code | cgo | FFI/`bindgen` | Native |
| Tiny MCU | Rare | Growing (`no_std`) | Dominant |

Interop: call C from Rust with explicit unsafe boundaries; call Rust from Go via C ABI carefully. Prefer clear process boundaries (sidecar) over exotic embedding unless you have staff-level FFI ownership.

### 2. Async as a domain choice

CLI tools often stay synchronous. Agents and sidecars frequently adopt an async runtime for many idle connections. Mixing runtimes or blocking the async executor is a common production bug class (chapter 13). Domain choice should be explicit in the README.

### 3. Feature-gated platforms

Infra crates often use `#[cfg(target_os = …)]`. Cross-compile CI (chapter 16) must exercise the cfgs you claim to support.

### 4. Legacy edition crates

Much production infra still uses **`edition = "2018"`** or **`2021`**. That code is valid on current rustc. When reading:

- Expect older idioms (`try!` is rare now but may appear in very old trees; `?` is normal).
- Async/await exists since 2018-era stabilization paths—focus on runtime version, not edition alone.
- Upgrade edition when you want newer syntax defaults; it is not required for security patches.

### 5. When the domain is wrong for Rust

If the work is glue scripts, one-off data transforms, or a team with no systems appetite, Rust’s compile/iterate cost may dominate. Prefer the language that matches **change rate** and **failure cost**.

### 6. Domain decision cheatsheet

| Signal | Lean toward |
|--------|-------------|
| Single binary CLI, strict exit codes, rare deps | Rust CLI |
| Privileged host agent, backpressure, long uptime | Rust agent (with chapter 17 rigor) |
| Tiny MCU, no OS, HAL already chosen | `no_std` + HAL |
| Heap but no full OS APIs | `no_std` + **`alloc`** + explicit global allocator |
| Plugin in a host sandbox, size budget, limited APIs | `wasm32` + host (WASI-class only if you need that interface) |
| CRUD API, hiring pool is Go/Java, soft latency | Often not Rust |

### 8. Agent privilege: capabilities after bind (Unix-focused)

Reiterate for staff review: the steady-state agent loop should not run as root “because setup needed it.” Pattern: open privileged sockets/files → **drop** UID/GID and surplus capabilities → only then parse untrusted configs or network payloads. Exact APIs differ by OS and whether you use libc helpers or platform crates; the invariant is product-level. On non-Unix, map to the local least-privilege model (service accounts, restricted tokens)—do not pretend Linux caps are universal.

### 9. Where frameworks fit

If you ship an HTTP API, a game, or a desktop UI, you will likely pick a **framework**—a ready-made structure for that kind of app. That choice sits *above* the language track: this chapter helps you decide whether Rust fits the domain (CLI, agent, sidecar, chip, WASM); chapter 13’s short list helps you judge a framework before you marry it. Write the choice down in the product README, and keep your core logic testable without booting the whole stack. Learn the framework from its own official book.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Keep CLI core logic in a library for unit tests; keep `main` thin.
- For agents, define resource budgets (CPU, RSS, file descriptors) as product requirements.
- Treat clap-class CLI definitions as a stable external API: changelog flag removals.

### Security

- Agents and sidecars: threat-model local attack surface, config injection, privilege drop gaps, and dependency graph.
- Embedded: physical access and update authenticity matter as much as memory safety.
- WASM: assume the host may be hostile or buggy—validate all imports/exports.

### Data and integration

- Prefer versioned wire formats; avoid ad-hoc byte protocols without schemas.
- Document filesystem and network capabilities the binary expects (native) or host-provided capabilities (WASM).

### Reliability and operations

- Ship `--version`, documented exit codes, structured logs, and health checks for anything fleet-wide.
- Provide a supported-targets matrix for each released artifact.
- Agents/sidecars: runbooks for privilege model, reload, and backpressure/saturation.

### Staff checklist

- [ ] Domain fit is explicit (CLI / agent / sidecar / embedded / WASM)—not “rewrite everything in Rust.”
- [ ] Runtime model (sync vs async) is documented and consistent.
- [ ] CLI: clap-class parsing pattern, exit codes, and `--version` are intentional.
- [ ] Agents/sidecars: privilege drop (Unix capabilities where applicable), config reload, and backpressure are designed—not afterthoughts.
- [ ] Embedded: `no_std` / `alloc` / **PAC–HAL–BSP** (and optional RTOS/executor) boundaries documented; allocator and OOM policy explicit when using heap without `std`.
- [ ] `unsafe`/FFI and `build.rs` inventoried for infra-facing binaries.
- [ ] Supported OS/arch (and MCU/`wasm32` targets if any) tested in CI against the real host runtime.
- [ ] Brownfield edition noted; MSRV noted if declared.
- [ ] Interop with Go/C is process- or ABI-documented.
- [ ] WASM (if any) distinguishes unknown-host vs WASI-class needs; **host** limits/capabilities documented; triples re-verified on toolchain bumps.
- [ ] Web/game/GUI framework (if any) chosen with an explicit rubric—not as a stand-in for language competence.

---

## References

- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [The Embedded Rust Book](https://doc.rust-lang.org/stable/embedded-book/)
- [The Embedded Rust Book — `no_std`](https://doc.rust-lang.org/stable/embedded-book/intro/no-std.html)
- [alloc crate](https://doc.rust-lang.org/stable/alloc/)
- [The rustc Book — Platform Support](https://doc.rust-lang.org/rustc/platform-support.html)
- [The rustc Book — Targets](https://doc.rust-lang.org/rustc/targets/index.html)
- [The Cargo Book — Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html)
- [The Cargo Book — Configuration](https://doc.rust-lang.org/cargo/reference/config.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [crates.io](https://crates.io/)
