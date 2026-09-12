# Consistency Patterns

## Overview

Consistency patterns define how data is stored, replicated, and read in a distributed system. Three main types:

---

## Strong consistency

- After a write, **every** subsequent read sees that write immediately.
- Implemented via **synchronous** replication: all replicas updated before the write is acknowledged.
- **Use when:** Correctness is critical (e.g. balance, inventory). Higher latency and lower availability under partition.

---

## Eventual consistency

- After a write, reads **eventually** see it. Replication is **asynchronous**; replicas converge over time.
- A form of weak consistency with a guarantee that state will converge.
- **Use when:** You can tolerate temporary staleness (e.g. likes, views, non-critical counters).

---

## Weak consistency

- After a write, there is **no guarantee** that the next read will see it. Reads may or may not reflect the latest write.
- **Use when:** Order and immediacy are not required (e.g. best-effort metrics, non-critical caches).

---

**Trade-off:** Strong consistency simplifies reasoning but costs latency and availability; eventual and weak improve availability and performance at the cost of temporary inconsistency.
