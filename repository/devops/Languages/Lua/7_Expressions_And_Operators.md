# Expressions and operators

[← Back to Lua](./README.md)

Expressions produce values. Lua has literals (nil, booleans, numbers, strings), variables, table constructors, function definitions, vararg (`...`), and unary and binary operators. Operator precedence and coercion rules determine how expressions are evaluated.

## Literals and primary expressions

Primary expressions include `nil`, `false`, `true`, numerals, literal strings, function definitions, table constructors, and `...` (only inside a variadic function). A parenthesized expression `(exp)` also counts as primary. Variables and function calls are prefix expressions.

## Arithmetic operators

Unary: `-`. Binary: `+`, `-`, `*`, `/`, `//` (floor division), `%` (modulo), `^` (exponentiation). Except for exponentiation and float division: if both operands are integers the result is integer; otherwise operands are converted to floats and the result is float. Integer overflow wraps. Exponentiation and `/` always use floats. Floor division rounds toward minus infinity; modulo is the remainder of that division.

## Bitwise operators

Unary: `~` (bitwise NOT). Binary: `&`, `|`, `~` (XOR), `<<`, `>>`. All operands are converted to integers; result is integer. Shifts fill with zeros; negative displacement reverses direction; very large displacements give zero.

## Coercions and conversions

Bitwise ops convert floats to integers. Exponentiation and `/` convert integers to floats. Other arithmetic with mixed types converts the integer to float. String concatenation accepts numbers (converted to string). The string library can add metamethods so that strings are coerced to numbers in arithmetic; bitwise ops do not coerce strings. Do not rely on string–number coercion for comparison: `"1"==1` is false and `"1"<1` can error. Number-to-string uses an unspecified human-readable format; use `string.format` for a specific format.

## Relational operators

`==`, `~=`, `<`, `>`, `<=`, `>=`. Result is always boolean. Equality compares type first; if different, result is false. Numbers and strings are compared by value; tables, userdata, threads by reference. The `__eq` metamethod can customize comparison for tables and userdata. Order operators: numbers by value, strings by locale, otherwise `__lt`/`__le` metamethods. NaN is not equal, less than, or greater than anything, including itself.

## Logical operators

`and`, `or`, `not`. Only `nil` and `false` are false. `not` returns boolean. `and` returns the first argument if it is false/nil, else the second. `or` returns the first argument if it is not false/nil, else the second. Both use short-circuit evaluation.

## Concatenation and length

`..` concatenates strings; numbers are converted to strings. If an operand is not string or number, the `__concat` metamethod is used. The length operator `#`: for strings, length in bytes; for tables, a “border” (see manual); for other types, `__len` metamethod. Tables that are “sequences” (exactly one border) have an intuitive length; non-sequences can return any of their borders. Table length is O(log n) in the largest integer key.

## Precedence (low to high)

`or` → `and` → `<` `>` `<=` `>=` `~=` `==` → `|` → `~` → `&` → `<<` `>>` → `..` → `+` `-` → `*` `/` `//` `%` → unary `not` `#` `-` `~` → `^`. Concatenation and exponentiation are right-associative; other binaries are left-associative.

## Table constructors

`{ [exp1] = exp2 }` adds key exp1 with value exp2. `name = exp` is the same as `["name"] = exp`. A plain `exp` is the same as `[i] = exp` where `i` is the next consecutive integer starting at 1. Example:

```lua
a = { [f(1)] = g; "x", "y"; x = 1, f(x), [30] = 23; 45 }
```

assigns `t[1]="x"`, `t[2]="y"`, `t.x=1`, `t[3]=f(x)`, `t[30]=23`, `t[4]=45`. Field order is undefined. If the last field is a single expression that returns multiple values, all of them are added as consecutive integer keys.

---

## Further reading

- [Lua 5.5 — §3.4 Expressions](https://www.lua.org/manual/5.5/manual.html#3.4)
