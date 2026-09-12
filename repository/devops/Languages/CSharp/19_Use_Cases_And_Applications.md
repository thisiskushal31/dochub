# C# — Use cases and applications

[← C# README](./README.md)

By this point you have gone from the **very basic** (what C# is, .NET SDK, structure, types, variables) through **operators**, **control flow**, **methods**, **arrays and strings**, **classes and OOP**, **interfaces and enums**, **exceptions**, **file I/O**, **namespaces**, **delegates and generics**, **LINQ and async**, and **NuGet and testing**. This topic is **where you implement**: it ties those concepts to real use cases. C# is used wherever .NET runs: Azure, web APIs, desktop, tooling, and enterprise systems.

---

## Use cases: where C# runs

| Domain | Typical use | Why C# fits |
|--------|-------------|-------------|
| **Azure and cloud** | Azure Functions, Azure DevOps, App Service, VMs | First-class SDK and tooling; same language across services and automation |
| **Web APIs and backends** | ASP.NET Core, REST APIs, microservices | Cross-platform, async, strong typing, dependency injection |
| **Desktop** | Windows Forms, WPF, cross-platform UI | Native integration and rich client frameworks |
| **DevOps and automation** | Pipelines, scripts, PowerShell modules | .NET SDK and scripting; Azure DevOps tasks and extensions |
| **Tooling and CLI** | dotnet tools, internal utilities | Single executable, NuGet, easy distribution |
| **Enterprise** | Line-of-business apps, integrations | Long-term support, ecosystem, and team familiarity |

---

## Implementation: Azure DevOps and Azure Functions

In **Azure DevOps**, pipelines can run scripts and use tasks written in C# or invoke .NET tools. **Azure Functions** are often written in C#: HTTP triggers, timer triggers, or queue-based processing. You use the same language for APIs, serverless functions, and pipeline logic. Build with **dotnet build** and deploy to Azure via the portal, CLI, or CI/CD.

---

## Implementation: ASP.NET Core API

A typical **web API** uses ASP.NET Core: controllers or minimal APIs, dependency injection, and async handlers. Dependencies are added via NuGet; configuration and logging are built in. Deploy as a container or to App Service.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapGet("/", () => "Hello");
app.MapControllers();
app.Run();
```

---

## Implementation: reading and navigating a codebase

To **read** a C# solution: start with the **.sln** and **.csproj** files to see projects and dependencies. Entry points are **Program.cs** (or the file with Main/top-level statements) and **Startup** or **WebApplication** in web apps. Follow **using** and type definitions; use **Find All References** or grep for types and methods. Tests live in test projects; run **dotnet test** to verify.

---

## Summary

| Use case | Key topics |
|----------|------------|
| Azure / DevOps | 2 (SDK), 17 (async), 18 (NuGet, testing) |
| Web API | 10–12 (OOP), 13 (exceptions), 17 (async), 18 |
| CLI / tooling | 3–9, 14 (file I/O), 18 |
| Reading/navigating | 1–5, 15 (namespaces), 18 |

For security, dependency hygiene, and safe deployment when working with C# and .NET, see **[Topic 20 — Security and best practices](./20_Security_And_Best_Practices.md)**.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/)
- [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/)
