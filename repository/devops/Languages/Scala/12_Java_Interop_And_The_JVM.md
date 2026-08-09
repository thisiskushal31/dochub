# Java interop and the JVM

[← Back to Scala](./README.md)

## What this chapter covers

Calling **Java from Scala** and **Scala from Java**, handling **`null` at boundaries**, **collections converters**, **SAM/lambda** interop, and **classpath / JDK** compatibility awareness. Scala is a JVM citizen—most production pain at mixed-language edges is about nulls, types, and runtime versions, not syntax. After this chapter you should wrap Java APIs into `Option`/`Either` and Scala collections at the seam, and expose Java-friendly signatures when Java callers matter.

---

## 1. Concepts

### 1. Same runtime, different surface

Scala compiles to JVM bytecode and runs on a **JDK**. You can depend on Java libraries with `%` coordinates, call Java methods as ordinary methods, and implement Java interfaces in Scala. Java code can call into Scala when you expose Java-friendly shapes (and accept some Scala naming quirks).

Keep a clear **boundary layer**: idiomatic Scala inside; boring Java types at the seam when many Java callers exist.

### 2. Calling Java from Scala

Java classes look like Scala types. Constructors, static methods (as `object`-like companions on the Java class), and fields are accessible. Overloads resolve as on the JVM. Checked exceptions are not checked by the Scala compiler—treat Java methods that throw as `Try`/`Either` boundaries when failure matters.

```scala
val list = new java.util.ArrayList[String]()
list.add("x")
```

Prefer converting to Scala collections for deeper Scala code rather than threading `java.util` types through the domain.

Side-by-side: Java `HashMap` usage, then wrap lookups to `Option`:

```scala
import java.util.{HashMap as JHashMap}
import scala.jdk.CollectionConverters.*

// --- Java-style map in Scala ---
val jmap = new JHashMap[String, String]()
jmap.put("user", "ada")
jmap.put("role", "admin")

val rawRole: String = jmap.get("role")          // may be null
val rawMissing: String = jmap.get("missing")    // null

// --- wrap null lookups immediately ---
def jget(m: JHashMap[String, String], key: String): Option[String] =
  Option(m.get(key))

val role: Option[String] = jget(jmap, "role")       // Some("admin")
val missing: Option[String] = jget(jmap, "missing") // None

// --- convert whole map for Scala pipelines ---
val smap: Map[String, String] = jmap.asScala.toMap
val emails: List[String] =
  smap
    .get("user")
    .map(u => s"$u@example.com")
    .toList
```

Null boundary wrappers for methods and fields:

```scala
final class JavaUser:
  // imagine Java getters that return null
  def getEmail: String = null
  def getName: String = "ada"

def toScalaUser(j: JavaUser): (String, Option[String]) =
  val name = Option(j.getName).getOrElse("unknown")
  val email = Option(j.getEmail)
  (name, email)
```

### 3. Calling Scala from Java — signature notes

Scala features that Java lacks need care:

| Scala feature | Java-facing tip |
|---------------|-----------------|
| `object` members | Appear as `MyObject$.MODULE$` or static forwarders when generated |
| Traits | Compile to interfaces + implementation classes; multiple inheritance details leak |
| Default parameters | Extra synthetic overloads |
| `Option` | Unfamiliar to Java callers—prefer nullable or separate API |
| Case class `apply` | Prefer explicit constructors/factories for Java |
| `List` / `Map` (Scala) | Prefer `java.util.List` / `Map` on the facade |

For mixed teams, offer a small **Java API facade** rather than exposing every Scala idiom.

```scala
package com.example.billing

case class Invoice(id: String, cents: Long)

/** Idiomatic Scala API */
object Invoices:
  def parse(id: String, cents: Long): Either[String, Invoice] =
    if cents < 0 then Left("negative") else Right(Invoice(id, cents))

/** Java-friendly facade: no Option/Either/default args on the surface */
final class InvoiceJavaApi:
  /** @return invoice id, or null if invalid */
  def createOrNull(id: String, cents: Long): String =
    Invoices.parse(id, cents).map(_.id).toOption.orNull

  /** throws IllegalArgumentException on invalid input */
  def createOrThrow(id: String, cents: Long): Invoice =
    Invoices.parse(id, cents).fold(
      err => throw IllegalArgumentException(err),
      identity
    )
```

Java-friendly method signature habits:

- Prefer `String` / primitives / `java.util.List` over Scala collections and `Option`.
- Avoid default parameters and multiple parameter lists on public Java entry points.
- Prefer concrete `final class` facades over traits with self-types.
- Document nullability in Javadoc (`@return` may be null) when you must return null.

### 4. Null at the boundary

Scala code should use **`Option`** internally. Java returns **`null`**. Convert at the edge:

```scala
Option(javaUser.getEmail)  // None if null
```

Never assume a Java getter is non-null unless the contract is ironclad. When implementing Java interfaces that expect null, `.orNull` or explicit null may be required—localize it. Scala 3 nullability / explicit null features may apply depending on language flags—know your project’s settings.

```scala
def emailOrNull(email: Option[String]): String =
  email.orNull

def requireEmail(email: Option[String]): String =
  email.getOrElse(throw IllegalStateException("email required at Java edge"))
```

### 5. Collections converters literacy

`scala.jdk.CollectionConverters` (and older `JavaConverters`) provide `.asScala` / `.asJava` views between familiar types (`List` ↔ `java.util.List`, `Map` ↔ `java.util.Map`, etc.).

```scala
import scala.jdk.CollectionConverters.*

val javaList: java.util.List[String] = java.util.List.of("a", "b")
val scalaList: List[String] = javaList.asScala.toList
val javaAgain: java.util.List[String] = scalaList.asJava

val javaMap: java.util.Map[String, Int] = new java.util.HashMap()
javaMap.put("x", 1)
val scalaMap: Map[String, Int] = javaMap.asScala.toMap
```

Older code may still import `scala.collection.JavaConverters` — prefer `scala.jdk.CollectionConverters` in new Scala 2.13/3 code.

Views may wrap rather than deep-copy—mutation on one side can surprise the other. Convert to immutable Scala collections when crossing into trusted domain code.

```scala
val live = new java.util.ArrayList[String]()
live.add("a")
val view = live.asScala
live.add("b")
// view sees "b" — shared backing store
val snapshot = live.asScala.toList  // independent List
```

### 6. SAM and lambda interop

Java **functional interfaces** (single abstract method types) accept Scala lambdas / function literals in modern Scala. This is how you pass callbacks into Java APIs cleanly.

```scala
val exec = java.util.concurrent.Executors.newSingleThreadExecutor()
exec.execute(() => println("task"))  // Runnable SAM

val mapped: java.util.function.Function[String, Int] =
  (s: String) => s.length

java.util.List.of("ab", "c").stream().map(mapped).toList
```

If conversion fails, check the target type is a true SAM and that Scala version / `-Xsource` flags match team expectations. Scala `FunctionN` traits are not identical to every Java functional interface—explicit SAM target types help.

---

## 2. Advanced concepts

### 1. Classpath and binary compatibility

The JVM loads classes by name from the **classpath** (or module path). Conflicts (duplicate classes, incompatible versions) show up as `NoSuchMethodError`, `ClassNotFoundException`, or subtle behavioral drift. Align:

- Scala standard library version with `scalaVersion`
- Library binaries compiled for the same Scala binary version
- Transitive Java library versions (Jackson, Netty, gRPC, …)

sbt evictions change the classpath—review them (chapter 11).

```bash
sbt dependencyTree
sbt evicted
```

### 2. JDK compatibility awareness

Bytecode targeted at an older JDK runs on newer JDKs (generally); the reverse does not. Toolchains may compile with a **newer JDK** while emitting older `--release` bytecode. Record:

- Build JDK used in CI
- Target bytecode / release version
- Runtime JDK in production images

Scala compiler and sbt themselves require minimum JDKs—upgrade build images when the toolchain demands it.

```scala
// build.sbt sketch
ThisBuild / javacOptions ++= Seq("--release", "17")
ThisBuild / scalacOptions ++= Seq("-release", "17")
```

### 3. Boxed primitives and specialization

Java boxed types (`Integer`) and Scala `Int` interact via boxing. Collections of primitives from Java are often boxed. Be aware of nullability of boxed types (`Integer` can be null; `Int` cannot).

```scala
val boxed: Integer = null
val maybe: Option[Int] = Option(boxed).map(_.intValue)
// never: boxed.intValue if boxed may be null
```

### 4. Annotations and retention

Java annotations on Scala code matter for frameworks (Spring, Jackson, JPA). Placement on fields vs accessors differs between Scala-generated members—follow framework Scala guides used by your stack. Retention and runtime visibility are JVM rules, not Scala inventions.

```scala
import com.fasterxml.jackson.annotation.JsonProperty

case class Payload(
  @JsonProperty("user_id") userId: String,
  @JsonProperty("email") email: String
)
```

### 5. Threads, classloaders, and frameworks

App servers and Spark use complex **classloaders**. Mixing fat jars, `Provided` scopes, and parent-first loading causes “works in sbt, fails in platform” issues. Prefer the platform’s recommended packaging; isolate conflicts early.

### 6. Reflection, `setAccessible`, and `MethodHandles` as privilege

Java reflection and related APIs are not “just metaprogramming”—they are **privilege boundaries** on the JVM:

| Mechanism | Staff reading |
|-----------|----------------|
| **`Class.forName` / reflective invoke** | Loads and runs code by name; attacker-controlled class names are remote code execution when combined with a writable classpath or gadget graph. |
| **`setAccessible(true)`** | Breaks encapsulation to touch private fields/methods; on modern JDKs this is gated by modules and JVM flags—treat successful bypass as a security-sensitive capability, not a convenience. |
| **`MethodHandles` / `Lookup`** | Powerful call-site plumbing; a wide `Lookup` is effectively a capability token—do not stash one in shared statics reachable from untrusted plugins. |

Staff rule: frameworks may need reflection; **application code** that reflects over untrusted names, or that opens private members to satisfy a shortcut, needs an explicit threat review. Prefer public APIs and compile-time wiring.

### 7. ServiceLoader, SPI, and plugin classloaders

**`ServiceLoader`** and Java SPI discover implementations listed under `META-INF/services/…`. That registry is part of your classpath trust surface:

- Fat-jar merge strategies that discard or overwrite `META-INF/services` silently drop providers (chapter 11).
- Spark, Kafka clients, and JDBC-adjacent stacks load **plugin / connector jars** under child or isolated classloaders. A jar on the wrong loader is invisible; a jar on the parent loader can shadow the job’s copy.
- “Drop a jar in the plugins directory” is code execution under the process identity—owners, checksums, and promotion paths matter as much as for application dependencies.

When reviewing Spark/Kafka-adjacent packaging: which loader sees which jar, and who is allowed to add jars at runtime?

### 8. Case classes and Java serializers

Scala **case classes** are great domain types; they are **not** automatically safe to shove through Java serialization or reflective Java bean serializers.

- Default Java serialization of Scala types (including case classes and collections) participates in the same **deserialization trust** problem as any other JVM type—untrusted bytes must not drive `ObjectInputStream` (chapter 15).
- Jackson/Gson-style Java serializers often expect bean getters, no-arg constructors, or annotations on the members they actually read; case-class accessors and synthetic members surprise frameworks unless you own the codec layer.
- Prefer explicit codecs / schema formats at trust boundaries; do not “serialize the case class” as a casual interop shortcut to untrusted peers.

### 9. Exceptions, `getMessage`, and logging as exfil

Scala does not check Java checked exceptions. Convert at the boundary—and treat messages as data that may leave the process:

```scala
import scala.util.Try
import java.io.IOException

def readFully(path: String): Either[String, String] =
  Try {
    val bytes = java.nio.file.Files.readAllBytes(java.nio.file.Path.of(path))
    new String(bytes, java.nio.charset.StandardCharsets.UTF_8)
  }.toEither.left.map {
    case e: IOException => s"io: ${e.getClass.getSimpleName}"
    case e              => s"other: ${e.getClass.getSimpleName}"
  }
```

**`Throwable.getMessage`**, SQLException detail, HTTP client errors, and Java logging bridges routinely embed paths, tokens, connection URIs, or PII. Logging `e.getMessage` or `e.printStackTrace` to a centralized sink is a common **secret/PII exfil** path—not merely noisy ops. Map to stable error codes for callers; redact before logs (chapter 15).

### 10. Scala 2 vs 3 on the JVM

Scala 3 and 2.13 can interoperate with care (tasty/ TASTy and binary compatibility tooling), but treating them as drop-in interchangeable on one classpath is unsafe. Pin one primary Scala line per artifact; use documented interop strategies for migrations.

---

## 3. Applications and use cases

### Services and libraries

- Wrap Java clients (HTTP, AWS, JDBC) behind Scala facades that return `Option`/`Either` and Scala collections—**one owned facade** per external system, not ad-hoc calls from every package.
- Expose Java facades when publishing libraries to Java-first consumers; facade ownership includes nullability docs and version compatibility.

```scala
final class JdbcUsers(ds: javax.sql.DataSource):
  def emailFor(id: String): Option[String] =
    val conn = ds.getConnection
    try
      val ps = conn.prepareStatement("select email from users where id = ?")
      try
        ps.setString(1, id)
        val rs = ps.executeQuery()
        if rs.next() then Option(rs.getString(1)) else None
      finally ps.close()
    finally conn.close()
```

### Data platforms

- Spark APIs are Java/Scala hybrids—match cluster Scala and library versions; respect `Provided` classpaths and plugin loaders.
- Convert Java bean rows to case classes at the edge of your code, not ad hoc everywhere; do not Java-serialize those case classes across untrusted hops.

### Security

- Validate and encode at boundaries; do not trust Java library defaults for crypto/TLS without review.
- Treat reflection / `setAccessible` / wide `MethodHandles.Lookup` as privileged; ban untrusted class-name load paths.
- Avoid logging raw Java exception messages that may contain sensitive data; review SPI/plugin jar promotion like application deploys.

```scala
def safeMessage(t: Throwable): String =
  s"${t.getClass.getSimpleName}"  // avoid t.getMessage if it may contain secrets/PII
```

### Operations

- Same JDK major in CI test runtime and production unless a deliberate matrix says otherwise.
- Surface `NoSuchMethodError` as classpath **eviction** incidents—capture dependency trees in the runbook; confirm which jar won on the runtime image.

### Staff-level review checklist

- [ ] Nulls converted at Java boundaries; no `null` in core Scala domain types.
- [ ] Collections converted intentionally; no long-lived shared mutable Java lists in domain code.
- [ ] SAM/lambda targets clear for Java APIs.
- [ ] **Facade ownership** named for each Java-facing or Java-backed edge (who maintains signatures and null contracts).
- [ ] Classpath: Scala binary version, **evictions**, and `Provided` runtimes reviewed against the deploy image—not only `sbt run`.
- [ ] Build JDK, `--release`/target, and runtime JDK documented and aligned.
- [ ] Java-facing APIs avoid exposing hard-to-call Scala encodings without a facade.
- [ ] Framework **annotations placed on the members the framework actually reads** (field vs accessor vs constructor)—verified, not assumed.
- [ ] HashMap/get nulls wrapped with `Option(...)` before domain use.
- [ ] No untrusted reflective load/`setAccessible` shortcuts; SPI/`META-INF/services` and plugin jars have owners.
- [ ] Case classes at serializer boundaries use owned codecs; no untrusted Java deserialization (chapter 15).
- [ ] Logs/metrics do not exfiltrate `getMessage` / Java-client detail that may hold secrets or PII.

---

## References

- [Scala 3 Book: Interacting with Java](https://docs.scala-lang.org/scala3/book/taste-interact-with-java.html)
- [Scala with Java](https://docs.scala-lang.org/tutorials/scala-with-java.html)
- [JDK Compatibility](https://docs.scala-lang.org/overviews/jdk-compatibility/overview.html)
- [Scala JDK Collection Converters](https://www.scala-lang.org/api/current/scala/jdk/CollectionConverters$.html)
- [Scala Standard Library](https://www.scala-lang.org/api/current/)
- [Scala Documentation](https://docs.scala-lang.org/)
- [Scala Language](https://www.scala-lang.org/)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
