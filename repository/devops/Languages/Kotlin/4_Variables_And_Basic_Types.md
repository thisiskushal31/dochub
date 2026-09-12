# Variables and basic types

[← Back to Kotlin](./README.md)

In Kotlin you declare variables with `val` or `var`, and you work with a fixed set of basic types for numbers, booleans, and characters. The compiler can often infer the type from the value you assign, which keeps code concise. This topic covers variables, type inference, and the basic types so you can read and write Kotlin that uses primitives and simple data correctly.

## Variables: val and var

Variables are declared with a keyword, then the name, and optionally a type and an initial value. Use **`val`** for a value that is assigned once and never reassigned; use **`var`** when the value can change later.

```kotlin
val x: Int = 5
var y: Int = 10
y += 1   // OK: var can be reassigned
// x = 6  // Error: val cannot be reassigned
```

You can omit the type when the compiler can infer it:

```kotlin
val name = "Kotlin"   // String
val count = 42        // Int
```

You must either initialize the variable at declaration or declare it and initialize it later; if you defer initialization, you must specify the type:

```kotlin
val a = 5
val b: Int
b = 3
```

Variables can be declared at the top level of a file (outside any function or class); they are then in scope for the rest of the file. Prefer `val` when the reference will not change; it makes intent clear and avoids accidental reassignment.

## Numbers

Kotlin provides built-in types for integers and floating-point numbers. There are no implicit widening conversions: you cannot pass an `Int` where a `Long` or `Double` is expected without an explicit conversion.

**Integer types:** `Byte` (8 bits), `Short` (16 bits), `Int` (32 bits), `Long` (64 bits). Integer literals without a suffix are inferred as `Int` if they fit; if they exceed the range of `Int`, they become `Long`. Append `L` to force a `Long`. For `Byte` or `Short`, you must specify the type explicitly.

```kotlin
val one = 1                    // Int
val threeBillion = 3_000_000_000   // Long (exceeds Int range)
val oneLong = 1L                // Long
val oneByte: Byte = 1           // Byte
```

**Floating-point types:** `Float` (32 bits) and `Double` (64 bits), following IEEE 754. Literals with a decimal point are `Double` by default. Use the suffix `f` or `F` for `Float`.

```kotlin
val pi = 3.14       // Double
val eFloat = 2.718f // Float
```

**Literal forms:** You can use underscores in numeric literals for readability (`1_000_000`). Hex literals use the `0x` prefix (`0xFF`); binary use `0b` (`0b00001011`).

**Conversions:** Number types are not subtypes of each other. To convert, use the conversion functions: `toByte()`, `toShort()`, `toInt()`, `toLong()`, `toFloat()`, `toDouble()`.

```kotlin
val byte: Byte = 1
val intFromByte: Int = byte.toInt()
```

**Arithmetic:** Kotlin supports `+`, `-`, `*`, `/`, `%`. Integer division truncates (e.g. `5 / 2` is `2`). For a fractional result, make at least one operand a floating-point type (e.g. `5 / 2.toDouble()`). Bitwise operations use named functions: `shl`, `shr`, `ushr`, `and`, `or`, `xor`, `inv`.

## Booleans

The type **`Boolean`** has two values: `true` and `false`. Booleans are used in conditions and in logical expressions with `&&`, `||`, and `!`. There is no conversion from numbers or other types to `Boolean`; you must use an expression that yields a boolean (e.g. comparisons such as `x > 0`).

## Characters

The type **`Char`** represents a single character. Character literals use single quotes: `'a'`, `'1'`. Special characters use escape sequences: `\n` (newline), `\t` (tab), `\'`, `\"`, `\\`, `\$`. A Unicode character can be written as `'\uFF00'`. Characters are not numeric types; to get the code point of a digit character, use `digitToInt()`.

**Reading input:** The standard library function `readln()` reads a line from standard input and returns it as a `String`. Use it in console or script-style programs when you need user input. There is no built-in “read number” function; you typically call `readln().toIntOrNull()` or similar and handle `null` for invalid input.

## Type inference and readability

When you declare a variable with an initial value, the compiler infers the type. You can still add an explicit type for clarity or to constrain the type (e.g. to a supertype). Explicit types are especially helpful when the initializer is complex or when you want the variable to have a more general type than the inferred one. The next topic covers strings, characters in context, and arrays.

---

## Further reading

- [Types overview](https://kotlinlang.org/docs/types-overview.html)
- [Numbers](https://kotlinlang.org/docs/numbers.html)
- [Booleans](https://kotlinlang.org/docs/booleans.html)
- [Characters](https://kotlinlang.org/docs/characters.html)
