# Storage

Indexing, partitioning, durability, and OLTP vs OLAP.

## Topics

| Topic | File |
|--------|------|
| Indexing (dense, sparse, B-tree, secondary) | [1-indexing.md](1-indexing.md) |
| Partitioning (horizontal, vertical) | [2-partitioning.md](2-partitioning.md) |
| WAL and durability (checkpoints, backups, PITR) | [3-wal-and-durability.md](3-wal-and-durability.md) |
| OLTP vs OLAP | [4-oltp-vs-olap.md](4-oltp-vs-olap.md) |
| Materialized views | [5-materialized-views.md](5-materialized-views.md) |

## Quick reference

- **Indexes** — Trade write cost and space for read speed; choose dense vs sparse and match to access patterns.
- **Partitioning** — Split by key (sharding) or by columns (vertical); plan rebalancing and locality.
- **WAL** — Sequential log for durability and recovery; combine with checkpoints and backups for RPO.
- **OLTP** — Transactional, low-latency, row-oriented. **OLAP** — Analytical, scan-heavy, often columnar.
- **Materialized views** — Precomputed query result stored like a table; refresh on schedule or events; good for heavy read/analytics.
