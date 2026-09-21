# 05 — Logs: ingest, Discover, and Streams

[← Previous](./04_Agent_Fleet_Beats_And_Logstash.md) · [README](./README.md) · [Next →](./06_Metrics_Infra_And_Hosts.md)

## 1. Concepts — getting logs searchable

Logs are timestamped events. Elastic’s advantage is **search**: full-text, structured fields, ES\|QL, pattern analysis. That power costs storage and mapping discipline—unlike label-cheap [Loki](../Loki/README.md).

### Ship paths

| Path | Prefer when |
|------|-------------|
| **Elastic Agent + integrations** | Known sources (system, K8s, Nginx, cloud); Fleet-managed estates |
| **EDOT Collector / SDKs** | OTel-native apps; shared logs+metrics+traces pipeline |
| **Filebeat** | Legacy or specialized file ship |
| **Logstash** | Complex parse/enrich/route before index; multi-dest |
| **Custom / Automatic Import** | No integration; sample-driven custom package (Complete / licensed paths) |
| **Cloud forwarders** | Managed services without Agent (Firehose, etc.—[15](./15_Cloud_Integrations.md)) |

**Plain language:** Point a supported shipper at Elasticsearch, parse enough structure to filter, retain what on-call needs—not every debug line forever.

### Explore and reshape

| Surface | Job |
|---------|-----|
| **Discover / Logs UI** | Search, filter, surrounding context |
| **ES\|QL** | Expressive querying across observability data ([21](./21_Discover_ESQL_And_Kibana_Digs.md)) |
| **Parse & route** | Dissect/grok/set at ingest; **reroute** processors to other data streams |
| **Pattern analysis / categorize** | Cluster unstructured messages when formats drift |
| **Data set quality** | Degraded docs / failure store signals when parse collapses |

Classic naming literacy: data streams often look like `logs-<dataset>-<namespace>` (e.g. `logs-system.syslog-default`); backing indices appear as `.ds-…`. Prefer extracting `@timestamp`, `log.level`, `service.name`, `host.name` so filters work—not only `message` match queries.

### Classic data streams vs Wired Streams

| Mode | Idea | Status literacy |
|------|------|-----------------|
| **Classic ingestion** | Standard Elastic data streams / integrations; you manage streams and often ILM ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) | GA baseline |
| **Wired Streams** (Streams) | Managed log hierarchy: ship to a root endpoint; partition into child streams with inherited mappings, processors, retention ([16](./16_Streams_Processors_And_Data_Quality.md)) | **Preview** on Serverless and early Stack 9.x; **GA** from Stack **9.2+** (confirm your version) |

Wired Streams suit new/custom/mixed-format logs and centralized retention/routing. Classic suits existing integration-led estates. Metrics and traces typically continue on standard data streams even when logs use Wired Streams.

**Endpoints (Wired):** on Serverless / Stack **9.4+**, prefer `logs.otel` (OTel-native; ECS names translated) or `logs.ecs` (preserve ECS). On Stack **9.2–9.3**, the endpoint is often just `logs`. Shippers set e.g. `attributes["elasticsearch.index"]` / Filebeat index accordingly.

**Disconfirm:** Shipping raw multiline chaos without parse ≠ “having logs.” Discover screenshots ≠ retention policy. Wired Streams enabled ≠ metrics/APM automatically re-architected. Full-text on every access-log line forever ≠ free.

**Confirm:** Ship path per env? Parse at Agent, ingest pipeline, Streams, or Logstash? Retention/ILM or Streams retention owners? PII redaction before index? Classic vs Wired decided per version?

## 2. Advanced — quality, cost, correlation

**Structured logging first.** JSON with stable keys beats heroic grok ([parent 16](../16_Structured_Logging.md)). Unbounded keys recreate mapping explosions ([02](./02_Architecture_Stack_And_Data_Plane.md)).

**Ingest pipeline pattern.** Simulate pipelines in Dev Tools before prod; extract fields then reroute by severity/service into dedicated streams. Prefer Agent/integration parsers when they exist; use Streams UI processors when you want centralized UI-owned transforms without API ceremony.

**Pattern analysis.** Discover can run categorization on a text field (e.g. `message`) to cluster unstructured shapes—**technical preview** on some surfaces. Use to filter for/out noisy categories during digs, not as a substitute for structured logging.

**Application log paths.** Prefer ECS-formatted JSON from the app; otherwise Agent/Filebeat/EDOT file receivers with multiline rules. APM agents can also ship app logs—pick one primary path so you do not double-index ([07](./07_APM_Tracing_And_RUM.md)).

**Cost levers.** Drop noisy namespaces at Agent; index only needed fields; shorten hot retention; sample or route debug elsewhere. Full-text on high-volume access logs is a budget decision ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md), [parent 30](../30_Telemetry_Cost_And_FinOps.md)).

**Correlation.** Inject `trace.id` / OTel context into logs so APM digs land in Discover (`trace.id`, `transaction.id`, or `attributes.trace_id` / resource attrs)—[07](./07_APM_Tracing_And_RUM.md), [parent 21](../21_Correlation_And_Dig_Methodology.md).

**Vs Loki.** Loki: cheap labels, weaker free-text. Elastic: richer search, higher storage/ops cost. Pick by dig style, not brand loyalty.

**Wired Streams permissions literacy.** Managing Streams needs broad cluster privileges (`manage_index_templates`, ingest pipeline manage, data stream lifecycle/failure store manage, …) or Serverless Admin; viewers get limited access. Do not grant Streams admin to every on-call engineer.

**Discover dig tip.** Start from a known `service.name` + time range, then add `trace.id` / `log.level` filters; use surrounding documents for multiline context. ES\|QL belongs in deeper digs ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Multiline / wrong codec | Broken events; useless messages |
| Clock skew | “Missing” logs in the wrong time window |
| Dual index patterns / data views | On-call searches the empty view |
| No ILM on classic streams | Disk full |
| Wired endpoint wrong for Stack version | 4xx / silent drop |
| Parse success collapses after deploy | Degraded docs spike; alert if you wired one ([09](./09_Alerting_SLOs_And_Incident_Management.md)) |

## 3. Applications — use cases

| Use case | What “good” looks like |
|----------|------------------------|
| First host logs | System integration → Logs UI within minutes |
| App logs + APM | Shared `service.name` + trace IDs in log lines |
| Custom vendor dump | Automatic Import or Streams parse; then tighten mappings |
| High-volume edge | Filter at Agent; Logstash only if multi-dest ETL needed |
| New greenfield logs | Consider Wired Streams if Stack/Serverless version supports GA/preview you accept |
| Unstructured flood dig | Pattern analysis on `message`; filter out noise categories; then fix app format |

**Staff checklist:** primary ship path written; data view/stream named for on-call; parse owned; retention set; PII policy; practice one Discover dig from a staging error; document classic vs Wired (and endpoint `logs` vs `logs.otel`/`logs.ecs` for your version); contrast when Loki would be cheaper for pure K8s streams; degraded-docs alert if parse is critical ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

## References

- [Log monitoring](https://www.elastic.co/docs/solutions/observability/logs) · [Explore logs](https://www.elastic.co/docs/solutions/observability/logs/explore-logs) · [Parse and route](https://www.elastic.co/docs/solutions/observability/logs/parse-route-logs) · [Streams / get data in](https://www.elastic.co/docs/solutions/observability/streams/get-data-in) · [Discover](https://www.elastic.co/docs/explore-analyze/discover) · [Pattern analysis](https://www.elastic.co/docs/solutions/observability/logs/run-pattern-analysis-on-log-data) · [Data set quality](https://www.elastic.co/docs/solutions/observability/data-set-quality-monitoring)  
- [04 Agent](./04_Agent_Fleet_Beats_And_Logstash.md) · [06 Metrics](./06_Metrics_Infra_And_Hosts.md) · [11 ILM](./11_ILM_Data_Tiers_Retention_And_Cost.md) · [16 Streams](./16_Streams_Processors_And_Data_Quality.md) · [Loki](../Loki/README.md)
