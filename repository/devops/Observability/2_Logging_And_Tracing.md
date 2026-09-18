# 2 — Logging and tracing

[← Metrics](./1_Monitoring_And_Metrics.md) · [README](./README.md) · [Tools index →](./3_Observability_Tools.md) · [OpenTelemetry](./OpenTelemetry/README.md)

## 1. Concepts

### Logs

A **log** is an event record (usually a line or JSON object) emitted when something happened: request handled, exception thrown, config loaded.

**Plain language:** The diary. Great for “what exactly happened,” expensive and noisy if you treat every debug line as forever truth.

| Practice | Why |
|----------|-----|
| **Structured logging** (JSON fields) | Query `level`, `error_code`, `order_id` without regex hell |
| **Correlation / trace IDs** | Tie log lines to a request and to a trace |
| **Retention tiers** | Hot search window vs cold archive vs delete |
| **PII discipline** | Don’t log secrets, cards, raw tokens |

**Centralized logging** = ship from many hosts/pods to one query plane ([Loki](./Loki/README.md), [Elastic](./Elastic/README.md), or SaaS).

### Traces

A **trace** is the path of one request (or job) across services: a tree of **spans** with timings and attributes.

**Plain language:** The subway map for a single ride—where time was spent and which hop failed.

| Idea | Meaning |
|------|---------|
| **Span** | One unit of work (HTTP handler, DB call) |
| **Trace** | Causal tree of spans sharing a trace ID |
| **Context propagation** | Headers/metadata that carry IDs across process boundaries |
| **Sampling** | Keep a fraction of traces so cost stays sane |

### Logs vs metrics vs traces

| Need | Prefer |
|------|--------|
| Burn rate / SLO / capacity | Metrics ([1](./1_Monitoring_And_Metrics.md)) |
| Exact error message / payload fields | Logs |
| Which service hop was slow | Traces |
| “Is anyone awake?” | Page ([PagerDuty](./PagerDuty/README.md)) |

### OpenTelemetry as the instrumentation job

**OpenTelemetry (OTel)** is the vendor-neutral way to **create** metrics, logs, and traces in code and export them (often via a **collector**) to backends.

OTel is **not** the database. Backends: Prometheus/Grafana, Tempo, Jaeger, Elastic, Datadog, New Relic, cloud natives ([Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

### APM vs DIY

| Shape | When | Why not |
|-------|------|---------|
| **SaaS APM** (Datadog, New Relic, …) | Fast time-to-value, unified UI, paid ops offload | Cost at scale; lock-in; still need SLOs/ownership |
| **OSS + OTel** (Prom/Loki/Tempo/Grafana or Jaeger) | Control, cost, CNCF skill path | You run the pipeline |
| **Cloud native only** | Small estate already all-in on one cloud | Weak multi-cloud / deep Prom culture |

**Disconfirm:** “We log everything” is **not** observability. Traces without propagation are **not** distributed tracing. OTel installed with no backend is **not** a platform.

**Confirm:** For one checkout request, what appears in a metric, a log, and a span? Where does sampling happen? Which backend stores traces in *your* stack shape ([3](./3_Observability_Tools.md))?

## 2. Advanced concepts

### Correlation

Align **labels / resource attributes**: `service.name`, `deployment.environment`, `pod`, `trace_id` in logs. Same vocabulary across Prometheus, Loki, and Tempo makes Grafana “Explore” useful.

### Cardinality and volume (logs/traces)

| Risk | Symptom |
|------|---------|
| Unbounded log fields as index/labels | Loki/Elastic cost spike |
| 100% trace keep + chatty services | Ingest bill / backend melt |
| Debug logs in prod forever | Noise drowns real errors |

### Trace backends (literacy)

| Backend | Role | Folder |
|---------|------|--------|
| **Tempo** | Grafana-stack trace store | [Tempo/](./Tempo/README.md) |
| **Jaeger** | Classic CNCF tracing UI/store | [Jaeger/](./Jaeger/README.md) |
| SaaS / Elastic APM | Commercial or Elastic-centric | [Datadog](./Datadog/README.md), [New Relic](./New_Relic/README.md), [Elastic](./Elastic/README.md) |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Missing context propagation | Broken traces; orphan spans |
| Clock skew | Nonsense span timings |
| Logs without levels / structure | Unqueryable firehose |
| PII in logs | Compliance incident |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First microservice | Structured JSON logs + OTel HTTP auto-instrument → collector → Tempo/Jaeger |
| Correlate in Grafana | Shared labels; link from metric → trace → log |
| Cost control | Tail sampling on errors/slow; drop debug in prod |

**Staff checklist**

- Trace context on inbound/outbound HTTP and queue messages  
- Retention + PII policy written  
- One “how to find a request” runbook per service  
- Don’t duplicate three APM agents on one process  

## References

- [OpenTelemetry docs](https://opentelemetry.io/docs/)  
- [OpenTelemetry tracing](https://opentelemetry.io/docs/concepts/signals/traces/)  
- [Grafana Loki](./Loki/README.md) · [Tempo](./Tempo/README.md) · [Jaeger](./Jaeger/README.md)  
- [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  
