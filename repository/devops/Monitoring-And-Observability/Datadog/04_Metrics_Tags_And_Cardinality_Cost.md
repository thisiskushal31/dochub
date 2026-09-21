# 04 — Metrics, tags, and cardinality cost

[← Previous](./03_Install_Host_Container_And_Kubernetes.md) · [README](./README.md) · [Next →](./05_Logs_Pipelines_And_Indexes.md)

## 1. Concepts — metrics and what they cost

Submit metrics via **Agent checks**, **DogStatsD**, **HTTP API**, or **OTLP**. Submission types include COUNT, RATE, GAUGE, HISTOGRAM, DISTRIBUTION. The **in-app type** controls aggregation and graphs—changing it can break existing monitors and make history look wrong.

### Custom metrics (the bill)

If a metric is not from a standard integration (and some integrations still emit custom series), it is often a **custom metric**. Official identity:

> A custom metric is uniquely identified by a **metric name + tag values** (including the host tag).

On cardinality-based contracts, billable usage is roughly the hourly average of distinct series over the month. More tag combinations ⇒ more series ⇒ more cost. Some contracts use Metric Name pricing—read yours.

| Do | Don’t |
|----|-------|
| Bound tag keys and values | Put `user_id`, `request_id`, raw URLs in tags |
| Prefer integration / runtime metrics when they exist | Mirror every log field as a metric tag |
| Use distributions when you need global percentiles | Leave metrics “Not Assigned” forever |

Naming: start with a letter; ASCII letters/digits/`_`/`.`; case-sensitive; prefer under ~100 characters. Same cardinality lesson as Prometheus ([parent 7](../7_Cardinality_And_Label_Contracts.md)).

**Disconfirm:** “Hosts are included so tags are free.” Untyped metrics are fine forever. More tags always mean more insight.

**Confirm:** Who reviews Usage → top custom metrics weekly? Is there a DogStatsD tag allowlist?

## 2. Advanced — types, Limits, and growth

**COUNT vs RATE.** Know which you submit; monitors that treat them interchangeably page wrong.

**Metrics without Limits™** (when on contract) separates ingested vs indexed volumes—tune which combinations you query heavily.

**Adding a tag** does not always multiply series if it does not increase granularity beyond the most specific key—but plan as if it might. Distributions expand into multiple series; count carefully.

**Growth patterns.** New microservice × unbounded `endpoint` tag × `status` × `host` is a classic invoice spike. Marketplace integrations can also emit custom metrics—budget them ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)).

## 3. Applications — use cases

| Use case | Approach |
|----------|----------|
| RED for HTTP service | Prefer APM/runtime metrics; avoid per-path DogStatsD unless bounded |
| Business KPI (orders/min) | One metric name; tags `env`, `region` only |
| Percentile latency | Distribution or APM latency—not many gauge quantiles clientside |
| Cost fire drill | Usage → top custom metrics → remove high-card tag → verify billable drop |

**Staff checklist**

1. Publish tag allowlist for DogStatsD / custom checks.  
2. Weekly top-N custom metrics review with owners.  
3. Alert on sudden custom-metric growth ([11](./11_Cost_Governance_And_Account_Hygiene.md)).  
4. Document metric types for anything paging.

## References

- [Metrics](https://docs.datadoghq.com/metrics/) · [Custom metrics](https://docs.datadoghq.com/metrics/custom_metrics/)  
- [Custom metrics billing](https://docs.datadoghq.com/account_management/billing/custom_metrics/)  
- [05 Logs](./05_Logs_Pipelines_And_Indexes.md)
