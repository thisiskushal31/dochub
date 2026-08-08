# Security and supply chain

[← Back to Rust](./README.md)

## What this chapter covers

What **safe Rust** actually guarantees (and what it does not), how **crates.io** and **Cargo.lock** shape dependency trust, how teams should treat **updates**, **yanks**, and **advisory** awareness, and how to keep **secrets** and **build privileges** out of the blast radius. This chapter is for reviewers signing off on Rust binaries and libraries in production.

---

## 1. Concepts

### 1. Memory safety claims—and their limits

In **safe** Rust (code outside `unsafe` blocks and unsafe functions), the language and standard library are designed so that well-defined programs do not exhibit classic memory undefined behavior: use-after-free, data races on shared memory between threads, and buffer overruns of the C kind through safe APIs.

Limits you must still own:

- **`unsafe` and FFI** — Soundness depends on human invariants. One incorrect `unsafe` or bad C boundary can undermine the crate.
- **Logic bugs** — Authz mistakes, injection into shells/SQL, SSRF, and crypto misuse are not prevented by ownership.
- **Panics and denial of service** — Safe code can still abort a thread or process; treat panic policy as a reliability control.
- **Build-time code** — `build.rs` and procedural macros run on the build host with your privileges.

Safe Rust is a strong default for memory integrity, not a complete application security program.

### 2. crates.io as a trust boundary

**crates.io** is the public registry most teams use. Publishing a crate name does not imply audit, vendor review, or fitness for your threat model. Treat new dependencies like any open-source package: provenance, maintenance, transitive graph size, and `unsafe` / FFI surface.

```bash
cargo tree
cargo tree -i <crate>    # why is this crate here?
```

Prefer well-maintained crates with clear ownership; avoid pulling large graphs for a one-liner utility when `std` suffices.

### 3. Cargo.lock for applications

For **binaries and deployable apps**, commit **`Cargo.lock`**. It pins exact versions of the resolved graph so CI, developers, and production builds agree. For **libraries** published to crates.io, Cargo’s conventional advice is often not to commit the lockfile for the library crate itself—consumers resolve against their own lock. Workspace binaries and internal apps should still lock.

### 4. Update discipline

```bash
cargo update                 # within semver-compatible ranges
cargo update -p <crate>      # targeted
```

Unattended `cargo update` on the whole graph can surprise you with transitive breaks or newly vulnerable versions. Practices:

- Update on a cadence with CI green + changelog skim for security-sensitive crates.
- Prefer narrow updates when fixing a CVE.
- Re-run tests, Clippy, and your advisory check after lockfile changes.

### 5. Yanking

Authors can **yank** a version on crates.io: new resolves will not select it, but existing lockfiles that already pin that version continue to download it. Yank is a signal (“do not use for new resolves”), not a delete. After a yank for security reasons, bump your lockfile deliberately and redeploy.

### 6. Advisory awareness (practice-first)

The ecosystem maintains security advisory databases (commonly discussed under the **RUSTSEC** name) and tooling such as **cargo-audit** that check your lockfile against known advisories. Staff practice matters more than any single tool name:

- Scan the lockfile in CI on a fixed schedule and on dependency PRs.
- Triage: affected crate, fixed version, whether you are reachable, workaround.
- Do not equate “no advisory hit” with “safe”—novel or logic issues will not appear yet.

You may install audit tooling via Cargo from crates.io; pin the tool version in CI the same way you pin other build tools.

### 7. Secrets never belong in crates

Do not embed API keys, private keys, or customer data in published crates, examples, or test fixtures that ship in the package. Registry tarballs are public. Use environment variables, secret managers, and CI secret stores. Review `include_str!` / `include_bytes!` and large `#[cfg(test)]` assets before publish.

### 8. Least privilege for builds

Compile and test as a non-root CI user. Limit network egress during builds when your platform allows. Treat `build.rs` and proc-macros as **code execution at build time**. For high-assurance pipelines, consider vendoring (`cargo vendor`) and offline builds after a reviewed resolve.

---

## 2. Advanced concepts

### 1. Feature flags and optional deps

Cargo **features** can pull optional dependencies and enable code paths you did not review. Audit `Cargo.toml` features enabled in your workspace and in CI (`--all-features` vs default features). Document the feature set you ship.

### 2. Git and path dependencies

`dependency = { git = "…" }` and path deps bypass crates.io versioning. Lock commits (`rev`) and treat them as first-class supply-chain risk. Prefer crates.io releases for production graphs unless you have a documented fork policy.

### 3. `[patch]` and `[replace]`

Workspace patches redirect resolves. They are powerful for hotfixes and dangerous when undocumented. Require review for any patch that changes provenance of a security-sensitive crate.

### 4. Unsafe inventory

Staff-level review maintains a short inventory: crates that contain `unsafe`, FFI, or ambient capabilities (filesystem, network, process). Edition (`2018` vs `2024`) does not change the need for that inventory.

### 5. Ambiguous package names and typosquatting

Registry names are global. Confirm crate identity (owners, repository link on the crates.io page, download patterns) before adding a look-alike name. Pin versions in the lockfile so a later malicious higher version is not picked without an update PR.

### 6. Legacy notes

Older Cargo workflows sometimes omitted lockfiles for apps or relied on `cargo +nightly` in production. Modern practice: **stable** toolchain for release, lockfile for apps, advisory check in CI. Brownfield `edition = "2018"` crates need the same supply-chain controls as Edition 2024.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Prefer smaller graphs; expose a thin facade over heavy dependencies.
- Document MSRV and do not silently raise it in a patch release without process.

### Security

- Threat-model `unsafe`, FFI, and build scripts separately from “safe Rust” marketing claims.
- Rotate credentials if they ever appeared in a published crate or public CI log.

### Reliability

- After yank or advisory, plan rollout: lockfile bump → test → staged deploy.
- Panic and abort policies for services belong with chapter 07/19; supply chain does not replace them.

### Delivery and operations

- Cache Cargo registry and git checkouts in CI with integrity awareness.
- Sign or attest release artifacts in your org’s standard way; Cargo alone is not a full provenance system.

### Staff checklist

- [ ] Safe vs `unsafe`/FFI boundaries are documented for the product.
- [ ] Applications commit `Cargo.lock`; CI builds with `--locked` (or equivalent) for releases.
- [ ] Dependency updates are reviewed; `cargo tree` understood for critical paths.
- [ ] Advisory scanning runs in CI; triage owners exist.
- [ ] No secrets in crate sources or published packages.
- [ ] Build agents run least privilege; build-script risk acknowledged.
- [ ] Git/path/`[patch]` exceptions are inventoried.
- [ ] Yank/CVE response playbook exists (lockfile bump + redeploy).

---

## References

- [The Cargo Book — Dependencies](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)
- [The Cargo Book — Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html)
- [The Cargo Book — Yanking](https://doc.rust-lang.org/cargo/commands/cargo-yank.html)
- [The Cargo Book — Features](https://doc.rust-lang.org/cargo/reference/features.html)
- [The Rustonomicon (unsafe)](https://doc.rust-lang.org/nomicon/)
- [The Rust Reference — Unsafety](https://doc.rust-lang.org/reference/unsafety.html)
- [crates.io policies](https://crates.io/policies)
- [crates.io](https://crates.io/)
