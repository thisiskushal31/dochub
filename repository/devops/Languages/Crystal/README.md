# Crystal

[← Back to Languages](../README.md)

**Why in DevOps and security:** **Crystal** is a Ruby-like language that compiles to native code. It is used in web frameworks (e.g. Kemal, Lucky), CLI tools, and services. When you encounter Crystal in tooling or deployments, knowing syntax, Shards (packages), and the compiler helps with maintenance and security review. **Before you dive in:** Topic 1 explains **what this language does** and **why it's here**. The section is ordered **basics → advanced → implementation**: from program structure and types through concurrency and Shards to where Crystal is used and how to build and deploy it.

**Use cases and implementation:** For where Crystal runs (web apps, CLIs, APIs) and how to build, test, and deploy Crystal projects, see **[Topic 13 — Use cases and applications](./13_Use_Cases_And_Applications.md)** and **Topic 14** (security and best practices). **Topic 15** covers macros and C bindings for advanced use.

**How this section is organized:** (1) **Start from the very basic** — Topics 1–4 cover what Crystal is, install, program structure, and literals and types. (2) **Build bit by bit** — Topics 5–12 add control flow, methods and classes, modules and generics, exception handling, concurrency, Shards, compiler, and testing. (3) **Advanced** — Topic 15 covers macros and C bindings. (4) **Then where you can implement** — Topics 13–14 show use cases and security. Follow the topics in order; each builds on the previous.

---

## Learning path: from basics to implementation

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Crystal is, install it, and use program structure, literals, and types. |
| **Core language** | 5 → 6 → 7 → 8 | Use control flow, methods and classes, modules and generics, and exception handling. |
| **Advanced & tooling** | 9 → 10 → 11 → 12 | Use concurrency, Shards, the compiler, and testing. |
| **Advanced language** | 15 | Use macros and C bindings for code generation and native interop. |
| **Implementation** | 13 → 14 | Apply Crystal in web/CLI contexts and follow security and best practices. |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is Crystal? | [1_What_Is_Crystal.md](./1_What_Is_Crystal.md) |
| 2 | Environment setup and install | [2_Environment_Setup_And_Install.md](./2_Environment_Setup_And_Install.md) |
| 3 | Program structure and basic syntax | [3_Program_Structure_And_Basic_Syntax.md](./3_Program_Structure_And_Basic_Syntax.md) |
| 4 | Literals and types | [4_Literals_And_Types.md](./4_Literals_And_Types.md) |
| 5 | Control flow | [5_Control_Flow.md](./5_Control_Flow.md) |
| 6 | Methods and classes | [6_Methods_And_Classes.md](./6_Methods_And_Classes.md) |
| 7 | Modules, generics, and structs | [7_Modules_Generics_And_Structs.md](./7_Modules_Generics_And_Structs.md) |
| 8 | Exception handling | [8_Exception_Handling.md](./8_Exception_Handling.md) |
| 9 | Concurrency | [9_Concurrency.md](./9_Concurrency.md) |
| 10 | Shards (packages) | [10_Shards_Packages.md](./10_Shards_Packages.md) |
| 11 | Compiler and build | [11_Compiler_And_Build.md](./11_Compiler_And_Build.md) |
| 12 | Testing | [12_Testing.md](./12_Testing.md) |
| 13 | Use cases and applications | [13_Use_Cases_And_Applications.md](./13_Use_Cases_And_Applications.md) |
| 14 | Security and best practices | [14_Security_And_Best_Practices.md](./14_Security_And_Best_Practices.md) |
| 15 | Macros and C bindings | [15_Macros_And_C_Bindings.md](./15_Macros_And_C_Bindings.md) |

---

## Further reading

- [Crystal language reference](https://crystal-lang.org/reference/)
- [Crystal install](https://crystal-lang.org/install)
- [Crystal for Rubyists](https://crystal-lang.org/reference/crystal_for_rubyists/) — differences and gotchas.
- [Used in production](https://crystal-lang.org/used_in_prod/) — production adopters.
- [Shards (packages)](https://crystal-lang.org/reference/the_shards_command.html)
