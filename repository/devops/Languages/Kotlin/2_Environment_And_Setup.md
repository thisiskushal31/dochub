# Environment and setup

[← Back to Kotlin](./README.md)

To use Kotlin, you need a way to edit source code, compile it, and run it (or build and run tests). The most common setup is an IDE that bundles the Kotlin toolchain; you can also use the command-line compiler and a build system. This topic describes how to install Kotlin and choose an environment for different use cases—JVM console apps, backend development, Android, Kotlin Multiplatform, and data or scripting—so you can run your first program and then move on to the language basics.

## Installing Kotlin

Kotlin is included in IntelliJ IDEA and Android Studio. Download and install one of these IDEs to get Kotlin support without a separate install:

- **IntelliJ IDEA** — Full-featured IDE for JVM, Kotlin Multiplatform, and general Kotlin development. The free Community edition is enough for Kotlin. Use it for console apps, Gradle projects, server-side code, and multiplatform projects.
- **Android Studio** — IDE for Android development; it is based on IntelliJ and includes Kotlin. Use it when your main target is Android.

After installation, create or open a project and add a Kotlin source file (`.kt`). The IDE will compile and run Kotlin using the project’s configured SDK and build system (usually Gradle). You do not need to install a standalone Kotlin compiler for typical development; the IDE and Gradle plugin handle it. For command-line builds or CI, you use Gradle or Maven with the Kotlin plugin, or the Kotlin compiler (`kotlinc`) directly if you are not using a build system.

## Choosing your use case

Your environment and project layout depend on what you want to build. The main options are:

**JVM console application** — A simple program that runs on the JVM and prints to the console. You can create a basic JVM application with the IntelliJ IDEA project wizard (New Project → Kotlin → JVM / IDE). The wizard sets up a Gradle project with the Kotlin JVM plugin. You add a `main` function in a `.kt` file and run it from the IDE or with `./gradlew run`. This is the fastest way to try Kotlin and run the “Hello, world!” example.

**Backend or server-side** — For REST APIs, microservices, or server applications you have two common paths. First, introduce Kotlin into an existing Java project: add the Kotlin dependency and plugin to your Maven or Gradle build, then create Kotlin source files alongside Java. The build compiles both and you can call Java from Kotlin and Kotlin from Java. Second, create a new backend from scratch with Kotlin—for example a RESTful web service with Spring Boot or HTTP APIs with Ktor. In both cases you use Gradle or Maven; the project runs on the JVM and can be deployed like any other JVM application. From a DevOps perspective, build and run are the same as for Java: same JVM, same container images, same process model.

**Kotlin Multiplatform (KMP)** — For shared code across Android, iOS, desktop, or web you set up a multiplatform project. Install the same IDEs (IntelliJ for shared and JVM/desktop, Android Studio for Android, and Xcode for iOS if you target Apple platforms). Create a KMP project from the multiplatform wizard or templates; the project has a common source set and platform-specific source sets. You build and run each target from the IDE or CI (e.g. Gradle tasks for `jvm`, `android`, `iosArm64`). Environment setup includes the Kotlin Multiplatform plugin and, for iOS, the ability to build for Darwin (macOS is required for iOS targets).

**Android only** — Use Android Studio. Create a new Android project and select Kotlin as the language; the project is configured for Android with Kotlin from the start. You run the app on an emulator or device. For Android, follow the standard Android toolchain and system requirements; Kotlin needs no extra install beyond what Android Studio provides.

**Data and notebooks** — For data analysis, exploration, or scripting you can use Kotlin Notebooks inside the IDE (e.g. IntelliJ with the Kotlin Notebook plugin). Notebooks let you run Kotlin cells interactively and integrate with data libraries. This is an alternative to writing scripts or full applications when you want a more exploratory workflow.

## Running your first program

In an IntelliJ or Android Studio project, create a Kotlin file (e.g. `Main.kt`) and define a `main` function:

```kotlin
fun main() {
    println("Hello, world!")
}
```

Run it from the IDE (green Run button or right-click → Run). The IDE compiles and executes the code and shows the output in the run window. For a Gradle project, you can also run the application from the command line in the project directory:

```bash
./gradlew run
```

Gradle compiles the Kotlin sources and runs the main class. For a Maven project, use the appropriate Maven goal (e.g. `mvn compile exec:java` with a configured main class). Once this works, you have a working environment; the next topics cover syntax, types, functions, and the rest of the language so you can read and write Kotlin in any of these use cases.

## Unit tests

To run unit tests, add a test dependency (e.g. JUnit) to your build and place test source files in the test source set. With Gradle, the Kotlin plugin compiles both main and test Kotlin code; you run tests with `./gradlew test` or from the IDE. Writing and running tests is the same idea as in Java: test code lives in a separate source set and is executed by the build or IDE. Later topics cover testing in more detail; for setup, ensure your project has the Kotlin test dependency and that the IDE or build can discover and run tests.

## Project layout (Gradle)

A typical Gradle-based Kotlin JVM project has a root directory with `build.gradle.kts` (or `build.gradle`), `settings.gradle.kts`, and `src/`. Under `src/` you have `main/kotlin/` and `test/kotlin/` (or `main/java` and `test/java` if mixing with Java). Kotlin source files (`.kt`) go under `src/main/kotlin/`; package structure often mirrors directory structure (e.g. `org.example.app` → `src/main/kotlin/org/example/app/`). The Kotlin Gradle plugin compiles everything in `main` and makes the main class available for `./gradlew run` or for packaging into a JAR. Test sources in `test/kotlin/` are compiled and run with `./gradlew test`. Knowing this layout helps you navigate projects, configure CI to run tests and builds, and add new source files in the right place.

## Run configurations and main class

In the IDE, a run configuration tells the environment which class or script to execute. For a JVM application, the configuration usually specifies the main class (the class that has a top-level `main` function or a `main` inside a companion object). Gradle projects often use an application plugin that defines the main class in `build.gradle.kts`; the IDE can import that and create a run configuration from it. For script-like execution, some setups use the Kotlin script runner. When you run from the command line with `./gradlew run`, the same main class is used. Understanding how the main class is chosen is useful when you debug “nothing runs” or when you add a second entry point (e.g. a separate main for a utility).

## Trying Kotlin without installing

You can try Kotlin in the browser at the Kotlin Playground (play.kotlinlang.org). Write code in the editor and run it; no IDE or local install is required. This is useful for quick experiments, sharing snippets, or learning the syntax. For real projects, local setup with an IDE and Gradle or Maven is still the norm so you can use the full standard library, dependencies, and tooling.

## Summary

Install Kotlin by installing IntelliJ IDEA (for JVM, multiplatform, or general Kotlin) or Android Studio (for Android). Choose a project type that matches your goal: JVM console app, backend with Java or Spring/Ktor, Kotlin Multiplatform, or Android. Create a `.kt` file with `main`, run it from the IDE or with Gradle/Maven, and you are ready to learn the language. A typical Gradle project uses `src/main/kotlin/` and `src/test/kotlin/`; the Kotlin plugin compiles and runs your code. For a quick try without installing, use the Kotlin Playground in the browser. The following topics take you through syntax, types, control flow, functions, classes, null safety, and more, so you can use Kotlin for Gradle scripts, Android, backend services, and multiplatform apps from an engineering and DevOps perspective.

---

## Further reading

- [Getting started with Kotlin](https://kotlinlang.org/docs/getting-started.html)
- [Create a basic JVM application (IntelliJ)](https://kotlinlang.org/docs/jvm-get-started.html)
- [Kotlin Multiplatform quickstart](https://kotlinlang.org/docs/multiplatform/quickstart.html)
- [Getting started with Kotlin on Android](https://developer.android.com/kotlin/get-started)
- [Play Kotlin (browser)](https://play.kotlinlang.org/)
- [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
