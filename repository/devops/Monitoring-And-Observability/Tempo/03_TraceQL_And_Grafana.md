# 03 — TraceQL and Grafana

[← Previous](./02_Ingest_OTLP_And_Architecture.md) · [README](./README.md) · [Next →](./04_Metrics_Generator_And_Service_Graph.md)

## 1. Concepts

**TraceQL** searches traces by attributes/spans (not only exact ID). Grafana Explore: find slow/error traces, open waterfall, jump to Loki via `trace_id`.

Dig path: Mimir symptom → exemplar/trace → Tempo → Loki ([parent 21](../21_Correlation_And_Dig_Methodology.md), [Grafana/05](../Grafana/05_Datasources_Explore_And_Correlation.md)).

**Disconfirm:** TraceQL metrics for long-range SLO alerting ≠ replacement for Mimir (TraceQL metrics have window limits—see Tempo docs; use metrics-generator for durable RED).

**Confirm:** Can you find traces for `service.name=checkout` with status error in the last hour?

## 2. Advanced

TraceQL metrics: ad-hoc, short windows; for dashboards/alerts >30d or Grafana managed alerts, use metrics-generator → Mimir.

## 3. Applications

**Staff checklist:** Tempo datasource provisioned; Loki derived fields; exemplar links from Mimir.

## References

- [TraceQL](https://grafana.com/docs/tempo/latest/traceql/)  
- [04 Metrics-generator](./04_Metrics_Generator_And_Service_Graph.md)
