# Generics, templates, and macros

[← Back to Nim](./README.md)

## What this topic covers

This chapter introduces **compile-time abstraction** in three layers: **generics** (type-parameterized code), **templates** (syntax-level reuse), and **macros** (AST-level code generation). It explains **when** each is appropriate and **operational** risks (readability, audits). **AST** shapes, **`macros`** API details, and **worked macro examples** are left to the **tutorials** and **manual** in **Further reading**.

## Why this is advanced Nim

Nim's compile-time system is a major differentiator. **Generics**, **templates**, and **macros** build reusable abstractions with **low or zero runtime cost** for the abstraction layer itself—but they increase **review burden** because behavior may be generated rather than spelled out line by line.

## Generics

Generics provide **type-parameterized** procedures, types, and concepts. They preserve **static checking** at each instantiation and are usually the first tool for reusable containers and algorithms.

Text first:

```nim
proc first[T](xs: seq[T]): T =
  xs[0]
```

## Templates

Templates are **hygienic-style compile-time substitutions**: they splice code into call sites, enable **lazy evaluation** of arguments where the language allows, and reduce boilerplate without a full AST pass. They are preferable to macros when **syntax rewriting** is enough.

## Macros

Macros run at **compile time** over **Nim AST** nodes (via **`macros`** and related APIs). They can generate declarations, enforce invariants, or embed mini-languages. They are the most powerful—and easiest to misuse—layer: limit scope, document expected expansions, and add **tests** that cover generated code paths.

## How this ties to tooling

Heavy metaprogramming benefits from **`nim check`**, good **IDE integration** (**`nimsuggest`**), and sometimes **`--expandMacro`** / **`--hint`**-style diagnostics from the compiler when narrowing confusing errors. Treat macro-heavy modules as **security-sensitive** in review.

## Engineering guidance

- Prefer **generics**, then **templates**, then **macros** only when necessary.
- Keep macro APIs **narrow** and **documented**; avoid macro “frameworks” without strong tests.
- Prefer **readability** and **auditability** over cleverness—especially in compliance-heavy environments.

---

## Further reading

- [Tutorial, part 2](https://nim-lang.org/docs/tut2.html)
- [Macro tutorial](https://nim-lang.org/docs/tut3.html)
- [macros module](https://nim-lang.org/docs/macros.html)
- [Language manual](https://nim-lang.org/docs/manual.html)
