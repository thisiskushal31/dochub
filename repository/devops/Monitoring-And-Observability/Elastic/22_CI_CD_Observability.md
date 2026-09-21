# 22 — CI/CD observability

[← Previous](./21_Discover_ESQL_And_Kibana_Digs.md) · [README](./README.md)

## 1. Concepts — pipelines as a production system

Elastic **CI/CD observability** treats build/deploy systems as systems to monitor: platform KPIs for admins, and pipeline speed/reliability for developers. Elastic instruments popular CI tools via **OpenTelemetry** and recommends the **EDOT Collector** (or APM Server OTLP paths) to land signals in Observability.

| Audience | What Elastic helps with |
|----------|-------------------------|
| **CI/CD admins** | Platform health (e.g. Jenkins agent pools, JVM, failure rates), anomalies, dashboards |
| **Developers** | Pipeline duration, flaky tests, failed stages, correlation to deploys |
| **SRE** | Change events next to APM latency (annotations / OTel deploy markers) |

### Architectures

| Shape | When |
|-------|------|
| **CI tools → APM Server / OTLP → Elastic** | Simple; tools speak OTel natively |
| **CI tools → EDOT Collector (edge) → Elastic (+ optional other backends)** | Ephemeral runners (otel-cli); multi-backend; lower latency to collector |

**Plain language:** Your Jenkins/GitHub Actions fleet deserves Hosts + traces too—not only the microservices it ships.

**Disconfirm:** Green microservice SLOs ≠ healthy CI (queued agents, certificate expiry, disk-full runners). Shipping every build log at full text forever ≠ CI observability.

**Confirm:** Which CI platforms are in scope? EDOT Collector ownership? What pages on pipeline failure vs app failure?

## 2. Advanced — OTel, noise, and boundaries

**OpenTelemetry first.** Prefer community OTel instrumentation for CI tools over proprietary one-offs—keeps an exit ramp ([10](./10_OpenTelemetry_To_Elastic.md), [OpenTelemetry](../OpenTelemetry/README.md)).

**Ephemeral runners.** Short-lived jobs need a nearby Collector; don’t rely on distant intake only.

**Cardinality.** Build IDs, PR numbers, and branch names explode metrics/logs—label allowlists and drop policies matter ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

**Vs app APM.** Use **annotations** / deploy markers so APM latency regressions line up with pipeline events ([07](./07_APM_Tracing_And_RUM.md))—don’t merge CI and app services under one `service.name`.

**Security.** CI logs often contain secrets—scrub at Collector; restrict Discover ([12](./12_Operations_Pitfalls_And_Staff_Checklist.md), [18](./18_Security_SIEM_Literacy.md)).

**Store CI logs in Elastic.** Pipeline logs via OTLP beside traces reduce Jenkins filesystem history pain and unify signals—still apply ILM and scrubbing ([05](./05_Logs_Ingest_Discover_And_Streams.md), [11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

**Popular tool coverage.** Docs emphasize **Jenkins** deeply (platform KPIs, JVM, pipeline traces, Errors overview, OTLP log shipping) and show **Concourse** and other OTel-native tools. Maven/Ansible-style DevOps tools appear via OTel integrations—verify your platform’s OTel plugin/exporter before promising parity.

**Admin vs developer views.** Admins dig executor starvation and CI host health; developers dig slow stages and flaky tests as traces. Same backend, different saved searches ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Vs Datadog CI Visibility.** Same job, different product—pick one primary dig plane ([Datadog/21](../Datadog/21_CI_Visibility_Testing_And_Delivery_Gates.md)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Collector down | Invisible CI; “Jenkins is fine” locally |
| Dual ship | Datadog + Elastic pages for one failed build |
| Unbounded branch labels | Metric explosion |
| Secrets in build logs | Compliance incident in Discover |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| Jenkins platform | OTel + EDOT → Jenkins health dashboard → alert on executor starvation |
| Pipeline SLO | Track p95 pipeline duration / failure rate for release train |
| Deploy correlation | Annotate APM on prod deploy; dig latency vs change |
| Flaky tests | Trends on failing test names with bounded labels |

**Staff checklist:** one CI OTel pathway diagram; scrub processors; separate data streams/ILM for CI vs app; page routes for platform vs product; enable after core app dig loop works ([14](./14_What_To_Enable_Next_And_When_Not.md)).

## References

- [CI/CD observability](https://www.elastic.co/docs/solutions/observability/cicd) · [EDOT](https://www.elastic.co/docs/reference/opentelemetry) · [APM annotations](https://www.elastic.co/docs/solutions/observability/apm)  
- [10 OTel](./10_OpenTelemetry_To_Elastic.md) · [21 Discover](./21_Discover_ESQL_And_Kibana_Digs.md) · [README](./README.md)
