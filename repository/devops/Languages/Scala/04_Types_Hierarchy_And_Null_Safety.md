# Types, hierarchy, and null safety

[← Back to Scala](./README.md)

## What this chapter covers

Scala’s **type hierarchy** on the JVM (`Any`, `AnyRef`, `AnyVal`, `Nothing`, `Null`, `Unit`), how **type inference** helps without erasing contracts, and the production habit of preferring **`Option`** over **`null`**—especially at **Java** boundaries where null still leaks in. This chapter is about reading types as contracts, not memorizing every stdlib class.

---

## 1. Concepts (basic)

### 1. Static types, clear contracts

Scala is **statically typed**: the compiler checks types before runtime. That catches entire classes of mismatches early—wrong arguments, impossible assignments, missing cases when combined with sealed hierarchies (later chapters).

Types are not bureaucracy. They are the API between modules: what you can pass, what you get back, and what “absence” means.

```scala
def add(a: Int, b: Int): Int = a + b

// add("1", 2)  // does not compile — that is the point
```

### 2. Top of the hierarchy: `Any`

Every Scala value is an instance of **`Any`**. Beneath `Any` sit two branches:

| Branch | What lives there |
|--------|------------------|
| **`AnyVal`** | Value types: `Int`, `Long`, `Double`, `Boolean`, `Char`, `Unit`, … |
| **`AnyRef`** | Reference types: all classes (including Java `Object` counterparts) |

Rough JVM intuition: `AnyRef` aligns with objects on the heap; `AnyVal` covers Scala’s representation of primitives and a few special types. You rarely write `Any` in application code—prefer precise types.

```scala
val n: AnyVal = 42
val s: AnyRef = "hi"
val both: Any = n   // everything is Any, but prefer narrower types
```

### 3. Bottom types: `Nothing` and `Null`

- **`Nothing`** — The type with **no values**. Used for expressions that never return normally (throwing, infinite loops) and as the bottom of the type lattice (subtype of everything). Empty collections are often typed with `Nothing` elements until you add values.
- **`Null`** — The type of the **`null`** reference. It is a subtype of all `AnyRef` types, not of `AnyVal`. That is why `null` cannot inhabit `Int` in Scala’s model the way a missing object reference can inhabit `String`.

```scala
def fail(msg: String): Nothing =
  throw IllegalStateException(msg)

val xs = List()           // often List[Nothing] until ascribed
val ys: List[Int] = List()
```

### 4. `Unit`

**`Unit`** is the type of side-effecting expressions that return no useful value—analogous to Java `void`, but it is a real type with a single value `()`. Methods that only log or write often return `Unit`. Prefer returning meaningful values when the result matters for composition.

```scala
def log(msg: String): Unit =
  println(msg)

val u: Unit = ()
```

### 5. Type inference

Local bindings and many method bodies can omit annotations:

```scala
val xs = List(1, 2, 3)   // List[Int]
```

Inference is a convenience, not a substitute for design. Public APIs, complex generics, and overloaded Java interop often need **explicit** types so readers and binary compatibility stay stable.

```scala
// Public API: write the contract
def ids(): List[String] = loadIds()

// Local: inference is fine
val n = ids().size
```

### 6. Prefer `Option` over `null` in Scala code

**`Option[A]`** is either `Some(value)` or `None`. It makes absence **visible in the type**:

```scala
def findUser(id: String): Option[User] = ???
```

Callers must handle both cases (via `map`/`flatMap`/`match`/for-comprehensions). That is stronger than a comment saying “may return null.”

```scala
val email: Option[String] = Some("ada@example.com")
val missing: Option[String] = None

val label = email.map(_.toUpperCase).getOrElse("unknown")
```

Team default for new Scala:

- Domain APIs return **`Option`**, **`Either`**, or other explicit types—not bare nullable references.
- Reserve `null` for **edges** forced by Java APIs or legacy signatures.

Before / after:

```scala
// Before (Java-shaped): easy to forget the null check
def departmentOf(user: User): String =
  user.department  // might be null → NPE later

// After: absence is part of the signature
def departmentOf(user: User): Option[String] =
  Option(user.department)  // null → None
```

### 7. Java null at the edges

Java libraries and older APIs return `null`. When you cross the boundary:

1. **Lift** immediately: wrap into `Option(javaResult)` (which turns `null` into `None`).
2. Do not let null propagate deep into Scala domain code.
3. Document any public method that still exposes Java-nullable types for interop callers.

```scala
def readHeader(headers: java.util.Map[String, String], key: String): Option[String] =
  Option(headers.get(key))   // Java get → null → None
```

Ignoring this rule is the most common source of `NullPointerException` in otherwise careful Scala services.

### 8. `Either` and `Try` as cousins (literacy)

When absence is not enough—you need a **reason**—reach for richer types (deepened in collections/error chapters):

```scala
def parsePort(raw: String): Either[String, Int] =
  raw.toIntOption.toRight(s"not a port: $raw")

def readFile(path: String): Try[String] =
  Try(java.nio.file.Files.readString(java.nio.file.Path.of(path)))
```

Mental model: `Option` = maybe missing; `Either` = failure message or value; `Try` = exception-shaped success/failure.

---

## 2. Advanced concepts

### 1. Hierarchy sketch (mental model)

```text
                  Any
                 /   \
            AnyVal   AnyRef  (≈ Java Object)
              |         \
        Int, …, Unit    all classes
                            \
                            Null
Any has bottom: Nothing (subtype of all types)
```

Use this when reading error messages about expected types, variance, and “found Null / Nothing.”

### 2. `null` and `AnyVal`

Scala prevents assigning `null` to `Int` and other `AnyVal` types in normal code. Do not assume the same safety for **Java boxed** types or generic erasure corners—interop and raw Java still surprise people.

```scala
// val n: Int = null   // does not compile

val boxed: java.lang.Integer = null   // legal Java reference… dangerous
val lifted: Option[Int] = Option(boxed).map(_.intValue)
```

### 3. Variance preview (why types feel strict)

Collections and function types use variance (`+A`, `-A`) so `List[Dog]` can relate to `List[Animal]` correctly. You do not need full variance theory yet; know that “it won’t compile” often means the hierarchy relationship is intentional, not the compiler being pedantic.

```scala
// List is covariant in A: List[Dog] can be a List[Animal] in many APIs
trait Animal
class Dog extends Animal
val dogs: List[Dog] = List(Dog())
val animals: List[Animal] = dogs
```

### 4. Overusing `Any` / `Object`

`Any` and Java `Object` erase meaning. They show up in poorly typed maps, dynamic configs, and “temporary” caches that become permanent. Prefer `Map[String, Json]`, ADTs, or typed config libraries.

```scala
// Bad: untyped junk drawer
val bag: Map[String, Any] = Map("port" -> 8080, "host" -> "localhost")

// Better direction: a real config type
case class HttpConfig(host: String, port: Int)
```

### 5. Scala 2 versus Scala 3 null stories

Both lines have `null` and `Option`. Scala 3 continues the culture of explicit absence; experimental or optional null-safety features may appear in tooling over time, but **production habit** remains: don’t invent nulls in Scala APIs. Brownfield Scala 2 services may be null-heavy at Java edges—refactor at boundaries first.

### 6. NPEs are still possible

`Option` does not make NPE impossible:

- You called `.get` on `None`
- You passed Scala values into Java APIs that store nulls
- You used uninitialized fields in awkward initialization orders
- Reflection or deserialization constructed bad objects

Treat `.get` and `.head` as **assert-like** operations: fine in tests after setup, rare in production paths.

```scala
// Bad in production paths
val email = findEmail(id).get

// Good: explicit fallback or fail with context
val email = findEmail(id).getOrElse(sys.error(s"missing email for $id"))
```

### 7. Inference pitfalls

```scala
val empty = List()                    // List[Nothing]
// empty :+ "a" works, but signatures get weird in larger code

val emptyS: List[String] = List()     // clearer

def id[A](a: A) = a                   // return type inferred — OK privately
def published[A](a: A): A = a         // public: keep the contract visible
```

Polymorphic returns and Java overloads are where inference most often needs help—add ascriptions early.

### 8. Common compiler errors and what they mean

| Message (paraphrased) | Meaning | Fix habit |
|-----------------------|---------|-----------|
| type mismatch; found `Null` | You passed `null` where a precise type was expected | Use `Option` or a real value |
| type mismatch; found `Nothing` | Empty collection / bottom typed expression leaked | Ascribe the element type |
| missing argument list / overloaded | Inference failed picking a Java overload | Add explicit types on args |
| `.get` on Option warnings (style tools) | Assert-like call in app code | Prefer `match` / `fold` / `getOrElse` |

### 9. REPL tips for types

```bash
sbt console
```

```scala
scala> :type List(1, 2, 3)
scala> :type Option("x").map(_.length)
scala> :type List()
```

Ask `:type` whenever a public signature feels fuzzy.

---

## 3. Applications and use cases

### Software engineering

- Module boundaries: express optional fields as `Option` in case classes; avoid “empty string means missing” unless the domain truly needs it.
- JSON/API layers: distinguish **missing field**, **null field**, and **empty value** explicitly in codecs—do not collapse them silently.
- Shared Java/Scala libraries: publish a Java-friendly nullable API *and* a Scala `Option` façade if both audiences matter.

```scala
case class User(id: String, nickname: Option[String])

def displayName(u: User): String =
  u.nickname.getOrElse(u.id)
```

### Config reading mini-pattern

Fail fast when required config is absent; use `Option` for optional knobs:

```scala
final case class AppConfig(
  dbUrl: String,
  featureFlag: Boolean
)

object AppConfig:
  def load(): AppConfig =
    val dbUrl =
      sys.env.get("DB_URL")
        .getOrElse(throw IllegalStateException("DB_URL required"))
    val featureFlag =
      sys.env.get("FEATURE_X").map(_.toBoolean).getOrElse(false)
    AppConfig(dbUrl, featureFlag)
```

### CLI argv sketch

```scala
@main def run(userId: String): Unit =
  val email = findEmail(userId)
  email match
    case Some(e) => println(s"email=$e")
    case None    =>
      System.err.println(s"no email for userId=$userId")
      sys.exit(1)
```

### Systems and reliability

- Log and metrics code should not throw NPE on missing tags; use `Option` or defaults at the edge.
- Health checks should return a typed status, not a nullable string.

```scala
enum Health:
  case Ok, Degraded(reason: String)

def checkDb(ping: Option[Long]): Health =
  ping match
    case Some(ms) if ms < 100 => Health.Ok
    case Some(ms)             => Health.Degraded(s"slow ${ms}ms")
    case None                 => Health.Degraded("unreachable")
```

### Security

- Absent tokens/headers are `None`, not null strings that later concatenate into “Bearer null”.
- Deserialization of untrusted payloads must not assume non-null nested objects—validate into typed ADTs.

```scala
def bearerToken(header: Option[String]): Option[String] =
  header
    .map(_.trim)
    .filter(_.nonEmpty)
    .collect { case s if s.startsWith("Bearer ") => s.drop(7).trim }
    .filter(_.nonEmpty)
```

Logging without leaking secrets:

```scala
case class Session(userId: String, token: String):
  override def toString: String = s"Session(userId=$userId, token=***)"
```

### Data platforms

- Spark and Java-heavy pipelines still produce nulls in rows; isolate null handling at dataset boundaries instead of infecting pure transformers.
- Prefer explicit optional columns in domain models when moving from DataFrames into typed Scala.

```scala
def cellToOption(value: String): Option[String] =
  Option(value).map(_.trim).filter(_.nonEmpty)  // null → None
```
### Staff-level review checklist

- New Scala APIs do not return raw **`null`** for absence.
- Java interop results are lifted to **`Option`** (or validated) at the boundary.
- No casual `.get` / `.head` on values that can be empty in production paths.
- Public signatures use precise types—not `Any`—unless dynamically typed data is the point.
- Config and request parsing treat missing values as errors or explicit defaults, never silent nulls.
- Optional domain fields are `Option[...]`, not magic empty strings—unless the domain truly needs both.
- Secrets never appear in derived `toString` / log interpolation.

---

## References

- [Scala 3 Book — A First Look at Types](https://docs.scala-lang.org/scala3/book/first-look-at-types.html)
- [Tour of Scala — Unified Types](https://docs.scala-lang.org/tour/unified-types.html)
- [Tour of Scala — Classes](https://docs.scala-lang.org/tour/classes.html)
- [Scala 3 Book — Domain Modeling](https://docs.scala-lang.org/scala3/book/domain-modeling-intro.html)
- [Scala Standard Library — Option](https://www.scala-lang.org/api/3.x/scala/Option.html)
- [Scala Standard Library — Either](https://www.scala-lang.org/api/3.x/scala/Either.html)
- [Tour of Scala — Variances](https://docs.scala-lang.org/tour/variances.html)
- [Scala Documentation Hub](https://docs.scala-lang.org/)
