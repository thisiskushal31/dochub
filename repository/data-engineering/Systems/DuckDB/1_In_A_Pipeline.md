# DuckDB in a pipeline

[← DuckDB](./README.md)

Engine internals are **not** copied here. Read them in the database repo:

- Overview: [https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/1_Overview_Architecture.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/1_Overview_Architecture.md)
- SQL over files: [https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/2_SQL_and_Files.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/2_SQL_and_Files.md)
- Performance: [https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/3_Storage_and_Performance.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/3_Storage_and_Performance.md)
- When vs SQLite / Postgres / Spark: [https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/4_Ops_and_When_to_Use.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/4_Ops_and_When_to_Use.md)
- Install: [https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/5_Install_and_First_Use.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/5_Install_and_First_Use.md)

Folder: [https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb)

---

## What this file owns

A **fact** still moves through Capture → Movement → Transformation → Storage. DuckDB is one way to **run SQL in Transformation on a single machine** (or in CI). It does not replace Kafka, Iceberg, or Airflow.

## Patterns that belong in a DE job

| Pattern | Why DuckDB | Why not |
|---------|------------|---------|
| CI test: “this SQL still matches a fixture Parquet” | Real SQL, no cluster | — |
| Developer laptop: profile a partition before writing Spark | Seconds, not a YARN queue | Do not ship the laptop as prod compute |
| Small bounded transform (fits one host) | `read_parquet` → `COPY` back | Multi-TB shuffle |
| Join lake facts to a tiny dimension | In-process hash join | Dimension is a 2 TB slowly changing monster |
| Airflow / Dagster operator that shells out to `DuckDB` | Cheap worker | Worker OOM — set memory limits (see engine ops) |

## Patterns that do not

- Treating DuckDB as the **system of record** for an app (writers, HA, authn). That is Postgres. [https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/postgresql](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/postgresql)
- Replacing **Spark** because “SQL is SQL.” Spark is distributed compute: [https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark)
- Replacing **Iceberg** as the table format. DuckDB can *scan* Iceberg; the catalog/table contract still lives in [Systems/Iceberg](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Iceberg)

## Sketch (bounded job)

```text
object store / Iceberg snapshot
        │
        ▼
  DuckDB in a worker  (read_parquet / iceberg scanner)
        │
        ▼
  COPY to Parquet / INSERT into warehouse
        │
        ▼
  Airflow marks the run
```

If the worker cannot finish with spill + one host, the **same SQL** moves to Spark or a warehouse. The *job* (Transformation) did not change.

## Sister GitHub URLs

| What | URL |
|------|-----|
| DuckDB engine | [https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb) |
| Spark | [https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark) |
| Transformation layer | [https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Transformation](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Transformation) |
| Databases home | [https://github.com/thisiskushal31/Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |
