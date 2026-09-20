# 10 — OpenTelemetry to Datadog

[← Previous](./09_Containers_Kubernetes_And_Infrastructure.md) · [README](./README.md) · [Next →](./11_Cost_Governance_And_Account_Hygiene.md)

## 1. Concepts — how to run OTel into Datadog

Instrument with **OpenTelemetry**, then choose how data reaches Datadog. Features depend on **how you instrument** and **how you send**:

| Instrument | Idea |
|------------|------|
| Full OTel SDK + API | Most vendor-neutral |
| OTel API + Datadog SDK | More Datadog-native features (see Feature Compatibility) |
| OTel instrumentation libraries | Extend coverage beside Datadog libs |

| Send path | Best when |
|-----------|-----------|
| **Datadog Agent + DDOT Collector (recommended in current docs)** | Want OTel pipelines **and** Agent ecosystem (Fleet, K8s explorer, integrations, …) |
| **OpenTelemetry Collector → Datadog** | You already run / prefer managing the OSS Collector (sampling, transforms, fan-out) |
| **Direct OTLP intake** | Serverless / constrained hosts where Agent/Collector is awkward |

Map resource attributes to unified tags:

| OpenTelemetry | Datadog |
|---------------|---------|
| `service.name` | `service` |
| `service.version` | `version` |
| `deployment.environment.name` (preferred) / `deployment.environment` | `env` |

Set via `OTEL_RESOURCE_ATTRIBUTES` / `OTEL_SERVICE_NAME`, SDK `Resource`, or Collector processors. Pure OTel setups do **not** automatically honor `DD_SERVICE` / `DD_ENV` / `DD_VERSION`—use the OTel attributes.

**Disconfirm:** “We adopted OTel” ≠ left Datadog. Datadog APM libraries **and** OTel traces for the same traffic without a single-path decision.

**Confirm:** One send path per signal. Attribute → tag mapping written down? Feature Compatibility checked for the features you need?

## 2. Advanced

Compare Agent+DDOT vs OSS Collector vs direct OTLP using Datadog’s Feature Compatibility table before you standardize. Use Collector processors to scrub, sample, and dual-export when you need an exit ramp. Pin Agent / DDOT / Exporter versions—behavior moves.
## 3. Applications — what to do

1. Pick **one** send path (Agent+DDOT, OSS Collector, or direct OTLP)—not two for the same spans.  
2. Send one service; confirm `service`/`env`/`version` in APM.  
3. Record the exit ramp: change exporter, keep instrumentation ([OpenTelemetry](../OpenTelemetry/README.md)).

## References

- [OpenTelemetry in Datadog](https://docs.datadoghq.com/opentelemetry/) · [Unified service tagging — OTel](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/)  
- [11 Cost](./11_Cost_Governance_And_Account_Hygiene.md)
