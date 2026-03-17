# Interoperability with Java

[← Back to Kotlin](./README.md)

Kotlin is designed to work with Java: you can call Java from Kotlin and Kotlin from Java with minimal friction. Differences in nullability, getters/setters, static members, and exceptions require a few rules and annotations so both sides see a consistent API. This topic covers calling Java from Kotlin (platform types, properties, nullability annotations) and calling Kotlin from Java (names, static members, overloads, checked exceptions) so you can mix both languages in the same project.

## Calling Java from Kotlin

Most Java code is callable from Kotlin as-is. Java getters and setters (no-arg `getX` / single-arg `setX`, or `isX` / `setX` for booleans) are exposed as Kotlin **properties**: you use `obj.name` instead of `obj.getName()`. Methods that return **`void`** in Java return **`Unit`** in Kotlin. If a Java identifier is a Kotlin keyword (e.g. `in`, `object`, `is`), escape it with backticks: **`foo.\`is\`(bar)`**.

### Platform types and null safety

Java types do not express nullability, so references from Java are treated as **platform types** in Kotlin: they may be null or not, and the compiler does not enforce null checks. You can assign a platform-typed value to a nullable (**`String?`**) or non-nullable (**`String`**) variable. If you choose non-nullable, the compiler inserts an assertion; if the value is actually null, you get a null pointer exception at that point. To improve safety, annotate Java code with nullability annotations (**`@Nullable`**, **`@NotNull`**, or equivalent from supported packages); then Kotlin treats those types as nullable or non-nullable. Supported annotation sets include JetBrains, JSpecify, Android, JSR-305, and others.

### SAM and functional interfaces

Java interfaces with a single abstract method (SAM) can be used from Kotlin by passing a lambda; Kotlin converts the lambda to an instance of the interface. So you can write `Runnable { println("Hi") }` or pass a lambda where a Java callback interface is expected.

### Generics and arrays

Java generics are seen as platform types at the type argument level when nullability is unknown. Java arrays are mapped to Kotlin in a specific way: `String[]` is `Array<String>!` (platform type). Kotlin’s variance rules (e.g. `out`/`in`) and Java wildcards are bridged when Kotlin code is compiled for the JVM so that APIs remain usable from both sides.

## Calling Kotlin from Java

Kotlin compiles to JVM bytecode, so Java can call Kotlin classes and methods. A few conventions and annotations make the API comfortable for Java callers.

### Names and package-level functions

Top-level functions and properties in a file **`Example.kt`** in package **`org.example`** are compiled into a Java class **`org.example.ExampleKt`** with static methods. To change the generated class name, use **`@file:JvmName("CustomName")`** at the top of the file. To merge several files into one facade class, use **`@file:JvmName("Utils")`** and **`@file:JvmMultifileClass`** in each file.

### Properties and fields

A Kotlin property compiles to a getter (and setter for `var`), plus a private field when there is a backing field. From Java you call **`getX()`** and **`setX()`**. To expose the field itself to Java (no getter/setter in the bytecode), use **`@JvmField`** on the property (subject to constraints: backing field, not private, no `open`/`override`/`const`, not delegated). **`lateinit`** and **`const`** properties also get static or instance fields as appropriate.

### Static members

Companion object and object members are not static by default: from Java you access them via **`MyClass.Companion.getFoo()`** or **`MyObject.INSTANCE.getBar()`**. To generate real static methods and fields, use **`@JvmStatic`** on the function or property. **`const val`** at top level or in an object is always a static field from Java’s perspective.

### Overloads and default parameters

Kotlin functions can have default parameter values; in Java you see one method with all parameters. To generate overloads for Java (omitting trailing parameters with defaults), annotate the function or constructor with **`@JvmOverloads`**.

### Checked exceptions

Kotlin has no checked exceptions. Kotlin functions do not declare `throws` in bytecode unless you add **`@Throws(IOException::class)`** (or similar). If Java code must catch a Kotlin-thrown exception, annotate the Kotlin function with **`@Throws`** so the Java compiler accepts the catch.

### Nullability and variance

Kotlin generates null checks for public functions with non-null parameters so that passing `null` from Java fails fast with a clear exception. For declaration-site variance (**`out`**/ **`in`**), the compiler emits Java wildcards where needed so that, for example, a Kotlin **`Box<out T>`** parameter is seen in Java as **`Box<? extends T>`** and remains safe to call.

### Resolving name clashes

If two Kotlin functions have the same name and the same JVM signature (e.g. due to type erasure), use **`@JvmName("otherName")`** on one or both so that the generated Java methods have distinct names. The same applies when a property would conflict with a **`getX`**/ **`setX`** method.

Using these rules and annotations keeps Java and Kotlin code working together without surprises. The next topic covers Gradle and build tooling for Kotlin projects.

---

## Further reading

- [Calling Java from Kotlin](https://kotlinlang.org/docs/java-interop.html)
- [Calling Kotlin from Java](https://kotlinlang.org/docs/java-to-kotlin-interop.html)
- [Java interop](https://kotlinlang.org/docs/java-interop.html)
