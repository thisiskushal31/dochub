# Environment and setup

[← Back to F#](./README.md)

To write and run F# you need the **.NET SDK** (which includes the F# compiler and F# Interactive) and an editor or IDE. You can also run F# in the browser via the Fable REPL or .NET interactive. This section describes how to set up a typical environment so you can compile and run the examples in this handbook.

**Why setup matters.** Without the .NET SDK you cannot build F# projects or run `dotnet fsi`. Editors with F# support give you syntax highlighting, errors, and run/debug. Getting this right is the first step to writing and running F#.

**Installing the .NET SDK.** Download and install the **.NET SDK** from the official .NET site for your OS (Windows, macOS, Linux). The SDK includes the F# compiler (`fsc`), the F# interactive REPL (`fsi`), and the `dotnet` CLI. Verify with `dotnet --version` and `dotnet fsi --version` (or run `dotnet fsi` and type `1 + 1;;` then Exit).

**Choosing an editor.** You can use **Visual Studio** (Windows, full F# support), **Visual Studio Code** with the Ionide F# extension (cross-platform), or **Rider** with F# support. For learning and scripts, **VS Code + Ionide** is a common choice; for large solutions, Visual Studio or Rider. The same F# compiler is used regardless of editor.

**First project.** Create a new F# console app:

```bash
dotnet new console -lang F# -o MyFSharpApp
cd MyFSharpApp
dotnet run
```

The template creates a **.fsproj** and a **Program.fs** with a simple **printfn** "Hello from F#" example. Edit **Program.fs**, then run **dotnet run** again. To target a specific F# language version (e.g. for a newer feature), add **&lt;LangVersion&gt;preview&lt;/LangVersion&gt;** or **&lt;LangVersion&gt;latest&lt;/LangVersion&gt;** in the **.fsproj** under **&lt;PropertyGroup&gt;**.

**F# scripts.** Use `.fsx` files for scripts. Run them with `dotnet fsi script.fsx` or from an editor that supports F# Interactive. In scripts you can load other scripts or assemblies with `#load` and `#r`. Scripts are useful for exploration, automation, and data tasks.

**Running F# online.** If you prefer not to install anything: **Fable REPL** runs F# in the browser (compiled to JavaScript). **.NET interactive** on Binder runs F# in a Jupyter-style notebook. Both are linked in the Further reading section.

**Why this matters for DevOps.** CI/CD for F# uses the same `dotnet build` and `dotnet test` as other .NET projects. Build agents need the .NET SDK (or a Docker image that includes it). Understanding `dotnet` and project layout helps you script builds and troubleshoot failures.

---

## Further reading

- [Get started with F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/)
- [Get started with the .NET CLI](https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/get-started-command-line)
- [Get started with VS Code](https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/get-started-vscode)
- [Fable REPL (browser)](https://fable.io/repl/)
- [.NET interactive on Binder](https://mybinder.org/v2/gh/dotnet/interactive/main?urlpath=lab)
