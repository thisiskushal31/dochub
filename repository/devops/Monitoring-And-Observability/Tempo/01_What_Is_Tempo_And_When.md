# 01 — What is Tempo and when

[← README](./README.md) · [Next →](./02_Ingest_OTLP_And_Architecture.md)

## 1. Concepts

**Tempo** stores traces for high-volume ingest with object-storage economics. Grafana is the usual UI (TraceQL / trace view). It pairs with **Mimir** (metrics) and **Loki** (logs) under shared identity.

| | Tempo | Jaeger (typical) |
|--|-------|------------------|
| UI | Grafana-centric | Jaeger UI |
| Storage model | Object store / Parquet-oriented | Often heavier indexed store |
| LGTM fit | Native | Possible, less “one pane” |

**Confirm:** How do you open a trace from a metric or log today?

## 2. Advanced

Use Tempo when correlation in Grafana matters more than Jaeger’s standalone UX. Keep **one** primary trace backend per env.

## 3. Applications

**Staff checklist:** OTLP path owned; sampling policy written; Jaeger-vs-Tempo decision explicit.

## References

- [Tempo docs](https://grafana.com/docs/tempo/latest/) · [02 Ingest](./02_Ingest_OTLP_And_Architecture.md)
