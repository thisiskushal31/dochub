# OLTP vs OLAP

## OLTP (Online Transaction Processing)

- **Focus:** High-volume **transactions**: short reads and writes, many concurrent users, strong consistency where needed.
- **Access pattern:** Point lookups, small range scans, index-heavy, low latency per operation.
- **Schema:** Normalized; avoid redundancy; enforce integrity.
- **Examples:** Order entry, banking, inventory, user-facing apps.

## OLAP (Online Analytical Processing)

- **Focus:** **Analytics**: large scans, aggregations, reporting, dashboards. Fewer concurrent queries but each can be heavy.
- **Access pattern:** Full or large range scans, GROUP BY, JOINs across many rows, batch jobs.
- **Schema:** Often denormalized, star/snowflake; columnar storage is common for compression and scan speed.
- **Examples:** Data warehouses, reporting, BI, ML feature pipelines.

## Trade-offs

| | OLTP | OLAP |
|---|------|------|
| Latency | Low per tx | Higher per query |
| Throughput | Many small ops | Fewer, larger ops |
| Storage layout | Row-oriented common | Columnar common |
| Consistency | Strong often required | Eventually consistent or batch OK |

**Use case:** Use OLTP for the system of record and real-time APIs; replicate or ETL into an OLAP store for analytics so heavy queries don’t impact transactions. See [Partitioning](2-partitioning.md) and [Indexing](1-indexing.md) for tuning each.
