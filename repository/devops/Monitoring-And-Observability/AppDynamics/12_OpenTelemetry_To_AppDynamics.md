# 12 — OpenTelemetry to AppDynamics

[← Previous](./11_Analytics_And_Log_Literacy.md) · [README](./README.md) · [Next →](./13_Operations_License_And_Pitfalls.md)

## 1. Concepts — one instrument path into AppD

**Splunk AppDynamics for OpenTelemetry** lets you send OTLP signals into AppDynamics so Controller UX can show OpenTelemetry-originated data mapped toward **business transactions** and related views. Treat this as an **ingestion and mapping** story, not “we left AppD for pure OSS.”

| Path | When |
|------|------|
| **OTel SDK / auto-instrument → Collector → AppD OTel service** | Greenfield or vendor-neutral instrumentation ([OpenTelemetry](../OpenTelemetry/README.md)) |
| **AppD language agent + OTel export** (Java/.NET/Node patterns) | Already on AppD agents; need OTel spans correlated with BTs |
| **OpenTelemetry Ingestion Gateway (OTIG)** | Gateway literacy for OTIG pipelines (transforms, sampling, AppD exporter) on supported shapes (VA / cSaaS; Controller from ~25.10+, richer node/Metrics Browser from 26.4+) |

```text
App / SDK ──OTLP──► Collector / OTIG ──► AppD OTel ingest
                         │
                         ├── scrub (attributes/redaction/transform)
                         ├── sample (head / tail)
                         └── map → BTs / tiers / apps
```

**Controller onboarding.** **OTel → Get Started** generates an **access key**; configure Collector (**≥ 0.36.0**), resource attributes, then instrument. Prefer **Splunk AppDynamics Distribution for OpenTelemetry Collector** for seamless backend integration; upstream Collector is also documented. Retrieve the key under **OTel → Access Key** (generation can take up to ~30 seconds).

**Resource attributes.** Set `service.name`, deployment environment, and version deliberately ([02](./02_Architecture_Controller_Apps_Tiers_Nodes.md)). OTIG application-name detection order: `appd.app.name` → `service.namespace` → `deployment.environment.name` → `"unknown"`.

**Plain language:** OTel produces spans; AppDynamics for OpenTelemetry lands and maps them toward BTs—not a second APM product beside AppD.

**Disconfirm:** Classic AppD agent **and** a second full OTel→other-SaaS APM path on the same process. Dual export to Datadog and AppD without a migration plan ([Datadog](../Datadog/README.md)). Skipping Collector scrubbing. Promising classic flow-map parity without the support matrix.

**Confirm:** One primary instrument path per runtime? Access key in secrets manager? Sampling policy written? Support matrix checked?

## 2. Advanced — Collector, OTIG, scrubbing, sampling, pitfalls

**Collector config literacy.** Receivers `otlp` (gRPC/HTTP); processors for transform/filter/batch/tail sampling; exporter toward AppD (`urlbase`, account, access key; regions/endpoints per docs). Older Controllers may need `agentproducttype: "open-telemetry"`. Enable components via `service | pipelines`.

**Sensitive data filters.** Filter at agent **or** Collector. Recommended processors: `attributes`, `redaction`, `transform`—delete, redact, or hash identity, card, and email attributes before export ([Filter Sensitive Data Using the Collector](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/filter-sensitive-data-using-the-collector)). Scrubbing after the fact in the Controller is not a substitute.

**BT naming transforms.** Map `http.route` or span name into AppD BT attributes; set error bits from HTTP status—document beside classic BT detection rules ([05](./05_Business_Transactions.md)). Raw span names recreate “All Other Traffic” chaos.

**Sampling.** Head sampling at SDK/edge and/or tail sampling in Collector/OTIG. OTIG sizing profiles document `tail_sampling` knobs and resource envelopes. Undocumented sampling causes “missing traces”—write the policy; pin versions in git.

**No dual APM (hard rule).** One primary path per runtime into AppD. Do not run classic AppD language agent **plus** Datadog/New Relic APM on the same process. Collector fan-out to a second backend is a staging migration tool—not permanent dual-instrument ([13](./13_Operations_License_And_Pitfalls.md), [Datadog OTel](../Datadog/10_OpenTelemetry_To_Datadog.md), [Elastic OTel](../Elastic/10_OpenTelemetry_To_Elastic.md)).

**Combined agent mode.** When AppD agents also emit OTel spans, correlation headers/baggage can stitch OTel nodes to registered BTs—prove in staging first.

**Feature / support matrix.** Not every classic UI affordance exists for pure OTel services—read **Support for AppDynamics for OpenTelemetry** before promising flow-map parity.

**Metrics path literacy.** OTIG examples may reshape OTel metrics into AppD custom metric paths—cardinality still hurts ([parent 7](../7_Cardinality_And_Label_Contracts.md)). Prefer bounded names.

**Viewing data.** Use Controller OTel views plus classic dashboards where mapping succeeded. Empty classic flow maps with healthy OTel intake usually means resource attribute / BT naming gaps. Use OTel ingestion views for pipeline health.

**Exit ramp.** Collector fan-out to Tempo/Jaeger later; do not dual-**instrument** the same library twice ([OpenTelemetry](../OpenTelemetry/README.md), [parent 22](../22_Instrumentation_Collectors_And_Backends.md)).

### Failure modes

| Failure | What you see |
|---------|----------------|
| Wrong access key / account | Collector “ok,” empty OTel UI |
| Missing resource attributes | Garbage apps/tiers / `"unknown"` |
| Tail sampling undocumented | “Missing” traces during digs |
| Dual APM agents | Double cost, split RCA ([13](./13_Operations_License_And_Pitfalls.md)) |
| Secrets in span attributes | Compliance incident |
| OTIG on unsupported Controller | Partial node/Metrics Browser features |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| New microservice | OTel SDK → Collector → AppD; golden BTs from routes |
| Brownfield AppD estate | Keep language agents; add OTel only where needed |
| Migration off AppD | Dual-export in staging via Collector; cut primary deliberately |
| Gateway estate | OTIG with naming + error transforms; pin versions |
| Multi-backend future | Document fan-out; forbid double instrument in CI templates |
| Compliance | Redaction/attributes processors before export |

**Good:** one send path, scrubbed Collector, documented sampling. **Bad:** classic agent + OTel + Datadog APM on one process.

**Staff checklist**

1. OTel vs classic agent decision written per runtime.  
2. Access key rotation owner; secrets manager only.  
3. Scrub processors on; denylist documented.  
4. Sampling policy written; Collector/OTIG versions pinned.  
5. No second SaaS APM agent beside AppD on the same service.  
6. Support matrix reviewed before UI promises.

**Resource attribute contract (minimum).** `service.name`, environment, and version on every service; document who owns the mapping to AppD application/tier names before the first prod cutover ([Configure Resource Attributes](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/configure-resource-attributes-on-your-application)).

**OTIG vs edge Collector.** Use OTIG when you need a supported gateway translation into AppD BT/tier models at scale; use a standard Collector export path for simpler estates. Do not run both undocumented paths for the same traffic.

## References

- [Getting Started — AppDynamics for OpenTelemetry](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/getting-started) · [Configure the OpenTelemetry Collector](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/configure-the-opentelemetry-collector) · [Instrument Applications](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/instrument-applications-with-splunk-appdynamics-for-opentelemetry) · [Filter Sensitive Data Using the Collector](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/filter-sensitive-data-using-the-collector) · [Support for AppDynamics for OpenTelemetry](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/support-for-appdynamics-for-opentelemetry)  
- [OpenTelemetry Ingestion Gateway for AppDynamics](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/opentelemetry-ingestion-gateway-for-appdynamics)  
- [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog OTel](../Datadog/10_OpenTelemetry_To_Datadog.md) · [Elastic OTel](../Elastic/10_OpenTelemetry_To_Elastic.md) · [13 Ops](./13_Operations_License_And_Pitfalls.md)
