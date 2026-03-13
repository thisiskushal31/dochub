# Haskell

[← Back to Languages](../README.md)

This section is a **deep dive** into Haskell: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized as **concepts first, then use cases**. You learn the basics (syntax, structure, types, purity, functions), then core language and tooling (GHC, Cabal, Stack), then concepts (type classes, I/O and effects, testing, libraries), and finally where and how Haskell is used—DevOps, security and formal methods, and use cases by engineering role. Each topic is self-contained and in-depth: the body never attributes content to external sources; explanations come first, then code only when it illustrates the idea. For more depth, use the links in the Further reading section at the end of each file.

---

## How to read this section

Read in **number order** for a single path: **concepts first**, then **use cases**.

- **Very basic:** What Haskell is and how to install and run it (GHC, REPL, first program).
- **Core language:** Syntax and structure, types and type system, functions and purity, modules and programs.
- **Concepts:** Type classes, I/O and effects, build and packages (Cabal, Stack), testing and tooling, libraries and Hackage.
- **Use cases:** Where Haskell appears in practice—DevOps, security tooling, formal methods—and use cases by role (software engineering, DevOps/SRE, security, research).

---

## Topic index: aligned with documentation

The table below maps common documentation areas to this handbook so you can find where each area is covered.

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | |
| What is Haskell, install, first steps | 1, 2 |
| **Language and tutorials** | |
| Syntax, types, functions, modules | 3–6 |
| **Manuals and guides** | |
| GHC User's Guide (syntax, types, compilation) | 2, 3, 4, 9 |
| Cabal / Stack (build, packages) | 9 |
| Haddock, How to Write a Haskell Program | 9, 10 |
| **Library and language** | |
| Hoogle, Hackage, Stackage, Typeclassopedia | 4, 7, 10 |
| Haskell 2010 report | 3, 4, Further reading |
| **Use cases** | |
| Security tooling, formal methods, DevOps | 11, 12 |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what Haskell is, install GHC and tooling, run code and the REPL. |
| **Core language** | 3 → 6 | Use syntax and structure, types, functions, purity, and modules. |
| **Concepts** | 7 → 10 | Work with type classes, I/O and effects, Cabal/Stack, testing, and libraries. |
| **Use cases** | 11 → 12 | Apply Haskell in DevOps, security, formal methods; navigate by engineering role. |

---

## Topics

**Structure:** Very basic → Core language → Concepts → Use cases.

| # | Topic | File |
|---|--------|------|
| **Very basic** |
| 1 | What is Haskell? | [1_What_Is_Haskell.md](./1_What_Is_Haskell.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| **Core language** |
| 3 | Syntax and structure | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Types and type system | [4_Types_And_Type_System.md](./4_Types_And_Type_System.md) |
| 5 | Functions and purity | [5_Functions_And_Purity.md](./5_Functions_And_Purity.md) |
| 6 | Modules and programs | [6_Modules_And_Programs.md](./6_Modules_And_Programs.md) |
| **Concepts** |
| 7 | Type classes | [7_Type_Classes.md](./7_Type_Classes.md) |
| 8 | I/O and effects | [8_IO_And_Effects.md](./8_IO_And_Effects.md) |
| 9 | Build and packages (Cabal, Stack) | [9_Build_And_Packages.md](./9_Build_And_Packages.md) |
| 10 | Testing and tooling | [10_Testing_And_Tooling.md](./10_Testing_And_Tooling.md) |
| **Use cases** |
| 11 | DevOps, security, and formal methods | [11_DevOps_Security_Formal_Methods.md](./11_DevOps_Security_Formal_Methods.md) |
| 12 | Use cases by role | [12_Use_Cases_By_Role.md](./12_Use_Cases_By_Role.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Software / backend** | Types, purity, modules, type classes, testing, libraries | 1–10, then 11, 12. |
| **DevOps / SRE** | Build (Cabal, Stack), CI, Haskell in tooling | 1–2, 9, 11, 12. |
| **Security / cybersecurity** | Safe use, formal methods, high-assurance tooling | 7, 8, 11, 12. |
| **Research / formal methods** | Purity, types, language report, verification | 4, 5, 7, 11, 12. |

---

## Scope: what's covered and what's not

**Covered:** What Haskell is, why and how to use it, and where it fits. Syntax and structure, types and type system, functions and purity, modules and programs, type classes, I/O and effects, build and packages (Cabal, Stack), testing and tooling, and use cases from software engineering, DevOps, security, and cybersecurity perspectives. Concrete commands and examples appear where they illustrate the concept.

**Not covered in depth here (by design):** Every GHC extension, every library on Hackage, and full formal semantics are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Further reading

- [Haskell documentation](https://www.haskell.org/documentation/)
- [GHC User's Guide](https://www.haskell.org/ghc/docs/latest/html/users_guide/)
- [Cabal User Guide](https://cabal.readthedocs.io/)
- [Stack User Guide](https://docs.haskellstack.org/)
- [Haskell 2010 report (HTML)](https://haskell.org/onlinereport/haskell2010/)
- [Hoogle API Search](https://www.haskell.org/hoogle/)
- [Hackage](https://hackage.haskell.org/)
