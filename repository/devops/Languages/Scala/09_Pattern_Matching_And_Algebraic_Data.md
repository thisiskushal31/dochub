# Pattern matching and algebraic data

[← Back to Scala](./README.md)

## What this chapter covers

**Pattern matching** as Scala’s primary way to branch on structure: exhaustiveness, **case classes** and **enums** as algebraic data types (ADTs), **sealed** hierarchies, **guards**, and **partial function** literacy. After classes and collections, this is how idiomatic Scala encodes “valid states only” and handles them safely. After this chapter you should parse external data into ADTs early, match exhaustively on sealed types, and know when guards or wildcards weaken that guarantee.

---

## 1. Concepts

### 1. `match` is an expression

`match` chooses a branch from patterns and **returns a value**. Every branch should produce a compatible type (the least upper bound of branch types).

```scala
def label(n: Int): String = n match
  case 0 => "zero"
  case 1 => "one"
  case _ => "many"
```

Prefer `match` over chains of `if`/`else` when the decision is about **shape or variant**. Nested matches are fine when each level has a clear type; extract helpers when nesting obscures intent.

```scala
def absLabel(n: Int): String =
  (if n < 0 then -n else n) match
    case 0 => "zero"
    case 1 => "one"
    case x => s"n=$x"
```

### 2. Patterns you use constantly

| Pattern | Meaning |
|---------|---------|
| Constant | `case 0`, `case "x"` |
| Wildcard | `case _` |
| Variable bind | `case x` binds `x` |
| Typed | `case s: String` |
| Constructor / case class | `case User(id, email)` |
| Extractor | `case Foo(a, b)` via `unapply` |
| Sequence | `case List(a, b, rest*)` (syntax varies by version) |
| Tuple | `case (k, v)` |

Case classes and enum cases unlock constructor patterns via generated extractors.

```scala
case class User(id: String, email: String)

def domain(u: User): String = u match
  case User(_, email) =>
    email.split("@") match
      case Array(_, d) => d
      case _           => "unknown"

def pairSum(p: (Int, Int)): Int = p match
  case (a, b) => a + b

def firstTwo(xs: List[Int]): Option[(Int, Int)] = xs match
  case a :: b :: _ => Some((a, b))
  case _           => None
```

### 3. ADTs: data as a closed set of variants

An **algebraic data type** is a type that is one of several known variants, each possibly carrying fields. In Scala:

- **Scala 3:** `enum` with cases.
- **Either era / Scala 2:** `sealed trait` + `case class` / `case object`.

```scala
enum Result[+E, +A]:
  case Ok(value: A)
  case Err(error: E)

def mapOk[E, A, B](r: Result[E, A])(f: A => B): Result[E, B] = r match
  case Result.Ok(a)  => Result.Ok(f(a))
  case Result.Err(e) => Result.Err(e)
```

ADTs make illegal combinations unrepresentable: prefer `Ready | Failed(reason)` over `isReady: Boolean` plus optional reason fields that disagree.

```scala
// fragile: can be isReady=true AND reason=Some(...)
case class JobBad(isReady: Boolean, reason: Option[String])

// honest:
enum Job:
  case Ready
  case Failed(reason: String)
  case Running(pct: Int)
```

### 4. Sealed traits and exhaustiveness

A **`sealed`** trait (or enum) restricts subtypes to the same compilation unit. The compiler can then check that a `match` covers all variants—**exhaustiveness**.

When you add a variant, incomplete matches become compile errors (or warnings, depending on settings). That is a feature for API evolution inside a codebase: the compiler finds call sites.

```scala
sealed trait PaymentEvent
case class Authorized(id: String, cents: Long) extends PaymentEvent
case class Captured(id: String, cents: Long) extends PaymentEvent
case class Refunded(id: String, cents: Long) extends PaymentEvent

def describe(e: PaymentEvent): String = e match
  case Authorized(id, cents) => s"auth $id $cents"
  case Captured(id, cents)   => s"capture $id $cents"
  case Refunded(id, cents)   => s"refund $id $cents"
// no case _ — exhaustiveness is the point
```

Open hierarchies (non-sealed) cannot be exhaustively checked; you need a default branch and accept weaker guarantees.

### 5. Guards

A **guard** is an `if` condition on a case:

```scala
def sign(n: Int): String = n match
  case x if x < 0 => "neg"
  case x if x == 0 => "zero"
  case _ => "pos"
```

Guards refine cases but can break exhaustiveness reasoning—keep them simple. Prefer encoding important distinctions as separate ADT variants when possible.

```scala
enum Temp:
  case Cold, Mild, Hot

def fromCelsius(c: Int): Temp = c match
  case n if n < 10  => Temp.Cold
  case n if n < 25  => Temp.Mild
  case _            => Temp.Hot
```

### 6. Partial functions literacy

A **`PartialFunction[-A, +B]`** is defined only for some inputs. It has `isDefinedAt` and is the type of many `case` blocks used alone (for example `collect`).

```scala
val pf: PartialFunction[Option[Int], Int] =
  case Some(n) if n > 0 => n

List(Some(1), None, Some(-1)).collect(pf)  // List(1)

val lifted: Option[Int] => Option[Int] = pf.lift
// lifted(Some(2))  → Some(2)
// lifted(None)     → None
```

`collect` applies a partial function and drops undefined inputs. `map` does not—know which you mean. Lifting with `.lift` turns a partial function into `A => Option[B]`.

```scala
val events: List[PaymentEvent] = List(
  Authorized("a", 100),
  Captured("a", 100),
  Refunded("a", 40)
)

val refundedCents: List[Long] =
  events.collect { case Refunded(_, cents) => cents }
```

---

## 2. Advanced concepts

### 1. Exhaustiveness vs catch-alls

`case _` silences exhaustiveness checking for remaining variants. Useful at system edges; harmful on internal sealed ADTs where you want compile-time pressure to update handlers. Prefer naming ignored cases or refactoring when a wildcard appears only to quiet the compiler.

```scala
def handleInternal(e: PaymentEvent): Unit = e match
  case Authorized(_, _) => ()
  case Captured(_, _)   => ()
  case Refunded(_, _)   => ()
  // adding a new variant forces an update

def handleEdge(raw: String): String = raw match
  case "ping" => "pong"
  case other  => s"ignored:$other"  // open set from the wire
```

### 2. Pattern matching performance and style

Deep nested matches are hard to read—extract helpers. Matching on strings/tags from external systems is fragile; parse into an ADT once at the boundary, then match on the ADT internally.

```scala
enum WireCmd:
  case Ping
  case Echo(text: String)
  case Unknown(raw: String)

object WireCmd:
  def parse(raw: String): WireCmd = raw.split(" ", 2).toList match
    case "ping" :: Nil       => WireCmd.Ping
    case "echo" :: t :: Nil  => WireCmd.Echo(t)
    case other               => WireCmd.Unknown(other.mkString(" "))

def run(cmd: WireCmd): String = cmd match
  case WireCmd.Ping        => "pong"
  case WireCmd.Echo(t)     => t
  case WireCmd.Unknown(r)  => s"bad:$r"
```

### 3. `@unchecked` and non-exhaustive matches

Suppression exists for rare cases (generic sealed-ish designs, macros). Treat it as a review flag: document why exhaustiveness cannot hold.

### 4. Extractors and opaque factories

Custom `unapply` / `unapplySeq` let you match on validated shapes (`Email(user, domain)`). Keep extractors honest: they should not hide expensive side effects. Case classes already provide the usual extractors.

```scala
object Email:
  def unapply(raw: String): Option[(String, String)] =
    raw.split("@") match
      case Array(user, domain) if user.nonEmpty && domain.nonEmpty =>
        Some((user, domain))
      case _ => None

def localPart(s: String): Option[String] = s match
  case Email(user, _) => Some(user)
  case _              => None
```

### 5. `match` on Options, Try, Either

Idiomatic handling:

```scala
import scala.util.{Try, Success, Failure}

def showOpt(o: Option[Int]): String = o match
  case Some(x) => s"got $x"
  case None    => "missing"

def showEither(e: Either[String, Int]): String = e match
  case Right(n) => s"ok $n"
  case Left(err) => s"err $err"

def showTry(t: Try[Int]): String = t match
  case Success(n) => s"ok $n"
  case Failure(ex) => s"fail ${ex.getClass.getSimpleName}"
```

Often `map`/`fold` is clearer for single transforms; use `match` when branches diverge substantially. For `Either`, match `Left`/`Right` or use `fold`.

```scala
def portOrDefault(raw: String): Int =
  raw.toIntOption.filter(p => p > 0 && p < 65536).getOrElse(8080)

def portDetailed(raw: String): String =
  raw.toIntOption match
    case None                    => "not a number"
    case Some(p) if p <= 0       => "non-positive"
    case Some(p) if p >= 65536   => "too large"
    case Some(p)                 => s"port=$p"
```

### 6. Scala 2 / 3 pattern differences

Scala 3 refined pattern syntax (including relative patterns and enum cases). Older code uses `case Foo(a, b)` on case classes under sealed traits. Both must be readable in mixed repos; do not “fix style” mid-migration without a plan.

```scala
enum Color:
  case Red, Green, Blue

def isWarm(c: Color): Boolean = c match
  case Color.Red => true
  case Color.Green | Color.Blue => false
```

---

## 3. Applications and use cases

### Software engineering and domain modeling

- Encode protocols, job states, and permission outcomes as ADTs; match exhaustively in reducers and state machines.
- Parse wire formats into ADTs early; keep match logic free of raw JSON/map lookups.

```scala
enum Authz:
  case Allow
  case Deny(reason: String)

def authorize(role: String, action: String): Authz = (role, action) match
  case ("admin", _)        => Authz.Allow
  case ("reader", "read")  => Authz.Allow
  case ("reader", _)       => Authz.Deny("readers are read-only")
  case _                   => Authz.Deny("unknown role")
```

### APIs and libraries

- Public sealed hierarchies / enums are part of semver: adding a case is a breaking change for exhaustive clients unless you design for extension (and document it).
- Prefer returning ADTs over boolean pairs and out-parameters.

### Reliability

- Exhaustive matches on internal events prevent silent drops when new event types ship.
- At process edges, non-exhaustive matches with metrics on the default branch can be intentional—name the metric.

```scala
def route(e: PaymentEvent): Unit = e match
  case Authorized(_, _) => () // metrics.auth
  case Captured(_, _)   => () // metrics.capture
  case Refunded(_, _)   => () // metrics.refund
```

### Security

- Never trust client-supplied “type tags” without parsing into a known ADT; reject unknown variants explicitly.
- Authorization decisions as ADTs (`Allow | Deny(reason)`) beat boolean flags that lose reason codes.

```scala
def parseTag(tag: String): Either[String, Color] = tag.toLowerCase match
  case "red"   => Right(Color.Red)
  case "green" => Right(Color.Green)
  case "blue"  => Right(Color.Blue)
  case other   => Left(s"unknown color: $other")
```

### Staff-level review checklist

- Sealed/enum types used for closed domains; matches exhaustive without lazy `_` on internals.
- Guards do not obscure what should be separate variants.
- Partial functions used for `collect`-style filters, not as a general error-handling substitute.
- External data parsed to ADTs before deep matching.
- Public ADT changes considered for binary/source compatibility.
- No side-effect-heavy extractors in hot match paths.
- Boolean + optional-reason pairs replaced with honest ADTs where illegal states existed.

---

## References

- [Tour of Scala: Pattern Matching](https://docs.scala-lang.org/tour/pattern-matching.html)
- [Tour of Scala: Case Classes](https://docs.scala-lang.org/tour/case-classes.html)
- [Scala 3 Book: Domain Modeling — FP](https://docs.scala-lang.org/scala3/book/domain-modeling-fp.html)
- [Scala 3 Book: Control Structures](https://docs.scala-lang.org/scala3/book/control-structures.html)
- [Scala 3 Reference: Enumerations](https://docs.scala-lang.org/scala3/reference/enums/enums.html)
- [Scala 3 Book: Partial Functions](https://docs.scala-lang.org/scala3/book/fun-partial-functions.html)
- [Scala Documentation](https://docs.scala-lang.org/)
