# Go

[← Back to Languages](../README.md)

This section is a **deep dive** into Go: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** Everything is ordered for someone who knows nothing at the start: you learn the **basics** (concepts, syntax, types, control flow), then **advanced concepts** (composite types, methods, interfaces, concurrency, error handling), then **where and how Go is used** across engineering—**software engineering**, **DevOps**, **security**, **cybersecurity**, and **infrastructure**. Each topic is self-contained: explanations come first, then code examples only when they illustrate the idea. For more depth, use the links in the Further reading section at the end of each file.

---

## How to read this section

Read in **number order** for a single path from beginner to advanced to use cases.

- **Topics 1–4 (Very basic):** What Go is, environment setup, packages and source structure, types and variables. Start here if you are new.
- **Topics 5–8 (Core language):** Operators and expressions, control flow (if, for, switch), and functions. The core you need to write real programs.
- **Topics 9–12 (Data and abstraction):** Arrays and slices, structs and pointers, maps, methods and interfaces.
- **Topics 13–16 (Concurrency and robustness):** Goroutines and channels, select and concurrent patterns, error handling, defer and panic/recover.
- **Topics 17–18 (Packages and tooling):** Packages and imports, build and modules.
- **Topics 19–20 (Use cases and security):** Where Go is used (by domain and engineering role) and how to run it safely in production and DevOps.

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Go is, install the toolchain, write a minimal program, use types and variables. |
| **Core language** | 5 → 6 → 7 → 8 | Use operators, conditionals, loops, and functions with multiple return values. |
| **Data and abstraction** | 9 → 10 → 11 → 12 | Use slices, structs, pointers, maps, methods, and interfaces. |
| **Concurrency and robustness** | 13 → 14 → 15 → 16 | Start goroutines, use channels and select, handle errors, and use defer/panic/recover. |
| **Packages and tooling** | 17 → 18 | Organize code in packages, use modules, and build and test with the go command. |
| **Use cases and applications** | 19 | See where Go is used: cloud, DevOps, CLIs, services, and by engineering role. |
| **Security and DevOps** | 20 | Apply security and DevOps practices for Go in production. |

---

## Topics (in order)

| # | Topic | File |
|---|--------|------|
| **1–4: Very basic** |
| 1 | What is Go? | [1_What_Is_Go.md](./1_What_Is_Go.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Packages and source code structure | [3_Packages_And_Source_Structure.md](./3_Packages_And_Source_Structure.md) |
| 4 | Types, constants, and variables | [4_Types_Constants_And_Variables.md](./4_Types_Constants_And_Variables.md) |
| **5–8: Core language** |
| 5 | Operators and expressions | [5_Operators_And_Expressions.md](./5_Operators_And_Expressions.md) |
| 6 | Control flow | [6_Control_Flow.md](./6_Control_Flow.md) |
| 7 | Functions | [7_Functions.md](./7_Functions.md) |
| **9–12: Data and abstraction** |
| 9 | Arrays and slices | [9_Arrays_And_Slices.md](./9_Arrays_And_Slices.md) |
| 10 | Structs and pointers | [10_Structs_And_Pointers.md](./10_Structs_And_Pointers.md) |
| 11 | Maps | [11_Maps.md](./11_Maps.md) |
| 12 | Methods and interfaces | [12_Methods_And_Interfaces.md](./12_Methods_And_Interfaces.md) |
| **13–16: Concurrency and robustness** |
| 13 | Goroutines and channels | [13_Goroutines_And_Channels.md](./13_Goroutines_And_Channels.md) |
| 14 | Select and concurrent patterns | [14_Select_And_Concurrent_Patterns.md](./14_Select_And_Concurrent_Patterns.md) |
| 15 | Error handling | [15_Error_Handling.md](./15_Error_Handling.md) |
| 16 | Defer, panic, and recover | [16_Defer_Panic_And_Recover.md](./16_Defer_Panic_And_Recover.md) |
| **17–18: Packages and tooling** |
| 17 | Packages and imports | [17_Packages_And_Imports.md](./17_Packages_And_Imports.md) |
| 18 | Build, modules, and tooling | [18_Build_Modules_And_Tooling.md](./18_Build_Modules_And_Tooling.md) |
| **19–20: Use cases and security** |
| 19 | Use cases and applications | [19_Use_Cases_And_Applications.md](./19_Use_Cases_And_Applications.md) |
| 20 | Security and DevOps | [20_Security_And_DevOps.md](./20_Security_And_DevOps.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Application / backend developer** | Services, APIs, concurrency | Basics 1–4, core 5–7, data 9–12, concurrency 13–14, errors 15–16, then **19**, **20**. |
| **DevOps / SRE** | Build, deploy, operate Go services and tooling | 2, 3, 17, 18, then **19**, **20**. |
| **Security** | Supply chain, safe defaults, hardening | 15, 17, 18, then **19**, **20**. |
| **Infrastructure / platform** | Reading and extending tools (e.g. K8s, Terraform) | 1–7, 9–12, 13–14, 17–18, **19**, **20**. |

---

## Topic index: where each subject is covered

The table below shows where each language subject appears in this section.

| Topic area | Handbook location |
|------------------|--------------------|
| What is Go, why and how to use it | **1** |
| Source code structure, notation, characters, lexical elements (comments, tokens, identifiers, keywords, literals) | **3** |
| Constants, variables, types (boolean, numeric, string, array, slice, struct, pointer, function, interface, map, channel) | **4**, **9**, **10**, **11**, **12**, **13** |
| Properties of types (representation, underlying types, identity, assignability, method sets), blocks, declarations, scope | **4**, **12** |
| Constant and variable declarations, iota, type declarations | **4** |
| Function and method declarations | **7**, **12** |
| Expressions, operands, composite literals, primary expressions, selectors, index, slice, type assertions, calls | **5**, **7**, **9**, **10**, **12** |
| Operators, conversions, constant expressions, order of evaluation | **5** |
| Statements (if, for, switch, select, defer, go, return, break, continue, goto, fallthrough) | **6**, **14**, **16** |
| Packages, imports, built-in functions, build and tooling | **17**, **18** |

---

## Scope: what's covered and what's not

**Covered:** This section gives a full path from zero to use: what Go is, why and how to use it, and where it fits (use cases, security, DevOps). It includes lexical basics (comments, identifiers, keywords, literals), types and variables, control flow, functions, composite types (arrays, slices, structs, maps), methods and interfaces, concurrency (goroutines, channels, select), error handling, defer/panic/recover, packages and modules, build and tooling, use cases, and security/DevOps. That is enough to read and write Go, build and test with the go command, and operate in cloud and DevOps contexts from software, DevOps, and security perspectives.

**Not covered in depth here (by design):** Generics (Go 1.18+), reflection, cgo, and the full standard library are only introduced or pointed to in further reading so the section stays focused on the core language and typical DevOps use.


---

## Further reading

- [The Go Programming Language Specification](https://go.dev/ref/spec)
- [Documentation (go.dev)](https://go.dev/doc/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Standard library](https://pkg.go.dev/std)
- [Go Modules Reference](https://go.dev/ref/mod)
- [Why Go – Use Cases](https://go.dev/solutions/use-cases/)
- [Why Go – Security](https://go.dev/solutions/security/)
