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

You will meet Rust CLIs as replacements for shell/Python glue when startup time, correctness, or distribution as one file matters.

### 3. Observability and security agents

Agents run on customer or fleet hosts with **high privilege** and **strict resource budgets**. Rust is used for collectors, eBPF-adjacent userland, endpoint components, and log/metric forwarders because crashes and memory corruption are operationally expensive.

Engineering constraints that dominate:

- Backpressure when sinks are slow.
- Config reload without data loss.
- Minimal allocations on hot paths where required.
- Clear privilege separation (what runs as root vs workers).

Supply-chain discipline (chapter 17) is non-negotiable: agents are high-value targets.

### 4. Cloud-native sidecars and services

Sidecars (proxy helpers, auth filters, config agents) favor small images, fast startup, and boring operations. Rust services often sit next to Go control planes: Go for APIs and orchestration ergonomics, Rust for the data path or CPU-heavy filter. Neither language “wins” infrastructure—**interfaces and SLOs** do.

Patterns:

- gRPC/HTTP APIs with explicit timeouts and deadlines.
- Health and readiness endpoints for orchestrators.
- Graceful shutdown (chapter 19).

### 5. Embedded and `no_std`

On microcontrollers and constrained environments, crates may use **`#![no_std]`**, replacing parts of `std` with `core` / `alloc` as available. Targets, linker scripts, and flashing toolchains dominate the workflow more than Cargo features alone. `unsafe` appears more often for registers and DMA—review culture from chapter 14 applies.

Edition still matters for syntax, but **target and HAL choice** dominate day-to-day work.

### 6. WebAssembly (optional lane)

Rust can compile to **wasm32** targets for plugins, edge filters, or in-browser components. Treat WASM as an **optional** deployment shape: ABI, host capabilities, and size tooling differ from native Linux binaries. Do not assume every crate is WASM-ready (`std` and OS APIs may be unavailable or stubbed).

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

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Keep CLI core logic in a library for unit tests; keep `main` thin.
- For agents, define resource budgets (CPU, RSS, file descriptors) as product requirements.

### Security

- Agents and sidecars: threat-model local attack surface, config injection, and dependency graph.
- Embedded: physical access and update authenticity matter as much as memory safety.

### Data and integration

- Prefer versioned wire formats; avoid ad-hoc byte protocols without schemas.
- Document filesystem and network capabilities the binary expects.

### Reliability and operations

- Ship `--version`, structured logs, and health checks for anything fleet-wide.
- Provide a supported-targets matrix for each released artifact.

### Staff checklist

- [ ] Domain fit is explicit (CLI / agent / sidecar / embedded / WASM)—not “rewrite everything in Rust.”
- [ ] Runtime model (sync vs async) is documented and consistent.
- [ ] `unsafe`/FFI and `build.rs` inventoried for infra-facing binaries.
- [ ] Supported OS/arch matrix tested in CI.
- [ ] Brownfield edition noted; MSRV noted if declared.
- [ ] Interop with Go/C is process- or ABI-documented.
- [ ] Operators have runbooks for config reload, shutdown, and resource exhaustion.
- [ ] WASM (if any) is scoped; native crates are not assumed portable without evidence.

---

## References

- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [The rustc Book — Platform Support](https://doc.rust-lang.org/rustc/platform-support.html)
- [The rustc Book — Targets](https://doc.rust-lang.org/rustc/targets/index.html)
- [The Cargo Book — Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html)
- [The Cargo Book — Configuration](https://doc.rust-lang.org/cargo/reference/config.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [crates.io](https://crates.io/)
