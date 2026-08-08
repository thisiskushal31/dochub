# Packages, modules, and visibility

[← Back to Rust](./README.md)

## What this chapter covers

How Rust code is organized for humans and the compiler: **packages**, **crates**, **modules**, **`mod` / `use` / `pub`**, filesystem layout (`src/lib.rs`, `src/main.rs`), **path visibility**, **re-exports**, and the **prelude** concept. This is the scaffolding for maintainable multi-file crates and workspace libraries before operational `std` surfaces (chapter 11).

---

## 1. Concepts

### 1. Packages and crates

- A **package** is a Cargo unit: a directory with `Cargo.toml` that produces one or more crates.
- A **crate** is a compilation unit the compiler builds—either a **library** crate, a **binary** crate, or both from one package.

A package may contain at most one library crate and any number of binary crates. `cargo new` / `cargo new --lib` set up the common defaults described in chapters 02–03.

### 2. `src/lib.rs` and `src/main.rs`

| File | Role |
|------|------|
| `src/lib.rs` | Root of the **library** crate; other modules hang off this tree |
| `src/main.rs` | Root of the default **binary** crate; may depend on the package’s library |

Idiom: put reusable logic in the library (`lib.rs` modules); keep `main.rs` thin—parse args, call library, map errors to exit codes. Integration tests and doc tests link against the library API, which reinforces that split.

Additional binaries live under `src/bin/*.rs`. Examples and tests have their own conventional directories (`examples/`, `tests/`, `benches/`).

### 3. Modules: namespaces and privacy boundaries

A **module** groups items (functions, types, submodules) and defines a **privacy boundary**. By default, items are **private** to the parent module. `pub` exposes them to parents/outsiders according to path visibility rules.

Declare a submodule inline or by file:

```rust
// in lib.rs
mod config;
pub mod net;
```

This expects `src/config.rs` (or `src/config/mod.rs`) and `src/net.rs` (or `src/net/mod.rs`). Nested modules map to nested directories.

**Edition note:** The 2018+ module system drops most `mod foo;` + `mod.rs` ceremony requirements from older layouts; both `foo.rs` and `foo/mod.rs` styles work—pick one style per crate and stay consistent. Path clarity improved with 2018’s path changes; brownfield 2015 code may look more verbose.

### 4. `use` and paths

`use` brings paths into scope:

```rust
use std::collections::HashMap;
use crate::config::Config;
use super::helpers::parse;
```

Path keywords:

- `crate::` — from the crate root
- `super::` — parent module
- `self::` — current module (rarely needed)
- External crate name — dependency root (after `extern crate` in ancient style; modern editions `use serde::Serialize` directly)

Prefer `use` at the top of the file for paths you reference often; keep deep paths inline when used once if that improves clarity.

### 5. `pub` and visibility

| Form | Meaning (simplified) |
|------|----------------------|
| (no `pub`) | Visible only inside the current module and its descendants |
| `pub` | Visible outside the module (subject to ancestor visibility) |
| `pub(crate)` | Visible anywhere inside this crate only |
| `pub(super)` | Visible to the parent module |
| `pub(in path)` | Visible within a given ancestor path |

An item is reachable from outside the crate only if **every module in its path** exposes it. Making a struct `pub` inside a private module does not export it. This is how you keep implementation modules private while re-exporting a small façade.

### 6. Re-exports

Crates often expose a stable surface from `lib.rs`:

```rust
pub use crate::config::Config;
pub use crate::error::{Error, Result};
```

Callers write `mycrate::Config` without knowing the internal file layout. Re-exports are an API design tool: rearrange modules without breaking downstream `use` paths (within semver limits).

`pub use` of dependencies (**facade / wrapping**) should be intentional—you take on API surface and semver coupling to those types.

### 7. The prelude concept

A **prelude** is a set of names brought into scope automatically or by convention.

- The **standard library prelude** imports common traits and types (for example `Option`, `Result`, `Clone`, `Vec`) so everyday code works without explicit `use`.
- Crates may define `prelude` modules (`mycrate::prelude::*`) for frameworks—convenient inside apps, aggressive inside libraries (name clashes, hidden dependencies). Prefer explicit imports in library code review standards unless you are building an application framework.

Prelude contents evolve carefully across editions/Rust releases; edition docs note shifts when they matter.

---

## 2. Advanced concepts

### 1. Binary ↔ library dependency inside one package

When both `src/main.rs` and `src/lib.rs` exist, the binary treats the library as an external crate named like the package (`use my_package::...`). Do not `mod` the same files from both roots—that duplicates types. One tree of modules under `lib.rs` is enough.

### 2. Feature flags and optional modules

Cargo features can gate modules (`#[cfg(feature = "net")]`). Keep feature-gated public APIs documented; consumers need to know which features unlock which paths. Avoid leaking `cfg`-only types into default public signatures without documentation.

### 3. Workspaces and cross-crate visibility

`pub(crate)` stops at the crate boundary—not the workspace. Sibling crates in a workspace only see each other’s **public** API. Split crates to enforce harder boundaries (for example `foo-core` vs `foo-cli`).

### 4. `include!` and non-module organization (rare)

Code generation sometimes includes files outside the module tree. Prefer normal modules; treat includes as build-system edges that need review (path hygiene, reproducibility).

### 5. Privacy vs security

Module privacy is a **maintainability and API** boundary, not a sandbox. Unsafe code or logic bugs in private modules are still in-process. Privacy helps reviewers reason about invariants; it does not stop a determined caller of unsafe or a compromised dependency.

### 6. Glob imports

`use crate::module::*` is convenient in binaries and tests; in libraries it obscures provenance. Clippy lints often discourage wildcard imports in production library modules—follow project standards.

### 7. Inline modules for tiny private helpers

`mod tests { ... }` inside a file (with `#[cfg(test)]`) keeps unit tests next to code. Inline private `mod` blocks are fine for small sealed helpers; grow into files when navigation suffers.

---

## 3. Applications and use cases

### Software engineering

- Design the **public module tree** as a product: shallow, stable names; private `internal` / `detail` modules for churn.
- Document the intended entrypoints in `lib.rs` (and crate-level docs).
- Match filesystem layout to cognitive layout—one major domain area per top-level module.

### API and semver

- Re-export only what callers should depend on.
- Changing a type from re-exported path A to B is breaking if you drop the old `pub use`.
- `pub(crate)` helpers freely; promote to `pub` only with docs and tests.

### Large codebases and workspaces

- Split crates when compile times or ownership boundaries demand it; use a workspace (chapter 03).
- Integration tests in `tests/` exercise the public crate surface—the same surface external users see.

### Delivery and ops tooling

- CLI packages: `lib.rs` for logic + tests; `main.rs` / `src/bin` for entrypoints; features for optional backends.
- Avoid circular crate dependencies in workspaces—extract a small shared crate instead.

### Reliability and reviewability

- Private modules plus public constructors preserve invariants (ports in range, non-empty IDs).
- Review `pub` diffs carefully in PRs—visibility expansion is an API change even without logic changes.

### Staff-level review checklist

- `main` is thin; logic lives in the library crate when the package has both.
- Module tree matches privacy intent; no accidental `pub` on internal helpers.
- `pub(crate)` used for crate-wide internals instead of making them world-public.
- Re-exports form a deliberate façade; file moves do not silently break paths.
- No duplicate `mod` of the same file from binary and library roots.
- Wildcard imports limited per team policy; library code prefers explicit `use`.
- Feature-gated modules documented in README/`Cargo.toml` comments or crate docs.
- Workspace crates depend on public APIs only; invariants do not rely on sibling `pub(crate)`.

---

## References

- [The Book: Packages and Crates](https://doc.rust-lang.org/stable/book/ch07-01-packages-and-crates.html)
- [The Book: Defining Modules to Control Scope and Privacy](https://doc.rust-lang.org/stable/book/ch07-02-defining-modules-to-control-scope-and-privacy.html)
- [The Book: Paths for Referring to an Item in the Module Tree](https://doc.rust-lang.org/stable/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html)
- [The Book: Bringing Paths into Scope with use](https://doc.rust-lang.org/stable/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html)
- [The Book: Separating Modules into Different Files](https://doc.rust-lang.org/stable/book/ch07-05-separating-modules-into-different-files.html)
- [Rust By Example: Modules](https://doc.rust-lang.org/stable/rust-by-example/mod.html)
- [Rust By Example: Visibility](https://doc.rust-lang.org/stable/rust-by-example/mod/visibility.html)
- [Rust By Example: use](https://doc.rust-lang.org/stable/rust-by-example/mod/use.html)
- [Cargo Book: Package Layout](https://doc.rust-lang.org/stable/cargo/guide/project-layout.html)
- [The Reference: Visibility and Privacy](https://doc.rust-lang.org/stable/reference/visibility-and-privacy.html)
- [The Reference: Items — Modules](https://doc.rust-lang.org/stable/reference/items/modules.html)
- [Edition Guide: Path and module system changes](https://doc.rust-lang.org/edition-guide/rust-2018/module-system/path-clarity.html)
- [std prelude](https://doc.rust-lang.org/stable/std/prelude/index.html)
