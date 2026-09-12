# Modules, imports, and project structure

[← Back to Nim](./README.md)

## What this topic covers

This chapter explains **one module per file** (in typical code), **import** and **export** rules, and how to **grow a repo** without circular dependencies or unclear public APIs. It is about **structure and naming**, not every pragma in the manual—those remain in **Further reading** for precise semantics.

## Why structure matters

As Nim projects grow, module boundaries and import discipline determine maintainability, build speed, and security review quality.

## Core concepts

- each file is usually a module boundary
- imports control visibility and dependency direction
- exports define stable APIs for consumers

Text first:

```nim
# mathutil.nim
proc square*(x: int): int = x * x

# app.nim
import mathutil
echo square(5)
```

## Project guidance

- keep `main`/entry modules thin
- isolate I/O, core logic, and integration adapters
- avoid circular dependencies

## Naming and style (team consistency)

For **public APIs** and long-lived codebases, aligning with common Nim conventions reduces friction in review and tooling:

- **Types** — typically **PascalCase**.
- **Variables, procedures, fields** — typically **camelCase**; prefer **`let`** when a binding does not change.
- **Constants** — flexible; ALL_CAPS is acceptable especially near C APIs, but not required everywhere.
- **Exception-like types** — often end in **`Error`** or **`Defect`** when they participate in Nim’s exception taxonomy.
- **API wording** — prefer **`subjectVerb`** (e.g. **`fileExists`**) over reversed verb order.

The maintained style document goes deeper (line length, indentation, multiline layout, stdlib naming abbreviations). Teams can also turn **style checks** into hints or errors via compiler options when enforcing consistency in CI.

---

## Further reading

- [Language manual](https://nim-lang.org/docs/manual.html)
- [Standard library style guide](https://nim-lang.org/docs/nep1.html)
