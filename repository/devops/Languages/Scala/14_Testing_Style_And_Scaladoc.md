# Testing, style, and Scaladoc

[← Back to Scala](./README.md)

## What this chapter covers

How Scala teams raise the quality floor: **test frameworks at literacy level** (ScalaTest and MUnit roles), the idea of **property-based tests**, **style guide** expectations, **Scaladoc** for public APIs, and **CI quality gates** that keep format, compile, and test honest. After this chapter you should treat tests + style + docs as one pipeline, not optional local taste.

---

## 1. Concepts

### 1. Why testing looks different in Scala

Scala’s type system catches many shape errors early, but it does not prove business rules, serialization round-trips, or concurrency races. Tests remain mandatory for services, libraries, and Spark job logic that encodes money, access, or irreversible side effects.

Prefer:

- Fast unit tests next to pure logic
- Integration tests against real protocol boundaries (DB, brokers) in CI where feasible
- Clear separation between **domain assertions** and **framework ceremony**

Types reduce the need for “does this compile-shaped code crash?” tests. They do not reduce the need for “does this discount stack correctly?” tests.

### 2. ScalaTest and MUnit (roles, not manuals)

Two common JVM-Scala test libraries you will meet:

| Library | Literacy role |
|---------|----------------|
| **ScalaTest** | Broad style surface (FunSuite, FlatSpec, WordSpec, feature/spec styles). Dominant in older and many enterprise codebases. Powerful matchers; teams should **pick one suite style** per repo and stick to it. |
| **MUnit** | Smaller, opinionated suite model popular in newer Scala 3 projects. Emphasizes simple `test("…")` declarations and fixtures. |

Staff expectation is not memorizing every DSL: know which framework the repo uses, how to run tests via **sbt** (`test`, `testOnly`), and how failures map to line-level assertions. Do not introduce a second framework “for fun” in the same module.

```bash
sbt test
sbt "testOnly fully.qualified.SuiteName"
sbt "testOnly *Pricing* -- -z discount"
```

Wire the framework on the test classpath in `build.sbt` (versions illustrative):

```scala
libraryDependencies ++= Seq(
  "org.scalameta" %% "munit" % "1.0.2" % Test
  // or, in ScalaTest-first repos:
  // "org.scalatest" %% "scalatest" % "3.2.19" % Test
)
```

### 3. MUnit-style test snippet

MUnit keeps the suite thin: extend `munit.FunSuite`, name each case, assert with `assertEquals` / `assert`.

```scala
// src/test/scala/billing/DiscountSuite.scala
package billing

class DiscountSuite extends munit.FunSuite:

  test("no discount below threshold") {
    assertEquals(Discount.rate(cents = 999), 0.0)
  }

  test("standard discount at threshold") {
    assertEquals(Discount.rate(cents = 1000), 0.05)
  }

  test("rejects negative amounts") {
    intercept[IllegalArgumentException] {
      Discount.rate(cents = -1)
    }
  }
```

Production code under test (pure, easy to unit-test):

```scala
package billing

object Discount:
  def rate(cents: Long): Double =
    require(cents >= 0, "cents must be non-negative")
    if cents < 1000 then 0.0 else 0.05
```

### 4. ScalaTest-style test snippet

Same idea, FunSuite surface common in brownfield repos:

```scala
package billing

import org.scalatest.funsuite.AnyFunSuite

class DiscountSpec extends AnyFunSuite:

  test("no discount below threshold") {
    assert(Discount.rate(cents = 999) == 0.0)
  }

  test("standard discount at threshold") {
    assert(Discount.rate(cents = 1000) == 0.05)
  }
```

Pick **one** suite style per module. Mixing WordSpec, FlatSpec, and FunSuite in one package burns review time without improving coverage.

### 5. What to test first

Priority order for most teams:

1. Pure transformations and validation (`Option`/`Either` edges)
2. Public library APIs and binary/wire codecs
3. Failure paths (timeouts, decode errors, auth denials)
4. Concurrency only where races are realistic—flaky sleeps are not a strategy

Avoid tests that assert implementation private structure unless you own a critical invariant. Prefer behavior at the module boundary.

```scala
enum ParseError:
  case Empty, BadFormat

def parseUserId(raw: String): Either[ParseError, Long] =
  if raw.isEmpty then Left(ParseError.Empty)
  else raw.toLongOption.toRight(ParseError.BadFormat)

// Test both Left edges and a Right happy path — not the private helpers inside
```

### 6. Property-based testing (idea)

**Property tests** generate many inputs and check invariants (“decoding encoded values round-trips,” “sort is idempotent,” “permissions never widen”). They complement example-based tests; they do not replace readable regression cases for known bugs.

Use properties when the domain has clear algebraic laws or large input spaces. Keep generators honest about Unicode, empty collections, and boundary integers—trivial generators give false confidence.

Tiny idea-level example (illustrative invariant; wire your chosen property library’s generators in real projects):

```scala
// Example-based still required for the known bug:
// test("empty string is Empty") { assertEquals(parseUserId(""), Left(ParseError.Empty)) }

// Property: every string either parses to the same Long as toLongOption, or is rejected
def property_validLongString(raw: String): Boolean =
  raw.toLongOption match
    case Some(n) => parseUserId(raw) == Right(n)
    case None    => parseUserId(raw).isLeft

// In a property suite you would assert property_validLongString holds for many generated raw strings
```

Staff reading: one clear property plus two example tests beats fifty random asserts with no invariant named.

### 7. Style guide literacy

Scala has official **style guidance** for readable, reviewable code. Treat style as shared contract:

- Consistent naming (`camelCase` methods, `PascalCase` types)
- Prefer `val` and immutability by default
- Avoid cryptic operator overload in application code
- Keep methods short enough to review; extract when nesting obscures control flow

Automate what you can (formatters/linters your org adopts). Style arguments in PR review should cite the guide or repo config—not personal taste.

```scala
// Prefer
def totalCents(lines: List[Long]): Long = lines.sum

// Avoid in app code: symbolic operators nobody can search for
// def |+|(a: Long, b: Long): Long = a + b
```

### 8. Scaladoc on public methods

**Scaladoc** is the API documentation tool for Scala. Public libraries and shared internal modules need:

- Type-level summaries on packages, classes, and methods that callers use
- `@param` / return / throw (or equivalent) notes where behavior is non-obvious
- Examples only when they clarify contracts—and keep them compiling if your pipeline runs doctests or similar checks

Undocumented public APIs are a delivery bug for libraries; for apps, document the modules that other teams import.

```scala
package billing

/** Percentage discount applied to a cart subtotal.
  *
  * Rates are fractions in `[0.0, 1.0)` — for example `0.05` means five percent.
  *
  * @param cents non-negative subtotal in integer cents
  * @return discount rate; `0.0` when below the threshold
  * @throws IllegalArgumentException if `cents` is negative
  */
def rate(cents: Long): Double =
  require(cents >= 0, "cents must be non-negative")
  if cents < 1000 then 0.0 else 0.05
```

Generate docs in CI when you publish libraries (`sbt doc` or the Scaladoc tasks your Scala version documents). Broken Scaladoc links on a release train are a quality gate failure, not a nit.

### 9. CI quality gates

Minimum honest gate for Scala services:

| Gate | Intent |
|------|--------|
| Compile on pinned JDK + Scala | No “works on my laptop” drift |
| `sbt test` (or CI-equivalent) | Regressions fail the build |
| Format / style check | Diff noise and bike-shedding drop |
| Scaladoc / fatal warnings (optional policy) | Docs and warnings do not rot |

Gates must be **green on main**. Skipping tests to land a hotfix without a follow-up ticket is a process failure.

Wire gates so local developers can run the same commands CI runs. A “CI-only” magic script that nobody runs locally produces surprise red builds and eroded trust.

```bash
sbt -batch clean compile test
sbt -batch scalafmtCheckAll   # if the repo adopts a formatter plugin
sbt -batch doc                # when publishing or gating Scaladoc
```

---

## 2. Advanced concepts

### 1. Test parallelism and flakes

sbt and test frameworks may run suites in parallel. Shared temp dirs, ports, and global mutable fixtures cause flakes. Prefer unique resources per test, or mark suites serial when the domain forces shared hardware. Flakes that “retry green” without root cause become cultural debt.

```scala
// Prefer per-test isolation over shared mutable fixtures
class PortSuite extends munit.FunSuite:
  test("binds an ephemeral port") {
    val server = TestServer.start(port = 0) // OS-assigned
    try assert(server.port > 0)
    finally server.stop()
  }
```

### 2. Testing effectful and async code

For `Future`-based code: use timeouts, deterministic contexts in unit tests, and avoid arbitrary `Thread.sleep`. For effect libraries or actors (placement only): use the project’s testkit/interpreter—do not invent sleep-based synchronization.

```scala
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration.*

given ExecutionContext = ExecutionContext.global

test("async path completes under budget") {
  val f: Future[Int] = Future.successful(1).map(_ + 1)
  assertEquals(Await.result(f, 200.millis), 2)
}
```

### 3. Golden / snapshot discipline

Snapshot tests for JSON or config dumps are useful and dangerous. Require human review when snapshots change; never auto-accept in CI. Pair with schema or property checks so snapshots are not the only contract.

### 4. Coverage as a signal, not a target

Coverage tools can highlight untested modules; chasing 100% line coverage produces brittle tests. Staff care about **risk coverage**: authz, parsers, money, and migration paths.

### 5. Scala 2 / Scala 3 brownfield

Older suites may use ScalaTest DSLs that feel verbose next to MUnit. Migrate style when you migrate Scala versions or touch the suite heavily—not as drive-by churn in a behavior fix.

### 6. What “done” means for a PR

A behavior change without tests for the new invariant is incomplete unless the change is pure docs/config with no executable impact. Reviewers should ask which test would fail if the bug returned—not whether the author “tested manually once.”

### 7. Table-driven examples

When many inputs share one assertion shape, table-style cases keep noise down (MUnit/ScalaTest both support variants). Prefer named cases for security and money edges so failure messages stay readable.

```scala
test("threshold edges") {
  val cases = List(
    (0L, 0.0),
    (999L, 0.0),
    (1000L, 0.05),
    (50_000L, 0.05)
  )
  cases.foreach { (cents, expected) =>
    assertEquals(Discount.rate(cents), expected, clue = s"cents=$cents")
  }
}
```

### 8. Property tests for codecs, authz, and money

Property suites earn their keep where input space is large and the invariant is algebraic. Name the law in the test title so failures read as contract breaks, not random noise.

High-value domains:

| Domain | Invariant to generate against | Generators must include |
|--------|-------------------------------|-------------------------|
| **Wire codecs** | Decode(encode(x)) == x (or documented lossy subset); reject garbage without throwing opaque NPEs | Empty payloads, truncated bytes, Unicode / multi-byte strings, max-length fields |
| **Authz** | Deny-by-default; privilege never widens under composition; role ∩ resource stays within allow-list | Missing roles, empty scopes, overlapping grants, forged subject ids |
| **Money / quantities** | Non-negative balances after ops that claim conservation; no silent Long overflow; rounding mode is explicit | Zero, `Long.MaxValue` / near-overflow, negative attempts, mixed currency rejection |

Example-based cases still own known CVEs and production bugs. Properties own the combinatorial edges humans will not enumerate. If a generator never emits empty or Unicode, the suite is theater.

```scala
// Name the law; wire your property library’s Gen around this shape
def encodeDecodeRoundTrip[A](codec: Codec[A], value: A): Boolean =
  codec.decode(codec.encode(value)).contains(value)

def authzNeverWidens(base: Set[Permission], delta: Set[Permission]): Boolean =
  authorize(base ++ delta).subsetOf(authorize(base) ++ delta)

def moneyNoSilentOverflow(a: Long, b: Long): Boolean =
  addCents(a, b) match
    case Right(sum) => sum == a + b && sum >= a && sum >= b || a < 0 || b < 0
    case Left(_)    => true // overflow or policy reject is success for this law
```

### 9. Spark test pyramid

Spark jobs tempt teams into “run the cluster in every PR.” That is slow, flaky, and expensive. Prefer a pyramid:

1. **Pure-transform unit tests** — extract DataFrame/Dataset logic into functions over rows, columns, or domain types; assert without a SparkSession when possible.
2. **Version-pinned local Spark CI** — when you must exercise Catalyst, shuffle, or UDF boundaries, run a small local-mode suite on the **same Spark + Scala + JDK** majors as production; keep datasets tiny and deterministic.
3. **Staging / pre-prod jobs** — full partitions, real catalogs, and clock-sensitive windows live in a dedicated lane with owners—not as a required gate on every cosmetic PR.

Do not claim coverage from a unit suite that never saw nullability, empty partitions, or schema drift. Do not block merge on a nightly 2-hour cluster job without a fast fail path for the same invariants.

### 10. Schema and contract tests at boundaries

Kafka topics, HTTP APIs, and shared protobuf/Avro/JSON schemas are team contracts. Treat **schema/contract tests** as CI gates:

- Producer/consumer fixtures assert encode shape and reject unknown-required fields per compatibility mode (backward / forward / full—pick one per topic and enforce).
- API clients assert status codes and body codecs for happy and 4xx paths that other services depend on.
- Breaking schema changes fail the build unless a versioned migration or dual-write ADR is attached.

Contract tests sit between unit and full integration: they do not need a live broker for every assertion if you validate against frozen schema artifacts, but at least one lane should exercise the real wire format your platform ships.

### 11. MiMa and binary compatibility for published libs

**MiMa** (Migration Manager) compares a candidate jar against a previously published artifact and fails on binary-incompatible API changes. For any Scala library other teams depend on:

- Gate `mimaReportBinaryIssues` (or equivalent) in CI on release branches
- Decide semver policy: binary break ⇒ major bump; additive API ⇒ minor; no sig change ⇒ patch
- Exclude packages only with ownership notes—blanket filters hide accidental breaks

App-only repos do not need MiMa. Published shared modules without a binary-compat gate will eventually break downstream compile in surprising ways.

### 12. Security regression suites

Security-relevant Scala code needs regressions that stay green forever:

- **Reject paths** — unauthenticated, wrong scope, path traversal, oversized bodies: assert status/error type, not only “happy path 200”
- **Redaction helpers** — logs and traces never emit raw tokens, PANs, or secrets; assert on sample payloads after redaction
- **Poison / DLQ routing** — undecodable or toxic messages land in the dead-letter path with enough metadata to debug; processing must not infinite-retry poison into an outage
- **Fixtures** — synthetic keys and fake PII only; never paste live secrets, production dumps, or customer rows into the repo

One failing security regression should block merge the same way a broken money invariant does.

---

## 3. Applications and use cases

| Context | Practice |
|---------|----------|
| **Shared libraries** | Integration tests on the published API; Scaladoc as part of release; **MiMa / binary-compat** gates before publish. |
| **HTTP services** | Contract tests for codecs and auth filters; fewer tests that boot the entire world for every assertion. |
| **Spark jobs** | Pyramid: pure transforms → version-pinned local Spark CI → staging; do not put full-cluster cost on every PR. |
| **Kafka / event APIs** | Schema/contract tests as CI gates; poison → DLQ behavior covered by regression. |
| **Security** | Reject paths, redaction helpers, and DLQ routing under test; never commit live secrets in fixtures. |
| **Money / authz codecs** | Property tests with empty, Unicode, and overflow generators alongside named example bugs. |
| **Ops** | Fail CI when tests hang past a budget; publish JUnit XML or equivalent for the platform you use. |
| **Whole engineering** | Style + tests + docs are software-engineering controls; they also reduce incident MTTR when failures are precise. |

### Staff-level review checklist

- [ ] Repo has **one** primary test framework story per module; new styles need an ADR.
- [ ] `sbt test` (or documented equivalent) is required in CI on the pinned JDK/Scala.
- [ ] Critical domain invariants have example tests; high-cardinality domains consider property tests.
- [ ] Codec / authz / money properties exercise empty, Unicode, and overflow (or near-overflow) inputs.
- [ ] Async tests use timeouts and deterministic scheduling—not hope and sleep.
- [ ] Spark changes follow the pyramid (pure unit → pinned local Spark → staging), not cluster-in-every-PR.
- [ ] Kafka/API schema or contract tests gate CI for owned boundaries.
- [ ] Published Scala libraries run MiMa (or equivalent) binary-compat checks before release.
- [ ] Security regressions cover reject paths, redaction, and poison/DLQ routing.
- [ ] Style follows the official guide plus repo automation; review comments are enforceable.
- [ ] Public APIs have Scaladoc appropriate to consumers (`@param` / throws where non-obvious).
- [ ] Flaky tests have owners; quarantines expire.
- [ ] Snapshots/goldens cannot silently rewrite in CI.
- [ ] Test fixtures contain no real secrets or production PII.
- [ ] Local developers can run the same gate commands CI runs.

---

## References

- [Scala Style Guide](https://docs.scala-lang.org/style/)
- [Scala 3 Style Guide](https://docs.scala-lang.org/scala3/style-rules.html)
- [Scaladoc](https://docs.scala-lang.org/scala3/guides/scaladoc/index.html)
- [sbt — Testing](https://www.scala-sbt.org/1.x/docs/Testing.html)
- [MiMa](https://github.com/lightbend/mima)
- [Scala 3 Book](https://docs.scala-lang.org/scala3/book/introduction.html)
- [Scala Documentation hub](https://docs.scala-lang.org/)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
