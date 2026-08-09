# Collections, Option, Either, and Try

[← Back to Scala](./README.md)

## What this chapter covers

Scala’s default **immutable collections**, intuition for **List**, **Vector**, **Map**, and **Set**, and the standard types for absence and failure: **Option**, **Either**, and **Try**. Mutable collections appear only where mutation is justified. This chapter is about choosing the right container and making failure visible in the type—not memorizing every method name. After it you should write clear pipelines, convert null at edges, and pick `Option` vs `Either` vs `Try` deliberately.

---

## 1. Concepts

### 1. Immutable by default

The common imports (`List`, `Map`, `Set`, `Vector`) refer to **immutable** implementations. Transforming a collection returns a **new** value; the original remains unchanged. That default supports safe sharing across threads and clearer reasoning about data flow.

```scala
val xs = List(1, 2, 3)
val ys = xs :+ 4       // List(1, 2, 3, 4); xs unchanged
val zs = 0 :: xs       // List(0, 1, 2, 3); prepend is cheap on List
```

Prefer immutability in domain and service code. Reach for `scala.collection.mutable` only at clear boundaries (builders, local buffers, performance hotspots with measured need).

### 2. List, Vector, Map, Set — when to reach for which

| Type | Intuition | Typical use |
|------|-----------|-------------|
| **List** | Singly linked; cheap prepend (`::`); linear access by index | Small sequences, recursive/functional pipelines, head/tail processing |
| **Vector** | Balanced tree; good random access and updates | Larger sequences, indexed reads, mixed append/update |
| **Map** | Key → value | Lookups, indexes, config bags |
| **Set** | Unique elements | Membership, deduplication |

`Seq` is a common abstract view; concrete choice still matters for performance. `LazyList` (Scala 2.13+/3) models lazy infinite or large streams—use deliberately, not as a default List replacement.

```scala
val byId: Map[String, Int] = Map("a" -> 1, "b" -> 2)
val ids: Set[String] = byId.keySet
val third: Option[Int] = Vector(10, 20, 30).lift(2)  // Some(30); safe index
```

### 3. Transformation vocabulary (with step comments)

Everyday operations: `map`, `flatMap`, `filter`, `fold`/`foldLeft`, `collect`, `groupBy`, `zip`. Prefer clear pipelines over manual index loops. Know that `map` + nested collections often wants `flatMap` (or `for`-comprehensions) to avoid nested structures.

```scala
case class User(id: String, email: Option[String], active: Boolean)

val users: List[User] = List(
  User("1", Some("a@ex.com"), true),
  User("2", None, true),
  User("3", Some("b@ex.com"), false)
)

val activeEmails: List[String] =
  users
    .filter(_.active)           // keep active users only
    .flatMap(_.email)           // Option[String] → flatten into List[String]
    .map(_.toLowerCase)         // normalize
    .distinct                   // drop duplicates
    .sorted                     // stable presentation order
```

Another chain for grouping and aggregates:

```scala
val countsByDomain: Map[String, Int] =
  users
    .flatMap(_.email)                         // List[String]
    .map(e => e.dropWhile(_ != '@').drop(1))  // domain part
    .filter(_.nonEmpty)
    .groupBy(identity)                        // Map[domain, List[domain]]
    .view
    .mapValues(_.size)                        // Map[domain, Int]
    .toMap
```

### 4. for-comprehension vs flatMap (equivalence once)

A `for`-comprehension desugars to `map` / `flatMap` / `withFilter`. Prefer whichever form is clearer; know they are the same machine.

```scala
val userIds: List[String] = List("1", "2", "missing")
def find(id: String): Option[User] = users.find(_.id == id)

// for-comprehension
val emailsFor: List[String] =
  for
    id    <- userIds
    user  <- find(id).toList      // Option → 0/1 element List
    email <- user.email.toList
    if user.active
  yield email.toLowerCase

// equivalent flatMap / map / withFilter chain
val emailsFlat: List[String] =
  userIds
    .flatMap(id => find(id).toList)
    .withFilter(_.active)
    .flatMap(user => user.email.toList)
    .map(_.toLowerCase)
```

Same idea over `Option` alone (no lists):

```scala
def lookupEmail(id: String): Option[String] =
  for
    user  <- find(id)
    email <- user.email
  yield email

// equivalent:
def lookupEmail2(id: String): Option[String] =
  find(id).flatMap(_.email)
```

### 5. Option — absence without null

`Option[T]` is `Some(value)` or `None`. It makes missing data explicit at the type level. Prefer `Option` over `null` in new Scala APIs.

```scala
def findUser(id: String): Option[User] =
  users.find(_.id == id)

val email: String =
  findUser("1").map(_.email).flatten.getOrElse("unknown")

val email2: String =
  findUser("1").flatMap(_.email).getOrElse("unknown")
```

Core habits: `map`/`flatMap`/`filter` for transforms; `getOrElse`/`orElse` for defaults; avoid `.get` except when a prior guard makes absence impossible.

```scala
val fromHeader: Option[String] = Some("  ")
val fromQuery: Option[String] = Some("id-9")

val id: Option[String] =
  fromHeader
    .map(_.trim)
    .filter(_.nonEmpty)
    .orElse(fromQuery)   // fall back if header blank/missing
```

Null boundary (Java edge):

```scala
def boxEmail(javaNullable: String | Null): Option[String] =
  Option(javaNullable)   // Option(null) == None
```

### 6. Either — typed failure or choice

`Either[L, R]` is conventionally **Right-biased** for success: `Right(success)` and `Left(error)`. Use when callers must handle a **domain error** (validation, business rejection) without throwing.

```scala
def parsePort(s: String): Either[String, Int] =
  s.toIntOption.toRight("not a number").flatMap { n =>
    if n > 0 && n < 65536 then Right(n) else Left("out of range")
  }

def loadPort(env: Map[String, String]): Either[String, Int] =
  for
    raw <- env.get("PORT").toRight("PORT missing")
    n   <- parsePort(raw)
  yield n
```

`map`/`flatMap` operate on `Right`. Pattern-match or `fold` to handle both sides at the edge.

```scala
val message: String =
  parsePort("99999").fold(
    err => s"reject: $err",
    port => s"ok: $port"
  )
```

### 7. Try — exceptions as values

`Try[T]` is `Success(t)` or `Failure(throwable)`. Wrap unsafe calls (parsing, Java libraries that throw) so exceptions become data you can map or recover from.

```scala
import scala.util.{Try, Success, Failure}

val n: Int = Try("12".toInt).getOrElse(0)

def readInt(raw: String): Either[String, Int] =
  Try(raw.toInt) match
    case Success(v) => Right(v)
    case Failure(_) => Left(s"not an int: $raw")
```

Prefer `Either` for expected domain errors; prefer `Try` at boundaries that throw. Do not catch broadly and discard—log or convert with context.

```scala
def safeDivide(a: Int, b: Int): Try[Int] =
  Try(a / b).recover {
    case _: ArithmeticException => 0
  }
```

---

## 2. Advanced concepts

### 1. Views and builders

**Views** delay transformations until forced—useful for large pipelines, easy to accidentally recompute. **Builders** and mutable buffers construct immutable results efficiently inside a method; expose the immutable snapshot outward.

```scala
val xs = (1 to 1000000).view
  .map(_ * 2)
  .filter(_ % 3 == 0)
  .take(5)
  .toList   // force once

import scala.collection.mutable.ListBuffer

def buildIds(n: Int): List[String] =
  val buf = ListBuffer.empty[String]
  var i = 0
  while i < n do
    buf += s"id-$i"
    i += 1
  buf.toList   // immutable outward
```

### 2. Equality and hashing

Collection equality is structural for standard immutable types. Mutable collections as map keys are a footgun (hash codes change). Prefer immutable keys. Case classes inside collections inherit field equality—keep them free of mutable internals.

```scala
val a = List(1, 2, 3)
val b = Vector(1, 2, 3)
// a == b  → true (same elements); types differ but equality compares contents for GenSeq
```

### 3. Parallel collections literacy

Historical parallel collections exist; modern teams often prefer explicit Futures, other effect runtimes, or JDK parallelism rather than “sprinkle `.par`.” Treat parallel collections as a deliberate, measured choice with ordering and side-effect caveats.

### 4. Null interop and Option

Java APIs return `null`. Convert at the boundary: `Option(javaNullable)` (note: `Option(null)` is `None`). Do not let `null` propagate through Scala domain types. Conversely, when calling Java, `.orNull` or explicit null may be required—keep that at the edge (chapter 12).

```scala
def toJava(email: Option[String]): String =
  email.orNull   // boundary only
```

### 5. Nested contexts

`Option[Either[E, T]]` and `List[Option[T]]` appear often. Flatten with purpose (`flatMap`, `separate`, sequence helpers in libraries) rather than deep nesting. Pick one error channel per layer: do not mix thrown exceptions, `Try`, and `Either` without a conversion story.

```scala
val maybes: List[Option[Int]] = List(Some(1), None, Some(3))
val present: List[Int] = maybes.flatten

val results: List[Either[String, Int]] =
  List("1", "x", "3").map(s => s.toIntOption.toRight(s"bad:$s"))

val (errors, values) =
  results.partitionMap {
    case Left(e)  => Left(e)
    case Right(v) => Right(v)
  }
```

### 6. Mutable collections when justified

Justified patterns:

- Local `ArrayBuffer` / `ListBuffer` to build, then `.toList` / `.toVector`.
- Concurrent maps for shared caches with documented eviction and threading rules.
- High-churn internal structures behind an immutable API.

```scala
import scala.collection.mutable

def indexById(users: List[User]): Map[String, User] =
  val m = mutable.HashMap.empty[String, User]
  users.foreach(u => m.update(u.id, u))
  m.toMap
```

Unjustified: mutating shared collections across modules “for convenience.”

---

## 3. Applications and use cases

### Software engineering

- Model optional fields as `Option`, not sentinel strings or `-1`.
- Validation pipelines as `Either` (or dedicated validation types) keep HTTP/API errors structured.
- Prefer `Vector` for large append-heavy logs of events; `List` for small functional transforms.

```scala
enum ApiError:
  case NotFound(id: String)
  case Invalid(msg: String)

def requireUser(id: String): Either[ApiError, User] =
  findUser(id).toRight(ApiError.NotFound(id))
```

### Data and pipelines

- Spark and data APIs have their own collection story; do not assume in-memory `List` idioms scale to distributed datasets.
- At in-memory ETL edges, immutable transforms simplify retries and debugging.

### Reliability and operations

- Failures as `Either`/`Try` at module edges make metrics and logging consistent (`Left` counts, failure types).
- Avoid swallowing `Failure` without metrics—silent `getOrElse(default)` hides outages.

```scala
def parseOrMetric(raw: String): Int =
  Try(raw.toInt) match
    case Success(v) => v
    case Failure(_) =>
      // metrics.increment("parse.fail")
      0
```

### Security

- Do not put secrets into collection `toString` dumps or debug logs.
- Bound collection sizes from untrusted input (request lists, query params) to avoid memory abuse.

```scala
def takeBounded[A](xs: List[A], max: Int): Either[String, List[A]] =
  if xs.sizeIs > max then Left(s"too many: ${xs.size}") else Right(xs)
```

### Staff-level review checklist

- New APIs use immutable collections unless mutation is local and justified.
- `Option`/`Either`/`Try` chosen appropriately; `.get` rare and justified.
- Java nulls converted at boundaries.
- No mutable collections as map keys or long-lived shared state without concurrency design.
- Error types are meaningful (`Left` is not always `String` forever—evolve when needed).
- Untrusted input sizes bounded before materializing large collections.
- Pipelines prefer `flatMap`/`for` over nested `map` that accidentally builds `List[Option[…]]`.

---

## References

- [Scala 3 Book: Collections](https://docs.scala-lang.org/scala3/book/collections-intro.html)
- [Scala 3 Book: Collection Types](https://docs.scala-lang.org/scala3/book/collections-classes.html)
- [Scala 3 Book: Collections Methods](https://docs.scala-lang.org/scala3/book/collections-methods.html)
- [Scala 3 Book: Functional Error Handling](https://docs.scala-lang.org/scala3/book/fp-functional-error-handling.html)
- [Tour of Scala: Sequences](https://docs.scala-lang.org/tour/sequence-comprehensions.html)
- [Tour of Scala: Options](https://docs.scala-lang.org/tour/options.html)
- [Scala Standard Library](https://www.scala-lang.org/api/current/)
- [Scala Documentation](https://docs.scala-lang.org/)
