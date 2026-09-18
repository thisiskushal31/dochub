# 1 — Monitoring and metrics

[← How to read](./0_How_To_Read.md) · [README](./README.md) · [Logs & traces →](./2_Logging_And_Tracing.md) · [Tools index](./3_Observability_Tools.md)

## 1. Concepts

A **metric** is a numeric measurement over time, usually with **labels** (dimensions): `http_requests_total{status="500",service="checkout"}`.

**Plain language:** A speedometer and odometer for the service—cheap to store, good for trends and alerts, bad at answering “what did *this* user do?”

### Four golden signals (start here)

| Signal | Meaning | Typical metric shape |
|--------|---------|----------------------|
| **Latency** | How long work takes | Histogram / summary of request duration |
| **Traffic** | How much demand | Request rate, bytes/s, jobs queued |
| **Errors** | Failed work | Error rate, error ratio |
| **Saturation** | How full resources are | CPU, memory, queue depth, thread pool |

If you can only instrument four things, instrument these for user-facing paths.

### Metric types (Prometheus-shaped literacy)

| Type | Use | Avoid |
|------|-----|-------|
| **Counter** | Things that only go up (requests, bytes) | Using as a gauge of “current” |
| **Gauge** | Point-in-time (temperature, goroutines, queue size) | Treating as a rate without `rate()`/`deriv` |
| **Histogram** | Distribution (latency buckets) | Too many buckets + high cardinality labels |
| **Summary** | Client-side quantiles | Hard to aggregate across instances—prefer histograms for SLOs |

### Dashboards vs alerts

| Surface | Job |
|---------|-----|
| **Dashboard** | Explore, correlate, teach newcomers, incident context |
| **Alert** | Wake a human or open a ticket when action is needed |

**Rule:** Alert on **symptoms users feel** (error budget burn, latency SLO) more than on every CPU blip. Dashboards hold the “why”; pages hold the “now.”

### SLI, SLO, SLA, error budget

| Term | Meaning |
|------|---------|
| **SLI** | Indicator you measure (e.g. successful requests / total, p99 latency) |
| **SLO** | Target for that SLI over a window (e.g. 99.9% success over 30 days) |
| **SLA** | Contractual promise (often weaker than internal SLO); money/legal |
| **Error budget** | Allowed failure = 100% − SLO; when spent, favor reliability over features |

Culture and on-call discipline: [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md). **Implementation** of SLIs (queries, burn alerts) lives here and in [Prometheus](./Prometheus/README.md) / SaaS tools.

**Disconfirm:** A wall of green graphs is **not** an SLO. Alerting on CPU alone is **not** user-centric monitoring. More metrics forever is **not** free—cardinality and storage bite.

**Confirm:** Write one SLI for an HTTP API. Say whether a page fires on that SLI or only a dashboard panel. Name one saturation signal for a queue worker.

## 2. Advanced concepts

### Cardinality

Each unique label *combination* is a time series. `user_id`, `request_id`, or unbounded `path` as labels → memory/cost explosion.

| Do | Don’t |
|----|-------|
| `service`, `route` (templated), `status_class` | Raw URL with IDs, session IDs as labels |
| Bounded enums | High-churn deploy IDs on every metric |

### Alert hygiene

| Pattern | Why |
|---------|-----|
| **Multi-window burn rates** | Catch fast burns and slow leaks without flapping |
| **Symptom over cause** | Page on error rate; investigate CPU on the dashboard |
| **Runbook link** | Page without next step = noise |
| **Inhibit / depend** | Don’t page every pod when the region is down |

Paging product: [PagerDuty](./PagerDuty/README.md).

### Pull vs push (and cloud)

Prometheus classically **scrapes** (pull). Many SaaS and cloud agents **push**. Managed Prometheus / CloudWatch / Monitor choice: [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md).

### Failure modes

| Failure | What you see |
|---------|----------------|
| Scrape broken / wrong job label | Gaps, “unknown” services, silent dark |
| Cardinality bomb | OOM, slow queries, huge bill |
| Alert on noise | Fatigue; real pages ignored |
| Only infra metrics | App is down; graphs look “fine” |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First service | Golden signals + one availability SLO + Grafana board |
| Platform team | Recording rules for common SLIs; shared label taxonomy |
| After deploy | Compare error rate / latency to previous window (CiCd may gate; depth here) |

**Staff checklist**

- Labels documented; cardinality budget reviewed quarterly  
- Alerts owned; unused dashboards deleted or archived  
- SLO window and burn alerts match how you actually ship  
- Audit trails still on in the cloud even if SaaS APM is primary ([Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md))  

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)  
- [Prometheus alerting](https://prometheus.io/docs/alerting/latest/overview/)  
- [Methodologies/3 — SRE & incident](../Methodologies/3_Team_Patterns_SRE_Incident.md)  
