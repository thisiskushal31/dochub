# Annotations, reflection, and KDoc

[← Back to Kotlin](./README.md)

Annotations attach metadata to code; the compiler and tools use them for code generation, validation, and documentation. Visibility modifiers control where declarations can be seen. KDoc is Kotlin’s documentation format, similar to Javadoc but with Markdown and Kotlin-specific tags. Reflection lets you inspect classes, functions, and properties at runtime. This topic covers declaring and using annotations, visibility, writing KDoc, and the basics of reflection so you can document and introspect your code.

## Annotations

Annotations are declared with **`annotation class`**. They can have parameters (with types that correspond to primitives, `String`, classes, enums, other annotations, or arrays of these). Parameters cannot be nullable. Meta-annotations control how the annotation is applied: **`@Target`** (which elements can be annotated), **`@Retention`** (whether it is kept in bytecode and visible at runtime), **`@Repeatable`** (can be applied multiple times), **`@MustBeDocumented`** (included in generated docs).

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Fancy(val level: String = "default")
@Fancy("high") class MyClass
```

To annotate the primary constructor, add **`constructor`** and put the annotation before it. You can annotate property accessors with **`@get:Ann`** or **`@set:Ann`**. Use-site targets (**`@field:`**, **`@get:`**, **`@set:`**, **`@param:`**, **`@receiver:`**, **`@file:`**) specify which generated Java element gets the annotation when one Kotlin element maps to several (e.g. a property has a field, getter, and setter). For file-level annotations (e.g. **`@file:JvmName("Foo")`**), place the annotation before the package or imports.

Kotlin can instantiate annotation classes in code (not only via reflection); you can pass an annotation instance where an annotation parameter is expected. Java annotations are fully supported; use named arguments when calling them because parameter order is not defined in Java. For experimental or unstable APIs, libraries often use **opt-in** annotations: you must explicitly opt in with **`@OptIn(AnnotationClass::class)`** or a compiler flag so that use of the API is deliberate and documented.

## Visibility modifiers

Four visibility levels apply to top-level declarations and to class members: **`public`** (default), **`private`**, **`protected`**, and **`internal`**.

**Top-level:** `public` is visible everywhere. `private` is visible only in the same file. `internal` is visible everywhere in the same **module** (a set of Kotlin files compiled together, e.g. a Gradle source set or an IntelliJ module). `protected` is not used for top-level declarations.

**Class members:** `private` is visible only inside the class. `protected` is like `private` but also visible in subclasses. `internal` is visible to any client in the same module that sees the class. `public` is visible to any client that sees the class. The visibility of an overridden member can be the same or more visible, not less.

Primary constructor visibility is written as **`class C private constructor(a: Int)`**. Local declarations (inside a function) cannot have visibility modifiers. Getters have the same visibility as the property; setters can be restricted (e.g. **`private set`**).

## KDoc

KDoc comments start with **`/**`** and end with **`*/`**. The first paragraph is the summary; the rest is the detailed description. Block tags start with **`@`** on a new line. Supported tags include **`@param name`**, **`@return`**, **`@throws`** / **`@exception`**, **`@constructor`**, **`@receiver`**, **`@property name`**, **`@see`**, **`@sample`**, **`@author`**, **`@since`**, **`@suppress`** (exclude from generated docs).

Inline markup uses Markdown. To link to another element, put its name in square brackets: **`[foo]`** or **`[label][foo]`**. Qualified names use dots. Tools like Dokka generate HTML or other formats from KDoc.

```kotlin
/**
 * Returns the sum of [a] and [b].
 * @param a first operand
 * @param b second operand
 * @return the sum
 */
fun add(a: Int, b: Int): Int = a + b
```

## Reflection

Reflection lets you inspect and call code at runtime. On the JVM, add the **`kotlin-reflect`** dependency; without it, the reflection APIs are not available. Use **`MyClass::class`** to get a **`KClass<MyClass>`** (the class of a type). Use **`obj::class`** to get the exact class of an instance (bound class reference).

**Callable references:** **`::functionName`** is a function reference; **`ClassName::memberName`** is a member or extension reference; **`obj::memberName`** is a bound reference (receiver fixed). **`::propertyName`** is a property reference; you can call **`.get()`** and, for mutable properties, **`.set()`**. **`::ClassName`** is a constructor reference. These implement function types and can be passed where a lambda is expected (e.g. **`list.filter(::isOdd)`**).

Reflection is useful for serialization, dependency injection, and dynamic dispatch. It has a runtime cost and is less type-safe than direct calls; use it when the structure of types is not known at compile time. The next topic covers interoperability with Java, which affects how annotations and reflection appear on both sides.

---

## Further reading

- [Annotations](https://kotlinlang.org/docs/annotations.html)
- [Visibility modifiers](https://kotlinlang.org/docs/visibility-modifiers.html)
- [KDoc](https://kotlinlang.org/docs/kotlin-doc.html)
- [Reflection](https://kotlinlang.org/docs/reflection.html)
- [Dokka](https://kotlinlang.org/docs/dokka-introduction.html)
