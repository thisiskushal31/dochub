# Loki (Grafana Loki)

[← Back to Observability](../README.md) · [Grafana](../Grafana/README.md) · [Logging concepts](../2_Logging_And_Tracing.md) · [Elastic](../Elastic/README.md) · [Tools index](../3_Observability_Tools.md)

## 1. Concepts

**Loki** is a **log aggregation** system from the Grafana ecosystem. It indexes **labels** (like Prometheus) rather than full-text indexing every line by default—cheap to store, query by stream labels + filter.

**Plain language:** A warehouse for logs that works like metrics tags: `job=api`, `namespace=prod`, then search lines inside those streams.

Pairs with [Grafana](../Grafana/README.md) for explore/dashboards and [Prometheus](../Prometheus/README.md) for metrics correlation. Trace jump targets: [Tempo](../Tempo/README.md).

**What for:** Cheap, label-oriented logs beside Prometheus.  
**When:** Grafana stack; K8s logs; correlate with metrics via shared labels.  
**Why not:** Need heavy full-text / security search as primary → [Elastic](../Elastic/README.md); SaaS-only estate → Datadog/New Relic logs.

**Disconfirm:** Loki is **not** Elasticsearch—different indexing/cost model. “We have Loki” is **not** structured logging by itself—you still emit useful fields.

**Confirm:** What do you index (labels) vs filter at query time?

## 2. Advanced concepts

| Piece | Job |
|-------|-----|
| Promtail / Alloy / agents | Ship logs to Loki |
| Label set | Keep cardinality low (no user_id as label) |
| LogQL | Query language |
| Retention / multi-tenancy | Ops cost controls |

High cardinality labels explode cost/memory—same lesson as Prometheus ([1](../1_Monitoring_And_Metrics.md)).

## 3. Applications

| Goal | Pattern |
|------|---------|
| K8s logs | Daemonset agent → Loki → Grafana Explore |
| Correlate | Same labels as metrics (`pod`, `app`); `trace_id` field for Tempo |
| Alert | Log-based rules sparingly; prefer metrics for SLOs |

**Staff checklist:** label budget; retention; PII redaction; don’t use Loki as a forever legal archive without policy.

## References

- [Grafana Loki docs](https://grafana.com/docs/loki/latest/)  
- [LogQL](https://grafana.com/docs/loki/latest/query/)  
- [Grafana](../Grafana/README.md) · [Elastic](../Elastic/README.md) · [2 Logging & tracing](../2_Logging_And_Tracing.md)  
