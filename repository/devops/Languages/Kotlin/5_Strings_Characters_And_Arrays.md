# Strings, characters, and arrays

[← Back to Kotlin](./README.md)

Strings in Kotlin are immutable sequences of characters; you read and transform them with the standard library. Characters are single Unicode code points. Arrays hold a fixed number of elements of the same type and are mutable. This topic covers string literals and templates, character handling, and array creation and use so you can work with text and fixed-size collections.

## Strings

Strings are represented by the type **`String`**. A string value is a sequence of characters in double quotes. You can access a character by index with `s[i]` and iterate over characters with a `for` loop.

```kotlin
val str = "abcd 123"
for (c in str) {
    println(c)
}
```

Strings are immutable: operations that “change” a string return a new `String` and leave the original unchanged. For example, `uppercase()` returns a new string; the original is still the same.

**Concatenation:** Use the `+` operator. If the first operand is a string, other types are converted to string when concatenated:

```kotlin
val s = "abc" + 1
println(s + "def")   // abc1def
```

### String literals

**Escaped strings** use double quotes and support escape sequences (`\n`, `\t`, `\"`, `\\`, `\$`, etc.):

```kotlin
val escaped = "Hello, world!\n"
```

**Multiline strings** use triple quotes and can contain newlines and other characters without escaping. Leading whitespace can be trimmed with `trimMargin()` (by default using `|` as the margin prefix):

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    """.trimMargin()
```

### String templates

String literals can contain template expressions that are evaluated and inserted into the string. A simple variable is prefixed with `$`; an expression is written as `${expression}`:

```kotlin
val i = 10
println("i = $i")                    // i = 10
val s = "abc"
println("$s.length is ${s.length}")  // abc.length is 3
```

Templates work in both escaped and multiline strings. To include a literal `$` where it would be interpreted as the start of a template, use `${'$'}` in the string.

### String formatting

For formatted output (e.g. fixed width, decimal places), use `String.format()` with format specifiers such as `%d` (integer), `%f` (floating-point), `%s` (string). The result is a new string with the placeholders replaced according to the format.

## Characters in strings

Characters in a string are of type `Char`. You can iterate over them, compare them, or convert a digit character to its numeric value with `digitToInt()`. Single characters are written in single quotes: `'a'`, `'9'`.

## Arrays

An **array** holds a fixed number of values of the same type (or subtypes). The most common type is **`Array<T>`**. For many use cases, collections (e.g. `List`, `MutableList`) are preferred because they can grow and shrink and have a richer API; use arrays when you need a fixed-size structure or when interfacing with code that expects an array.

**Creating arrays:** Use `arrayOf()` with the elements, `arrayOfNulls<Type>(size)` for an array of nulls, or the `Array(size) { initializer }` constructor:

```kotlin
val simple = arrayOf(1, 2, 3)
val nulls: Array<Int?> = arrayOfNulls(3)
val squares = Array(5) { i -> (i * i).toString() }
```

**Access and modification:** Use the indexed access operator `[]` to read and write elements. Arrays are mutable:

```kotlin
val arr = arrayOf(1, 2, 3)
arr[0] = 10
println(arr[0])
```

**Iteration:** You can iterate by element or by index using `indices` or `withIndex()`:

```kotlin
val steps = arrayOf("Wake up", "Brush teeth", "Make coffee")
for (i in steps.indices) {
    println(steps[i])
}
for ((index, value) in steps.withIndex()) {
    println("Step $index is \"$value\"")
}
```

**Comparing arrays:** Use `contentEquals()` to compare two arrays by content (same elements in the same order). For nested arrays, use `contentDeepEquals()`.

**Primitive-type arrays:** To avoid boxing, use `IntArray`, `LongArray`, `DoubleArray`, `FloatArray`, `CharArray`, `BooleanArray`, etc. They have no inheritance relation to `Array<T>` but offer similar operations:

```kotlin
val ints = IntArray(5)           // [0, 0, 0, 0, 0]
val filled = intArrayOf(1, 2, 3)
```

**Converting to collections:** Use `.toList()`, `.toSet()`, or `.toMap()` (for arrays of `Pair`) when you need a collection. To pass an array to a function that expects a variable number of arguments, use the spread operator: `*arrayName`.

Arrays are fixed in size; adding or removing elements means creating a new array. For dynamic sequences, prefer lists and other collections, which are covered in a later topic.

---

## Further reading

- [Strings](https://kotlinlang.org/docs/strings.html)
- [Characters](https://kotlinlang.org/docs/characters.html)
- [Arrays](https://kotlinlang.org/docs/arrays.html)
- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
