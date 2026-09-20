# 03 — LogQL essentials

[← Previous](./02_Streams_Labels_And_Cardinality.md) · [README](./README.md) · [Next →](./04_Shippers_Alloy_And_Pipeline.md)

## 1. Concepts

**LogQL** = stream selector + optional pipeline.

```logql
{app="checkout", env="prod"} |= "error" | json | status_code >= 500
```

| Piece | Role |
|-------|------|
| `{labels}` | Narrow streams (cheap via index) |
| `|=` `!=` `|~` `!~` | Line filters |
| `| json` / `| logfmt` / `| regexp` | Parse → “schema at query” |
| Metric queries | `rate`, `count_over_time`, … from logs |

Two query kinds: **log queries** (lines) and **metric queries** (numbers for graphs/alerts). Prefer **Mimir/Prom metrics** for SLOs; use log metrics sparingly ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

**Disconfirm:** Unbounded `{job=~".+"}` then heavy parse ≠ a production Explore habit.

**Confirm:** Write a query that finds 5xx for one service, then extracts `trace_id`.

## 2. Advanced

Metric LogQL for spike detection; alert carefully (cardinality of `sum by`). Jump to Tempo via derived fields in Grafana ([Grafana/05](../Grafana/05_Datasources_Explore_And_Correlation.md)).

## 3. Applications

**Staff checklist:** on-call LogQL cheatsheet; no Explore queries that select all streams.

## References

- [Query Loki / LogQL](https://grafana.com/docs/loki/latest/query/)  
- [04 Shippers](./04_Shippers_Alloy_And_Pipeline.md)
