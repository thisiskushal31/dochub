# Tempo (Grafana Tempo)

[← Back to Monitoring & observability](../README.md) · [Grafana](../Grafana/README.md) · [Mimir](../Mimir/README.md) · [Loki](../Loki/README.md) · [OpenTelemetry](../OpenTelemetry/README.md)

**Tempo** is Grafana’s **distributed tracing backend**: ingest spans (prefer **OTLP**), store in object storage (Parquet blocks), query by **trace ID** or **TraceQL** in Grafana.

```text
Apps (OTel) ──► Alloy ──► Tempo ──► Grafana Explore
                 │              ▲
                 └─ trace_id in Loki / exemplars in Mimir
```

| | |
|--|--|
| **What for** | Trace warehouse in LGTM; cheap object-store retention |
| **When** | Grafana + OTel; correlate with Loki/Mimir |
| **Why not** | Team standardized on Jaeger-only UI and won’t move; SaaS APM is sole pane |

**Disconfirm:** Tempo ≠ metrics DB (though metrics-generator can *emit* metrics). 100% sampling forever ≠ free ([parent 20](../20_Sampling_Strategies.md)).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Tempo_And_When.md)–[02](./02_Ingest_OTLP_And_Architecture.md) | Fit; ingest path |
| Query | [03](./03_TraceQL_And_Grafana.md) | TraceQL / dig |
| Amplifiers | [04](./04_Metrics_Generator_And_Service_Graph.md) | RED from traces |
| Ops & ship | [05](./05_Sampling_Retention_And_Ops.md)–[06](./06_Worked_Example_Traces_In_Grafana.md) | Limits; e2e |

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Tempo and when](./01_What_Is_Tempo_And_When.md) | vs Jaeger; LGTM role |
| 02 | [Ingest, OTLP, architecture](./02_Ingest_OTLP_And_Architecture.md) | Distributor; object store |
| 03 | [TraceQL and Grafana](./03_TraceQL_And_Grafana.md) | Search; correlation |
| 04 | [Metrics-generator and service graph](./04_Metrics_Generator_And_Service_Graph.md) | Derived RED |
| 05 | [Sampling, retention, ops](./05_Sampling_Retention_And_Ops.md) | Cost; HA |
| 06 | [Worked example](./06_Worked_Example_Traces_In_Grafana.md) | OTLP → Tempo → Explore |

## References

- [Tempo docs](https://grafana.com/docs/tempo/latest/) · [Architecture](https://grafana.com/docs/tempo/latest/introduction/architecture/)  
