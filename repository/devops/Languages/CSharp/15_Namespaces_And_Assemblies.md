# C# — Namespaces and assemblies

[← C# README](./README.md)

**Namespaces** organize types and avoid name collisions. You declare a namespace and place types inside it; **using** imports namespaces so you can use short names. **Assemblies** are the units of deployment: a .dll or .exe produced by the compiler. An assembly can contain multiple namespaces; references and dependencies are at the assembly level. Understanding namespaces and assemblies helps you structure projects and avoid conflicts.

**Why namespaces?** Large codebases need grouping (e.g. MyApp.Data, MyApp.Services). Namespaces also allow the same short type name in different namespaces (e.g. System.IO.File vs your File type). **Why assemblies?** They define the boundary of compilation and deployment; NuGet packages and project references work at the assembly level.

---

## Namespaces

Declare a namespace with **namespace** and braces. Types inside belong to that namespace. **using** at the top of the file imports a namespace; **using static** imports the static members of a type. **global::** refers to the global namespace.

```csharp
namespace MyApp.Services
{
    public class OrderService { }
}

using MyApp.Services;
var service = new OrderService();
```

---

## File-scoped namespaces

In modern C#, a **file-scoped namespace** applies to the whole file with a single declaration and no extra braces.

```csharp
namespace MyApp.Data;

class Repository { }
```

---

## Assemblies and references

A **project** (.csproj) produces an **assembly** (.dll or .exe). To use types from another assembly, add a **project reference** or **package reference**. The compiler loads metadata from referenced assemblies; the runtime loads them when types are used.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Namespaces](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/namespace)
