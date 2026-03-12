# Packages and imports

[← Back to Go](./README.md)

An **import** declaration makes another **package** available in the current file. The imported package is identified by its **import path** (a string that typically corresponds to a module path and subdirectory). The **package clause** of the imported package determines the default name used to refer to its exported identifiers; you can override it with a **renaming import**. This section covers import syntax, package visibility (exported vs unexported), and how the go command resolves import paths so you can depend on and expose packages correctly.

---

## Source file organization and package clause

Each source file consists of a package clause, followed by import declarations, followed by top-level declarations. `SourceFile = PackageClause ";" { ImportDecl ";" } { TopLevelDecl ";" } .` Package clause: `PackageClause = "package" PackageName .` PackageName must not be the blank identifier. Files sharing the same PackageName form the package; they may be required to inhabit the same directory.

## Import declarations

The PackageName is used in qualified identifiers; if omitted, it defaults to the package clause of the imported package. Dot (`.`) imports declare all exported identifiers in the file block without a qualifier. Blank import: `import _ "path"` for init only. A package must not import itself, directly or indirectly, or import a package without referring to any of its exported identifiers (unless using a blank import for init).

---

**Why packages and imports matter.** All non-trivial Go code is organized into packages. Imports define the dependency graph; the **go** command uses **go.mod** to resolve paths to modules and then to source directories. Exported names are the public API of a package; keeping that surface small and stable simplifies maintenance and versioning.

Import syntax: each ImportSpec gives an optional local name or dot, then the import path string. The default package name is the **package name** of the imported package (from its package clause). **import . "path"** (dot import) makes the package’s exported identifiers available without a qualifier (use sparingly). **import name "path"** uses **name** as the qualifier. **import _ "path"** is a blank import: the package is loaded for **init** only; its names are not accessible. Each package is initialized at most once; **init** functions run after package-level variables are initialized, in source file order.

**Module path and package path.** A **module** is defined by a **go.mod** file with **module example.com/mymod**. Packages inside the module are identified by the module path plus the directory relative to the module root. So **example.com/mymod** is the root package, **example.com/mymod/pkg/foo** is the package in directory **pkg/foo**. When you **import "example.com/mymod/pkg/foo"**, the **go** command locates the module (via **go.mod** or the module cache), then the package directory.

**Exported and unexported.** In a package, an identifier is **exported** if its first character is an uppercase letter (Unicode category Lu, Ll, Lt, Lm, Lo); otherwise it is **unexported**. Only exported identifiers are visible to importing packages. So types, functions, constants, and variables that are part of the package’s public API must be capitalized. Package names are always lower-case by convention; they are not “exported” in the same sense—the package name is how you refer to the package when using its exported names.

**init functions.** A package can define **func init()** (no arguments, no results). **init** is called automatically when the package is initialized (after all package-level variables are initialized). Multiple **init** functions in one package run in source order. Importing a package (or the program loading **main** and its transitive imports) triggers initialization of that package exactly once. **init** is used for one-time setup (e.g. registering drivers); avoid heavy logic or depending on init order across packages.

```go
import (
	"fmt"
	"example.com/mymod/pkg/foo"
	mylib "example.com/other/lib"
	_ "database/sql/driver"
)
```

**Why this matters.** Imports and package boundaries define the structure of the project and its dependencies. Keeping packages focused and exports minimal makes refactoring and versioning easier. To add a dependency, run **go get example.com/some/pkg** (or **go get example.com/some/pkg@v1.2.3** for a specific version); the **go** command updates **go.mod** and **go.sum** and downloads the module. In DevOps and tooling, you often import standard library packages (**os**, **fmt**, **net/http**, **context**) and a few third-party modules; understanding how paths resolve helps you fix broken builds and supply-chain issues.

---

## Further reading

- [The Go Programming Language Specification: Import declarations](https://go.dev/ref/spec#Import_declarations)
- [Go modules reference](https://go.dev/ref/mod)
- [How to write Go code](https://go.dev/doc/code.html)
