# Materialized Views

## What they are

A **materialized view** is a **stored result set** of a query (e.g. join, aggregation) that is **physically stored** like a table. Reads hit this precomputed result instead of running the full query each time. The view is **refreshed** periodically or on demand (not necessarily real-time).

## Why we need them

- **Expensive queries** — Complex joins or aggregates are computed once (or on a schedule) and then read quickly.
- **Reporting and analytics** — Dashboards and reports can read from materialized views instead of stressing the transactional database.
- **Read scaling** — Offload heavy read patterns to a dedicated structure; keep the main tables optimized for writes and simple reads.

## How they work

1. Define a **query** (the view definition) that produces the desired result set.
2. The database **computes** the result and **stores** it (materialized).
3. **Refreshes** — Full refresh (recompute entire view) or incremental (only changed data). Schedule or trigger-based.
4. Applications **query the materialized view** like a table; no recomputation at read time.

## Trade-offs

- **Advantages:** Much faster reads for complex queries; clear separation between write path and heavy read path.
- **Disadvantages:** **Staleness** until refresh; extra storage and refresh cost; need a refresh strategy (schedule, events, or on-demand).

## When to use

Use materialized views when you have **read-heavy**, **complex** queries (joins, aggregates) and can tolerate **eventual freshness**. Combine with [Denormalization](../databases/10-denormalization.md) and [CQRS](../patterns/2-cqrs.md) (read models) for event-driven or reporting workloads. See [Indexing](1-indexing.md) and [OLTP vs OLAP](4-oltp-vs-olap.md).
