# C# — What is C#?

[← C# README](./README.md)

---

## What this language does and why it's here

**What C# does:** C# is a **statically typed**, **object-oriented** language that runs on the **.NET** runtime. It is used for web apps (ASP.NET), desktop apps (Windows Forms, WPF), cloud and serverless (Azure Functions), APIs, games (Unity), and tooling. C# is compiled to intermediate language (IL) and executed by .NET; it has strong typing, garbage collection, and a large standard library.

**Why it's in this handbook:** In DevOps and Microsoft-heavy environments you will see C# in **Azure DevOps** pipelines, **Azure Functions**, **PowerShell** (built on .NET), and enterprise integrations. This section lets you (1) understand **what the language is and what it's for**, (2) learn it from **basics to advanced** in order, and (3) see **where and how it is used**—with use cases and security in Topics 19 and 20.

**How to use this section:** Start here and follow the topics in order. We begin with the **very basic** (program structure, syntax, data types), then **operators**, **control flow**, **methods**, **arrays and strings**, **classes and OOP**, **exceptions**, **file I/O**, **delegates and async**, and **NuGet and testing**. At the end, **Topics 19 and 20** show where C# is used and how to use it safely.

---

## Introduction

C# was designed for the .NET platform. Programs are compiled to **IL** (Intermediate Language) and run on the **CLR** (Common Language Runtime), which provides memory management, type safety, and a unified base class library. The language supports classes, interfaces, generics, async/await, and modern features such as records and pattern matching. For deployment you typically use the **.NET SDK** to build and run or publish applications.

---

## Features

- **Statically typed:** Types are checked at compile time; you can use `var` for local type inference.
- **Object-oriented:** Classes, inheritance, polymorphism, interfaces, and encapsulation are central.
- **Managed runtime:** Garbage collection and type safety; no manual memory management for typical code.
- **Cross-platform:** .NET runs on Windows, Linux, and macOS.
- **Ecosystem:** NuGet for packages; ASP.NET for web; Azure SDKs for cloud.

For where C# is used in practice and how to deploy and secure it, see **[Topic 19 — Use cases and applications](./19_Use_Cases_And_Applications.md)** and **[Topic 20 — Security and best practices](./20_Security_And_Best_Practices.md)**.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/csharp/)
