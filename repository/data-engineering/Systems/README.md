# Systems

[← README](../README.md) · [Use cases](../Use-Cases/README.md)

One folder per **named system** — same idea as [DevOps-Handbook/Languages](../../DevOps-Handbook/Languages/README.md) (one folder per language).

Layers (`Capture/`, `Movement/`, …) are the **jobs**. This directory is the **catalog of engines/frameworks** that implement those jobs. A new Spark, a new bus, a new scheduler: **add a folder here**. Do not add a new top-level layer.

Each system track: what it is → model/guarantees → operations → **use cases**.

## How to place a system

| If it is mainly… | Primary layer | Folder lives in |
|------------------|---------------|-----------------|
| How facts enter | Capture | `Systems/<Name>/` with primary Capture |
| A log, queue, or bus | Movement | `Systems/Kafka` etc. |
| How records are computed | Transformation | `Systems/Spark` etc. |
| How runs are scheduled | Orchestration | `Systems/Airflow` etc. |
| Table-on-files / lake table | Storage | `Systems/Iceberg` etc. |
| A database engine | — | **Not here** → Databases-Deep-Dive |

A system that plays two roles (Kafka is a log *and* has Connect) keeps **one folder**. Secondary roles are topic files + pointers from the other layer README.

*(Content TBD — stub created September 2026)*

## Catalog

### Capture

| System | What job it implements |
|--------|------------------------|
| [Debezium](./Debezium/README.md) | Log-based change data |
| [Airbyte](./Airbyte/README.md) | Extractor / connector runtime |

### Movement

| System | What job it implements |
|--------|------------------------|
| [Kafka](./Kafka/README.md) | Durable partitioned log; Connect = capture role; streams = transform on the log |
| [Pulsar](./Pulsar/README.md) | Log + queue; Storage/compute split |
| [NATS](./NATS/README.md) | Lightweight messaging; optional durability |
| [Kinesis](./Kinesis/README.md) | Managed partitioned log |
| [PubSub](./PubSub/README.md) | Managed push/pull bus |

### Transformation

| System | What job it implements |
|--------|------------------------|
| [Spark](./Spark/README.md) | Distributed compute; bounded and unbounded jobs |
| [Flink](./Flink/README.md) | Stateful unbounded compute |
| [Beam](./Beam/README.md) | Portable pipeline model; runners are instances |
| [dbt](./dbt/README.md) | Declarative SQL in the warehouse |
| [Dataform](./Dataform/README.md) | Declarative SQL in the warehouse (same class as dbt) |

### Database engines (not owned here)

| Engine | This folder | Full notes |
|--------|-------------|------------|
| DuckDB | [DuckDB/](./DuckDB/README.md) — pipeline placement only | [https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb) |

### Serving

| System | What job it implements |
|--------|------------------------|
| [Trino](./Trino/README.md) | Federated SQL over lakes/warehouses |

### Orchestration

| System | What job it implements |
|--------|------------------------|
| [Airflow](./Airflow/README.md) | Time and dependency scheduler |
| [Dagster](./Dagster/README.md) | Asset-oriented orchestration |
| [Prefect](./Prefect/README.md) | Flow orchestration |

### Storage

| System | What job it implements |
|--------|------------------------|
| [Iceberg](./Iceberg/README.md) | Table-on-files |
| [Delta](./Delta/README.md) | Table-on-files |
| [Hudi](./Hudi/README.md) | Table-on-files (upsert-oriented) |

## Adding a new system later

1. Create `Systems/<Name>/` with README + topic stubs (what / model / ops / use cases).
2. Set **primary layer** in that README.
3. Link it from that layer’s README table.
4. Add a row here. Do **not** create `Spark-2/` as a layer.
