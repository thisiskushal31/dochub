# Basic types

[← Back to Erlang](./README.md)

Erlang programs work with **terms**: every value is a term. The basic types are numbers, atoms, tuples, lists, maps, binaries, and a few others (pids, references, funs). Types are dynamic—you do not declare them. Within one clause a variable is bound once (single-assignment). This section explains what each type is, why it exists, and how you use it so you can read and write Erlang with confidence.

**Terms.** Any piece of data of any data type is called a term. Erlang has no user-defined types, only composite types built from terms. Type-test functions like `is_list/1` can return `true` for a term that matches that representation; the tests for built-in types do not have that ambiguity.

**Integers.** Integers are arbitrary-precision, so they can be as large as memory allows. Besides decimal notation you can write integers in a base from 2 to 36: `base#digits`, e.g. `2#101` (5), `16#1f` (31). `$char` gives the ASCII or Unicode code point of the character (e.g. `$A` is 65). Single underscores between digits are allowed as separators (e.g. `1_234_567`). Use integers for counts, indices, and exact arithmetic.

**Floats.** Floats are 64-bit. They must start with a digit and contain a decimal point (e.g. `0.01`, `1.0e6`). Erlang does not support Inf or NaN; operations that would produce them raise a `badarith` exception. Floating-point representation is base-2, so printed decimals can look inexact (e.g. `0.1+0.2` may show as `0.30000000000000004`). For exact decimal fractions (e.g. money), use a dedicated library or work in integer units (e.g. cents). For numeric comparison of floats use `==` with guards that both arguments are floats; `0.0` and `-0.0` are equal as numbers but can differ as terms. Use floats when you need fractional values and accept the limitations of binary floating point.

**Atoms.** Atoms are constants whose value is their name. They start with a lowercase letter or are quoted (e.g. `'Monday'`, `'phone number'`). Examples: `ok`, `error`, `true`, `false`. They are used as tags, options, and status values—for example to distinguish success from failure (`{ok, Result}` vs `{error, Reason}`) or to choose a unit (`inch` vs `centimeter`). The atom table is global and not garbage-collected. **Do not create atoms from arbitrary user input** (e.g. from the network or from file content); you risk exhausting memory. In production, when only a fixed set of atoms is allowed, use `list_to_existing_atom/1` or `binary_to_existing_atom/1` so that unknown strings do not create new atoms.

**Booleans.** In Erlang, `true` and `false` are atoms. Guards and conditionals treat them as booleans. Logical operators: `and`, `or`, `not`, and short-circuit `andalso`, `orelse`.

**Variables.** Variables start with an uppercase letter or underscore. They are **single-assignment**: once bound in a scope, the value does not change. That makes reasoning about concurrency easier because there is no shared mutable state. If you try to match a variable to a different value in the same scope, you get a run-time error (no match).

```erlang
1> N = 42.
42
2> N = 42.
42
3> N = 0.
** exception error: no match of right hand side value 0
```

**Comparison.** `==` and `/=` compare structure (e.g. `1 == 1.0` is `true`). `=:=` and `=/=` require the same type and value (`1 =:= 1.0` is `false`). For ordering use `<`, `=<`, `>`, `>=`. Choosing the right comparison avoids subtle bugs when mixing integers and floats.

**Tuples.** A tuple has a fixed number of elements: `{Term1,...,TermN}`. Use `element(N, Tuple)` to read, `setelement(N, Tuple, Value)` to create a new tuple with one element replaced, `tuple_size/1` for the size. Tuples are immutable. Use them where you need a fixed shape: tagged results (`{ok, X}`, `{error, Reason}`), multi-field records, or messages with a known structure.

**Maps.** A map is a collection of key–value pairs: `#{Key1 => Value1, ...}`. Use the `maps` module or map syntax for access and update. Map size is given by `map_size/1`. Use maps when you need flexible, named structure (options, JSON-like data, or records with many optional fields).

**Lists.** A list is either the empty list `[]` or a head and a tail `[H|T]` where the tail is a list. The form `[a,b,c]` is shorthand for `[a|[b|[c|[]]]]`. Length is O(n); use `length/1` with care on long lists. The `lists` module provides most list operations. Use lists for sequences of varying length, for strings (lists of character codes), and for recursive traversal.

**Strings.** A string literal `"hello"` is shorthand for the list of character codes `[104,101,108,108,111]`. The shell prints lists of printable character codes as strings. Two adjacent string literals are concatenated at compile time. For UTF-8 binary text, use binaries or the `~b` sigil. Use string literals for fixed text; use list or binary functions when you need to manipulate content.

**Binaries and bit strings.** A bit string is untyped memory; bit strings whose length is a multiple of eight are binaries. Use the bit syntax for building and matching (e.g. `<<1,2,3>>`, `<<"ABC">>`). Test with `is_bitstring/1` and `is_binary/1`. Use binaries for raw data, protocol parsing, and file content.

**References, pids, ports, funs.** References are unique (e.g. `make_ref/0`). Pids identify processes; `self/0` returns the current process pid. Ports identify I/O ports. Funs are functional objects (anonymous functions). You use pids and references constantly when doing concurrency and distribution.

**Why this matters.** Types and immutability underpin safe concurrency and clear data flow. Using atoms only for known symbols and avoiding dynamic atom creation keeps the system stable in production. Choosing the right type (list vs map, list vs binary) affects both clarity and performance.

---

## Further reading

- [Data Types](https://www.erlang.org/doc/system/data_types)
- [Expressions](https://www.erlang.org/doc/system/expressions)
- [Reference Manual Introduction](https://www.erlang.org/doc/system/reference_manual)
