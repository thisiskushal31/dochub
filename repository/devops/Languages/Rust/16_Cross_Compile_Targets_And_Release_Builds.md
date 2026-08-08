# Cross-compile, targets, and release builds

[← Back to Rust](./README.md)

## What this chapter covers

How Rust separates **host** (where you compile) from **target** (where the binary runs), how **rustup** installs target stdlib support, how **Cargo** selects profiles for release, and what operators must verify for **cross-linkers**, **static linking**, **strip/debuginfo**, and **reproducible** artifacts. After this chapter you should be able to ship a release binary for another triple without guessing linker failures.

---

## 1. Concepts

### 1. Host vs target triple

A **target triple** names architecture, vendor, OS, and ABI (for example `x86_64-unknown-linux-gnu`, `aarch64-apple-darwin`, `x86_64-pc-windows-msvc`). The **host** is the machine running `rustc`/`cargo`. The **target** is the platform the object code and final binary are built for. Same-host builds use the default host triple; cross builds set an explicit `--target`.

```bash
rustc -vV          # shows host triple
rustup show        # installed toolchains and default host
```

### 2. Installing targets with rustup

`rustup target add <triple>` downloads the **standard library** (and related components) for that triple into the active toolchain. It does **not** always install a full cross **linker** or C toolchain. Without a suitable linker, `cargo build --target …` may compile Rust crates and fail at link time.

```bash
rustup target add aarch64-unknown-linux-gnu
rustup target list --installed
```

Edition (`2018` / `2021` / `2024` in `Cargo.toml`) is independent of target: the same edition builds for any supported triple on a modern stable toolchain.

### 3. Building for a target

```bash
cargo build --target aarch64-unknown-linux-gnu
cargo build --release --target aarch64-unknown-linux-gnu
```

Artifacts land under `target/<triple>/<profile>/` (for example `target/aarch64-unknown-linux-gnu/release/`). Native host builds use `target/debug/` or `target/release/` without the triple directory segment on some layouts; prefer inspecting the path Cargo prints.

### 4. Release profile basics

`cargo build --release` (or `--profile release`) enables the **release** profile: optimizations on, debug assertions typically off, overflow checks off by default unless you re-enable them. Debug builds favor compile speed and richer panics; release builds favor runtime speed and smaller code.

Key knobs in `Cargo.toml` under `[profile.release]` (high level):

| Setting | Role |
|---------|------|
| `opt-level` | `0`–`3`, `"s"`, `"z"` — speed vs size |
| `lto` | Link-time optimization across crates (`false`, `true`/`"fat"`, `"thin"`) |
| `codegen-units` | Parallelism vs optimization quality |
| `strip` | Strip symbols from the binary |
| `debug` / `debuginfo` | Retain debug info for backtraces and profilers |

Defaults change slowly across Rust releases; pin toolchain and document profile overrides in the repo.

### 5. Why cross-compile needs more than rustup

Rust emits object code for the target; the **system linker** (or a configured cross-linker) produces the final executable and must understand the target ABI and find C libraries if any crate links C. Common patterns:

- Install `gcc`/`clang` cross packages matching the triple.
- Point Cargo at a linker via `.cargo/config.toml` (`[target.<triple>] linker = "…"`).
- Use a container or VM whose userspace matches the target for “compile inside the target environment” instead of true cross.

Native crates with `build.rs` that compile C need a **C cross-compiler**, not only `rustup target add`.

---

## 2. Advanced concepts

### 1. musl and static linking (verify, do not assume)

Targets like `x86_64-unknown-linux-musl` are often chosen for **static** or mostly-static Linux binaries that run on many distros. Reality is nuanced:

- Pure Rust with the musl target can produce a binary with few dynamic deps.
- Crates that link OpenSSL, SQLite, or other C libraries may still require those libs at build or runtime unless you deliberately configure static C linkage.
- glibc vs musl behavior differs (DNS, locales, some edge APIs).

**Staff rule:** after a musl or “static” build, **verify** with `file`, `ldd`/`readelf` (or platform equivalents), and a smoke run on a representative host. Do not claim “fully static” without that check.

### 2. LTO tradeoffs

**Thin LTO** often gives most of the win with shorter link times; **fat LTO** can improve size/speed further at the cost of long links—painful in CI matrices. Enable LTO for release artifacts you ship to users; keep day-to-day developer builds on the default profile.

### 3. Strip vs debuginfo

- **Strip** reduces binary size and removes symbols useful to reverse engineers—and to your own crash triage.
- Shipping **separate debuginfo** (or retaining `debug = 1` / line tables) lets you symbolicate production panics without leaving full DWARF in every customer binary.
- For CLIs distributed widely, prefer: optimized release + strip on the public binary + archived debuginfo in your release pipeline.

### 4. Reproducible builds concerns

Bit-identical rebuilds are hard. Paths embedded in debuginfo, timestamps, mapfile order, and different linker versions all perturb hashes. Practices that help:

- Pin **rust-toolchain** / `rust-toolchain.toml` (channel and optionally components).
- Commit **`Cargo.lock`** for applications and binaries you release.
- Prefer containerized or fixed CI images for release jobs.
- Avoid baking absolute source paths into artifacts when you care about reproducibility (debug path remapping is a rustc concern—treat as advanced).

Exact byte-identical releases need an explicit project policy; “same lockfile + same toolchain” is the minimum operational bar.

### 5. Legacy and edition notes

Older projects may document only host builds. Cross-compile support has been first-class for years; if a brownfield `edition = "2018"` crate fails only on cross, suspect `build.rs`, `cc` crate flags, or hard-coded host paths—not the edition itself.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Declare **supported targets** in README/CI; do not discover linker needs on release day.
- Keep release profile overrides in version control next to `Cargo.toml`.
- Separate “developer laptop build” from “release artifact build” jobs.

### Security

- Cross toolchains and downloadable linkers are **supply-chain** surfaces—prefer distro packages or pinned images.
- Stripped binaries without retained debuginfo elsewhere increase **MTTR** during incidents.

### Reliability and delivery

- Smoke-test every shipped triple (at least `--help` / health endpoint / unit of work).
- Cache `target/` carefully in CI: key on lockfile + toolchain + target triple.

### Performance

- Measure before raising `opt-level` to `"z"` or enabling fat LTO—compile time and debuggability suffer.
- For size-sensitive embedded or WASM-adjacent artifacts, prefer explicit size opts and verify functionality.

### Staff checklist

- [ ] Host and each release target triple are documented.
- [ ] `rustup target add` is automated in CI/bootstrap docs; linker packages are listed.
- [ ] `cargo build --release --target …` succeeds in a clean environment.
- [ ] musl/static claims are verified with linkage inspection + runtime smoke test.
- [ ] Strip/debuginfo policy exists (what ships vs what is archived).
- [ ] Toolchain and `Cargo.lock` are pinned for release builds.
- [ ] Profile overrides (`lto`, `opt-level`) are intentional and reviewed for CI cost.

---

## References

- [rustup book — Targets](https://rust-lang.github.io/rustup/cross-compilation.html)
- [The Cargo Book — Specifying a target](https://doc.rust-lang.org/cargo/reference/config.html#buildtarget)
- [The Cargo Book — Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [The rustc Book — Targets and Target Triples](https://doc.rust-lang.org/rustc/targets/index.html)
- [The rustc Book — Codegen options](https://doc.rust-lang.org/rustc/codegen-options/index.html)
- [Platform Support (tier list)](https://doc.rust-lang.org/rustc/platform-support.html)
- [crates.io](https://crates.io/)
