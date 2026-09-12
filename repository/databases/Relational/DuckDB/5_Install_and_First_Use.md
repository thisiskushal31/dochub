# Install and first use

[← DuckDB](./README.md)

## CLI

```bash
# macOS
brew install duckdb

duckdb
```

```sql
SELECT 1 + 1;
.quit
```

Persistent file:

```bash
duckdb local.duckdb
```

```sql
CREATE TABLE t AS SELECT * FROM read_csv_auto('tiny.csv');
SELECT count(*) FROM t;
```

## Python

```bash
pip install duckdb
```

```python
import duckdb
print(duckdb.sql("SELECT 42 AS x").fetchall())
```

## First real query (Parquet)

Point at a file **you** own (lake path, or a local export):

```sql
SELECT count(*) FROM read_parquet('events.parquet');

EXPLAIN SELECT date_trunc('day', ts), count(*)
FROM read_parquet('events.parquet')
GROUP BY 1;
```

You should see a scan that names columns, not a black box.

## Not Spark

If `EXPLAIN` is fine and the machine is swapping for an hour, the dataset does not fit this engine’s job. Next: [Spark](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark).

## Checklist

- [ ] CLI or Python can run `SELECT 1`
- [ ] One query against a CSV or Parquet **you** have
- [ ] `EXPLAIN` on that query
- [ ] Engine depth continues in this folder; pipeline placement: [DE Systems/DuckDB](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/README.md)

## Further reading

- [Installation](https://duckdb.org/docs/installation/)
