# Cold and Warm Cache

## What they mean

- **Cold cache** — Cache has **little or no** useful data yet (e.g. just started, or was cleared). Many requests will **miss** and go to the origin; latency and load on the origin are higher until the cache **warms up**.
- **Warm cache** — Cache has been **populated** with frequently accessed data (hot set). **Hit rate** is higher; latency and origin load are lower.

## Why it matters

- **Cold start** — After a deployment, restart, or failover, caches are cold. Traffic can spike to the origin and latency can increase until the cache warms.
- **Capacity planning** — Origin and downstream must handle the **cold** phase (e.g. after an incident or a new region).

## How to warm a cache

- **Lazy warming** — Normal traffic populates the cache over time (cache-aside). Simple but slow to warm.
- **Eager warming** — Preload critical or hot data after deploy (e.g. script that hits key URLs or keys, or restore from a snapshot). Reduces cold impact.
- **Refresh-ahead** — Refresh entries before expiry so they stay warm. See [Refresh-ahead](5-refresh-ahead.md).
- **Replication** — In distributed caches, replicas can inherit or copy data from peers so new nodes warm faster.

## Trade-offs

- **Lazy** — No extra logic; cold period is longer.
- **Eager** — More complexity and possibly extra load on origin during warm-up; cold period is shorter.

**When to use:** Design for **cold** (origin can handle full load; timeouts and backpressure). Use **eager warming** or **refresh-ahead** when cold latency or origin load must be minimized. See [Caching overview](1-caching-overview.md).
