# 6 — Metric types and aggregation

[← Previous](./5_Black_Box_White_Box_And_Synthetics.md) · [README](./README.md) · [Next →](./7_Cardinality_And_Label_Contracts.md)

## 1. Concepts — what a number *is*

Wrong type → wrong alert math. Learn the portable types (Prometheus-style names are common literacy; other systems rhyme).

| Type | What it represents | Common uses | Aggregation care |
|------|--------------------|-------------|------------------|
| **Counter** | Cumulative only-up (resets on restart) | Requests, errors, bytes | Use **rate/increase**, not raw value |
| **Gauge** | Point-in-time value | Temperature, queue depth, goroutines | Min/max/avg OK; know scrape gaps |
| **Histogram** | Observations in buckets | Latency, size | Estimate percentiles; sum/count for averages |
| **Summary** | Client-side quantiles | Latency (less re-aggregable) | Hard to merge across instances |

```text
counter_total ──rate()──► requests/sec
histogram     ──histogram_quantile──► p99 (careful)
gauge         ──► current saturation
```

**Timestamps and scrape intervals:** a gauge is only as fresh as the last scrape. Alerting on “was 0 for one scrape” without `for:` duration creates flaps.

**Disconfirm:** Alerting on raw counter levels ≠ traffic monitoring. Averaging percentiles across instances ≠ global percentile. “Summary everywhere” ≠ portable multi-region rollups.

**Confirm:** For request rate, error ratio, and latency p99, which types do you use? How do you compute error *ratio* from counters?

## 2. Advanced — ratios, resets, and exemplars

**Error ratio:** `rate(errors) / rate(requests)` (guards for zero traffic). Prefer this over absolute error counts alone for SLOs.

**Counter resets:** process restart drops counters; `rate`/`increase` handle resets if the system supports it—know your backend.

**Histograms:** bucket design matters. Buckets that end at 1s hide a 5s tail. Align buckets with SLO thresholds when possible.

**Exemplars / trace links:** some stacks attach a trace ID to a histogram observation—bridges detect → explain ([21](./21_Correlation_And_Dig_Methodology.md)).

**Aggregation boundaries:** never average averages blindly. Sum then divide; or use histograms.

**Failure mode:** Mixing push intervals and pull scrapes without knowing staleness → ghost series and false pages.

## 3. Applications

**Staff checklist**

- Request/error metrics are counters (or documented equivalents)  
- Latency uses histogram (or explicit quantile story)  
- Recording rules / rollups documented for expensive dashboards  

**Exercise:** Write the PromQL-or-equivalent sketch for success ratio and p99 for one service (even if you fill exact syntax later in the Prometheus tool folder).

## References

- [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)  
- [7 Cardinality](./7_Cardinality_And_Label_Contracts.md) · [8 SLI/SLO](./8_SLI_SLO_SLA_And_Error_Budgets.md)
