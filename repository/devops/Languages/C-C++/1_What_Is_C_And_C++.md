# C / C++ — What is C and C++? Why learn them?

[← C/C++ README](./README.md)

This topic answers **what C is**, **what C++ is**, **why they were created**, and **why they matter** in cybersecurity and general engineering. Each idea is explained in text first, then illustrated so you can write and reason about C in an easy, readable way.

---

## What is C?

**C** is a **general-purpose, procedural, imperative** programming language. It was developed in **1972** by **Dennis Ritchie** at **Bell Telephone Laboratories** (Bell Labs) to implement the **UNIX** operating system. C is:

- **Compiled** — Source code is translated by a **compiler** into **machine code** that runs directly on the CPU. There is no interpreter; execution is fast and predictable.
- **Procedural** — Programs are built from **functions** and **procedures** that operate on data. There are no built-in classes or objects (unlike C++ or Java).
- **Low-level enough** — C lets you work with **pointers**, **memory addresses**, and **bytes**. It is often called a **middle-level** language: higher-level than assembly, but with direct hardware and memory control. C **produces code that runs nearly as fast as code written in assembly language**.
- **Portable** — The same C source can be compiled on different operating systems and CPUs, as long as you avoid implementation-defined or non-portable constructs.
- **Standardized** — The language is defined by ISO/IEC standards: C89/C90, C99, C11, C17, and C23. Standard C has a **small core** and a **standard library** (stdio, stdlib, string, etc.).

**Why C was created:** To write UNIX and system software in a language that was easier than assembly but still efficient and close to the machine. C succeeded B (and BCPL); it became the dominant language for OS kernels, compilers, and tools.

---

## What is C++?

**C++** is an **extension of C** that adds **object-oriented** and **generic** programming. It was created by **Bjarne Stroustrup** in the 1980s. C++ keeps C’s **performance** and **memory model** but adds:

- **Classes and objects** — Data and functions grouped into types (classes); inheritance and polymorphism.
- **Templates** — Generic code that works with any type; the basis of the **Standard Template Library (STL)**.
- **Exceptions** — Error handling with throw/catch.
- **References**, **namespaces**, **operator overloading**, and many other features.

**Relationship to C:** Most **valid C code** is also valid C++ (with a few exceptions). In practice, C is the **foundation**: learning C first gives you a clear model of **memory**, **pointers**, and **compilation**, which makes C++ and security analysis easier. This section focuses on **C**; C++ is used where it adds clarity (e.g. in use cases).

---

## Why learn C?

- **Systems and DevOps** — Kernels, drivers, databases, runtimes, and infrastructure tools are written in C or C++. Reading and contributing to such projects requires C.
- **Performance and control** — When every cycle or byte matters (embedded, real-time, HPC), C (and C++) are the default. You get predictable performance and direct control over memory.
- **Security** — Many vulnerabilities (buffer overflows, use-after-free) are in C/C++ code. Understanding C and its memory layout is essential for **auditing**, **reverse engineering**, and **exploit development**.
- **Foundation for other languages** — C’s model (stack, heap, pointers, compilation) underlies how many languages are implemented or interoperate (e.g. Python’s C API, Rust’s FFI).

---

## Why learn C++?

- **Where C++ is used** — Game engines, browsers, trading systems, and high-performance services are often in C++. The same **memory and performance** benefits as C, with richer abstractions.
- **Backward compatibility** — You can call C from C++ and vice versa; many codebases mix both. Knowing C makes C++ easier.

---

## Facts about C (quick reference)

| Fact | Detail |
| --- | --- |
| Created | 1972, Bell Labs, Dennis Ritchie |
| First major use | UNIX operating system |
| Predecessor | B language (early 1970s) |
| Standardization | ANSI C 1989; ISO C90, C99, C11, C17, C23 |
| Typical use | OS, compilers, drivers, embedded, systems |

---

## How this section is organized

The C/C++ section goes **basics first**, then **C++**, then **use cases and case studies last**:

1. **Basics** (topics 1–4) — What C is, environment, syntax, data types and variables.
2. **Core language** (5–8) — Operators, control flow, functions, arrays and strings.
3. **Memory and types** (9–11) — Pointers, memory and dynamic allocation, structures and unions.
4. **Preprocessor and I/O** (12) — Macros, headers, file handling.
5. **C++ object-oriented programming** (13) — Classes, encapsulation, constructors/destructors, inheritance, polymorphism, references.
6. **C++ templates, STL, exceptions, and more** (14) — Templates, STL, exceptions, multiple inheritance, static members, abstract classes, virtual destructor, smart pointers, namespaces.
7. **Use cases** (15) — Where C/C++ appear in **cybersecurity** and **general engineering**.
8. **Case studies** (16) — Hands-on examples.

Every topic uses **text first, then code blocks** so you can read and write C (and C++ in topics 13–14) in an easy, consistent format.

---

## Further reading

- [C Programming Tutorial — Overview (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_overview.htm)
- [C Programming Tutorial — Applications (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/index.htm)
- [C/C++ README](./README.md) — Topic index.
