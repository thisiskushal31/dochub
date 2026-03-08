# C# — Environment setup and .NET SDK

[← C# README](./README.md)

To build and run C# programs you need the **.NET SDK**. The SDK includes the compiler, runtime, and tools for creating console apps, libraries, and web projects. There is no separate “C# compiler” to install; the `dotnet` CLI drives compilation and execution.

**Why the .NET SDK?** C# source is compiled to IL and run by the .NET runtime. The SDK provides `dotnet new`, `dotnet build`, `dotnet run`, and `dotnet test` so you can scaffold, compile, run, and test from the command line. Without the SDK you cannot build or run C# projects.

---

## Installing the .NET SDK

Install the **.NET SDK** for your operating system from the official .NET download page. Choose the **LTS** (Long Term Support) version for stability. After installation, verify:

```bash
dotnet --version
```

---

## Creating and running a project

Create a new console application:

```bash
dotnet new console -n MyApp
cd MyApp
```

Build and run:

```bash
dotnet run
```

Build without running (output in `bin/`):

```bash
dotnet build
```

Restore NuGet packages (e.g. after cloning or adding a package):

```bash
dotnet restore
```

The entry point is the `Main` method in `Program.cs` (or the file with the top-level statements).

---

## Project layout

A typical project has a **.csproj** file (project file), **.cs** source files, and optionally **Program.cs** as the entry. Dependencies are listed in the project file or added with `dotnet add package`. Use `dotnet new` templates for console, class library, web API, or other project types.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [.NET download](https://dotnet.microsoft.com/download)
