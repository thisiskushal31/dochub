# D — Lexical, modules, and declarations

[← D README](./README.md)

**Lexical rules** define identifiers, keywords, literals, and comments. **Modules** are the top-level unit of organization: each source file is a module with an optional **module** declaration. **Declarations** introduce symbols (variables, types, functions) and their attributes. Getting these right is required before writing or reading any D code.

**Why modules?** They replace the C/C++ preprocessor model: imports are explicit, and name lookup is predictable. **Why declarations?** D is statically typed; every symbol must be declared with a type (or inferred) before use.

---

## Module declaration

The first declaration in a source file can be a **module** statement naming the module. If omitted, the module name is derived from the file path. Module names typically use dots (e.g. `mypkg.app`).

```d
module mypkg.app;

import std.stdio;
```

---

## Import declaration

**import** makes symbols from another module visible. **Static import** is the default; **renamed** and **selective** imports control which symbols are visible and under what names.

```d
import std.stdio;
import std.algorithm : sort, map;
import std.math as m;
```

---

## Declarations

Declarations introduce **variables**, **functions**, **classes**, **structs**, **enums**, **aliases**, and other symbols. Storage class, type, and optional initializer follow the declaration syntax. Multiple declarations can appear in a block; order and visibility follow the language rules.

```d
int x;
double y = 3.14;
immutable string name = "D";
```

---

## Interpolation expression sequence

D supports **interpolation expression sequences** in strings: expressions can be embedded in string literals so that their result is converted to text. This is used for formatted output and string building without manual concatenation. The exact syntax is defined in the lexical and expression spec (interpolation and **istring**).

---

## Basic syntax rules

Identifiers start with a letter or underscore; keywords (e.g. `module`, `import`, `void`, `class`) are reserved. **Single-line comments** use `//`; **block comments** use `/* ... */`. **Nested comments** are allowed. String literals use double quotes; character literals use single quotes. The full **grammar** of the language (productions and syntax rules) is given in the language reference for parsers and tools.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Modules](https://dlang.org/spec/module.html)
- [D spec: Declarations](https://dlang.org/spec/declaration.html)
- [D spec: Interpolation Expression Sequence](https://dlang.org/spec/istring.html)
- [D spec: Grammar](https://dlang.org/spec/grammar.html)
