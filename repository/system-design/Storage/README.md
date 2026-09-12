# Storage

Indexing, partitioning, durability, and OLTP vs OLAP.

## Topics

| Topic | File |
|--------|------|
| Indexing (dense, sparse, B-tree, secondary) | [1_Indexing.md](1_Indexing.md) |
| Partitioning (horizontal, vertical) | [2_Partitioning.md](2_Partitioning.md) |
| WAL and durability (checkpoints, backups, PITR) | [3_WAL_and_Durability.md](3_WAL_and_Durability.md) |
| OLTP vs OLAP | [4_OLTP_vs_OLAP.md](4_OLTP_vs_OLAP.md) |
| Materialized views | [5_Materialized_Views.md](5_Materialized_Views.md) |

## Quick reference

- **Indexes** — Trade write cost and space for read speed; choose dense vs sparse and match to access patterns.
- **Partitioning** — Split by key (sharding) or by columns (vertical); plan rebalancing and locality.
- **WAL** — Sequential log for durability and recovery; combine with checkpoints and backups for RPO.
- **OLTP** — Transactional, low-latency, row-oriented. **OLAP** — Analytical, scan-heavy, often columnar.
- **Materialized views** — Precomputed query result stored like a table; refresh on schedule or events; good for heavy read/analytics.
