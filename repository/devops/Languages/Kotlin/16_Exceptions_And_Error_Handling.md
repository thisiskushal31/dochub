# Exceptions and error handling

[← Back to Kotlin](./README.md)

Kotlin uses exceptions for error handling. All exceptions are unchecked: you are not required to declare or catch them, but you can catch and handle them with `try`/`catch`/`finally`. This topic covers throwing and catching exceptions, precondition functions, the `Nothing` type, and how `return` and labels interact with lambdas so you can write robust error paths and clear control flow.

## Throwing exceptions

Use the **`throw`** keyword to throw an exception. The thrown value must be a subtype of `Throwable`. You can pass a message and an optional cause to document the error and chain the original failure.

```kotlin
throw IllegalArgumentException("Invalid argument")
throw IllegalArgumentException("Input must be positive", cause)
```

Exceptions interrupt normal execution: control jumps to the nearest matching `catch` block or, if none, propagates to the caller. Custom exception types are usually subclasses of `Exception` (or `RuntimeException`); use them to model domain-specific errors and to handle different cases in different `catch` blocks.

## Precondition functions

Kotlin provides **`require()`**, **`check()`**, and **`error()`** to enforce preconditions and invariants. They throw if a condition fails and keep intent clear.

**`require(condition) { "message" }** validates function arguments. On failure it throws `IllegalArgumentException`. Use it at the start of a function when the contract cannot be met with the given inputs.

**`check(condition) { "message" }** validates state (e.g. that an object is initialized). On failure it throws `IllegalStateException`. Use it when the failure indicates a bug in usage or sequencing.

**`error("message")`** throws `IllegalStateException` with the given message. Use it for unreachable branches (e.g. the `else` of a `when` that should be exhaustive) or to mark “this should never happen.”

```kotlin
fun setCount(n: Int) {
    require(n >= 0) { "Count must be non-negative" }
    check(initialized) { "Must call init first" }
}
when (role) {
    "admin" -> ...
    "user"  -> ...
    else    -> error("Unknown role: $role")
}
```

## try-catch-finally

**`try`** wraps code that may throw. **`catch`** blocks handle exceptions by type; the first matching catch (the thrown type or a supertype) runs. Order catch blocks from most specific to most general. **`finally`** runs after the try (and any catch), whether or not an exception was thrown; use it for cleanup (e.g. closing resources). You can use `try` with only `catch`, only `finally`, or both.

`try` is an expression: the last expression of the `try` or the matching `catch` is the value. The `finally` block does not change that value.

```kotlin
val n = try { parseInt(input) } catch (e: NumberFormatException) { 0 }
```

For resource cleanup, prefer **`use()`** on types that implement `Closeable` (e.g. files, streams): it closes the resource after the block and handles exceptions so that the close runs even if the block throws. That avoids boilerplate and reduces the chance of leaving resources open.

## Custom exceptions

Define custom exceptions by extending **`Exception`** (or a subclass such as `RuntimeException`). You can take a message and an optional cause. Use a hierarchy (e.g. sealed class or abstract base) to group related errors and catch them at the right level.

```kotlin
class ValidationException(message: String, cause: Throwable? = null) : Exception(message, cause)
```

## The Nothing type

**`Nothing`** is a type that has no values. It is a subtype of every other type. A function that never returns normally (because it always throws or never returns) can be declared with return type **`Nothing`**. That lets the compiler treat code after the call as unreachable and allows using such functions in expressions where any type is expected (e.g. `val s = name ?: fail("name required")`).

**`TODO()`** throws `NotImplementedError` and has return type `Nothing`; use it for stubs.

```kotlin
fun fail(msg: String): Nothing = throw IllegalArgumentException(msg)
val name: String = user.name ?: fail("Name required")
```

## Returns and labels

**`return`** returns from the nearest enclosing function (or anonymous function). Inside a lambda, an unqualified **`return`** returns from the enclosing function, not from the lambda—this is a non-local return. To return only from the lambda, use a **qualified return** with a label: **`return@label value`**. The label is often the name of the function that received the lambda (e.g. `return@forEach`). Alternatively, use an anonymous function instead of a lambda; then a bare `return` exits the anonymous function.

**`break`** and **`continue`** exit or advance the nearest enclosing loop. With a label (**`break@loop`**, **`continue@loop`**) they apply to the labeled loop, which is useful for nested loops.

```kotlin
listOf(1, 2, 3).forEach { if (it == 2) return@forEach; println(it) }
loop@ for (i in 1..3) { for (j in 1..3) { if (j == 2) break@loop } }
```

These rules keep control flow predictable when mixing lambdas, loops, and early returns. The next topic covers annotations, reflection, and KDoc.

---

## Further reading

- [Exceptions](https://kotlinlang.org/docs/exceptions.html)
- [Returns and jumps](https://kotlinlang.org/docs/returns.html)
- [Exception handling in coroutines](https://kotlinlang.org/docs/exception-handling.html)
