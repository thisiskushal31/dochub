# Whole-engineering wrap and staff checklist

[← Back to Scala](./README.md)

## What this chapter covers

A **competency map** tying chapters **01–21** to staff-level outcomes; **role lenses**; guidance on **when not to use Scala**; **migration** notes from Java (including code smells); a **brownfield Scala 2** reading path with an annotated mini-snippet; a **consolidated checklist**; and a clear split between what this track **integrates** vs what it **defers** to framework and platform manuals. Use this as a sign-off aid, not a substitute for earlier chapters.

---

## 1. Concepts

### 1. Competency map (chapters → outcomes)

| Block | Chapters | You can… |
|-------|----------|----------|
| Foundations | 01–07 | Explain why JVM teams use Scala; pin JDK/Scala/sbt; read expression-oriented syntax; reason about types and null habits; write control flow and functions; model with classes, objects, traits, and case classes (Scala 3 default). |
| Libraries and modeling | 08–12 | Use collections/`Option`/`Either`/`Try`; pattern match ADTs; structure packages and visibility; build with sbt and manage dependencies; interoperate with Java and understand JVM realities. |
| Runtime and production | 13–16 | Use `Future`/`ExecutionContext` literacy without inventing frameworks; test/style/Scaladoc/CI gates; secure secrets, codecs, and supply chain; package, containerize, and operate JVMs (memory, probes, shutdown). |
| Placement | 17 | Place Scala in services vs Spark vs Kafka-adjacent work; decide when not to use Scala. |
| Architecture & DevSecOps | 18–20 | Reason about Spark DAGs/shuffles/streaming guarantees; Kafka topics/partitions/delivery semantics and pipeline shapes; threat-model services and data platforms and harden trust boundaries. |
| Wrap | 21 | Sign a consolidated staff checklist across language, ops, security, and data lanes. |

Suggested mastery order remains **01→12 → 13→16 → 17 → 18→20 → 21**, with revisits to **11** (build/release), **12** (Java/JVM), **13** (concurrency incidents), **15** / **20** (untrusted input / threat models), and **18** / **19** (data-platform incidents) under pressure.

### 2. Role lenses (same language, different depth)

| Role | Must be solid on | Can defer initially |
|------|------------------|---------------------|
| Application / backend | 04–12, 13, 14, 16, 20 (domain modeling, errors, futures, tests, shutdown, service threat model) | Deep Spark tuning; writing custom sbt plugins |
| Data / ML engineering | 08–12, 15, 17–19 (transforms, packaging, jar provenance, Spark/Kafka architecture) | Full HTTP framework product ownership |
| DevOps / SRE | 02, 11, 14–16, 18–19 (pins, CI, images, JVM flags, probes, metrics, job/topic ops literacy) | Advanced typeclass design |
| Security / DevSecOps | 12, 15, 17, 20 (deserialization, secrets, resolvers/plugins, platform ACLs, STRIDE for services and data planes) | Actor/effect framework internals |
| Staff / tech lead | 01–21 map; ADRs for concurrency model, Scala 2/3 splits, and delivery semantics | Memorizing every Spark/Kafka operator |

### 3. Whole-engineering domains

Scala fluency for staff work spans:

1. **Language & type system** — expressions, ADTs, null/`Option` habits, Scala 3 givens vs Scala 2 implicits literacy.
2. **Software design** — modules, errors as values, Java boundaries.
3. **Quality** — tests, style, Scaladoc, CI gates.
4. **Security & supply chain** — secrets, codecs, Maven/Scaladex trust, sbt plugins.
5. **Concurrency literacy** — contexts, futures, when to adopt actors/effects.
6. **Reliability & observability** — metrics, probes, redaction, graceful shutdown.
7. **Delivery** — reproducible sbt, containers, fat vs thin artifacts.
8. **Platform placement** — services vs Spark vs Kafka without confusing language learning for product courses.
9. **Data architecture** — Spark driver/executor, shuffle, partitioning, Structured Streaming contracts; Kafka partitions, consumer groups, pipeline shapes (chapters 18–19).
10. **DevSecOps** — threat models for HTTP edges and data platforms; submission/UI exposure; SBOM and CI gates (chapter 20).

### 4. When not to use Scala

Prefer another tool when:

- The org standard is **Java/Kotlin** for services and no shared Scala libraries exist.
- The problem is a **short script** better served by Python/Bash with existing team fluency.
- The workload is **SQL-only** on a warehouse or a fully managed stream processor with negligible custom code.
- You cannot staff **code review** for advanced Scala (implicits/givens, macros, effect stacks).
- Spark/Kafka platforms force a **Scala line** you refuse to run, and a split codebase has no ownership plan.
- Scala is being chosen as a **trophy language** without hiring or ops investment.

### 5. Migration notes from Java

**Types and null:** map nullable Java APIs to `Option` at the boundary; do not sprinkle `null` through new Scala.  
**Data:** prefer case classes and ADTs over mutable JavaBeans in new code; convert at edges.  
**Collections:** Scala collections ≠ Java collections—convert explicitly at interop boundaries (chapter 12).  
**Exceptions:** keep JVM exceptions for truly unexpected faults; model expected outcomes with `Either`/`Option`/`Try` per team convention.  
**Concurrency:** `CompletableFuture` and Scala `Future` interop exists—pick one style per module.  
**Build:** moving from Maven/Gradle to sbt (or dual-building) is a project; pin versions and do not mix three build tools without need.  
**Style:** do not mechanically translate every Java class one-for-one—idiomatic Scala shrinks boilerplate *and* changes design.

Java → Scala edge sketch:

```scala
import scala.jdk.CollectionConverters.*

def emailsOf(javaUsers: java.util.List[JavaUser]): List[String] =
  javaUsers.asScala.toList.flatMap(u => Option(u.getEmail))
```

---

## 2. Advanced concepts

### 1. Brownfield Scala 2 reading path

1. Confirm **Scala version** (`scalaVersion` / platform pin) and **JDK** in CI and runtime.  
2. Read **`build.sbt` / `project/`**: plugins, resolvers, assembly/native packager tasks.  
3. Map **entry points**: service `main`, Spark driver, Kafka consumer loop.  
4. Inventory **implicits**, macros, and reflection—note hot spots before Scala 3 migration.  
5. Identify **concurrency model**: raw futures, actors, effects—one diagram, no surprises.  
6. Run **tests** and record flake debt; fix gates before large refactors.  
7. Plan **2 → 3** only with a compatibility checklist and dependency matrix—not as a drive-by in a CVE patch.

Scala 2.13 remains first-class on many Spark generations. Treat cross-building and migration as deliberate programs.

### 2. Annotated mini-snippet: reading brownfield Scala 2

When you open an older module, read for **context parameters**, **null**, and **error channels** before “cleaning style.”

```scala
// Brownfield Scala 2.13-shaped fragment (annotated for reading, not a style target)
package com.example.billing

import scala.concurrent.{ExecutionContext, Future}

final case class UserId(value: String)

object UserId {
  // Smell to note: stringly factory with silent null — migrate toward Option/Either
  def fromJava(raw: String): UserId =
    if (raw == null || raw.isEmpty) UserId("unknown") else UserId(raw)
}

trait UserRepo {
  def find(id: UserId)(implicit ec: ExecutionContext): Future[Option[String]]
  //          ^^^^^^^^^^^^^^^^^^^^^^^^
  // Scala 2: implicit ExecutionContext  →  Scala 3: (using ExecutionContext)
}

final class BillingService(repo: UserRepo) {
  def label(id: UserId)(implicit ec: ExecutionContext): Future[String] =
    repo.find(id).map {
      case Some(name) => name
      case None       => "missing"
    }
}

// Migration note (Scala 3 direction), same behavior:
// def find(id: UserId)(using ExecutionContext): Future[Option[String]]
// def label(id: UserId)(using ExecutionContext): Future[String] = …
```

Reading checklist on such a snippet:

| Signal | What to do |
|--------|------------|
| `implicit ec: ExecutionContext` | Document which pool; plan `using`/`given` when on Scala 3 |
| `raw == null` | Contain at Java edge; prefer `Option(raw)` |
| `"unknown"` sentinel | Prefer `Either`/`Option` over fake IDs |
| `Future[Option[…]]` | Fine—confirm team rules for empty vs failed future |

### 3. Migration checklist with code smells (`implicit` → `given`)

Use this when planning Java→Scala adoption **or** Scala 2→3 movement on modules you own:

| Smell / pattern | Why it hurts | Prefer |
|-----------------|--------------|--------|
| `null` flowing through Scala domain types | NPEs; lies to readers | `Option` / validated ADTs at boundaries |
| `implicit` conversions in app code | Surprise resolution; hard reviews | Explicit `toX` methods; limit givens to known typeclasses/contexts |
| `implicit ExecutionContext` with no owner | Pool starvation mysteries | Named givens / explicit parameters + ADR |
| Wildcard `import company.implicits._` | Nonlocal behavior | Narrow imports; Scala 3 `given` instances in companions |
| Exception for ordinary business rules | Unreadable control flow | `Either` / ADT errors |
| Mutable `var` + shared across futures | Races | Immutable data or concurrent structures with ownership |
| One mega `Utils` object | Hidden coupling | Domain modules with clear visibility |
| JavaBeans + Scala case class duplicates | Drift | One model + codecs at the edge |
| Unbounded `Future.sequence` | Thundering herd | Bounded parallelism |
| Java serialization of untrusted bytes | RCE history | Explicit codecs (chapter 15) |

Scala 2 → 3 context parameter note:

```scala
// Scala 2
def work(id: String)(implicit ec: ExecutionContext): Future[String] = ???

// Scala 3
def work(id: String)(using ExecutionContext): Future[String] = ???

given ExecutionContext = myServiceEc
```

Do not rename every `implicit` in a CVE bump PR. Batch migration with compile flags / cross-build evidence and dependency readiness.

### 4. Invariants notebook (staff habit)

Keep a living note per product: Scala version(s), JDK major, sbt version, concurrency model, secret injection path, artifact type (fat/thin), GC/heap policy, probe semantics, dependency triage owner, Spark/Kafka platform versions if any, and Scala 3 migration status. This notebook separates operable ownership from hero rewrites.

### 5. Failure modes that span chapters

| Symptom | Likely chapters |
|---------|-----------------|
| “Works on my machine” jar | 02, 11, 16 |
| Thread-pool starvation / latent hangs | 13, 16 |
| Flaky CI tests | 14 |
| Secret in logs or image | 15, 16 |
| Deserialization incident | 15, 20 |
| Spark job OOM / skew | **18** (+16) |
| Consumer lag / poison messages | **19** (+15) |
| Binary mismatch service vs job | 11, 12, 17 |
| Accidental multi-framework concurrency | **13** (optionally 17) |

### 6. Myths to reject

- “Types mean we can skip tests.”  
- “Safe/immutable Scala means secure product.”  
- “Local Spark mode proves production.”  
- “One fat jar fits services and clusters identically.”  
- “Rewriting implicits to givens is always a safe drive-by.”

### 7. Sign-off narrative (how to use this chapter)

Before calling a Scala surface “staff-ready,” walk the competency map left-to-right for the role that owns the change, then tick the consolidated checklist. Gaps become tickets with owners—not tribal knowledge. When the change crosses lanes (service emits Kafka, Spark reads it), require chapter 17 placement answers in the same review: Scala line, serde, and which SLO dashboard pages whom.

Example one-paragraph ADR seed:

```text
We keep HTTP APIs on Scala 3 + Future/owned EC; Spark jobs stay on the
platform’s 2.13 line; contracts are Avro at the topic boundary. No second
effect/actor stack without a staffing plan. Secrets via runtime injection only.
```

---

## 3. Applications and use cases

Use this section as the track’s sign-off surface: hiring bars, promotion conversations, and release readiness reviews should be able to point at the checklist without reopening every earlier chapter.

### Staff-level review checklist

**Language & design**

- [ ] Scala 3 idioms used in new modules unless platform forces 2.13; version recorded.
- [ ] `Option`/`Either`/`Try` conventions consistent at boundaries; null contained at Java edges.
- [ ] ADTs and pattern matching preferred over boolean/flag soup for domain states.
- [ ] Packages/visibility match API and threat surface.
- [ ] Java interop conversions explicit; no accidental collection/null leaks.
- [ ] `implicit` / `given` usage is intentional and searchable—no wildcard conversion imports in app code.

**Concurrency**

- [ ] `ExecutionContext` (or platform scheduler) ownership is documented.
- [ ] Blocking I/O isolated; timeouts on awaits and outbound calls.
- [ ] Single concurrency story per service (futures **or** actors **or** effects)—no accidental stack of all three.
- [ ] Graceful shutdown drains work and closes clients.

**Quality**

- [ ] One primary test framework story; `sbt test` required in CI.
- [ ] Style guide + automation enforced; Scaladoc on public APIs.
- [ ] Flakes owned; snapshots cannot silently rewrite.

**Security & supply chain**

- [ ] Secrets runtime-injected; never in git/jars/images.
- [ ] Codecs safe; no untrusted Java serialization paths.
- [ ] Dependencies and sbt plugins pinned; resolvers org-approved; triage owned.
- [ ] Production logs redact tokens and sensitive fields.

**Delivery & operations**

- [ ] CI pins sbt/Scala/JDK; artifacts embed build identity.
- [ ] Container JDK matches CI; non-root when possible; fat vs thin intentional.
- [ ] Heap/GC aligned to cgroup limits; liveness vs readiness correct; JVM metrics available.
- [ ] Heap dumps and diagnostics have privacy policy.

**Portfolio fit**

- [ ] Service vs Spark vs Kafka placement matches chapter 17 cheatsheet—or exit criteria defined.
- [ ] Spark jobs (chapter 18): Scala line matches cluster; shuffle/partition story; streaming mode and checkpoint/sink semantics named accurately.
- [ ] Kafka/pipelines (chapter 19): consumer groups, commit strategy, lag SLOs, and delivery scope documented; DLQ policy written.
- [ ] DevSecOps (chapter 20): threat model covers HTTP and/or data-plane trust boundaries; no untrusted `ObjectInputStream`; UIs/submission not internet-exposed.
- [ ] Threat-model evidence exists (diagram, STRIDE/mitigations, owners)—not a slide that never blocked a merge.
- [ ] SBOM / provenance available for production artifacts; promoted digests answer “what SHA/jar is running?”
- [ ] Spark UI / history / submission isolated from public and untrusted networks; authn/authz enabled per platform standard.
- [ ] Kafka ACL (and schema-registry rights) owners named; PII topics use separate produce vs consume principals.
- [ ] Shared libs survive Scala line splits via clear contracts.
- [ ] Framework/platform manuals owned separately; language track expectations met first.
- [ ] Scala 2→3 or Java→Scala migration smells reviewed against the Advanced table above.

### Use as a hiring / promotion rubric

- **Read/patch:** chapters 01–07 in practice.  
- **Own a service or job:** through 12–16 and relevant 17 lane; data owners add 18–19; security owners add 15 + 20.  
- **Staff:** teach 13/15/17–20 tradeoffs, read brownfield implicits safely, and sign this checklist without hand-waving.

Hiring bar (concurrency vs platforms): do not treat **service concurrency** (`Future` / `ExecutionContext` ownership, chapter 13), **Spark partitioning and shuffle** (chapter 18), and **Kafka delivery / consumer-group semantics** (chapter 19) as interchangeable fluency. A strong service engineer may still mis-place a micro-batch job or claim “exactly-once” without a system scope—probe each lane separately when the role spans them.

### What this track integrates vs defers

**Inside this track you should leave knowing:** Scala 3 language and modeling habits; sbt/dependency literacy; Java/JVM boundaries; futures/context literacy; testing/style/docs gates; security/supply-chain habits; container/JVM ops basics; when to place services vs Spark vs Kafka; Spark/Kafka **architecture literacy** (DAGs, shuffles, topics, delivery semantics—not every operator); DevSecOps threat-modeling habits for services and data platforms; how to read Scala 2 brownfield and plan migration without drive-by rewrites.

**This track does not replace:** Akka/Pekko or Cats Effect manuals; Play/http4s (or other) framework courses; full Spark operator/tuning curricula or cluster-admin runbooks; full Kafka admin/streams courses; Kubernetes/Terraform product docs; or your org’s secure-coding standards. Those stay in their official docs once you know what you are looking for.

---

## References

- [Scala Documentation hub](https://docs.scala-lang.org/)
- [Scala 3 Book](https://docs.scala-lang.org/scala3/book/introduction.html)
- [Scala Style Guide](https://docs.scala-lang.org/style/)
- [Scala 3 Style Guide](https://docs.scala-lang.org/scala3/style-rules.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/index.html)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [Scaladex](https://index.scala-lang.org/)
- [Scala Language](https://www.scala-lang.org/)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
