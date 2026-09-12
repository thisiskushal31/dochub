# DuckDB — deep dive

[← Relational folder](../README.md)

**DuckDB is an in-process analytical (OLAP) SQL database.** Same *shape* as SQLite (library inside your process, optional single file on disk), different *job*: columnar storage, vectorized execution, SQL over Parquet/CSV/other engines. It is **not** a pipeline framework. Spark / Airflow stay in [Data-Engineering Systems](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems). A data engineer who only needs “when does a pipeline use this” starts at [Systems/DuckDB](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/README.md) and comes **here** for the engine.

Official docs: [https://duckdb.org/docs/](https://duckdb.org/docs/)

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Overview and architecture](./1_Overview_Architecture.md) | written |
| 2 | [SQL and files](./2_SQL_and_Files.md) | written |
| 3 | [Storage and performance](./3_Storage_and_Performance.md) | written |
| 4 | [Ops and when to use](./4_Ops_and_When_to_Use.md) | written |
| 5 | [Install and first use](./5_Install_and_First_Use.md) | written |

## Checklist before marking done (whole engine)

- [x] Topic files filled (no TBD)
- [x] Use cases tied to [10-type table](../../README.md#database-types--use-cases) (relational / embedded SQL; OLAP not OLTP)
- [x] Operational checklist in last ops topic
- [ ] Re-read after a DuckDB minor version bump (execution and extensions move)

## Sister

| Slice | Home |
|-------|------|
| Engine internals, SQL, files, when vs SQLite / Postgres | **This folder** |
| Local compute inside a pipeline (vs Spark) | [DE Systems/DuckDB](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/README.md) |
| GUI to browse a `.DuckDB` file | [Tooling Database-Clients](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Database-Clients) (DBeaver) |
| SQLite (embedded OLTP) | [Relational/sqlite](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/sqlite) |
