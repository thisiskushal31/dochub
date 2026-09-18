# Jaeger

[← Back to Observability](../README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Tempo](../Tempo/README.md) · [Logs & traces](../2_Logging_And_Tracing.md)

## 1. Concepts

**Jaeger** is a CNCF **distributed tracing** platform (UI + collectors/ingesters + storage options). Many teams now **emit with OpenTelemetry** and still use Jaeger as the backend/UI, or migrate toward Tempo/SaaS.

**Plain language:** The classic open-source trace viewer—waterfalls, service graphs, find slow spans.

**What for:** Trace storage and UI in OSS estates; existing Jaeger deployments.  
**When:** Already running Jaeger successfully; or prefer Jaeger UI/ops knowledge.  
**Why not:** Greenfield Grafana-only stack → Tempo is often the smoother sibling; SaaS APM if you refuse to run a trace backend.

**Disconfirm:** Jaeger is **not** a metrics system. Old Jaeger client libs are **not** the default path—prefer OTel SDKs.

**Confirm:** Are you still using Jaeger clients or OTel → Jaeger exporter?

## 2. Advanced concepts

| Piece | Job |
|-------|-----|
| Agent / collector / query / UI | Classic pipeline roles (deploy shapes vary by version) |
| Storage (Cassandra, Elasticsearch, …) | Backend choice drives ops |
| OTLP ingest | Modern intake from OTel collector |
| Sampling | Front-line cost control |

Compare with [Tempo](../Tempo/README.md): pick **one** primary trace store per environment.

### Failure modes

| Failure | What you see |
|---------|----------------|
| Storage overload | Dropped spans, slow UI |
| Mixed old/new instrumentation | Broken context |
| Dual Tempo + Jaeger forever | Split brain during incidents |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Keep Jaeger | OTel collector → Jaeger OTLP/Jaeger exporter |
| Move to Tempo | Dual-write short window; cut Jaeger when Grafana links work |

**Staff checklist:** OTel-first instrumentation; storage capacity watched; decommission plan if migrating.

## References

- [Jaeger documentation](https://www.jaegertracing.io/docs/)  
- [OpenTelemetry → Jaeger](https://opentelemetry.io/docs/languages/js/exporters/#jaeger)  
- [Tempo](../Tempo/README.md)  
