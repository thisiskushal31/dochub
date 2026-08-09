# Syntax, expressions, vals, and vars

[← Back to Scala](./README.md)

## What this chapter covers

How Scala source **reads and evaluates**: everything-as-expression habits, **`val` versus `var`**, blocks, string interpolation, semicolon inference, and **optional braces** literacy in Scala 3. This is the vocabulary layer you need before types and control flow feel natural. Read for habits you will use in every later chapter.

---

## 1. Concepts (basic)

### 1. Expressions produce values

In Scala, most constructs are **expressions**: they evaluate to a value. That includes method calls, arithmetic, blocks, and (as later chapters show) `if` and `match`.

Implication for reading code: ask “what value does this produce?” before asking “what side effects does it have?” Side effects (printing, writing, mutating) are allowed, but idiomatic Scala keeps them intentional and localized.

A simple binding:

```scala
val answer = 40 + 2
```

`40 + 2` is an expression; `answer` names its result.

Side-effecting expressions still have a type (often `Unit`):

```scala
val ignored: Unit = println("hello")  // prints, binds ()
```

Prefer not to bind `Unit` unless you are composing effect helpers on purpose.

### 2. `val` versus `var`

| Binding | Meaning |
|---------|---------|
| **`val`** | Immutable binding—you cannot reassign the name |
| **`var`** | Mutable binding—you may reassign the name |

Prefer **`val`** by default. Immutability at the binding level reduces accidental state bugs and makes reasoning about concurrent code easier. Use **`var`** when mutation is the clearest model (local loops, performance-sensitive buffers)—and keep the scope small.

```scala
val maxRetries = 3          // good default
var attempt = 0             // local mutation, short scope
while attempt < maxRetries do
  attempt += 1
```

Important nuance: `val` prevents **reassignment**, not deep immutability of the object. A `val` referencing a mutable Java list can still change contents. Prefer immutable collections in new Scala unless interop forces otherwise.

```scala
val nums = scala.collection.mutable.ArrayBuffer(1, 2)
nums += 3   // legal: binding unchanged, buffer mutated
```

Good vs bad sprawl:

```scala
// Bad: many vars shared across a long method
var total = 0
var tax = 0
var shipping = 0
// … 80 lines later, which vars are still meaningful?

// Good: compute with vals in a small block
val orderTotal =
  val items = 100
  val tax = 8
  val shipping = 5
  items + tax + shipping
```

### 3. Type ascription (optional annotation)

Scala can infer many types:

```scala
val name = "Ada"
val name2: String = "Ada"
```

Annotate when inference is unclear, when you want a **wider** API type than the right-hand side, or when public methods need an explicit contract. Do not annotate every local `val` for ceremony.

```scala
val ids: List[String] = List.empty   // widen/clarify empty collection
def port: Int = 8080                 // public contract stays visible
```

### 4. Blocks

A block is a sequence of statements/expressions in braces (or an indented region in Scala 3 optional-brace style). The **value of the block** is the value of its **last expression**.

```scala
val total = {
  val a = 1
  val b = 2
  a + b
}
```

Bindings inside the block are scoped to the block. This pattern replaces many temporary variables that would otherwise leak into a larger method.

Scala 3 indentation style for the same idea:

```scala
val total =
  val a = 1
  val b = 2
  a + b
```

### 5. String literals and interpolation

Ordinary strings use double quotes. Scala’s common interpolation forms:

| Form | Role |
|------|------|
| **`s"..."`** | Embed expressions with `$name` or `${expr}` |
| **`f"..."`** | Formatted interpolation (printf-style) |
| **`raw"..."`** | Interpolation without escape processing |

```scala
val n = 3
val msg = s"count=$n"
val path = raw"C:\temp\file"
val pct = f"${0.873}%.1f%%"   // "87.3%"
```

Prefer interpolation over string concatenation for readability:

```scala
// Prefer
val a = s"$user:$role"

// Avoid when interpolation is clearer
val b = user + ":" + role
```

For user-facing or security-sensitive formatting, still validate and encode at boundaries—interpolation is not a substitute for safe output encoding.

### 6. Semicolon inference

Scala does not require a semicolon at the end of every line. The compiler inserts separators using newline and token rules. You mainly notice this when:

- You break an expression across lines in a place the parser thinks the statement ended.
- You put multiple statements on one line (then you need `;`).

```scala
val sum = 1 +
  2 +
  3                 // OK: line ends with operator

// val broken = 1
//   + 2            // often parsed as two statements — surprise errors
```

Practical habit: keep one expression per line; when wrapping, end the previous line with an operator or open delimiter so the parser continues the expression.

### 7. Comments

- Line comments: `// ...`
- Block comments: `/* ... */`
- Scaladoc comments: `/** ... */` on public APIs (quality chapter later)

Comments explain **why**, not restating the code.

```scala
// Retry once because the upstream flushes caches every ~30s
val result = tryOnce().orElse(tryOnce())
```

### 8. Literals you will see constantly

```scala
val i = 42
val long = 42L
val d = 3.14
val b = true
val c = 'Z'
val s = "text"
val multi =
  """line one
    |line two""".stripMargin
```

Multiline strings are common for SQL/JSON fixtures in tests—still parameterize untrusted input in production paths.

---

## 2. Advanced concepts

### 1. Optional braces (Scala 3 literacy)

Scala 3 allows **indentation-based** layout as an alternative to mandatory braces in many positions (methods, classes, blocks). Teams pick a house style—braces, indentation, or a documented mix—and enforce it with **scalafmt**.

```scala
def area(w: Int, h: Int): Int =
  val base = w * h
  base
```

Literacy points for reviewers:

- Indentation is significant where optional braces are used; inconsistent indent is a compile error or a logic change.
- Diffs and generated code must respect the chosen style.
- Scala 2 codebases and some macros/tools may still expect classic braces—do not force optional braces into every brownfield file without a style migration.

This handbook shows both shapes when helpful; neither is “more Scala” than the other if the team standard is clear.

### 2. `lazy val`

`lazy val` delays initialization until first access, then caches the result. Useful for expensive setup and for breaking initialization cycles. Costs: first-access latency, and care around exceptions during initialization. Do not sprinkle `lazy` to hide design problems.

```scala
lazy val schema: Schema =
  loadSchemaFromDisk()   // runs once, on first use
```

### 3. Multiple definitions and shadowing

Inner scopes can **shadow** outer names. Shadowing is legal and sometimes useful in blocks; accidental shadowing of parameters or fields is a review smell—prefer distinct names.

```scala
val x = 1
val y =
  val x = 2    // shadows outer x inside this block
  x + 10       // 12
// outer x is still 1
```

### 4. Fields versus local bindings

At class/object level, `val`/`var` become **fields** with visibility rules. Locals live on the stack (conceptually) for a method activation. Confusing the two leads to unintended shared mutable state when a `var` is lifted to a field.

```scala
class Counter:
  private var count = 0        // shared across calls on this instance
  def inc(): Int =
    count += 1
    count

def sumTo(n: Int): Int =
  var i = 0                    // local — fine for a tight loop
  var total = 0
  while i <= n do
    total += i
    i += 1
  total
```

### 5. Interop with Java mutability

Calling Java APIs often returns mutable objects. Binding them to `val` is still correct Scala, but the **mutation protocol** is Java’s. Wrap or copy into immutable Scala structures at the boundary when you want purity inward.

```scala
import scala.jdk.CollectionConverters.*

def freeze(javaList: java.util.List[String]): List[String] =
  javaList.asScala.toList
```

### 6. Expression discipline under review

Staff smell tests:

- Long methods that mutate many `var`s instead of small pure helpers
- String building via repeated `+` in hot loops without a builder strategy
- Optional-brace files mixed with inconsistent indentation in the same PR

### 7. Inference pitfalls

```scala
val a = List()                 // often List[Nothing] — surprising later
val b: List[String] = List()   // say what you mean

var x = 1
// x = 1.5                     // error: x was inferred Int
```

If a `var` must hold a wider type, annotate at the binding site.

### 8. Scala 2 vs Scala 3 syntax shapes

| Topic | Scala 3 common | Scala 2 brownfield |
|-------|----------------|--------------------|
| Method bodies | Optional braces / indent | Braces dominant |
| Control | `if … then`, `while … do` | `if (…)`, `while (…)` |
| Vars/vals | Same keywords | Same keywords |

```scala
// Scala 3
if ready then start() else wait()

// Scala 2 style still compiles in many settings
if (ready) start() else wait()
```

### 9. Common compiler errors and what they mean

| Message (paraphrased) | Meaning | Fix habit |
|-----------------------|---------|-----------|
| reassignment to val | You used `val` but tried `=` again | Use `var` only if mutation is required |
| type mismatch | Right-hand side does not fit ascribed type | Fix types or widen deliberately |
| illegal start of … / indentation | Optional-brace layout broke | Fix indent or add braces |
| forward reference extends over definition | Used a name before it was defined in a template | Reorder members or use `lazy val` carefully |

### 10. REPL tips

```bash
sbt console
```

```scala
scala> val xs = List(1, 2, 3)
scala> xs.map(_ + 1)
scala> :type xs.map(_ + 1)     // ask the REPL for a type
```

Use the REPL to check “is this an expression with the type I think?” before burying it in a service method.

---

## 3. Applications and use cases

### Software engineering

- Default to `val` and immutable data in application code; justify each `var`.
- Use blocks to keep intermediate names local in parsers, validators, and request handlers.
- Adopt one formatting style (including braces policy) in CI so syntax debates do not consume review bandwidth.

Request-handler block sketch:

```scala
def handle(raw: String): String =
  val trimmed = raw.trim
  val token =
    if trimmed.startsWith("Bearer ") then trimmed.drop(7)
    else trimmed
  s"token-length=${token.length}"
```

### Config reading mini-pattern

```scala
final case class HttpConfig(host: String, port: Int)

def loadHttpConfig(): HttpConfig =
  val host = sys.env.getOrElse("HOST", "0.0.0.0")
  val port = sys.env.get("PORT").map(_.toInt).getOrElse(8080)
  HttpConfig(host, port)
```

All bindings are `val`s; the function returns an immutable snapshot.

### CLI argv sketch

```scala
@main def run(path: String, dryRun: Boolean = false): Unit =
  val abs = java.nio.file.Path.of(path).toAbsolutePath
  if dryRun then println(s"would process $abs")
  else println(s"processing $abs")
```

### Systems and operations scripts

- Small Scala CLI scripts still benefit from `val`-first style—ops scripts grow into services.
- Interpolated log lines should carry stable field names (`s"userId=$id"`) for log aggregation; avoid huge interpolated dumps of secrets.

```scala
def logLogin(userId: String): Unit =
  println(s"event=login userId=$userId")  // stable keys for aggregators
```

### Security

- Never build SQL, shell, or LDAP strings via naïve interpolation with untrusted input—use parameterized APIs.
- Treat template-like interpolation in HTML/XML the same way: encode or use safe templating.

```scala
// Bad: interpolation into a shell
// s"rm $userPath"

// Bad: interpolation into SQL
// s"SELECT * FROM users WHERE id = '$id'"

// Good direction: parameterized APIs / safe libraries (shape)
def findUser(id: String): Unit =
  // jdbcStatement.setString(1, id)
  ()
```

Logging without leaking secrets:

```scala
case class Credentials(user: String, password: String):
  override def toString: String = s"Credentials(user=$user, password=***)"

val creds = Credentials("ada", "s3cr3t")
println(s"connecting as $creds")
```

### Data and Spark adjacency

- Job code that mutates shared `var`s across partitions is a concurrency hazard; prefer local vals and Spark’s own transformations.
- Keep configuration bindings as `val`s loaded once at startup.

### Staff-level review checklist

- New code prefers **`val`**; each **`var`** has a short justification.
- Public methods have clear return types where inference would hide the API.
- Team **brace/indent** style is consistent and CI-enforced.
- No secret or untrusted data concatenated into sensitive sinks via string interpolation.
- Scala 2 files are not casually rewritten to optional braces without a migration decision.
- Empty collections and mutable `var`s carry explicit types when inference would go wrong.
- Blocks are used to scope temporaries instead of lengthening method-wide state.

---

## References

- [Scala 3 Book — First Steps](https://docs.scala-lang.org/scala3/book/taste-hello-world.html)
- [Scala 3 Book — Variables and Data Types](https://docs.scala-lang.org/scala3/book/taste-vars-data-types.html)
- [Optional Braces](https://docs.scala-lang.org/scala3/reference/other-new-features/indentation.html)
- [Tour of Scala — Basics](https://docs.scala-lang.org/tour/basics.html)
- [String Interpolation](https://docs.scala-lang.org/overviews/core/string-interpolation.html)
- [Scala 3 Reference — Control Syntax](https://docs.scala-lang.org/scala3/reference/other-new-features/control-syntax.html)
- [Scala Documentation Hub](https://docs.scala-lang.org/)
