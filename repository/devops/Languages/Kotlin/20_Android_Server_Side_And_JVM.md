# Android, server-side, and JVM

[← Back to Kotlin](./README.md)

Kotlin is used on the JVM for Android apps, server-side applications, and desktop or CLI tools. Android development is Kotlin-first; server-side development benefits from coroutines, null safety, and interoperability with Java frameworks. This topic summarizes where and how Kotlin runs on the JVM and related platforms so you can choose the right setup and tooling for your use case.

## Kotlin for Android

Android has been **Kotlin-first** since 2019. Most new Android code is written in Kotlin. Benefits include less boilerplate, null safety that reduces crashes, and first-class support in Jetpack libraries. **KTX extensions** add Kotlin-friendly APIs (coroutines, extension functions, lambdas) to Android APIs. **Jetpack Compose** is the recommended modern UI toolkit and is Kotlin-based; you build UI declaratively in Kotlin. Kotlin also interoperates with Java, so existing Java code and libraries continue to work while you adopt Kotlin gradually.

Development is done in **Android Studio**, which has built-in Kotlin support, refactorings, and debugging. You can share logic (and optionally UI) with iOS and other platforms via **Kotlin Multiplatform**. Testing and CI follow the same patterns as for other JVM projects (Gradle test tasks, instrumented tests, and CI pipelines that build and test on each change). For getting started, use the official Android and Kotlin documentation; for cross-platform mobile, see the Kotlin Multiplatform guides.

## Kotlin for server-side

Kotlin is a strong fit for server-side applications: it is expressive, scales well with coroutines, and works with existing Java stacks. You can migrate incrementally from Java.

**Expressiveness:** Type-safe builders, delegated properties, data classes, and extension functions help build clear abstractions and reduce boilerplate.

**Scalability:** Coroutines allow many concurrent connections without blocking threads, so you can serve more clients with less hardware. They integrate with async I/O and non-blocking APIs.

**Interoperability:** Kotlin works with all Java-based frameworks. You can use Spring, JPA, JDBC, and any Java library. Migration is gradual: new code in Kotlin, old code in Java, both in the same project.

**Frameworks:** **Spring** has first-class Kotlin support and concise APIs. **Ktor** is a Kotlin-native framework built on coroutines, with a simple, idiomatic API. **Micronaut**, **Quarkus**, **Vert.x**, and **http4k** also support Kotlin. Persistence options include JDBC, JPA (with the kotlin-jpa plugin for no-arg constructors), and NoSQL drivers.

**Deployment:** Kotlin server applications are standard JVM applications. They deploy to any environment that runs Java: cloud (AWS, GCP, Azure), containers, serverless (e.g. AWS Lambda), or traditional app servers. Build and run them with Gradle or Maven like any other JVM project.

## JVM in general

Beyond Android and server backends, Kotlin on the JVM is used for desktop applications, CLI tools, and libraries consumed by Java or other JVM languages. The same language features apply: null safety, coroutines (where the runtime supports them), data classes, and seamless Java interop. Choose Kotlin when you want a more concise and safe language on the JVM while keeping access to the whole Java ecosystem. The next topic covers Kotlin Multiplatform, which extends code sharing beyond the JVM to iOS, desktop, and web.

---

## Further reading

- [Kotlin for server-side](https://kotlinlang.org/docs/server-overview.html)
- [Kotlin for Android](https://kotlinlang.org/docs/android-overview.html)
- [Get started with Kotlin/JVM and Gradle](https://kotlinlang.org/docs/get-started-with-jvm-gradle-project.html)
