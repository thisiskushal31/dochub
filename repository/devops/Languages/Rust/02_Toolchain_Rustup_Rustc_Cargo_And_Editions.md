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

Declare it in `Cargo.toml` with the official **`package.rust-version`** field (for example `rust-version = "1.85"`). Cargo uses that value for diagnostics (error when the active toolchain is older), as a signal to tools such as Clippy’s MSRV-aware lints, and as input to dependency selection aids—not as a rustup pin. MSRV is a **policy**, enforced in practice with CI matrix jobs on that older stable. Bump it deliberately when you need APIs from newer rustc.

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

A repo-local **`rust-toolchain.toml`** (or legacy `rust-toolchain`) selects the toolchain when you work in that directory. rustup also honors `+channel` on the CLI, `RUSTUP_TOOLCHAIN`, and `rustup override`; proximity and precedence are documented in the rustup book. Failure mode: CI uses an image-default stable while developers silently use a toolchain file—or the reverse. Print `rustc -vV` in CI logs.

Concrete pin (channel + components you gate in CI):

```toml
# rust-toolchain.toml at repo root
[toolchain]
channel = "1.85.0"
components = ["clippy", "rustfmt"]
# targets = ["aarch64-unknown-linux-gnu"]  # optional: preinstall cross std
profile = "minimal"
```

Commit this file for applications so clones and CI install the same compiler and lint/format components. Pair it with a committed `Cargo.lock` for release binaries.

### 2. `package.rust-version` (MSRV) versus the toolchain file

These answer different questions:

| Mechanism | What it does | Typical owner |
|-----------|--------------|---------------|
| **`rust-toolchain.toml`** | Pins which toolchain rustup activates for **builds** in this repo (channel/version, components, optional targets) | Apps, services, internal binaries |
| **`package.rust-version`** | **Advertises** the oldest rustc the package claims to support; Cargo errors if the active toolchain is older (unless `--ignore-rust-version`) | Libraries; also apps that want an explicit floor |

An application may pin `channel = "1.85.0"` for reproducible CI while a library in the same org advertises `rust-version = "1.80"` so external consumers on older stables still compile. Do not treat the toolchain file as a substitute for documenting MSRV, or `rust-version` as a substitute for pinning builders.

### 3. Nightly features and stability

Nightly can enable **unstable language features** via `#![feature(...)]`. Those features can change or vanish before stabilization. **Never** let production application code depend on nightly features without an explicit risk acceptance. Some tools historically needed nightly; prefer stable alternatives when they exist.

### 4. Beta as a rehearsal

Running CI on **beta** weekly catches breakage before the six-week stable promotion. Low cost for libraries; high value for widely depended crates.

### 5. Edition migration runbook

Follow the Edition Guide’s transition workflow; treat migration as a deliberate PR series, not a drive-by in a CVE patch.

**Prepare**

1. Ensure CI and local use a current **stable** that supports the target edition.
2. Commit a clean tree; prefer a dedicated branch.
3. Run `cargo update` (or a narrower update) so proc-macros and build-time code generators are less likely to break on the new edition—then re-test.
4. In a workspace, decide **per crate**: each member has its own `edition` field; migrate one package (or a small batch) at a time with `cargo fix --edition -p <crate>`.

**Migrate a crate**

```bash
cargo fix --edition                 # or: cargo fix --edition -p my_crate
# Manually fix anything cargo fix reports it cannot rewrite
# Then set edition in that crate's Cargo.toml, e.g. edition = "2024"
cargo test -p my_crate
cargo clippy -p my_crate --all-targets -- -D warnings   # if the repo denies warnings
cargo fmt
```

Official order of ideas: prepare dependencies → `cargo fix --edition` → set `edition` in `Cargo.toml` → verify with build/test → reformat. `cargo fix` cannot always rewrite everything (doctests, some macros, generated code); finish those by hand using the Edition Guide chapter for that edition.

**After migration**

- Run **Clippy** on the migrated crate(s) under the pinned toolchain; edition changes often surface idioms Clippy already knows how to flag.
- Re-run the full workspace CI matrix (fmt, Clippy, tests, any MSRV job).
- Keep mixed editions in a workspace only when intentional—document which members lag.

Superseded patterns you will still see in old trees: **`try!`** (use `?`), 2015-style **`extern crate`** for ordinary deps, anonymous trait parameters cleaned up by edition migrations. Legacy editions remain valid on modern rustc; migrate for newer defaults, not because the compiler abandoned the crate.

### 6. Components out of sync

If Clippy fails with “toolchain doesn’t match,” the Clippy component was not installed for the active toolchain. `rustup component add clippy` **for that toolchain** (`rustup component add clippy --toolchain nightly` when using nightly). Listing components in `rust-toolchain.toml` avoids this class of drift.

### 7. Multiple toolchains on one machine

Developers often keep stable + nightly. PATH order and `cargo +nightly` / `cargo +stable` select which runs. Scripts should use explicit `+channel` or toolchain files rather than assuming the user’s default.

### 8. Offline and air-gapped installs

Air-gapped networks need a mirrored rustup dist server or vendored toolchain tarballs plus vendored crates (`cargo vendor`). Plan this before mandating Rust on locked-down build fleets.

### 9. Edition 2024 staff notes

**Edition 2024** is a real, stable edition (shipped with the Rust **1.85** release train). Older editions (**2015**, **2018**, **2021**) still compile on modern rustc; migrating is opt-in per crate. Treat the Edition Guide’s Rust 2024 chapters as the source of truth for exact migration lints and edge cases—this subsection is a staff orientation, not a substitute for that guide.

**Cargo resolver 3 (top-level only).** Setting `edition = "2024"` on the **top-level** package implies **`resolver = "3"`**. Resolver 3 turns on **rust-version-aware** dependency selection by default (prefer dependency versions whose advertised `package.rust-version` is compatible, with a fallback when no compatible version exists). The resolver is a **workspace-global** setting: member crates’ editions do not each pick a resolver, and dependency crates’ resolver fields are ignored. **Virtual workspaces** have no root package edition to infer from—set `resolver = "3"` explicitly under `[workspace]` if you want the new behavior. Expect lockfile churn when first enabling it; re-run tests and review `cargo tree` before merging.

**`unsafe extern` blocks.** In Edition 2024, `extern "C" { … }` (and other ABI blocks) must be written **`unsafe extern "C" { … }`**. That marks the *author’s* responsibility for correct signatures and linking; individual items may still be marked `safe` or `unsafe` for callers. Automatic migration adds the keyword; it does **not** prove the FFI surface is sound—review signatures in the same PR.

**Unsafe attributes.** Attributes that affect global symbol identity and linking—**`no_mangle`**, **`export_name`**, **`link_section`**—must use the **`#[unsafe(…)]`** form in Edition 2024 (for example `#[unsafe(no_mangle)]`). The point is reviewability: colliding or wrongly exported symbols can cause UB across the process. Migration rewrites syntax; humans still verify uniqueness and intent.

**`unsafe_op_in_unsafe_fn` warns by default.** Inside an `unsafe fn`, calling other unsafe operations without an inner `unsafe { … }` block now warns under Edition 2024 defaults. The outer `unsafe fn` means “caller must uphold a contract”; the inner block means “this line is the unchecked operation.” Prefer nesting explicit blocks (or allowing the lint only with documented rationale).

**Temporary scopes (`if let` and tail expressions).** Edition 2024 **narrows** some temporary lifetimes: temporaries in an `if let` scrutinee are dropped before entering `else` (not after the whole `if let`), and temporaries in **block/function tail expressions** may drop earlier relative to locals than in 2021. Borrow-checker errors and drop-order surprises (locks, guards, `RefCell` borrows) can appear or disappear after migration. Awareness for reviewers: a clean `cargo fix --edition` is not the end—run tests and skim lints such as those in the `rust-2024-compatibility` group for drop-order notes.

**Migration still requires tests.** Staff path is unchanged in shape: current stable toolchain → `cargo fix --edition` (per package in a workspace) → set `edition = "2024"` → **`cargo test`** / Clippy / fmt → fix what automation cannot (macros, doctests, intentional drop timing). Mixed editions in one workspace remain valid; document which members lag.

**Staff review bullets for a 2024 bump**

- Top-level / virtual workspace **`resolver`** story understood (implicit `"3"` vs explicit `[workspace] resolver = "3"`).
- Lockfile diff reviewed for MSRV-driven version moves; CI matrix still covers declared `rust-version` if you support one.
- FFI and symbol attributes reviewed after mechanical `unsafe` keyword / `#[unsafe(…)]` rewrites.
- `unsafe fn` bodies use inner `unsafe` blocks (or an explicit lint allow with reason).
- Borrow/drop-sensitive tests run; any `if let` → `match` rewrites from migration are checked for *intended* temporary extent.
- Edition Guide Rust 2024 index consulted for items not listed here (there are additional 2024 changes beyond this staff shortlist).

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
- **`rust-toolchain.toml`** (when used) lists the **components** CI expects (Clippy, rustfmt at minimum).
- **Clippy** and **rustfmt** components are installed and gated—not “optional locally.”
- Crates declare **`edition`** explicitly; mixed editions in a workspace are understood, not accidental.
- Edition bumps follow the Edition Guide runbook (`cargo fix --edition`, per-crate in workspaces, Clippy after).
- Library **`package.rust-version`** / MSRV (if any) is documented and tested; application **build pins** are documented separately.
- Nightly/`feature` usage is inventoried or forbidden.
- Install path for Linux/macOS/Windows (or “Linux CI only”) is written for new hires.
- Linker/build-essential (or MSVC Build Tools) prerequisites are listed—Rust is not only `rustup` on bare OS images.

---

## References

- [Install Rust](https://www.rust-lang.org/tools/install)
- [rustup book — Overrides / toolchain files](https://rust-lang.github.io/rustup/overrides.html)
- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [The Cargo Book — rust-version](https://doc.rust-lang.org/cargo/reference/rust-version.html)
- [The Cargo Book — cargo fix](https://doc.rust-lang.org/cargo/commands/cargo-fix.html)
- [rustc Book](https://doc.rust-lang.org/stable/rustc/)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Edition Guide — Transitioning an existing project](https://doc.rust-lang.org/edition-guide/editions/transitioning-an-existing-project-to-a-new-edition.html)
- [Edition Guide — Rust 2024](https://doc.rust-lang.org/edition-guide/rust-2024/index.html)
- [Edition Guide — Cargo: Rust-version aware resolver](https://doc.rust-lang.org/edition-guide/rust-2024/cargo-resolver.html)
- [Edition Guide — Unsafe extern blocks](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-extern.html)
- [Edition Guide — Unsafe attributes](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-attributes.html)
- [Edition Guide — unsafe_op_in_unsafe_fn warning](https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-op-in-unsafe-fn.html)
- [Edition Guide — if let temporary scope](https://doc.rust-lang.org/edition-guide/rust-2024/temporary-if-let-scope.html)
- [Edition Guide — Tail expression temporary scope](https://doc.rust-lang.org/edition-guide/rust-2024/temporary-tail-expr-scope.html)
- [The Cargo Book — Dependency Resolution](https://doc.rust-lang.org/cargo/reference/resolver.html)
- [The Rust Programming Language (the Book)](https://doc.rust-lang.org/stable/book/)
- [Rust Release Notes / blog](https://blog.rust-lang.org/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
