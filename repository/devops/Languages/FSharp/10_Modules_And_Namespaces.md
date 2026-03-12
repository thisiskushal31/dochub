# Modules and namespaces

[← Back to F#](./README.md)

**Modules** and **namespaces** organize F# code. A **module** groups types, values, and function values under a name and can contain executable code. A **namespace** groups modules and types and is used for hierarchy and .NET interop. You reference contents with qualified names or **open** to use short names. This section covers the two kinds of module declarations, qualified names, nested modules, recursive modules, and how namespaces fit in so you can structure projects and libraries correctly.

**Why modules and namespaces matter.** Without organization, all bindings would be global. Modules and namespaces avoid name clashes, group related functionality, and control what is visible to callers. They are the unit of packaging and the way F# code is exposed to C# and other .NET languages. Understanding top-level vs local modules and indentation avoids subtle bugs and clarifies where code lives.

**Two kinds of module declarations.** A **top-level** module declaration includes the **whole file** in the module and must be the first declaration in the file: **module ModuleName**. You do not indent the rest of the file. A **local** module declaration defines a module with a body: **module ModuleName =** followed by indented declarations; only what is indented under it is part of the module. If a file does **not** start with a module or namespace declaration, the compiler creates an **implicit** top-level module with the same name as the file (without extension, first letter uppercased). For example, **program.fs** with no declaration becomes **module Program**. When you have multiple files or build a library, you must put an explicit module or namespace at the top.

**Qualified names and open.** To use a value, type, or function from another module, you either use the **qualified name**: **Namespace1.Namespace2.ModuleName.Identifier**, or you **open** the module or namespace: **open ModuleName** (or **open Namespace1.Namespace2**), after which you can use **Identifier** directly. Opening too many modules can cause name clashes; prefer opening only what you need or using qualified names for clarity.

```fsharp
module Arithmetic
let add x y = x + y
let sub x y = x - y
```

From another file: **let r = Arithmetic.add 5 9** or **open Arithmetic** then **let r = add 5 9**.

**Nested modules.** Modules can be nested. Inner modules must be **indented** under the outer module so the compiler treats them as inner, not sibling. In **module Y =** ... **module Z =** ..., if **Z** is indented under **Y**, then **Z** is nested and you access it as **Y.Z**. If **Z** is at the same indentation level as the other contents of **Y**, **Z** is a sibling of **Y**. Indentation is significant: wrong indentation can make a module a sibling when you intended it to be nested, and the compiler may warn.

**Recursive modules.** Normally, a type or value in a module cannot refer to another type or value in the same module that is defined later. **module rec RecursiveModule =** allows all bindings in the module to be **mutually recursive**: types, values, and nested modules can refer to each other in any order. Use **module rec** when you have types and functions that depend on each other (e.g. a type that holds an exception, and the exception that holds the type). Without **rec**, such circular references would be a compile error.

**Namespaces.** A **namespace** is declared with **namespace Name** or **namespace Parent.Child**. Namespaces can contain type definitions and module declarations; they **cannot** contain direct **let** bindings—put those inside a module. Use namespaces to align with .NET naming (e.g. **MyCompany.MyApp.Services**) and when exposing F# code to C#. A file can start with **namespace N** then **module M =** so that **M** lives under **N** and is visible as **N.M**.

**Access control.** Use **private** to hide a binding or type inside a module. Use **internal** for assembly-internal visibility. Public is the default. Control what you expose at module boundaries so callers depend only on a stable API. The accessibility modifier can appear on the module: **module private MyModule** or **module internal MyModule**.

**Why this matters.** Well-organized modules and namespaces make large codebases navigable and reduce coupling. For libraries consumed from C#, namespaces and module names become the .NET API surface. Top-level vs local modules and indentation rules affect where code is placed; **module rec** is needed for mutually referential code. In DevOps and tooling, scripts often use a few targeted **open** statements and one or two modules.

---

## Further reading

- [Modules (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/modules)
- [Namespaces (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/namespaces)
- [Import declarations: the open keyword (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/import-declarations-the-open-keyword)
- [Access Control (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/access-control)
