# DuckDB (pipeline placement)

[← Systems](../README.md)

**DuckDB is a database engine, not a transformation framework.** The full write-up lives in Databases-Deep-Dive. This folder only answers: *when does a data pipeline use it?*

**Engine (architecture, SQL, storage, ops, install):**  
[https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb)

Start at the README:  
[https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/README.md](https://github.com/thisiskushal31/Databases-Deep-Dive/blob/main/Relational/DuckDB/README.md)

| DE question | File |
|-------------|------|
| When to embed DuckDB in a job vs Spark / a warehouse | [1_In_A_Pipeline.md](./1_In_A_Pipeline.md) |

**Primary layer (as a *use*, not as ownership):** [Transformation](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive/tree/main/Transformation) — local SQL compute. Storage of the lake still [Iceberg](./Iceberg/README.md) / object store; orchestration still [Airflow](./Airflow/README.md).
