# Use cases by role

[← Back to Kotlin](./README.md)

Kotlin and Kotlin Multiplatform suit different engineering roles and goals: mobile, backend, Android-only, multiplatform, and DevOps. This topic maps use cases to typical responsibilities so you can see where Kotlin fits and when to consider KMP or Compose Multiplatform.

## Mobile and cross-platform mobile

**Android-only:** Kotlin is the preferred language for Android. You get null safety, conciseness, coroutines, and Jetpack Compose for UI. Use Kotlin for new features and gradually migrate Java code. Focus on Android Studio, Gradle, and the Android SDK; no multiplatform setup required.

**Cross-platform mobile (Android + iOS):** Use **Kotlin Multiplatform** to share business logic, networking, and data layers between Android and iOS while keeping UI native (Kotlin/Compose on Android, Swift/SwiftUI or UIKit on iOS). That reduces duplication and keeps native look and feel. Alternatively, use **Compose Multiplatform** to share UI as well, so one UI codebase runs on both platforms. KMP allows gradual adoption: start with one shared module (e.g. API client or validation) and expand. Suits product and mobile engineers who want one logic codebase and optional UI sharing.

**Reasons to adopt KMP:** Shared code cuts development and maintenance cost and speeds feature parity across platforms. You keep native performance and access to platform APIs via expect/actual. Teams already using Kotlin on Android can reuse skills and code. Many companies use KMP in production for mobile; adoption can be incremental without rewriting entire apps.

## Backend and server-side

**Backend and API development:** Use Kotlin on the JVM with **Spring**, **Ktor**, **Micronaut**, **Quarkus**, or **Vert.x** to build services and APIs. Coroutines improve scalability for I/O-bound workloads; null safety and data classes reduce bugs. You can mix Kotlin and Java in the same project and migrate over time. Suits backend and full-stack engineers who want a modern JVM language with strong tooling and ecosystem.

**Shared backend and mobile:** With KMP, you can share validation, DTOs, or business rules between server and mobile clients by putting that code in a shared KMP module consumed by both the backend and the Android/iOS apps. That keeps contracts and behavior consistent across client and server.

## Android-focused

**Android app development:** Focus on Kotlin, Jetpack Compose, Android SDK, and Android-specific libraries. Use KTX extensions and coroutines for concurrency. Testing and CI follow standard Android practices (unit tests, instrumented tests, Gradle, and CI that builds and tests on each change). Suits engineers whose primary deliverable is Android apps.

**Android and then iOS:** If the product later needs an iOS app, KMP lets you reuse existing Kotlin logic (e.g. networking, caching, business rules) in a shared module and add an iOS app that consumes it. You avoid reimplementing the same logic in Swift.

## DevOps, CI, and platform engineering

**Build and release:** Kotlin projects are built with Gradle (or Maven). CI runs **`compileKotlin`**, **`test`**, and target-specific tasks (e.g. **`jvmTest`**, **`:app:assembleDebug`**, **`linkReleaseExecutable*`** for KMP). Use a single, pinned JDK and Kotlin version in CI and in containers. Cache Gradle and dependencies to keep builds fast. For KMP, include macOS runners for iOS and run the appropriate test and build tasks per target.

**Security and supply chain:** Apply dependency auditing, dependency verification, and secret management as for any JVM or mobile pipeline. Sign release artifacts and store signing keys and certificates in the CI secret store. See the previous topic for details.

**Gradle Kotlin DSL:** Build scripts written in Kotlin (**.kts**) are type-safe and easier to refactor. Platform and DevOps engineers who maintain builds can use the same language as application code and share logic in buildSrc or convention plugins.

## Choosing an approach

- **Android only** → Kotlin + Compose on Android; no KMP.
- **Android and iOS, shared logic only** → KMP with native UI on both platforms.
- **Android and iOS, shared UI** → KMP + Compose Multiplatform.
- **Backend and/or server** → Kotlin on JVM with your framework of choice; add KMP only if you share code with mobile or other targets.
- **DevOps/CI** → Standard Gradle/CI for Kotlin and KMP; add platform-specific jobs and secrets as needed.

**Library and SDK authors:** You can publish **Kotlin Multiplatform libraries** so that other projects depend on your shared code from their `commonMain` or platform source sets. Publish to Maven (e.g. Maven Central) with the appropriate Gradle publishing setup and document which targets your library supports so consumers know what they can use in shared vs platform code.

**Scripts and tooling:** Kotlin can be used for scripts (e.g. Gradle build logic, or standalone scripts with the Kotlin script runner) and for data or automation tooling; the same language and null safety apply in smaller, non-app contexts.

This section of the handbook has introduced Kotlin from basics through advanced topics, interop, tooling, platforms, and use cases. Use the topic index in the Kotlin README and the further-reading links in each file to go deeper on any area.

---

## Further reading

- [What is cross-platform mobile development](https://kotlinlang.org/docs/multiplatform/cross-platform-mobile-development.html)
- [Reasons to adopt Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/multiplatform-reasons-to-try.html)
- [Kotlin for Android](https://kotlinlang.org/docs/android-overview.html)
- [Kotlin for server-side](https://kotlinlang.org/docs/server-overview.html)
