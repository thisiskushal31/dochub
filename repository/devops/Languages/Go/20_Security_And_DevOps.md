# Security and DevOps

[← Back to Go](./README.md)

Running Go in production or in automation involves **configuration and secrets**, **supply chain**, **error handling and logging**, and **deployment** practices. This topic gives a concise guide from a security and DevOps perspective so you can deploy and operate Go systems safely.

**Configuration and secrets.** Do not put secrets in source or in config files committed to the repo. Use **environment variables**, a secrets manager (e.g. HashiCorp Vault, cloud provider secrets), or mounted files, and read them at runtime. Fail fast if required config (e.g. connection strings, API keys) is missing so misconfigurations are caught at startup. The standard library does not provide a built-in config format; use **os.Getenv**, **encoding/json** or **encoding/yaml** with external files, or a package that fits your environment. For **Twelve-Factor** apps, config and secrets come from the environment.

**Supply chain.** Dependencies (modules) can contain vulnerable or malicious code. **go.mod** and **go.sum** pin module versions and record checksums. Verify cached modules match **go.sum** and audit what you depend on:

```bash
go mod verify
go list -m all
govulncheck ./...
```

Use **go mod tidy** and **go get example.com/pkg@v1.2.3** (explicit versions) in CI so builds are reproducible. The **govulncheck** tool (from the Go vulnerability database) reports only vulnerabilities that affect your code; install it once, then run it in your module root. Prefer well-maintained, widely used modules. In CI, run with pinned versions and run tests and security checks (including **govulncheck**) before deploying. Treat the build pipeline and dependency graph as part of your threat model.

**Error handling and logging.** Use explicit **error** returns and **defer** for cleanup; do not expose internal errors or stack traces to clients. Log errors and important events server-side with structured logging where possible; do not log secrets or PII. In production, set appropriate log levels and retention. The **log** and **log/slog** packages (and third-party loggers) support levels and structured fields. **panic** and **recover** are for programmer errors and boundaries; do not use them for expected failures.

**Deployment and runtime.** Build with **go build** for a single binary. For fully static binaries (no cgo), use:

```bash
CGO_ENABLED=0 go build -o app .
```

Use the same Go version (or compatible) in CI and production. For containers, use a minimal base image (e.g. **scratch** or **alpine**) and run as a non-root user when feasible. Do not run debug or development servers in production; do not embed or expose **pprof** or similar without access control. Set **GOMAXPROCS** if you need to limit CPU parallelism (e.g. in constrained environments).

**Concurrency and race safety.** Data races are undefined behavior. Run the race detector in tests and optionally in builds:

```bash
go test -race ./...
go build -race -o app .
```

Design concurrent code so that either only one goroutine writes to shared state (e.g. channels) or access is protected (e.g. **sync.Mutex**). Avoid sharing mutable state across goroutines without synchronization.

**Vulnerability check (govulncheck).** Install and run the official vulnerability scanner so you see which known vulnerabilities actually affect your project:

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

Run **govulncheck** from your module root (where **go.mod** is). It uses the Go vulnerability database and reports only issues that are reachable in your code. Add **govulncheck ./...** to CI so dependency updates and new code are checked before merge or deploy.

**Why this matters.** Go’s design (static binary, no JVM, explicit errors) reduces some attack surface, but you still must manage secrets, dependencies, and deployment safely. Applying these practices helps you operate Go-based systems reliably and securely in production and in automation.

---

## Further reading

- [Why Go – Security](https://go.dev/solutions/security/)
- [Go Vulnerability Database](https://pkg.go.dev/vuln/)
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck)
- [Data Race Detector](https://go.dev/doc/articles/race_detector.html)
