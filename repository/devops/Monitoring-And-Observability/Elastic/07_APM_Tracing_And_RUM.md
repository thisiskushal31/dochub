# 07 — APM, tracing, and RUM

[← Previous](./06_Metrics_Infra_And_Hosts.md) · [README](./README.md) · [Next →](./08_Synthetics_And_Uptime.md)

## 1. Concepts — how to get traces

Elastic APM receives performance data from **Elastic APM agents** or **EDOT SDKs**, validates/processes it (APM Server or managed intake), and stores documents in Elasticsearch for the **Applications** UI (**Service Inventory**, traces, errors, dependencies).

| Approach | When |
|----------|------|
| **Elastic APM language agents** | Classic Elastic path; mature per-language knobs; Elastic protocol |
| **EDOT SDKs** | Prefer OTel-shaped instrumentation; Elastic-supported distribution (OTLP) |
| **Upstream OTel SDK → Collector** | Strict vendor-neutral; export OTLP to Elastic ([10](./10_OpenTelemetry_To_Elastic.md)) |
| **RUM / browser agent** | Real-user page load / Core Web Vitals–style metrics → User Experience |
| **Mobile** | EDOT Android / EDOT iOS (classic mobile agents where still used)—session literacy beside RUM |
| **Lambda / serverless compute** | Elastic APM AWS Lambda architecture / extensions—not “install Agent on a VM” |
| **K8s attacher** | Auto-inject APM/EDOT into pods without baking the agent into every image |

**Language availability (high-signal):** EDOT covers Java, .NET, Node.js, Python, PHP, Android, iOS (EDOT Browser is **preview**—production RUM still prefers classic browser agent). Classic agents still cover Go and Ruby where EDOT is absent. **Do not run EDOT and a classic APM agent in the same process**—duplicate spans and conflicting instrumentation.

### Data model literacy

| Type | Meaning |
|------|---------|
| **Span** | One code path / operation |
| **Transaction** | Highest-level work in a service (often many child spans) |
| **Trace** | Group of transactions/spans with a common root (distributed across services) |
| **Error** | Exception or error log; links via `transaction.id`; stored under `logs-apm.error-<ns>` |
| **Metrics** | Interval system/app metrics; aggregated `metrics-apm.*` power the UI |

### Minimal flow

1. Deploy Observability-capable project/stack (APM needs **Complete** on Serverless).  
2. Install APM agent **or** EDOT SDK; set `service.name` / environment / version.  
3. Point at the correct intake: APM endpoint (classic) or **OTLP via Agent/mOTLP**—not unsupported EDOT→APM Server OTel intake shortcuts ([10](./10_OpenTelemetry_To_Elastic.md)).  
4. Generate traffic → **Applications → Service Inventory** → open a trace.  
5. Confirm logs carry `trace.id` (or OTel trace id) for dig-through ([05](./05_Logs_Ingest_Discover_And_Streams.md)).

**Plain language:** Something in the process must create spans. A host Agent does not auto-trace your app unless you add library/SDK (or an approved auto-instrument / attacher path).

**Disconfirm:** Host metrics without SDK ⇒ empty Service Inventory. Dual instrument ⇒ double cost. RUM snippet without CSP/backend intake plan ⇒ silent browsers. Essentials tier ⇒ empty Applications.

**Confirm:** One instrumentation path per runtime? Sampling policy written? ILM/retention for APM streams? Same `service.name` on metrics, logs, and traces?

## 2. Advanced — sampling, ILM, errors, dependencies, central config

**Sampling.** **Head-based** sampling decides at trace start (e.g. `transaction_sample_rate` / OTel probability); upstream decision is respected across distributed services. **Tail-based** sampling (stateful APM backend / Collector processors) is more powerful but has metric-extrapolation caveats with OTel Collector TBS—prefer Elastic/Agent-native TBS paths when you need them. mOTLP has **no** TBS—sample at the edge ([parent 20](../20_Sampling_Strategies.md)).

**Default ILM literacy (customize via `*@custom` component templates):** raw `traces-apm` often ~**10 days**; `traces-apm.rum` ~**90 days**; `logs-apm.error` ~**10 days**; many aggregated `metrics-apm.*` windows span 90–390 days. Indices from 8.15–8.16 may have used DSL—new indices from 8.17+ default to ILM. Do not promise year-long raw traces without changing policy ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

**Errors UI.** Culprit, stack traces, `error.id`; keyword fields often capped (~1024 chars). Link errors to transactions for digs.

**Dependencies.** Window into uninstrumented downstreams (DBs, third parties): latency, throughput, failed transaction rate. **Dependency operations** (queries/ops breakdown) is **beta**.

**Central configuration.** Classic APM agent central config is GA; **EDOT SDK central config** is **preview** (Stack 9.1+, unavailable on Serverless per docs). UI settings override local defaults when reachable—still set sane local defaults for offline Agent/APM Server.

**RUM / UX / source maps.** Classic RUM agent for production browser monitoring; enable `source_mapping` and upload source maps (service version required) so minified stacks decode—APM Server needs read on `.apm-source-map` (and sometimes Kibana fallback privileges). Mobile sessions (EDOT Android/iOS) sit beside RUM for app digs. Synthetics = lab; RUM = field ([08](./08_Synthetics_And_Uptime.md)).

**Lambda.** Use Elastic’s APM architecture for AWS Lambda (extension / layer patterns)—do not expect a long-lived host Agent. Pair with cloud logs integration for cold starts and platform errors ([15](./15_Cloud_Integrations.md)).

**Secure intake.** Prefer API keys / secret tokens over shared passwords; TLS between agents and APM Server; built-in data filters to drop sensitive fields before index ([delete sensitive data](https://www.elastic.co/docs/solutions/observability/apm/delete-sensitive-data) workflows exist when something slips through).

**Service map / discover traces.** Service Inventory and service map views show topology from span data; Discover can also search raw APM documents when the UI glosses over a field. Prefer Inventory for ops digs; use Discover when confirming field contracts.

**Jaeger note.** Jaeger intake exists for migration but is deprecated as a primary path—prefer OTLP/EDOT for new work.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Wrong secret / endpoint | Agent “ok,” empty UI |
| Clock skew | Negative durations, broken waterfalls |
| Over-instrumentation | Huge payloads, dropped spans |
| Garbage `service.name` | Unowned Service Inventory rows |
| Missing RUM origin allowlists / source maps | Partial page views; useless stacks |
| Dual APM + EDOT | Duplicate telemetry |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| First traced service | EDOT or APM agent on staging; Service Inventory entry; one latency/error rule ([13](./13_Worked_Example_First_Service.md)) |
| Custom business span | Code-level span + bounded attributes |
| Latency regression | Compare by `service.version`; check deploy markers |
| Frontend SLIs | RUM for field truth; Synthetics for critical journeys |
| Lambda | Follow Elastic APM Lambda architecture; do not invent a host Agent |
| Uninstrumented DB pain | Dependencies view → then instrument or fix the dependency |
| Source-mapped RUM error | Upload map for `service.version`; verify `.apm-source-map` readable |

**Staff checklist:** one instrument path; sampling + APM ILM documented (know default ~10d traces); trace↔log fields verified; RUM only where product owns the snippet + source maps; central-config ownership if used (note EDOT central config preview / Serverless gap); practice dig Service Inventory → trace → Discover → errors/dependencies; Lambda/mobile paths named if in scope.

## References

- [Get started with APM](https://www.elastic.co/docs/solutions/observability/apm/get-started) · [Collect application data](https://www.elastic.co/docs/solutions/observability/apm/ingest) · [Data types](https://www.elastic.co/docs/solutions/observability/apm/data-types) · [Transaction sampling](https://www.elastic.co/docs/solutions/observability/apm/transaction-sampling) · [APM ILM](https://www.elastic.co/docs/solutions/observability/apm/index-lifecycle-management) · [Errors](https://www.elastic.co/docs/solutions/observability/apm/errors) · [Dependencies](https://www.elastic.co/docs/solutions/observability/apm/dependencies) · [OpenTelemetry with APM](https://www.elastic.co/docs/solutions/observability/apm/opentelemetry) · [User Experience / RUM](https://www.elastic.co/docs/solutions/observability/applications/user-experience) · [Create/upload source maps](https://www.elastic.co/docs/solutions/observability/apm/apm-agents/create-upload-source-maps-rum)  
- [06 Metrics](./06_Metrics_Infra_And_Hosts.md) · [08 Synthetics](./08_Synthetics_And_Uptime.md) · [10 OTel](./10_OpenTelemetry_To_Elastic.md)
