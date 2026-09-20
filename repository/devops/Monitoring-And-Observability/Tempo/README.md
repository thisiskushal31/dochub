# Tempo (Grafana Tempo)

[← Back to Monitoring & observability](../README.md) · [Grafana](../Grafana/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Tracing](../18_Distributed_Tracing.md)

## 1. Concepts

**Tempo** is Grafana’s **trace backend**: store and query traces (often via OTLP), cheap object-storage oriented, designed to sit beside Prometheus and Loki in the Grafana stack.

**Plain language:** The trace warehouse for Grafana Explore—find a trace ID from a metric or log, open the waterfall.

**What for:** Trace storage in an OSS Grafana-shaped stack.  
**When:** You already (or will) run Grafana + OTel and want traces without Elastic/SaaS.  
**Why not:** Team already standardized on Jaeger and doesn’t want two trace stores; SaaS APM is the chosen primary UI.

**Disconfirm:** Tempo is **not** metrics. It is **not** full-text log search.

**Confirm:** How do you jump from a Prometheus exemplar / log line to a Tempo trace?

## 2. Advanced concepts

| Piece | Job |
|-------|-----|
| Ingest (OTLP/Zipkin/Jaeger protocols) | Accept spans from collectors/SDKs |
| Object storage backend | Cost-effective retention |
| Metrics generator (optional) | Derive span metrics—watch cardinality |
| Grafana TraceQL / search | Query UX |

Pair with [Loki](../Loki/README.md) and [Prometheus](../Prometheus/README.md) using shared labels / trace IDs ([2](../21_Correlation_And_Dig_Methodology.md)).

### Failure modes

| Failure | What you see |
|---------|----------------|
| No object store config | Ops pain / data loss risk |
| 100% sampling at scale | Bill + slow queries |
| Missing `service.name` | Useless service graph |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Grafana stack | OTel collector → Tempo; Grafana Tempo datasource |
| Correlate | Exemplars / derived fields from logs to `trace_id` |

**Staff checklist:** sampling policy; retention; only one trace backend per env.

## References

- [Grafana Tempo docs](https://grafana.com/docs/tempo/latest/)  
- [OpenTelemetry](../OpenTelemetry/README.md) · [Jaeger](../Jaeger/README.md) (alternative)  
