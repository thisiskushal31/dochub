# Production: CI, containers, and observability

[← Back to Rust](./README.md)

## What this chapter covers

How to **build, test, and ship** Rust in CI; how to package binaries in **multi-stage containers** with **non-root** runtime; and how to operate services with **structured logging**, **metrics**, **panic hooks**, **health checks**, and **graceful shutdown**. Platform work is part of shipping Rust—not a separate craft from writing the code.

---

## 1. Concepts

### 1. CI matrix: stable and MSRV

Pin a **stable** toolchain for merge gates and releases (`rust-toolchain.toml` or CI install step). If the project declares an **MSRV** (minimum supported Rust version) in README or `Cargo.toml` metadata/`rust-version`, add a CI job that builds and tests on that older stable as well.

Typical matrix:

| Job | Purpose |
|-----|---------|
| Stable + `cargo test` | Main correctness gate |
| Stable + Clippy / rustfmt | Style and lint (chapter 15) |
| MSRV (if declared) | Do not break supported consumers |
| Advisory / deny | Lockfile policy (chapter 17) |
| Release target(s) | Cross or native release smoke (chapter 16) |

```bash
cargo test --locked
cargo clippy --all-targets -- -D warnings   # when the repo adopts deny-warnings in CI
cargo fmt --check
```

Use `--locked` (or commit policy equivalent) so CI resolves exactly what `Cargo.lock` says.

### 2. Caching `target/` (include the toolchain pin)

Compiling Rust repeatedly is expensive. Cache:

- **Cargo registry** and git checkouts.
- **`target/`** directory keyed by OS, **toolchain fingerprint** (contents/hash of `rust-toolchain.toml` / `rust-toolchain`, plus channel version), and **lockfile** hash.
- Optionally feature-set and target triple when those vary by job.

Invalidation: lockfile change, toolchain bump, or intentional clean. Stale incremental state occasionally causes odd errors—document `cargo clean` as recovery. Prefer official CI cache actions/patterns your platform supports; do not cache secrets. A cache key that omits the toolchain file is a common source of “mysterious” incremental breakage after a pin bump.

### 3. Container multi-stage builds

**Builder stage:** full toolchain, C compilers if needed, `cargo build --release`.

**Runtime stage:** minimal base (distroless, scratch + CA certs, or slim distro), copy only the binary and required runtime files (configs, migrations).

```dockerfile
FROM rust:1.XX-bookworm AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release --locked

FROM debian:bookworm-slim
RUN useradd -u 10001 -m app
COPY --from=build /app/target/release/myapp /usr/local/bin/myapp
USER 10001
ENTRYPOINT ["/usr/local/bin/myapp"]
```

Pin image digests or minor tags in production. Match glibc/musl choices to how you built (chapter 16).

### 4. Non-root runtime

Run the process as an unprivileged UID. Bind privileged ports only via sidecars or ambient capabilities if required—prefer high ports behind a mesh/ingress. Writable directories (caches, temp) should be explicit and minimal.

### 5. Health checks for services

Orchestrators need **liveness** (process stuck?) and **readiness** (safe to send traffic?). Expose cheap endpoints or exec probes that do not stampede dependencies. Distinguish “process up” from “dependency up” so a down database does not induce crash loops if your policy is to stay up and fail requests.

Deeper examples:

| Situation | Liveness | Readiness |
|-----------|----------|-----------|
| **Schema migration running** | Stay alive (process healthy) | **Not ready**—refuse new traffic until migrate finishes or fails closed per policy |
| **Dependency down** (DB/cache) | Usually stay alive if the process can still serve errors | **Not ready** if you cannot meet SLO without that dep; or stay ready and fail requests if you deliberately degrade |
| **Deadlock / stuck runtime** | Fail liveness so the orchestrator restarts | Irrelevant once restarted |

Never make liveness open a new DB transaction on every probe—that amplifies outages into restart storms.

### 6. Observability: print macros versus structured logging

| Mechanism | Role | Service fit |
|-----------|------|-------------|
| **`println!` / `eprintln!`** | Ad-hoc stdout/stderr text | Fine for CLIs and quick scripts; weak for multi-tenant services |
| **`dbg!`** | Developer stderr dumps with file/line | Local debugging only—never leave as the production telemetry path |
| **Structured logging** | Typed fields + levels (`info`, `warn`, `error`, …) | Default for services: queryable, level-filtered, agent-friendly |

Prefer fields such as `request_id`, `error.kind`, latency, and target over free-form prose. Configure level via environment. Align encoding (JSON or key=value) with your platform’s log agent.

### 7. `log` facade versus `tracing`

Ecosystem practice for libraries and services:

- **`log`** — a lightweight **facade**: crates emit log records; the binary chooses a **logger** implementation and filtering. Good for libraries that must not dictate a subscriber stack.
- **`tracing`** — structured events plus **spans** (timed, nested units of work). A **subscriber** in the binary collects spans/events (format to stdout, export to a backend, filter by level/target). Spans make “this request → these DB calls” correlatable without stuffing every line by hand.

Staff policy: libraries should stay facade-friendly (`log` and/or `tracing` APIs without selecting a global subscriber); **binaries** own the subscriber/logger choice and filtering. Do not preach a single vendor exporter—own the concepts (facade, span, subscriber, filter) and plug into whatever your org already runs.

### 8. Correlation IDs and redaction

- Propagate a **correlation / request ID** (incoming header or generated at the edge) through spans/log fields so one incident query retrieves the whole path.
- **Redact** secrets, tokens, raw PII, and oversized payloads at the source; structured fields make accidental logging easier—review field allow-lists. Never log `Authorization` headers or connection strings.

### 9. Metrics: counters, histograms, scrape versus push

- **Counters** — cumulative events (requests, errors).
- **Histograms** (or timed distributions) — latency and size distributions for SLOs.
- **Gauges** — levels (queue depth, open connections).

Export shapes vary by shop: **scrape** (your process exposes a metrics HTTP endpoint; a collector pulls) versus **push** (client pushes to a gateway). Pick one ops model per service and document it; metrics are for SLOs, logs for forensics—do not overload one with the other.

### 10. Panic hooks and process policy

Rust panics unwind (by default) or abort (if configured—chapter 16). For services:

- Avoid panicking on expected errors—use `Result` (chapter 07).
- Install a panic hook that logs **structured** panic info before exit if you exit-on-panic.
- Decide per binary: thread panic isolation vs process crash (supervisors restart processes).

### 11. Graceful shutdown

On `SIGTERM`/`SIGINT`:

1. Stop accepting new work.
2. Drain in-flight requests with a deadline.
3. Flush logs/metrics if required.
4. Exit zero when clean.

Async runtimes typically integrate signal listening; sync servers use the same OS signals. Match Kubernetes `terminationGracePeriodSeconds` (or equivalent) to your drain timeout.

---

## 2. Advanced concepts

### 1. Feature and workspace CI cost

`--all-features` and large workspaces multiply compile time. Split jobs: default features for PR speed; nightly or scheduled full-feature builds for coverage.

### 2. Advisory / deny job in CI

Add a dedicated job (or step) that runs **cargo-audit** and/or **cargo-deny** against the committed lockfile (chapter 17). Fail merges on new advisories per triage policy; allow documented ignores with owners. Keep this next to test/Clippy so dependency risk is not a quarterly surprise. Cache the advisory DB when your runner setup supports it—still key build caches on the toolchain file.

### 3. Reproducible release jobs

Release CI should use the same toolchain file, `--locked`, and container digest as documented artifacts. Attach checksums to releases.

### 4. Debuginfo in containers

Shipping fully stripped binaries without external debuginfo slows incident response. Prefer separate debug packages or symbol servers per org standard (chapter 16 split-debuginfo awareness).

### 5. Health check anti-patterns

Deep checks that open DB transactions on every probe can amplify outages. Use shallow checks for liveness; readiness may check critical deps with caching/backoff. See §1.5 for migration vs dependency-down examples; do not copy the same deep check into both probes.

### 6. Legacy notes

Older Dockerfiles may use `rustlang/rust:nightly` for production—avoid. Stable is the default production channel. Edition 2018 services still belong on current stable rustc with a pinned minor.

### 7. Build secrets

Pass registry tokens and signing keys via CI secret mounts—not `ENV` layers that persist in image history. Multi-stage builds help only if secrets never copy into the final stage.

### 8. SBOM and provenance awareness

Organizations increasingly require a **software bill of materials (SBOM)** and build **provenance** (what was built, from which commit/lockfile/toolchain, by which pipeline). For Rust, that usually means emitting inventory from the resolved **`Cargo.lock`** graph plus image/base digests—not inventing a parallel dependency list by hand. Exact formats and attestations are **org policy** (in-toto, SLSA-class expectations, forge features); staff duty is to know where the SBOM lives, who signs releases, and that `--locked` CI matches what was attested. Do not treat “we ran tests” as provenance.

### 9. Distroless / scratch final stages—tradeoffs

| Final stage | Pros | Cons |
|-------------|------|------|
| **Distroless / minimal** | Small attack surface; fewer packages to patch | Debugging harder (often no shell); CA certs and timezone data must be copied deliberately |
| **`scratch` + binary** | Tiny image if fully static (musl) | Need certs, user/passwd if required, and a verified static link story (chapter 16) |
| **Slim distro** | Familiar `apt`/debug path | Larger CVE surface; keep non-root and pinned digests |

Choose from the verified linkage model: a glibc binary in `scratch` will not run. Prefer multi-stage copies of only what the binary needs (CA bundle, migrations). Document how operators debug (ephemeral debug sidecar, not toolchain in prod).

### 10. Readiness vs liveness (ops failure modes)

If readiness incorrectly tracks “DB ping,” a brief dependency blip flaps pods out of service meshes and can cause thundering herds on recovery. If liveness tracks the same deep check, Kubernetes (or equivalent) **kills** healthy-enough processes during dependency outages—turning a partial outage into a restart loop. Codify the table in §1.5 in the runbook; load-test drain + probe behavior when changing either probe.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Keep a smoke binary path (`--help` or `/healthz`) for post-deploy validation.
- Document required env vars and fail fast at boot with clear errors.
- Decide `log` vs `tracing` (or both) at the workspace level; document who initializes the subscriber.

### Security

- Non-root, minimal final image, no toolchain in production layers.
- Dependency advisory/deny job (chapter 17) in the same pipeline as tests.
- Log redaction reviewed like an API surface.

### Reliability

- Alert on error rate, saturation, and restart loops—not only on panic traces.
- Load-test drain behavior when changing shutdown code.
- Correlation IDs required on externally reachable services.

### Performance and cost

- Cache aggressively but measure wall-clock CI; LTO on every PR is usually wrong.
- Prefer release builds in images; do not ship `debug` profiles to prod.

### Staff checklist

- [ ] Stable toolchain pinned; MSRV job exists if MSRV is declared.
- [ ] `cargo test` / fmt / Clippy (as adopted) gate merges.
- [ ] `--locked` (or equivalent) on release and main CI builds.
- [ ] Advisory / deny CI job present and owned.
- [ ] `target/` and registry caches keyed by lockfile **and** rust-toolchain (and OS/triple as needed).
- [ ] Multi-stage image; final stage non-root; pinned base; distroless/scratch tradeoffs match linkage (glibc vs musl).
- [ ] Liveness/readiness defined with migration and dependency-down examples; probes do not stampede deps.
- [ ] SBOM / provenance artifacts follow org policy and match `--locked` release builds.
- [ ] Structured logging policy (`println!`/`dbg!` not the service path); `log`/`tracing` roles clear.
- [ ] Correlation IDs + redaction policy.
- [ ] Metrics (counters/histograms) for golden signals; scrape vs push documented.
- [ ] Panic policy documented; graceful shutdown tested under SIGTERM.
- [ ] No secrets in image layers or compile-time env baked into the binary.

---

## References

- [The Cargo Book — Continuous Integration](https://doc.rust-lang.org/cargo/guide/continuous-integration.html)
- [The Cargo Book — cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html)
- [The Cargo Book — Configuration](https://doc.rust-lang.org/cargo/reference/config.html)
- [The Cargo Book — Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [rustup book — Overrides / toolchain files](https://rust-lang.github.io/rustup/overrides.html)
- [RustSec](https://rustsec.org/)
- [std::panic](https://doc.rust-lang.org/std/panic/index.html)
- [The Rust Programming Language — Fearless Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html)
- [Cargo Book — Workspaces / lockfile discipline (delivery context)](https://doc.rust-lang.org/cargo/reference/workspaces.html)
- [crates.io](https://crates.io/)
