# What is F#?

[← Back to F#](./README.md)

F# is a **functional-first**, **statically typed** programming language that runs on **.NET**. It is open-source and cross-platform and emphasizes clarity, correctness, and interoperability with the rest of the .NET ecosystem. This section answers: what the language is, why it is used, when to choose it, how you use it, and where it fits—from zero knowledge to use cases and from software engineering, DevOps, and security perspectives.

**What it is.** F# is **multi-paradigm**: functional-first, with strong support for object-oriented and imperative styles when needed. It has **type inference** and **automatic generalization**, so you often omit types and still get static typing. Data is **immutable by default**; **records** and **discriminated unions** model domain data with named fields and a fixed set of cases. **Pattern matching** is the main branching construct, and the compiler checks **exhaustiveness**: you must handle every case of a union or option, which makes many invalid states unrepresentable. **First-class functions** (including partial application and composition) make it natural to build programs from small, composable pieces. F# runs on the same runtime (CLR) as C# and VB.NET: you use the same base class library, NuGet packages, and tooling, and you can call and be called from other .NET languages.

**Why it is used.** F# reduces boilerplate and keeps focus on the problem: less ceremony, strong typing without noisy type annotations, and data shapes (records, unions) that match how you think about the domain. Exhaustive pattern matching and the option/Result types push you to handle absence and failure explicitly, which reduces null-reference and “forgot to check” bugs. It is used where correctness, clarity, and .NET interoperability matter: backend services, data pipelines, Azure functions, scripting, and domain modeling. For DevOps and security, F# appears in Azure tooling, automation scripts, and internal services; understanding it helps with maintaining and securing those systems.

**When to choose F#.** Choose F# when you want functional style, strong typing, and .NET interop in one language; when domain modeling with types (records, DUs) and exhaustive matching is a priority; or when you are building data-heavy or correctness-sensitive code and want the compiler to enforce handling of every case. Choose C# when the team or codebase is primarily OOP and imperative, or when you need maximum familiarity for .NET-only developers. Both compile to the same runtime; the choice is often about style and team.

**How you use it.** You write F# in **.fs** (implementation) or **.fsx** (script) files. You need the **.NET SDK** (or Visual Studio / VS Code with F#). You build and run with **dotnet run** or the F# Interactive REPL (**dotnet fsi**). You organize code in **modules** and **namespaces** and consume .NET and NuGet packages. For scripting you run **dotnet fsi script.fsx** or use F# in Jupyter or the Fable REPL. Concurrency is handled via **async** or **task** computation expressions, or .NET APIs.

**Use cases.** F# is used for **web backends** (e.g. with Giraffe or Saturn), **data and analytics** (type providers, scripts), **Azure** (functions, tooling), **domain modeling** and **finance**, and **cross-platform scripting**. From a **software engineering** perspective you design with types and functions and let the compiler enforce invariants; from **DevOps** you build and deploy .NET artifacts and run scripts with **dotnet**; from **security** you apply .NET and supply-chain practices and secure configuration and secrets.

**Relation to C# and .NET.** F# and C# compile to the same runtime (CLR). You can reference C# projects from F# and vice versa. F# emphasizes expressions, immutability, and pattern matching; C# has more imperative and OOP idioms. Both share the same base class library and ecosystem; the difference is in how you structure and reason about code.

---

## Further reading

- [What is F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/what-is-fsharp)
- [Documentation (fsharp.org)](https://fsharp.org/docs/)
- [Tour of F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/tour)
