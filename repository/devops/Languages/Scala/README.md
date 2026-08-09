# Scala

[← Back to Languages](../README.md)

Scala is a **statically typed** language for the **JVM** that combines **object-oriented** and **functional** programming in one toolchain. Teams use it when they want concise, expressive code that still interops with the Java ecosystem—data pipelines (**Apache Spark**), streaming and messaging stacks that sit next to **Kafka**, backend services, and shared libraries that must call or be called from Java.

This track teaches Scala as **systems work**: language semantics (Scala **3** first, with **Scala 2** called out where brownfield still matters), **sbt** and dependency discipline, Java/JVM boundaries, testing and quality, security and supply chain, packaging and operations, data-engineering and streaming **architecture**, and DevSecOps threat modeling—**not** only as a syntax tour or a DevOps-only checklist.

---

## Scala versions, JVM, and which documentation to read

Scala releases as **Scala 3.x** (current default narrative) and the long-lived **Scala 2.13** line still common in Spark and older services. Behavior, standard library details, and idioms differ across those lines. Pin a **Scala version** and a **JDK** in CI and production images; record both in diagnostics.

**Practical policy:** choose **Scala 3** for new services unless a platform (for example an older Spark major) forces **2.13**; keep `build.sbt` / `scalaVersion`, the JDK major, and container digests aligned; treat migration from 2 → 3 as a deliberate project, not a drive-by bump.

```bash
java -version
scala -version   # if a Scala runner is on PATH
sbt -Dsbt.version -version
sbt "show scalaVersion"
```

---

## Chapter structure

Chapters `01`–`21` follow a consistent body shape:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (edge cases, JVM/Scala 2–3 nuance)
3. **Applications and use cases** (production and governance patterns)
4. **Staff-level review checklist** (what staff enforce in review)

Links live in each chapter’s **References** section (official hubs only).

---

## Semantic model (why Scala feels different)

- **Everything is an expression:** `if`, blocks, and `match` produce values; side effects are explicit choices, not the only style.
- **Unified OOP + FP:** classes/traits and functions/immutability share one type system—not two languages glued together.
- **JVM citizen:** bytecode, classpath, and Java libraries are first-class; Scala-specific features compile down to JVM-friendly shapes.
- **Implicits → givens (Scala 3):** contextual parameters evolved; brownfield code still shows `implicit`—know both when reading.
- **Collections and Option:** prefer explicit absence (`Option`) and immutable defaults over null-driven control flow in new Scala.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundations | 01–07 | What Scala is; toolchain; syntax; types; control flow; functions; classes/traits/case classes. |
| Libraries and modeling | 08–12 | Collections/`Option`/`Either`/`Try`; pattern matching; packages; sbt; Java interop. |
| Runtime and production | 13–16 | Concurrency literacy; testing/docs; security/supply chain; containers and JVM ops. |
| Placement | 17 | Domain use cases: services vs Spark vs Kafka lanes. |
| Architecture & DevSecOps | 18–20 | Spark data engineering; Kafka/pipeline architecture; threat modeling and hardening. |
| Wrap | 21 | Competency map and consolidated staff checklist. |

Suggested order: **01 → 12**, then **13 → 16**, then **17**, then **18 → 20**, then **21**. Revisit **11** before changing build/release; **12** before mixed Java/Scala boundaries; **15** / **20** before untrusted input or public artifacts; **18** / **19** before owning data-platform jobs.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 1 | What is Scala and why JVM teams use it | [01](./01_What_Is_Scala_And_Why_JVM_Teams_Use_It.md) |
| 2 | Toolchain: JDK, Scala 3, sbt, and versions | [02](./02_Toolchain_JDK_Scala3_Sbt_And_Versions.md) |
| 3 | Syntax, expressions, `val` and `var` | [03](./03_Syntax_Expressions_Vals_And_Vars.md) |
| 4 | Types, hierarchy, and null safety habits | [04](./04_Types_Hierarchy_And_Null_Safety.md) |
| 5 | Control flow and expression-oriented style | [05](./05_Control_Flow_And_Expressions.md) |
| 6 | Functions, methods, and higher-order style | [06](./06_Functions_Methods_And_Higher_Order.md) |
| 7 | Classes, objects, traits, and case classes | [07](./07_Classes_Objects_Traits_And_Case_Classes.md) |
| 8 | Collections, `Option`, `Either`, and `Try` | [08](./08_Collections_Option_Either_And_Try.md) |
| 9 | Pattern matching and algebraic data | [09](./09_Pattern_Matching_And_Algebraic_Data.md) |
| 10 | Packages, imports, and visibility | [10](./10_Packages_Imports_And_Visibility.md) |
| 11 | sbt: projects, dependencies, and packaging | [11](./11_Sbt_Projects_Dependencies_And_Packaging.md) |
| 12 | Java interop and the JVM | [12](./12_Java_Interop_And_The_JVM.md) |
| 13 | Concurrency, Futures, and effects literacy | [13](./13_Concurrency_Futures_And_Effects_Literacy.md) |
| 14 | Testing, style, and Scaladoc | [14](./14_Testing_Style_And_Scaladoc.md) |
| 15 | Security and supply chain | [15](./15_Security_And_Supply_Chain.md) |
| 16 | Build, containers, and JVM operations | [16](./16_Build_Containers_And_JVM_Operations.md) |
| 17 | Use cases: services, Spark, and Kafka | [17](./17_Use_Cases_Services_Spark_And_Kafka.md) |
| 18 | Spark data engineering and architecture | [18](./18_Spark_Data_Engineering_And_Architecture.md) |
| 19 | Kafka streaming and pipeline architecture | [19](./19_Kafka_Streaming_And_Pipeline_Architecture.md) |
| 20 | DevSecOps threat modeling and hardening | [20](./20_DevSecOps_Threat_Modeling_And_Hardening.md) |
| 21 | Whole-engineering wrap and staff checklist | [21](./21_Whole_Engineering_Wrap_And_Staff_Checklist.md) |

---

## Deep-study workflow

1. After **01–07**, rewrite a small Java utility as Scala 3 and note where immutability and `Option` changed the design.
2. After **08–12**, stand up an sbt project that depends on one Java library and one Scala library; run tests on a pinned JDK.
3. After **13–16**, add CI that runs `test`, style checks, and a release package (jar or container) with locked versions.
4. After **17**, write a one-page decision note: Scala service vs Spark job vs “stay on Java/Kotlin” for one real workload.
5. After **18–20**, extend that note with DAG/shuffle or topic/partition choices, delivery semantics, and a STRIDE-style threat row for the chosen lane; sign the wrap checklist in **21**.

---

## Further reading

- [Scala Documentation](https://docs.scala-lang.org/)
- [Scala 3 Book](https://docs.scala-lang.org/scala3/book/introduction.html)
- [Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/index.html)

---

## References (hub links)

- [Scala Language](https://www.scala-lang.org/)
- [docs.scala-lang.org](https://docs.scala-lang.org/)
- [sbt](https://www.scala-sbt.org/)
- [Scaladex](https://index.scala-lang.org/)
- [Apache Spark docs](https://spark.apache.org/docs/latest/)
- [Apache Spark Security](https://spark.apache.org/security.html)
- [Apache Kafka docs](https://kafka.apache.org/documentation/)
