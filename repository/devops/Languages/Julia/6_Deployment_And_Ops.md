# Deployment and ops

This topic covers creating packages, registries and publishing, reproducibility, deployment options, workflow tips, handling OS variation, embedding Julia, and operational and security considerations so you can run and operate Julia in CI, containers, and production-like settings.

## Creating a package

A Julia package is a project with a standard layout. The minimal layout includes a project file and a source tree. In package mode (`]` in the REPL), `generate PackageName` creates a directory with:

- **`Project.toml`** — Package name, UUID, version, and (optionally) dependencies and other metadata.
- **`src/PackageName.jl`** — The main entry point; this file should define a module with the same name as the package.

The package name and UUID in `Project.toml` identify the package. The UUID is generated at creation time and is used by the loading system to resolve the package uniquely. Adding dependencies is done with `add DepName` in the package's environment (activate the package directory first with `activate .`). Tests are commonly placed in `test/runtests.jl` and run with `Pkg.test("PackageName")` or from the CLI. Documentation is often built from a `docs/` directory using the Documenter ecosystem. Templates and tools exist to generate a fuller layout (tests, docs, CI, etc.) in one step; the important part for deployment is that the project and its dependencies are described in `Project.toml` and, for reproducibility, locked in `Manifest.toml`.

## Registries and publishing

Packages are installed from **registries**: catalogs that map package names and versions to source locations (e.g. Git repos and tree hashes). The default public registry is the General registry. To publish a package there, the package is typically registered via an automated process (e.g. a bot that opens a pull request) once the repo meets the required structure and guidelines. Private or internal registries can be added so that `add` and `update` resolve dependencies from both public and private sources. For ops and security, know which registries your environments use and whether they are trusted; lock manifests so that deployment does not depend on registry state at install time beyond what is already recorded.

## Reproducibility

Reproducible deployments rely on:

- **Fixed dependency set** — Commit `Project.toml` and `Manifest.toml`. The manifest records exact versions (and tree hashes) of every dependency.
- **Install from lockfile** — In CI and production, run `Pkg.instantiate()` in the project directory. That installs exactly what the manifest specifies, without upgrading.
- **Julia version** — Optionally pin the Julia version (e.g. in a Docker image or CI matrix) so that the same source and manifest always run with the same runtime.

Avoid relying on a mutable global environment or ad-hoc `add` at deploy time; that can lead to drift and non-reproducible builds. For audit and compliance, the manifest gives a full dependency graph; you can scan it for known vulnerabilities and track what code is executed.

## Deployment options

**Scripts and batch jobs.** Run `julia script.jl` with the project directory set and `Pkg.instantiate()` (or equivalent) already done. Set `JULIA_PROJECT` to the project directory if needed so the correct environment is active. Useful for cron jobs, scheduler jobs, and simple services.

**Containers.** Build a Docker (or similar) image that includes a Julia version and your project (with `Project.toml` and `Manifest.toml`). In the image build, run `instantiate` so dependencies are installed at build time. At runtime, run `julia` with the appropriate entry point (script or main module). Keep images minimal and avoid storing secrets in the image; use environment variables or secret mounts at runtime.

**Compiled executables.** Julia supports building executables or system images that bundle code and (optionally) the runtime. That can reduce startup time and simplify distribution. Tooling in the ecosystem supports creating such artifacts; the workflow is more involved than running scripts and is typically used when startup time or distribution format is critical.

**Notebooks and interactive use.** For exploration, teaching, or dashboards, Pluto and IJulia provide browser-based interfaces. Deploying them in shared or production settings requires securing the environment (access control, resource limits, and not running untrusted code in the same process as sensitive data).

## Workflow tips

Use a **single active environment per project** (e.g. `activate .` in the project directory) so dependencies are isolated. Commit **`Project.toml`** and **`Manifest.toml`** for reproducibility. Prefer **running scripts** with an explicit project: `julia --project=@. script.jl`. For development, the REPL and **Revise** (or similar) allow editing code and re-running without restarting Julia. In CI, always run **`Pkg.instantiate()`** before tests or deployment. These habits keep environments consistent across machines and over time.

## Handling operating system variation

Julia runs on Linux, macOS, and Windows. Path separators, line endings, and some system APIs differ. Use **`joinpath`** for building paths and **`splitpath`** for parsing so paths are portable. The **`Sys`** module exposes **`Sys.iswindows`**, **`Sys.islinux`**, **`Sys.isapple`** (and similar) for conditional code when necessary. For cross-platform scripts, avoid shell-specific commands; use Julia's standard library (e.g. file I/O, `run` with array-form `Cmd`) so behavior is consistent. In containers and CI, standardize on a single OS where possible to reduce variation.

## Embedding Julia

Julia can be **embedded** in C (or other languages that can call C): the embedding API allows a host program to start the Julia runtime, evaluate code, and exchange data. This is used when Julia is scripted from an existing application (e.g. a game engine or a C++ service). Embedding is an advanced use case; see Further reading for the C API, initialization, and thread safety. For most deployment scenarios, running Julia as the main process (script or compiled executable) is simpler than embedding.

## Ops and security considerations

- **Dependencies** — Prefer minimal dependencies and review what you add. Use the manifest and registry metadata to track and audit packages. Address known vulnerabilities in dependencies and upgrade or replace as needed.
- **Build and CI** — In CI, use a fixed Julia version and run `instantiate()` so that the same manifest is used every time. Run tests in the project environment. Cache the artifact and package directories if your CI supports it to speed repeated runs.
- **Secrets and config** — Do not commit secrets into project files or source. Use environment variables or a secret manager and inject at runtime. For config that varies by environment, same approach: env or mounted config.
- **Resource limits** — When running Julia in containers or under a scheduler, set memory and CPU limits. Julia's GC and multi-threading behave well under limits when they are set at the process or container level.
- **Logging and observability** — Use standard logging and exit codes so that orchestration and monitoring can detect failures. Structure logs so they can be aggregated and searched.

When you operate Julia in production or in shared research infrastructure, treat it like any other runtime: reproducible environment, controlled dependencies, and clear deployment path. The project and manifest files are the contract for what runs; keep them under version control and review changes as part of your release and security process.

---

## Further reading

- [Creating Packages](https://pkgdocs.julialang.org/dev/creating-packages/)
- [Working with Environments](https://pkgdocs.julialang.org/v1/environments/)
- [Workflow Tips](https://docs.julialang.org/en/v1/manual/workflow-tips/)
- [Handling Operating System Variation](https://docs.julialang.org/en/v1/manual/handling-operating-system-variation/)
- [Embedding Julia](https://docs.julialang.org/en/v1/manual/embedding/)
- [JuliaHub — Registering Packages](https://help.juliahub.com/juliahub/stable/registering)
- [Julia install (binaries, Juliaup)](https://julialang.org/install/)
- [Code Loading (reproducibility)](https://docs.julialang.org/en/v1/manual/code-loading/)
