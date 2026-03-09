# D

[← Back to Languages](../README.md)

**What this language does and why it's here:** **D** is a general-purpose **systems programming language** with C-like syntax that compiles to native code. It is statically typed and supports both **garbage-collected** and **manual memory management**. This section is a **deep dive**: it goes from **very basic** (what D is, build, modules, types) through **advanced** (templates, contracts, traits, interop, memory) to **implementation and use cases** from **all sides of engineering**—software, DevOps, security, systems, and research. Whether you ship D services, operate or audit native tooling, or analyze binaries, the topics and use cases below map to your role.

**How this section is organized:** (1) **Very basic** — Topics 1–4: what D is, environment and build, lexical/modules/declarations, types and attributes. (2) **Core language** — Topics 5–9: expressions and statements, arrays, structs/classes/interfaces, enums and qualifiers, functions and operators. (3) **Advanced** — Topics 10–15: templates and mixins, contracts and conditional compilation, traits and error handling, memory and runtime, interfacing to C/C++, portability and advanced topics. (4) **Implementation and use cases** — Topics 16–17: use cases and applications (by engineering role) and security.

---

## Learning path: from basics to implementation

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what D is, build with dub/dmd, and use modules, declarations, and types. |
| **Core language** | 5 → 6 → 7 → 8 → 9 | Use expressions, statements, arrays, structs/classes/interfaces, enums, and functions. |
| **Advanced** | 10 → 11 → 12 → 13 → 14 → 15 | Use templates, contracts, traits, error handling, GC, and C/C++ interop. |
| **Implementation and use cases** | 16 → 17 | Apply D in tooling and native code from software, DevOps, security, systems, and research perspectives; follow security best practices. |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is D? | [1_What_Is_D.md](./1_What_Is_D.md) |
| 2 | Environment and build | [2_Environment_And_Build.md](./2_Environment_And_Build.md) |
| 3 | Lexical, modules, and declarations | [3_Lexical_Modules_And_Declarations.md](./3_Lexical_Modules_And_Declarations.md) |
| 4 | Types, properties, and attributes | [4_Types_Properties_And_Attributes.md](./4_Types_Properties_And_Attributes.md) |
| 5 | Expressions and statements | [5_Expressions_And_Statements.md](./5_Expressions_And_Statements.md) |
| 6 | Arrays and associative arrays | [6_Arrays_And_Associative_Arrays.md](./6_Arrays_And_Associative_Arrays.md) |
| 7 | Structs, classes, and interfaces | [7_Structs_Classes_And_Interfaces.md](./7_Structs_Classes_And_Interfaces.md) |
| 8 | Enums and type qualifiers | [8_Enums_And_Type_Qualifiers.md](./8_Enums_And_Type_Qualifiers.md) |
| 9 | Functions and operator overloading | [9_Functions_And_Operator_Overloading.md](./9_Functions_And_Operator_Overloading.md) |
| 10 | Templates and template mixins | [10_Templates_And_Mixins.md](./10_Templates_And_Mixins.md) |
| 11 | Contract programming and conditional compilation | [11_Contracts_And_Conditional_Compilation.md](./11_Contracts_And_Conditional_Compilation.md) |
| 12 | Traits, error handling, and unit tests | [12_Traits_Error_Handling_And_Testing.md](./12_Traits_Error_Handling_And_Testing.md) |
| 13 | Memory and runtime | [13_Memory_And_Runtime.md](./13_Memory_And_Runtime.md) |
| 14 | Interfacing to C and C++ | [14_Interfacing_To_C_And_Cpp.md](./14_Interfacing_To_C_And_Cpp.md) |
| 15 | Portability, memory safety, and advanced topics | [15_Portability_Memory_Safety_And_Advanced.md](./15_Portability_Memory_Safety_And_Advanced.md) |
| 16 | Use cases and applications | [16_Use_Cases_And_Applications.md](./16_Use_Cases_And_Applications.md) |
| 17 | Security and best practices | [17_Security_And_Best_Practices.md](./17_Security_And_Best_Practices.md) |

---

## By engineering role

| Role | Focus | Key topics |
|------|--------|------------|
| **Software / application** | Native apps, libraries, scripts | 2 (build), 5–9 (core), 10 (templates), 12 (testing), 16 |
| **DevOps / SRE** | Build pipelines, tooling, automation, deployment | 2 (dub, dmd), 11 (conditional compilation), 14 (interop), 16, 17 |
| **Security / cybersecurity** | Auditing, binary analysis, safe coding, supply chain | 4 (types), 11 (contracts), 12 (traits, tests), 15 (memory safety), 16, 17 |
| **Systems / low-level** | Compilers, kernels, drivers, inline asm, ABI | 13 (GC, manual memory), 14 (C/C++), 15 (iasm, ABI, Better C), 16 |
| **Research / prototyping** | Experiments, performance, metaprogramming | 10 (templates), 11 (contracts), 12 (traits), 13–15, 16 |

---

## Coverage

All 46 chapters of the D Language Reference (Introduction through Editions) are reflected in this section: basics (lexical, modules, declarations, types, properties, attributes, pragmas), core (expressions, statements, arrays, associative arrays, structs, classes, interfaces, enums, type qualifiers, functions, operator overloading), advanced (templates, template mixins, contracts, conditional compilation, traits, error handling, unit tests, garbage collection, floating point, inline assembler, embedded documentation, interfacing to C/C++/Objective-C, portability, memory safety, ABI, vector extensions, Better C, ImportC, live functions, Windows, glossary, legacy, editions), plus use cases and security.

---

## Further reading

- [D language](https://dlang.org/)
- [D Language Reference](https://dlang.org/spec/spec.html)
- [dub (package manager)](https://code.dlang.org/)
