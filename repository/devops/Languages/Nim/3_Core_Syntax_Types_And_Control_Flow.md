# Core syntax, types, and control flow

[← Back to Nim](./README.md)

## What this topic covers

This topic is about Nim’s **surface syntax** and **core language mechanics** you use in almost every file:

- expressions and statements
- variable declarations and type annotations
- built-in types and collections
- branching and loops

## Why it matters

These pieces are the **foundation** for modules, generics, memory behavior, and tooling later. Weak basics here show up as confusing errors, unclear types at boundaries, and hard-to-review control flow.

## How to read the rest of this page

Explanations come **first**; short snippets illustrate a rule. Prefer writing **small** procedures and **explicit** types in security-sensitive or long-lived code.

## Basic syntax model

Nim uses indentation-based blocks. Procedures and control-flow blocks are visually structured, which helps readability but requires consistent formatting.

Text first: minimal syntax skeleton:

```nim
proc add(a, b: int): int =
  a + b

let result = add(2, 3)
echo result
```

## Core built-in types you should know first

- **Integers and floats:** numeric operations and explicit size choices when needed.
- **Boolean:** `true` / `false` for control flow and guards.
- **Strings and chars:** text handling, formatting, and parsing pipelines.
- **Sequences/arrays:** ordered collections; choose based on fixed vs dynamic needs.
- **Tuples/objects:** structured data grouping for local and module-level models.

Type clarity is especially important in interfaces and serialized data paths.

## Variables, mutability, and scope

- `let` is immutable after initialization.
- `var` is mutable and used for state transitions.
- Scope follows block boundaries and module visibility rules.

Text first: mutability example:

```nim
let appName = "tooling"
var retries = 0

while retries < 3:
  retries.inc
```

## Control flow essentials

Nim control flow covers familiar patterns:

- `if / elif / else`
- `case` for value-based branching
- `for` and `while` loops
- exception-driven flow where appropriate

Text first: branch and loop sketch:

```nim
proc classify(x: int): string =
  if x < 0:
    "negative"
  elif x == 0:
    "zero"
  else:
    "positive"

for i in 0 .. 4:
  echo i, " -> ", classify(i - 2)
```

## Engineering guidance

- Prefer clear type intent over overly clever inference in critical code.
- Keep branch logic explicit in security-sensitive paths.
- Validate external input before it reaches business logic.
- Use small procedures to keep control flow auditable.

---

## Further reading

- [Nim documentation portal](https://nim-lang.org/documentation.html)
- [Tutorial, part 1](https://nim-lang.org/docs/tut1.html)
- [Language manual](https://nim-lang.org/docs/manual.html)
- [Searchable index](https://nim-lang.org/docs/theindex.html)
