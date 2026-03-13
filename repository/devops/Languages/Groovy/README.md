# Groovy

[← Back to Languages](../README.md)

This section is a **deep dive** into Groovy: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized as **concepts first (topics 1–13), then use cases (topics 14–15)**. You learn the basics (syntax, structure, types, strings, closures), then control flow and Java relation, then concepts (object orientation, GDK and style, tools, testing and DSLs and integration, metaprogramming and data APIs), and finally where and how Groovy is used—DevOps (Jenkins, Gradle) and security and use cases by role. Each topic is self-contained and in-depth: grammar-level detail, semantics, and concrete examples. Explanations come first, then code only when it illustrates the idea. For yet more depth, use the links in the Further reading section at the end of each file.

---

## How to read this section

Read in **number order** for a single path: **concepts (1–13)** then **use cases (14–15)**.

- **Topics 1–2 (Very basic):** What Groovy is and how to install and run it.
- **Topics 3–8 (Core language and Java relation):** Syntax, structure, types, strings, closures, operators, control flow, scripts and classes, differences with Java.
- **Topics 9–13 (Concepts):** Object orientation, GDK and style, tools (groovyc, groovydoc, Grape, IDE), testing and DSLs and integration, metaprogramming and data APIs.
- **Topics 14–15 (Use cases):** DevOps (Jenkins, Gradle) and Security and use cases.

---

## Topic index: aligned with documentation

The following table maps the [official Groovy documentation](https://groovy-lang.org/documentation.html) structure to this handbook so you can find where each area is covered.

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | |
| Download / Install Groovy | 1, 2 |
| Differences with Java | 8 |
| The Groovy Development Kit | 4, 10 |
| Runtime and compile-time metaprogramming | 5 (delegation), 13 |
| The Grape dependency manager | 11 |
| Testing guide | 12 |
| Domain-Specific Languages | 5, 12 |
| Integrating Groovy into applications | 12 |
| Security | 15 |
| Design patterns in Groovy | 10 (style and idioms) |
| Style guide | 10 |
| **Language Specification** | |
| Syntax | 3, 4 |
| Operators | 6 |
| Program structure | 3, 7 |
| Object orientation | 9 |
| Closures | 5 |
| Semantics | 4, 6, 7 |
| **Tools** | |
| groovyc | 2, 11 |
| groovydoc | 11 |
| groovysh | 2, 11 |
| groovyConsole | 2, 11 |
| IDE integration | 11 |
| **Groovy module guides** | |
| Parsing and producing JSON | 13 |
| Working with a relational database | 13 |
| Processing XML | 13 |
| Processing YAML | 13 |
| Processing TOML | (see Further reading in 13) |
| SQL-like querying, Template engines, Servlet, JMX, Design by contract | (see Further reading in 13) |
| **API documentation** | |
| GroovyDoc of Groovy APIs / GDK enhancements | 10, Further reading |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what Groovy is, install the toolchain, run scripts and the REPL. |
| **Core language** | 3 → 5 | Use syntax, structure, types, strings, and closures. |
| **Control flow and Java** | 6 → 8 | Use operators and control flow; understand scripts vs classes and differences with Java. |
| **Concepts** | 9 → 13 | Object orientation, GDK and style, tools (groovyc, groovydoc, Grape, IDE), testing and DSLs and integration, metaprogramming and data APIs. |
| **Use cases** | 14 → 15 | DevOps (Jenkins, Gradle); security and use cases by role. |

---

## Topics

**Structure:** 1–2 Very basic → 3–8 Core language and Java relation → 9–13 Concepts → 14–15 Use cases.

| # | Topic | File |
|---|--------|------|
| **1–2: Very basic** |
| 1 | What is Groovy? | [1_What_Is_Groovy.md](./1_What_Is_Groovy.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| **3–5: Core language** |
| 3 | Syntax and program structure | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Types, strings, and collections | [4_Types_Strings_And_Collections.md](./4_Types_Strings_And_Collections.md) |
| 5 | Closures | [5_Closures.md](./5_Closures.md) |
| **6–8: Control flow and Java** |
| 6 | Operators and control flow | [6_Operators_And_Control_Flow.md](./6_Operators_And_Control_Flow.md) |
| 7 | Scripts and classes | [7_Scripts_And_Classes.md](./7_Scripts_And_Classes.md) |
| 8 | Differences with Java | [8_Differences_With_Java.md](./8_Differences_With_Java.md) |
| **9–13: Concepts** |
| 9 | Object orientation | [9_Object_Orientation.md](./9_Object_Orientation.md) |
| 10 | GDK and style | [10_GDK_And_Style.md](./10_GDK_And_Style.md) |
| 11 | Tools, Grape, and IDE | [11_Tools_Grape_And_IDE.md](./11_Tools_Grape_And_IDE.md) |
| 12 | Testing, DSLs, and integration | [12_Testing_DSLs_And_Integration.md](./12_Testing_DSLs_And_Integration.md) |
| 13 | Metaprogramming and data APIs | [13_Metaprogramming_And_Data_APIs.md](./13_Metaprogramming_And_Data_APIs.md) |
| **14–15: Use cases** |
| 14 | DevOps: Jenkins and Gradle | [14_DevOps_Jenkins_And_Gradle.md](./14_DevOps_Jenkins_And_Gradle.md) |
| 15 | Security and use cases | [15_Security_And_Use_Cases.md](./15_Security_And_Use_Cases.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Application / backend** | Scripts, DSLs, JVM integration, testing, data | 1–13, then 14, 15. |
| **DevOps / SRE** | Jenkins pipelines, Gradle, CI, tools | 1–7, 11, 14, 15. |
| **Security** | Safe use of Groovy, serialization, temp files | 7, 15. |
| **Infrastructure** | Jenkinsfiles, build scripts, tooling | 3–5, 11, 14, 15. |

---

## Scope: what's covered and what's not

**Covered:** What Groovy is, why and how to use it, and where it fits. Syntax, structure, types, strings, closures, operators, control flow, scripts vs classes, differences with Java, object orientation, tools (groovyc, groovydoc, groovysh, groovyConsole), Grape, GDK and style, testing and DSLs and integration, metaprogramming overview, and working with JSON/XML/YAML/databases/templates. Security and use cases from software engineering, DevOps, and security perspectives. Concrete commands appear wherever the concept is introduced.

**Not covered in depth here (by design):** Every GDK method, every AST transformation, and every Jenkins or Gradle API are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Further reading

- [Groovy documentation](https://groovy-lang.org/documentation.html)
- [Single-page documentation](https://groovy-lang.org/single-page-documentation.html)
- [Jenkins Pipeline (Groovy)](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Gradle Groovy DSL](https://docs.gradle.org/current/dsl/)
- [Groovy security](https://groovy-lang.org/security.html)
