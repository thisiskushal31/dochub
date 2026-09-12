# Control flow and expressions

[← Back to Scala](./README.md)

## What this chapter covers

How Scala chooses what runs next while staying **expression-oriented**: `if`/`else` as values, an introduction to **for comprehensions**, `while` loops, and a basic look at **`match`**. Enough to read and write clear control flow before deeper pattern matching and collections chapters. The habit to build here: **compute a value**, don’t only “run steps.”

---

## 1. Concepts (basic)

### 1. `if` / `else` are expressions

In Scala, `if` returns a value. Both branches should produce compatible types; the whole `if` can be assigned or returned.

```scala
val label = if n > 0 then "positive" else "non-positive"
```

Scala 3 often uses `then`; Scala 2 style uses braces or a newline after the condition. Either way, prefer expression `if` over assigning inside both branches when the goal is to compute one result.

Before / after (statement style vs expression style):

```scala
// Bad: if-as-statement with mutable result
var label = "non-positive"
if n > 0 then label = "positive"

// Good: if-as-expression
val label2 = if n > 0 then "positive" else "non-positive"
```

When branches perform only side effects, the result type is often `Unit`. That is a signal: maybe the method should return something useful, or the side effects should be isolated.

```scala
val u: Unit =
  if debug then println("trace") else ()
```

### 2. Truthiness is Boolean—not “any value”

Conditions must be **`Boolean`**. Unlike some dynamic languages, `0`, `null`, and empty strings are **not** automatically false. Write explicit comparisons and checks (`n != 0`, `s.nonEmpty`, `opt.isDefined`).

```scala
val s = ""
// if s then …          // does not compile
if s.nonEmpty then println("has text")

val opt: Option[Int] = None
if opt.isDefined then println(opt.get)   // works, but match/fold is clearer
```

### 3. `while` and imperative loops

`while` and `do while` repeat for side effects or local mutation:

```scala
var i = 0
while i < n do
  // work
  i += 1
```

These are useful for tight loops and interop with mutable algorithms. Idiomatic Scala often prefers **collection methods** (`map`, `filter`, `fold`) or **for comprehensions** for transforming data—clearer and less error-prone than manual index juggling.

Good vs bad data shaping:

```scala
val xs = List(1, 2, 3, 4)

// Prefer for transforms
val evens = xs.filter(_ % 2 == 0)

// while is fine when you truly need imperative local state
var sum = 0
var i = 0
while i < xs.length do
  sum += xs(i)
  i += 1
```

### 4. `for` comprehensions (introduction)

A `for` comprehension sequences generators and optional guards, then yields a result (or runs side effects with `do` in Scala 3 / no `yield` in older “foreach” style).

```scala
val squares =
  for x <- 1 to 5 if x % 2 == 1
  yield x * x
```

Mental model for this chapter:

- `<-` means “pull values from a collection / Option / Future-like type.”
- `if` after a generator is a **filter/guard**.
- `yield` builds a new collection (or context) of results.

Under the hood, simple cases desugar to `map` / `flatMap` / `withFilter`. You do not need the full desugaring yet—read `for` as structured sequencing of dependent steps. Later chapters deepen `Option`/`Either`/`Future` uses.

Sequencing `Option` steps (why `for` shines):

```scala
def lookupUser(id: String): Option[String] = Some(id)
def lookupEmail(user: String): Option[String] = Some(s"$user@example.com")

val email =
  for
    user <- lookupUser("ada")
    mail <- lookupEmail(user)
  yield mail
```

### 5. `match` at a basic level

`match` chooses a branch by comparing a value against **patterns**:

```scala
val kind = x match
  case 0           => "zero"
  case n if n > 0  => "positive"
  case _           => "other"
```

Basic patterns you will see immediately:

| Pattern | Meaning |
|---------|---------|
| Literal | Exact value |
| Variable `n` | Bind the value to `n` |
| Guard `if …` | Extra Boolean condition |
| `_` | Wildcard—match anything, ignore value |

`match` is an **expression**: each case produces a value; together they determine the result type. Exhaustiveness checking becomes powerful with sealed types (later); for now, include a clear default or cover the cases you mean.

```scala
def httpLabel(code: Int): String = code match
  case 200 => "ok"
  case 404 => "missing"
  case 500 => "error"
  case other => s"code-$other"
```

### 6. Early returns and readability

Scala methods can use `return`, but idiomatic style prefers expression-oriented structure: compute the result in `if`/`match`/`for` and let it be the last expression. Reserve early `return` for rare guard clauses when it truly clarifies.

```scala
// Prefer expression structure
def discount(score: Int): Double =
  if score < 0 then 0.0
  else if score > 100 then 1.0
  else score / 100.0
```

### 7. Blocks inside control flow

Branches can be blocks; the last expression is still the branch value:

```scala
val msg =
  if n > 0 then
    val doubled = n * 2
    s"pos:$doubled"
  else
    "non-pos"
```

---

## 2. Advanced concepts

### 1. Branch type widening

If one branch returns `Int` and another returns `String`, the `if` type may widen to a common parent (often something too loose). Keep branches aligned, or use an ADT/`Either` so the result stays meaningful.

```scala
// Widens in an unhelpful way — avoid
// val x = if cond then 1 else "no"

// Better: one result type on purpose
val x: Either[String, Int] =
  if cond then Right(1) else Left("no")
```

### 2. `for` without `yield`

A `for` used only for side effects (printing, writing) desugars toward `foreach`. That is fine for scripts; in services, prefer explicit loops or dedicated effect types so failure handling stays visible.

```scala
for name <- List("a", "b") do
  println(name)
```

### 3. Nested `match` versus guards

Deep nesting hurts review. Prefer:

- Flat matches with guards
- Extracting helper methods
- Sealed hierarchies with one match per layer

```scala
// Prefer flat + guard
def classify(n: Int): String = n match
  case n if n < 0  => "neg"
  case 0           => "zero"
  case _           => "pos"
```

### 4. Match is not Java `switch`

Scala `match` is richer (extractors, types, nested patterns). Using it only as an integer switch works but underuses the language. Conversely, stuffing business workflows into one giant match creates an untestable blob—split by concern.

### 5. Loops, performance, and clarity

Hand-written `while` can be faster in microbenchmarks than abstract collections. Measure before rewriting clear `map`/`fold` into mutable loops. In Spark and distributed code, **driver-side** `while` over large data is usually the wrong shape entirely—use the platform’s transformations.

### 6. Scala 2 / Scala 3 syntax shapes

Control syntax differs slightly (`then`, optional braces, `do` in while). Brownfield PRs should follow the file’s existing dialect unless the change is an intentional style migration.

```scala
// Scala 3
while i < n do i += 1
if ready then go() else wait()

// Scala 2 style
while (i < n) { i += 1 }
if (ready) go() else wait()
```

### 7. Inference pitfalls in branches and matches

```scala
val xs = List(1, 2, 3)

// Wildcard that swallows too much — review carefully
val y = xs.headOption match
  case Some(n) => n
  case _       => -1

// Exhaustive Option match is clearer
val z = xs.headOption match
  case Some(n) => n
  case None    => -1
```

When `match` returns different ADT cases, ascribe the result type on public methods so inference does not quietly widen to `Product`/`Serializable`-shaped junk in odd edge cases.

### 8. Common compiler errors and what they mean

| Message (paraphrased) | Meaning | Fix habit |
|-----------------------|---------|-----------|
| type mismatch in if branches | Branches disagree on type | Align types or wrap in ADT/`Either` |
| found `Int`, required `Boolean` | Used a non-Boolean condition | Write an explicit comparison |
| match may not be exhaustive | Missing cases for a sealed type | Cover cases or justify `|`/`_` |
| `return` outside method | Misplaced early return | Restructure as expressions |

### 9. REPL tips

```scala
scala> val n = 3
scala> if n > 0 then "p" else "n"
scala> for x <- 1 to 3 yield x * x
scala> 2 match { case 1 => "a"; case 2 => "b"; case _ => "c" }
```

Use the REPL to verify branch types with `:type` when an `if` looks suspicious.

---

## 3. Applications and use cases

### Software engineering

- Validation pipelines: nest `for` over `Option`/`Either` to sequence checks without pyramid-of-doom `if` nesting (deepened in collections/error chapters).
- HTTP handlers: `match` on status or sealed error types to build responses—keep the happy path an expression.
- Replace boolean flag spaghetti with `match` on a small enum/ADT when states grow past two or three.

```scala
enum AuthResult:
  case Ok(userId: String)
  case Denied(reason: String)

def statusCode(r: AuthResult): Int = r match
  case AuthResult.Ok(_)      => 200
  case AuthResult.Denied(_)  => 403
```

### Config reading mini-pattern

```scala
def readPort(raw: Option[String]): Either[String, Int] =
  raw match
    case None => Right(8080)
    case Some(s) =>
      s.toIntOption match
        case Some(p) if p > 0 && p < 65536 => Right(p)
        case _ => Left(s"invalid port: $s")
```

### CLI argv sketch

```scala
@main def run(path: String, mode: String = "check"): Unit =
  val action =
    mode match
      case "check" | "c" => "validate"
      case "apply" | "a" => "mutate"
      case other         =>
        System.err.println(s"unknown mode=$other")
        sys.exit(2)
  println(s"action=$action path=$path")
```

### Reliability and operations

- Retry loops: a bounded `while` with sleep/backoff is acceptable; always cap attempts and log the exit reason.
- Health checks: expression `if` that returns a sealed status beats mutating a shared `var` from many branches.

```scala
def retry[T](times: Int)(body: => T): Option[T] =
  var left = times
  var result: Option[T] = None
  while left > 0 && result.isEmpty do
    try result = Some(body)
    catch case _: Exception => left -= 1
  result
```

Prefer library retry helpers in real services; the sketch shows why bounds belong next to `while`.

### Security

- Authorization decisions should be explicit `match`/`if` on roles or policies—not fall-through defaults that accidentally allow.
- Reject malformed input in a single early validation expression; do not partially process then discover failure mid-loop.

```scala
def authorize(role: String, action: String): Boolean = (role, action) match
  case ("admin", _)          => true
  case ("reader", "read")    => true
  case _                     => false   // deny by default
```

Logging without leaking secrets:

```scala
def logAuth(userId: String, token: String, ok: Boolean): Unit =
  println(s"auth userId=$userId ok=$ok token=***")
```

### Data and integration

- Prefer `for`/`map`/`filter` over mutable accumulation when transforming records in-process.
- In Spark, distinguish **Scala driver control flow** from **distributed transformations**—`for` on a local `Seq` does not parallelize your cluster.

```scala
case class Row(id: String, active: Boolean)

def activeIds(rows: List[Row]): List[String] =
  for r <- rows if r.active yield r.id
```

### Staff-level review checklist

- New conditionals use **`Boolean`** tests—no truthiness assumptions from other languages.
- `if`/`match` results are used as **expressions** where they compute values.
- `for` comprehensions stay readable (not ten nested generators without names).
- `while` + `var` is justified; collection transforms preferred for data shaping.
- Match cases cover intended inputs; wildcards are deliberate, not silent swallow-alls.
- Authorization and validation default to **deny / fail** when unmatched.
- Retry/`while` loops are bounded and log why they stopped.

---

## References

- [Scala 3 Book — Control Structures](https://docs.scala-lang.org/scala3/book/control-structures.html)
- [Tour of Scala — For Comprehensions](https://docs.scala-lang.org/tour/for-comprehensions.html)
- [Tour of Scala — Pattern Matching](https://docs.scala-lang.org/tour/pattern-matching.html)
- [Scala 3 Reference — Control Syntax](https://docs.scala-lang.org/scala3/reference/other-new-features/control-syntax.html)
- [Scala 3 Book — Domain Modeling](https://docs.scala-lang.org/scala3/book/domain-modeling-intro.html)
- [Scala Documentation Hub](https://docs.scala-lang.org/)
