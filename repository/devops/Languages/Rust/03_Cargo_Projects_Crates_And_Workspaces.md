# Cargo projects, crates, and workspaces

[← Back to Rust](./README.md)

## What this chapter covers

How Rust code is organized for building and publishing: **packages** versus **crates**, binary versus library layouts, what lives in **`Cargo.toml`** and **`Cargo.lock`**, how **crates.io** and features fit dependency management, how **workspaces** scale multi-crate repos, and the core **`cargo build` / `test` / `run` / `doc`** loop you will use in local development and CI.

---

## 1. Concepts

### 1. Package versus crate

In Cargo’s vocabulary:

- A **package** is a unit Cargo manages: a directory with a **`Cargo.toml`** (and usually source files). A package has a name and version.
- A **crate** is a compilation unit rustc builds—either a **library crate** or a **binary crate** (or extras like integration tests and examples, which are also crates from the compiler’s point of view).

One package can contain **one library crate** (optional) and **any number of binary crates**. The common starter package from `cargo new` is a single binary crate. `cargo new --lib` creates a library package.

| Term | Rough meaning |
|------|----------------|
| **Package** | Cargo project: `Cargo.toml` + sources |
| **Crate** | What rustc compiles (lib, bin, …) |
| **Module** | Namespace inside a crate (`mod`, `use`) — deeper in a later chapter |

### 2. Creating projects: `cargo new` and `cargo init`

```bash
cargo new hello_cli          # new directory, binary package by default
cargo new greeter --lib      # library package
cargo init                   # add Cargo.toml to current directory
cargo init --lib
```

`cargo new` initializes a git repo by default (disable with `--vcs none` when nested inside another repo). The generated layout for a binary looks like:

```text
hello_cli/
  Cargo.toml
  src/
    main.rs
```

A library package uses `src/lib.rs` instead of (or in addition to) `src/main.rs`. A package with both exposes a library API and ships one or more binaries that depend on that library—common for CLI tools with reusable core logic.

### 3. Binary versus library

| Kind | Root file (conventional) | Role |
|------|--------------------------|------|
| **Binary** | `src/main.rs` or `src/bin/name.rs` | Produces an executable |
| **Library** | `src/lib.rs` | Produces an `rlib` (and optionally cdylib/staticlib for FFI) |

Binaries have a **`fn main()`** entrypoint. Libraries export items for other crates to use. Integration tests, benchmarks, and examples are additional crates Cargo knows how to build when you invoke the right subcommands.

### 4. Cargo.toml essentials

`Cargo.toml` is the manifest. Core sections:

```toml
[package]
name = "hello_cli"
version = "0.1.0"
edition = "2024"

[dependencies]
serde = { version = "1", features = ["derive"] }

[dev-dependencies]
# test-only / example-only deps

[build-dependencies]
# for build.rs

[features]
default = []
full = ["serde"]
```

- **`[package]`** — name, version, edition, license, MSRV-related metadata, etc.
- **`[dependencies]`** — crates linked into lib/bin normal builds.
- **`[dev-dependencies]`** — available to tests/examples/benches, not to dependents of your library.
- **`[features]`** — optional functionality and optional dependencies; dependents opt in.

Version requirements follow Cargo’s semver rules (`"1"` means compatible with 1.x under Cargo’s interpretation). Prefer caret-compatible ranges intentionally; avoid overly wild ranges in applications you release.

### 5. Cargo.lock

**`Cargo.lock`** records the **exact** versions (and checksums) of the dependency graph Cargo resolved.

| Project type | Lockfile practice |
|--------------|-------------------|
| **Binary / application** | Commit `Cargo.lock` — reproducible deploys and CI |
| **Library** | Often omit from git (dependents resolve), unless you have a strong reason; still generate locally for testing |

`cargo build` updates the lockfile when the manifest allows newer compatible versions. **`cargo update`** refreshes within constraints. CI should fail on unexpected lockfile drift if your policy is “review every dep bump.”

### 6. crates.io and other registries

**crates.io** is the default public registry. Dependencies named in `Cargo.toml` resolve there unless you configure another registry or a git/path source:

```toml
[dependencies]
serde = "1"
my_internal = { path = "../my_internal" }
other = { git = "https://github.com/example/other.git", tag = "v1.2.3" }
```

Path and git dependencies are common inside companies and during development. Publishing to crates.io requires accounts, naming rules, and a deliberate public API—treat publish as a product release.

### 7. Features

**Features** are Cargo’s compile-time flags for optional code and optional dependencies. They enable:

- Slimmer default builds (fewer deps, smaller binaries).
- Optional integrations (`vendored-openssl`, `tokio` features, serde derives, …).
- Workspace-wide consistency when every crate agrees on feature names.

Failure mode: **feature unification** — Cargo unifies features for a crate compiled once in a graph, so enabling a feature in one binary can turn it on for everyone using that version. Design features to be additive; document defaults; test with `--no-default-features` / `--all-features` when you maintain a library.

### 8. Optional dependencies

An optional dependency is declared with `optional = true`. Cargo does **not** compile it into dependents until a **feature** enables it—usually by naming the dependency as a feature value (Cargo treats that as “enable this optional dep”):

```toml
[dependencies]
serde = { version = "1", optional = true }

[features]
default = []
serde = ["dep:serde"]   # modern explicit form; older manifests used serde = ["serde"]
```

Team rules of thumb:

- Keep **default** features minimal for libraries; put heavy or niche deps behind named features.
- Name features after the capability (`json`, `tls`), not only after the crate, when several crates collaborate behind one flag.
- Document which features production binaries enable; CI should exercise the feature matrix you claim to support (`--no-default-features`, key combinations, `--all-features` for libraries).
- Remember unification: one workspace binary enabling `serde` can pull that feature into every crate that shares the same `serde` package node.

Optional deps are how mature crates stay lean for embedded or CLI-default builds without forking the repo.

### 9. Workspaces

A **workspace** is a set of packages sharing a **`Cargo.lock`** and output directory, declared in a root `Cargo.toml`:

```toml
[workspace]
members = ["crates/core", "crates/cli", "crates/agent"]
resolver = "2"
```

Benefits: one lockfile, unified dependency versions, `cargo test --workspace`, shared `target/` (with caching nuances), and clearer boundaries than one giant crate. Costs: need discipline about which crates depend on which; avoid accidental cyclic design.

Virtual workspaces (root has no `[package]`, only `[workspace]`) are common in monorepos.

### 10. `[workspace.dependencies]` and inheritance

Workspaces scale poorly when every member repeats the same `serde = "1"` line with slightly different versions. **`[workspace.dependencies]`** declares shared dependency specs once at the root; members **inherit** them:

```toml
# root Cargo.toml
[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
anyhow = "1"

# member Cargo.toml
[dependencies]
serde = { workspace = true }
anyhow = { workspace = true }
```

`dependency.workspace = true` (equivalently `serde = { workspace = true }`) pulls version, default features, and other fields from the workspace table. Members can still override or add features locally when needed, but the **version pin** stays centralized—fewer “why does CI resolve differently in crate B?” incidents.

Staff practice: put the dependency set the monorepo actually standardizes on in `[workspace.dependencies]`; leave truly crate-specific deps local. Combine with a single `Cargo.lock` so inheritance and resolution tell one story.

### 11. Everyday cargo commands

| Command | Purpose |
|---------|---------|
| `cargo build` | Compile debug profile (default) |
| `cargo build --release` | Optimized release profile |
| `cargo run` | Build and run the default binary |
| `cargo test` | Run unit/integration/doc tests |
| `cargo doc --open` | Generate API docs for the package and deps |
| `cargo check` | Typecheck without full codegen (faster feedback) |
| `cargo tree` | Show dependency graph |
| `cargo clean` | Remove `target/` artifacts |

```bash
cargo build
cargo test
cargo run -- --help
cargo doc --no-deps
```

Profiles (`dev`, `release`, custom) live under `[profile.*]` in manifests or workspace config—trade compile time for runtime speed and binary size.

---

## 2. Advanced concepts

### 1. Targets beyond lib/bin

Cargo also builds **examples** (`examples/`), **tests** (`tests/`), and **benches** (`benches/`) as separate crates. `[[bin]]` sections customize binary names and paths when conventions are not enough. Integration tests link your library as an external crate—useful for public API tests.

### 2. build.rs in depth

A **build script** is a separate Rust binary Cargo compiles and runs **on the build host** before compiling the package’s lib/bin. It is not your target’s `main`; cross-compiling still executes `build.rs` with the host toolchain unless you carefully arrange otherwise. Treat it as privileged CI code: it can read the filesystem, run tools, and—if misconfigured—touch the network.

**When teams use it:** compile C/C++/asm via `cc`, generate protobuf/FlatBuffers bindings, emit platform `cfg` flags after probing, embed version metadata, or locate system libraries. Prefer existing crates (`cc`, `bindgen` with policy, `prost-build`, etc.) over one-off shell-outs.

**`cargo:` instructions** are how the script talks back to Cargo (printed to stdout). Common patterns:

| Instruction | Role |
|-------------|------|
| `cargo:rerun-if-changed=PATH` | Rebuild the script’s outputs only when `PATH` changes (files or dirs you care about) |
| `cargo:rerun-if-env-changed=VAR` | Rerun when an env var changes |
| `cargo:rustc-cfg=…` | Enable custom `cfg` for the package |
| `cargo:rustc-link-lib=…` / `cargo:rustc-link-search=…` | Native link flags |
| `cargo:warning=…` | Surface warnings in build output |

Without precise `rerun-if-*` lines, Cargo may rerun the script too often (slow CI) or too rarely (stale generated code). Review new `build.rs` for: host vs target confusion, undocumented env requirements, and whether a **feature flag** would have avoided the script.

### 3. Resolver versions (1 / 2 / 3) and edition defaults

Cargo’s **resolver** builds the dependency graph and decides feature unification. Set it once for the whole workspace (top-level package or `[workspace]` in a virtual manifest); values on path/registry dependencies are ignored.

| Resolver | Typical default | What staff should remember |
|----------|-----------------|----------------------------|
| **`"1"`** | Pre-2021 / explicit legacy | Broad **feature unification**: enabling a feature anywhere can turn it on for that package everywhere it appears in the graph |
| **`"2"`** | **`edition = "2021"`** default | Narrower unification (build-deps / dev-deps / targets less likely to leak features into normal deps)—fewer “why is `serde` suddenly on?” surprises |
| **`"3"`** | **`edition = "2024"`** default (top-level) | Same feature story as 2, plus **rust-version-aware** selection: prefer dependency versions compatible with your MSRV/`rust-version` story (`incompatible-rust-versions` default becomes `fallback`) |

**Feature unification intuition:** when two crates depend on the same version of `foo`, Cargo builds **one** `foo` and unions the features requested. Design library features to be **additive**; test libraries with `--no-default-features` and important combinations. Virtual workspaces must set `resolver` explicitly—there is no root `edition` to infer `"2"` or `"3"` from.

### 4. Patch, replace, and `[patch.crates-io]`

`[patch]` lets you override a crates.io dependency with a path or git fork temporarily—useful for bisecting and hotfixing. Do not leave untracked patches in production lockfiles without process; they complicate supply-chain review.

### 5. Publishing, yanking, and registry permanence

`cargo publish` uploads a **specific version** of a package to the registry (crates.io or an alternate). Treat it as a release: clean tree, tests green, docs and license metadata correct, API reviewed for semver. Yanking (`cargo yank`) marks a version as **undesirable for new resolves** without deleting the artifact—existing `Cargo.lock` files may keep using it. You cannot truly erase a published version from the ecosystem’s caches and mirrors.

Staff habits: prefer **yank + publish a fixed version** over hoping consumers will notice a yanked-only story; never reuse a version number; document breaking changes in release notes; for private registries, still treat yanked versions as “still fetchable if locked.” Dry-run with `cargo publish --dry-run` before the real upload when the package is new or the API surface moved.

### 6. Workspaces versus single crate

| Signal | Prefer |
|--------|--------|
| One binary, small team | Single package |
| Shared library + CLI + agent | Workspace |
| Different release cadences / ownership | Separate repos or carefully versioned crates |
| Circular “utils depend on app” | Redesign boundaries; workspaces do not fix cycles |

### 7. Lockfile and CI drift

`cargo update` in one PR can churn dozens of transitive crates. Policy options: dependabot-style bots with review, Renovate, or scheduled update PRs; require `cargo deny` / audit in CI for licenses and advisories (covered in security chapters).

### 8. Edition field is per package

Each workspace member has its own `edition`. Migrating the workspace is a per-crate effort. The workspace root does not force one edition on all members unless you set each manifest.

### 9. Procedural macro crates (consuming side)

A **procedural macro** crate is a library compiled for the **host** that runs at compile time to transform tokens (`#[derive(…)]`, attribute macros, function-like macros). In the manifest:

```toml
[lib]
proc-macro = true
```

**Consumers** depend on it like any other crate and invoke the macros in source; they do not link the proc-macro crate into the runtime binary the way a normal `rlib` dependency is linked. Implications for teams:

- Proc-macro dependencies add **compile-time** cost and supply-chain surface (code execution during build)—review them with the same seriousness as `build.rs`.
- The macro crate’s own dependencies are build-host concerns; version conflicts there fail the build, not your process at runtime.
- Prefer well-known derive ecosystems (`serde`, `thiserror`, …) over bespoke macros unless the abstraction clearly pays for the complexity.
- Debugging expands to `cargo expand` (external tool) or reading the macro crate’s docs—call sites stay small by design.

Deeper authoring of proc macros is out of scope here; staff should know they are a distinct crate type with host execution semantics.

### 10. `[workspace.lints]` and package lint inheritance

Cargo can store lint policy in the manifest instead of scattering `#![deny(…)]` / `#![warn(…)]` only in crate roots. A package-level table looks like:

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
enum_glob_use = "deny"
```

In a workspace, put shared policy under **`[workspace.lints]`** (and nested tool tables such as `workspace.lints.rust`) and let members inherit with:

```toml
[lints]
workspace = true
```

Inheritance keeps Clippy and rustc levels consistent across crates; members can still override individual lints when a crate legitimately needs a different bar. Lints configured this way apply to the **current package** under development—not as a hammer on all registry dependencies (Cargo caps dependency lints). Prefer manifest lints for team defaults; keep rare, local exceptions documented in review.

### 11. `cargo tree` for dependency graphs

`cargo tree` prints the resolved graph: who pulled which crate, at which version, and often **why features** appear. Use it when a lockfile churns, when duplicate major versions of the same crate show up, or when binary size / compile time jumps after a dependency bump.

```bash
cargo tree
cargo tree -i serde          # invert: what depends on this crate
cargo tree -e features       # feature edges (when diagnosing unification)
cargo tree --duplicates      # same package name at multiple versions
```

Staff practice: attach a `cargo tree` (or `--duplicates`) excerpt to PRs that add heavy deps or change workspace resolver/edition. Pair with `cargo metadata` for machine-readable audits when tooling needs JSON.

### 12. Semver intuition for published Rust crates

Cargo and crates.io assume **SemVer**. Rough API intuition for **libraries**:

| Change | Usual bump |
|--------|------------|
| Break existing downstream code (remove/rename public item, tighten a public type, change a trait’s required methods without a default) | **major** (`1.x` → `2.0`) |
| Add API in a compatible way (new functions, new optional fields behind builders, new trait defaults) | **minor** |
| Bugfix / docs / non-API internals with no public contract change | **patch** |

Rust-specific traps: **adding a public enum variant** is a **breaking** change for downstream exhaustive `match`es—unless the enum is **`#[non_exhaustive]`** (downstream must use `_`). Adding a public struct field is likewise breaking for literal construction outside the crate unless the struct is `non_exhaustive` or construction stays behind constructors. Changing the type of a public field, making a safe function `unsafe`, or removing a feature flag that dependents relied on are major. Applications that are never published can still use SemVer for release tags; the hard ecosystem rules apply once others depend on your crate versions.

---

## 3. Applications and use cases

### Software engineering

- Split **library core** and **CLI binary** early so tests can target logic without process argv noise.
- Use workspaces when two teams share types but ship different artifacts (agent vs ctl binary).
- Keep feature flags **documented** in README; default features should be safe and minimal for libraries.

### Security and supply chain

- Prefer **versioned crates.io** (or internal registry) over floating git `main` in production apps.
- Commit application **lockfiles**; verify checksums in CI; review sudden authorship or maintainer changes on critical deps.
- Treat **build.rs** and **proc-macro** crates as code execution at build time—limit network and credentials on builders.

### Reliability

- `cargo test` in CI for every PR; add `--workspace` for multi-crate repos.
- Release builds use `--release` (or a custom profile) consistently between staging and production artifacts.
- Document required features for the binary you actually ship (`cargo build -p agent --features foo`).

### DevOps and operations

- Cache Cargo registry and git db; key caches on lockfile hash + toolchain version.
- Produce artifacts with explicit package `-p` in workspaces so the right binary is released.
- Generate `cargo doc` for internal libraries and publish to your doc portal when APIs are shared.

### Staff-level review checklist

- Package/crate/binary/library terminology is used correctly in design docs—no “crate” meaning three different things.
- Applications commit **`Cargo.lock`**; CI builds with `--locked` (or equivalent) so resolves cannot float silently.
- Workspace **members** and dependency direction are acyclic and documented.
- **Features** enabled in production are listed; accidental `--all-features` in release is intentional or forbidden.
- No unexplained **git/path** deps in release tags; `[patch]` is temporary and tracked.
- `cargo test` and docs build are green on the pinned toolchain; `cargo tree` reviewed for duplicate or unexpected crates on major changes.

---

## References

- [The Cargo Book](https://doc.rust-lang.org/stable/cargo/)
- [Cargo.toml reference](https://doc.rust-lang.org/stable/cargo/reference/manifest.html)
- [Workspaces](https://doc.rust-lang.org/stable/cargo/reference/workspaces.html)
- [Workspace dependencies](https://doc.rust-lang.org/stable/cargo/reference/workspaces.html#the-dependencies-table)
- [Features](https://doc.rust-lang.org/stable/cargo/reference/features.html)
- [Optional dependencies](https://doc.rust-lang.org/stable/cargo/reference/features.html#optional-dependencies)
- [Build scripts](https://doc.rust-lang.org/stable/cargo/reference/build-scripts.html)
- [Procedural macros (Reference)](https://doc.rust-lang.org/stable/reference/procedural-macros.html)
- [The Rust Programming Language — Macros](https://doc.rust-lang.org/stable/book/ch20-05-macros.html)
- [crates.io](https://crates.io/)
- [The Rust Programming Language — Hello, Cargo!](https://doc.rust-lang.org/stable/book/ch01-03-hello-cargo.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Edition Guide — Cargo: Rust-version aware resolver](https://doc.rust-lang.org/edition-guide/rust-2024/cargo-resolver.html)
- [The Cargo Book — Dependency Resolution](https://doc.rust-lang.org/cargo/reference/resolver.html)
- [The Cargo Book — SemVer Compatibility](https://doc.rust-lang.org/cargo/reference/semver.html)
- [The Cargo Book — Specifying Lints](https://doc.rust-lang.org/cargo/reference/manifest.html#the-lints-section)
- [The Cargo Book — Workspaces (lints table)](https://doc.rust-lang.org/cargo/reference/workspaces.html#the-lints-table)
- [cargo tree](https://doc.rust-lang.org/cargo/commands/cargo-tree.html)
- [cargo publish](https://doc.rust-lang.org/cargo/commands/cargo-publish.html)
- [cargo yank](https://doc.rust-lang.org/cargo/commands/cargo-yank.html)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
