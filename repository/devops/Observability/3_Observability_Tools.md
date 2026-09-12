# Observability tools index

[← Back to Observability](./README.md)

*(Content TBD)* — Index of observability tools covered in this section. Each tool has its own folder; add new tools as new folders and link them here.

## Tool folders

| Tool | Folder | Notes |
|------|--------|--------|
| Prometheus | [Prometheus/](./Prometheus/README.md) | Metrics, PromQL, Alertmanager, exporters |
| Grafana | [Grafana/](./Grafana/README.md) | Dashboards, data sources (Prometheus, Loki, etc.) |
| OpenTelemetry | [OpenTelemetry/](./OpenTelemetry/README.md) | Traces, metrics, logs; OTLP; vendor-neutral |
| Elastic (ELK) | [Elastic/](./Elastic/README.md) | Elasticsearch, Logstash, Kibana, Beats |
| Datadog | [Datadog/](./Datadog/README.md) | APM, metrics, logs, traces (commercial) |
| New Relic | [New Relic/](./New_Relic/README.md) | APM, tracing, metrics, logs (commercial) |

## Adding a new tool

1. Create a folder under `Observability/` (e.g. `Observability/NewTool/`).
2. Add `README.md` (and topic files if needed).
3. Add the tool to the table in [Observability/README.md](./README.md) and in this file.

If you have trouble finding a tool’s documentation, open an issue or add a note in the tool folder; maintainers can add the link.
