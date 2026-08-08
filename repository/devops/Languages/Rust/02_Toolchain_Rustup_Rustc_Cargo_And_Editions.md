# Toolchain: rustup, rustc, Cargo, and editions

[← Back to Rust](./README.md)

## What this chapter covers

How the Rust toolchain fits together: **rustup** for installing and switching compilers, **channels** (stable, beta, nightly), **rustc** as the compiler, **Cargo** as the build and package front-end, optional **components** (Clippy, rustfmt, rust-src), **editions** versus compiler versions, and the **MSRV** idea—plus a high-level install picture for Linux, macOS, and Windows so local machines and CI agree on what “Rust” means.

---

## 1. Concepts

### 1. The toolchain stack

Think in layers:

| Layer | Role |
|-------|------|
| **rustup** | Installs and manages toolchains; switches default; adds targets and components |
| **rustc** | Compiles Rust source to machine code or intermediate artifacts |
| **Cargo** | Orchestrates builds, tests, docs, and dependencies; invokes `rustc` |
| **Components** | Extra tools tied to a toolchain: `clippy`, `rustfmt`, `rust-src`, `rust-analyzer`, etc. |

Day-to-day, you run **`cargo`** commands. **`rustc`** still matters when diagnosing compiler flags, target triples, or minimal reproductions. **`rustup`** matters whenever versions drift between laptop, CI, and release builders.

### 2. rustup and channels

**rustup** is the standard installer and version manager for the official toolchain. It understands **channels**:

| Channel | Meaning | Typical use |
|---------|---------|-------------|
| **stable** | Released on a ~six-week train; production default | Apps, libraries, CI, release builds |
| **beta** | Next stable in soak | Early validation of upcoming stable |
| **nightly** | Daily builds; unstable features may exist | Experimentation; some advanced tooling; avoid as silent production default |

You can also pin a **specific version** (for example `1.85.0`) or use a **toolchain file** (`rust-toolchain.toml` / `rust-toolchain`) in a repo so clones and CI select the same compiler automatically.

```bash
rustc --version
cargo --version
rustup show
rustup update
```

`rustup update` refreshes installed toolchains. Teams pin in CI even if developers update freely locally—reproducibility beats “latest on my laptop.”

### 3. rustc

**rustc** is the compiler. It parses, type-checks, borrow-checks, optimizes (at higher opt levels), and emits objects/binaries for a **target triple**. Cargo passes large flag sets to rustc; you rarely need the full surface daily, but you should recognize:

- **`--edition`** / edition from `Cargo.toml` — language epoch for that crate.
- **`-C opt-level`** / profile settings — debug vs release performance and compile time.
- **`--target`** — cross-compile to another platform when the target is installed via rustup.

Error messages from rustc (and Clippy) are part of the product experience of the language—read the notes and “help” lines; they often state the ownership conflict directly.

### 4. Cargo

**Cargo** is the official build system and package manager front-end. It reads **`Cargo.toml`**, resolves dependencies, maintains **`Cargo.lock`** for reproducible builds, and provides subcommands such as `build`, `test`, `run`, `doc`, `clippy` (via alias/component), and `fmt`.

Cargo and rustc versions travel together in a rustup toolchain: `cargo` from stable-1.x drives that same release’s `rustc`. Mixing a random system `cargo` with another `rustc` is a common source of confusing errors—prefer rustup-managed shims on `PATH`.

### 5. Components you will install

| Component | Purpose |
|-----------|---------|
| **clippy** | Lints beyond the compiler; style and correctness smells |
| **rustfmt** | Canonical formatting; reduces review noise |
| **rust-src** | Standard library source (rust-analyzer, some advanced builds) |
| **rust-analyzer** | Language server for editors (often installed via editor or rustup) |
| **llvm-tools-preview** / others | Specialized; install when a workflow documents them |

```bash
rustup component add clippy rustfmt
cargo clippy
cargo fmt --check
```

Treat Clippy and rustfmt as **CI gates** for team repos, not optional taste.

### 6. Editions versus compiler releases

Two different axes:

1. **Compiler / toolchain version** — which `rustc` binary (1.xx.y on stable). New language features and library APIs arrive here over time.
2. **Edition** — a crate-level compatibility epoch: **`2015`**, **`2018`**, **`2021`**, **`2024`**, set in `Cargo.toml`:

```toml
[package]
name = "example"
version = "0.1.0"
edition = "2024"
```

An edition changes **default syntax and idioms** for that crate (module paths, idiomatic patterns, some keyword reservations, and so on—details evolve per edition). Critically: **a modern rustc still compiles crates on older editions**. Edition is not “Rust 2024 the language that obsoletes Rust 2018”; it is a per-crate opt-in to newer defaults while the ecosystem migrates gradually.

You can depend on a 2018 edition crate from a 2024 edition crate in one build graph. That is intentional ecosystem design.

### 7. MSRV (minimum supported Rust version)

**MSRV** is the oldest rustc a project claims to support. Libraries publish an MSRV so downstream users on slightly older stables can still compile. Applications often pin “current stable only.”

MSRV is a **policy**, sometimes enforced with CI matrix jobs (`1.70`, `1.76`, stable, …). It is not a separate channel. Document it in README or `Cargo.toml` metadata when you maintain a library; bump it deliberately when you need APIs from newer rustc.

### 8. Installing on Linux, macOS, and Windows (high level)

**Official path:** install rustup from the Rust project’s install instructions, then let rustup manage toolchains.

| Platform | Typical notes |
|----------|----------------|
| **Linux** | curl-based rustup installer common; need a C linker/`build-essential` (or distro equivalent) for native linkage; musl targets optional for static-ish Linux binaries |
| **macOS** | rustup installer; Xcode CLT for the linker; Apple Silicon vs Intel triples matter for native and CI |
| **Windows** | rustup-init.exe; choose **MSVC** (default, Visual Studio Build Tools) or **GNU** toolchain; MSVC is the usual Windows production choice |

Corporate environments may mirror the installer or vendor a toolchain in a base image. The invariant is the same: **one documented way** to get matching `rustc`/`cargo`/components onto developer machines and CI runners.

Verify after install:

```bash
rustup default stable
rustc -vV
cargo -vV
```

---

## 2. Advanced concepts

### 1. Toolchain files and override precedence

A repo-local **`rust-toolchain.toml`** (or legacy `rust-toolchain`) overrides the user default when you enter that directory. Overrides can also be set with `rustup override`. Failure mode: CI uses image-default stable while developers silently use a toolchain file—or the reverse. Print `rustc -vV` in CI logs.

### 2. Nightly features and stability

Nightly can enable **unstable language features** via `#![feature(...)]`. Those features can change or vanish before stabilization. **Never** let production application code depend on nightly features without an explicit risk acceptance. Some tools historically needed nightly; prefer stable alternatives when they exist.

### 3. Beta as a rehearsal

Running CI on **beta** weekly catches breakage before the six-week stable promotion. Low cost for libraries; high value for widely depended crates.

### 4. Edition migration and superseded idioms

When upgrading editions, run the official migration assistance (`cargo fix --edition` and related workflows) and fix remaining lints. Examples of superseded patterns you will still see in old code:

- **`try!` macro** — older error propagation; modern code uses the **`?` operator** (available for a long time; idiomatic across recent editions).
- **Extern crate / path idioms** — 2015-style `extern crate` is largely unnecessary in 2018+ for ordinary dependencies.
- **Anonymous-parameter traits and other edition cleanups** — editions periodically make the language more consistent; old forms may still parse on old editions.

Legacy code on edition 2015/2018 remains valid; migrate when you want newer defaults, not because the compiler abandoned those crates.

### 5. Components out of sync

If Clippy fails with “toolchain doesn’t match,” the Clippy component was not installed for the active toolchain. `rustup component add clippy` **for that toolchain** (`rustup component add clippy --toolchain nightly` when using nightly).

### 6. Multiple toolchains on one machine

Developers often keep stable + nightly. PATH order and `cargo +nightly` / `cargo +stable` select which runs. Scripts should use explicit `+channel` or toolchain files rather than assuming the user’s default.

### 7. Offline and air-gapped installs

Air-gapped networks need a mirrored rustup dist server or vendored toolchain tarballs plus vendored crates (`cargo vendor`). Plan this before mandating Rust on locked-down build fleets.

---

## 3. Applications and use cases

### Software engineering

- Commit a **toolchain pin** for applications; document MSRV for libraries.
- Make **`cargo fmt --check`** and **`cargo clippy`** mandatory in CI on the same toolchain as tests.
- Prefer **stable** for anything that ships; quarantine nightly experiments.

### Security

- Install rustup and toolchains from **official** channels or your org’s verified mirror—treat compiler bootstrap like any other supply chain.
- Keep toolchains **patched** on a cadence; rustc itself is software with CVEs occasionally.
- Do not run untrusted build scripts with ambient cloud credentials (build.rs and proc macros execute code at compile time—policy later in security chapters).

### Reliability and reproducibility

- Log `rustc -vV` and `cargo -vV` on every CI job.
- Rebuild release artifacts on pinned builders; do not “release from a laptop” with a floating default.
- When debugging “compiles here but not there,” compare **edition**, **toolchain version**, **target triple**, and **feature flags** before blaming logic.

### DevOps and platform

- Bake rustup + pinned toolchain + components into **CI images**; cache `~/.cargo` registries and `target/` carefully (key on lockfile + toolchain).
- Separate **build** images (heavy, with compilers) from **runtime** images (scratch/distroless + binary) for containers.
- Cross-compile only after installing targets: `rustup target add <triple>`.

### Staff-level review checklist

- Production and CI name the same **channel/version** (or enforce via toolchain file).
- **Clippy** and **rustfmt** components are installed and gated—not “optional locally.”
- Crates declare **`edition`** explicitly; mixed editions in a workspace are understood, not accidental.
- Library MSRV (if any) is documented and tested; application pins are documented.
- Nightly/`feature` usage is inventoried or forbidden.
- Install path for Linux/macOS/Windows (or “Linux CI only”) is written for new hires.
- Linker/build-essential (or MSVC Build Tools) prerequisites are listed—Rust is not only `rustup` on bare OS images.

---

## References

- [Install Rust](https://www.rust-lang.org/tools/install)
- [rustup documentation](https://rust-lang.github.io/rustup/)
- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [rustc Book](https://doc.rust-lang.org/stable/rustc/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [Rust Release Notes / blog](https://blog.rust-lang.org/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
