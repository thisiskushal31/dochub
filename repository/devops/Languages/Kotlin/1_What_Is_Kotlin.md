# What is Kotlin?

[← Back to Kotlin](./README.md)

Kotlin is a modern, general-purpose programming language that is concise, multiplatform, and designed to interoperate with Java and other languages. It runs on the JVM (Java Virtual Machine), compiles to JavaScript for the browser, and targets native binaries for iOS, macOS, Linux, and Windows through Kotlin Multiplatform. In practice, Kotlin is used for Android apps, JVM backends and services, Gradle build scripts (the Kotlin DSL), and cross-platform mobile and desktop applications. Understanding what Kotlin is, why it is used, and where it appears helps you read and maintain code in all these contexts.

## What is this language?

Kotlin is statically typed: every expression has a type known at compile time, which helps catch errors early and enables tooling and refactoring. The syntax is concise compared to Java: less boilerplate, type inference where the type is obvious, and features such as data classes, null safety in the type system, and first-class support for lambdas and higher-order functions. The language is officially supported for Android development and is the preferred language for new Android code in many projects. On the JVM, Kotlin compiles to bytecode that runs alongside Java; you can call Java from Kotlin and Kotlin from Java, and mix both in the same project. That makes it practical to introduce Kotlin gradually into existing Java codebases or to use Kotlin for new modules while keeping legacy Java.

Beyond the JVM, Kotlin targets other platforms. Kotlin/JS compiles Kotlin to JavaScript for front-end or Node.js. Kotlin Multiplatform (KMP) lets you share business logic across Android, iOS, desktop, and web while keeping platform-specific UI or APIs where needed. So “Kotlin” in practice often means “Kotlin on the JVM” or “Kotlin for Android,” but the same language and many of the same libraries extend to other targets.

## Why is it used?

Kotlin is used where teams want a more concise and expressive language than Java while staying on the JVM and reusing the Java ecosystem. Null safety in the type system (nullable types with `?`) reduces null-pointer bugs. Coroutines provide a clear model for asynchronous and concurrent code. Data classes, sealed classes, and smart casts reduce boilerplate and make typical app and service code shorter and easier to read. For Android, Google has endorsed Kotlin as the preferred language; for Gradle, the Kotlin DSL (`build.gradle.kts`) is the recommended way to write build scripts. In DevOps and engineering, you will often see Kotlin in Gradle builds, Android projects, and JVM microservices; knowing the language helps you maintain, debug, and secure those systems.

## How can I use it?

You write Kotlin in source files (typically `.kt`) and run them using a Kotlin runtime. On the JVM, the Kotlin compiler produces `.class` files that run on any JVM; you can build and run with Gradle, Maven, or the command-line compiler. The usual entry point of an application is the `main` function. A minimal program looks like this:

```kotlin
fun main() {
    println("Hello, world!")
}
```

Another form of `main` accepts command-line arguments as an array of strings:

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

You can run such code from an IDE (IntelliJ IDEA or Android Studio), from a Gradle or Maven build, or from the command line. For Android, you use the Android build tools and run on a device or emulator. For multiplatform projects, you choose a target (e.g. JVM, Android, iOS) and build the corresponding artifact. The rest of this section walks you from environment setup through basics, advanced concepts, and use cases so you can use Kotlin in each of these ways.

## What are the use cases?

Kotlin is used across software engineering, DevOps, and security-related work:

- **Android development** — Native Android apps; Kotlin is the recommended language for new Android code.
- **JVM backends and services** — Microservices, REST APIs, and server-side applications, often with Spring Boot or Ktor; Kotlin can be introduced alongside existing Java.
- **Gradle build scripts** — The Kotlin DSL (`build.gradle.kts`) for configuring builds; many Java, Android, and multiplatform projects use it. DevOps and SRE roles frequently read and edit these scripts.
- **Kotlin Multiplatform** — Shared business logic and optional shared UI (e.g. Compose Multiplatform) for Android, iOS, desktop, and web.
- **Data and tooling** — Data pipelines, notebooks, and scripting on the JVM; Kotlin can call into Java libraries and existing infrastructure code.

From a security and DevOps perspective, Kotlin appears in build pipelines (Gradle), in Android and backend services, and in shared multiplatform code. Auditing dependencies, securing build and run environments, and understanding Kotlin’s null safety and concurrency model all matter when you operate or secure these systems. The following topics cover the language from basics to advanced concepts and then use cases by platform and by engineering role.

## Origin and evolution

Kotlin was developed by JetBrains and first released publicly in 2011. It was designed to address limitations of Java while remaining fully interoperable with the JVM and the existing Java ecosystem. The 1.0 release was in 2016; Google announced first-class support for Kotlin on Android in 2017. Since then, Kotlin has added multiplatform support, a shared compiler and standard library across JVM, JS, and native targets, and a steady stream of language and tooling improvements. The language is open source (Apache 2.0) and developed in the open, with a clear stability and evolution process so that production code remains reliable across versions.

## Comparison with Java

Kotlin is often chosen over Java for new code on the JVM or Android because it reduces boilerplate and encodes common patterns directly in the language. Where Java requires verbose getters, setters, and constructors, Kotlin offers data classes and primary constructors. Where Java uses nullable reference types without type-level distinction, Kotlin uses nullable types (`T?`) so that nullability is explicit and the compiler can enforce checks. Kotlin has no raw types; generics are used consistently. Checked exceptions are not declared in Kotlin; error handling is typically done with return types or exceptions as in many modern languages. Extension functions let you add methods to existing types without inheritance. Smart casts and the `when` expression simplify branching and pattern-like logic. For build scripts, the Gradle Kotlin DSL offers the same expressiveness and IDE support as Kotlin application code. All of this runs on the same JVM as Java, so teams can adopt Kotlin incrementally and keep using Java libraries and tooling.

---

## Further reading

- [Kotlin documentation](https://kotlinlang.org/docs/home.html)
- [Getting started with Kotlin](https://kotlinlang.org/docs/getting-started.html)
- [Kotlin tour (beginner)](https://kotlinlang.org/docs/kotlin-tour-welcome.html)
