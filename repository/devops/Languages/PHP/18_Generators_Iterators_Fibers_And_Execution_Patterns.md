# Generators, iterators, fibers, and execution patterns

[← Back to PHP](./README.md)

## What this chapter covers

Lazy iteration with generators, `Iterator` interoperability, `yield from` delegation, generator lifecycle control (`send`, `throw`, `close`), memory behavior vs arrays, and how fibers change control flow in async-style code. This chapter closes a common gap: many engineers use `foreach` daily but cannot explain why memory spikes or why long-running workers stall under mixed I/O.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases**.

## 1. Concepts

### 1. Iteration models in PHP

PHP supports:

- eager arrays (`foreach` over realized data),
- iterator objects implementing `Iterator` / `IteratorAggregate`,
- generators (`yield`) that produce values lazily.

Generators are ideal when data is naturally streamed (logs, cursor pages, queue batches), because they avoid building giant arrays.

```php
<?php
declare(strict_types=1);

function lines(iterable $rows): Generator {
    foreach ($rows as $row) {
        yield trim((string)$row);
    }
}
```

---

### 2. `yield`, keys, and `yield from`

`yield $value` emits values; `yield $key => $value` controls keys. `yield from $iterable` delegates to another iterable and forwards values (and exceptions) through the chain.

Delegation is useful for composable pipelines: read chunk → transform → validate → emit.

---

### 3. Bidirectional generators

Generators are not only pull-only iterables. You can:

- `send($value)` into suspended generator logic,
- `throw($e)` into it for controlled failure handling,
- `close()` to force cleanup when consumer stops early.

These capabilities matter for resource cleanup (file handles, sockets) when loops break early.

---

### 4. Fibers vs generators

Generators model lazy value production. Fibers model cooperative scheduling between execution contexts. Fibers can suspend from deeper call stacks without exposing `yield` in each function signature.

Use generators for data streams; use fibers for async orchestration control flow.

---

## 2. Advanced concepts

**Generator finalization:** Cleanup in `finally` blocks runs when generator is exhausted or closed. If consumer abandons iteration without close and process exits abruptly, cleanup timing may differ in daemons.

**Memory traps:** A lazy generator can still leak memory if each iteration appends to an outer array or captures large closures by reference.

**Iterator invalidation:** Mutating the same array while iterating can cause subtle behavior differences versus dedicated iterator objects.

**`Traversable` boundaries:** APIs accepting `iterable` should avoid assuming rewindability; some iterables (stream-like generators) are single-pass.

**Fibers in workers:** Fiber scheduling with blocking I/O (non-async DB client) gives little benefit; mixing cooperative and blocking calls creates head-scratching stalls.

---

## 3. Applications and use cases

- **ETL pipelines:** Stream DB rows in chunks with generators instead of `fetchAll`.
- **Log processing:** Parse huge files line-by-line without OOM.
- **Queue workers:** Compose middleware-like processing with `yield from` for observability wrappers.
- **Framework internals:** Understand lazy collections and cursor APIs to avoid accidental eager materialization.
- **Incident response:** Investigate memory growth by locating hidden accumulators around otherwise “lazy” code.

---

## References

- [Generators](https://www.php.net/manual/en/language.generators.php)
- [Generator class](https://www.php.net/manual/en/class.generator.php)
- [Predefined interfaces](https://www.php.net/manual/en/reserved.interfaces.php)
- [Fibers](https://www.php.net/manual/en/language.fibers.php)
