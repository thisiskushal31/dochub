# Ops and when to use

[← DuckDB](./README.md)

## Operational checklist

- [ ] One process owns a given `.DuckDB` file (no multi-writer cluster fantasy)
- [ ] Memory limit set in shared environments (CI, notebooks on a shared box)
- [ ] Temp/spill directory on fast local disk, not a tiny container overlay
- [ ] Extensions pinned (`INSTALL` version story) if you depend on Iceberg / `httpfs` / Postgres scanner
- [ ] Backup = file copy or `EXPORT DATABASE` when idle
- [ ] Secrets for S3/GCS never committed; use env / a secret store
- [ ] Do not expose DuckDB as the primary store for a multi-user OLTP app

## When DuckDB is the right engine

- Interactive SQL on a laptop or in CI against Parquet/CSV/JSON
- Join a slice of a lake with a small dimension table
- Unit/integration tests that need real SQL without standing up Postgres
- “Warehouse SQL” locally before you pay for a cluster
- Embedded analytics inside an app **you** run (single writer)

## When it is the wrong engine

| You need | Use instead |
|----------|-------------|
| Many concurrent writers / app OLTP | PostgreSQL / MySQL — [Relational/postgresql](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/postgresql) |
| Tiny embedded OLTP, mobile, single-row updates | SQLite — [Relational/sqlite](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/sqlite) |
| Shuffle/compute that does not fit one machine | Spark — [DE Systems/Spark](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Systems/Spark) |
| Shared always-on warehouse with governance | Warehouse / lakehouse (BigQuery, Snowflake, Iceberg+engine) — DE `Systems/` + this repo’s cloud-managed notes |
| Sub-ms cache | Redis — [Key-Value/redis](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Key-Value/redis) |

## vs SQLite (same process model, different type of work)

SQLite: row pages, great at `UPDATE … WHERE id`. DuckDB: columns, great at `GROUP BY date`. Putting an analytics scan in SQLite, or a shopping-cart write path in DuckDB, fights the storage layout.

## vs Spark (same SQL-shaped job, different runtime)

Spark is a **cluster compute** system. DuckDB is a **database engine** that can *also* scan lake files. If the data and CPU fit one host, DuckDB is simpler (no executors, no shuffle service). If they do not, Spark (or a warehouse) is the job. Detail for pipeline authors: [DE Systems/DuckDB](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/1_In_A_Pipeline.md).

## Hosted

[MotherDuck](https://motherduck.com/) is a cloud service around DuckDB (hybrid: local + cloud). Treat SKUs as instances; the engine notes stay this folder.

## Further reading

- [DuckDB docs](https://duckdb.org/docs/)
- Pipeline pointer: [https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/README.md](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/blob/main/Systems/DuckDB/README.md)
