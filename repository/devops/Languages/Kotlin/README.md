# Kotlin

[← Back to Languages](../README.md)

This section is a **deep dive** into Kotlin: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized **concepts first, then use cases**. You learn the basics (what Kotlin is, environment, syntax, types, control flow), then functions and classes, then **null safety, collections, lambdas, scope functions, coroutines**, then **Gradle and build tooling**, **Android and server-side**, **Kotlin Multiplatform**, and finally where and how Kotlin is used—Gradle DSL, Android, JVM services, KMP, DevOps, security, and use cases by engineering role. Each topic is self-contained and in-depth. For more depth on any topic, use the links in the Further reading section at the end of each file.

Kotlin is a large language with a broad ecosystem (JVM, Android, Multiplatform, Compose). This section uses **many topic files** (24) so each area is covered in its own place—unlike smaller language sections that combine topics into fewer files.

**Why Kotlin in DevOps and engineering:** **Gradle** build scripts use the Kotlin DSL (`build.gradle.kts`); Android and many JVM projects use Kotlin. It is widely used in backend services and tooling. You will read and write Kotlin when maintaining Gradle builds, JVM stacks, and multiplatform projects. Understanding the language helps with build scripts, automation, and securing dependencies.

---

## How to read this section

Read in **number order** for a single path: **concepts first**, then **use cases**.

- **Very basic:** What Kotlin is, where it runs (JVM, Android, multiplatform), environment and setup, first program, syntax.
- **Core language:** Packages and imports, variables (val, var), basic types, strings and arrays, control flow, functions, classes and objects.
- **Object model and safety:** Inheritance, interfaces, null safety, collections and sequences.
- **Advanced language:** Lambdas, scope functions, extension functions, builders, generics, operator overloading, coroutines, exceptions, annotations and reflection.
- **Interop and tooling:** Java interop, Gradle and build, Android and server-side, Kotlin Multiplatform, Compose Multiplatform, testing.
- **Use cases:** Where Kotlin appears in practice—Gradle, Android, backend, KMP—and use cases by role (software, DevOps/SRE, security). Implementation topics (23–24) cover DevOps/security and use cases by role.

---

## Topic index: aligned with documentation

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | What is Kotlin, environment and setup | 1, 2 |
| **Language basics** | Syntax and structure, variables and types, strings/arrays, control flow, functions | 3, 4, 5, 6, 7 |
| **Classes and OOP** | Classes and objects, inheritance and interfaces, null safety | 8, 9, 10 |
| **Collections and functional** | Collections and sequences, lambdas and higher-order functions, scope functions and extensions | 11, 12, 13 |
| **Advanced language** | Generics and operator overloading, coroutines, exceptions, annotations and reflection | 14, 15, 16, 17 |
| **Interop and build** | Java interop, Gradle and build tooling | 18, 19 |
| **Platforms** | Android and server-side, Kotlin Multiplatform, Compose Multiplatform and testing | 20, 21, 22 |
| **Use cases** | DevOps and security, use cases by role | 23, 24 |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what Kotlin is, where it runs, set up an environment, write a first program. |
| **Core language** | 3 → 7 | Use syntax, packages, variables, types, strings, arrays, control flow, and functions. |
| **Classes and safety** | 8 → 10 | Define classes, use inheritance and interfaces, handle null safety. |
| **Collections and functional** | 11 → 13 | Work with collections, lambdas, scope functions, and extension functions. |
| **Advanced** | 14 → 17 | Use generics, operator overloading, coroutines, exceptions, annotations, reflection. |
| **Interop and build** | 18 → 19 | Call Java from Kotlin, write and read Gradle Kotlin DSL. |
| **Platforms** | 20 → 22 | Understand Android, server-side, KMP, and Compose Multiplatform; run tests. |
| **Use cases** | 23 → 24 | Apply Kotlin in Gradle, Android, backend, KMP; navigate by role; consider DevOps and security. |

---

## Topics

**Structure:** Very basic → Core language → Classes and null safety → Collections and functional → Advanced → Interop and build → Platforms → Use cases.

| # | Topic | File |
|---|--------|------|
| **Very basic** |
| 1 | What is Kotlin? | [1_What_Is_Kotlin.md](./1_What_Is_Kotlin.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| **Core language** |
| 3 | Syntax and structure | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Variables and basic types | [4_Variables_And_Basic_Types.md](./4_Variables_And_Basic_Types.md) |
| 5 | Strings, characters, and arrays | [5_Strings_Characters_And_Arrays.md](./5_Strings_Characters_And_Arrays.md) |
| 6 | Control flow | [6_Control_Flow.md](./6_Control_Flow.md) |
| 7 | Functions | [7_Functions.md](./7_Functions.md) |
| **Classes and OOP** |
| 8 | Classes and objects | [8_Classes_And_Objects.md](./8_Classes_And_Objects.md) |
| 9 | Inheritance, interfaces, and abstract classes | [9_Inheritance_Interfaces_And_Abstract_Classes.md](./9_Inheritance_Interfaces_And_Abstract_Classes.md) |
| 10 | Null safety | [10_Null_Safety.md](./10_Null_Safety.md) |
| **Collections and functional** |
| 11 | Collections and sequences | [11_Collections_And_Sequences.md](./11_Collections_And_Sequences.md) |
| 12 | Lambdas and higher-order functions | [12_Lambdas_And_Higher_Order_Functions.md](./12_Lambdas_And_Higher_Order_Functions.md) |
| 13 | Scope functions, builders, and extension functions | [13_Scope_Functions_Builders_And_Extension_Functions.md](./13_Scope_Functions_Builders_And_Extension_Functions.md) |
| **Advanced language** |
| 14 | Generics and operator overloading | [14_Generics_And_Operator_Overloading.md](./14_Generics_And_Operator_Overloading.md) |
| 15 | Coroutines and async | [15_Coroutines_And_Async.md](./15_Coroutines_And_Async.md) |
| 16 | Exceptions and error handling | [16_Exceptions_And_Error_Handling.md](./16_Exceptions_And_Error_Handling.md) |
| 17 | Annotations, reflection, and KDoc | [17_Annotations_Reflection_And_KDoc.md](./17_Annotations_Reflection_And_KDoc.md) |
| **Interop and build** |
| 18 | Interoperability with Java | [18_Interoperability_With_Java.md](./18_Interoperability_With_Java.md) |
| 19 | Gradle and build tooling | [19_Gradle_And_Build_Tooling.md](./19_Gradle_And_Build_Tooling.md) |
| **Platforms** |
| 20 | Android, server-side, and JVM | [20_Android_Server_Side_And_JVM.md](./20_Android_Server_Side_And_JVM.md) |
| 21 | Kotlin Multiplatform | [21_Kotlin_Multiplatform.md](./21_Kotlin_Multiplatform.md) |
| 22 | Compose Multiplatform and testing | [22_Compose_Multiplatform_And_Testing.md](./22_Compose_Multiplatform_And_Testing.md) |
| **Use cases** |
| 23 | DevOps, CI, and security | [23_DevOps_CI_And_Security.md](./23_DevOps_CI_And_Security.md) |
| 24 | Use cases by role | [24_Use_Cases_By_Role.md](./24_Use_Cases_By_Role.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Software / Android** | App code, Gradle, KMP, Compose | 1–22, then 23, 24 as needed. |
| **Software / backend (JVM)** | Server-side, Spring, Gradle, Java interop | 1–10, 12, 15, 18, 19, 20, then 23, 24. |
| **DevOps / SRE** | Gradle Kotlin DSL, build pipelines, CI for KMP/JVM | 1–3, 7, 19, then 20, 21, 23, 24. |
| **Security** | Supply chain, dependency audit, secure builds | 19, 23, 24. |

---

## Scope: what's covered and what's not

**Covered:** What Kotlin is, why and how to use it, and where it fits. Syntax, packages, variables, types, strings, arrays, control flow, functions, classes, inheritance, interfaces, null safety, collections, lambdas, scope functions, extension functions, builders, generics, operator overloading, coroutines, exceptions, annotations, reflection, Java interop, Gradle and build tooling, Android and server-side overview, Kotlin Multiplatform, Compose Multiplatform, testing, and use cases from Gradle, Android, backend, KMP, DevOps, and security perspectives. Further reading at the end of each file.

**Not covered in depth here (by design):** Every Android or framework API, and every KMP platform detail, are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Sources for this section

Link inventory and scraping plan: **DevOps-Handbook-Source/Languages/scraped/kotlin/kotlin_LINKS.md**. Batches are defined there for scraping the official Kotlin docs (Language and Multiplatform) and merging into the handbook.

---

## Further reading

- [Kotlin documentation](https://kotlinlang.org/docs/home.html)
- [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)
- [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [Play Kotlin](https://play.kotlinlang.org/)
