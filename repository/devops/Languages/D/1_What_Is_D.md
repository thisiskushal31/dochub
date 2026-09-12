# D — What is D?

[← D README](./README.md)

---

## What this language does and why it's here

**What D does:** D is a **general-purpose systems programming language** with C-like syntax that compiles to **native code**. It is statically typed and supports both **automatic (garbage-collected)** and **manual memory management**. Programs are structured as **modules** that can be compiled separately and linked with external libraries to produce executables or native libraries.

**Why it's in this handbook:** This section is a **deep dive**: it goes from **very basic** (syntax, modules, types) through **advanced** (templates, contracts, interop) to **implementation and use cases** from **all sides of engineering**—software, DevOps, security, systems, and research. You may encounter D in tooling, native binaries, or legacy code; knowing the language and its artifacts helps with recognition, analysis, and safe deployment no matter your role.

---

## Introduction

D was designed for systems programming: performance, control, and direct mapping to hardware where needed, while still offering high-level features such as garbage collection, modules, and metaprogramming. The compiler produces object files suitable for the system linker; the runtime can be minimal (e.g. Better C) or full-featured with the D runtime and GC.

---

## Features

- **Statically typed:** Types are checked at compile time; type inference is available for locals and other contexts.
- **C-like syntax:** Familiar to C/C++ developers; modules and declarations have a clear structure.
- **Dual memory model:** Use the garbage collector for convenience or manage memory manually for low-level control.
- **Modules:** Code is organized in modules with explicit imports; no single global preprocessor.
- **Metaprogramming:** Templates, compile-time evaluation, and traits support generic and generated code.
- **Interop:** Interfaces to C, C++, and Objective-C allow reuse of existing libraries.

---

## Phases of compilation

Compilation is split into phases: **source character set** (encoding), **lexical analysis** (tokens), **syntax analysis** (parse trees), **semantic analysis** (symbols and types), **optimization** (optional), and **code generation** (object code). This separation supports tooling and incremental workflows.

---

## Memory and object model

The **byte** is the unit of storage; **memory locations** hold scalar types and can be **thread-local**, **immutable**, or **shared**. **Objects** are created by definition, `new`, temporaries, or union active-member changes; each object has a type and a lifetime. Understanding the memory model is important when mixing GC and manual memory or when doing concurrent or low-level code.

For where D is used in practice and how to build and secure it, see **[Topic 16 — Use cases and applications](./16_Use_Cases_And_Applications.md)** and **[Topic 17 — Security and best practices](./17_Security_And_Best_Practices.md)**.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D language](https://dlang.org/)
- [Language Reference](https://dlang.org/spec/spec.html)
