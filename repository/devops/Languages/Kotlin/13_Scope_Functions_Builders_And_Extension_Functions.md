# Scope functions, builders, and extension functions

[← Back to Kotlin](./README.md)

Extension functions and extension properties let you add behavior to existing types without modifying them or using inheritance. They are called on a receiver and can be declared at top level or as members. Scope functions (`let`, `run`, `with`, `apply`, `also`) run a block of code in the context of an object and differ in how the object is referenced inside the block and what they return. Type-safe builders use function literals with receiver to define DSL-style APIs. This topic covers extensions, the five scope functions, and a short note on builders so you can write concise, readable Kotlin.

## Extension functions

An **extension function** is declared by prefixing the function name with a receiver type and a dot. It is called like a member on any value of that type. Extensions do not modify the original class; they are resolved statically—the compiler chooses which function to call based on the declared type of the receiver, not the runtime type.

```kotlin
fun String.truncate(maxLength: Int): String =
    if (length <= maxLength) this else take(maxLength - 3) + "..."

println("Hello, World".truncate(10))  // Hello, ...
```

Extensions can be generic: `fun <T> List<T>.endpoints(): Pair<T, T> = first() to last()`. They can be declared on nullable receiver types; inside the body you must handle null (e.g. with `this == null` or safe calls). If a class has a member with the same signature as an extension, the member wins; extensions can overload members with different parameter lists.

Extension functions are useful for adding utility behavior to types you do not own (e.g. from libraries) and for keeping code organized by grouping operations by receiver type.

## Extension properties

Extension properties are declared like extension functions but with a property name. They cannot have backing fields, so they must define a getter (and optionally a setter). They are useful for computed or delegated values that are logically part of a type.

```kotlin
val String.lastChar: Char get() = this[lastIndex]
```

## Nullable receivers and visibility

An extension on a nullable type (e.g. `fun String?.toStringOrNull(): String`) can be called on null; inside the function, `this` can be null. Extensions use normal visibility rules: a top-level extension is visible according to its modifier (e.g. `internal` in the same module). An extension declared outside a class cannot access that class’s `private` or `protected` members.

## Scope functions

Scope functions execute a block with an object as context. They differ in two ways: how the context object is available inside the block (as `this` or as `it`) and what they return (the lambda result or the context object).

| Function | Context object | Return value |
|----------|----------------|--------------|
| `let`    | `it`           | Lambda result |
| `run`    | `this`         | Lambda result |
| `with`   | `this`         | Lambda result (not an extension; pass object as argument) |
| `apply`  | `this`         | Context object |
| `also`   | `it`           | Context object |

**`let`** receives the object as `it` and returns the lambda result. Use it to run code on a non-null value (e.g. `nullable?.let { use(it) }`), to introduce a short-lived variable, or to chain operations where you need the result of the block.

**`run`** receives the object as `this` and returns the lambda result. Use it when the block mainly calls methods on the object and you need a computed result. The non-extension `run { ... }` runs a block without a context object and returns its result; useful for local scopes or computing a value with several statements.

**`with`** is not an extension; you pass the object as the first argument. Inside the block the object is `this`. Use it to group calls on one object when you do not need to chain or when you are computing a result from that object.

**`apply`** receives the object as `this` and returns the object. Use it for configuring an object: set properties and call methods, then get the same object back. Common for builder-style initialization.

**`also`** receives the object as `it` and returns the object. Use it for side effects (e.g. logging, validation) without changing the object or when you want to keep the object as the result for further chaining.

```kotlin
val person = Person("Alice").apply {
    age = 30
    city = "London"
}
val length = nullableString?.let { it.length } ?: 0
val result = with(config) { buildUrl(host, port) }
```

Avoid nesting scope functions or chaining many of them; that can make the context (`this` vs `it`) hard to follow. If a simple local variable and a few statements are clearer than `apply` or `let`, prefer the variable—scope functions are a tool for conciseness, not a requirement. Prefer the one that matches your intent: “configure and return this” → `apply`; “do something with this and return a new value” → `run` or `with`; “do something with this and return this” → `also`; “unwrap and use” → `let`.

## takeIf and takeUnless

**`takeIf`** returns the receiver if it satisfies the given predicate, otherwise null. **`takeUnless`** returns the receiver if it does not satisfy the predicate, otherwise null. They are useful in chains when you want to filter a single value: `index.takeIf { it >= 0 }?.let { ... }`.

```kotlin
val even = number.takeIf { it % 2 == 0 }
val validIndex = index.takeIf { it in list.indices }
```

## Type-safe builders

Type-safe builders use function types with receiver to create DSL-style APIs. A builder function takes a lambda with receiver (e.g. `HTML.() -> Unit`); inside the lambda, calls are made on the receiver (e.g. `html { head { }; body { } }`). The receiver type defines what methods are available in the block. Builders are often used for HTML, configuration, or Gradle DSLs. The pattern relies on extension lambdas and optional nesting of builder functions; the details are covered in the type-safe builders documentation.

Using extensions and scope functions keeps code concise and intent clear. The next topic covers generics, operator overloading, and related type-system features.

---

## Further reading

- [Extensions](https://kotlinlang.org/docs/extensions.html)
- [Scope functions](https://kotlinlang.org/docs/scope-functions.html)
- [Type-safe builders](https://kotlinlang.org/docs/type-safe-builders.html)
- [Higher-order functions and lambdas](https://kotlinlang.org/docs/lambdas.html)
