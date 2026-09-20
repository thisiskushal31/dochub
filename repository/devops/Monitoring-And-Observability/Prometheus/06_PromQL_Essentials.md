# 06 — PromQL essentials

[← Previous](./05_Exporters_And_Common_Targets.md) · [README](./README.md) · [Next: Recording rules →](./07_Recording_Rules_And_SLIs.md)

## 1. Concepts

**PromQL** is how you select and transform series. An **instant query** evaluates at one time; a **range query** repeats that evaluation across a time window (graphs). The language is the same—only the evaluation schedule differs.

**Staff confuse this constantly:**

| People say | What PromQL actually needs |
|------------|----------------------------|
| “CPU is high” | A **gauge** or rate derived from counters—not a counter level |
| “Error %” | Usually `sum(rate(errors)) / sum(rate(all))` — not `avg(ratio)` |
| “p99 latency” | `histogram_quantile` on **histogram buckets**, with `le` preserved |
| “Show http_requests_total” | May be **thousands** of series—filter first |

### Selectors

```promql
http_requests_total{job="api", code=~"5.."}
http_requests_total{job="api"}[5m]   # range vector — input to rate()
```

| Matcher | Meaning |
|---------|---------|
| `=` | Exact match |
| `!=` | Not equal |
| `=~` | Regex match |
| `!~` | Regex not match |

### The everyday toolkit

| Question | Shape | Notes |
|----------|-------|-------|
| Requests / sec | `sum by (job) (rate(http_requests_total[5m]))` | Counter → `rate` |
| Errors / sec | `sum by (job) (rate(http_requests_total{code=~"5.."}[5m]))` | Bound the code label |
| Error ratio | `A / B` where A,B are **sums of rates** | Never average ratios blindly |
| p99 latency | see below | Needs histogram |
| Is target alive? | `up{job="api"}` | `1`/`0` per scrape target |
| Saturation | gauges: memory available ratio, queue depth | Often ticket, not page |

**Latency quantile (classic histogram):**

```promql
histogram_quantile(
  0.99,
  sum by (le, job) (
    rate(http_request_duration_seconds_bucket{job="api"}[5m])
  )
)
```

You must **`sum` … `by (le, …)`** before `histogram_quantile`. Dropping `le` breaks the math.

### `rate` vs `irate` vs `increase`

| Function | Behavior | Use when |
|----------|----------|----------|
| `rate` | Per-second average over the range | Dashboards, SLOs, alerts (default choice) |
| `irate` | Rate from last two points | Spiky “what just happened” views—not stable SLOs |
| `increase` | Total increase over range | “How many errors in the last hour?” |

**Range length:** needs enough samples. With a 15s scrape, `[1m]` is thin; `[5m]` is a common default. Tune with eyes open—not cargo cult.

### Aggregation

`sum`, `avg`, `max`, `min`, `count`, `topk`, `bottomk` with `by (labels)` or `without (labels)`.

**Official-ish reliability habit from recording practices:** prefer `without (instance)` style when rolling up so you keep `job` and friends—and avoid silent collisions.

**Disconfirm:** Graphing a bare high-cardinality name in the UI ≠ safe (Prometheus docs warn: start in **table** view; filter to hundreds of series, not thousands). `avg(rate(…))` is not always what you mean.

**Confirm:** Write error ratio and p99 for one job from memory. What breaks if you omit `le`?

## 2. Advanced concepts

### Joins and set ops

`and`, `or`, `unless`, comparisons, `group_left` / `group_right` for many-to-one (e.g. attach `version` from an info metric). Powerful—easy to produce huge intermediate sets. Prefer **recording rules** for anything a dashboard refreshes every 30s ([07](./07_Recording_Rules_And_SLIs.md)).

### Subqueries

`max_over_time(rate(x[5m])[1h:1m])` style—read as “nested evaluation.” Costly; record when reused.

### Native histograms

Newer Prometheus adds native histogram types and functions. Classic `_bucket` PromQL above remains the literacy baseline; check your server + Grafana version before rewriting everything.

### Query performance failure mode

```text
Heavy unrecorded dashboard
  → Prometheus CPU busy
  → rule evaluation delayed
  → alerts late during the incident
```

## 3. Applications and use cases

| Scenario | PromQL move |
|----------|-------------|
| First RED panel | `sum by (job) (rate(…[5m]))` + error ratio + p99 |
| Noisy `instance` label | `sum without (instance) (…)` |
| Deploy comparison | `… and on (job) group_left (version) build_info` (carefully) |
| On-call cheat sheet | `up`, error ratio, p99, saturation gauge |

**Staff checklist**

- Shared recorded metrics for team RED/SLI ([07](./07_Recording_Rules_And_SLIs.md))  
- No production panel selecting unbounded series  
- On-call sheet with copy-paste queries for top services  

**Good:** dashboard queries one-line recorded metrics.  
**Bad:** 40-line PromQL pasted into 15 panels.

## References

- [Querying basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)  
- [Operators](https://prometheus.io/docs/prometheus/latest/querying/operators/)  
- [Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/)  
- [07 Recording rules](./07_Recording_Rules_And_SLIs.md)
