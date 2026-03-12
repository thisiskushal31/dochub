# Use cases and applications

[← Back to F#](./README.md)

F# is used where **succinct**, **type-safe** code and **.NET interoperability** matter. This topic summarizes what the language is good for, how you use it, and where it fits from the perspective of **software engineering**, **DevOps**, **cybersecurity**, and **data** roles so you can see the full picture from basics to advanced use.

**What you can do with F#.** You can build **web backends** (e.g. Giraffe, Saturn on ASP.NET Core), **Azure Functions** and **Azure** automation, **data and analytics** scripts and pipelines, **domain-heavy** and **financial** applications, and **cross-platform** tooling and scripts. You can consume and expose .NET and NuGet packages and interoperate with C#. Understanding F# helps when maintaining Azure-centric DevOps, data pipelines, or internal services written in F#.

**Web and APIs.** F# runs on ASP.NET Core; web frameworks like **Giraffe** and **Saturn** provide a functional, composable API over the pipeline. Use F# for backend services when you want strong typing, pattern matching, and minimal ceremony. From a **software** perspective you design with types and handlers; from **DevOps** you build and deploy like any .NET app (containers, Azure App Service, etc.).

**Azure and cloud.** Azure SDKs and tooling are .NET-friendly; F# can call them directly. Use F# for **Azure Functions**, automation scripts, and internal tooling. **DevOps** roles deploy and operate these; **security** roles care about identity, config, and secrets (managed identity, Key Vault, no secrets in code).

**Data and analytics.** F# is a strong fit for data wrangling, scripting, and type-provider–driven access to databases and services. Scripts (`.fsx`) and the REPL support exploration; type providers give typed access to schemas. Use cases include ETL, validation, and reporting. **Data** and **DevOps** roles run these scripts in pipelines or notebooks.

**Domain modeling and finance.** Records and discriminated unions model business rules and states clearly; the compiler enforces handling of every case. F# is used in quant and risk tooling and in domains where correctness and clarity matter. **Software** focuses on types and logic; **security** on data handling and audit.

**By engineering role.**

- **Application / backend:** You design with types, functions, and pattern matching; you use modules and async; you build with dotnet and deploy as .NET apps. Topics 1–8, 10, 13, 14, then **15**, **16**.

- **DevOps / SRE:** You build and deploy F# and mixed .NET solutions, run scripts, and operate Azure and other .NET-based services. Topics 2, 11, 14, then **15**, **16**.

- **Security:** You care about supply chain (NuGet, SDK), config and secrets, and secure coding (input validation, error handling, no sensitive data in logs). Topics 8, 11, then **15**, **16**.

- **Data / analytics:** You use F# for scripts, type providers, and pipelines. Topics 1–8, 10, 14, **15**, **16**.

**Why this matters.** Seeing use cases and roles together helps you decide when F# is a fit and how to use it from coding to deployment. The language and tooling are the same across web, Azure, and data; the context (DevOps, security, domain) determines how you build, deploy, and harden it.

---

## Further reading

- [F# for Web Apps (fsharp.org)](https://fsharp.org/use/web-apps/)
- [F# for Azure (fsharp.org)](https://fsharp.org/use/cloud/)
- [Documentation (fsharp.org)](https://fsharp.org/docs/)
- [F# Language Reference (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/)
