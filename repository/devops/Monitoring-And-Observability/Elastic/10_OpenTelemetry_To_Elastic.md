# 10 — OpenTelemetry to Elastic

[← Previous](./09_Alerting_SLOs_And_Incident_Management.md) · [README](./README.md) · [Next →](./11_ILM_Data_Tiers_Retention_And_Cost.md)

## 1. Concepts — prefer OTel instrumentation

Elastic treats OpenTelemetry as a first-class ingest path. **EDOT** (Elastic Distribution of OpenTelemetry) is Elastic’s supported distribution of Collector and language **SDKs**, preconfigured for Elastic ingest and analysis. You can also send OTLP from upstream Collectors/SDKs into Elastic.

| Piece | Job |
|-------|-----|
| **EDOT SDKs** | Auto/manual instrument apps; traces, metrics, logs |
| **EDOT Collector / Agent in OTel mode** | Receive, process, export; host/K8s collection; gateway mode for self-managed |
| **Managed OTLP endpoint (mOTLP)** | Cloud/Serverless OTLP intake without self-managing APM Server OTel intake |
| **Resource attributes** | `service.name`, `deployment.environment`, …—correlation spine across signals |
| **Classic APM agents** | Still valid; **do not** dual-run with EDOT on the same process |

**Plain language:** Instrument once with OTel-shaped SDKs; export to Elastic today; keep the option to change backends tomorrow ([OpenTelemetry](../OpenTelemetry/README.md)).

### Dual-export ban (hard rule)

Avoid running an **EDOT SDK alongside any other Elastic APM agent** in the same application process—conflicting instrumentation, duplicate telemetry, unexpected behavior. Pick one path per runtime ([07](./07_APM_Tracing_And_RUM.md)).

**Also unsupported:** pointing EDOT SDKs **directly** at the APM Server OpenTelemetry intake. Send via **Elastic Agent / Collector** or **mOTLP** only.

### Recommended ingestion shape (by deployment)

| Deployment | Typical path |
|------------|--------------|
| **Observability Serverless** | App telemetry → mOTLP; infra via Agent/Collector exporting OTLP |
| **Elastic Cloud Hosted (9.0+)** | Prefer mOTLP for new OTel setups; older quickstarts used Agent + `elasticsearch` exporter—still works, not preferred for new |
| **Self-managed / ECE / ECK** | EDOT Agent as **gateway** (OTLP in → `elasticapm` processor/connector → `elasticsearch` exporter); edge Collectors use **OTLP exporter**, not elasticsearch-at-edge |

### Version gate

EDOT SDKs / Agent OTel mode: prefer **Stack 9.x**, or supported **8.18/8.19** with Agent **9.x** (align config to Stack version, not Agent defaults). Serverless has no version gate.

### Minimal flow

1. Confirm Stack version compatibility.  
2. Install EDOT SDK on one service; set resource attributes (`service.name`, `deployment.environment`, `service.version`).  
3. Export OTLP to mOTLP or gateway Collector→Elastic.  
4. Verify Service Inventory + Discover; correlate with `resource.attributes.*` / `attributes.*` ([otlp visualize](https://www.elastic.co/docs/solutions/observability/otlp-visualize)).  
5. Add host/K8s collection without double-counting app metrics.

**mOTLP auth literacy:** API keys need APM application privileges (e.g. `event:write` on `apm`); index-level scoping is not yet supported for mOTLP—custom index descriptors can return `PermissionDenied`.

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://<motlp-endpoint>"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=ApiKey <your-api-key>"
```

**Disconfirm:** OTel SDK installed, exporter still pointing at a dead endpoint ⇒ empty APM. APM agent **plus** EDOT on one service ⇒ duplicate telemetry. Assuming mOTLP has tail-based sampling ⇒ surprise gaps. Using `elasticsearch` exporter at every edge pod ⇒ mapping/loss risk.

**Confirm:** One instrument standard (EDOT/OTel vs classic agent)? mOTLP vs self-managed gateway? Resource attribute contract written? Sampling decided?

## 2. Advanced — limits, K8s, when to keep classic

**mOTLP limits (documented):**

- **Tail-based sampling (TBS)** is not available—configure **head-based sampling** at the edge.  
- **Universal Profiling** is not available via mOTLP / OTel-native path ([17](./17_Profiling_And_Network_Topology.md)).

**OTLP protocol literacy.** Elastic APM OTLP supports gRPC and HTTP with ProtoBuf; JSON encoding for OTLP/HTTP is not yet supported. Native Elasticsearch OTLP/HTTP paths (`/_otlp/v1/metrics` GA 9.2+; logs/traces preview 9.5+) exist for self-managed—still prefer gateway/mOTLP for estates; do not fan thousands of apps directly at ES OTLP.

**Resource attributes are the join key.** In Discover, OTel attrs appear under `resource.attributes.*` / `attributes.*`—use them like unified tags elsewhere.

**K8s EDOT quickstarts.** Elastic publishes DaemonSet/Gateway patterns per deploy type (self-managed / ECH / Serverless). Align with cluster add-ons so you do not scrape the same cadvisor metrics thrice. Install OTel content packs (`otel` in Integrations) for compatible dashboards.

**When to keep classic Elastic components.** Production **RUM**: classic browser agent (EDOT Browser is **preview**). **Universal Profiling**: classic only. Many ECS integrations/dashboards need OTel content packs or processors. Centrally curated ingest pipelines for OTel-native logs are thinner—process in Collector or define your own.

**Collector TBS caveat.** OTel Collector `tailsamplingprocessor` into APM Server can break throughput/count metric extrapolation; prefer Agent/EDOT native TBS paths when you need TBS ([07](./07_APM_Tracing_And_RUM.md)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Auth/API key mismatch | 401/403 at OTLP endpoint |
| Attribute explosion | Mapping pain in Elasticsearch |
| Mixed ECS vs OTel field expectations | Broken dashboards until translate/processors |
| Version skew Agent vs Stack | Subtle drop or unsupported pipelines |
| Dual instrument | Duplicate spans / conflicting libs |
| Elasticsearch exporter at edge | Incorrect mapping / data loss risk |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| Greenfield service | EDOT SDK → mOTLP (Cloud/Serverless) or gateway Collector (self-managed) |
| Existing APM agents | Freeze new classic agents; EDOT for new services; migrate when free |
| Polyglot estate | OTel semantic conventions as the contract; Elastic as backend |
| K8s cluster | Follow EDOT K8s quickstart for your deploy type |
| Exit optionality | Keep instrumentation OTel; Elastic-specific UI features stay replaceable |
| Languages without EDOT (Go, Ruby, …) | Contrib OTel SDKs over OTLP (community support) |

**Staff checklist:** org standard = OTel/EDOT; document export endpoint per env; resource attrs mandatory; no dual instrument; no EDOT→APM Server OTel intake; sampling + ILM for OTel traces; practice dig on `resource.attributes.service.name`; link [parent OpenTelemetry](../OpenTelemetry/README.md).

## References

- [Start with OpenTelemetry](https://www.elastic.co/docs/solutions/observability/get-started/opentelemetry/start-with-otel) · [EDOT](https://www.elastic.co/docs/reference/opentelemetry) · [OTLP visualize](https://www.elastic.co/docs/solutions/observability/otlp-visualize) · [Managed OTLP quickstart](https://www.elastic.co/docs/solutions/observability/get-started/quickstart-elastic-cloud-otel-endpoint) · [APM OpenTelemetry](https://www.elastic.co/docs/solutions/observability/apm/opentelemetry) · [OTel limitations](https://www.elastic.co/docs/solutions/observability/apm/opentelemetry/limitations) · [ES OTLP/HTTP endpoint](https://www.elastic.co/docs/manage-data/ingest/otlp-endpoint)  
- [09 Alerting / SLOs](./09_Alerting_SLOs_And_Incident_Management.md) · [07 APM](./07_APM_Tracing_And_RUM.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog OTel](../Datadog/10_OpenTelemetry_To_Datadog.md)
