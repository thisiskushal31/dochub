# Packages and environments

Julia organizes reusable code into packages. Packages are loaded with `import X` or `using X`; which package is loaded depends on the active environment. Environments are defined by project files and optional manifest files, or by package directories. The built-in package manager Pkg (entered in the REPL by typing `]`) installs and updates dependencies and manages environments. Understanding environments and the layout of `Project.toml` and `Manifest.toml` is essential for reproducible builds, CI, and securing dependencies.

## Loading code: include vs packages

Two ways to load code are commonly used. **Inclusion** with `include("file.jl")` evaluates the file in the global scope of the module where `include` is called. The path is relative to the file containing the `include` (or to the current working directory in the REPL). Inclusion is straightforward but does not track dependencies or versions; the same file can be included multiple times.

**Package loading** with `import X` or `using X` loads a package—a reusable collection of code in a standard layout—and makes the resulting module available as `X`. The same package is loaded only once per session; later imports reuse the already-loaded module. Which package the name `X` refers to is determined by the active environment and the dependency graph. Packages are identified by name and by a UUID so that different packages with the same name can coexist in one project.

## Environments

An **environment** defines what `import X` and `using X` resolve to and where the code is loaded from.

**Project environment.** A directory containing a **project file** (`Project.toml` or `JuliaProject.toml`) and optionally a **manifest file** (`Manifest.toml` or `JuliaManifest.toml`). The project file lists the project name, its UUID, and direct dependencies (name and UUID). The manifest file, if present, records the full dependency graph: every direct and indirect dependency, exact versions, and enough information (e.g. tree hash or path) to locate and load the correct code. Checking both files into version control gives reproducible installs: anyone can restore the same set of package versions.

**Package directory.** A directory whose subdirectories are package source trees (each with e.g. `X/src/X.jl`). Such a directory acts as an implicit environment: any such package can be loaded by name. Useful for ad-hoc or local development without a full project/manifest setup.

**Stacked environment.** The load path can combine several project environments and package directories. Later entries can add tools (e.g. dev utilities) without putting them in the main project's dependencies. The **active** environment is the one that defines what is available at the top level (e.g. in the REPL or in the main script).

## Project.toml and Manifest.toml

A typical `Project.toml` might look like:

```toml
name = "MyApp"
uuid = "8f986787-14fe-4607-ba5d-fbff2944afa9"

[deps]
SomePackage = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

The `[deps]` section lists direct dependencies: each name is mapped to a UUID. The manifest file then records, for each dependency (and their dependencies), the exact version, source location, and tree hash. Pkg generates and updates the manifest when you add or update packages; you normally do not edit it by hand. Together, the two files answer: what does this project depend on, and exactly which code should be loaded for each dependency.

## Using Pkg (package mode)

In the Julia REPL, type `]` to enter **package mode**. The prompt changes (e.g. to `(MyEnv) pkg>`). Commands run in the context of the active environment.

- **`activate path`** — Activate the project environment at `path` (or create one if `Project.toml` is missing). Use `activate .` for the current directory. Shared environments (e.g. `@v1.10`) live in the Julia depot and can be activated by name.
- **`add PackageName`** — Add a package to the current environment. Pkg resolves the version from registries, updates `Project.toml` and `Manifest.toml`, and installs the package.
- **`rm PackageName`** — Remove a dependency from the project.
- **`update`** — Update packages to the latest compatible versions and refresh the manifest.
- **`status`** (or `st`) — List dependencies and their versions in the active environment.
- **`instantiate`** — Install all dependencies recorded in `Project.toml` and (if present) `Manifest.toml` without changing them. Used in CI or after cloning a repo to get the exact dependency set.

To leave package mode, press `Backspace` at the `pkg>` prompt.

## Using and import

Once a package is in the active environment, load it in code with:

- **`using PackageName`** — Load the package and bring its exported names into the current scope. You can then use `foo` instead of `PackageName.foo` for exported names.
- **`import PackageName`** — Load the package but do not bring names into scope. Use `PackageName.foo` to refer to names. You can extend functions with `import PackageName: foo` and then define new methods for `foo`.
- **`using PackageName: name1, name2`** — Load the package and bring only the listed names into scope.

Modules export a set of names; `using` makes those names available without the module prefix. Qualified names (e.g. `PackageName.something`) always work for public APIs. For security and maintainability, prefer depending only on packages you trust and pin versions (or a full manifest) for reproducibility.

## Testing

The **Test** standard library (`using Test`) provides unit testing. **`@test expr`** asserts that an expression is true; **`@test_throws ExceptionType expr`** asserts that an expression throws the given exception type. Group related tests in **`@testset "description" ... end`**; testsets can be nested and report pass/fail per block. Options like `@testset "name" skip=true ...` or `broken=true` let you skip or mark failing tests. Package tests live in `test/runtests.jl`; run them with **`Pkg.test("PackageName")`** from package mode or `julia --project -e 'using Pkg; Pkg.test("PackageName")'`. In CI, run tests in the project environment after `instantiate` so dependencies and behavior match production.

## Reproducibility and CI

For reproducible builds, commit `Project.toml` and `Manifest.toml`. In CI, run `julia -e 'using Pkg; Pkg.instantiate()'` (or the equivalent in your build step) in the project directory so the same dependency versions are installed. Lockfiles (the manifest) prevent dependency drift and make audits and security reviews tractable. When you operate or secure Julia projects, treat the manifest as the source of truth for what code runs; check it for vulnerable or unexpected dependencies.

---

## Further reading

- [Code Loading](https://docs.julialang.org/en/v1/manual/code-loading/)
- [Modules](https://docs.julialang.org/en/v1/manual/modules/)
- [Pkg — Getting Started](https://pkgdocs.julialang.org/dev/getting-started/)
- [Working with Environments](https://pkgdocs.julialang.org/v1/environments/)
- [Creating Packages](https://pkgdocs.julialang.org/dev/creating-packages/)
- [Test (standard library)](https://docs.julialang.org/en/v1/stdlib/Test/)
