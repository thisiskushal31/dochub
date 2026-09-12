# Syntax and structure

[← Back to Kotlin](./README.md)

Kotlin source files are organized with package declarations at the top, optional imports, and then declarations (functions, classes, properties). The language does not require the file system to mirror package names, but following that convention keeps projects easy to navigate. This topic covers packages, imports, the program entry point, comments, and coding conventions so you can read and write well-structured Kotlin code.

## Package declaration

A source file may start with a package declaration. Everything in the file—functions, classes, and top-level properties—belongs to that package. The full name of a function or class is the package name followed by the declaration name.

```kotlin
package org.example

fun printMessage() { /* ... */ }
class Message { /* ... */ }
```

Here the full name of `printMessage()` is `org.example.printMessage`, and the full name of `Message` is `org.example.Message`. If you omit the package declaration, the file’s contents belong to the default package (no name). In real projects, a package is usually used so that names do not clash and so the code can be grouped logically.

## Imports

To use declarations from another package, you add an `import` at the top of the file (after the package line). You can import a single name or all accessible contents of a package.

```kotlin
import org.example.Message          // Message is now available without qualification
import org.example.*                // everything in org.example becomes available
```

If two imported names clash, you can rename one with `as`:

```kotlin
import org.example.Message
import org.test.Message as TestMessage   // TestMessage refers to org.test.Message
```

Imports are not limited to classes: you can import top-level functions and properties, object declarations, and enum constants. A number of packages are imported by default into every Kotlin file (for example `kotlin.*`, `kotlin.collections.*`, `kotlin.ranges.*`, and on the JVM `java.lang.*`), so you can use common types and functions without writing an import.

**Visibility of top-level declarations:** A top-level function, class, or property can be marked `private`; it is then visible only in the file where it is declared. This lets you hide implementation details inside a single source file without creating a separate module.

## Program entry point

The entry point of a Kotlin application is the `main` function. The simplest form takes no arguments:

```kotlin
fun main() {
    println("Hello, world!")
}
```

Another standard form accepts command-line arguments as an array of strings:

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

When you run the program (from the IDE or via Gradle/Maven), execution starts at `main`. You can have only one such entry point per run; for multiple mains in the same project, you choose which one to run via the run configuration or build configuration.

## Comments

Kotlin supports single-line and multi-line comments. Single-line comments start with `//` and run to the end of the line. Block comments are enclosed in `/*` and `*/` and can span several lines. Block comments can be nested.

```kotlin
// This is an end-of-line comment

/*
   This is a block comment
   on multiple lines.
*/

/* The comment starts here
   /* nested comment */
   and ends here. */
```

Comments are for humans; the compiler ignores them. Use them to document intent or to temporarily disable code. For formal API documentation, Kotlin uses KDoc (documentation comments), which are covered in a later topic.

## Coding conventions

Consistent style makes code easier to read and maintain. Common conventions include:

**Names:** Package names are lowercase, often without underscores (e.g. `org.example.project`). Class and object names use upper camel case (`DeclarationProcessor`). Function names, property names, and local variables use lower camel case (`processDeclarations`, `declarationCount`). Constants are often in upper snake case or in an `object` with lower camel case names.

**Files:** If a file contains a single class or interface, the file name usually matches the class name with the `.kt` extension (e.g. `Message.kt`). If a file holds multiple classes or only top-level declarations, the file name should describe its contents (e.g. `StringUtils.kt`). Use upper camel case for file names that correspond to a single type.

**Layout:** In a class, a typical order is: property declarations and initializer blocks, then secondary constructors, then methods, then companion object. Keep related code together so that reading from top to bottom follows the logic. Overloaded functions are usually placed next to each other.

**Formatting:** Indentation is typically four spaces. Braces for function or class bodies go on the same line as the declaration or condition (or on the next line, as long as it is consistent). The IDE can apply a consistent style automatically; using the built-in Kotlin code style in IntelliJ or Android Studio helps keep the project uniform.

**Directory structure:** In pure Kotlin projects, the source layout often mirrors the package structure under the source root: for example, code in package `org.example.app` lives under `src/main/kotlin/org/example/app/`. The common root package is omitted from the path. That is not required by the language (files can be placed arbitrarily), but it keeps navigation and tooling predictable. In multiplatform projects, platform-specific source sets may use a suffix in the file name (e.g. `Platform.jvm.kt`) to avoid JVM file-facade name clashes when the same package and file base name appear in common and platform code.

Following these conventions makes it easier for others (and your future self) to work with the code, and it aligns with what many Kotlin projects and style guides expect. The next topics cover variables, types, control flow, and functions in detail.

---

## Further reading

- [Packages and imports](https://kotlinlang.org/docs/packages.html)
- [Basic syntax](https://kotlinlang.org/docs/basic-syntax.html)
- [Coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- [Keyword reference](https://kotlinlang.org/docs/keyword-reference.html)
