# Storage and performance

[← DuckDB](./README.md)

## The `.DuckDB` file

Optional. Format is DuckDB’s own (columnar, compressed). One writer process at a time on a given file. Copy the file to snapshot; do not treat NFS + many writers as a cluster.

In-memory: `duckdb.connect()` with no path. Process exit loses it unless you `COPY` out.

WAL / checkpoints exist so a crash does not always trash a persistent file. Backup = copy the file when idle, or `EXPORT DATABASE`.

## Compression and encodings

Columns use encodings (RLE, dictionary, bitpacking, and friends). Low-cardinality strings and sorted timestamps compress well. That is why a DuckDB table can be smaller than the same data as CSV, and why repeating `user_id` in a fact table is cheaper than it looks.

## Indexes

DuckDB is not an OLTP B-tree shop. **ART indexes** (and similar) help point lookups and some joins; the default access path for analytics is still **scan + pushdown**. If your workload is `SELECT * FROM t WHERE id = ?` in a hot API, you wanted SQLite or Postgres.

## `EXPLAIN` / `EXPLAIN ANALYZE`

Read the plan before you scale hardware:

- Seq scan vs filter pushdown into Parquet
- Join order (build vs probe side)
- Estimated vs actual rows (`ANALYZE`)
- Spool / spill

```sql
EXPLAIN ANALYZE
SELECT u.country, sum(o.amount)
FROM orders o
JOIN users u ON o.user_id = u.id
GROUP BY 1;
```

## Practical knobs

| Goal | What to try |
|------|-------------|
| Use cores | Default parallelism; set threads if you share a box |
| Less RAM | Narrower `SELECT` list; filter before join; spill is OK; do not `SELECT *` |
| Faster remote Parquet | Column names + partition predicates that match layout (`dt=`, hive-style paths) |
| Repeat queries | `CREATE TABLE AS` into a local `.DuckDB` instead of re-reading S3 |
| Reproducible files | `COPY` to Parquet with an explicit codec; pin extension versions |

`PRAGMA` / settings (threads, memory limit, temp directory) live in the [configuration docs](https://duckdb.org/docs/sql/pragmas). Set a **memory limit** in CI so a bad join cannot OOM the runner.

## Object storage

`httpfs` (and cloud-specific helpers) let you `read_parquet('s3://…')`. Auth is environment/credentials, not DuckDB-as-IAM. Latency and list-of-files cost dominate; a thousand tiny Parquet files will hurt more than one medium file. That is a **file layout** problem, not a reason to jump to Spark at 2 GB.

## Further reading

- [Storage](https://duckdb.org/docs/stable/sql/statements/create_table.html) and [performance guide](https://duckdb.org/docs/guides/performance/overview)
