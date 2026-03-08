# Clojure — Data types and literals

[← Clojure README](./README.md)

Clojure is built on the **reader**: text is read into **data structures** (lists, vectors, maps, sets, etc.), which are then evaluated. The reader understands **literals** for numbers, strings, characters, booleans, keywords, symbols, and collections. Most types come from the JVM; Clojure adds **persistent** collection types and **keywords**.

---

## Numbers

**Integers** are written in decimal. They can be arbitrarily large (BigInt when beyond Long range). **Longs** are the default; suffix with `N` for BigInt. **Floats** are doubles; use `M` for BigDecimal. **Ratios** are written as `22/7`.

```clojure
42
1000000N
3.14
22/7
```

---

## Strings and characters

**Strings** are in double quotes; they are Java strings. **Characters** are prefixed with `\`: `\a`, `\newline`, `\space`. Single quotes are not used for strings.

```clojure
"Hello, world!"
\c
```

---

## Booleans and nil

**Booleans** are `true` and `false`. **nil** represents absence of a value (like null) and is logical false in conditionals.

---

## Keywords and symbols

**Keywords** start with a colon and evaluate to themselves. They are used as map keys and enum-like values. **Symbols** are names that refer to something (a var, function, or local); they are not quoted in normal code.

```clojure
:name
:person/address
```

**Symbols** in code are resolved (e.g. to a function). To use a symbol as a value, quote it: `'sym`.

---

## Collections (reader forms)

**Lists** are zero or more forms in parentheses: `(1 2 3)`. The reader produces a list; the evaluator treats the first element as an operator. So data lists must be **quoted**: `'(1 2 3)`.

**Vectors** are in square brackets: `[1 2 3]`. They evaluate to themselves when the elements are evaluated.

**Maps** are key–value pairs in braces: `{:a 1 :b 2}`. Keys are often keywords. Commas between pairs are optional.

**Sets** are distinct values in braces with a leading `#`: `#{1 2 3}`.

```clojure
'(1 2 3)
[1 2 3]
{:a 1, :b 2}
#{1 2 3}
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
