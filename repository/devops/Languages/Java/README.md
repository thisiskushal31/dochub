# Java

[← Back to Languages](../README.md)

This section is a **deep dive** into Java: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized as **concepts first, then use cases**. You learn the basics (what Java is, environment, syntax, data types, control flow), then core language (OOP, exceptions, I/O), then concurrency and collections, then build tools and JVM basics, and finally where and how Java is used—DevOps, CI/CD (Jenkins), microservices, security, and use cases by engineering role. Each topic is self-contained and in-depth: the body never attributes content to external sources; explanations come first, then code only when it illustrates the idea. For more depth, use the links in the Further reading section at the end of each file.

**Sources for scraping:** Links used to build this section are listed in [DevOps-Handbook-Source/Languages/scraped/java/java_LINKS.md](../../../DevOps-Handbook-Source/Languages/scraped/java/java_LINKS.md). Content is added in batches from those sources.

---

## How to read this section

Read in **number order** for a single path: **concepts first**, then **use cases**.

- **Very basic:** What Java is, JVM/JDK/JRE, environment setup, Hello World.
- **Core language:** Syntax and structure, data types and variables, operators, control flow.
- **OOP and core APIs:** Classes and objects, inheritance and polymorphism, interfaces and packages, exceptions and I/O.
- **Concepts:** Multithreading, collections and generics, build (Maven, Gradle), JVM basics.
- **Use cases:** Where Java appears in practice—DevOps, Jenkins, microservices, security—and use cases by role (software engineering, DevOps/SRE, security/cybersecurity).

---

## Topic index: aligned with documentation

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | What is Java, install, first steps | 1, 2 |
| **Language basics** | Syntax, data types, variables, operators, control flow | 3, 4, 5 |
| **OOP and APIs** | Classes, inheritance, polymorphism, interfaces, exceptions, I/O | 6, 7, 8 |
| **Concurrency and collections** | Threads, synchronization, collections, generics | 9, 10 |
| **Build and tooling** | Maven, Gradle, JVM basics | 11 |
| **Use cases** | DevOps, Jenkins, security, by role | 12, 13 |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what Java is, install JDK, run a simple program. |
| **Core language** | 3 → 5 | Use syntax, data types, variables, operators, and control flow. |
| **OOP and APIs** | 6 → 8 | Write classes, use inheritance and interfaces, handle exceptions and I/O. |
| **Concepts** | 9 → 11 | Work with threads, collections, Maven/Gradle, and JVM basics. |
| **Use cases** | 12 → 13 | Apply Java in DevOps, Jenkins, microservices, security; navigate by role. |

---

## Topics

**Structure:** Very basic → Core language → OOP and APIs → Concepts → Use cases.

| # | Topic | File |
|---|--------|------|
| **Very basic** |
| 1 | What is Java? | [1_What_Is_Java.md](./1_What_Is_Java.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| **Core language** |
| 3 | Syntax and structure | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Data types, variables, and operators | [4_Data_Types_Variables_Operators.md](./4_Data_Types_Variables_Operators.md) |
| 5 | Control flow | [5_Control_Flow.md](./5_Control_Flow.md) |
| **OOP and core APIs** |
| 6 | Classes and objects | [6_Classes_And_Objects.md](./6_Classes_And_Objects.md) |
| 7 | Inheritance, polymorphism, and interfaces | [7_Inheritance_Polymorphism_Interfaces.md](./7_Inheritance_Polymorphism_Interfaces.md) |
| 8 | Exceptions and I/O | [8_Exceptions_And_IO.md](./8_Exceptions_And_IO.md) |
| **Concepts** |
| 9 | Multithreading and concurrency | [9_Multithreading_And_Concurrency.md](./9_Multithreading_And_Concurrency.md) |
| 10 | Collections and generics | [10_Collections_And_Generics.md](./10_Collections_And_Generics.md) |
| 11 | Build (Maven, Gradle) and JVM basics | [11_Build_And_JVM_Basics.md](./11_Build_And_JVM_Basics.md) |
| **Use cases** |
| 12 | DevOps, Jenkins, and security | [12_DevOps_Jenkins_And_Security.md](./12_DevOps_Jenkins_And_Security.md) |
| 13 | Use cases by role | [13_Use_Cases_By_Role.md](./13_Use_Cases_By_Role.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Software / backend** | OOP, collections, build, microservices | 1–11, then 12, 13. |
| **DevOps / SRE** | Build (Maven, Gradle), Jenkins, JVM basics | 1–2, 11, 12, 13. |
| **Security / cybersecurity** | Safe coding, Jenkins, supply chain | 8, 11, 12, 13. |

---

## Scope: what's covered and what's not

**Covered:** What Java is, why and how to use it, and where it fits. Syntax, data types, variables, operators, control flow, OOP (classes, inheritance, polymorphism, interfaces), exceptions and I/O, multithreading, collections and generics, build (Maven, Gradle), JVM basics, and use cases from software engineering, DevOps, and security/cybersecurity perspectives. Concrete examples appear where they illustrate the concept. No attribution in the body; further reading at the end of each file.

**Not covered in depth here (by design):** Every Java SE API, every framework (Spring, etc.), and full JVM internals are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Further reading

- [TutorialsPoint Java Tutorial](https://www.tutorialspoint.com/java/index.htm)
- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [Dev.java – Learn Java](https://dev.java/learn/)
- [The Java™ Tutorials](https://docs.oracle.com/javase/tutorial/index.html)
- [Java SE Specifications (JLS, JVM)](https://docs.oracle.com/javase/specs/)
- [Jenkins documentation](https://www.jenkins.io/doc/)
