# Transformation

[← README](../README.md)

*(Stub — fill this layer when you write it.)*

Turning captured facts into useful tables or features. SQL vs jobs vs streaming operators are styles; engines rotate.

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Declarative vs procedural](./1_Declarative_Vs_Procedural.md) | stub |
| 2 | [Stateful computation](./2_Stateful_Computation.md) | stub |
| 3 | [Distributed compute patterns](./3_Distributed_Compute_Patterns.md) | stub |
| 4 | [Schema evolution](./4_Schema_Evolution.md) | stub |

## Systems that implement this layer

| System | Role here |
|--------|-----------|
| [Spark](../Systems/Spark/README.md) | Distributed compute (bounded + unbounded) |
| [Flink](../Systems/Flink/README.md) | Stateful unbounded compute |
| [Beam](../Systems/Beam/README.md) | Portable model; runners are instances |
| [dbt](../Systems/dbt/README.md) | Declarative SQL in the warehouse |
| [Dataform](../Systems/Dataform/README.md) | Same *class* as dbt |
| [Kafka](../Systems/Kafka/README.md) (Streams) | Transform *on a log* — primary folder is Movement |
| [DuckDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/Relational/duckdb) (pointer: [Systems/DuckDB](../Systems/DuckDB/README.md)) | Local SQL compute — **engine notes are not here** |

New engine: add `Systems/<Name>/`. Spark and Flink stay siblings under Systems, not layers.

## Checklist before marking done (whole section)

- [ ] All topic files filled (no TBD)
- [ ] Examples of current tools are dated and replaceable
