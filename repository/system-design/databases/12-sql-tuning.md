# SQL Query Optimization and Tuning

## What it is

**SQL tuning** (or **query optimization**) is improving the **performance** of database queries by changing the query, schema, or environment so that reads and writes are faster and use fewer resources (CPU, I/O, locks).

## Why we need it

- **Slow queries** — Long-running or heavy queries increase latency and can block other work.
- **Scaling** — As data and concurrency grow, poorly tuned queries become the bottleneck.
- **Cost** — Reducing unnecessary I/O and CPU lowers cost and allows the same hardware to serve more load.

## Common techniques

| Area | Examples |
|------|----------|
| **Indexes** | Add or adjust indexes so filters, joins, and sorts use index access instead of full scans. Avoid over-indexing (writes get heavier). See [Indexing](../storage/1-indexing.md). |
| **Query shape** | Avoid SELECT \*; filter and project only needed columns; use EXISTS instead of IN when appropriate; limit result sets. |
| **Joins** | Prefer joins that use indexed columns; avoid unnecessary joins; consider denormalization or materialized views for heavy read patterns. See [Denormalization](10-denormalization.md). |
| **Transactions** | Keep transactions short; avoid long-running locks; use the right isolation level. |
| **Schema** | Partition or shard large tables; archive old data; choose types and constraints that match access patterns. See [Partitioning](../storage/2-partitioning.md), [Sharding](4-database-sharding.md). |
| **Configuration** | Tune buffer sizes, connection pools, and planner settings (e.g. statistics, cost parameters) for your workload. |

## Observability

- Use **query plans** (EXPLAIN / EXPLAIN ANALYZE) to see how the database executes queries and where time is spent.
- **Monitor** slow queries, lock waits, and resource usage to find the next candidate for tuning.

**When to use:** Apply tuning when queries or the database are a proven bottleneck; measure before and after. Combine with indexing, denormalization, caching, and scaling (replication, sharding) as needed. See [Database design overview](1-database-design-overview.md) and [Performance antipatterns](../performance/1-performance-antipatterns.md).
