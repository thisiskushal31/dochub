# Observability

Monitoring, logging, tracing, and tools. Concept overviews live as topic files; **each tool has its own folder** so new tools can be added over time. *Content is in placeholder form; will be expanded.*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Monitoring and metrics](./1_Monitoring_And_Metrics.md) | Metrics, dashboards, alerting, SLIs/SLOs/SLAs |
| 2 | [Logging and tracing](./2_Logging_And_Tracing.md) | Centralized logging, structured logging; distributed tracing, APM |
| 3 | [Observability tools index](./3_Observability_Tools.md) | Index of tool folders and when to use which |

## Tools (one folder per tool)

Each tool has its own folder. **To add a new tool:** create a folder (e.g. `NewTool/README.md`), add content, and link it in the table below and in `3_Observability_Tools.md`. This repo is community-maintained.

| Tool | Description |
|------|-------------|
| [**Prometheus**](./Prometheus/README.md) | Metrics, PromQL, alerting, exporters |
| [**Grafana**](./Grafana/README.md) | Dashboards, data sources, alerting |
| [**OpenTelemetry**](./OpenTelemetry/README.md) | Instrumentation, traces, metrics, logs, OTLP |
| [**Elastic (ELK)**](./Elastic/README.md) | Elasticsearch, Logstash, Kibana; logging and search |
| [**Datadog**](./Datadog/README.md) | APM, metrics, logs, traces (commercial) |
| [**New Relic**](./New_Relic/README.md) | APM, tracing, metrics, logs (commercial) |

## Scope

- **Covered here:** Observability from a DevOps perspective, including distributed tracing (open source and commercial tools).
- **Go deeper:** [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) for network observability.
