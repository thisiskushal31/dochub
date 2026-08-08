# Exceptions, fibers, threading, and the GVL

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby handles **failure** (`raise`, `rescue`, `ensure`), how **exceptions** are classified, and how **fibers** and **threads** interact with **MRI’s global VM lock (GVL)**. You need this to design web servers, background jobs, and shared services—and to debug latency spikes, connection pool exhaustion, and swallowed errors in any long-running process.

---

## 1. Concepts

### 1. Exception hierarchy

**`Exception`** is the root. **`StandardError`** and most application errors inherit from it. **`rescue` without a class** catches **`StandardError`**, not every `Exception`.

Notable branches:

| Class | Typical meaning |
|-------|-----------------|
| `NoMethodError` | Missing method |
| `ArgumentError` | Bad arguments |
| `TypeError` | Wrong type for operation |
| `KeyError` | Missing hash key (`fetch`) |
| `LoadError` | `require` failed |
| `RuntimeError` | Generic `raise` default |
| `SystemExit` | `exit` called |
| `SignalException` | Signal received |

**`Exception#message`** and **`#backtrace`** carry diagnostics. **`cause`** links chained exceptions (Ruby 2.1+).

### 2. `begin`, `rescue`, `else`, `ensure`

```ruby
begin
  risky
rescue ArgumentError => e
  warn e.message
rescue StandardError => e
  raise
else
  # runs only if no exception
  log_success
ensure
  # always runs
  cleanup
end
```

**`ensure`** runs on success, failure, and thread kill (in most cases)—use for closing files, releasing locks, resetting `$VERBOSE`, etc.

**`retry`** in `rescue` re-enters the `begin` body—dangerous without a backoff counter.

### 3. Raising and re-raising

`raise` with no arguments in `rescue` re-raises the current exception. `raise NewError, 'msg'` or `raise 'msg'` creates errors. Preserve context with `raise e` or exception chaining.

### 4. Custom exceptions

```ruby
class DeploymentError < StandardError; end
```

Subclass **`StandardError`** for app errors so callers can `rescue` broadly or narrowly.

### 5. Fibers: cooperative concurrency

A **Fiber** is a lightweight coroutine with its own stack. Only one fiber runs Ruby code at a time per thread; fibers **yield** explicitly.

```ruby
f = Fiber.new do
  val = Fiber.yield 1
  val * 2
end
f.resume    # => 1
f.resume(10) # => 20
```

Fibers power **lazy enumerators** and async I/O experiments (**Fiber.scheduler** in Ruby 3+). They do not bypass the GVL across threads.

### 6. Threads and the GVL

**`Thread`** runs concurrent flows of execution. On **MRI**, the **GVL** (global VM lock) allows only one thread to execute Ruby bytecode at a time per process. Threads still help when work **releases the GVL** (I/O, some extensions, sleep).

Implications:

- CPU-bound Ruby in many threads on MRI **does not** scale linearly with cores.
- I/O-bound workloads (HTTP, disk, DB waits) can still benefit from threads.
- **JRuby** and **TruffleRuby** use different threading models (chapter 16–17).

### 7. Thread basics

```ruby
t = Thread.new { compute }
t.join
```

**`Thread.current`**, **`Thread.main`**, **`Thread.list`**. Uncaught exceptions in threads terminate the thread and may print at join time depending on version and handlers.

### 8. Mutex and Queue

**`Thread::Mutex`** protects critical sections. **`Thread::Queue`** is a thread-safe FIFO for producer/consumer patterns. Prefer higher-level abstractions in application code; know they exist for agents coordinating work.

### 9. `Timeout` (use carefully)

The stdlib **`timeout`** gem pattern is discouraged for production—timeouts can fire unpredictably with threads. Prefer socket **`read_timeout`**, HTTP client timeouts, and explicit cancellation policies.

---

## 2. Advanced concepts

### 1. `rescue Exception` is almost always wrong

Catching **`Exception`** catches signals and memory events you usually must not handle. Catch **`StandardError`** (or specific types) unless you are a framework boundary logging fatal faults.

### 2. `$!`, `$.`, and `raise` in `ensure`

`$!` holds the current exception in `rescue`/`ensure`. Do not swallow errors in `ensure` without re-raise unless intentional.

### 3. Thread-local variables

`Thread.current[:request_id] = id` isolates per-request state. Global variables are shared—avoid mutable globals in multi-threaded servers.

### 4. `Fiber.scheduler` and async Ruby

Ruby 3 introduced hooks for non-blocking I/O schedulers (experimental ecosystem). MRI async stacks are evolving; default production Ruby remains largely threaded/blocking I/O unless you adopt a specific library.

### 5. Exception objects are not cheap in hot loops

Raising for control flow is an anti-pattern. Use return values or result objects for expected cases.

### 6. `fatal` and `NoMemoryError`

Some errors are not recoverable. Design supervisors (process managers, Kubernetes restarts) assuming Ruby may exit hard.

### 7. Exception hierarchy in practice

Structure app errors under **`AppError < StandardError`**, then domain branches (`BillingError`, `InventoryError`). Libraries should raise specific types; applications rescue at boundaries and map to HTTP status or job retry policy.

**`Exception#full_message`** (Ruby 2.5+) formats cause chain—use in logs.

### 8. Puma, Rack, and the thread model

Typical Rails stack:

- **Multiple worker processes** (fork or spawn) for isolation and COW memory.
- Each worker runs **thread pool** handling concurrent requests.
- **ActiveRecord** connection pool size must be ≥ threads that touch DB (plus headroom for background work in same process).

Misconfiguration symptom: `could not obtain a connection from the pool` under load—not a Ruby bug, a pool math bug.

### 9. Sidekiq and job concurrency

Sidekiq uses **threads** in one process to run multiple jobs. CPU-heavy jobs contend on GVL; I/O-heavy jobs parallelize better. **Unique jobs**, **retry**, and **dead** queues are reliability primitives—design idempotent `perform` methods.

### 10. `Fiber.scheduler` (directional)

Ruby 3+ allows registering schedulers for non-blocking I/O (async gems). Ecosystem is not universal—default Rails remains threaded blocking I/O. Evaluate explicitly; do not assume async Rails without architecture review.

### 11. Ractors: bounded parallelism on MRI

**`Ractor`** is MRI’s **actor-model** API: each ractor runs Ruby with its **own GVL**, so **multiple ractors can execute Ruby in parallel** on CRuby—unlike threads, which share one GVL for Ruby code. This is not “free parallelism”: ractors **cannot read each other’s objects by default**; you pass data with **`send` / `receive`**, **`yield` / `take`**, or arguments to **`Ractor.new`**. Closures that capture outer variables are rejected (`ArgumentError` isolation) unless you pass values explicitly.

**Shareable vs unshareable:** Most mutable objects are unshareable. **`Ractor.shareable?`** and **`Ractor.make_shareable`** (deep-freeze) matter at boundaries. Sending unshareable objects **copies** by default (deep clone—**can be slow or fail**); **`move: true`** transfers ownership and leaves a **`Ractor::MovedObject`** shell in the sender—design APIs so moved objects are not touched again.

**Why teams rarely run production Rack on ractors (today):** ecosystems (Rails, most gems) assume **shared mutable process state** and thread-local patterns. Ractors fit **CPU pipelines** (image/video transforms, batch parsing) where you can **isolate** work units—not typical request/response without careful architecture.

**Staff checks:** profile clone cost; forbid `move` then accidental reuse; cap ractor count like any worker pool; treat ractor errors like thread errors (supervision, logging). See official docs for **constants** and **class/module instance variables** restrictions in non-main ractors.

---

## 3. Applications and use cases

### Software engineering and architecture

- Define a small **exception taxonomy** per service; map to HTTP 4xx/5xx or job retry vs discard.
- Log **`class`**, **message**, **backtrace** (truncated), **`cause`**, and correlation id in error trackers (Sentry, Rollbar).
- Use **`ensure`** for cleanup; prefer **`File.open`**, **`Net::HTTP` with block**, and ORM transactions with rollback.
- **Circuit breakers** stop calling failing dependencies—exceptions should not spam retry loops indefinitely.

### Web and API reliability

- Rack **middleware** rescues exceptions and renders 500 JSON without leaking stack to clients.
- **Rack::Timeout** or server-level timeouts prevent hung requests—prefer over `Timeout.timeout` around arbitrary code.

### Security engineering

- Do not expose full backtraces to untrusted clients.
- **`rescue` and continue** in auth paths can grant access on partial failure—fail closed.
- Rate-limit and alert on spike in `StandardError` rate—may indicate attack or dependency compromise.

### Background jobs and data integrity

- Jobs that `rescue` and swallow leave queues “green” while data is wrong—re-raise or push to dead letter after N attempts.
- Use **idempotency keys** so retries do not double-charge or duplicate records.

### Operations and capacity

```ruby
def with_retries(max: 3, base: 0.5)
  attempts = 0
  begin
    yield
  rescue TransientError
    attempts += 1
    raise if attempts >= max
    sleep base * (2**(attempts - 1))
    retry
  end
end
```

Document thread model in runbooks: “Puma workers = processes; threads per worker limited by GVL for CPU work.”

### Staff-level review checklist

- No bare `rescue` without re-raise in libraries.
- `ensure` does not mask the original exception.
- Thread pools sized for I/O vs CPU realistically on MRI.
- Timeouts applied at I/O boundaries, not only `Timeout.timeout`.
- Background thread errors are observed (join, handler, or monitoring).
- If **Ractor** is used: message boundaries are explicit; no reuse after `move: true`; clone cost measured under production-sized payloads.

---

## References

- [class Exception](https://docs.ruby-lang.org/en/3.4/Exception.html)
- [class StandardError](https://docs.ruby-lang.org/en/3.4/StandardError.html)
- [class Thread](https://docs.ruby-lang.org/en/3.4/Thread.html)
- [class Fiber](https://docs.ruby-lang.org/en/3.4/Fiber.html)
- [class Thread::Mutex](https://docs.ruby-lang.org/en/3.4/Thread/Mutex.html)
- [class Thread::Queue](https://docs.ruby-lang.org/en/3.4/Thread/Queue.html)
- [class Ractor](https://docs.ruby-lang.org/en/3.4/Ractor.html)
- [Syntax: Exceptions](https://docs.ruby-lang.org/en/3.4/syntax/exceptions_rdoc.html)
- [class Timeout](https://docs.ruby-lang.org/en/3.4/Timeout.html)
