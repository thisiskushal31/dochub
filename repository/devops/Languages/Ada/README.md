# Ada

[← Back to Languages](../README.md)

**Why in DevOps and security:** Ada is used in **safety-critical and high-assurance** systems: avionics, defense, rail, medical. Compliance and regulated environments often involve Ada codebases; understanding the language helps with secure development and audit in those domains.

**Format:** Each concept is explained in text first, then illustrated with a **code block** (or diagram) so you see the implementation and are not left guessing. Case studies and hands-on examples follow the same pattern: goal → approach → code → expected behavior. The same format is used for every language in this handbook.

---

## Why Ada was created

In the 1970s the United States Department of Defense (DoD) faced an explosion of programming languages: different projects used different, non-standard dialects or subsets. The DoD issued a request for proposals for a **common, modern programming language**. The winning proposal was from Jean Ichbiah (CII Honeywell-Bull). The first Ada standard was published in **1983**; it was revised in **1995**, **2005**, **2012**, and **2022**, with each revision adding useful features. Ada is now an international standard (ISO/IEC 8652).

---

## Purpose and where it is used

Ada is designed for **reliable, maintainable software** where defects can have severe consequences. Today it is heavily used in:

- **Embedded real-time systems**, many of them safety-critical
- **Aerospace and defense**, civil aviation, rail, medical devices
- Systems with **low memory** (no garbage collector required), **direct hardware interfacing**, and **soft or hard real-time** requirements
- **Low-level systems programming** where safety and predictability matter

It is also used in other domains (e.g. video games, real-time audio, kernel modules). In terms of level and targets, the closest modern relatives are **C++** and **Rust**.

---

## Why Ada is a good fit

- **Readability over conciseness** — Keywords are preferred to symbols; no keyword is an abbreviation.
- **Very strong typing** — New types are easy to introduce; the compiler prevents many misuse errors. Types are explicit; there is almost no type inference.
- **Explicit over implicit** — Little structural typing; semantics are well defined; undefined behavior is minimized. The programmer can give the compiler (and readers) a lot of information, so the compiler can be strict and helpful.
- **Safety by design** — Defects are often caught at **compile time** or by **static analysis**. Parameter modes, range constraints, and contracts help document and enforce expectations.
- **Built-in concurrency** — **Tasks** and **protected objects** are part of the language, suitable for real-time and embedded systems.
- **SPARK** — A provable subset of Ada supports formal verification (absence of run-time errors, compliance with requirements). Many Ada specification features feed directly into SPARK proofs.

---

## What is Ada?

Ada is a **multi-paradigm** language: its core is a clear **procedural/imperative** language (akin to C or Pascal), with support for **object orientation**, **generics**, and some **functional-style** features. Programs are structured with **packages** (specification and body), **subprograms** (procedures and functions), **strong typing**, **subtypes** and **derived types**, **exceptions**, **tasking**, and (from Ada 2012) **contracts** (pre/postconditions, predicates, invariants).

---

## Topics (foundation → advanced)

| # | Topic | File |
|---|--------|------|
| 1 | Basics and syntax | [1_Basics_And_Syntax.md](./1_Basics_And_Syntax.md) |
| 2 | Subprograms and modularity | [2_Subprograms_And_Modularity.md](./2_Subprograms_And_Modularity.md) |
| 3 | Strongly typed language | [3_Strongly_Typed_Language.md](./3_Strongly_Typed_Language.md) |
| 4 | Records and aggregates | [4_Records_And_Aggregates.md](./4_Records_And_Aggregates.md) |
| 5 | Arrays | [5_Arrays.md](./5_Arrays.md) |
| 6 | More types and access types | [6_More_Types_And_Access_Types.md](./6_More_Types_And_Access_Types.md) |
| 7 | Generics, exceptions, and tasking | [7_Generics_Exceptions_Tasking.md](./7_Generics_Exceptions_Tasking.md) |
| 8 | Contracts, interfacing, and OOP | [8_Contracts_Interfacing_OOP.md](./8_Contracts_Interfacing_OOP.md) |
| 9 | More about records | [9_More_About_Records.md](./9_More_About_Records.md) |
| 10 | Fixed-point types | [10_Fixed_Point_Types.md](./10_Fixed_Point_Types.md) |
| 11 | Privacy | [11_Privacy.md](./11_Privacy.md) |
| 12 | Standard library | [12_Standard_Library.md](./12_Standard_Library.md) |
| 13 | Appendices (generic formal types) | [13_Appendices.md](./13_Appendices.md) |
| 14 | Case studies and hands-on examples | [14_Case_Studies_And_Hands_On.md](./14_Case_Studies_And_Hands_On.md) |
| 15 | Use cases: airborne and railway | [15_Use_Cases_Airborne_And_Railway.md](./15_Use_Cases_Airborne_And_Railway.md) |

---

## Further reading

- [Introduction to Ada (learn.adacore.com)](https://learn.adacore.com/courses/intro-to-ada/chapters/introduction.html)
- [Ada 2022 Reference Manual (AdaIC)](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
- [AdaCore Documentation](https://www.adacore.com/documentation) — GNAT, SPARK, reference manuals
- [SPARK (formal verification)](https://learn.adacore.com/courses/intro-to-spark/index.html)
