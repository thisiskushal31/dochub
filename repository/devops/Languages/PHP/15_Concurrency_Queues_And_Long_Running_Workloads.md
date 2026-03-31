# Concurrency, queues, and long-running workloads

[← Back to PHP](./README.md)

## What this chapter covers

Why FPM workers are not a general thread pool, fibers as cooperative concurrency, `pcntl` and process forking constraints under web SAPIs, optional `parallel` threading in CLI, queue delivery semantics (at-least-once, idempotency), backoff and DLQs, cron overlap, and graceful shutdown under systemd. Later chapters assume timeouts are composed across broker, worker, DB, and HTTP layers.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Request-bound PHP vs background workers

Offload CPU/I/O heavy work to queue consumers running CLI PHP under supervisord, systemd, Kubernetes Jobs, or framework supervisors (Horizon, Messenger workers). Web requests stay within tight latency budgets; workers can run longer with different `memory_limit` and restart policies.

---

### 2. Fibers

Fibers yield cooperative multitasking inside one thread—useful for async libraries without callback pyramids. They do not parallelize CPU across cores.

```php
<?php
declare(strict_types=1);

$fiber = new Fiber(function (): void {
    Fiber::suspend('first');
    Fiber::suspend('second');
});

var_dump($fiber->start());
var_dump($fiber->resume());
```

---

### 3. Processes (`pcntl`)

Forking and signal control require CLI SAPI and enabled `pcntl`. Forking inside FPM workers is unsafe and usually disabled—use separate processes.

---

### 4. `parallel` extension

Optional real threading for specialized CLI workloads—not universally available.

---

### 5. Queue semantics

Brokers typically deliver at least once—consumers must be idempotent (dedupe keys, transactional outbox, or broker idempotency tokens).

---

### 6. Cron overlap

Use `flock` or mutexes to prevent overlapping cron invocations when runtime exceeds the schedule period.

---

### 7. Transactional outbox (pattern)

When the database commit and the enqueue must align, write an **outbox row** in the same transaction as business data; a separate relay process publishes to the broker. This avoids “DB committed, message lost” or “message sent, DB rolled back” races that plain `dispatch()` after `commit()` still exhibits under crashes.

---

## 2. Advanced concepts

**Timeout stacking:** Align `visibility_timeout`, worker `max_execution_time`, DB `statement_timeout`, and outbound HTTP client timeouts—avoid orphan side effects when PHP is killed mid-flight.

**Memory in daemons:** Restart workers after N jobs (`pm.max_requests` analogs) to contain leaks.

**Ordering vs scale:** Single-partition queues preserve per-key ordering; sharding relaxes global order.

**Backpressure:** Shed load at API edge (`503` + `Retry-After`) when queues grow unbounded.

**Graceful shutdown:** Handle `SIGTERM` to finish in-flight jobs or requeue safely before exit.

**PID files and stale locks:** Cron wrappers that write PID files must handle zombie PIDs and machine restarts—prefer `flock` on a dedicated lockfile over naive PID comparison.

**pcntl_async_signals:** In CLI workers, async signal dispatch interacts with blocking I/O—test shutdown while blocked on Redis `BLPOP` or similar.

---

## 3. Applications and use cases

- **SRE:** Alert on queue age p95, DLQ depth, consumer crash loops.
- **Security:** Validate job payloads like HTTP requests—malicious producers exist.
- **Cost:** Autoscale consumers on lag, not CPU alone.
- **Compliance:** Encrypt sensitive job payloads at rest if required; audit enqueue permissions.
- **Framework ops:** Horizon/Messenger/Action Scheduler—learn each tool’s metrics and restart semantics.

---

## References

- [Fibers](https://www.php.net/manual/en/language.fibers.php)
- [Process Control](https://www.php.net/manual/en/book.pcntl.php)
- [Parallel](https://www.php.net/manual/en/book.parallel.php)
- [Garbage Collection](https://www.php.net/manual/en/features.gc.php)
- [Connection handling](https://www.php.net/manual/en/features.connection-handling.php)
- [Using PHP from the command line](https://www.php.net/manual/en/features.commandline.php)
- [pcntl_signal](https://www.php.net/manual/en/function.pcntl-signal.php)
