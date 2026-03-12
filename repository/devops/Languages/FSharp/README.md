# F#

[← Back to Languages](../README.md)

**What this language does and why it's here:** F# is a **functional-first**, **cross-platform** language on .NET. It is used for succinct, robust code in **Azure** tooling, data and analytics, scripting, and services. When you work in Microsoft-centric DevOps, maintain F# scripts or services, or need type-safe functional code on .NET, this section gives a deep dive: from **very basic** (what F# is, setup, values and functions) through **core and advanced** (types, pattern matching, async, build) to **use-case driven** (where and how it is used, security and DevOps).

---

## How to read this section

Read in **number order** for a single path from beginner to advanced to use cases.

- **Topics 1–4 (Very basic):** What F# is, environment setup, values and functions, types and type inference. Start here if you are new.
- **Topics 5–8 (Core language):** Tuples and collections, records and discriminated unions, pattern matching, options and error handling.
- **Topics 9–12 (Control and structure):** Conditionals and loops, modules and namespaces, exception handling and resources, object programming.
- **Topics 13–14 (Async and build):** Async and computation expressions, build and tooling.
- **Topics 15–16 (Use cases and security):** Where F# is used (by domain and engineering role) and how to run it safely.

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what F# is, set up .NET and an editor, write values and functions, use types and inference. |
| **Core language** | 5 → 6 → 7 → 8 | Use tuples, lists, and collections; define records and discriminated unions; pattern match; use options. |
| **Control and structure** | 9 → 10 → 11 → 12 | Use conditionals and loops, organize code in modules and namespaces, handle exceptions, use classes and interfaces. |
| **Async and build** | 13 → 14 | Write async code and use computation expressions; build and run projects and scripts. |
| **Use cases and applications** | 15 | See where F# is used: web, data, Azure, scripting, and by engineering role. |
| **Security and DevOps** | 16 | Apply security and DevOps practices for F# and .NET. |

---

## Topics (in order)

| # | Topic | File |
|---|--------|------|
| **1–4: Very basic** |
| 1 | What is F#? | [1_What_Is_FSharp.md](./1_What_Is_FSharp.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Values and functions | [3_Values_And_Functions.md](./3_Values_And_Functions.md) |
| 4 | Types and type inference | [4_Types_And_Type_Inference.md](./4_Types_And_Type_Inference.md) |
| **5–8: Core language** |
| 5 | Tuples and collections | [5_Tuples_And_Collections.md](./5_Tuples_And_Collections.md) |
| 6 | Records and discriminated unions | [6_Records_And_Discriminated_Unions.md](./6_Records_And_Discriminated_Unions.md) |
| 7 | Pattern matching | [7_Pattern_Matching.md](./7_Pattern_Matching.md) |
| 8 | Options and error handling | [8_Options_And_Error_Handling.md](./8_Options_And_Error_Handling.md) |
| **9–12: Control and structure** |
| 9 | Conditionals and loops | [9_Conditionals_And_Loops.md](./9_Conditionals_And_Loops.md) |
| 10 | Modules and namespaces | [10_Modules_And_Namespaces.md](./10_Modules_And_Namespaces.md) |
| 11 | Exception handling and resources | [11_Exception_Handling_And_Resources.md](./11_Exception_Handling_And_Resources.md) |
| 12 | Object programming | [12_Object_Programming.md](./12_Object_Programming.md) |
| **13–14: Async and build** |
| 13 | Async and computation expressions | [13_Async_And_Computation_Expressions.md](./13_Async_And_Computation_Expressions.md) |
| 14 | Build and tooling | [14_Build_And_Tooling.md](./14_Build_And_Tooling.md) |
| **15–16: Use cases and security** |
| 15 | Use cases and applications | [15_Use_Cases_And_Applications.md](./15_Use_Cases_And_Applications.md) |
| 16 | Security and DevOps | [16_Security_And_DevOps.md](./16_Security_And_DevOps.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Application / backend** | Services, APIs, data pipelines | Basics 1–4, core 5–8, modules 10, async 13, then **15**, **16**. |
| **DevOps / SRE** | Build, deploy, Azure, scripting | 2, 14, then **15**, **16**. |
| **Security** | Supply chain, config, .NET hardening | 11, 12, then **15**, **16**. |
| **Data / analytics** | Scripts, type providers, interop | 1–8, 10, 14, **15**, **16**. |

---

## Scope: what's covered and what's not

**Covered:** Full path from zero to use: what F# is, why and how to use it, and where it fits. Includes values and functions, types and inference, tuples and collections, records and discriminated unions, pattern matching, options, conditionals and loops, modules and namespaces, exception handling, object programming, async and computation expressions, build and tooling, use cases, and security and DevOps. Enough to read and write F#, build with dotnet, and operate in .NET and Azure contexts.

**Not covered in depth here (by design):** Type providers (tutorials and creating custom providers), query expressions (LINQ), code quotations, Fable/JavaScript (browser and Node), full OOP (inheritance, delegates, object expressions in depth). Use the "Further reading" links in each topic or below.

---

## Further reading

- [Documentation (fsharp.org)](https://fsharp.org/docs/)
- [What is F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/what-is-fsharp)
- [Get started with F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/)
- [Tour of F# (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/tour)
- [F# Language Reference (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/)
- [F# Cheat Sheet](https://fsprojects.github.io/fsharp-cheatsheet/)
- [FSharp.Core API reference](https://fsharp.github.io/fsharp-core-docs/)
