# Write-Through

## What it is

**Write-through** is a caching strategy where the application treats the **cache as the main data store** for reads and writes. The cache is responsible for writing to the backing store. Every write goes to the cache and **synchronously** to the database before the write is considered done.

**Use case:** When you need the cache to always reflect the latest write and can accept slower writes (e.g. user preferences, config). Often combined with a TTL or cache-aside for reads to warm new nodes.

---

## How it works

**Write:** Application writes to cache; cache writes to the database **synchronously**, then returns. **Read:** Application reads from cache. On miss, the cache (or app) can load from DB and populate the cache.

The diagram below shows the flow: the application talks only to the cache, and the cache keeps the database in sync on every write.

![Write-through cache: application → cache → database on each write](../assets/caching/write-through-cache.png)

---

## Properties

- **Consistency** — Cache and DB are updated together on write; no stale data in cache for written keys.
- **Write latency** — Every write pays the cost of a DB write, so writes are slower.
- **Read latency** — Reads of recently written data are fast because they hit the cache.
- **Cold nodes** — A new cache node has no data until keys are written again (or loaded); cache-aside on read can help populate.
