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

### 3. `panic = "abort"` versus unwind

Under `[profile.release]` (Cargo profiles):

| Strategy | Behavior | Why teams choose it |
|----------|----------|---------------------|
| **`"unwind"`** (default on most targets) | Unwind the stack; run `Drop` destructors along the way | Prefer when you need cleanup on panic, catch_unwind-style boundaries, or libraries that assume unwind |
| **`"abort"`** | Terminate the process on panic | Smaller binaries (less unwind machinery), simpler FFI story when C/other languages must not see Rust unwinding across the ABI, and a hard “panic = process death” ops model |

```toml
[profile.release]
panic = "abort"
```

Staff notes:

- Tests, benchmarks, build scripts, and proc-macros **ignore** the profile `panic` setting and still need unwind for the test harness (Cargo documents this explicitly).
- Abort is a **product policy**, not a free lunch—you trade away stack-unwinding `Drop` cleanup on the panic path.
- Document the choice next to strip/LTO decisions.
- For **FFI**, prefer aborting or translating panics at the boundary so foreign code never observes an undefined Rust unwind across the ABI.
- Libraries intended for embedding in larger processes are often left on unwind unless the whole artifact standardizes on abort.

### 4. Strip, debuginfo, and split-debuginfo

- **`strip`** (`"none"` / `"debuginfo"` / `"symbols"`, or bool forms) reduces what remains in the shipped binary.
- **`debug` / debuginfo** levels control how much DWARF (or equivalent) is generated—from none, through line tables useful for backtraces, up to full info.
- **`split-debuginfo`** (profile setting → rustc `-C split-debuginfo`) controls whether that info lives **in** the executable or **beside** it (platform-specific defaults; macOS often defaults differently). High-level goal: keep the public artifact small while retaining symbolication data in your release pipeline or symbol store.

Operational pattern for widely distributed CLIs: optimized release → strip symbols on the customer binary → archive split or side-car debuginfo with the release. Never ship “fully stripped, nowhere to symbolicate” without accepting longer incident MTTR.

### 5. Linker configuration in `.cargo/config.toml`

`rustup target add` installs the Rust std for a triple; it does not always provide the **system linker**. Point Cargo at a cross-linker per triple:

```toml
# .cargo/config.toml (concept — paths/names are host-specific)
[target.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"
```

Commit a documented template when the team shares one cross setup; keep machine-local overrides out of the repo if linker paths differ. Native `build.rs` / `cc` crates still need a matching C cross-toolchain. Prefer distro packages or pinned container images over ad-hoc downloaded linkers (supply chain).

### 6. Reproducible builds concerns

Bit-identical rebuilds are hard. Paths embedded in debuginfo, timestamps, mapfile order, and different linker versions all perturb hashes. Practices that help:

- Pin **rust-toolchain** / `rust-toolchain.toml` (channel and optionally components).
- Commit **`Cargo.lock`** for applications and binaries you release.
- Prefer containerized or fixed CI images for release jobs.
- Avoid baking absolute source paths into artifacts when you care about reproducibility (debug path remapping is a rustc concern—treat as advanced).

Exact byte-identical releases need an explicit project policy; “same lockfile + same toolchain” is the minimum operational bar.

### 7. WASM target size (brief)

`wasm32-*` artifacts are size-sensitive: every dependency and panic/formatting path shows up in download and cold-start cost. Prefer size-oriented `opt-level` (`"s"` / `"z"`), be deliberate about `panic` strategy, and avoid pulling OS-heavy crates into the WASM graph. Host **sandbox assumptions** and when not to use WASM at all belong with chapter 18; here the release concern is: measure `.wasm` size in CI the same way you track native binary size. Cross-ref chapter 18 for target choice and host capabilities; do not treat a green native `--release` build as proof the WASM artifact is shippable.

### 8. Tier 1 / 2 / 3 platform support

The rustc book’s **platform support** page classifies targets roughly:

| Tier | Expectation (intuition) |
|------|-------------------------|
| **Tier 1** | Built and tested extensively; expected to work. |
| **Tier 2** | Guaranteed to build; tests may be less complete. |
| **Tier 3** | Community / best-effort; may lack full std or CI. |

Staff implication: advertise only triples you **build and smoke-test**. A Tier 3 triple in a README without CI is a support lie. Check host tools vs target std availability before promising “we support X.”

### 9. Host tools versus target std

- **`rustup target add <triple>`** installs the **standard library** (and related target libs) for compiling *to* that triple—it does not install a full second compiler toolchain for every case.
- **Host tools** (rustc, cargo, clippy, rustfmt running on the build machine) come from the **host** toolchain. Cross builds still run host rustc; they emit target code and need a target linker/C toolchain as described above.
- Some components or build scripts assume they run on the host OS—do not confuse “stdlib for `aarch64-linux`” with “CI runner is aarch64.”

### 10. Incremental compilation and CI clean builds

Locally, **incremental** compilation speeds rebuilds. In CI:

- Cached `target/` with incremental artifacts can reproduce rare “ghost” errors after toolchain or flag changes—key caches on toolchain + lockfile, and document **`cargo clean`** recovery.
- **Release** and ship jobs should prefer **clean** (or reliably equivalent) builds so artifacts do not depend on stale incremental state.
- Developer laptops keep incremental on; release pipelines optimize for correctness and reproducibility over minute-level compile savings.

### 11. Faster linkers (optional local productivity)

Link time often dominates large Rust binaries. **mold**, **lld**, and similar faster linkers can be configured per target in `.cargo/config.toml` for **local** or optional CI speedups. They are **not required** for correct Rust builds—do not make an exotic linker a hard merge dependency unless the team standardizes and pins it in images. Prefer documenting an optional `[target.'cfg(…)'] linker = …` over forcing every contributor’s machine.

### 12. Legacy and edition notes

Older projects may document only host builds. Cross-compile support has been first-class for years; if a brownfield `edition = "2018"` crate fails only on cross, suspect `build.rs`, `cc` crate flags, or hard-coded host paths—not the edition itself.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Declare **supported targets** in README/CI; do not discover linker needs on release day.
- Keep release profile overrides (`panic`, `strip`, `lto`, `opt-level`) in version control next to `Cargo.toml`.
- Separate “developer laptop build” from “release artifact build” jobs.

### Security

- Cross toolchains and downloadable linkers are **supply-chain** surfaces—prefer distro packages or pinned images.
- Stripped binaries without retained debuginfo elsewhere increase **MTTR** during incidents.

### Reliability and delivery

- Smoke-test every shipped triple (at least `--help` / health endpoint / unit of work).
- Cache `target/` carefully in CI: key on lockfile + toolchain + target triple.

### Performance

- Measure before raising `opt-level` to `"z"` or enabling fat LTO—compile time and debuggability suffer.
- For size-sensitive embedded or WASM artifacts, prefer explicit size opts and verify functionality.

### Staff checklist

- [ ] Host and each release target triple are documented; **tier** expectations match CI reality.
- [ ] `rustup target add` (target std) is automated; host tools vs cross-linker/`build.rs` C toolchain needs are listed.
- [ ] `cargo build --release --target …` succeeds in a **clean** environment; incremental cache policy documented.
- [ ] Faster linkers (mold/lld), if used, are optional/pinned—not an undocumented laptop-only requirement.
- [ ] musl/static claims are verified with linkage inspection + runtime smoke test.
- [ ] Release **`panic`** strategy (`unwind` vs `abort`) is chosen and documented.
- [ ] Strip / debuginfo / split-debuginfo policy exists (what ships vs what is archived).
- [ ] Toolchain and `Cargo.lock` are pinned for release builds.
- [ ] Profile overrides (`lto`, `opt-level`, `panic`) are intentional and reviewed for CI cost.
- [ ] WASM (if shipped) has a size budget and CI check.

---

## References

- [rustup book — Cross-compilation](https://rust-lang.github.io/rustup/cross-compilation.html)
- [The Cargo Book — Configuration (`target.<triple>.linker`)](https://doc.rust-lang.org/cargo/reference/config.html)
- [The Cargo Book — Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [The rustc Book — Targets and Target Triples](https://doc.rust-lang.org/rustc/targets/index.html)
- [The rustc Book — Codegen options](https://doc.rust-lang.org/rustc/codegen-options/index.html)
- [Platform Support (tier list)](https://doc.rust-lang.org/rustc/platform-support.html)
- [rustup book — Components](https://rust-lang.github.io/rustup/concepts/components.html)
- [The Cargo Book — Incremental compilation (profiles / config context)](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [crates.io](https://crates.io/)
