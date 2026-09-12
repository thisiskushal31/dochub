# Compose Multiplatform and testing

[← Back to Kotlin](./README.md)

Compose Multiplatform extends Jetpack Compose to multiple platforms so you can share UI code across Android, iOS, desktop (JVM), and web (Kotlin/Wasm). Multiplatform tests run in common and platform-specific source sets so shared logic and platform code can be verified on each target. This topic summarizes Compose Multiplatform and multiplatform testing so you can share UI and validate it across platforms.

## Compose Multiplatform

**Compose Multiplatform** is a declarative UI framework based on Kotlin and the same concepts as Jetpack Compose. You describe UI in Kotlin with composable functions; the framework handles rendering on Android, iOS, desktop, and web. That allows maximum UI code reuse while still allowing platform-specific composables or native interop where needed.

Use cases include apps that target Android and iOS (and optionally desktop) with one UI codebase, or teams that want a single design and implementation across platforms. You can mix shared and native UI: for example, most screens in Compose with a few screens in SwiftUI or UIKit. Stability levels vary by platform (e.g. Android, iOS, desktop are stable; web with Wasm is beta). Tooling includes hot reload in the IDE and previews for common code.

Setup is done via the Compose Multiplatform Gradle plugin and dependencies; you add the appropriate targets (e.g. `android()`, `iosArm64()`, `jvm()`) and configure the Compose compiler and runtime. UI code lives in a shared source set (e.g. `commonMain` or a dedicated compose source set) that compiles to the chosen platforms. For layout, navigation, and theming, you use the same Compose APIs as on Android where they are available; platform-specific behavior is handled through expect/actual or composition local overrides.

## Testing multiplatform code

Tests in Kotlin Multiplatform are organized by source set, mirroring main code. **`commonTest`** compiles to all targets and is the place for tests that exercise shared logic without platform APIs. You can use the **`kotlin.test`** library (annotations like `@Test`, assertions like `assertEquals`, `assertTrue`) in common code. These tests run on each target so you verify behavior everywhere.

**Platform test source sets** (e.g. **`jvmTest`**, **`iosTest`**, **`androidTest`**) compile and run only on that platform. Use them for tests that need platform APIs (e.g. JUnit on JVM, XCTest on iOS) or for integration tests that touch the real platform. Gradle provides a **`<target>Test`** task per target (e.g. `jvmTest`, `iosSimulatorArm64Test`); CI can run the full set so that regressions are caught on all platforms.

Best practices include keeping as much test logic as possible in `commonTest` so one test definition runs everywhere, and using expect/actual or dependency injection to substitute platform-specific behavior in tests. In CI, run the relevant **`<target>Test`** tasks (e.g. `jvmTest`, `iosSimulatorArm64Test`) so that shared and platform-specific tests execute on every push or pull request.

For **Compose UI tests**, use the Compose testing APIs (e.g. semantics, `composeTestTag`) in platform test source sets or in shared code where the testing library supports multiplatform. UI tests that drive the composable tree and assert on content or interaction are often platform-specific (JVM, Android, or iOS) because they run in that platform’s runtime; share test *logic* or helpers in `commonTest` where possible and keep only the launcher or platform glue in the platform test source set. The next topic covers DevOps, CI, and security for Kotlin and multiplatform projects.

---

## Further reading

- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
- [Compose Multiplatform create first app](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
- [Test your multiplatform app](https://kotlinlang.org/docs/multiplatform/multiplatform-run-tests.html)
- [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)
