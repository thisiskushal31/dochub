# Use cases and applications

[← Back to Go](./README.md)

Go is used where **simplicity**, **single-binary deployment**, **fast builds**, and **built-in concurrency** matter. This topic summarizes what the language is good for, how you use it, and where it fits from the perspective of **software engineering**, **DevOps**, **security**, and **infrastructure** so you can see the full picture from basics to advanced use.

**What you can do with Go.** You can build **cloud and backend services** (APIs, microservices, gRPC), **infrastructure and DevOps tooling** (containers, orchestration, IaC, CLIs), **network and systems software** (proxies, agents, daemons), and **data pipelines** and automation. You get a single static binary, fast compile times, and a small, readable language. Many core cloud-native projects (Docker, Kubernetes, Terraform, Prometheus, etc.) are written in Go, so understanding Go helps when reading, contributing to, or operating them.

**Cloud and backend.** Go is a common choice for HTTP/gRPC services. The standard library provides **net/http** and **context**; the concurrency model fits request handlers and background jobs. Single-binary deployment simplifies containers and serverless. From a **software** perspective you design with packages, interfaces, and goroutines; from **DevOps** you build and deploy the binary (e.g. in Docker or Kubernetes) and operate it like any other service.

**Infrastructure and DevOps.** Docker, Kubernetes, Terraform, Prometheus, Consul, and many CLIs (kubectl, helm, etc.) are written in Go. If you maintain or extend these tools, you will read and write Go. The **go** command and modules integrate with CI/CD. From the module root you build, test, and scan with:

```bash
go build -o myapp .
go test ./...
govulncheck ./...
```

From **DevOps** you use Go for custom tooling, operators, and automation; from **security** you care about supply chain (go.mod, go.sum) and how binaries are built and signed.

**Command-line tools.** Go compiles to a single executable with no external dependencies (other than libc on some systems), which is ideal for CLIs and agents. Cross-compilation is straightforward. Many DevOps and platform CLIs are written in Go for portability and ease of distribution.

**By engineering role.**

- **Application / backend:** You design with types, interfaces, and concurrency; you use the standard library and common packages (net/http, encoding/json, context). Topics 1–7, 9–12, 13–14, 15–16, 17–18, then **19**, **20**.
- **DevOps / SRE:** You build and deploy Go services and tooling; in CI you run **go build**, **go test ./...**, and **govulncheck ./...**. Topics 2, 3, 17, 18, then **19**, **20**.
- **Security:** You care about supply chain (modules, checksums), safe defaults, and hardening. Run **go mod verify**, **go list -m all**, and **govulncheck ./...** to audit dependencies. Topics 15, 17, 18, then **19**, **20**.
- **Infrastructure / platform:** You read and extend tools like Kubernetes or Terraform. Topics 1–7, 9–12, 13–14, 17–18, **19**, **20**.

**Why this matters.** Seeing use cases and roles together helps you decide when Go is a fit and how to use it from coding to deployment. The language and toolchain are the same across services, tooling, and CLIs; the context (DevOps, security, backend) determines how you build, deploy, and harden it.

---

## Further reading

- [Why Go – Use Cases](https://go.dev/solutions/use-cases/)
- [Why Go – Case Studies](https://go.dev/solutions/case-studies/)
- [Documentation](https://go.dev/doc/)
