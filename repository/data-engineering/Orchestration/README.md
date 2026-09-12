# Orchestration

[← README](../README.md)

*(Stub — fill this layer when you write it.)*

Time, dependency, retries, backfill. A scheduler product is an instance of this class.

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Dependency and time](./1_Dependency_And_Time.md) | stub |
| 2 | [Idempotency, backfill, replay](./2_Idempotency_Backfill_Replay.md) | stub |
| 3 | [Schedulers as a class](./3_Schedulers_As_A_Class.md) | stub |

## Systems that implement this layer

| System | Role here |
|--------|-----------|
| [Airflow](../Systems/Airflow/README.md) | Time + dependency scheduler |
| [Dagster](../Systems/Dagster/README.md) | Asset-oriented orchestration |
| [Prefect](../Systems/Prefect/README.md) | Flow orchestration |

## Checklist before marking done (whole section)

- [ ] All topic files filled (no TBD)
- [ ] Examples of current tools are dated and replaceable
