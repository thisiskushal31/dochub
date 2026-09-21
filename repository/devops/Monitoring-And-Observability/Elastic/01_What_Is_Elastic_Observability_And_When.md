# 01 — What is Elastic Observability and when

[← README](./README.md) · [Next →](./02_Architecture_Stack_And_Data_Plane.md)

## 1. Concepts — Stack vs Observability solution

**Elastic Observability** is Elastic’s product surface for logs, metrics, APM/traces, synthetics, infrastructure, SLOs, and related digs. It runs on the **Elastic Stack**: Elasticsearch (store/search), Kibana (UI), plus shippers (**Elastic Agent**/Fleet today; historically **Beats** and **Logstash**—the old **ELK** acronym). Observability is one of Elastic’s search-powered solutions alongside Search and Security—same engine, different apps and data contracts ([parent 1](../1_Why_Observability_Beats_Monitoring.md)).

| Job you already know | Elastic surface |
|----------------------|-----------------|
| Full-text log search | Logs → Discover / Logs UI / ES\|QL |
| Host / container / K8s health | Infrastructure → Hosts / Inventory |
| App latency, errors, deps | Applications → Service Inventory / APM |
| Outside-in probes | Synthetics (Uptime app is deprecated—[08](./08_Synthetics_And_Uptime.md)) |
| Wake a human | Rules → connectors (Slack, PagerDuty, …) |
| Track a reliability target | SLOs + burn-rate rules ([09](./09_Alerting_SLOs_And_Incident_Management.md)) |
| Threats / detections | Elastic Security ([18](./18_Security_SIEM_Literacy.md))—enable only after dig loop works ([14](./14_What_To_Enable_Next_And_When_Not.md)) |

**Where it runs:** self-managed Stack, **Elastic Cloud Hosted (ECH)**, **Observability Serverless**, or orchestrators (**ECK** / **ECE**)—[03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md). **Ingest:** Fleet-managed Agent + integrations, standalone Agent YAML, **EDOT** (Elastic Distribution of OpenTelemetry), classic APM agents, Logstash for heavy ETL, cloud integrations ([04](./04_Agent_Fleet_Beats_And_Logstash.md), [10](./10_OpenTelemetry_To_Elastic.md), [15](./15_Cloud_Integrations.md)).

**ELK history in one breath.** Elasticsearch + Logstash + Kibana shipped as the classic trio; Beats added lightweight per-signal shippers; Elastic Agent + Fleet collapsed “many Beats YAML files” into one policy model. You will still meet ELK runbooks—treat them as legacy topology, not the recommended greenfield path.

**Plain language:** A searchable filing cabinet for mixed telemetry—powerful queries over log bodies and correlated signals, with a heavier storage/ops model than label-cheap Loki or scrape-native Prometheus.

### First-week shape (what “started” means)

Elastic’s own get-started path: create project/deployment → collect host/K8s/cloud logs+metrics → collect app traces → add Synthetics → explore in Logs/Hosts/Applications UIs → first dashboard → first rules/SLOs. Skip enabling Security, Profiling, and AI Assistant until that loop works ([14](./14_What_To_Enable_Next_And_When_Not.md)).

### When it fits / when it does not

| Fit | Usually not |
|-----|-------------|
| Need full-text and complex log analytics | Only need K8s log streams with Prom-like labels → [Loki](../Loki/README.md) |
| Team already runs Elasticsearch / Kibana | Thin platform team that will not own ILM/mappings |
| SIEM-adjacent log estate on Elastic | Metrics-first SLO skill path → [Prometheus](../Prometheus/README.md) |
| Elastic Cloud / Serverless SKU approved | Want turnkey SaaS without Elastic mental model → [Datadog](../Datadog/README.md) |
| OTel-first exit optionality via EDOT | Need zero-ops *and* every Elastic advanced feature day one |

### Observability Serverless feature tiers (literacy)

| Tier | You get | You do not get |
|------|---------|----------------|
| **Logs Essentials** | Discover, dashboards, alerting, log-capable integrations | APM, Hosts/infra UI, Synthetics, SLOs, ML/AIOps, AI Assistant, Automatic Import, private connectivity / IP filtering |
| **Observability Complete** | Full-stack Observability surfaces above | — |

Upgrade Essentials → Complete is **permanent** (not reversible). On Essentials, integration search hides metrics-only packs; metrics dashboards from packages may appear empty—expected, not broken.

**Disconfirm:** “We have ELK” ≠ structured logging ([parent 16](../16_Structured_Logging.md)). Elastic ≠ Loki’s cost model. Buying Observability ≠ having SLOs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)). Logs Essentials ≠ Complete with features temporarily disabled.

**Confirm:** Self-managed vs Cloud vs Serverless? Which Serverless tier? Who owns Agent/Fleet and ILM? Primary dig path log-first or APM-first?

## 2. Advanced — solution sprawl, lock-in, and cost shape

**Observability vs Search vs Security.** Same Elasticsearch under many solutions. Co-tenant carefully: Spaces, roles, separate data streams. Enable Security, Search AI, Profiling, or AI Assistant only after the core dig loop works ([14](./14_What_To_Enable_Next_And_When_Not.md), [17](./17_Profiling_And_Network_Topology.md), [19](./19_Observability_AI.md)).

**Exit ramp.** Prefer **OpenTelemetry / EDOT** at the instrument layer ([10](./10_OpenTelemetry_To_Elastic.md)) when lock-in fear is high; dig in Kibana today. Do not dual-run classic APM agents and EDOT on the same process.

**Billing / ops literacy.** Serverless is usage-based (ingest + retention dimensions—read current billing docs); ECH is subscription + sized resources; self-managed TCO is mostly people (upgrades, HA, snapshots). Feature parity is not total across deploy types (plugins, CCR, audit logging, data tiers)—read the deploy comparison before executive demos ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).

**Correlation contract early.** Decide `service.name` + env/version (or OTel `resource.attributes.*`) before the third service ships—retrofitting is painful ([parent 21](../21_Correlation_And_Dig_Methodology.md), [02](./02_Architecture_Stack_And_Data_Plane.md)).

**Vs peers (honest fit).** Datadog wins on turnkey SaaS and product breadth out of the box. Prometheus + Grafana wins metrics-first SLOs. Loki wins cheap label-indexed K8s logs. Elastic wins when full-text search, shared ES estate, or Security co-location matters.

## 3. Applications — use cases and first moves

| Use case | What “good” looks like |
|----------|------------------------|
| Central searchable logs | Agent/EDOT → data stream → Discover with bounded fields ([05](./05_Logs_Ingest_Discover_And_Streams.md)) |
| First traced service | EDOT or APM agent → Service Inventory → one latency/error rule ([13](./13_Worked_Example_First_Service.md)) |
| Replace half-wired ELK | Fleet policies + ILM + one dig playbook ([02](./02_Architecture_Stack_And_Data_Plane.md)) |
| Hybrid cloud | Agent on compute + cloud integration for managed services ([15](./15_Cloud_Integrations.md)) |
| Logs-only budget experiment | Serverless Logs Essentials—know the one-way upgrade |
| OTel-first platform | EDOT standard + mOTLP/gateway; classic agents only as exceptions ([10](./10_OpenTelemetry_To_Elastic.md)) |

**Anti-patterns to refuse early**

- Buying Complete features on an Essentials project and filing “bugs.”  
- Enabling Universal Profiling, Security SIEM, and AI Assistant in week one.  
- Shipping unstructured `println` logs and expecting Datadog-like facets for free.  
- Dual-writing to Datadog *and* Elastic without a primary dig path ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**Staff checklist**

1. Pick deploy shape + region + (if Serverless) tier ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).  
2. Ship one host or cluster with Agent or EDOT ([04](./04_Agent_Fleet_Beats_And_Logstash.md)).  
3. Confirm logs or metrics in Kibana.  
4. Write who owns Fleet, ILM, billing, and pages.  
5. Instrument one service; practice metric→trace→log dig ([13](./13_Worked_Example_First_Service.md), [parent 21](../21_Correlation_And_Dig_Methodology.md)).  
6. Freeze “next enable” list—Security/Profiling/AI wait until digs work ([14](./14_What_To_Enable_Next_And_When_Not.md)).  
7. Write the peer decision (why not only Loki / Prom / Datadog) in one paragraph for the platform ADR.

## References

- [Observability docs](https://www.elastic.co/docs/solutions/observability) · [Get started](https://www.elastic.co/docs/solutions/observability/get-started) · [The Stack](https://www.elastic.co/docs/get-started/the-stack) · [Solutions overview](https://www.elastic.co/docs/get-started/introduction) · [Serverless feature tiers](https://www.elastic.co/docs/solutions/observability/observability-serverless-feature-tiers) · [Deployment options](https://www.elastic.co/docs/get-started/deployment-options)  
- [02 Architecture](./02_Architecture_Stack_And_Data_Plane.md) · [Datadog when](../Datadog/01_What_Is_Datadog_And_When.md)
