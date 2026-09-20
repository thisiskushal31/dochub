# 02 — Data model, types, and labels

[← Previous](./01_What_Is_Prometheus_And_When.md) · [README](./README.md) · [Next: Architecture →](./03_Architecture_Scrape_And_Pushgateway.md)

## 1. Concepts

Prometheus stores **time series**: streams of timestamped values that share the same **metric name** and the same **label set**. Queries can also invent temporary derived series (e.g. the output of `rate()`), but what you pay for in RAM/disk is primarily **stored** series.

**Staff confuse this constantly:** a “metric” in conversation is often many series.  
`http_requests_total` with 3 methods × 5 status classes × 20 pods = **300 series**, not one.

```text
api_http_requests_total{method="POST", handler="checkout", code="200", job="api", instance="10.0.1.4:8080"}
```

Change any label value (or add/remove a label) → **new series**. Empty label values are treated as if the label does not exist.

### Samples

Each sample is:

- a **float64** value (or a **native histogram** value on newer Prometheus), and  
- a **millisecond-precision** timestamp.

### Metric names (data-model rules)

| Rule | Why it matters |
|------|----------------|
| Name describes the **feature measured** | `http_requests_total`, not `data` |
| Prefer charset `[a-zA-Z_:][a-zA-Z0-9_:]*` | Best ecosystem/PromQL compatibility |
| **Colons (`:`) are reserved for recording rules** | Exporters and app instrumentation **SHOULD NOT** use `:` in names |
| Labels starting `__` are **internal** | Do not invent `__foo` in app metrics |

Prometheus v3 relaxed UTF-8 naming; quoting in PromQL exists, but stick to the recommended charset until your whole toolchain (Grafana, operators, clients) is known-good.

### Metric types (instrumentation)

| Type | What it means | How you query safely | Fleet SLO fit |
|------|---------------|----------------------|---------------|
| **Counter** | Only goes up (resets on restart) | `rate` / `increase` / `irate` — **never** alert on raw level | Request/error counts |
| **Gauge** | Point-in-time | raw or `*_over_time` | Queue depth, goroutines, ELU |
| **Histogram** | Buckets + `_sum` + `_count` | `histogram_quantile` after `sum by (le, …)` | **Preferred** for latency SLOs across instances |
| **Summary** | Client quantiles + `_sum`/`_count` | `_sum/_count` for mean; quantiles **do not merge** across instances | Avoid for multi-replica p99 |

Exposition on `/metrics` (text / OpenMetrics). Clients emit `# HELP` / `# TYPE`. Histogram series look like:

```text
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05",method="GET"} 120
http_request_duration_seconds_bucket{le="0.1",method="GET"} 340
http_request_duration_seconds_bucket{le="+Inf",method="GET"} 400
http_request_duration_seconds_sum{method="GET"} 42.5
http_request_duration_seconds_count{method="GET"} 400
```

Each `le` bucket is its own series—**bucket count × other labels × instances** = cardinality.

### Naming practices (official style guide)

Not required to run Prometheus, but this is what competent estates standardize on:

| Do | Example | Avoid |
|----|---------|--------|
| Domain prefix | `checkout_payments_total` | `total` |
| One unit, one quantity | `…_duration_seconds` | mixing ms and bytes in one metric |
| Base units | seconds, bytes; ratios **0–1** | milliseconds, megabytes, “percent 0–100” as default |
| Counter suffix `_total` | `http_requests_total` | `http_requests` as a counter without convention |
| Labels carry dimensions | `{method="GET"}` | `http_GET_requests_total` (label name baked into metric name) |
| Dimensions must stay meaningful under `sum`/`avg` | request counts by method | mixing “queue capacity” and “queue depth” as one metric |

**Why unit/type belong in the name:** most consumption is YAML (alerts, recordings, HPA). During an incident you read plain PromQL—not a schema popup. `process_cpu` as seconds vs milliseconds is a classic silent foot-gun.

### Labels — the dimensional model

Labels differentiate **instances of the same measurement**: method, handler class, status class, stage.

**Official caution (naming practices):** every unique key-value combination is a new series. Do **not** use unbounded sets—user IDs, emails, full URLs with IDs, session IDs.

| Safe (bounded) | Dangerous (unbounded) |
|----------------|------------------------|
| `job`, `instance`, `env`, `cluster` | `user_id`, `email` |
| `method`, `code_class` (`2xx`/`5xx`) | raw `path=/users/9781/orders/12` |
| `route_class=checkout` | `request_id` as a metric label |

**Disconfirm:** More labels ≠ more observability. Averaging Summary quantiles across pods ≠ global p99. “We’ll add `user_id` just for this debug” ≠ a reversible choice once TSDB has melted.

**Confirm:** Pick your hottest metric. Count approximate series (`label values × instances`). Which type backs **rate** vs **latency SLO**? Would `sum()` across all labels still mean something?

## 2. Advanced concepts

### Instrumentation labels vs target labels

| Source | Examples | Who sets them |
|--------|----------|---------------|
| App / client | `method`, `code`, `handler` | Developers |
| Scrape / SD / relabel | `job`, `instance`, `__address__` | Prometheus config / Operator |
| `external_labels` | `cluster`, `replica` | Platform (federation / remote write) |

Dig paths need stable joins with logs/traces (`service`, `env`, `trace_id` in logs—not as Prom labels). See parent [21](../21_Correlation_And_Dig_Methodology.md).

### Histogram bucket design

Bracket **SLO thresholds** (e.g. buckets including 0.1s / 0.25s / 0.5s if SLO is 300ms). Too many buckets × pods = cost. **Native histograms** (newer Prometheus) change the storage/query trade-off—adopt only with version + Grafana support checked.

### Stale markers

When a target disappears or a series stops appearing, Prometheus marks it **stale**. Graphs and alerts should not treat “last value forever” as truth—especially after deploys or scale-down.

### Build / info metrics

`*_build_info` gauges with `version`, `revision` (small enum) are fine. High-churn git SHAs on every metric are not.

### Cardinality incident anatomy

```text
Bad PR: path label with IDs
  → series ×1000 overnight
  → RAM / WAL pressure
  → slow queries + rule lag
  → missed pages during the outage you needed metrics for
```

Emergency brake: `metric_relabel_configs` drop ([04](./04_Configuration_Service_Discovery_And_Relabeling.md)); lasting fix: change instrumentation + label contract ([parent 7](../7_Cardinality_And_Label_Contracts.md)).

## 3. Applications and use cases

| Scenario | What to do |
|----------|------------|
| New HTTP service | Counter + histogram; labels `method`, `code_class`; no raw path |
| Multi-replica p99 SLO | Histogram + `histogram_quantile` (not Summary quantiles) |
| “We need per-user metrics” | Use logs/traces/events—or bounded `tenant` with a hard cap—not Prom labels per user |
| Node.js API | Same RED types **plus** event-loop gauges ([parent 35](../35_Runtime_And_Language_Specific_Signals.md)) |
| Recording rules | Use `:` in **recorded** names only ([07](./07_Recording_Rules_And_SLIs.md)) |

**Staff checklist**

- Written label allowlist / banlist; enforced with metric_relabel seatbelts  
- App metrics never contain `:` in the name  
- Counters `*_total`; latencies in **seconds**  
- Histograms for cross-instance latency SLOs  
- Top-series review after launches / Black Friday class events  

**Good:** `checkout_http_requests_total{method, code_class, route_class}` + matching duration histogram.  
**Bad:** `http_requests{user=…, path=…}` on every request.

## References

- [Data model](https://prometheus.io/docs/concepts/data_model/)  
- [Metric types](https://prometheus.io/docs/concepts/metric_types/)  
- [Metric and label naming](https://prometheus.io/docs/practices/naming/)  
- [Histograms and summaries](https://prometheus.io/docs/practices/histograms/)  
- [Parent 6](../6_Metric_Types_And_Aggregation.md) · [Parent 7](../7_Cardinality_And_Label_Contracts.md)
