# 7 — Cardinality and label contracts

[← Previous](./6_Metric_Types_And_Aggregation.md) · [README](./README.md) · [Next →](./8_SLI_SLO_SLA_And_Error_Budgets.md)

## 1. Concepts — dimensions that can melt the stack

**Cardinality** is how many unique time series (or indexed field combinations) you create. Each unique label set on a metric name is usually a series. Unbounded labels (user ID, email, full URL, request ID) turn one metric into millions of series.

**Label contract** = the agreed, bounded dimensions teams may attach (e.g. `service`, `env`, `route_class`, `region`, `status_class`) plus an explicit ban list.

| Allowed (typical) | Banned (typical) |
|-------------------|------------------|
| service, team, env | user_id, email, raw URL |
| region, cluster | request_id, session_id as metric labels |
| route_class / method | unbounded `path` with IDs embedded |
| status_class (2xx/5xx) | full exception message as label |

```text
http_requests{service="checkout", env="prod", route_class="pay", code_class="5xx"}  ✓
http_requests{user="uuid-…", path="/u/uuid/orders/123"}  ✗  (explosion)
```

Logs and traces have related limits (index fields, attribute keys)—same discipline, different product knobs ([16](./16_Structured_Logging.md), [17](./17_Log_Planes_Retention_And_Volume.md)).

**Disconfirm:** “We’ll downsample later” does not undo scrape/memory pain today. High cardinality ≠ better observability; it often means worse query latency and lost retention.

**Confirm:** List every label on your hottest metric. Which are unbounded? Who approves new labels?

## 2. Advanced — detection, budgets, and migration

**Symptoms of explosion:** TSDB memory climb, slow queries, scrape timeouts, “series churn,” sudden bill spikes on hosted metrics.

**Budgets:** platform sets max series per service / scrape; CI checks metric inventories; recording rules aggregate fine routes into `route_class`.

**Relabel / drop:** drop forbidden labels at scrape or collect time; never rely on humans remembering.

**Histograms multiply cardinality** by bucket count—still usually better than summaries for aggregation, but budget buckets.

**Multi-tenant:** tenant ID as a label can be OK if tenant count is bounded and billed; unbounded SaaS tenant IDs need careful aggregation ([29](./29_Multi_Env_And_Multi_Tenant_Patterns.md)).

**Failure mode:** One “debug” label merged to prod scrape config → cluster-wide OOM risk.

## 3. Applications

**Staff checklist**

- Written label allowlist + banlist for metrics (and parallel for log index fields)  
- Platform enforcement (relabel/drop or admission check)  
- Hot metrics reviewed quarterly for churn  

**Exercise:** Query top series by count (or vendor cardinality UI). Kill or aggregate the worst offender.

## References

- [Prometheus best practices — naming and labels](https://prometheus.io/docs/practices/naming/)  
- [6 Metric types](./6_Metric_Types_And_Aggregation.md) · [30 FinOps](./30_Telemetry_Cost_And_FinOps.md)
