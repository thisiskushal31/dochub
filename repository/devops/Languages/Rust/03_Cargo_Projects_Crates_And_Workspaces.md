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

### 8. Workspaces

A **workspace** is a set of packages sharing a **`Cargo.lock`** and output directory, declared in a root `Cargo.toml`:

```toml
[workspace]
members = ["crates/core", "crates/cli", "crates/agent"]
resolver = "2"
```

Benefits: one lockfile, unified dependency versions, `cargo test --workspace`, shared `target/` (with caching nuances), and clearer boundaries than one giant crate. Costs: need discipline about which crates depend on which; avoid accidental cyclic design.

Virtual workspaces (root has no `[package]`, only `[workspace]`) are common in monorepos.

### 9. Everyday cargo commands

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

### 2. build.rs

A **build script** (`build.rs`) runs at compile time to probe the system, generate code, or emit `cargo:` instructions. Powerful and dangerous: it executes on developer and CI machines with the builder’s privileges. Prefer declarative feature flags and existing crates over custom build scripts when possible; review build.rs like production code.

### 3. Resolver versions

`resolver = "2"` (default for edition 2021+ packages) improves feature unification behavior versus the older resolver. Workspaces should set the resolver explicitly at the workspace root when mixing older packages. Surprising “why is this feature on?” bugs often trace to unification + old resolver assumptions.

### 4. Patch, replace, and `[patch.crates-io]`

`[patch]` lets you override a crates.io dependency with a path or git fork temporarily—useful for bisecting and hotfixing. Do not leave untracked patches in production lockfiles without process; they complicate supply-chain review.

### 5. Publishing and yanking

`cargo publish` uploads a package version to the registry. **Yank** marks a version as undesireable for new resolves without deleting it (existing lockfiles may still use it). Semver mistakes on crates.io are forever in spirit—yank and publish a fix; you cannot truly erase a yanked-but-cached artifact from the ecosystem.

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
- [Features](https://doc.rust-lang.org/stable/cargo/reference/features.html)
- [crates.io](https://crates.io/)
- [The Rust Programming Language — Hello, Cargo!](https://doc.rust-lang.org/stable/book/ch01-03-hello-cargo.html)
- [Edition Guide](https://doc.rust-lang.org/edition-guide/)
- [Rust Documentation hub](https://doc.rust-lang.org/stable/)
