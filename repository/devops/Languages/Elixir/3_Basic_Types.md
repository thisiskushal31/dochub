# Basic types

[← Back to Elixir](./README.md)

Elixir is dynamically typed: values have types, but variables do not. This topic covers the **basic types** you will use every day—integers, floats, booleans, atoms, and strings—plus **basic arithmetic**, **truthy/falsy** rules, and **structural comparison**. Understanding these is required before lists, pattern matching, and functions.

---

## The main basic types

In IEx you can try:

- **Integers** — e.g. `1`, `0x1F` (hex). They have **arbitrary precision**: the BEAM allocates more space as values grow, so you can work with very large numbers without overflow. Integers are the default for counts, indices, and exact arithmetic.
- **Floats** — e.g. `1.0`. A decimal point and at least one digit are required; `1.0e-10` is scientific notation. Floats are **64-bit** (double precision). Use them for measurements and approximate math; for money or exact decimals, consider a decimal library or integer cents.
- **Booleans** — `true` and `false`. They are atoms underneath (`true == :true`). Use them for conditions and flags.
- **Atoms** — Constants whose name is their value, e.g. `:ok`, `:error`, `:apple`. They are stored in a global table and are not garbage-collected, so do not create atoms from arbitrary user input (e.g. `String.to_existing_atom/1` when you need to convert; otherwise you risk exhausting the atom table). Used for status, options, and tags.
- **Strings** — Double-quoted, **UTF-8** encoded, e.g. `"elixir"`. They are binaries under the hood; `byte_size/1` and `String.length/1` differ when characters use multiple bytes.

Lists and tuples are also ubiquitous; they are covered in Topic 4.

---

## Basic arithmetic

Arithmetic operators behave as expected, with one important rule: the `/` operator **always returns a float**, even when the result is a whole number.

```elixir
10 / 2
# => 5.0
```

For integer division and remainder, use `div/2` and `rem/2`:

```elixir
div(10, 2)
# => 5
rem(10, 3)
# => 1
```

Parentheses are optional for function calls with arguments, but they are usually kept for clarity. Elixir also supports binary, octal, and hexadecimal literals:

```elixir
0b1010   # => 10
0o777    # => 511
0x1F     # => 31
```

For floats, `round/1` gives the nearest integer and `trunc/1` drops the fractional part:

```elixir
round(3.58)   # => 4
trunc(3.58)   # => 3
```

Predicates like `is_integer/1`, `is_float/1`, and `is_number/1` let you check types at runtime when needed. They are often used in guards (e.g. `when is_integer(x)`) to restrict function clauses or in validation logic at boundaries (e.g. parsing config or user input).

---

## Booleans and nil

Elixir has `true` and `false` as booleans. Three operators expect **strict** booleans on the left: `and`, `or`, and `not`. Using a non-boolean there raises `BadBooleanError`.

```elixir
true and true
# => true
false or true
# => true
1 and true
# => ** (BadBooleanError) expected a boolean on left-side of "and", got: 1
```

`and` and `or` are short-circuit: the right side is evaluated only if needed. Elixir also has `nil` to mean “no value.” The operators `||`, `&&`, and `!` work with **truthy** and **falsy** values: only `false` and `nil` are falsy; everything else (including `0` and `""`) is truthy.

```elixir
1 || true    # => 1
nil && 13    # => nil
true && 17   # => 17
!nil         # => true
!1           # => false
```

Use `and`/`or`/`not` when you expect booleans; use `&&`/`||`/`!` when you want to treat `nil` (or `false`) as falsy and anything else as truthy.

---

## Atoms

Atoms are constants named by themselves. They are often used for status (`:ok`, `:error`), options, and as keys or tags. Two atoms are equal only if their names are equal.

```elixir
:apple == :apple
# => true
:ok
# => :ok
```

`true`, `false`, and `nil` are atoms; you can write them without a leading colon.

---

## Strings

Strings are written with double quotes and are UTF-8 encoded. Concatenation uses `<>`; interpolation uses `#{}`.

```elixir
"hello " <> "world!"
# => "hello world!"
name = "Elixir"
"Hello, #{name}!"
# => "Hello, Elixir!"
```

Interpolation can contain any expression that implements the **String.Chars** protocol (e.g. numbers, atoms, structs that implement it). Strings are implemented as **binaries** (contiguous bytes); `byte_size/1` returns bytes and `String.length/1` returns the number of **graphemes** (what users see as characters), which can differ in UTF-8—for example `"hellö"` has 5 graphemes but 6 bytes because "ö" uses two bytes. The `String` module provides Unicode-aware functions (e.g. `String.upcase/1`, `String.split/2`, `String.graphemes/1`). Use `IO.puts/1` to print a string; it returns `:ok`. On Windows, the terminal may not use UTF-8 by default; you can run `chcp 65001` before starting IEx so that Unicode output is correct.

---

## Structural comparison

Elixir provides `==`, `!=`, `<`, `<=`, `>`, `>=`. They perform **structural** comparison: any type can be compared to any other; the result is defined by the language. For numbers, `1 == 1.0` is `true`. If you need to distinguish integers from floats, use strict comparison:

```elixir
1 == 1.0   # => true
1 === 1.0  # => false
```

Understanding basic types, arithmetic, booleans, atoms, strings, and comparison is enough to move on to lists and tuples and then pattern matching.

---

## Further reading

- [Basic types — HexDocs](https://hexdocs.pm/elixir/basic-types.html)
- [Kernel — comparison and guards](https://hexdocs.pm/elixir/Kernel.html)
