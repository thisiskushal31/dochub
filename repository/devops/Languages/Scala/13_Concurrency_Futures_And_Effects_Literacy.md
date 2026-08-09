# Concurrency, Futures, and effects literacy

[← Back to Scala](./README.md)

## What this chapter covers

How **concurrency on the JVM** shows up in Scala: what an **`ExecutionContext`** is, what a **`Future`** represents, how **`map` / `flatMap` / `recover`** compose, how **failures** and **timeouts** behave, and the **blocking** pitfall that starves pools. Actor systems and effect libraries appear only as **placement literacy**—so you can read brownfield code and choose a stack deliberately—not as product manuals.

---

## 1. Concepts

### 1. Concurrency vs parallelism on the JVM

**Concurrency** means overlapping waits (I/O, timers, fan-out) so the process makes progress on many logical tasks. **Parallelism** means using multiple CPU cores for compute. Scala does not magically choose either for you: threads, pools, and libraries decide. A single-threaded mental model fails as soon as you share mutable state across asynchronous boundaries.

Scala 3 default style still prefers **immutable data** and explicit mutation when needed. Concurrent code that mutates shared `var`s or Java collections without synchronization is a review failure even if types compile.

### 2. `ExecutionContext`: where work runs

An **`ExecutionContext`** is the bridge between “this computation is ready” and “run it on some thread.” `Future` transformations (`map`, `flatMap`, `foreach`, callbacks) schedule work on an implicit (Scala 2) or given (Scala 3) context.

Staff mental model:

| Piece | Role |
|-------|------|
| **Caller thread** | Starts the future or awaits a result |
| **ExecutionContext** | Decides *which pool* runs continuations |
| **Blocking call** | Occupies a pool thread until it returns |

If you block the pool that also runs your futures (long HTTP waits, JDBC without a dedicated pool, `Thread.sleep`), other work starves. Provide a **blocking-aware** context or isolate blocking I/O—do not pretend `Future` made the call non-blocking.

Global defaults (for example a shared global context) are convenient for toys and dangerous in services: document which context each subsystem uses.

```scala
import java.util.concurrent.Executors
import scala.concurrent.ExecutionContext

// CPU / short async work — size near cores (example only)
val cpuEc: ExecutionContext =
  ExecutionContext.fromExecutorService(Executors.newFixedThreadPool(8))

// Blocking I/O — separate pool so JDBC/sleep cannot starve CPU work
val blockingEc: ExecutionContext =
  ExecutionContext.fromExecutorService(Executors.newCachedThreadPool())
```

In Scala 3, pass the context as a **`given`** so call sites see the contract. In Scala 2 brownfield, the same role is an **`implicit ExecutionContext`**.

```scala
import scala.concurrent.{ExecutionContext, Future}

given ExecutionContext = cpuEc

def loadId(name: String): Future[Long] =
  Future { /* short compute or non-blocking call */ 42L }
```

### 3. `Future` basics

A **`Future[T]`** represents a value of type `T` that may complete later with success or failure. Creating a future schedules work; chaining transforms compose asynchronous pipelines.

Key habits:

- Prefer composing futures over nested callbacks.
- Treat completion as **once**: success or failure, not both.
- Do not assume ordering across independently started futures unless you join them explicitly.
- Passing `ExecutionContext` as a **given** (Scala 3) or `implicit` (Scala 2) is part of the API contract—call sites must see the right one.

Starting work and transforming a successful value:

```scala
import scala.concurrent.{ExecutionContext, Future}

given ExecutionContext = ExecutionContext.global

def fetchRaw(userId: String): Future[String] =
  Future {
    // stand-in for I/O; keep real I/O off the wrong pool (see §1.6)
    s"""{"id":"$userId","tier":"gold"}"""
  }

def parseTier(json: String): String =
  if json.contains("gold") then "gold" else "standard"

// map: Future[A] => (A => B) => Future[B]  — same "async box", sync transform
val tierF: Future[String] =
  fetchRaw("u-1").map(parseTier)
```

### 4. `flatMap` and for-comprehensions

Use **`flatMap`** when the next step itself returns a `Future`. Nesting `map` that returns futures produces `Future[Future[…]]`—almost always a smell. A **for-comprehension** desugars to `flatMap`/`map` and keeps sequential async pipelines readable.

```scala
def loadProfile(userId: String): Future[String] =
  Future.successful(s"profile:$userId")

def loadPrefs(userId: String): Future[Map[String, String]] =
  Future.successful(Map("theme" -> "dark"))

def dashboard(userId: String)(using ExecutionContext): Future[String] =
  for
    profile <- loadProfile(userId)
    prefs   <- loadPrefs(userId)
  yield s"$profile prefs=${prefs.mkString(",")}"

// Equivalent flatMap shape (same sequencing):
def dashboardFlat(userId: String)(using ExecutionContext): Future[String] =
  loadProfile(userId).flatMap { profile =>
    loadPrefs(userId).map { prefs =>
      s"$profile prefs=${prefs.mkString(",")}"
    }
  }
```

Independent futures can overlap if you **start** them before sequencing results:

```scala
def overlapped(userId: String)(using ExecutionContext): Future[String] =
  val p = loadProfile(userId)   // started now
  val r = loadPrefs(userId)     // started now
  for
    profile <- p
    prefs   <- r
  yield s"$profile / ${prefs.size}"
```

`Future.sequence` / traverse helpers on large collections can create **thundering herds**—bound concurrency when fan-out hits downstream capacity.

### 5. Failure handling: `recover`, `recoverWith`, and domain errors

Failed futures carry a **`Throwable`**. Recover deliberately:

- **`recover` / `recoverWith`** — map known failures to values or alternate futures.
- **`transform` / `transformWith`** — handle success and failure in one place when both matter.
- Logging inside recoveries without rethrowing can **swallow** incidents; log and either fail closed or return a typed domain error.

```scala
import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

final class NotFound(msg: String) extends Exception(msg)

def lookup(id: String)(using ExecutionContext): Future[String] =
  if id.isEmpty then Future.failed(new NotFound("empty id"))
  else Future.successful(s"row:$id")

def lookupOrDefault(id: String)(using ExecutionContext): Future[String] =
  lookup(id).recover {
    case _: NotFound => "missing"
  }

def lookupWithFallback(id: String)(using ExecutionContext): Future[String] =
  lookup(id).recoverWith {
    case _: NotFound =>
      Future.successful("fallback-store")
    case NonFatal(e) =>
      // log e, then fail closed or map to a typed error future
      Future.failed(e)
  }
```

Do not confuse a **failed future** with a **`Try`/`Either` inside a successful future**. Domain errors that are expected business outcomes often belong in the success channel as `Either`/`Option`; unexpected faults belong as failures (or as a single error ADT your team owns). Mixing both without a convention produces unreadable pipelines.

```scala
enum LoadError:
  case Missing, Corrupt

def loadEither(id: String)(using ExecutionContext): Future[Either[LoadError, String]] =
  Future {
    if id.isEmpty then Left(LoadError.Missing)
    else Right(s"ok:$id")
  }
// Completes successfully with Left/Right — callers map on Either, not only on Throwable
```

### 6. Blocking pitfall

Wrapping a blocking call in `Future { … }` does **not** make it non-blocking—it only moves the block onto a pool thread. If that pool also runs your request continuations, latency climbs for everyone.

```scala
import scala.concurrent.{ExecutionContext, Future, blocking}

// ANTI-PATTERN: blocking the shared/CPU context
def badJdbc(using ExecutionContext): Future[Int] =
  Future {
    Thread.sleep(200) // stand-in for JDBC / file / DNS
    1
  }

// BETTER: isolate blocking work (sketch — wire your real blockingEc)
def betterJdbc(using blockingEc: ExecutionContext): Future[Int] =
  Future {
    blocking {  // hints some pools to temporarily expand
      Thread.sleep(200)
      1
    }
  }(using blockingEc)
```

Staff rule: name pools by purpose; never “just use global” for production request paths that touch JDBC, legacy sync SDKs, or `Thread.sleep` in tests that share the app context.

### 7. Waiting, timeouts, and sync boundaries

**`Await.result`** (and related) block the current thread until completion or timeout. Valid at process edges (tests, `main`, migration adapters). Inside request handlers that already sit on a service pool, blocking awaits create nested pool hazards. Prefer staying asynchronous through the stack once you start, or use a clear sync boundary with its own timeout budget.

Timeouts are part of the contract: unbounded waits are operational debt.

```scala
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration.*

given ExecutionContext = ExecutionContext.global

def slow(): Future[String] =
  Future { Thread.sleep(5_000); "done" }

// Edge / test / main only — never deep inside a request pool without a design
val result: String =
  Await.result(slow(), 200.millis) // throws TimeoutException if budget exceeded
```

Timeout literacy checklist:

| Question | Why it matters |
|----------|----------------|
| Who owns the budget? | Client SLA vs internal hop vs batch window |
| What happens on timeout? | Cancel cooperatively, fail the request, retry with jitter? |
| Is `Await` on the request thread? | Usually wrong—prefer async timeout APIs your stack provides |
| Do retries multiply load? | Timeouts without backoff amplify outages |

Classic `Future` does not give structured cancellation for free when a timeout fires; downstream work may continue unless you design cooperative checks, use a library that models cancellation, or keep side effects idempotent and bounded.

### 8. When not to invent a framework

Stop and reuse (or stay simple) when you are about to build:

- A private actor runtime “because threads are hard”
- A custom effect monad stack without library support and training plan
- Ad-hoc promise graphs that reimplement cancellation, supervision, and metrics poorly

`Future` + clear pools + timeouts is enough for many services. Reach for a mature ecosystem only when you need its **owned** model (actors, structured concurrency, pure effect scheduling)—and budget for hiring, debugging, and ops expertise.

---

## 2. Advanced concepts

### 1. Thread pools as capacity plans

Name pools by purpose: CPU-bound, blocking I/O, and (if needed) a small admin pool. Size blocking pools for the backend’s concurrency limits, not for “as many threads as cores.” Exhaustion looks like latency cliffs and timeouts, not always like exceptions.

Document pool names in the service README or ADR: which context HTTP handlers use, which JDBC uses, which background jobs use. Silent `ExecutionContext.global` in a hot path is a review finding.

### 2. Shared mutable state across futures

Even with immutability elsewhere, caches, metrics registries, and Java interop objects are often shared. Prefer concurrent collections or explicit locks; prefer designing shared state out. Race bugs in Scala look like “impossible” nulls and lost updates—the type system will not save undisciplined mutation.

```scala
import java.util.concurrent.ConcurrentHashMap
import scala.concurrent.{ExecutionContext, Future}

val cache = new ConcurrentHashMap[String, String]()

def cachedGet(key: String)(using ExecutionContext): Future[String] =
  Future {
    Option(cache.get(key)).getOrElse {
      val v = s"computed:$key"
      cache.putIfAbsent(key, v)
      Option(cache.get(key)).getOrElse(v)
    }
  }
```

### 3. Actor and effect ecosystems (placement only)

You will meet two large families in industry code:

| Family | Placement literacy |
|--------|--------------------|
| **Actor systems** (e.g. Akka / Pekko-class) | Message-passing concurrency, supervision, location transparency in distributed settings. Useful when the domain is naturally event/message oriented. Not a free substitute for understanding JVM threads and backpressure. |
| **Effect systems** (e.g. Cats Effect-class) | Encode side effects in types (`IO`-style) with structured concurrency, resource safety, and test interpreters. Powerful when the team commits to the discipline; costly as a half-adopted side stack next to raw `Future`. |

This track does **not** teach those products. Staff expectation: recognize which model a codebase uses, refuse to mix three models in one service without a migration plan, and assign an owner who is accountable for that stack’s runbooks, upgrades, and on-call debugging—depth stays with that owner’s training plan, not as a second concurrency story bolted onto raw `Future`.

### 4. TOCTOU authz across futures

**Time-of-check to time-of-use** is amplified by async gaps. A common bug:

1. Future A: authorize principal → allow.
2. Later future B: mutate or return a sensitive resource using the earlier allow bit.
3. Between A and B, role/session was revoked, entitlement changed, or the resource’s owner changed.

Staff rule: **re-check authorization at the write (or disclose) boundary**, not only at request entry. Caching “allowed=true” on a `Request` object that then fans out across futures is not a capability token unless you own invalidation and TTL. Prefer passing a verified principal id and re-loading policy where the side effect happens; make privilege checks idempotent with the mutation.

### 5. MDC / `ThreadLocal` leakage across `ExecutionContext` threads

SLF4J **MDC**, request-id `ThreadLocal`s, and security contexts stored in thread-locals are **bound to a thread**, not to a `Future`. Continuations scheduled on an `ExecutionContext` often run on a **different** pool thread:

- Context set on the caller thread may be **missing** on the continuation → broken traces, empty user ids in logs.
- Worse: a worker thread retains a **previous** request’s MDC/principal after the task ends → log/authz **cross-talk** between tenants.

Staff rule: clear or restore MDC in `finally` / `transform` hooks around async work; prefer explicit correlation parameters over ambient thread-locals for security decisions; never authorize from a ThreadLocal that is not proven to hop with the future.

### 6. Bounded fan-out and queues as DoS controls

`Future.sequence` / traverse over attacker- or customer-controlled collections is a **resource DoS**: unbounded futures mean unbounded queue depth, connection use, and memory. Staff controls:

- Cap concurrency (fixed worker pool, semaphore, or bounded queue in front of work).
- Reject or paginate oversized fan-out at the API edge before scheduling.
- Apply the same bounds to internal retries and webhook storms—timeouts without concurrency limits still melt pools.

Treat the bound as a capacity number in the runbook, not a magic constant in one helper.

### 7. JDK virtual threads (placement literacy)

Modern JDKs offer **virtual threads** as a JVM concurrency tool. For Scala services, placement only:

- Virtual threads help **blocking-shaped** workloads by making “one thread per wait” cheaper—they do not remove the need for timeouts, bounds, or clear ownership of blocking vs CPU work.
- Mixing unmanaged virtual-thread executors with existing `ExecutionContext` / effect runtimes without a design produces two schedulers and harder backpressure.
- Do not rewrite a working `Future` + named pools story solely to chase virtual threads; adopt when the org’s JDK baseline and library support are intentional, and document which code paths opt in.

### 8. Concurrent session / authz caches: TTL and invalidation ownership

Shared maps of sessions, tokens, or “user → roles” across futures are hot race surfaces. Staff requirements:

- **TTL** on every cache entry—compromise and revocation must expire even if push invalidation fails.
- **Invalidation ownership**: who deletes on logout, password reset, role change, and admin revoke? Name the path; test it under concurrent readers.
- Prefer a single cache abstraction with documented consistency (eventual vs read-your-writes) over ad-hoc `ConcurrentHashMap` puts in three packages.

### 9. Scala 2 vs Scala 3 surface

Mechanics of `Future` are shared; contextual parameters differ (`implicit ExecutionContext` vs `given`). When reading Spark-era Scala 2.13 services, expect implicits and older style guides. Do not “clean up” concurrency style in the same PR as a CVE bump.

```scala
// Scala 2 brownfield shape (read literacy)
// def work(id: String)(implicit ec: ExecutionContext): Future[String] = …

// Scala 3 shape
// def work(id: String)(using ExecutionContext): Future[String] = …
```

### 10. Cancellation and resource lifetime

Classic `Future` pipelines do not give you structured cancellation for free. If a client disconnects, downstream work may continue unless you design cooperative checks, use a library that models cancellation, or bound work with timeouts and idempotent side effects. Resources (connections, files) opened in async code need deterministic close paths—`Future` alone is not a resource scope.

### 11. Observability of async work

Name and measure what matters: queue depth or active tasks on pools, outbound latency, failure rates by cause, and timeout counts. Without those signals, “the service is slow” cannot be attributed to pool exhaustion vs downstream vs lock contention. Correlation IDs must propagate across async boundaries or traces fracture—**without** relying on uncleared MDC alone.

```scala
import scala.concurrent.{ExecutionContext, Future}

def withRequestId[A](requestId: String)(body: => Future[A])(using ExecutionContext): Future[A] =
  body.transform { result =>
    // attach requestId to logs/metrics in real code; sketch shows the hook point
    result
  }
```

### 12. Composition pitfalls worth naming

- **Nested `Future`**: `map` that returns `Future` → use `flatMap`.
- **Discarded futures**: starting work and ignoring the `Future` loses failures; at least `foreach`/`onComplete` for fire-and-forget with logging, or track them.
- **`Future.successful` / `failed`**: complete immediately on the caller thread for the value path—still need a context for later transforms.
- **Mixing `Try` inside and failed futures outside** without a team rule → unreadable error channels.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **HTTP / gRPC services** | One owned context story per process; never block the request pool on JDBC without a blocking pool; timeouts on outbound calls; re-check authz at writes. |
| **Batch / ETL helpers** | Bounded parallelism for fan-out; prefer job-level concurrency controls over unbounded `Future.sequence` on huge lists. |
| **Spark / Kafka-adjacent** | Cluster and client concurrency are owned by those platforms; your Scala futures inside a task still must not block the wrong pool. |
| **Tests** | Deterministic clocks and explicit contexts beat sleeping; fail tests that hang past a budget. |
| **Security** | Concurrent handlers amplify race bugs in authz caches; treat shared session maps as hostile—TTL + named invalidation; clear MDC between tasks. |
| **Software engineering** | Document the concurrency model in the README/ADR so new contributors do not add a second stack; virtual-thread adoption is an ADR, not a drive-by. |

Handler sketch (service-shaped, still `Future`-only)—note authz adjacent to the sensitive action, not only at the door:

```scala
import scala.concurrent.{ExecutionContext, Future}

final case class Request(userId: String, resourceId: String)
final case class Response(body: String)

def authorize(userId: String, resourceId: String)(using ExecutionContext): Future[Boolean] =
  Future.successful(userId.nonEmpty && resourceId.nonEmpty)

def fetch(userId: String, resourceId: String)(using ExecutionContext): Future[String] =
  Future.successful(s"data:$userId:$resourceId")

def handle(req: Request)(using ExecutionContext): Future[Response] =
  for
    ok   <- authorize(req.userId, req.resourceId)  // re-check near the read/write
    body <- if ok then fetch(req.userId, req.resourceId)
            else Future.failed(new SecurityException("denied"))
  yield Response(body)
```

### Staff-level review checklist

- [ ] Every async subsystem documents its **`ExecutionContext`** (or equivalent scheduler)—no silent global default in production paths.
- [ ] Blocking I/O is isolated; request/CPU pools are not used for unbounded blocking.
- [ ] Failures are recovered or surfaced on purpose—no empty catch-all that returns a success sentinel.
- [ ] Domain errors vs faults have a team convention (`Either` in success vs failed `Future`).
- [ ] Timeouts exist on awaits and outbound calls; budgets are documented.
- [ ] Shared mutable state across futures is justified and synchronized (or removed).
- [ ] Authz is **re-checked at write/disclose**, not only at request entry (TOCTOU-safe across futures).
- [ ] MDC/`ThreadLocal` context is cleared or explicitly propagated—no cross-request leakage on pools.
- [ ] Fan-out (`sequence` / traverse) is **bounded**; queue/pool limits treated as DoS controls.
- [ ] Session/authz caches have **TTL** and a named **invalidation** owner (logout/revoke paths tested).
- [ ] JDK virtual threads, if used, are an intentional placement with one scheduler story—not a silent second pool.
- [ ] No new private actor/effect framework without an ADR and staffing plan.
- [ ] Actor or effect libraries, if present, are the **one** concurrency story for that service—not layered ad hoc on raw futures everywhere.
- [ ] `Await` appears only at intentional sync boundaries.
- [ ] Correlation IDs (or equivalent) cross async boundaries for traces/logs.

---

## References

- [Scala 3 Book — Concurrency](https://docs.scala-lang.org/scala3/book/concurrency.html)
- [Scala Standard Library — `Future`](https://www.scala-lang.org/api/3.x/scala/concurrent/Future.html)
- [Scala Standard Library — `ExecutionContext`](https://www.scala-lang.org/api/3.x/scala/concurrent/ExecutionContext.html)
- [Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html)
- [Scala Documentation hub](https://docs.scala-lang.org/)
