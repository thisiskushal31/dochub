# Kotlin Multiplatform

[← Back to Kotlin](./README.md)

Kotlin Multiplatform (KMP) lets you share Kotlin code across Android, iOS, desktop, web, and server while keeping native performance and the ability to use platform APIs. You can share only business logic, only UI (with Compose Multiplatform), or both. This topic covers what KMP is, how project structure and source sets work, and how to think about platforms and sharing so you can plan or adopt multiplatform projects.

## What is Kotlin Multiplatform

KMP is an open-source technology that compiles the same Kotlin code to multiple **targets**: JVM (Android, server, desktop), native (e.g. iOS, macOS, watchOS), and JS/Wasm (web). Shared code lives in **common** source sets; platform-specific code lives in **platform** source sets. You avoid duplicating logic across platforms while still using native APIs and UI where needed. Adoption can be gradual: start by sharing a single module (e.g. networking or storage) and expand over time.

Benefits include lower duplication and maintenance cost, faster feature delivery across platforms, and improved collaboration when logic is in one place. Many companies use KMP in production for mobile (Android + iOS), and some share with desktop and web. Native performance is preserved: on iOS, Kotlin/Native produces native binaries and can call platform APIs directly.

## Project structure: targets and source sets

A **target** is a platform you compile to (e.g. `jvm()`, `android()`, `iosArm64()`, `js()`). You declare targets in the Gradle `kotlin { }` block. The compiler then produces the appropriate output for each target (e.g. JVM bytecode, native binaries, or JS).

**Source sets** are the main way to share code. Each source set has a name, a set of targets it compiles to, and its own dependencies and compiler options. Code in a source set may only use APIs that exist on all of its targets.

**`commonMain`** is the default shared source set: it compiles to every declared target. Put platform-agnostic logic here. You cannot use JVM-only or iOS-only APIs in `commonMain`. Use **expect/actual** to declare a common API and provide platform-specific implementations: in `commonMain` you write **`expect fun platformName(): String`**; in **`jvmMain`** and **`iosMain`** you write **`actual fun platformName(): String`** with real implementations.

**Platform source sets** (e.g. **`jvmMain`**, **`iosMain`**, **`androidMain`**) compile only to that target. Put platform-specific code and use platform APIs there. They can depend on `commonMain`; `commonMain` cannot depend on them.

**Intermediate source sets** (e.g. **`appleMain`** for all Apple targets) let you share code among a subset of targets (e.g. all Apple platforms) without putting it in `commonMain`. The compiler creates them when you declare multiple related targets (e.g. `iosArm64()`, `macosArm64()`).

Directory layout typically follows source set names: **`src/commonMain/kotlin`**, **`src/jvmMain/kotlin`**, **`src/iosMain/kotlin`**, and corresponding **`commonTest`**, **`jvmTest`**, **`iosTest`** for tests. IDE support (IntelliJ IDEA, Android Studio) with the Kotlin Multiplatform plugin provides cross-language navigation, run configurations per target, and debugging across Kotlin and Swift.

## Sharing strategies

**Logic only:** Share business logic, networking, and data layers in `commonMain`; keep UI native (Swift/UIKit on iOS, Kotlin/Compose or Views on Android). This is a common starting point and preserves full native UI and behavior.

**Logic and UI:** Use **Compose Multiplatform** to share UI code across Android, iOS, desktop, and optionally web. You write one UI in Kotlin and run it on multiple platforms; platform-specific code is used only where needed (e.g. for native modules or integrations).

**Gradual adoption:** You can add a shared KMP module to an existing Android app and consume it from the app; then add an iOS app that uses the same module. No need to rewrite the whole app at once.

## Supported platforms and stability

KMP supports Android, iOS, desktop (JVM), server (JVM), Kotlin/JS, Kotlin/Wasm, and other Kotlin/Native targets (watchOS, tvOS, etc.). Stability levels vary: Android, iOS, JVM (desktop and server), and Kotlin/JS are **stable** for the core KMP technology; Kotlin/Wasm and some native targets are **beta** or **alpha**. Compose Multiplatform has its own stability per platform (e.g. Android, iOS, desktop stable; Wasm beta). Check the official platform stability page when choosing targets. The next topic covers Compose Multiplatform and testing in more detail.

---

## Further reading

- [Get started with Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)
- [What is Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/kmp-overview.html)
- [Discover project structure](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html)
- [Expect and actual](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
- [Supported platforms and stability](https://kotlinlang.org/docs/multiplatform/supported-platforms.html)
