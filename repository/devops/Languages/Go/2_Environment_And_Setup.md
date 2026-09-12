# Environment and setup

[← Back to Go](./README.md)

To write and run Go you need the **Go toolchain** (compiler, standard library, and the **go** command) and an editor or IDE. The toolchain is a single distribution: there are no separate “runtime” and “SDK” installs for normal development. This section describes how to set up a typical environment so you can compile and run the examples in this handbook.

**Why setup matters.** Without the Go toolchain you cannot build or run Go programs. The **go** command is the main entry point: it builds packages, runs tests, downloads dependencies, and formats code. Editors with Go support provide syntax highlighting, navigation, and integration with the go command and with **gopls** (the Go language server).

**Installing the Go toolchain.** Download and install Go from the official site (go.dev) for your operating system (Windows, macOS, Linux). The installation provides the **go** command, the compiler, and the standard library. After installing, verify and inspect paths:

```bash
go version
go env GOROOT
go env GOPATH
go env GOMODCACHE
```

The **GOROOT** environment variable (if set) must point at the Go installation; usually it is set automatically. **GOPATH** was the default location for Go code and binaries before modules; with **Go modules** (the default since Go 1.16) you can work outside GOPATH. The **go** command uses a module cache for downloaded modules; **go env GOMODCACHE** shows where they are stored.

**Choosing an editor.** You can use **Visual Studio Code** with the Go extension, **GoLand** (JetBrains), **Vim/Neovim** with gopls, or any editor that supports the **Language Server Protocol** with **gopls**. The Go extension and gopls use the **go** command and your project’s **go.mod** to understand the codebase. To install the Go language server (gopls) for use outside VS Code or to pin a version, run **go install golang.org/x/tools/gopls@latest**. For learning and small projects, VS Code + Go extension or GoLand are common choices.

**First program.** Create a directory for your project (e.g. `myapp`) and initialize a module:

```bash
mkdir myapp && cd myapp
go mod init example.com/myapp
```

Create a file `main.go` in that directory:

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, Go")
}
```

Run it with `go run .` or build an executable with `go build -o myapp .` and then run `./myapp`. The **main** package with a **main** function is the entry point of an executable; the **go** command compiles all `.go` files in the current directory (and transitively imported packages) into one binary.

**Running Go online.** If you prefer not to install anything, use the [Go Playground](https://go.dev/play/) in the browser to write and run small programs. For local development and real projects, a local install is required.

**Why this matters for DevOps.** CI/CD for Go uses the same **go** commands you run locally. A typical CI script from the module root:

```bash
go mod download
go build -o app .
go test ./...
govulncheck ./...
```

Build agents need the Go toolchain (or a Docker image that includes it). Understanding **go mod** and the layout of a Go module (go.mod, go.sum, package directories) helps you script builds, cache dependencies, and troubleshoot failures.

---

## Further reading

- [Download and install Go](https://go.dev/doc/install)
- [Tutorial: Get started with Go](https://go.dev/doc/tutorial/getting-started)
- [Go modules reference](https://go.dev/ref/mod)
