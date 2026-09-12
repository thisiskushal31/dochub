# Lexical conventions, blocks, and chunks

[← Back to Lua](./README.md)

Lua’s lexical rules define identifiers, keywords, literals, and comments. The unit of execution is a chunk, which is syntactically a block—a sequence of statements. Understanding tokens, blocks, and chunks helps you read and write scripts and avoid parsing pitfalls.

## Lexical conventions

Lua is free-form: spaces and comments between tokens are ignored except when they separate two tokens. Spaces include space, form feed, newline, carriage return, horizontal tab, and vertical tab.

**Names**  
Identifiers are made of letters, digits, and underscores, and must not start with a digit. They cannot be a reserved word. Lua is case-sensitive: `and` is a keyword; `And` and `AND` are valid names. By convention, names starting with an underscore followed by uppercase letters (e.g. `_VERSION`) are reserved for Lua.

**Reserved words**  
`and`, `break`, `do`, `else`, `elseif`, `end`, `false`, `for`, `function`, `global`, `goto`, `if`, `in`, `local`, `nil`, `not`, `or`, `repeat`, `return`, `then`, `true`, `until`, `while`.

**Strings**  
Short strings are delimited by single or double quotes and support escape sequences (`\n`, `\t`, `\"`, `\'`, `\\`, `\xXX`, `\ddd`, `\u{XXX}` for UTF-8, etc.). A backslash followed by a newline does not insert the newline into the string. The escape `\z` skips the following span of whitespace (including newlines), so you can break long literals across lines without adding that whitespace to the string. Long strings use long brackets: `[[...]]`, or `[=[...]=]` for level 1, so you can include `]]` inside. Long strings do not interpret escapes. Strings are immutable and can contain any byte, including `\0`.

**Numbers**  
Numeric constants can be decimal (with optional fraction and exponent, e.g. `3.14e-2`) or hexadecimal (`0x` or `0X`, with optional `p` exponent). A numeral with a decimal point or exponent is a float; otherwise it is an integer if the value fits in the integer type, else a float. Hexadecimal numerals without radix or exponent are integers; overflow wraps. So `0xFF`, `0x1.0p0`, and `3.0` are all valid; the first is integer, the others float.

**Comments**  
A short comment starts with `--` and runs to the end of the line. A long comment starts with `--` followed by an opening long bracket and runs until the matching closing long bracket.

## Blocks

A **block** is a sequence of statements. An empty statement (a single `;`) is allowed, so you can separate statements with semicolons or start a block with one.

Statements that start with `(` can be ambiguous: the parser may treat the parenthesis as arguments to a previous call. To force a new statement, put a semicolon before the parenthesis:

```lua
;(print or io.write)('done')
```

An **explicit block** is `do` *block* `end`. It is a single statement and limits the scope of local declarations. It is also used to place a `return` in the middle of another block.

## Chunks

The unit of compilation is a **chunk**. Syntactically a chunk is just a block. Semantically, Lua compiles a chunk as the body of an anonymous variadic function. That function has a single external local, `_ENV`, so all free names in the chunk refer to `_ENV.*`. Chunks can declare locals, take arguments (e.g. from the interpreter’s `arg`), and return values.

Execution works in two steps: Lua **loads** the chunk (compiling it to VM instructions) and then **runs** the compiled code. Chunks can be source (in a file or string) or precompiled binary (e.g. from `luac` or `string.dump`); `load` detects the form. Malicious binary chunks can be unsafe, so treat binary from untrusted sources with care.

---

## Further reading

- [Lua 5.5 — §3.1 Lexical Conventions](https://www.lua.org/manual/5.5/manual.html#3.1)
- [Lua 5.5 — §3.3.1 Blocks](https://www.lua.org/manual/5.5/manual.html#3.3.1)
- [Lua 5.5 — §3.3.2 Chunks](https://www.lua.org/manual/5.5/manual.html#3.3.2)
