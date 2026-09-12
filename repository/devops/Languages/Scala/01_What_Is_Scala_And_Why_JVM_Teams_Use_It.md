# What is Scala and why JVM teams use it

[← Back to Scala](./README.md)

## What this chapter covers

What Scala is as a language and platform choice: a **statically typed** blend of **object-oriented** and **functional** programming that compiles to the **JVM**, why teams adopt it for services and data platforms, what it costs in skill and toolchain complexity, and when another language is the better fit. This is placement literacy—not a syntax tour. Later chapters teach syntax, types, and builds; here you learn when Scala is the right bet and what “a Scala team” actually means.

---

## 1. Concepts (basic)

### 1. What Scala is

**Scala** is a general-purpose language designed to sit comfortably on the **Java Virtual Machine**. Source compiles to JVM bytecode; you run it with a JDK like any other JVM language. The language unifies two styles that many shops treat as separate worlds:

- **Object-oriented:** classes, traits, objects, inheritance, and encapsulation.
- **Functional:** immutable data by default in idiomatic code, first-class functions, expression-oriented control flow, and algebraic modeling with types.

You are not choosing “OOP *or* FP.” One type system and one compiler cover both. That is the mental model: Scala is a **single language** with two complementary toolkits, not a glue layer between Java and a functional DSL.

A tiny taste—same language, both styles in one place:

```scala
// OOP shape: a type with behavior
trait Greeter:
  def greet(name: String): String

// FP shape: a value that is a function
val shout: String => String = s => s.toUpperCase

class LoudGreeter extends Greeter:
  def greet(name: String): String = shout(s"hello, $name")
```

This handbook’s default narrative is **Scala 3** on the **JVM**. **Scala 2.13** remains important in brownfield services and many Apache Spark stacks; call-outs appear where that line still changes day-to-day decisions.

### 2. Why the JVM matters

Scala’s practical power comes from being a **JVM citizen**:

| Capability | What it means for teams |
|------------|-------------------------|
| **Classpath and jars** | Ship and consume artifacts the same way Java teams already do |
| **Java libraries** | Call mature HTTP, DB, crypto, observability, and cloud SDKs without rewriting them |
| **Ops familiarity** | GC tuning, heap dumps, JMX, container base images, and APM agents transfer |
| **Polyglot shops** | Share types and jars with Java (and often Kotlin) services in one org |

Interoperability is not free—null, checked exceptions, and collection conversions need discipline (later chapters)—but the platform bet is clear: **reuse the Java ecosystem** while writing denser, safer application code.

Calling Java from Scala is ordinary, not exotic:

```scala
import java.time.Instant

def nowIso: String =
  Instant.now().toString   // Java type, Scala method body
```

The reverse direction (Java calling Scala) works too when you keep public APIs boring—plain classes, no surprising implicits at the boundary.

### 3. Why teams choose Scala

Common engineering reasons, not marketing slogans:

- **Expressive domain models** — Case classes, sealed hierarchies, and pattern matching keep business rules close to the type system.
- **Safer absence and errors** — Idiomatic code prefers `Option`, `Either`, and `Try` over null-driven control flow for new Scala.
- **Data and streaming adjacency** — **Apache Spark** APIs and many Kafka-adjacent JVM services historically grew in Scala-friendly shops; literacy here is about placement, not replacing product docs.
- **Shared libraries across Java/Scala** — A typed library can serve both Java callers and Scala services when boundaries are designed carefully.
- **Concurrency literacy path** — Futures and effect-oriented libraries sit on familiar JVM threading; teams that already operate JVMs can deepen without changing the runtime family.

Domain modeling sketch (why the type system earns its keep):

```scala
enum PaymentStatus:
  case Pending, Settled, Failed(reason: String)

case class PaymentId(value: String)
case class Payment(id: PaymentId, status: PaymentStatus)

def describe(p: Payment): String = p.status match
  case PaymentStatus.Pending      => "waiting"
  case PaymentStatus.Settled      => "done"
  case PaymentStatus.Failed(why)  => s"failed: $why"
```

Absence as a type, not a comment:

```scala
// Good: callers must handle missing
def findEmail(userId: String): Option[String] = ???

// Bad: callers discover NPE at runtime
def findEmailOrNull(userId: String): String = ???
```

### 4. What “Scala team” usually means

A working Scala team is more than syntax fluency:

- A **pinned JDK** and **Scala version** (3.x for new greenfield; 2.13 where platforms force it).
- A **build tool**—usually **sbt**—with locked dependency resolution.
- Review norms for **immutability**, **null at edges**, and **Java interop**.
- Ops readiness: artifacts, containers, heap/GC basics, and reproducible CI.

Without those, “we use Scala” often means “we have a few modules nobody can upgrade.”

Minimal “we are actually running Scala” proof in a repo:

```bash
# Same three answers in laptop, CI, and runtime image docs
java -version
sbt "show scalaVersion"
sbt compile test
```

### 5. Honest costs

Scala is not a free upgrade from Java:

- **Learning curve** — Type system depth, implicits/givens, and FP idioms take deliberate practice.
- **Build and binary compatibility** — Scala versions and library cross-builds matter; careless bumps break CI.
- **Hiring and onboarding** — Smaller talent pool than Java or Python; ramp time is a real planning input.
- **Over-abstraction risk** — Clever type-level code can become unmaintainable without staff guardrails.
- **Spark/version coupling** — Data platforms often pin old Scala lines; product code and Spark jobs may not share one Scala major freely.

Good vs bad abstraction pressure:

```scala
// Good enough for a service boundary: clear names, ordinary types
case class CreateOrder(userId: String, sku: String, qty: Int)

// Bad default for most teams: cleverness with no product payoff
// (opaque type towers, custom type-class hierarchies for one CRUD API)
```

### 6. How Scala code reaches production (mental model)

Keep the pipeline in your head even before the toolchain chapter:

1. You write `.scala` sources.
2. The **Scala compiler** emits JVM **bytecode** (`.class` files, usually packaged as jars).
3. A **JDK** runs that bytecode—same family of tools as Java services.
4. Ops cares about heap, threads, GC, and dependencies—Scala does not invent a separate runtime planet.

```text
.scala  →  scalac (via sbt/CLI)  →  .class / jar  →  java -jar … / container
```

### 7. Reading a tiny Scala 3 program

You do not need full syntax yet; you need to recognize the shape:

```scala
@main def hello(args: String*): Unit =
  val who = args.headOption.getOrElse("world")
  println(s"hello, $who")
```

What to notice:

- `@main` marks an entry point (Scala 3).
- `val` is an immutable binding (default habit).
- `s"…"` is string interpolation.
- `Unit` is the “no useful return value” type (side-effecting `println`).

---

## 2. Advanced concepts

### 1. Scala 3 versus Scala 2 as product lines

**Scala 3** is the current language line for new work: clearer syntax options (including optional braces), redesigned contextual abstractions (`given` / `using` instead of classic `implicit` patterns), and a long-term evolution path.

**Scala 2.13** is the long-lived 2.x line still common in production, especially where Spark majors or older service frameworks lag. Migration 2 → 3 is a **project**, not a one-line version bump: syntax, macros, libraries, and binary compatibility all need a plan.

Staff decision rule: **new services → Scala 3 unless a platform constraint documents otherwise**; treat dual-version estates as technical debt with an owner.

Surface-level syntax you will see in mixed estates:

```scala
// Scala 3 control syntax
val label = if x > 0 then "pos" else "other"

// Scala 2-style shape still common in brownfield
val label2 = if (x > 0) "pos" else "other"
```

Contextual abstractions renamed (literacy only—deep dive later):

```scala
// Scala 3: given / using
def show[A](value: A)(using s: Show[A]): String = s.asString(value)

// Scala 2 brownfield: implicit parameters (same idea, different keywords)
// def show[A](value: A)(implicit s: Show[A]): String = ...
```

### 2. Not only “Spark language”

Scala predates and outlives any single framework. Teams succeed when they separate:

| Layer | Role |
|-------|------|
| **Language + stdlib** | Types, collections, concurrency primitives |
| **Build + packaging** | sbt, jars, containers |
| **Application frameworks** | HTTP, RPC, actors, effects libraries |
| **Data platforms** | Spark jobs, batch/stream pipelines |

Confusing “we write Spark” with “we know Scala” produces brittle jobs and weak services. The reverse also fails: a Scala service team that ignores JVM ops still pages at 3 a.m.

### 3. Ecosystem gravity wells

Certain domains pull teams toward Scala for historical and API reasons:

- **Analytics / batch** — Spark’s Scala API remains a primary path in many estates.
- **Event-driven JVM** — Services next to Kafka topics, schema registries, and stream processors often already live on the JVM; Scala is one language choice among Java/Kotlin/Scala.
- **Typed backends** — Organizations that value ADTs and exhaustive matching for domain rules.

Gravity is not destiny. Kotlin and Java evolved strongly; choose Scala when the **language model** pays for itself, not only because a neighboring team uses Spark.

### 4. Compilation and runtime identity

Scala source → Scala compiler → **JVM bytecode** → JDK runtime. Debugging, profiling, and security scanning are JVM problems with Scala-shaped stacks and names. Expect mangled names, synthetic methods, and library-specific wrappers in stack traces—train onboarding accordingly.

When an incident ticket says “Java OOM,” a Scala service is still a JVM process: same heap flags, same dump tools, Scala frames in the stack.

### 5. Binary compatibility is a product constraint

Scala libraries are published per **binary version** (for example `_2.13` or `_3`). That means:

- A jar built for Scala 2.13 is not automatically a Scala 3 dependency.
- Upgrading Scala can block on waiting for library publishers.
- Shared internal libraries need an explicit “which Scala lines we support” policy.

This is why platform teams publish an approved matrix instead of letting each squad pick a Scala patch casually.

### 6. Inference, interop, and “why is this hard?”

Three recurring staff-level friction sources:

| Friction | What it feels like | Mitigation habit |
|----------|--------------------|------------------|
| **Java null** | NPE in “safe” Scala | Lift to `Option` at the boundary |
| **Collections conversion** | Java `List` vs Scala `List` | Convert explicitly at edges |
| **Over-clever types** | Unreadable errors | Prefer boring public APIs |

```scala
import scala.jdk.CollectionConverters.*

def names(javaNames: java.util.List[String]): List[String] =
  javaNames.asScala.toList   // explicit boundary conversion
```

### 7. When Scala is the wrong default

Prefer another language when:

- The team has **no JVM ops skill** and will not invest in it.
- The problem is a small script or glue where **Python/Go** onboarding is faster and sufficient.
- The platform standard is **Kotlin/Java only** and dual-language support cost exceeds benefit.
- The workload is tightly bound to a stack that **does not support your Scala line** and migration is blocked for years.
- The culture rewards maximal type wizardry over readable delivery—Scala amplifies that failure mode.

### 8. Common decision mistakes (and corrections)

| Mistake | Better framing |
|---------|----------------|
| “We’re a Spark shop, so all services must be Scala.” | Jobs and online services have different constraints; choose per workload. |
| “Scala will make junior hiring easier.” | Usually the opposite; budget onboarding time. |
| “We’ll use Scala 3 in the app and whatever Spark needs in the same module.” | Separate modules/repos; do not pretend one process has two Scala stdlibs. |
| “Types replace tests.” | Types shrink bug classes; you still test behavior and integrations. |

---

## 3. Applications and use cases

### Software engineering and architecture

- Use Scala when domain complexity benefits from **sealed models**, **exhaustive matches**, and explicit error types at module boundaries.
- Keep **public APIs** boring: stable case classes or Java-friendly façades; hide clever internals.
- Document the **Scala major + JDK major** in the service README the same way you document the HTTP contract.

Mini-pattern: service README pins (treat like an API contract):

```text
Runtime: JDK 21
Language: Scala 3.3.x
Build: sbt 1.9.x
```

Mini-pattern: boring public DTO, richer internal model:

```scala
// Public / wire shape — stable and dull
case class UserDto(id: String, email: String)

// Internal — can evolve with sealed status, validation, etc.
enum UserState:
  case Active, Disabled
case class User(id: String, email: String, state: UserState)
```

### Data platforms and messaging adjacency

- Spark jobs: treat Scala version as part of the **platform pin**, not an app preference.
- Kafka-consuming services: Scala is optional; JVM discipline (serializers, timeouts, consumer groups) matters more than syntax sugar.
- Separate **job code** from **library code** so shared domain types do not drag Spark dependencies into online services.

Sketch of healthy dependency direction:

```text
domain-lib (pure Scala types)
    ↑
online-service          batch-jobs (may depend on Spark)
```

### Systems, security, and operations

- Same JVM threat model as Java: dependency CVEs, deserialization risks, secrets in config, and oversized attack surface from unnecessary deps.
- Same ops model: heap, GC, thread pools, container memory limits, and health probes.
- Supply chain: pin versions, prefer verified Maven Central artifacts, and review binary-incompatible Scala bumps like breaking API changes.

Logging without leaking secrets (application habit that belongs in every Scala service):

```scala
case class DbConfig(url: String, user: String, password: String):
  override def toString: String =
    s"DbConfig(url=$url, user=$user, password=***)"
```

### Delivery and platform engineering

- CI must fail on unexpected Scala/JDK drift.
- Golden service templates should encode sbt, scalafmt/scalafix policy, test command, and container base image.
- Platform teams should publish a short “when to use Scala vs Java/Kotlin” note so product teams do not cargo-cult Spark into online paths.

CI sketch (policy as a check, not a wiki hope):

```bash
# Fail the build if the project Scala line drifts from the platform pin
expected="3.3.5"
actual=$(sbt -no-colors "show scalaVersion" | tail -n1 | tr -d ' ')
test "$actual" = "$expected"
```

### Staff-level review checklist

- Is Scala chosen for a **stated engineering reason**, not only “nearby Spark”?
- Are **Scala version** and **JDK** pinned and identical in local docs, CI, and runtime images?
- Is the team staffed for **maintenance** (upgrades, interop, on-call), not only greenfield syntax?
- Are framework/platform constraints (Spark major, library Scala binary) written down?
- Is there an exit or dual-language plan if the org standardizes on Java/Kotlin later?
- Are public module APIs boring enough for Java interop and future maintainers?
- Is over-abstracted type-level code rejected unless it has a clear product payoff?

---

## References

- [Scala Language](https://www.scala-lang.org/)
- [Scala Documentation](https://docs.scala-lang.org/)
- [Scala 3 Book — Introduction](https://docs.scala-lang.org/scala3/book/introduction.html)
- [New in Scala 3](https://docs.scala-lang.org/scala3/new-in-scala3.html)
- [Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html)
- [Tour of Scala — Basics](https://docs.scala-lang.org/tour/basics.html)
- [Scala 3 Compatibility Guide](https://docs.scala-lang.org/scala3/compatibility.html)
- [Getting Started](https://docs.scala-lang.org/getting-started.html)
- [Scaladex](https://index.scala-lang.org/)
