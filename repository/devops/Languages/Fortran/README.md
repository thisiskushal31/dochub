# Fortran

[← Back to Languages](../README.md)

**What this language does and why it's here:** Fortran (Formula Translation) is a general-purpose, imperative language designed for **numeric and scientific computing**. It is widely used in **HPC**, weather and climate modeling, physics, finance, and research. When you operate or secure HPC clusters, scientific pipelines, or research infrastructure, Fortran codebases and build systems often appear; understanding Fortran helps with integration, build, and deployment. This section is a deep dive: it goes from **very basic** (what Fortran is, setup, syntax, types) through **core and advanced** (arrays, procedures, modules, intrinsics, build) to **use-case driven** (where and how it is used, security and DevOps).

---

## How to read this section

Read in **number order** for a single path from beginner to advanced to use cases.

- **Topics 1–4 (Very basic):** What Fortran is, environment setup, basic syntax, data types and variables. Start here if you are new.
- **Topics 5–8 (Core language):** Operators, decisions, loops, numbers and strings. The core you need to write real programs.
- **Topics 9–11 (Data and I/O):** Arrays and dynamic arrays, derived types and pointers, basic and file I/O.
- **Topics 12–15 (Procedures and build):** Procedures (subroutines and functions), modules, intrinsic functions and precision, libraries and build, style and debugging.
- **Topics 16–17 (Use cases and security):** Where Fortran is used (by domain and engineering role) and how to run it safely in production and HPC.

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Fortran is, set up a compiler, write a minimal program, use types and variables. |
| **Core language** | 5 → 6 → 7 → 8 | Use operators, conditionals, loops, and work with numbers and strings. |
| **Data and I/O** | 9 → 10 → 11 | Use arrays (including allocatable), derived types, pointers, and perform I/O to screen and files. |
| **Procedures and build** | 12 → 13 → 14 → 15 | Write subroutines and functions, use modules, intrinsics, and build with make/CMake; apply style and debugging. |
| **Use cases and applications** | 16 | See where Fortran is used: HPC, climate, physics, finance, and by engineering role. |
| **Security and DevOps** | 17 | Apply security and DevOps practices for scientific and HPC environments. |

---

## Topics (in order)

| # | Topic | File |
|---|--------|------|
| **1–4: Very basic** |
| 1 | What is Fortran? | [1_What_Is_Fortran.md](./1_What_Is_Fortran.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Basic syntax | [3_Basic_Syntax.md](./3_Basic_Syntax.md) |
| 4 | Data types, variables, and constants | [4_Data_Types_Variables_Constants.md](./4_Data_Types_Variables_Constants.md) |
| **5–8: Core language** |
| 5 | Operators | [5_Operators.md](./5_Operators.md) |
| 6 | Decisions | [6_Decisions.md](./6_Decisions.md) |
| 7 | Loops | [7_Loops.md](./7_Loops.md) |
| 8 | Numbers, characters, and strings | [8_Numbers_Characters_Strings.md](./8_Numbers_Characters_Strings.md) |
| **9–11: Data and I/O** |
| 9 | Arrays and dynamic arrays | [9_Arrays_And_Dynamic_Arrays.md](./9_Arrays_And_Dynamic_Arrays.md) |
| 10 | Derived data types and pointers | [10_Derived_Types_And_Pointers.md](./10_Derived_Types_And_Pointers.md) |
| 11 | Basic and file input/output | [11_Basic_And_File_IO.md](./11_Basic_And_File_IO.md) |
| **12–15: Procedures and build** |
| 12 | Procedures | [12_Procedures.md](./12_Procedures.md) |
| 13 | Modules | [13_Modules.md](./13_Modules.md) |
| 14 | Intrinsic functions and numeric precision | [14_Intrinsic_Functions_And_Precision.md](./14_Intrinsic_Functions_And_Precision.md) |
| 15 | Program libraries, build, style, and debugging | [15_Libraries_Build_Style_Debugging.md](./15_Libraries_Build_Style_Debugging.md) |
| **16–17: Use cases and security** |
| 16 | Use cases and applications | [16_Use_Cases_And_Applications.md](./16_Use_Cases_And_Applications.md) |
| 17 | Security and DevOps | [17_Security_And_DevOps.md](./17_Security_And_DevOps.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Scientific / HPC developer** | Numerics, performance, parallelism | Basics 1–4, core 5–8, arrays 9, procedures 12–13, intrinsics 14, then **16**, **17**. |
| **DevOps / SRE** | Build, deploy, run on clusters | 2, 11, 15, then **16**, **17**. |
| **Security** | Supply chain, data, HPC hardening | 10, 15, then **16**, **17**. |
| **Research / legacy maintenance** | Reading and extending existing code | 1–4, 9–10, 12–13, **16**, **17**. |

---

## Scope: what's covered and what's not

**Covered (aligned with your goals):** This section gives a full path from zero to use: what Fortran is, why and how to use it, and where it fits (use cases, security, DevOps). It includes every Tutorials Point topic (Overview, Environment, Syntax, Data Types, Variables, Constants, Operators, Decisions, Loops, Numbers, Characters, Strings, Arrays, Dynamic Arrays, Derived Types, Pointers, Basic/File I/O, Procedures, Modules, Intrinsics, Numeric Precision, Libraries, Style, Debugging), plus Use cases and Security/DevOps. That is enough to read and write Fortran, build with make/CMake, and operate in scientific and HPC contexts from software, DevOps, and security perspectives.

**Not covered in depth here (by design):** Some topics are only mentioned or left for further reading so the section stays focused:

- **Format descriptors** — I/O topic 11 mentions format strings; full format syntax (F, I, A, E, G, repeat counts, etc.) is in the Tutorials Point and fortran-lang references. List-directed (`*`) is enough for many cases.
- **Interface blocks** — For external procedures or generic/overloaded procedures; see Procedures (Tutorials Point) and fortran-lang. We cover procedure definition and intent; interfaces are the next step when you need them.
- **Coarrays (Fortran 2008+)** — Language-level parallelism (images, sync); we mention parallelism in Use cases (16). Full treatment is in parallel-programming guides and fortran-lang.
- **Object-oriented Fortran** — Type extension, `class`, polymorphic assignment; fortran-lang has "OOP features." We cover derived types and pointers; OOP builds on those.
- **Common block / EQUIVALENCE** — Legacy features; prefer modules and derived types. Relevant when reading very old code.
- **Fixed-form source** — We assume free-form (`.f90`); fixed-form (columns 7–72, etc.) appears in legacy code; see references if you need it.
- **Interoperability with C** — `bind(c)` and ISO_C_BINDING; important for mixed-language projects; see fortran-lang and compiler docs.

If you need any of these, use the "Further reading" links in the relevant topic or the list below.

---

## Further reading

- [Fortran Tutorial (Tutorials Point)](https://www.tutorialspoint.com/fortran/index.htm) — Structured by topic: Overview, Environment, Syntax, Data Types, Variables, Constants, Operators, Decisions, Loops, Numbers, Characters, Strings, Arrays, Dynamic Arrays, Derived Types, Pointers, I/O, Procedures, Modules, Intrinsics, Numeric Precision, Libraries, Style, Debugging, Quick Guide, Useful Resources.
- [Learn Fortran (fortran-lang.org)](https://fortran-lang.org/learn/)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/)
- [Building programs (fortran-lang.org)](https://fortran-lang.org/learn/building_programs/)
- [GCC Fortran (gfortran)](https://gcc.gnu.org/fortran/)
- [Fortran Wiki](https://fortranwiki.org/)
- [J3: US Fortran Standards Committee](https://j3-fortran.org/)
