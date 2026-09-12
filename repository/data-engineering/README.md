# Data Engineering Deep Dive

Home for **how a fact becomes a trustworthy table**. Two axes:

1. **Layers** — jobs (capture, move, transform, …) that outlive any engine
2. **[`Systems/`](./Systems/README.md)** — one folder per named engine (Spark, Kafka, Flink, Airflow, dbt, Iceberg, …), same idea as one folder per language in [DevOps-Handbook/Languages](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Languages)

A new engine is a new `Systems/<Name>/`. It is not a new layer. Postgres *internals* stay in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). Learning / retrieval jobs stay in [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive). When a design needs a log, the *choice* is in [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts); Kafka the engine is here.

New here? Start at [Foundations](./Foundations/README.md), then open [Systems](./Systems/README.md) for Kafka and Spark.

## Layers (path of a fact)

| # | Section | Job |
|---|------|-----|
| 1 | [Foundations/](./Foundations/README.md) | Contracts, grain, time, quality, bounded vs unbounded |
| 2 | [Capture/](./Capture/README.md) | How facts enter |
| 3 | [Movement/](./Movement/README.md) | Buffers, replay, backpressure |
| 4 | [Transformation/](./Transformation/README.md) | Change shape and meaning |
| 5 | [Storage/](./Storage/README.md) | Roles of stores |
| 6 | [Orchestration/](./Orchestration/README.md) | Time, dependency, idempotency |
| 7 | [Serving/](./Serving/README.md) | Read models, semantic access, activation |
| 8 | [Governance/](./Governance/README.md) | Privacy, access, cost |
| 9 | [Platform-Ops/](./Platform-Ops/README.md) | SLAs, failure, provisioning |

## Systems and use cases

| Folder | Job |
|--------|-----|
| [Systems/](./Systems/README.md) | Spark, Kafka, Flink, Airflow, dbt, Iceberg, … — one directory each |
| [Use-Cases/](./Use-Cases/README.md) | CDC path, unbounded path, feature path, replay — not vendor stories |
| [Instances/](./Instances/README.md) | Dated index of names → layer + system folder |
| [Assets/](./Assets/README.md) | Diagrams |

Example: Spark is `Systems/Spark/` (bounded jobs, unbounded jobs, SQL, ops, use cases). Its *job* is Transformation. Kafka is `Systems/Kafka/` (log). Neither is a layer.

## Sister repos

- [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) — engines (warehouse, OLTP, vector)
- [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive) — learning / retrieval
- [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts)
- [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook)
