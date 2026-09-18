# 3 — Observability tools index

[← Logs & traces](./2_Logging_And_Tracing.md) · [README](./README.md) · [How to read](./0_How_To_Read.md)

## 1. Concepts

Pick tools by **signal** (metrics, logs, traces, pages)—not by logo count.

| Signal | Tools here | Folder |
|--------|------------|--------|
| Metrics | Prometheus | [Prometheus/](./Prometheus/README.md) |
| Dashboards / unify | Grafana | [Grafana/](./Grafana/README.md) |
| Instrumentation | OpenTelemetry | [OpenTelemetry/](./OpenTelemetry/README.md) |
| Logs (Grafana stack) | Loki | [Loki/](./Loki/README.md) |
| Traces (Grafana stack) | Tempo | [Tempo/](./Tempo/README.md) |
| Traces (classic CNCF) | Jaeger | [Jaeger/](./Jaeger/README.md) |
| Logs / search | Elastic (ELK) | [Elastic/](./Elastic/README.md) |
| Commercial APM | Datadog, New Relic | [Datadog/](./Datadog/README.md), [New_Relic/](./New_Relic/README.md) |
| On-call routing | PagerDuty | [PagerDuty/](./PagerDuty/README.md) |

Concepts: [1 Metrics](./1_Monitoring_And_Metrics.md) · [2 Logs & traces](./2_Logging_And_Tracing.md). On-call practice: [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md). Managed cloud sinks: [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md).

**Disconfirm:** Three overlapping APMs are **not** better observability. A tools index is **not** a substitute for SLOs.

**Confirm:** Where do pages go when Prometheus fires? Which stack shape matches your staffing?

## 2. Stack shapes — when / why not

| Shape | What it is | When | Why not |
|-------|------------|------|---------|
| **OSS Grafana stack** | Prometheus + Loki + Tempo (or Jaeger) + Grafana + OTel; pages → PagerDuty | Want control, PromQL culture, cost predictability; CNCF skill path | Thin ops staff; need turnkey APM tomorrow |
| **Elastic-centric** | Beats/OTel → Elasticsearch → Kibana (+ Elastic APM) | Heavy full-text log search, existing Elastic skills/license | You only need label-cheap logs → Loki; metric-first → Prometheus |
| **SaaS APM** | Datadog or New Relic as primary telemetry + UI | Fast unify of metrics/logs/traces; paid ops offload | Cost at high cardinality; still need SLOs, ownership, cloud **audit** trails |
| **Cloud-native primary** | CloudWatch / Cloud Monitoring / Azure Monitor (+ optional Managed Prom) | Small single-cloud estate | Deep Prom/Grafana already paved → keep OSS or Managed Prom ([Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |
| **Hybrid** | OTel → collector; metrics to Prom/Managed Prom; logs to Loki or SaaS; traces to Tempo/SaaS | Migration or multi-sink reality | Dual-writing *everything* forever without a plan |

### Signal → first choice (short)

| Job | Prefer first | Alternative |
|-----|--------------|-------------|
| RED / golden signals | Prometheus | SaaS metrics, cloud metrics |
| Dashboards | Grafana | Kibana, SaaS UI |
| Cheap K8s logs | Loki | Elastic if you need rich search |
| Full-text / security log search | Elastic | SaaS log product |
| Vendor-neutral instrument | OpenTelemetry | Vendor agents only when forced |
| Trace store (Grafana world) | Tempo | Jaeger if already running Jaeger |
| Wake humans | PagerDuty | Grafana OnCall / Opsgenie (practice still Methodologies/3) |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First cluster | Prometheus + Grafana + Loki labels aligned; Alertmanager → PagerDuty |
| App tracing | OTel SDK → collector → Tempo or Jaeger (or SaaS) |
| Migrate off SaaS | Keep OTel; swap exporter endpoints; don’t rip agents mid-incident |
| Human layer | PagerDuty services ↔ runbooks ↔ ownership |

**Staff checklist:** one primary stack shape per environment; documented exceptions; no silent dual APM agents; audit logs still on in cloud.

## References

- [OpenTelemetry](https://opentelemetry.io/docs/)  
- [Prometheus](https://prometheus.io/docs/)  
- [Grafana](https://grafana.com/docs/)  
- [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  
