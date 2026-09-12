# Packages, imports, and visibility

[← Back to Scala](./README.md)

## What this chapter covers

How Scala organizes code into **packages**, brings names into scope with **imports**, re-exports with Scala 3 **`export`**, and restricts access with **`private`** / **`protected`**. Nested packages and companion visibility round out the module story you need before sbt layouts and Java interop. After this chapter you should place types in intentional packages, keep imports readable, and encode trust boundaries with `private[pkg]` rather than hope.

---

## 1. Concepts

### 1. Packages group related types

A **package** is a namespace for classes, objects, traits, and other packages. Declare it at the top of a file (`package com.example.app`) or with a package block. Directory layout conventionally mirrors the package (sbt/Maven expectation), though the language ties visibility to package names more than folders.

```scala
package com.example.billing

case class Invoice(id: String, cents: Long)

object Invoice:
  def zero(id: String): Invoice = Invoice(id, 0L)
```

Stable package names are part of your public API for libraries: renaming a package is a breaking change for callers.

Multi-line package style still appears:

```scala
package com.example
package billing
package api

case class CreateInvoice(cents: Long)
```

That places `CreateInvoice` in `com.example.billing.api` and keeps intermediate packages in scope for unqualified names from parent packages (language rules apply—do not rely on surprise visibility).

### 2. Imports bring names into scope

```scala
import com.example.billing.Invoice
import com.example.billing.{Invoice, LineItem}
import com.example.billing.*
import com.example.billing.{Invoice as Inv}
```

Scala 3 uses `*` for wildcards (Scala 2 used `_`). `as` renames (Scala 2 used `=>`). Import givens explicitly in Scala 3 when using contextual abstractions (`import Foo.given`).

```scala
// Scala 3 given import — explicit beats wildcard surprises
import com.example.billing.givens.given
```

Prefer selective imports in application code so readers see dependencies. Wildcard imports are fine in narrow scopes (tests, worksheets) when the package is obvious.

```scala
def total(lines: List[LineItem]): Long =
  import LineItem.*   // local import if helpers live on the companion
  lines.map(_.cents).sum
```

### 3. Nested packages

Packages nest: `com.example.app.api` sits under `com.example.app`. Nested package clauses and multi-line package declarations appear in older and newer code. Child packages are **not** automatically granted private access to parent package-private members the way some developers assume—know the exact visibility you declare (below).

```scala
package com.example.app

private[app] object Hooks:
  def warmCache(): Unit = ()

package nested:
  // cannot call Hooks.warmCache() unless visibility allows this package
  def boot(): Unit = ()
```

### 4. Visibility: private and protected

| Modifier | Rough meaning |
|----------|----------------|
| *(none)* | Public |
| `private` | This class/object only (and its companion) |
| `private[pkg]` | Visible within package `pkg` |
| `protected` | This type and its subclasses |
| `protected[pkg]` | Subclasses plus package refinement |

```scala
package com.example.app

private[app] def internalHook(): Unit = ()

final class Token private (val raw: String)

object Token:
  private def normalize(s: String): String = s.trim.toLowerCase
  def parse(s: String): Option[Token] =
    val n = normalize(s)
    if n.nonEmpty then Some(new Token(n)) else None
```

Package-private (`private[app]`) is the usual tool for “visible to my module, not to the world” without inventing a separate Maven module. Companions can access each other’s private members.

```scala
package com.example.app

class Ledger:
  private var balance: Long = 0L
  def credit(n: Long): Unit = Ledger.bump(this, n)

object Ledger:
  private def bump(l: Ledger, n: Long): Unit =
    l.balance += n   // companion may touch private state
```

### 5. Top-level definitions (Scala 3)

Scala 3 allows **top-level** defs, vals, and types in a package—not only inside objects. That reduces empty “package objects” for utilities. Scala 2 often used **package objects** to hold shared aliases and vals; you will still see them in brownfield code.

```scala
package com.example.app.types

type UserId = String
val MaxPageSize: Int = 100

def clampPage(n: Int): Int =
  if n < 1 then 1 else if n > MaxPageSize then MaxPageSize else n
```

### 6. Export clauses (Scala 3 literacy)

**`export`** re-exposes members of another object/type under the current type—useful for composing facades without manual forwarding:

```scala
class Logger:
  def info(msg: String): Unit = println(s"INFO $msg")
  def error(msg: String): Unit = println(s"ERROR $msg")

class Service(log: Logger):
  export log.{info, error}

  def run(): Unit =
    info("start")
    error("demo")
```

Use exports to keep a clean public surface over internal modules. Do not export everything from large dependencies—that creates sprawling APIs and accidental couplings.

```scala
object Api:
  export com.example.billing.{Invoice, LineItem}
  // callers import com.example.app.Api.* for a curated surface
```

---

## 2. Advanced concepts

### 1. Package objects (Scala 2 legacy)

`package object billing { type Id = String }` added aliases and vals to the package namespace. Scala 3 top-level definitions cover most needs; migrate package objects carefully (binary compatibility, duplicate definitions).

```scala
// brownfield shape you will still read
package object billing:
  type Id = String
  val DefaultCurrency: String = "USD"
```

### 2. Import hygiene and givens

Wildcards can pull **givens** / implicits into scope and change resolution silently. Prefer explicit given imports. Ambiguous givens are compile errors—good—until someone “fixes” it with a wider import that picks the wrong instance.

```scala
trait Show[A]:
  def show(a: A): String

object ShowInstances:
  given Show[Int] with
    def show(a: Int): String = a.toString
  given Show[String] with
    def show(a: String): String = a

def display[A](a: A)(using s: Show[A]): String = s.show(a)

// prefer:
import ShowInstances.given
// over import ShowInstances.* when givens matter
```

### 3. Qualified privacy and module design

`private[com.example]` vs `private[example]` vs `private[app]` encode different trust boundaries. Align package-private scopes with real module boundaries (domain vs api vs infra). Over-wide `private[com]` is almost public.

```scala
package com.example.billing.internal

private[billing] case class Row(id: String, cents: Long)

package com.example.billing

private[billing] def toRow(inv: Invoice): internal.Row =
  internal.Row(inv.id, inv.cents)
```

### 4. Self-types and visibility (preview for architecture)

Traits sometimes declare self-types (`this: Dep =>`) for cake-pattern style wiring. Visibility still matters: do not expose wiring traits as public API. Prefer constructor injection for new code unless the codebase standard says otherwise.

```scala
trait Clock:
  def nowMillis: Long

trait Audited:
  this: Clock =>
  def audit(msg: String): String = s"$nowMillis $msg"

class SysAudited extends Audited with Clock:
  def nowMillis: Long = System.currentTimeMillis
```

### 5. Java visibility interop

Scala `private` / `protected` compile to JVM access flags with nuances (especially for companions and nested types). From Java, Scala “private” members may be inaccessible as expected, but synthetic methods and module boundaries can surprise. Design cross-language APIs with **public** Java-friendly surfaces and keep Scala-only details package-private.

```scala
package com.example.app

/** Java-friendly entry; keep Scala ADTs behind this. */
final class BillingFacade:
  def createInvoice(cents: Long): String =
    Invoice(java.util.UUID.randomUUID.toString, cents).id
```

### 6. Root and `_root_`

If a local name shadows a top-level package, `_root_.com.example` disambiguates. Rare in clean layouts; useful when generated code or scripts collide.

```scala
package com.example.app

object com:  // pathological local name
  val x = 1

val invoiceType = _root_.com.example.billing.Invoice
```

### 7. File layout vs language packages

sbt expects `src/main/scala` (and `src/test/scala`) with directories mirroring packages. Mismatched paths compile in some setups but confuse navigation, coverage tools, and new contributors. Put only tests under `src/test/scala` with parallel package names (`com.example.app` tests beside production packages, not a separate `tests` package unless that is a team rule).

```text
src/main/scala/com/example/billing/Invoice.scala
src/test/scala/com/example/billing/InvoiceSuite.scala
```

---

## 3. Applications and use cases

### Software engineering

- One package per bounded context beat deep “util” dumping grounds.
- Public packages (`...api`) vs internal (`...internal`) naming plus `private[…]` enforce boundaries in review.
- Facades with `export` keep implementation packages hidden behind a stable entry module.
- Prefer constructor injection across packages over “reach into sibling package-private state.”

```scala
package com.example.app

final class BillingService(repo: InvoiceRepo):
  def open(cents: Long): Invoice =
    val inv = Invoice(java.util.UUID.randomUUID.toString, cents)
    repo.save(inv)
    inv

trait InvoiceRepo:
  def save(inv: Invoice): Unit
```

### Libraries and binary compatibility

- Package and public type names are forever once published.
- Narrowing visibility is usually safer than widening; check MiMa/compatibility tools in release pipelines when you maintain libraries.
- Split **api** and **implementation** artifacts when external callers must not see internals—even package-private is weak against determined same-classpath users.

### Security and operations

- Do not place secrets in package objects or top-level vals that get initialized on classload and logged.
- Restrict reflective and debug entry points with package-private hooks, not public static-like objects.
- In incident response, package names in stack traces are your map—keep them stable and meaningful.

```scala
package com.example.app

private[app] object DebugHooks:
  def dumpState(): String = "<redacted>"
```

### Staff-level review checklist

- Packages match intended module boundaries; no cyclic “everyone imports everyone.”
- Imports are selective enough to read; given imports explicit.
- `private[pkg]` scopes match real trust boundaries (not org-wide).
- Scala 3 `export` used for facades, not to re-publish entire libraries.
- Public API types live in documented packages; internals marked and enforced.
- Brownfield package objects understood before editing.
- Source paths mirror packages under `src/main/scala` and `src/test/scala`.

---

## References

- [Tour of Scala: Packages and Imports](https://docs.scala-lang.org/tour/packages-and-imports.html)
- [Scala 3 Book: Packages and Imports](https://docs.scala-lang.org/scala3/book/packaging-imports.html)
- [Scala 3 Reference: Export Clauses](https://docs.scala-lang.org/scala3/reference/other-new-features/export.html)
- [Scala 3 Reference: Top-Level Definitions](https://docs.scala-lang.org/scala3/reference/other-new-features/top-level-definitions.html)
- [Scala Documentation](https://docs.scala-lang.org/)
- [Scala Language](https://www.scala-lang.org/)
