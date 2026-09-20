# 02 — Ingest, OTLP, and architecture

[← Previous](./01_What_Is_Tempo_And_When.md) · [README](./README.md) · [Next →](./03_TraceQL_And_Grafana.md)

## 1. Concepts

**Distributor** accepts Jaeger / Zipkin / **OTLP** (OTLP recommended for performance; Alloy uses OTLP). Spans land in object storage as Parquet-oriented blocks; query frontend + queriers serve TraceQL and get-by-ID.

Modern microservices mode may use Kafka between write and block builders; monolithic mode pushes in-process—see current architecture docs for your major version.

```text
Alloy otelcol.exporter.otlp → Tempo distributor → (queue) → blocks → object storage
                                                      └─► queriers ← Grafana
```

**Disconfirm:** Zipkin-only forever when OTLP is available ≠ best path. No object store on “prod Tempo” ≠ serious.

**Confirm:** Who sends OTLP (app SDK vs Alloy)? Where are blocks stored?

## 2. Advanced

Require `service.name` (resource attribute). Rate limits on distributor. Live-store holds recent data before flush.

## 3. Applications

**Staff checklist:** OTLP from Alloy; object-store bucket + IAM; distributor meta-metrics.

## References

- [Tempo architecture](https://grafana.com/docs/tempo/latest/introduction/architecture/)  
- [03 TraceQL](./03_TraceQL_And_Grafana.md)
