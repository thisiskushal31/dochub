# Dart

[← Back to Languages](../README.md)

**What this language does and why it's here:** **Dart** is a **client-optimized**, **type-safe** language for building fast apps on any platform. It powers **Flutter** (mobile, web, desktop) and is used for server and CLI apps, with sound null safety and a flexible execution runtime. This section is a **deep dive**: it goes from **very basic** (what Dart is, SDK, syntax, variables, types) through **core and advanced** (control flow, functions, classes, async, patterns, libraries, tools) to **implementation and use cases** from **all sides of engineering**—application and Flutter development, DevOps and CI/CD, security and app hardening, backend and tooling. Whether you ship Flutter apps, run Dart servers, or audit or automate builds, the topics and use cases below map to your role.

**How this section is organized:** (1) **Very basic** — Topics 1–4: what Dart is, environment and SDK, program structure and syntax, variables and null safety. (2) **Core language** — Topics 5–8: types, operators, control flow, functions. (3) **Structuring code** — Topics 9–13: libraries, classes and constructors, methods and mixins, enums and extensions, patterns and metadata. (4) **Concurrency and quality** — Topics 14–16: async and isolates, null safety in depth, Effective Dart. (5) **Libraries, tools, and platforms** — Topics 17–22: core libraries, packages and pub, SDK and CLI tools, server and CLI apps, web apps, interoperability. (6) **Implementation and use cases** — Topics 23–24: use cases and applications (by engineering perspective) and security and best practices.

---

## For complete beginners

If you have never written Dart (or little code at all), start here:

1. **Topic 1 — What is Dart?** Read it to understand what Dart is, where it runs, and why it exists. No code yet.
2. **Topic 2 — Environment and SDK** Follow the steps to install the Dart SDK and run `dart --version`. You need this to run any Dart code.
3. **Topic 3 — Program structure and basic syntax** Write your first program: a single file with `main()` and `print()`. Run it with `dart run`. This topic explains every part of that program in plain language.
4. **Topic 4 — Variables and null safety** Learn how to store data in variables and what “null safety” means in practice. After that, move to **Topic 5 (Types)** and continue in order.

Each topic builds on the previous ones. **Text is always first**; **code blocks** are there to show exactly what the text describes. If a concept is new, read the paragraph above the code, then look at the code, then read the next paragraph. For **implementation** (e.g. building a server or a Flutter app), use the later topics (17–22) and the **Use cases and applications** (23) and **Security and best practices** (24) for your engineering role.

---

## How to use this section by goal

| Your goal | Where to start | Then read |
|-----------|----------------|-----------|
| **I am new to programming or Dart** | Topics 1 → 2 → 3 → 4 | 5 → 8 in order; then 9–13 as you need structure (classes, libraries). |
| **I want to build Flutter apps** | 1–4 (basics), then 5–12 (types, control flow, functions, classes, enums) | 14 (async), 17–18 (libraries, pub), 21 (web), 23–24. |
| **I need to run or automate Dart/Flutter builds** | 2 (SDK), 18 (pub), 19 (CLI tools) | 20–21 (server, web deploy), 23–24. |
| **I care about security or auditing Dart** | 4, 15 (null safety), 18 (advisories, deps) | 22 (interop), 24 (security). |
| **I build backends or CLI tools in Dart** | 1–8, 14 (async), 17 (core libs) | 18–20, 22–24. |

---

## Learning path: from basics to implementation

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Dart is, install the SDK, write a minimal app, and use variables and null safety. |
| **Core language** | 5 → 6 → 7 → 8 | Use types, operators, control flow, and functions. |
| **Structuring code** | 9 → 10 → 11 → 12 → 13 | Organize code with libraries, classes, mixins, enums, extensions, and patterns. |
| **Concurrency and quality** | 14 → 15 → 16 | Use async/await, futures, streams, isolates; apply null-safety and Effective Dart. |
| **Libraries, tools, platforms** | 17 → 18 → 19 → 20 → 21 → 22 | Use core libraries, pub, CLI tools, server and web apps, and interop. |
| **Implementation and use cases** | 23 → 24 | Apply Dart from software, DevOps, and security perspectives; follow security best practices. |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is Dart? | [1_What_Is_Dart.md](./1_What_Is_Dart.md) |
| 2 | Environment and SDK | [2_Environment_And_SDK.md](./2_Environment_And_SDK.md) |
| 3 | Program structure and basic syntax | [3_Program_Structure_And_Basic_Syntax.md](./3_Program_Structure_And_Basic_Syntax.md) |
| 4 | Variables and null safety | [4_Variables_And_Null_Safety.md](./4_Variables_And_Null_Safety.md) |
| 5 | Types | [5_Types.md](./5_Types.md) |
| 6 | Operators | [6_Operators.md](./6_Operators.md) |
| 7 | Control flow | [7_Control_Flow.md](./7_Control_Flow.md) |
| 8 | Functions | [8_Functions.md](./8_Functions.md) |
| 9 | Libraries and imports | [9_Libraries_And_Imports.md](./9_Libraries_And_Imports.md) |
| 10 | Classes and constructors | [10_Classes_And_Constructors.md](./10_Classes_And_Constructors.md) |
| 11 | Methods, inheritance, and mixins | [11_Methods_Inheritance_And_Mixins.md](./11_Methods_Inheritance_And_Mixins.md) |
| 12 | Enums, extension methods, and extension types | [12_Enums_Extensions_And_Extension_Types.md](./12_Enums_Extensions_And_Extension_Types.md) |
| 13 | Patterns and metadata | [13_Patterns_And_Metadata.md](./13_Patterns_And_Metadata.md) |
| 14 | Concurrency: async, futures, streams, isolates | [14_Concurrency.md](./14_Concurrency.md) |
| 15 | Null safety in depth | [15_Null_Safety_In_Depth.md](./15_Null_Safety_In_Depth.md) |
| 16 | Effective Dart | [16_Effective_Dart.md](./16_Effective_Dart.md) |
| 17 | Core libraries | [17_Core_Libraries.md](./17_Core_Libraries.md) |
| 18 | Packages and pub | [18_Packages_And_Pub.md](./18_Packages_And_Pub.md) |
| 19 | SDK and command-line tools | [19_SDK_And_Command_Line_Tools.md](./19_SDK_And_Command_Line_Tools.md) |
| 20 | Server and command-line apps | [20_Server_And_Command_Line_Apps.md](./20_Server_And_Command_Line_Apps.md) |
| 21 | Web apps and deployment | [21_Web_Apps_And_Deployment.md](./21_Web_Apps_And_Deployment.md) |
| 22 | Interoperability | [22_Interoperability.md](./22_Interoperability.md) |
| 23 | Use cases and applications | [23_Use_Cases_And_Applications.md](./23_Use_Cases_And_Applications.md) |
| 24 | Security and best practices | [24_Security_And_Best_Practices.md](./24_Security_And_Best_Practices.md) |

---

## By engineering role

| Role | Focus | Key topics |
|------|--------|------------|
| **Application / Flutter** | UI, state, plugins, multi-platform | 3–8 (syntax, types, control flow, functions), 10–12 (classes, mixins, enums), 14 (async), 17–18 (libraries, pub), 21 (web), 23, 24 |
| **DevOps / CI-CD** | Build, test, sign, deploy Flutter and Dart | 2 (SDK), 18 (pub), 19 (CLI), 20 (server), 21 (deployment), 23, 24 |
| **Security** | App hardening, dependency and supply chain | 4 (null safety), 15, 18 (pub, advisories), 22 (interop), 23, 24 |
| **Backend / tooling** | Servers, scripts, CLI, automation | 8 (functions), 14 (async), 17 (libraries), 19–20, 22, 23 |

---

## Coverage

This section covers the Dart language and ecosystem from basics through implementation: introduction and SDK (1–2), syntax and core language (3–8), structuring code with libraries and OOP (9–13), concurrency and quality (14–16), core libraries and pub (17–18), tools and platforms (19–22), and use cases and security (23–24). It aligns with the structure of the official Dart docs (language, core libraries, Effective Dart, packages, development, interop, tools) and is written for application, DevOps, security, and backend perspectives.

---

## Further reading

- [Dart documentation](https://dart.dev/docs)
- [Dart language tour](https://dart.dev/language)
- [Flutter](https://flutter.dev/docs)
- [pub.dev](https://pub.dev)
