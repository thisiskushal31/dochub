# Lambdas and higher-order functions

[← Back to Kotlin](./README.md)

In Kotlin, functions are first-class: they can be stored in variables, passed as arguments, and returned from other functions. A higher-order function is one that takes functions as parameters or returns a function. Lambdas and anonymous functions are function literals—inline blocks that implement a function type. This topic covers function types, lambda syntax, trailing lambdas, and function literals with receiver so you can use and write APIs that take or return behavior.

## Higher-order functions

A higher-order function accepts one or more function parameters or returns a function. For example, collection operations like `filter`, `map`, and `fold` take a function that defines what to filter, how to transform, or how to combine. Calling such a function usually involves passing a lambda or a function reference.

```kotlin
val items = listOf(1, 2, 3, 4, 5)
val sum = items.fold(0) { acc, i -> acc + i }
val doubled = items.map { it * 2 }
```

The implementation of `fold` (or similar) receives a function and invokes it for each element; the lambda you pass provides the behavior. This pattern keeps logic reusable and composable.

## Function types

Function types are written with a parameter list in parentheses and a return type: `(A, B) -> C` means a function that takes two arguments of types `A` and `B` and returns `C`. A function with no parameters is `() -> A`. The return type must be explicit; `Unit` cannot be omitted. Parameter names can be included for documentation: `(x: Int, y: Int) -> Int`.

A function type can have a **receiver**: `A.(B) -> C` means the function is called on a receiver of type `A` with an argument of type `B` and returns `C`. Such types are used for extension-like lambdas and builders. Nullable function types are written with parentheses: `((Int) -> String)?`.

```kotlin
val compare: (String, String) -> Boolean = { a, b -> a.length < b.length }
val repeat: String.(Int) -> String = { times -> this.repeat(times) }
```

You can get an instance of a function type from a lambda, an anonymous function, a callable reference (`::functionName`, `ClassName::member`), or an object that implements the function type interface (with an `invoke` operator). Invoke a function-typed value with `f(x)` or `f.invoke(x)`; for a receiver type, the receiver can be the first argument or used in extension style: `obj.transform(value)`.

## Lambda expressions

A lambda is a block in curly braces: parameters (and optionally their types) come first, then `->`, then the body. The value of the last expression in the body is the return value. If the lambda has a single parameter and the type can be inferred, you can omit the parameter and use the implicit name `it`.

```kotlin
val sum = { x: Int, y: Int -> x + y }
val isPositive: (Int) -> Boolean = { it > 0 }
```

Lambdas can access variables from the enclosing scope (closure); those variables can be modified from inside the lambda (as with a mutable `var`). Parameters that are unused can be replaced with `_` in destructuring or in the parameter list.

## Trailing lambdas

If the last parameter of a function is a function type, you can pass the lambda outside the parentheses (trailing lambda). If the lambda is the only argument, the parentheses can be omitted.

```kotlin
items.fold(0) { acc, i -> acc + i }
run { println("Hello") }
```

This style is common in Kotlin and keeps call sites readable when the lambda is multi-line.

## Returning a value from a lambda

The last expression in the lambda body is its return value. To return explicitly from the lambda (not from the enclosing function), use a qualified return: `return@label value` where the label is the name of the function that accepted the lambda (e.g. `return@filter`). An unqualified `return` in a lambda returns from the enclosing function, which can be surprising; qualified returns make the intent clear.

## Anonymous functions

An anonymous function looks like a regular function without a name: `fun(x: Int, y: Int): Int = x + y` or with a block body. Use it when you need to specify the return type explicitly or when you want a local `return` to exit the anonymous function rather than the enclosing function. Unlike a lambda, a bare `return` inside an anonymous function returns from that function only.

```kotlin
ints.filter(fun(item) = item > 0)
```

## Function literals with receiver

A function type with receiver (e.g. `String.(Int) -> String`) can be implemented by a lambda that has a receiver. Inside the lambda, `this` refers to the receiver. You can call such a value like an extension: `"hi".repeat(3)` or with the receiver as the first argument: `repeat("hi", 3)`. This pattern is used in type-safe builders and in DSL-style APIs.

```kotlin
val sum: Int.(Int) -> Int = { other -> this + other }
println(1.sum(2))
println(2.sum(3))
```

Lambdas with receiver are often used when building structured data (e.g. HTML or configuration): the builder function takes a lambda with receiver so that inside the block you call methods on the builder object without qualifying them.

## Closures

Lambdas and anonymous functions capture variables from the outer scope. The closure includes the variables visible at the point where the lambda is defined. Captured variables can be read and, if they are mutable, modified. Be aware of lifecycle and concurrency when lambdas capture mutable state.

Using higher-order functions and lambdas is central to Kotlin’s collection API and to many library APIs. The next topic covers extension functions and scope functions, which build on these ideas.

---

## Further reading

- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
- [This expressions](https://kotlinlang.org/docs/this-expressions.html)
- [Inline functions](https://kotlinlang.org/docs/inline-functions.html)
- [Type-safe builders](https://kotlinlang.org/docs/type-safe-builders.html)
