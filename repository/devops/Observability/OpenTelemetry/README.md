# OpenTelemetry

[← Back to Observability](../README.md) · [Logs & traces concepts](../2_Logging_And_Tracing.md) · [Tools index](../3_Observability_Tools.md)

## 1. Concepts

**OpenTelemetry (OTel)** is a vendor-neutral **observability framework**: APIs/SDKs and a **Collector** to create and export **traces, metrics, and logs** (OTLP and other exporters).

**Plain language:** The USB-C of telemetry—instrument once, plug into Prometheus, Tempo, Jaeger, Elastic, Datadog, cloud sinks, …

| Piece | Job |
|-------|-----|
| **API / SDK** | Create spans, metrics, logs in process |
| **Instrumentation** | Auto (agents/libraries) or manual |
| **Context propagation** | Carry trace context across HTTP/RPC/queues |
| **Collector** | Receive, process (batch, sample, filter), export |
| **OTLP** | Preferred wire protocol |

**What for:** Avoid rewriting instrumentation when backends change; one pipeline language.  
**When:** Multi-backend future, CNCF stack, or escaping a single vendor agent.  
**Why not:** Tiny script with one cloud metric already; don’t run three agents (OTel + Datadog + New Relic) on the same process.

**Disconfirm:** OTel is **not** a storage backend. Installing the operator without exporters is **not** “done.”

**Confirm:** Where does sampling happen—SDK, collector, or backend? What is your export target today?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Collector vs sidecars vs daemon** | Central collector for processing; per-pod for isolation |
| **Tail sampling** | Keep errors/slow traces; drop boring success |
| **Resource attributes** | `service.name`, env, version—align with metrics/logs labels |
| **Semantic conventions** | Stable attribute names → portable queries |
| **Bridge to Prometheus** | OTel metrics → Prom remote write / scrape exporter patterns |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Broken propagation | Incomplete traces |
| Over-instrument | Noise + cost |
| Collector SPOF without HA | Telemetry blackout |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First service | Auto-instrument HTTP + export OTLP → collector → Tempo/Jaeger |
| Migration | Dual-export briefly; cut vendor agent when parity exists |
| Metrics | Prefer existing Prom instrumentation *or* OTel metrics—pick one source of truth per signal |

**Staff checklist:** `service.name` mandatory; sampling policy written; collector config in Git; no dual full agents.

## References

- [OpenTelemetry docs](https://opentelemetry.io/docs/)  
- [OTLP](https://opentelemetry.io/docs/specs/otlp/)  
- [Collector](https://opentelemetry.io/docs/collector/)  
- [Tempo](../Tempo/README.md) · [Jaeger](../Jaeger/README.md) · [Prometheus](../Prometheus/README.md)  
