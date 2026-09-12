# Build, modules, and tooling

[← Back to Go](./README.md)

The **go** command builds packages and executables, runs tests, downloads dependencies, and formats code. **Go modules** (go.mod, go.sum) define the current module and its dependencies; the **go** command resolves and fetches dependencies from the module cache or the network. This section covers **go build**, **go test**, **go mod**, and common tooling so you can build, test, and ship Go programs in a DevOps workflow.

**Why build and modules matter.** A single command (**go build**) produces a static binary; there is no separate “runtime” to install on the target. Modules give reproducible builds: **go.sum** records the exact versions of dependencies, and **go build** uses them. CI/CD for Go typically runs **go build**, **go test**, and **go mod** commands; knowing their behavior and flags (e.g. **-race**, **-ldflags**) is essential.

**go build.** **go build** compiles the packages named on the command line (or the current directory if no path is given). If the package is **main**, it produces an executable in the current directory (or in **$GOPATH/bin** if the path is outside the current module). **go build -o path** writes the executable to **path**. **go build ./...** builds all packages in the current module. Build tags and environment variables (e.g. **GOOS**, **GOARCH**) control cross-compilation. **go build** compiles only what is needed; it caches built packages.

**go run.** **go run** builds and runs the main package in one step. It is convenient for scripts and one-off commands; for production you use **go build** and run the binary.

**go test.** **go test** compiles and runs tests in the specified packages. Test functions are **func TestXxx(t *testing.T)**; **Xxx** must not be a lowercase letter (so **Testfoo** is not run). Benchmark functions are **func BenchmarkXxx(b *testing.B)**. Tests live in **\*_test.go** files; the test code can be in the same package (access to unexported names) or in package **packagename_test** (external, only exported). **go test -v** verbose; **go test -race** race detector; **go test -cover** coverage; **go test -count=1** disables cache. **go list -m all** lists modules; **go list ./...** lists packages.

**Go modules.** A **module** is a collection of Go packages with a **go.mod** file at the root. **go.mod** declares the **module path** (e.g. **module example.com/mymod**) and the Go version; it lists **require** directives for dependencies (with optional **// indirect**). **go.sum** stores the expected cryptographic checksums of dependency content. **go mod init** creates a new module; **go mod tidy** adds missing dependencies and removes unused ones; **go get** adds or updates a dependency (e.g. **go get example.com/pkg@v1.2.3** for a specific version). **go mod verify** checks that cached modules match the checksums in **go.sum**. Dependencies are downloaded to the module cache.

**Formatting and vetting.** **go fmt** reformats source code (e.g. **go fmt ./...** for all packages in the module). **go vet ./...** runs static checks (suspicious constructs, misuse of printf). Many projects run both in CI. The **gopls** language server powers editor features (completion, navigation, refactoring) and uses the **go** command and **go.mod** to understand the project.

**Vulnerability scanning.** **govulncheck** scans your module’s dependencies against the Go vulnerability database and reports only vulnerabilities that affect your code. Install it with **go install golang.org/x/vuln/cmd/govulncheck@latest**, then from the module root run **govulncheck ./...**. Use it in CI alongside **go test** and **go build**.

```bash
go mod init example.com/myapp
go build -o myapp .
go test -race ./...
go mod tidy
go mod verify
go fmt ./...
go vet ./...
go list -m all
go list ./...
govulncheck ./...
```

**Why this matters.** The **go** command is the single entry point for build, test, and dependency management. Modules make builds reproducible and avoid the old GOPATH layout. In DevOps, you use **go build** in Dockerfiles and CI to produce binaries, **go test** for quality gates, and **go mod** to keep dependencies up to date and auditable. Cross-compilation (**GOOS=linux GOARCH=amd64 go build**) produces binaries for other platforms without a separate toolchain.

---

## Further reading

- [Command Documentation: go](https://pkg.go.dev/cmd/go)
- [Go modules reference](https://go.dev/ref/mod)
- [go.mod file reference](https://go.dev/doc/modules/gomod-ref)
- [Testing (go.dev)](https://go.dev/doc/tutorial/add-a-test)
