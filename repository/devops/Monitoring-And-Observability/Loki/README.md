# Loki (Grafana Loki)

[← Back to Monitoring & observability](../README.md) · [Grafana](../Grafana/README.md) · [Mimir](../Mimir/README.md) · [Tempo](../Tempo/README.md) · [Structured logging](../16_Structured_Logging.md)

**Loki** is Grafana’s **log aggregation** system. It indexes **labels** (Prometheus-style streams), stores compressed **chunks** in object storage, and searches line content at query time—not a full Elasticsearch-style inverted index of every token by default.

```text
Apps / nodes ──► Alloy (or Promtail) ──► Loki ──► Grafana Explore (LogQL)
                      shared labels with Mimir / Tempo
```

| | |
|--|--|
| **What for** | Cheap, label-oriented logs beside Prom/Mimir |
| **When** | LGTM / Grafana Cloud; K8s logs; correlate via labels + `trace_id` |
| **Why not** | Primary need is heavy full-text / SIEM search → [Elastic](../Elastic/README.md) |

**Disconfirm:** Loki ≠ Elasticsearch. High-cardinality **labels** (user/trace/order IDs) ≠ “more power”—they melt the index. Structured logging in the app is still required ([16](../16_Structured_Logging.md)).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Loki_And_When.md)–[02](./02_Streams_Labels_And_Cardinality.md) | Fit; label budget |
| Query & ship | [03](./03_LogQL_Essentials.md)–[04](./04_Shippers_Alloy_And_Pipeline.md) | LogQL; Alloy |
| Ops | [05](./05_Multi_Tenant_Retention_And_Ops.md)–[06](./06_Worked_Example_Logs_In_Grafana.md) | Tenants; end-to-end |

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Loki and when](./01_What_Is_Loki_And_When.md) | Index vs chunks; vs Elastic |
| 02 | [Streams, labels, cardinality](./02_Streams_Labels_And_Cardinality.md) | Official label BP; structured metadata |
| 03 | [LogQL essentials](./03_LogQL_Essentials.md) | Selectors, filters, metric queries |
| 04 | [Shippers — Alloy and pipeline](./04_Shippers_Alloy_And_Pipeline.md) | Agents; processing |
| 05 | [Multi-tenant, retention, ops](./05_Multi_Tenant_Retention_And_Ops.md) | Object store; limits |
| 06 | [Worked example](./06_Worked_Example_Logs_In_Grafana.md) | Alloy → Loki → Explore |

## References

- [Loki docs](https://grafana.com/docs/loki/latest/) · [LogQL](https://grafana.com/docs/loki/latest/query/) · [Labels](https://grafana.com/docs/loki/latest/get-started/labels/)  
