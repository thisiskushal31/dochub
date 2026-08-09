# Functions, methods, and higher-order style

[← Back to Scala](./README.md)

## What this chapter covers

How Scala defines and passes behavior: **`def` methods**, function values, **lambdas**, **higher-order** functions, literacy-level **currying** and **by-name** parameters, and **extension methods** in Scala 3. This is the bridge from “expressions and types” to reusable APIs and collections-style code. Aim to leave this chapter able to read any `map`/`filter` pipeline and any multi-parameter-list DSL shape.

---

## 1. Concepts (basic)

### 1. Methods with `def`

A **method** is defined with `def` inside a class, trait, object, or as a local method:

```scala
def add(a: Int, b: Int): Int = a + b
```

Parts to recognize:

- **Name** and **parameter list(s)**
- Optional **return type** (recommended on public APIs)
- Body after `=` (single expression or a block)

```scala
def clamp(n: Int, lo: Int, hi: Int): Int =
  if n < lo then lo
  else if n > hi then hi
  else n
```

Methods are the usual way to expose behavior on types and services. They can take multiple parameter lists (see currying below).

### 2. Methods versus function values

| Idea | What it is |
|------|------------|
| **Method (`def`)** | A member of a class/object (or local def); invoked on a receiver or in scope |
| **Function value** | A value with a function type, e.g. `Int => String`, that you can store and pass |

You often convert or eta-expand methods to functions when an API expects a function value (`map` wants `A => B`). Mental model: **methods belong to types; functions are data that happens to be callable.**

```scala
def inc(x: Int): Int = x + 1
val incFn: Int => Int = inc   // eta-expansion to a function value
List(1, 2, 3).map(inc)
```

### 3. Lambdas (anonymous functions)

A lambda writes the function inline:

```scala
val double = (x: Int) => x * 2
List(1, 2, 3).map(x => x * 2)
```

Placeholder syntax appears in simple cases: `List(1, 2, 3).map(_ * 2)`. Use placeholders only when the meaning stays obvious—nested `_` quickly becomes unreadable.

```scala
// Good: one placeholder, obvious
xs.map(_ + 1)

// Bad: nested placeholders become a puzzle
// xs.map(x => ys.map(_ + x))  // prefer named params inside
xs.map(x => ys.map(y => y + x))
```

### 4. Higher-order functions

A **higher-order** function/method takes functions as parameters or returns them:

```scala
def operate(x: Int, y: Int, op: (Int, Int) => Int): Int = op(x, y)

operate(2, 3, _ + _)
operate(2, 3, (a, b) => a * b)
```

Collections APIs are the everyday classroom: `map`, `filter`, `foreach`, `flatMap`. Application APIs use the same idea for retries, middleware, and strategy injection—pass behavior instead of copying loops.

```scala
val nums = List(1, 2, 3, 4, 5)
val doubledEvens =
  nums
    .filter(_ % 2 == 0)
    .map(_ * 2)
```

### 5. Function types

Write function types with arrows: `A => B`, `(A, B) => C`. In Scala 3, more parentheses styles exist, but the arrow reading stays: “given inputs, produce output.”

```scala
val show: Int => String = n => s"n=$n"
val combine: (String, String) => String = (a, b) => a + b
```

When reading signatures, find the arrows first—they tell you what callers must supply.

### 6. Multiple parameter lists (currying literacy)

Scala methods may have more than one parameter list:

```scala
def withConfig(name: String)(body: Config => Unit): Unit =
  val cfg = load(name)
  body(cfg)
```

Why teams use this shape:

- **Type inference** improves across lists (common in generic APIs).
- **DSL style**: `withConfig("db") { cfg => ... }`
- Partial application: fix the first list, pass the rest later

```scala
def greet(greeting: String)(name: String): String =
  s"$greeting, $name"

val hi = greet("hi")      // String => String
hi("Ada")                 // "hi, Ada"
```

You do not need category-theory currying to use this. Recognize multi-list methods as a deliberate API design tool.

### 7. Default and named arguments

Parameters can have defaults; callers can use names for clarity:

```scala
def connect(host: String, port: Int = 5432): Unit =
  println(s"connect $host:$port")

connect(host = "db", port = 5433)
connect("db")   // port default 5432
```

Named arguments prevent transposition bugs when several parameters share a type (`String`, `String`).

```scala
def grant(userId: String, role: String): Unit = ???

// Good: names remove ambiguity
grant(userId = "u1", role = "admin")

// Risky: two Strings, easy to swap
grant("admin", "u1")
```

### 8. Local functions

Methods can nest helpers that stay private to a block—useful for clarifying algorithms without polluting the class API:

```scala
def normalizeEmails(raw: List[String]): List[String] =
  def clean(s: String): String = s.trim.toLowerCase
  raw.map(clean).filter(_.nonEmpty)
```

---

## 2. Advanced concepts

### 1. By-name parameters (brief)

A by-name parameter is written `=> T` instead of `T`. The argument expression is evaluated **each time** the parameter is used in the body—not eagerly once at the call site.

```scala
def logIfDebug(msg: => String): Unit =
  if debug then println(msg)

logIfDebug(s"expensive ${compute()}")  // compute() skipped when !debug
```

Use cases: lazy logging, custom control-flow helpers, asserting without building expensive strings when disabled. Pitfall: accidental repeated evaluation of expensive or side-effecting expressions.

```scala
def twice(x: => Int): Int = x + x
twice({ println("hi"); 1 })   // prints twice — by-name re-runs
```

Contrast with `() => T` when you want an explicit thunk the caller controls.

### 2. Extension methods (Scala 3 literacy)

Scala 3 **extension methods** add callable methods to existing types without editing their source:

```scala
extension (s: String)
  def words: List[String] = s.split("\\s+").toList

"hello there".words
```

Literacy for reviews:

- Great for **fluent** APIs and avoiding utility-object clutter (`StringUtils.words(s)`).
- Discoverability depends on imports—document extension packages.
- Scala 2 brownfield may use **implicit class** enrichment instead; read both when migrating.

```scala
// Scala 2-shaped enrichment (brownfield literacy)
// implicit class StringOps(val s: String) extends AnyVal {
//   def words: List[String] = s.split("\\s+").toList
// }
```

Do not use extensions to hide side effects or to paper over poor domain types.

### 3. Closures and captured state

Lambdas capture variables from enclosing scopes. Capturing a mutable `var` or an object that changes later creates subtle bugs—especially in concurrent or delayed execution (`Future`, callbacks). Prefer capturing immutable vals and explicit parameters.

```scala
import scala.collection.mutable.ListBuffer

// Dangerous shape: all lambdas may see the final i
var i = 0
val tasks = ListBuffer.empty[() => Int]
while i < 3 do
  tasks += (() => i)   // captures var
  i += 1
// tasks.map(_()) may all return 3

// Safer: capture a val copy
var j = 0
val tasks2 = ListBuffer.empty[() => Int]
while j < 3 do
  val captured = j
  tasks2 += (() => captured)
  j += 1
```

### 4. Overloading versus defaults

Overloading methods by parameter type interacts poorly with inference and Java interop. Prefer defaults, precise types, or distinctly named methods when APIs grow.

```scala
// Prefer clear names over tricky overloads
def parseInt(raw: String): Option[Int] = raw.toIntOption
def parseIntOr(raw: String, default: Int): Int =
  parseInt(raw).getOrElse(default)
```

### 5. Returning functions

Factories that return `A => B` enable strategy tables and dependency injection without a heavy framework. Keep returned functions pure when possible so they remain testable.

```scala
def multiplier(factor: Int): Int => Int =
  (n: Int) => n * factor

val times10 = multiplier(10)
times10(3)  // 30
```

### 6. Scala 2 implicits versus Scala 3 givens (pointer)

Higher-order and “context” APIs historically used **implicits** in Scala 2. Scala 3 prefers **`given` / `using`**. This chapter does not teach the full contextual system; know that mysterious extra parameters in library signatures are often contextual—not magic.

```scala
trait Show[A]:
  def asString(a: A): String

given Show[Int] with
  def asString(a: Int): String = a.toString

def show[A](a: A)(using s: Show[A]): String = s.asString(a)

show(42)
```

### 7. Inference pitfalls

```scala
// Placeholder ambiguity
// List(1, 2).map(_.toString.length + _)  // confusing / error-prone

List(1, 2).map(n => n.toString.length)

// Public API without return type — inference can change with body edits
def titles = List("a", "b").map(_.toUpperCase)           // fragile publish
def titlesStable: List[String] = List("a", "b").map(_.toUpperCase)
```

### 8. Common compiler errors and what they mean

| Message (paraphrased) | Meaning | Fix habit |
|-----------------------|---------|-----------|
| missing argument for parameter | Curried/multi-list call incomplete | Supply remaining lists or assign partial |
| type mismatch `A => B` | Passed a method/value with wrong shape | Adjust arity or eta-expand carefully |
| ambiguous overload | Inference cannot pick a method | Add types or rename methods |
| by-name / Function0 confusion | Mixed `=> T` with `() => T` | Pick one style and convert explicitly |

### 9. REPL tips

```scala
scala> val f: Int => Int = _ + 1
scala> f(3)
scala> def curried(a: Int)(b: Int) = a + b
scala> val add2 = curried(2)
scala> add2(5)
scala> :type List(1, 2, 3).map
```

`:type` on a partially applied method helps decode library DSLs.

---

## 3. Applications and use cases

### Software engineering

- Prefer small pure functions for domain transforms; keep I/O at the edges.
- Collection pipelines (`filter` → `map` → `toList`) replace many hand-rolled loops.
- Public methods: explicit return types; named arguments at call sites when arity is high.

```scala
case class Item(sku: String, qty: Int)

def totalQty(items: List[Item]): Int =
  items.map(_.qty).sum
```

### Config reading mini-pattern

```scala
def envOr(key: String, default: String): String =
  sys.env.getOrElse(key, default)

def envInt(key: String, default: Int): Int =
  sys.env.get(key).flatMap(_.toIntOption).getOrElse(default)

val port = envInt("PORT", 8080)
```

Higher-order flavor—pass a parser:

```scala
def envRead[A](key: String, parse: String => Option[A], default: A): A =
  sys.env.get(key).flatMap(parse).getOrElse(default)

val flag = envRead("FEATURE_X", s => Some(s.toBoolean), false)
```

### CLI argv sketch

```scala
@main def run(path: String, verbose: Boolean = false): Unit =
  def log(msg: => String): Unit =
    if verbose then println(msg)

  log(s"reading $path")
  // …
  log("done")
```

By-name `msg` avoids building strings when not verbose.

### Systems and middleware

- Retry wrappers, timeouts, and metrics timers are natural higher-order helpers: take `=> T` or `() => T`, run policies, return results.
- Ensure by-name/lambda bodies do not capture request-scoped mutable state across threads.

```scala
def timed[T](label: String)(body: => T): T =
  val t0 = System.nanoTime()
  try body
  finally
    val ms = (System.nanoTime() - t0) / 1e6
    println(s"metric=$label ms=$ms")
```

### Security

- Callbacks that receive user input must still validate inside the function—passing a lambda does not sanitize data.
- Avoid dynamic “eval-like” higher-order designs that execute untrusted strings as code.

```scala
def withUserInput(raw: String)(body: String => Unit): Unit =
  val cleaned = raw.trim
  require(cleaned.nonEmpty, "empty input")
  body(cleaned)
```

Logging without leaking secrets:

```scala
def logRequest(userId: String, authHeader: String): Unit =
  println(s"userId=$userId auth=***")
```

### Data and Spark adjacency

- Spark transformations are conceptually higher-order (apply functions to partitions/records). Keep serialized functions clean: understand what your lambdas close over when shipping work to executors (detail belongs with Spark ops guidance).
- Prefer total functions over partial ones that throw on bad rows; surface bad records explicitly.

```scala
def parseRow(raw: String): Either[String, Int] =
  raw.toIntOption.toRight(s"bad row: $raw")

def partitionOk(rows: List[String]): (List[Int], List[String]) =
  val parsed = rows.map(parseRow)
  (parsed.collect { case Right(n) => n },
   parsed.collect { case Left(e) => e })
```

### Staff-level review checklist

- Public `def`s have clear **return types** and sensible defaults/names.
- Lambdas stay short; complex bodies become named methods.
- By-name parameters are used for **deferred** evaluation, not as a cute synonym for `() => T` without reason.
- Extension methods (or Scala 2 implicit enrichments) are imported deliberately and documented.
- No unsafe capture of mutable state into concurrent or delayed callbacks.
- Named arguments used when multiple parameters share a type.
- Higher-order helpers used for retries/metrics do not swallow errors silently.

---

## References

- [Scala 3 Book — Functions](https://docs.scala-lang.org/scala3/book/taste-functions.html)
- [Tour of Scala — Higher-Order Functions](https://docs.scala-lang.org/tour/higher-order-functions.html)
- [Scala 3 Book — Extension Methods](https://docs.scala-lang.org/scala3/book/ca-extension-methods.html)
- [By-Name Parameters](https://docs.scala-lang.org/tour/by-name-parameters.html)
- [Scala 3 Reference — Extension Methods](https://docs.scala-lang.org/scala3/reference/contextual/extension-methods.html)
- [Scala 3 Book — Contextual Abstractions](https://docs.scala-lang.org/scala3/book/ca-contextual-abstraction-intro.html)
- [Tour of Scala — Named Arguments](https://docs.scala-lang.org/tour/named-arguments.html)
- [Scala Documentation Hub](https://docs.scala-lang.org/)
