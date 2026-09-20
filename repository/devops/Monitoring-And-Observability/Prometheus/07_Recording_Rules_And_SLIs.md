# 07 — Recording rules and SLIs

[← Previous](./06_PromQL_Essentials.md) · [README](./README.md) · [Next: Alerting →](./08_Alerting_Rules_And_Alertmanager.md)

## 1. Concepts

**Recording rules** evaluate PromQL on a schedule and **write new time series**. They are how serious Prometheus estates keep dashboards fast and SLIs stable.

Use them to:

1. Precompute expensive expressions dashboards would otherwise re-run every refresh  
2. Build **SLI** series (success ratio, latency-good fraction) that burn alerts consume ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md))  
3. Aggregate **step by step** (instance → job → fleet) without repeating giant queries  

**Staff confuse this constantly:** recording rules are not “alerts that don’t page.” Alerting rules **fire**; recording rules **store**. Same YAML file family, different `record:` vs `alert:` keys.

### Official naming: `level:metric:operations`

From Prometheus recording-rule practices:

| Part | Meaning |
|------|---------|
| `level` | Aggregation level / labels left on the output |
| `metric` | Base name; strip `_total` when using `rate()` / `irate()` |
| `operations` | Ops applied, **newest first** (`rate5m`, `ratio_rate5m`, …) |

```yaml
groups:
  - name: api.rules
    interval: 30s
    rules:
      - record: instance_path:requests:rate5m
        expr: rate(http_requests_total{job="api"}[5m])

      - record: path:requests:rate5m
        expr: sum without (instance) (instance_path:requests:rate5m{job="api"})
```

Colons in these **recorded** names are intentional—and why app metrics must not use `:` ([02](./02_Data_Model_Types_And_Labels.md)).

### Ratios — the non-negotiable rule

**Aggregate numerator and denominator separately, then divide.**  
Do **not** take the average of a ratio (or average of averages).

```yaml
      - record: instance_path:request_failures:rate5m
        expr: rate(http_requests_total{job="api", code=~"5.."}[5m])

      - record: path:request_failures_per_requests:ratio_rate5m
        expr: |2
            sum without (instance) (instance_path:request_failures:rate5m{job="api"})
          /
            sum without (instance) (instance_path:requests:rate5m{job="api"})
```

Prefer `without (…)` when dropping labels so remaining labels (like `job`) survive and stay useful for alerts.

### SLI wiring

```text
Raw counters/histograms
  → recording rules (SLI / rate / ratio)
  → Grafana panels (cheap)
  → alerting rules / burn alerts ([08](./08_Alerting_Rules_And_Alertmanager.md), parent [10](../10_Alert_Hygiene_And_Burn_Rates.md))
```

**Disconfirm:** Copy-pasting identical PromQL into twelve panels ≠ recordings. Recording every possible `by` slice ≠ “optimization.” `avg(error_ratio)` across instances ≠ job error ratio.

**Confirm:** Which three recordings does every service dashboard use? Does your failure ratio **sum-then-divide**?

## 2. Advanced concepts

### Groups and intervals

Rules in a group run **sequentially** at the group interval with one evaluation timestamp. Heavy groups delay later rules—split hot paths.

### Guardrails

Modern Prometheus can **limit** series a rule may produce. Use when a bad `by (path)` would explode.

### Remote-write delay

If you evaluate rules on a receiver that ingests remote write, samples can arrive late—know your version’s offset / delay settings before blaming PromQL.

### Latency means from Summary/Histogram counts

Docs pattern: record `rate(_sum)` and `rate(_count)`, then `_sum/_count` as `:mean5m`—still aggregate numerator/denominator separately when rolling up.

**Failure mode:** `record: … by (path)` where path still embeds IDs → cardinality bomb *inside* the TSDB you trusted.

## 3. Applications and use cases

| Scenario | Recording move |
|----------|----------------|
| Slow Grafana row | Replace panel PromQL with a recorded metric |
| Multi-window burn | Record short + long rates for burn math |
| Many instances | Record `without (instance)` rollups for job-level alerts |
| Onboarding a service | Ship RED recordings in the same PR as the ServiceMonitor |

**Staff checklist**

- House style = `level:metric:operations` (or documented alternate)  
- Ratio recordings always sum-then-divide  
- `promtool check rules` in CI  
- Dashboards prefer recorded RED/SLI metrics  

**Good:** `job:http_request_failures_per_requests:ratio_rate5m` on every overview.  
**Bad:** each panel re-aggregates raw buckets from scratch.

## References

- [Recording rules configuration](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)  
- [Recording rules practices](https://prometheus.io/docs/practices/rules/)  
- [08 Alerting](./08_Alerting_Rules_And_Alertmanager.md) · [Parent 8 SLOs](../8_SLI_SLO_SLA_And_Error_Budgets.md)
