# 10 — OpenTelemetry to Datadog

[← Previous](./09_Containers_Kubernetes_And_Infrastructure.md) · [README](./README.md) · [Next →](./11_Cost_Governance_And_Account_Hygiene.md)

## 1. Concepts — how to run OTel into Datadog

Instrument with **OpenTelemetry**, then choose how data reaches Datadog. Features depend on **how you instrument** and **how you send**.

| Instrument | Idea |
|------------|------|
| Full OTel SDK + API | Most vendor-neutral |
| OTel API + Datadog SDK | More Datadog-native features (see Feature Compatibility) |
| OTel instrumentation libraries | Extend coverage beside Datadog libs |

| Send path | Best when |
|-----------|-----------|
| **Datadog Agent + DDOT Collector (recommended in current docs)** | Want OTel pipelines **and** Agent ecosystem (Fleet, K8s explorer, integrations) |
| **OpenTelemetry Collector → Datadog** | You already run / prefer managing the OSS Collector |
| **Direct OTLP intake** | Serverless / constrained hosts where Agent/Collector is awkward |

Map resource attributes to unified tags:

| OpenTelemetry | Datadog |
|---------------|---------|
| `service.name` | `service` |
| `service.version` | `version` |
| `deployment.environment.name` (preferred) / `deployment.environment` | `env` |

Set via `OTEL_RESOURCE_ATTRIBUTES` / `OTEL_SERVICE_NAME`, SDK `Resource`, or Collector processors. Pure OTel setups do **not** automatically honor `DD_SERVICE` / `DD_ENV` / `DD_VERSION`.

**Disconfirm:** “We adopted OTel” ≠ left Datadog. Datadog APM libraries **and** OTel traces for the same traffic without a single-path decision.

**Confirm:** One send path per signal? Attribute → tag mapping written? Feature Compatibility checked for features you need?

## 2. Advanced — compatibility, sampling, dual-export

Compare Agent+DDOT vs OSS Collector vs direct OTLP using Datadog’s Feature Compatibility table before you standardize. Some Datadog-only features need the Datadog SDK path.

Use Collector processors to scrub, sample, and dual-export (Datadog today, another backend later)—that is the practical exit ramp ([OpenTelemetry](../OpenTelemetry/README.md)). Pin Agent / DDOT / Exporter versions; behavior moves.

Tail-based sampling in the Collector changes what APM shows—document so on-call does not chase “missing” spans that were never retained.

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| Greenfield microservices | OTel SDK → Agent+DDOT; unified resource attributes |
| Existing Datadog APM estate | Keep SDK where deep features matter; OTel for new languages |
| Multi-backend future | Collector fan-out; do not dual-instrument the same spans |
| Serverless | Direct OTLP or Extension paths per current docs ([15](./15_Serverless_And_Cloud_Integrations.md)) |

**Staff checklist:** pick one send path; confirm `service`/`env`/`version` in APM; record exit ramp; forbid accidental double export in CI templates.

## References

- [OpenTelemetry in Datadog](https://docs.datadoghq.com/opentelemetry/) · [Unified service tagging — OTel](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/)  
- [11 Cost](./11_Cost_Governance_And_Account_Hygiene.md)
