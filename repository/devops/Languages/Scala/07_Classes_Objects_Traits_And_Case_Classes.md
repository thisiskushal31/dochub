# Classes, objects, traits, and case classes

[← Back to Scala](./README.md)

## What this chapter covers

How Scala organizes types and behavior: **classes**, **objects**, **companions**, **traits** (mixins), **case classes**, and **enums** (Scala 3). This is the domain-modeling toolkit you need before collections, pattern matching, and packaging—Scala’s OOP and FP styles share one type system. After this chapter you should choose the right shape for a type, know when companions and mixins help, and spot equality and initialization footguns in review.

---

## 1. Concepts

### 1. Classes hold state and methods

A **class** defines a type with constructor parameters and members. Primary constructor parameters can be fields (`val`/`var`) or plain constructor args. Methods live on instances; `this` is the current instance.

```scala
class Service(val name: String, port: Int):
  def label: String = s"$name:$port"
  def bindsLocalhost: Boolean = port > 0
```

`name` is a public field; `port` is a constructor parameter visible inside the class body but not automatically exposed as a field unless marked `val`/`var`. Prefer immutable fields (`val`) unless mutation is deliberate.

Secondary constructors are rare in modern Scala; prefer companion factories that validate and return `Option` or `Either`.

```scala
class Port private (val value: Int)

object Port:
  def fromInt(n: Int): Option[Port] =
    if n > 0 && n < 65536 then Some(new Port(n)) else None
```

### 2. Objects: singletons without `new`

An **`object`** is a singleton: one instance, created lazily on first use. Use objects for namespaces, entry points (`main`), factories, and pure utilities that do not need per-instance state.

```scala
object AppConfig:
  val DefaultPort = 8080
  def banner: String = s"listening on $DefaultPort"
```

In Scala 3, `main` methods can live on objects (or use `@main`). There is no separate “static” keyword: **object members** play that role on the JVM.

```scala
@main def runBilling(args: String*): Unit =
  println(s"args=${args.mkString(",")}")
```

### 3. Companions: class + object with the same name

A **companion** pair is a `class`/`trait`/`enum` and an `object` with the **same name** in the same file (conventionally). Companions share private access: the object can construct or inspect private members of the class, and vice versa.

Typical split:

| Lives on | Role |
|----------|------|
| **Class / case class** | Per-instance state and behavior |
| **Companion object** | Factories (`apply`), constants, parsers, shared caches |

`apply` on the companion lets callers write `User("a")` instead of `new User("a")`. Case classes generate `apply` for you.

```scala
final class UserId private (val raw: String)

object UserId:
  def apply(raw: String): Either[String, UserId] =
    val t = raw.trim
    if t.isEmpty then Left("empty id")
    else Right(new UserId(t))

  def unsafe(raw: String): UserId =
    apply(raw).fold(err => throw IllegalArgumentException(err), identity)
```

Keep `unsafe` for tests and trusted internals; production parsers should return `Either` or `Option`.

### 4. Traits: interfaces and mixins

A **trait** defines an abstract interface, concrete methods, and fields that can be **mixed into** classes and other traits. Scala allows mixing multiple traits; linearization defines method lookup order when several traits define the same member.

```scala
trait Logged:
  def log(msg: String): Unit = println(msg)

class Worker extends Logged:
  def run(): Unit = log("running")
```

Prefer traits for shared behavior and capability boundaries (`Closeable`, `Repository`). Prefer classes when you need a concrete primary constructor and a single “is-a” root. Traits can take parameters in Scala 3; Scala 2 traits were more limited—brownfield code often uses abstract classes for parameterized bases.

```scala
trait Repository[A]:
  def get(id: String): Option[A]
  def put(value: A): Unit

trait Audited[A] extends Repository[A]:
  abstract override def put(value: A): Unit =
    println(s"audit put=$value")
    super.put(value)
```

### 5. Case classes vs ordinary classes

A **case class** is a class optimized for immutable data:

- Constructor params are `val` fields by default.
- **Structural equality** (`==`) and **hashCode** are derived from fields.
- **`copy`** builds a modified instance without mutating the original.
- **`unapply`** (extractor) enables pattern matching.
- A companion with `apply` is generated.

```scala
case class User(id: String, email: String)

val u = User("1", "a@example.com")
val u2 = u.copy(email = "b@example.com")
// u == User("1", "a@example.com")  → true (field equality)
```

Side-by-side contrast with an ordinary class that keeps **reference identity**:

```scala
class Session(val id: String):
  override def toString: String = s"Session($id)"

val a = Session("s1")
val b = Session("s1")
// a == b  → false by default (reference equality unless you override)
```

Use case classes for messages, DTOs, domain records, and ADT variants. Use ordinary classes when identity, mutable encapsulation, or non-derived equality matters more than field-wise comparison.

### 6. Enums (Scala 3 literacy)

Scala 3 **`enum`** defines a closed set of cases—often replacing sealed trait hierarchies for simple ADTs:

```scala
enum Status:
  case Ready, Busy
  case Failed(reason: String)

def describe(s: Status): String = s match
  case Status.Ready          => "ready"
  case Status.Busy           => "busy"
  case Status.Failed(reason) => s"failed: $reason"
```

Cases can be parameterless or carry data. Enums participate in pattern matching and exhaustiveness checking. Scala 2 code typically used `sealed trait` + `case object` / `case class` instead; both styles appear in mixed codebases.

```scala
// Scala 2 / brownfield shape still common
sealed trait Status2
case object Ready2 extends Status2
case object Busy2 extends Status2
case class Failed2(reason: String) extends Status2
```

---

## 2. Advanced concepts

### 1. Construction, `new`, and opaque factories

Scala 3 softens `new` for many constructions; companions and case-class `apply` remain the clear factory surface. Hide unsafe constructors behind companion methods that validate and return `Option`/`Either` so invalid states never leave the factory.

```scala
opaque type Email = String

object Email:
  def parse(raw: String): Either[String, Email] =
    if raw.contains("@") then Right(raw.trim.toLowerCase) else Left("bad email")

  def asString(e: Email): String = e
```

Opaque types (Scala 3) pair well with companions: the wrapper is zero-cost at runtime while the API stays typed.

### 2. Trait linearization and stackable mods

When a class mixes `A with B with C`, method resolution follows **linearization** (rightmost trait wins for overrides, with careful `super` stacking). Stackable traits that call `super` can compose behavior (logging, metrics)—powerful and easy to misuse.

Sketch (read right-to-left for “who wins,” then follow `super` up the chain):

```scala
trait Soft:
  def greet: String = "soft"

trait Loud extends Soft:
  override def greet: String = "LOUD-" + super.greet

trait Prefix extends Soft:
  override def greet: String = ">>" + super.greet

class A extends Soft with Loud with Prefix
class B extends Soft with Prefix with Loud

// A().greet → ">>LOUD-soft"   (Prefix outermost, then Loud, then Soft)
// B().greet → "LOUD->>soft"   (Loud outermost, then Prefix, then Soft)
```

Prefer small traits with clear contracts over deep mixin graphs. If reviewers cannot sketch the linearization, the design is too clever.

### 3. Abstract classes vs traits

Use an **abstract class** when you need Java-style single inheritance of constructor state, JVM interop that expects a class, or binary-compatible base types in libraries. Use traits for mixin capability. Multiple class inheritance is not allowed; multiple traits are.

```scala
abstract class HttpClient(baseUrl: String):
  def get(path: String): String

trait Retries:
  def maxAttempts: Int = 3

class DefaultClient(baseUrl: String) extends HttpClient(baseUrl) with Retries:
  def get(path: String): String = s"GET $baseUrl$path (retries=$maxAttempts)"
```

### 4. Case class pitfalls

- **Equality by fields** surprises teams used to reference equality—document when identity matters and use ordinary classes or custom `equals` carefully (hard to get right).
- Large case classes with many fields make `copy` and equality expensive; split types.
- Nested mutable fields break the “immutable record” story even if the case class itself is a `val`.
- Extending case classes is discouraged; prefer composition or sealed hierarchies.

```scala
case class Bag(items: scala.collection.mutable.ListBuffer[String])

val bag = Bag(scala.collection.mutable.ListBuffer("a"))
val twin = bag.copy()
bag.items += "b"
// twin.items also sees "b" — shared mutable guts
```

### 5. Objects, initialization, and concurrency

Object bodies run on first access. Heavy side effects in object initialization cause order bugs and startup latency. Keep object bodies thin; defer I/O. Singletons are shared across threads—mutable state inside objects needs the same discipline as any global.

```scala
object DbPool:
  // bad: opens connections during class init of the singleton
  // val pool = openPoolFromEnv()

  def pool: ConnectionPool =
    PoolHolder.pool

private object PoolHolder:
  lazy val pool: ConnectionPool = openPoolFromEnv()
```

### 6. Scala 2 vs Scala 3 modeling

| Concern | Scala 3 default | Scala 2 brownfield |
|---------|-----------------|-------------------|
| Closed variants | `enum` | `sealed trait` + cases |
| Trait parameters | Supported | Often abstract class |
| Syntax | Significant indentation optional | Braces dominant |

```scala
// Scala 3 trait parameters
trait Configured(val env: String):
  def prefix: String = s"[$env]"

class Worker(env: String) extends Configured(env):
  def run(): String = s"${prefix} work"
```

Read both shapes; migrate deliberately, not casually.

---

## 3. Applications and use cases

### Software engineering and domain modeling

- Prefer **case classes** / **enums** for domain data and protocol messages; keep invariants in companion factories.
- Use **traits** for ports (hexagonal) and shared capabilities; keep implementations as classes.
- Avoid “god” companions that become global service locators—inject dependencies instead.

```scala
trait Payments:
  def charge(userId: String, cents: Long): Either[String, Receipt]

case class Receipt(id: String, cents: Long)

class StripePayments(client: StripeClient) extends Payments:
  def charge(userId: String, cents: Long): Either[String, Receipt] =
    client.charge(userId, cents).map(id => Receipt(id, cents))
```

### API and library boundaries

- Public case classes are part of your binary and equality contract; changing fields is a breaking change.
- Expose traits as API surfaces when multiple implementations are expected.
- Keep Java-facing types simple (classes/interfaces) when consumers are mixed-language.

### Systems and operations

- Configuration snapshots as immutable case classes make “what was running” easy to log and compare.
- Singletons for process-wide resources (thread pools, clients) need lifecycle hooks for shutdown—do not rely on object init alone.

```scala
case class RuntimeConfig(port: Int, region: String, featureX: Boolean)

object RuntimeConfig:
  def load(env: Map[String, String]): Either[String, RuntimeConfig] =
    for
      port   <- env.get("PORT").flatMap(_.toIntOption).toRight("PORT")
      region <- env.get("REGION").toRight("REGION")
      fx     <- env.get("FEATURE_X").map(_ == "true").toRight("FEATURE_X")
    yield RuntimeConfig(port, region, fx)
```

### Security

- Do not put secrets in `toString` of case classes (derived `toString` prints fields). Override or redact at logging boundaries.
- Validate untrusted input in companions before constructing domain types.

```scala
case class Credentials(user: String, secret: String):
  override def toString: String = s"Credentials(user=$user, secret=<redacted>)"
```

### Staff-level review checklist

- Immutable fields by default; `var` justified.
- Case class vs class choice matches equality/identity needs.
- Companions used for factories/validation, not hidden globals.
- Trait graphs stay shallow; linearization is understandable.
- Enums or sealed hierarchies for closed domains; exhaustiveness expected downstream.
- No secrets in derived `toString`; logging redaction considered.
- Scala 2 sealed hierarchies documented if the module cannot use Scala 3 enums yet.
- Private constructors + companion parsers for types with invariants.

---

## References

- [Scala 3 Book: Domain Modeling](https://docs.scala-lang.org/scala3/book/domain-modeling-intro.html)
- [Scala 3 Book: Tools](https://docs.scala-lang.org/scala3/book/domain-modeling-tools.html)
- [Scala 3 Book: OOP Modeling](https://docs.scala-lang.org/scala3/book/domain-modeling-oop.html)
- [Tour of Scala: Classes](https://docs.scala-lang.org/tour/classes.html)
- [Tour of Scala: Traits](https://docs.scala-lang.org/tour/traits.html)
- [Tour of Scala: Singleton Objects](https://docs.scala-lang.org/tour/singleton-objects.html)
- [Tour of Scala: Case Classes](https://docs.scala-lang.org/tour/case-classes.html)
- [Scala 3 Reference: Enumerations](https://docs.scala-lang.org/scala3/reference/enums/enums.html)
- [Scala Documentation](https://docs.scala-lang.org/)
