# 04 — Metrics, tags, and cardinality cost

[← Previous](./03_Install_Host_Container_And_Kubernetes.md) · [README](./README.md) · [Next →](./05_Logs_Pipelines_And_Indexes.md)

## 1. Concepts

Submit metrics via **Agent checks**, **DogStatsD**, **HTTP API**, or **OTLP**. Types include COUNT, RATE, GAUGE, HISTOGRAM, DISTRIBUTION. The in-app type controls aggregation and graphs—changing it can break existing monitors.

### Custom metrics (the bill)

If a metric is not from a standard integration (and some integrations still emit custom series), it is often a **custom metric**. Official rule of thumb:

> A custom metric is uniquely identified by a **metric name + tag values** (including the host tag).

Billable usage (cardinality-based contracts) is roughly the hourly average of distinct series over the month. More tag combinations ⇒ more series ⇒ more cost. Some contracts use Metric Name pricing instead—read yours.

| Do | Don’t |
|----|-------|
| Bound tag keys and values | Put `user_id`, `request_id`, raw URLs in tags |
| Prefer integration metrics when they exist | Mirror every log field as a metric tag |
| Use distributions when you need global percentiles | Leave metrics “Not Assigned” forever |

Naming: start with a letter; ASCII letters/digits/`_`/`.`; case-sensitive; prefer under ~100 characters.

Same cardinality lesson as Prometheus ([parent 7](../7_Cardinality_And_Label_Contracts.md)).

**Disconfirm:** “Hosts are included so tags are free.” Untyped metrics are fine forever.

**Confirm:** Who reviews the Usage page top custom metrics weekly?

## 2. Advanced

**Metrics without Limits™** (when on your contract) separates ingested vs indexed volumes—tune which tag combinations you query. Adding a tag does not always multiply series if it doesn’t increase granularity, but plan as if it might.

## 3. Applications — what to do

1. Open Usage → custom metrics; sort by volume.  
2. Publish a tag allowlist for DogStatsD.  
3. Alert on sudden custom-metric growth ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

## References

- [Metrics](https://docs.datadoghq.com/metrics/) · [Custom metrics](https://docs.datadoghq.com/metrics/custom_metrics/)  
- [Custom metrics billing](https://docs.datadoghq.com/account_management/billing/custom_metrics/)  
- [05 Logs](./05_Logs_Pipelines_And_Indexes.md)
