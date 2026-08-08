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
| Release target(s) | Cross or native release smoke (chapter 16) |

```bash
cargo test --locked
cargo clippy --all-targets -- -D warnings   # when the repo adopts deny-warnings in CI
cargo fmt --check
```

Use `--locked` (or commit policy equivalent) so CI resolves exactly what `Cargo.lock` says.

### 2. Caching `target/`

Compiling Rust repeatedly is expensive. Cache:

- **Cargo registry** and git checkouts.
- **`target/`** directory keyed by OS, toolchain fingerprint, and lockfile hash.

Invalidation: lockfile change, toolchain bump, or intentional clean. Stale incremental state occasionally causes odd errors—document `cargo clean` as recovery. Prefer official CI cache actions/patterns your platform supports; do not cache secrets.

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

### 6. Structured logging

Prefer **structured** fields (JSON or key=value) over free-form strings: `request_id`, `error.kind`, latency. Configure log level via environment. Never log secrets or raw PII. Align with your platform’s log agent.

### 7. Metrics

Export counters, histograms, and gauges for request rates, error classes, queue depth, and resource usage. Use the metric naming conventions of your org. Metrics are for SLOs; logs are for forensics—do not overload one with the other.

### 8. Panic hooks and process policy

Rust panics unwind (by default) or abort (if configured). For services:

- Avoid panicking on expected errors—use `Result` (chapter 07).
- Install a panic hook that logs **structured** panic info before exit if you exit-on-panic.
- Decide per binary: thread panic isolation vs process crash (supervisors restart processes).

### 9. Graceful shutdown

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

### 2. Reproducible release jobs

Release CI should use the same toolchain file, `--locked`, and container digest as documented artifacts. Attach checksums to releases.

### 3. Debuginfo in containers

Shipping fully stripped binaries without external debuginfo slows incident response. Prefer separate debug packages or symbol servers per org standard.

### 4. Health check anti-patterns

Deep checks that open DB transactions on every probe can amplify outages. Use shallow checks for liveness; readiness may check critical deps with caching/backoff.

### 5. Legacy notes

Older Dockerfiles may use `rustlang/rust:nightly` for production—avoid. Stable is the default production channel. Edition 2018 services still belong on current stable rustc with a pinned minor.

### 6. Build secrets

Pass registry tokens and signing keys via CI secret mounts—not `ENV` layers that persist in image history. Multi-stage builds help only if secrets never copy into the final stage.

---

## 3. Applications and use cases + staff checklist

### Software engineering

- Keep a smoke binary path (`--help` or `/healthz`) for post-deploy validation.
- Document required env vars and fail fast at boot with clear errors.

### Security

- Non-root, minimal final image, no toolchain in production layers.
- Dependency advisory job (chapter 17) in the same pipeline as tests.

### Reliability

- Alert on error rate, saturation, and restart loops—not only on panic traces.
- Load-test drain behavior when changing shutdown code.

### Performance and cost

- Cache aggressively but measure wall-clock CI; LTO on every PR is usually wrong.
- Prefer release builds in images; do not ship `debug` profiles to prod.

### Staff checklist

- [ ] Stable toolchain pinned; MSRV job exists if MSRV is declared.
- [ ] `cargo test` / fmt / Clippy (as adopted) gate merges.
- [ ] `--locked` (or equivalent) on release and main CI builds.
- [ ] `target/` and registry caches keyed correctly.
- [ ] Multi-stage image; final stage non-root; pinned base.
- [ ] Liveness/readiness defined and calibrated.
- [ ] Structured logging + redaction policy.
- [ ] Metrics for golden signals wired to alerts.
- [ ] Panic policy documented; graceful shutdown tested under SIGTERM.
- [ ] No secrets in image layers or compile-time env baked into the binary.

---

## References

- [The Cargo Book — Continuous Integration](https://doc.rust-lang.org/cargo/guide/continuous-integration.html)
- [The Cargo Book — cargo test](https://doc.rust-lang.org/cargo/commands/cargo-test.html)
- [The Cargo Book — Configuration](https://doc.rust-lang.org/cargo/reference/config.html)
- [rustup book](https://rust-lang.github.io/rustup/)
- [The Rust Programming Language — Fearless Concurrency](https://doc.rust-lang.org/book/ch16-00-concurrency.html)
- [std::panic](https://doc.rust-lang.org/std/panic/index.html)
- [crates.io](https://crates.io/)
