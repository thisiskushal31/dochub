# Projects, modules, namespaces, and entry points

[← Back to VB.NET](./README.md)

## What this chapter covers

How a VB.NET program is **packaged and started**. By the end you should be able to:

1. Read an SDK-style **`.vbproj`** and name its TFM.
2. Explain **modules vs classes** and when each appears.
3. Use **namespaces** without confusing them with assemblies.
4. Find **`Sub Main`** (and friends) as the entry point.
5. Contrast **`net8.0` / `net9.0` / `net10.0`** with **`net48`** brownfield projects.

Chapter **[00](./00_First_Steps_SDK_DotNet_And_Hello.md)** got hello running. Chapter **[01](./01_What_VBNet_Is_And_Is_Not.md)** placed VB on the CLR. This chapter is the **project spine**. Types and `Option` directives follow in **[03](./03_Types_Variables_And_Option_Directives.md)**.

Handbook default: **SDK-style projects** on modern .NET; Framework 4.x as labeled brownfield.

---

## 1. Concepts

### 1. The project is the unit of build

A **project** (`.vbproj`) tells the SDK:

- which **target framework** (TFM) to compile for,
- which **files** to compile,
- which **NuGet packages** and project references to pull,
- what **output** kind to produce (Exe, Library, …).

A **solution** (`.sln`) groups projects. CI usually builds a solution or a clear project list—not “whatever is open in the editor.”

Minimal SDK-style shape:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <RootNamespace>VbHello</RootNamespace>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>
</Project>
```

| Element | Meaning |
|---------|---------|
| `Sdk="Microsoft.NET.Sdk"` | SDK-style defaults (globs `**/*.vb`, etc.) |
| `TargetFramework` | TFM: API surface + runtime expectation |
| `OutputType` | `Exe` vs `Library` (and related) |
| `RootNamespace` | Default namespace for new types |

### 2. Modules vs classes

**Module** in VB is a container for shared members—roughly “static” peers to a C# static class. Console templates often put `Sub Main` in a `Module`.

```vb
Module Program
    Sub Main(args As String())
        Console.WriteLine("entry")
    End Sub
End Module
```

**Class** is the everyday OOP type: instances, inheritance, interfaces.

```vb
Public Class Greeter
    Public Function Hello(name As String) As String
        Return $"Hello, {name}"
    End Function
End Class
```

| Prefer a **Module** when… | Prefer a **Class** when… |
|---------------------------|--------------------------|
| Entry point / shared helpers with no instance state | Domain objects, services with lifetime |
| Grouping `Public Const` / pure functions | You need polymorphism or DI-friendly instances |

Staff smell: giant `Module GodHelpers` with mutable `Public` fields—state without ownership.

### 3. Namespaces

Namespaces organize types. They are **not** assemblies and not security boundaries.

```vb
Namespace Acme.Billing
    Public Class Invoice
    End Class
End Namespace
```

| Idea | Review habit |
|------|--------------|
| `RootNamespace` + file nesting | Predictable full names |
| `Imports` | Bring names into scope; prefer explicit for rare types |
| Same namespace, different assemblies | Allowed—don’t assume one DLL |

Collision fixes: fully qualify, alias `Imports`, or rename. Do not “fix” collisions by weakening access modifiers casually.

### 4. Entry points — `Sub Main`

For executable projects, the runtime needs an entry point. Classic VB shape:

```vb
Module Program
    Sub Main(args As String())
        ' application starts here
    End Sub
End Module
```

| Topic | Staff note |
|-------|------------|
| `args` | Command-line arguments—validate before trust |
| Return codes | Prefer clear process exit strategies for CLI tools |
| Multiple `Main` candidates | Project settings / compiler must pick one—ambiguous entry is a build break |
| WinForms | Often `Sub Main` or application framework startup—not console `WriteLine` |

Libraries (`OutputType` library) **do not** need `Main`. If you find `Main` in a class library, ask why.

### 5. Assemblies vs projects vs namespaces

| Term | What it is |
|------|------------|
| **Project** | Build input (`.vbproj`) |
| **Assembly** | Build output (`.dll` / `.exe`) |
| **Namespace** | Logical type name prefix |
| **Solution** | Grouping for humans and CI |

Wrong mental model: “namespace = DLL.” Right model: **many namespaces per assembly**, and sometimes the reverse across packaging choices.

---

## 2. Advanced concepts

### 1. TFMs: modern .NET vs Framework

| TFM examples | Typical story |
|--------------|---------------|
| `net8.0`, `net9.0`, `net10.0` | Modern .NET — default greenfield narrative |
| `net48` | .NET Framework 4.8 — Windows brownfield |
| `netstandard2.0` (libraries) | Older portability bridge—literacy when inherited |

Multi-targeting (`net8.0;net48`) appears in shared libraries. That doubles test surface—document it.

### 2. SDK-style vs legacy project files

| SDK-style | Legacy Framework projects |
|-----------|---------------------------|
| Short `.vbproj`, wildcards | Verbose lists, sometimes `packages.config` |
| `dotnet` CLI friendly | Often Visual Studio + MSBuild on Windows |
| Easy CI on Linux agents (for compatible TFMs) | Windows agents / Framework targeting packs |

When opening ancient `.vbproj` files: restore strategy, tools versions, and binding redirects matter. Do not “simplify” the project file mid-incident without a branch and tests.

### 3. `Imports` and project-wide imports

Projects may define global imports. That reduces boilerplate and can **hide dependencies**. Review surprises when a type resolves without a local `Imports`—check project settings.

### 4. Partial classes and generated code

WinForms / designers often use `Partial Class` across files. Treat generated regions as **owned by the designer** unless your team has a clear edit policy. Merge conflicts in designer files are a process smell.

### 5. Friends, InternalsVisibleTo, and access

`Friend` (assembly-internal) types need intentional test access (`InternalsVisibleTo`) rather than making everything `Public`. Public surface is a compatibility contract. Friend attributes can name a **C#** test assembly consuming a **VB** library (or the reverse)—same CLR, different project Options defaults.

### 6. Mixed C# / VB solutions

Enterprise solutions often mix languages:

| Habit | Why |
|-------|-----|
| Align **TFMs** across ProjectReferences | Mismatched targets produce confusing restore/build errors |
| Expect different **Option** defaults per VB project | Strict Off in one VB project does not “infect” C#, but APIs still cross |
| Design public APIs language-agnostically | Prefer clear types over VB-only XML literal returns at shared boundaries |
| One language “owns” a project | Avoid dual-language source in a single project as a habit |

### 7. Entry points in real hosts

| Host | Entry shape |
|------|-------------|
| Console | `Sub Main` |
| Windows Service / Worker | Host builder patterns (often C#-documented; VB can follow same APIs) |
| IIS / web | Different project SDK—literacy door, not this chapter’s spine |
| Office | **Not VB.NET**—see [VBA](../VBA/README.md) |

---

## 3. Applications and use cases

| Angle | How project structure shows up |
|-------|--------------------------------|
| **Application** | Clear `Main`, small modules/classes, namespaces that match bounded contexts. |
| **Systems** | Solution build order and TFM matrix match deployment topology. |
| **Security** | Entrypoints validate `args` and config; libraries don’t expose accidental `Public` munitions. |
| **Ops** | Artifacts named and versioned per project; Framework vs modern .NET installers differ. |
| **SE** | Onboarding diagram: solution → projects → entry assembly → TFM. |

**Whole-engineering picture:** if you cannot point to the entry project and TFM, you cannot reason about runtime support or blast radius.

---

## 4. Staff-level review checklist

- `.vbproj` TFM is explicit and matches the support policy.
- Executable projects have a **single clear entry**; libraries lack stray `Main`.
- Modules vs classes match ownership of state (no global mutable dump).
- Namespaces are coherent; `Imports` are not a junk drawer.
- Framework `net48` (or older) projects are labeled brownfield in docs/CI.
- SDK-style vs legacy project format is recognized before “quick edits.”
- Public API surface is intentional (`Public` vs `Friend`).
- Cross-links to [C# SDK setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) used for shared tooling questions.

---

## References

- [Visual Basic — Program structure and code conventions](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/program-structure/)
- [Namespaces in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/program-structure/namespaces)
- [`.vbproj` SDK-style projects](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview)
- [.NET target frameworks](https://learn.microsoft.com/en-us/dotnet/standard/frameworks)
- [`dotnet new` templates](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new-sdk-templates)
