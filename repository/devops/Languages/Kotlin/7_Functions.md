# Functions

[← Back to Kotlin](./README.md)

Functions in Kotlin are declared with the `fun` keyword, parameters in parentheses, and an optional return type. They can have default parameter values and named arguments, and they can be written as single-expression functions when the body is just one expression. This topic covers how to define and call functions so you can structure your Kotlin code into reusable pieces.

## Declaring functions

A function declaration has a name, a parameter list, and an optional return type. Parameters use Pascal notation: `name: Type`. The body is either a block in curly braces or a single expression after `=`.

```kotlin
fun double(x: Int): Int {
    return 2 * x
}

fun doubleShort(x: Int) = 2 * x   // return type inferred as Int
```

If the function does not return a useful value, the return type is **`Unit`** and can be omitted. You do not need to write `return Unit`; the compiler inserts it. Functions are called by name with arguments in parentheses: `double(5)`.

## Parameters

Parameters are separated by commas; each must have a type. Inside the function body, parameters are read-only (like `val`). You can give a parameter a **default value** so that callers can omit it:

```kotlin
fun greet(name: String, greeting: String = "Hello") {
    println("$greeting, $name!")
}
greet("World")           // Hello, World!
greet("Kotlin", "Hi")    // Hi, Kotlin!
```

Parameters with default values can appear before parameters without defaults, but then you must use **named arguments** when you want to use the default for the earlier parameter and pass the later one:

```kotlin
fun log(level: Int = 0, message: String) {
    println("[$level] $message")
}
log(message = "Started")   // [0] Started
```

When calling a function, you can name some or all arguments; named arguments can appear in any order. After the first named argument, any following arguments should be named as well to avoid confusion.

## Variable number of arguments (vararg)

A parameter can be marked **`vararg`** so the function accepts zero or more values of that type. Inside the function, the parameter is an array. Only one parameter can be `vararg`; if it is not the last parameter, later parameters must be passed with named arguments. When calling, you can pass elements one by one or spread an array with the `*` operator:

```kotlin
fun sum(vararg numbers: Int): Int {
    return numbers.sum()
}
println(sum(1, 2, 3))           // 6
val arr = intArrayOf(4, 5, 6)
println(sum(*arr))               // 15
```

## Return types

For a function with a block body (curly braces), you must specify the return type explicitly unless it is `Unit`. For a single-expression function (body after `=`), the return type can be inferred; you can still write it for clarity. The compiler does not infer return types for block bodies because control flow can be complex.

## Single-expression functions

When the entire function body is one expression, you can omit the curly braces and use `=`. The return type is usually inferred:

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

This keeps short functions readable. For recursive or mutually recursive functions, or when the inferred type would be too general, add the return type explicitly.

## Member and local functions

Functions can be declared at the top level in a file, inside a class (member functions), or inside another function (local functions). Member functions are called on an instance: `myInstance.myFunction()`. Local functions are visible only inside the enclosing function; they can access the outer function’s parameters and local variables. Local functions help structure logic without exposing helper functions at a wider scope.

## Infix notation

A function with a single parameter can be marked **`infix`** and then called without a dot or parentheses: `x infixFun y` instead of `x.infixFun(y)`. Infix functions must be member or extension functions and must have exactly one parameter with no default and no `vararg`. They are used for readable, domain-style calls (e.g. `a to b` for creating a pair).

## Tail recursion

For recursive functions that call themselves only as the last operation (tail call), you can mark the function with **`tailrec`**. The compiler then optimizes the recursion into a loop, avoiding stack overflow for deep recursion:

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (kotlin.math.abs(x - kotlin.math.cos(x)) < 1E-10) x
    else findFixPoint(kotlin.math.cos(x))
```

**Default value evaluation:** Default parameter values are evaluated when the function is called and the corresponding argument is omitted, not at function definition time. So a default like `list = mutableListOf()` creates a new list per call that omits that argument; a default that calls another function runs only when that default is used.

The next topics cover classes, null safety, and collections; many of the patterns there use functions as parameters (lambdas), which are covered in a later topic.

---

## Further reading

- [Functions](https://kotlinlang.org/docs/functions.html)
- [Lambdas](https://kotlinlang.org/docs/lambdas.html)
- [Returns and jumps](https://kotlinlang.org/docs/returns.html)
