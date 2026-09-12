# Build and tooling

[← Back to F#](./README.md)

F# projects are built with the **.NET CLI** (**dotnet**). A project is a `.fsproj` file that lists source files, references, and settings. You run scripts with **F# Interactive** (**dotnet fsi**). This section covers project layout, build commands, and scripting so you can build, test, and run F# in development and CI.

**Why build and tooling matter.** Real code lives in projects or scripts; you need to compile, run tests, and package for deployment. The same **dotnet** commands work in local dev and in CI. Understanding project structure and compiler options helps when adding files, fixing build errors, or integrating with C# projects.

**Project file.** An F# project is a `.fsproj` XML file. It specifies the target framework (e.g. `net8.0`), SDK (e.g. `Microsoft.NET.Sdk`), and can list **Compile** items (default is all `.fs` in the directory). Order of files matters: a file can only use types and modules from files above it or from referenced projects. Add package references with **PackageReference**; add project references with **ProjectReference**.

**Building and running.** From the project directory: **dotnet build** compiles; **dotnet run** builds and runs the main executable; **dotnet test** runs tests (with a test project and a test framework). Use **dotnet run --project path** to run another project. **dotnet publish** produces a deployable output (e.g. for a container or server).

**F# Interactive (REPL).** **dotnet fsi** starts the F# interactive session. You enter expressions and definitions; end a top-level expression with **;;** to evaluate. Load a script with **#load "file.fsx"**; reference an assembly with **#r "path"**. Scripts (`.fsx`) are run with **dotnet fsi script.fsx**. Use the REPL for exploration and scripting; use projects for applications and libraries.

**Compiler options.** Common options (in the project or command line): **--warnaserror** to treat warnings as errors, **-g** for debug info, **-O** for optimizations. You can set **DefineConstants** (e.g. DEBUG) and **Optimize** in the `.fsproj`. For security and reproducibility, pin SDK and package versions and use a consistent build in CI.

**Why this matters for DevOps.** CI pipelines run **dotnet restore**, **dotnet build**, and **dotnet test**. Builds must be reproducible (same SDK and dependencies). Scripts run with **dotnet fsi** in automation; ensure the correct runtime and script path. Understanding the project model and CLI is necessary for maintaining and deploying F# and mixed .NET solutions.

---

## Further reading

- [Get started with the .NET CLI (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/get-started-command-line)
- [Compiler Options (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/compiler-options)
- [F# Language Reference](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/)
