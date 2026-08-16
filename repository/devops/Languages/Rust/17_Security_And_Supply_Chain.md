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

### 6. Policy tools: cargo-audit and cargo-deny (practices)

The **RustSec** advisory database tracks known issues in crates.io packages. Two widely used CLI practices (install from crates.io; pin the tool in CI—do not hard-require a specific version in this handbook):

| Tool | Capability (high level) |
|------|-------------------------|
| **cargo-audit** | Audits `Cargo.lock` against the advisory database (vulnerabilities and related RustSec records). |
| **cargo-deny** | Broader policy lint over the graph: **advisories**, **licenses** (allow/deny SPDX policy), **bans** (denied crates/features/multiple versions), and **sources** (which registries/git sources are allowed). |

Staff practice matters more than brand names:

- Run advisory (and, if adopted, deny) checks in CI on a schedule and on dependency PRs.
- Triage: affected crate, fixed version, reachability, workaround; record ignores with owners and expiry.
- Use deny-class **bans** to stop known-bad crates or duplicate versions from creeping back after a cleanup.
- Use **sources** policy so only crates.io (and explicitly approved git/registries) can appear in the graph.
- “No advisory hit” ≠ “safe”—logic bugs and zero-days will not appear yet.

### 7. Secrets: never in git; inject at runtime

Do not embed API keys, private keys, or customer data in published crates, examples, test fixtures, `include_str!` / `include_bytes!`, or committed `.env` files. Registry tarballs and git history are hostile. Prefer secret managers and **runtime** injection (process environment or mounted files provided by the platform). CI secrets belong in the CI secret store, not in Dockerfile `ENV` layers that persist in image history. Rotate anything that ever appeared in a public log or published crate.

### 8. Least privilege for builds

Compile and test as a non-root CI user. Limit network egress during builds when your platform allows. Treat `build.rs` and proc-macros as **code execution at build time**. For high-assurance pipelines, consider vendoring (`cargo vendor`) and offline builds after a reviewed resolve.

---

## 2. Advanced concepts

### 1. `build.rs` threat patterns

Build scripts run as ordinary code on the developer or CI machine with that user’s privileges. Review new or surprising `build.rs` (and `[build-dependencies]`) for:

- **Network fetch** at build time (downloading toolchains, C sources, or “helpers”)—prefer vendored inputs and offline-friendly builds.
- **Writes outside `OUT_DIR`** — Cargo intends generated artifacts under the output directory; writing into the source tree, home directory, or global caches is a smell and a persistence risk.
- **Reading secrets from the environment** — build scripts that require cloud credentials or API tokens expand the blast radius of every compile; prefer pre-fetched inputs.
- **Executing downloaded or generated code** — treat as installing software mid-build; high assurance teams forbid this class entirely.

Same scrutiny applies to crates whose build scripts compile C via the `cc` crate: you inherit that C toolchain’s trust model.

### 2. Procedural macro trust

**Proc-macros** expand at compile time by running code on the host (developer laptop and CI). They are not “just types”—they are a trust decision equal to adding a build plugin. Prefer well-known, maintained macros; review updates that touch macro crates carefully; avoid obscure macros that pull large graphs. Edition choice does not sandbox them.

### 3. Feature flags and optional deps

Cargo **features** can pull optional dependencies and enable code paths you did not review. Audit `Cargo.toml` features enabled in your workspace and in CI (`--all-features` vs default features). Document the feature set you ship.

### 4. Git and path dependencies

`dependency = { git = "…" }` and path deps bypass crates.io versioning. Lock commits (`rev`) and treat them as first-class supply-chain risk. Prefer crates.io releases for production graphs unless you have a documented fork policy. Source allow-lists in cargo-deny-style policies catch accidental git deps.

### 5. `[patch]` and `[replace]`

Workspace patches redirect resolves. They are powerful for hotfixes and dangerous when undocumented. Require review for any patch that changes provenance of a security-sensitive crate.

### 6. Unsafe inventory

Staff-level review maintains a short inventory: crates that contain `unsafe`, FFI, or ambient capabilities (filesystem, network, process). Edition (`2018` vs `2024`) does not change the need for that inventory.

### 7. Typosquatting and reviewing new dependencies

Registry names are global. Before adding a **new** direct dependency:

1. Confirm crate identity on crates.io (owners, repository link, recent activity)—not only the name spelling.
2. Skim `cargo tree` growth, `unsafe`/FFI/`build.rs`/proc-macro surface, and license.
3. Prefer established crates over look-alikes that differ by one character.
4. Land new deps via PR with lockfile diff; never “just cargo add” on main without review.

Pinning via `Cargo.lock` means a later malicious higher version still requires an update PR—keep that process gated.

### 8. Legacy notes

Older Cargo workflows sometimes omitted lockfiles for apps or relied on `cargo +nightly` in production. Modern practice: **stable** toolchain for release, lockfile for apps, advisory/deny checks in CI. Brownfield `edition = "2018"` crates need the same supply-chain controls as Edition 2024.

### 9. Secret material in memory (zeroization practice)

Keeping secrets out of git is necessary but not sufficient: API tokens, private keys, and decrypted payloads often linger in `String`/`Vec` buffers, core dumps, and allocator reuse. **Zeroization** practice overwrites secret bytes when a value is dropped (or explicitly cleared) so residual copies are less likely to remain readable in process memory. Ecosystem crates in the **zeroize** class provide `Zeroize`/`ZeroizeOnDrop`-style helpers; they are not magic—copies via `Clone`, logs, swap, and compiler moves can still duplicate material. Staff expectations:

- Prefer dedicated secret types over bare `String` for long-lived credentials in memory.
- Avoid logging or including secrets in `Debug`/`Display`.
- Accept that zeroization reduces residual risk; it does not replace OS keystores, short-lived tokens, or minimizing how long secrets are held.
- Pin any zeroize-class dependency like other security-sensitive crates (crates.io links in References).

### 10. Supply-chain review ecosystems (cargo-vet / cargo-crev)—optional practice

Beyond advisory databases, some organizations adopt **human review** ecosystems:

| Practice | Idea (high level) |
|----------|-------------------|
| **cargo-vet**-class | Record and require *audits* (or trusted third-party audits) for crates in the graph before they are accepted in CI. |
| **cargo-crev**-class | Distributed code-review web: reviewers publish signed reviews others may import. |

Treat these as **optional** supply-chain maturity tools—not a handbook mandate. They complement cargo-audit/cargo-deny; they do not replace lockfiles, least-privilege builds, or reading `unsafe`/`build.rs` yourself. If adopted, pin the tool versions, define who may import foreign audit criteria, and document the policy next to advisory triage.

### 11. Dependency review checklist for new crates

Before adding a **new** direct dependency (extends §2.7 typosquatting checks):

1. **Maintainer and provenance** — owners, repository link, release cadence, response to issues; a GitHub star count alone is not a review.
2. **Download count is not enough** — popularity helps signal, but popular crates can still ship `unsafe`, heavy `build.rs`, or license surprises.
3. **Audit `unsafe` / FFI / build scripts / proc-macros** — skim for ambient authority; prefer safe, narrow APIs.
4. **License** — SPDX identity fits org policy (deny-class allowlists when you use them).
5. **Graph cost** — `cargo tree` growth, duplicate versions, and feature creep from defaults.
6. **Alternatives** — can `std` or an already-approved crate cover the need?

Land via PR with lockfile diff; require the same checklist for “tiny” utilities—they often pull surprising transitive graphs.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Prefer smaller graphs; expose a thin facade over heavy dependencies.
- Document MSRV and do not silently raise it in a patch release without process.

### Security

- Threat-model `unsafe`, FFI, **build scripts**, and **proc-macros** separately from “safe Rust” marketing claims.
- Rotate credentials if they ever appeared in a published crate or public CI log.

### Reliability

- After yank or advisory, plan rollout: lockfile bump → test → staged deploy.
- Panic and abort policies for services belong with chapter 07/19; supply chain does not replace them.

### Delivery and operations

- Cache Cargo registry and git checkouts in CI with integrity awareness.
- Sign or attest release artifacts in your org’s standard way; Cargo alone is not a full provenance system.

### Staff checklist

- Safe vs `unsafe`/FFI boundaries are documented for the product.
- Applications commit `Cargo.lock`; CI builds with `--locked` (or equivalent) for releases.
- Dependency updates are reviewed; `cargo tree` understood for critical paths.
- **cargo-audit** and/or **cargo-deny** (or equivalent) runs in CI; triage owners exist.
- License/ban/source policy exists if the org requires it (deny-class tooling).
- New deps reviewed with the checklist (maintainer, unsafe/build surface, license, graph)—not download count alone.
- No secrets in git, crate sources, or published packages; runtime injection only; in-memory zeroization considered for long-lived credentials.
- Build agents run least privilege; `build.rs` / proc-macro risk acknowledged.
- Optional cargo-vet/crev-class review policy, if any, is documented—not assumed from this handbook.
- Git/path/`[patch]` exceptions are inventoried.
- Yank/CVE response playbook exists (lockfile bump + redeploy).

---

## References

- [The Cargo Book — Dependencies](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)
- [The Cargo Book — Cargo.lock](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html)
- [The Cargo Book — Yanking](https://doc.rust-lang.org/cargo/commands/cargo-yank.html)
- [The Cargo Book — Features](https://doc.rust-lang.org/cargo/reference/features.html)
- [The Cargo Book — Build Scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html)
- [The Rustonomicon (unsafe)](https://doc.rust-lang.org/nomicon/)
- [The Rust Reference — Unsafety](https://doc.rust-lang.org/reference/unsafety.html)
- [RustSec Advisory Database](https://rustsec.org/)
- [cargo-deny on crates.io](https://crates.io/crates/cargo-deny)
- [cargo-audit on crates.io](https://crates.io/crates/cargo-audit)
- [zeroize on crates.io](https://crates.io/crates/zeroize)
- [cargo-vet on crates.io](https://crates.io/crates/cargo-vet)
- [cargo-crev on crates.io](https://crates.io/crates/cargo-crev)
- [crates.io policies](https://crates.io/policies)
- [crates.io](https://crates.io/)
