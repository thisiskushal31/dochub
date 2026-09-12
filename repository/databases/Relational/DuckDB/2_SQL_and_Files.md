# SQL and files

[← DuckDB](./README.md)

DuckDB’s distinctive SQL is not a new language. It is **SQL that treats files and other engines as tables**.

## Relations from files

```sql
-- Infer schema; good for exploration
SELECT * FROM read_csv_auto('events.csv') LIMIT 20;

-- Columnar lake files (preferred for repeated work)
SELECT date_trunc('day', ts) AS d, count(*)
FROM read_parquet('s3://bucket/events/*.parquet')
GROUP BY 1
ORDER BY 1;

-- Glob
SELECT * FROM 'data/*.parquet';
```

Filters and column lists should be **pushed into** the scan. Write `SELECT col_a, col_b FROM read_parquet(...) WHERE date = '2026-01-01'` rather than `SELECT *` into a giant Python frame. `EXPLAIN` should show projection/filter pushdown into Parquet.

## Persistent tables vs views over files

```sql
-- Owned storage (ACID on this file)
CREATE TABLE dim_user AS SELECT * FROM read_parquet('users.parquet');

-- No copy: re-read files every query (fresh, slower if remote)
CREATE VIEW v_events AS SELECT * FROM read_parquet('events/*.parquet');
```

Use a **table** when you will query the same data many times or you need DuckDB indexes/constraints on *your* copy. Use a **view over files** when the lake is the source of truth and you are sampling or joining a slice.

`COPY tbl TO 'out.parquet' (FORMAT PARQUET);` is the way out.

## Attach and scan other databases

```sql
INSTALL postgres; LOAD postgres;
ATTACH 'dbname=app host=localhost' AS pg (TYPE POSTGRES);
SELECT * FROM pg.public.orders LIMIT 5;
```

Similar scanners exist for MySQL, SQLite, and others. This is **federation for analytics**, not a replacement for the source OLTP engine. Do not point a production app’s writes at DuckDB and expect Postgres concurrency.

## Types that show up in analytics

| Kind | Examples |
|------|----------|
| Numeric | `INTEGER`, `BIGINT`, `HUGEINT`, `DOUBLE`, `DECIMAL` |
| Temporal | `DATE`, `TIMESTAMP`, `TIMESTAMPTZ`, `INTERVAL` |
| Nested | `STRUCT`, `LIST`, `MAP` |
| Semi-structured | `JSON` |
| Binary / text | `VARCHAR`, `BLOB`, `UUID` |

Cast early (`ts::TIMESTAMP`) so joins and truncations do not silently go through strings.

## Joins and window functions

Same SQL you use in a warehouse: hash joins, `GROUP BY`, `OVER (PARTITION BY … ORDER BY …)`. DuckDB will parallelize on one host. If a join key is skewed, you feel it as memory pressure / spill, not as a YARN queue.

## Python / R as the shell

```python
import duckdb
con = duckdb.connect("local.duckdb")  # or duckdb.connect() for memory
con.sql("SELECT count(*) FROM read_parquet('events.parquet')").show()
df = con.sql("SELECT * FROM events WHERE dt = '2026-01-01'").df()
```

Register a Pandas/Polars frame as a relation when the data is already in memory. Do **not** round-trip a 20 GB frame through Pandas to “use DuckDB”; scan Parquet instead.

## Further reading

- [Data ingestion](https://duckdb.org/docs/data/overview)
- [SQL introduction](https://duckdb.org/docs/sql/introduction)
