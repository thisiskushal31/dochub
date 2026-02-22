# Write-Behind (Write-Back)

## How it works

The application writes to the **cache**; the cache **asynchronously** writes to the backing store. Reads are served from the cache (and optionally from the store on miss).

**Write:** Application updates cache and returns; a background process or the cache itself flushes batches of updates to the store.

## Properties

- **Write performance** — Very fast for the application; no synchronous DB write.
- **Risk of data loss** — If the cache fails before flushing, recent writes can be lost. Mitigate with persistence (e.g. Redis AOF), replication, or accepting limited loss for non-critical data.
- **Complexity** — Ordering, batching, and retries are harder than with write-through.

## Use case

High write throughput where you can tolerate some delay before data hits the store and possibly limited loss on cache failure (e.g. metrics, non-critical counters, or when you have a durable write-ahead log).
