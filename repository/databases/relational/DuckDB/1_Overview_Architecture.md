# Overview and architecture

[← DuckDB](./README.md)

DuckDB is a **relational** engine: tables, SQL, transactions on *its* files. It is built for **analytical** work (scan many rows, few columns, aggregations, joins) the way SQLite is built for **transactional** work (point lookups, many small writes). Both run **in-process**. There is no separate database server you connect to over the network unless you add one (MotherDuck, or you wrap DuckDB yourself).

## What “in-process” means

You link DuckDB as a library (C++, Python, R, Java, Node, Go, CLI). Queries run in **your** address space. That is why first-query latency is low and why “start Postgres, wait for listen, open a connection” is not the model.

| Property | DuckDB | PostgreSQL | SQLite |
|----------|--------|------------|--------|
| Process model | Library in the client | Server + client | Library in the client |
| Storage layout | Columnar | Row (heap) | Row (B-tree pages) |
| Sweet spot | OLAP, files, laptop/warehouse-adjacent | Concurrent OLTP + SQL | Embedded OLTP |
| Concurrent writers | Limited (one process owns the file) | Many clients | One writer |

Treat DuckDB like a **SQL execution engine you embed**, not like RDS.

## Execution engine (why it is fast on scans)

Three ideas, in order:

1. **Columnar tables** — values of one column sit together. Aggregating `sum(amount)` reads that column, not whole rows.
2. **Vectorized execution** — operators work on *batches* of values (vectors), not one tuple at a time. Better cache use, SIMD-friendly.
3. **Morsel-driven parallelism** — a query is split into small chunks of work (morsels) that threads steal. On one machine this scales with cores without a cluster scheduler.

There is a **cost-based optimizer** (join order, pushdown of filters/projections into scans, including into Parquet row groups). You still write SQL; you inspect plans with `EXPLAIN` / `EXPLAIN ANALYZE`.

## Memory and spill

DuckDB is happy to use RAM. Large sorts, hashes, and window functions **spill to disk** when they must. A laptop with a fast SSD can finish jobs that look “too big for memory” as long as the *working set* can spill; a multi-TB shuffle that Spark would spread across a cluster still does not belong here.

## SQL dialect

PostgreSQL-inspired: `SELECT`, CTEs, window functions, `UNPIVOT`, `QUALIFY`, nested types (`STRUCT`, `LIST`, `MAP`), `JSON`. Not a Postgres wire-protocol clone. Extensions add scanners (Postgres, MySQL, SQLite), `httpfs`, Iceberg, spatial, and more. Enable with `INSTALL` / `LOAD`.

## Mental model

```
Your process
  └─ DuckDB library
       ├─ SQL parser + optimizer
       ├─ Vectorized operators (scan, join, agg, window)
       ├─ Own storage (.duckdb file or in-memory)
       └─ Scanners: Parquet / CSV / JSON / other DBs / HTTP / object storage
```

The engine can run **with no DuckDB file at all**: `SELECT … FROM 's3://bucket/path/*.parquet'`. Persistence is optional. That is still a database engine — the catalog and types are DuckDB’s — not “a CSV parser with SQL syntax.”

## Further reading

- [DuckDB documentation](https://duckdb.org/docs/)
- [Why DuckDB](https://duckdb.org/why_duckdb) (official positioning)
