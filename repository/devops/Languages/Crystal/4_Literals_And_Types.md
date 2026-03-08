# Crystal — Literals and types

[← Crystal README](./README.md)

Crystal is **statically typed** with **type inference**: every expression has a type, and the compiler infers most of them. **Literals** are the way you write values in source; each literal has a fixed type (e.g. integer, string, array). Understanding literals and basic types is the foundation for variables, methods, and control flow.

**Why literals and types matter:** The compiler needs to know the type of every value to check method calls and prevent errors. Literals give you those types directly: `42` is an `Int32`, `"hello"` is a `String`, `[1, 2]` is an `Array(Int32)`. You will use these in every program.

---

## Nil, Bool, and numbers

`nil` is the single value of the type `Nil`; it represents the absence of a value. Booleans are `true` and `false` (type `Bool`). Integer literals are written in decimal; the compiler picks an integer type (e.g. `Int32`, `Int64`) by value and suffix. Float literals use a dot or exponent: `1.0`, `1e10`.

```crystal
a = nil
b = true
n = 42
f = 3.14
```

---

## String and Char

Double-quoted strings are `String` and support **interpolation** with `#{...}`. Single-quoted values are `Char` (one character).

```crystal
name = "Crystal"
puts "Hello, #{name}!"
ch = 'a'
```

---

## Array and Hash

**Array** literals use square brackets; element type is inferred. **Hash** literals use `=>` for key-value pairs.

```crystal
arr = [1, 2, 3]
hash = {"a" => 1, "b" => 2}
```

---

## Range, Tuple, and Symbol

A **Range** is written as `start..end` (inclusive) or `start...end` (exclusive). **Tuple** and **NamedTuple** group fixed sequences of values. **Symbol** is a lightweight name: `:symbol`.

```crystal
r = 1..10
t = {1, "x"}
nt = {name: "Crystal", year: 2011}
sym = :ok
```

---

## Type inference

Variables and method return types are inferred from their use. You can add explicit type restrictions when you need to narrow or document the type. When a variable might not be initialized on all code paths (e.g. set only in one branch), the compiler infers a **union type** including `Nil` (e.g. `String | Nil`). You must then handle the nil case (with `nil?`, `try`, or `if var`) before using the value.

```crystal
x = 1          # Int32
s = "hello"    # String
arr = [1, 2]   # Array(Int32)
```

---

## Nil and union types

Only `nil` and `false` are **falsey**; everything else (including `0`, `""`, `[]`) is truthy. A type like `String | Nil` (also written **String?** in parameter or return type position) means “maybe a String, maybe nil.” Use **.nil?** to check, **.try** to call a method only when not nil, or **if var** to narrow the type so the compiler knows the variable is non-nil in the branch. This avoids “undefined method on nil” at runtime.

```crystal
def find(id : Int32) : String?
  nil
end

v = find(1)
if v
  puts v.upcase
end
```

---

## Integer overflow and method naming

**Integer overflow** raises `OverflowError` at runtime; Crystal does not auto-promote to arbitrary precision like Ruby. Use a suffix (e.g. `1_i64`) or a type that fits the range when you need large values. **Method naming** differs from Ruby: Crystal uses `size` for length/count in collections (not `length` or `count` in the same way). Being aware of these avoids porting surprises.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Literals](https://crystal-lang.org/reference/syntax_and_semantics/literals.html)
