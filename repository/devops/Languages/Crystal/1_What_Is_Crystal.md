# Crystal — What is Crystal?

[← Crystal README](./README.md)

---

## What this language does and why it's here

**What Crystal does:** Crystal is a **statically typed**, **Ruby-like** language that **compiles to native code**. It offers a familiar, readable syntax (similar to Ruby) with type inference, so you rarely annotate types explicitly. It compiles to a single native executable, which simplifies deployment. Typical uses include web applications (e.g. Kemal, Lucky), CLI tools, APIs, and services where performance and a single binary matter.

**Why it's in this handbook:** You may encounter Crystal in **tooling**, **web services**, or **CLIs** in DevOps and integration work. This section lets you (1) understand **what the language is and what it's for**, (2) learn it from **basics to advanced** in order, and (3) see **where and how it is used**—with use cases and security in Topics 13 and 14.

**How to use this section:** Start here and follow the topics in order. We begin with the **very basic** (what a program is, install, structure, literals and types), then **control flow**, **methods and classes**, **modules and generics**, **concurrency**, **Shards and compiler**, and **testing**. At the end, **Topics 13 and 14** show where Crystal is used and how to use it safely. The text explains **why** and **when** to use each feature; for more depth, use the links in Further reading.

---

## Introduction

Crystal is designed to be **human- and machine-friendly**: readable, with strong typing and compile-time checks, and no runtime interpreter. The compiler produces native executables, so you get predictable performance and simple deployment (one binary, no separate runtime). The syntax is inspired by Ruby: methods, blocks, and classes feel familiar, but types are inferred and checked at compile time.

---

## Crystal vs Ruby (if you know Ruby)

Crystal looks like Ruby but behaves differently. **Types** are static and inferred; the compiler checks them at compile time, so many bugs are caught before run. **Performance** is far higher: Crystal compiles to native code via LLVM, while Ruby is interpreted. **Concurrency** uses fibers and channels (CSP-style), not OS threads with a GIL. **Nil** must be handled explicitly: variables that might be uninitialized or absent get a union type (e.g. `String | Nil`); you use `nil?`, `try`, or conditionals before use. **Integer overflow** raises `OverflowError` instead of promoting to big integers. Some Ruby methods are consolidated (e.g. `length`, `size`, `count` become `size` in Crystal). There is no `require_relative`; use `require "./path"`. These differences matter when porting code or reading Crystal as a Rubyist.

---

## Production adoption

Crystal is used in production across several sectors. **SaaS and tooling:** monitoring (e.g. Appmonitor), email (Mailer To Go), QA (Rainforest QA), smart building management (PlaceOS), P2P (GigSmart, Nabobil). **Infrastructure and messaging:** message queues (LavinMQ by 84codes), managed databases (Crunchy Bridge), search (Kagi). **Media and apps:** streaming (JoystickTV), YouTube alternatives (Invidious), gaming (Neopoly). **Specialized:** bioinformatics (Diploid), cybersecurity (Bright Security), automation (PlaceOS backends). Companies often adopt Crystal to get Ruby-like productivity with native performance and a single deployable binary, replacing or complementing Ruby in performance-critical paths.

---

## Features

- **Statically typed with inference:** Types are checked at compile time; you can omit type annotations when the compiler can infer them.
- **Native compilation:** No VM; output is a native executable for the target platform.
- **Ruby-like syntax:** Familiar for Rubyists; different semantics (e.g. no dynamic typing, explicit nil handling).
- **Concurrency model:** Lightweight fibers and channels (CSP-style), not OS threads by default; see Topic 9.
- **Shards:** Built-in package manager for dependencies and versioning.
- **C bindings:** Interop with C libraries for system or legacy code; see Topic 15.
- **Macros:** Compile-time code generation and AST manipulation for DSLs and boilerplate; see Topic 15.

For where Crystal is used in practice and how to deploy and secure it, see **[Topic 13 — Use cases and applications](./13_Use_Cases_And_Applications.md)** and **[Topic 14 — Security and best practices](./14_Security_And_Best_Practices.md)**.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal language reference](https://crystal-lang.org/reference/)
