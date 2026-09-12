# Gradle and build tooling

[← Back to Kotlin](./README.md)

Kotlin projects on the JVM, Android, and multiplatform are typically built with **Gradle**. The Kotlin Gradle plugin compiles Kotlin sources, manages dependencies, and supports the Kotlin DSL for build scripts. This topic covers Gradle setup for Kotlin, compiler options, and related tooling (KSP, Maven, Dokka) so you can configure and maintain builds from a DevOps and engineering perspective.

## Gradle and the Kotlin plugin

Gradle automates building, testing, and packaging. For Kotlin you apply the **Kotlin Gradle plugin** (e.g. **`org.jetbrains.kotlin.jvm`** for JVM, **`org.jetbrains.kotlin.android`** for Android, **`org.jetbrains.kotlin.multiplatform`** for KMP). In **`build.gradle.kts`** (Kotlin DSL), you declare the plugin, set the Kotlin version, and configure source sets and dependencies. The plugin adds tasks such as **`compileKotlin`**, **`compileTestKotlin`**, and **`run`** (when the application plugin is applied).

```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    application
}
application { mainClass.set("MainKt") }
dependencies {
    implementation(kotlin("stdlib"))
}
```

Using the **Kotlin DSL** (`.kts` build scripts) gives you type-safe, IDE-friendly build configuration in Kotlin syntax. Source sets (e.g. **`main`**, **`test`**) define where Kotlin and Java sources live; the default is **`src/main/kotlin`** and **`src/main/java`**, and **`src/test/kotlin`** for tests.

## Compiler options

You pass compiler options in the **`kotlin`** block. Common settings include **`jvmTarget`** (e.g. **`"17"`**), **`languageVersion`** / **`apiVersion`**, and **`freeCompilerArgs`** for flags such as **`-Xopt-in=...`** or **`-Xjvm-default=all`**. Options affect bytecode compatibility and runtime behavior; align **`jvmTarget`** with the Java version your runtime supports and document any non-default flags so that CI and other developers use the same behavior.

```kotlin
kotlin {
    jvmToolchain(17)
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
        freeCompilerArgs.add("-Xjvm-default=all")
    }
}
```

Incremental compilation and build caches speed up repeated builds; the Kotlin plugin supports Gradle’s incremental and cache features. For large projects, the Kotlin daemon can reduce startup overhead.

## Dependencies and repositories

Declare repositories (e.g. **`mavenCentral()`**, **`google()`**) and dependencies in the same way as for Java: **`implementation`**, **`api`**, **`testImplementation`**, etc. The Kotlin standard library is usually added as **`implementation(kotlin("stdlib"))`** or brought in transitively by the Kotlin plugin. For multiplatform, use the **`kotlin("multiplatform")`** plugin and configure source sets and targets (JVM, JS, Native) with their own dependency blocks.

## KSP and annotation processing

**Kotlin Symbol Processing (KSP)** is the recommended way to run annotation processors on Kotlin code. It is faster and more Kotlin-aware than running Java annotation processors via kapt. Add the KSP plugin and list processors in dependencies; KSP runs before compilation and generates code that the compiler then compiles. Use KSP for code generation (e.g. serialization, dependency injection, builders) and prefer it over kapt for new projects.

## Maven

Kotlin can be built with Maven using the **kotlin-maven-plugin**. You define the plugin in **`pom.xml`**, specify **`compile`** and **`test-compile`** executions, and set **`jvmTarget`** and other options in the plugin configuration. Maven is common in enterprise environments; Gradle remains the default in most Kotlin and Android documentation.

## Documentation and tooling

**Dokka** generates API documentation from KDoc comments and supports mixed Kotlin/Java projects and multiple output formats. Integrate it via the Dokka Gradle plugin so that docs are built and published as part of the release process. From a DevOps perspective, keep the Kotlin and Gradle versions consistent across local, CI, and deployment; pin the Kotlin version in the build so that builds are reproducible. Use Gradle’s dependency verification and lockfiles where appropriate to ensure the same binary dependencies are resolved everywhere. The next topic covers Android, server-side, and JVM use cases.

---

## Further reading

- [Gradle](https://kotlinlang.org/docs/gradle.html)
- [Gradle compiler options](https://kotlinlang.org/docs/gradle-compiler-options.html)
- [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [KSP](https://kotlinlang.org/docs/ksp-overview.html)
- [Get started with JVM and Gradle](https://kotlinlang.org/docs/get-started-with-jvm-gradle-project.html)
