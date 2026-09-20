# 4 — Golden signals, RED, and USE

[← Previous](./3_Monitoring_Program_Anatomy.md) · [README](./README.md) · [Next →](./5_Black_Box_White_Box_And_Synthetics.md)

## 1. Concepts — portable signal vocabularies

You need a **shared vocabulary** so every service is not inventing private dashboards. Three durable frames:

### Golden signals (SRE — request-driven services)

| Signal | Meaning | Typical metric shape |
|--------|---------|----------------------|
| Latency | How long | Histogram / summary of request duration |
| Traffic | How much | Request rate (counter → rate) |
| Errors | How wrong | Error ratio or error rate |
| Saturation | How full | Queue depth, thread pool, % utilization approaching cliff |

### RED (services — especially microservices)

| Letter | Meaning |
|--------|---------|
| Rate | Requests per second |
| Errors | Failed requests (define “failed”) |
| Duration | Latency distribution |

RED is golden signals with saturation often handled nearby (or via USE on the instance).

### USE (resources — CPU, disk, NIC, thread pools)

| Letter | Meaning |
|--------|---------|
| Utilization | Busy fraction |
| Saturation | Extra work queued / waiting |
| Errors | Hardware/soft errors on that resource |

**Rule of thumb:** apply **RED/golden** to *user-facing work*; apply **USE** to *resources that can starve that work*.

```text
User request ──► RED on the service
                   │
                   └──► USE on CPU / mem / disk / net / pools underneath
```

**Disconfirm:** CPU alone ≠ golden signals. Average latency alone hides the p99 disaster. “Errors” without a definition (5xx? business decline?) confuses responders.

**Confirm:** For your API, name RED metrics. For the node it runs on, name USE metrics. Where does saturation show up before hard failure?

## 2. Advanced — definitions and pitfalls

**Error definition must be product-aware.** HTTP 401 from bad tokens may be expected; 503 is not. Cart “payment declined” may be a business signal, not an SLO burn—decide explicitly ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)).

**Histograms beat averages.** Track at least a high percentile (p95/p99) or histogram buckets you can re-aggregate.

**Saturation is early warning.** Queue depth and pool wait often move before error rate. Capacity planning lives in [15](./15_Capacity_And_Saturation.md).

**Multi-tenant / multi-route:** RED per *critical route* or SLO class beats one global average that buries checkout under health checks.

**Failure mode:** Health-check traffic dilutes success ratio → exclude from SLI ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)).

## 3. Applications

**Staff checklist**

- Every GA service has RED (or golden) on the critical path  
- Nodes/pods have USE or equivalent saturation visibility  
- Dashboards lead with symptoms users feel, resources second  

**Exercise:** Draw one diagram: user → service RED → dependency RED → host USE. Mark what you actually collect today.

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/) (golden signals)  
- [5 Black-box / synthetics](./5_Black_Box_White_Box_And_Synthetics.md) · [12 App monitoring](./12_Application_And_Service_Monitoring.md)
