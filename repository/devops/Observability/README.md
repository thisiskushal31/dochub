# Observability

Metrics, logs, traces, SLOs, and the tools that store and page on them. **Jobs first** (chapters 1–2), then **stack choice** (chapter 3), then **one folder per tool** (what / when / why not).

Managed cloud product *when which*: [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md). On-call *practice*: [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md). Packet / NetOps depth: [Networks Observability](https://github.com/thisiskushal31/Networks-Deep-Dive).

Start here if unsure: [0 — How to read](./0_How_To_Read.md).

### Staircase

```text
Floor −1  How to read     →  0
Floor 0   Signal jobs     →  1–2   (metrics/SLO; logs & traces)
Floor 1   Choose a stack  →  3     (tools index — when / why not)
Floor 2   Tool literacy   →  Prometheus, Grafana, OTel, Loki, Tempo, Jaeger, Elastic, Datadog, New Relic, PagerDuty
```

**Suggested path:** **0 → 1 → 2 → 3**, then **Prometheus → Grafana → OpenTelemetry**, then the rest as your estate needs.

## Floor −1 — How to read

| # | File | Focus |
|---|------|--------|
| 0 | [How to read](./0_How_To_Read.md) | Quality bar; doors; first stretch |

## Floor 0 — Signal jobs

| # | Topic | Focus | Status |
|---|--------|-------|--------|
| 1 | [Monitoring and metrics](./1_Monitoring_And_Metrics.md) | Golden signals, SLI/SLO/SLA, alerts, cardinality | filled |
| 2 | [Logging and tracing](./2_Logging_And_Tracing.md) | Structured logs, traces, OTel job, APM | filled |
| 3 | [Observability tools index](./3_Observability_Tools.md) | Signal → tool; stack shapes when / why not | filled |

## Floor 2 — Tools (one folder per tool)

**To add a new tool:** create `ToolName/README.md`, fill what / when / why not, link here and in [3](./3_Observability_Tools.md).

| Tool | Job | Status |
|------|-----|--------|
| [Prometheus](./Prometheus/README.md) | Metrics, PromQL, Alertmanager, exporters | filled |
| [Grafana](./Grafana/README.md) | Dashboards, data sources, unify | filled |
| [OpenTelemetry](./OpenTelemetry/README.md) | Instrumentation → collector → backends | filled |
| [Loki](./Loki/README.md) | Label-indexed log aggregation (Grafana stack) | filled |
| [Tempo](./Tempo/README.md) | Trace backend (Grafana stack) | filled |
| [Jaeger](./Jaeger/README.md) | Trace backend (CNCF / classic) | filled |
| [Elastic (ELK)](./Elastic/README.md) | Search-centric logs (+ Elastic APM/stack) | filled |
| [Datadog](./Datadog/README.md) | Commercial metrics/logs/traces/APM | filled |
| [New Relic](./New_Relic/README.md) | Commercial APM / observability | filled |
| [PagerDuty](./PagerDuty/README.md) | On-call routing / incidents | filled |

## Scope and doors

| Here | Elsewhere |
|------|-----------|
| Signal design, SLO literacy, tool when/why-not | Cloud audit + managed sinks → [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) |
| PagerDuty product | Schedules, blameless, fatigue → [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md) |
| App/service telemetry | tcpdump / Wireshark / flow → Networks Observability |
| Post-deploy synthetic / e2e | CiCd verify (k6, Playwright) |

## Further reading

- [OpenTelemetry](https://opentelemetry.io/docs/) · [Prometheus](https://prometheus.io/docs/) · [Grafana](https://grafana.com/docs/)  
- [Google SRE book — monitoring](https://sre.google/sre-book/monitoring-distributed-systems/)  
