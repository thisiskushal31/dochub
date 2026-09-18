# Observability tools index

[← Back to Observability](./README.md)

---

## 1. Concepts

Pick tools by **signal** (metrics, logs, traces, pages)—not by logo count.

| Signal | Tools here | Folder |
|--------|------------|--------|
| Metrics | Prometheus | [Prometheus/](./Prometheus/README.md) |
| Dashboards / unify | Grafana | [Grafana/](./Grafana/README.md) |
| Logs (Grafana stack) | Loki | [Loki/](./Loki/README.md) |
| Logs / search | Elastic (ELK) | [Elastic/](./Elastic/README.md) |
| Instrumentation | OpenTelemetry | [OpenTelemetry/](./OpenTelemetry/README.md) |
| Commercial APM | Datadog, New Relic | [Datadog/](./Datadog/README.md), [New_Relic/](./New_Relic/README.md) |
| On-call routing | PagerDuty | [PagerDuty/](./PagerDuty/README.md) |

Concepts: [1 Metrics](./1_Monitoring_And_Metrics.md) · [2 Logs & traces](./2_Logging_And_Tracing.md). On-call practice: [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md).

**Disconfirm:** Three overlapping APMs are **not** better observability.

**Confirm:** Where do pages go when Prometheus fires?

---

## 2. Stack shapes

| Shape | Typical |
|-------|---------|
| OSS Grafana stack | Prometheus + Loki + Tempo/OTel + Grafana + PagerDuty |
| Elastic-centric | Beats/OTel → Elastic → Kibana; pages to PD |
| SaaS | Datadog/New Relic as primary; still need ownership & SLOs |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| First cluster | Prometheus + Grafana + Loki labels aligned |
| App tracing | OTel SDK → collector → backend |
| Human layer | PagerDuty services ↔ runbooks |

---

## References

- [OpenTelemetry](https://opentelemetry.io/docs/)  
- [Prometheus](https://prometheus.io/docs/)  
- [Grafana](https://grafana.com/docs/)  
