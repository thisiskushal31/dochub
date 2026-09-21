# 02 — Architecture, stack, and data plane

[← Previous](./01_What_Is_Elastic_Observability_And_When.md) · [README](./README.md) · [Next →](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)

## 1. Concepts — how the pieces fit

Every Elastic deployment shares the same core. Observability apps are opinionated lenses over indices and **data streams**, not a second database.

| Component | Job |
|-----------|-----|
| **Elasticsearch** | Index, search, aggregate; distributed store (nodes, shards, replicas) |
| **Kibana** | Dig UI: Discover, dashboards, Observability apps, Fleet, rules |
| **Elastic Agent + Fleet** | Primary modern ship path; policies + integrations |
| **Logstash** | Complex ETL / multi-source normalize before ES |
| **Beats** | Legacy/specialized shippers (Filebeat, Metricbeat, Heartbeat, …) |
| **APM Server / intake** | Validates/processes agent or OTel spans into ES documents |
| **EDOT** | Elastic’s supported OTel Collector + language SDKs ([10](./10_OpenTelemetry_To_Elastic.md)) |

**Plain language:** Shippers write JSON documents into Elasticsearch; Kibana is the glass. Correlation is a field contract (`service.name`, `trace.id` / OTel `trace_id`, `resource.attributes.*`), not magic ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Elasticsearch literacy (nodes, shards, streams)

| Idea | Why you care |
|------|----------------|
| **Cluster / node** | Capacity and HA; roles (`master`, `data`, `ingest`, `transform`, …) matter for SLOs and pipelines |
| **Index** | Fundamental storage unit; mappings define searchable fields |
| **Shard / replica** | Primaries fixed at create time; replicas changeable. Wrong shard count = slow or red clusters |
| **Data stream** | Recommended for timestamped append-only logs/metrics/traces; backing indices roll behind one stream name |
| **Mapping** | Dynamic vs explicit; high-cardinality keywords explode heap |
| **Ingest pipeline** | Processors (dissect, grok, set, reroute, …) at index time |
| **ILM / data tiers** | Hot → warm → cold → frozen (or Serverless-managed storage / data stream lifecycle) |
| **Data view** | Kibana’s window onto indices/streams for Discover |

Serverless abstracts nodes/shards into a Search AI Lake–style managed plane; you still own field discipline and retention settings. Self-managed and ECH still need shard sizing literacy ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md), [11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

**Near-real-time search.** Newly indexed docs become searchable within seconds (refresh interval)—not Instant-everywhere magic. Digs that assume “I just logged this” must allow for refresh lag and clock skew.

**Templates and aliases.** Index templates (often component templates like `*@custom` for APM) apply mappings/settings/ILM when streams roll. Aliases are logical pointers—useful for cutovers, not a substitute for fixing the write path.

### Canonical dig path

1. **Symptom** — Hosts / Service Inventory / Synthetics / alert.  
2. **Scope** — time range + `service.name` / host / K8s labels / `resource.attributes.*`.  
3. **Trace or metric spike** — Applications UI or Infrastructure.  
4. **Logs** — Discover / Logs UI with the same identifiers (`trace.id`, `transaction.id`, or OTel trace id under attributes).  
5. **Action** — rule already fired? Case open? Fix + retention lesson ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

**Disconfirm:** More dashboards ≠ architecture. Kibana without healthy ES ≠ observability. Indexing every raw field forever ≠ “keeping evidence.” Dynamic mapping of request IDs as keywords ≠ “flexibility.”

**Confirm:** What is the write path (Agent vs EDOT vs Logstash)? Which data streams hold prod logs/metrics/traces? Who owns ILM and mapping explosions? Which data views do on-call open first?

## 2. Advanced — cardinality, tiers, ingest placement

**Mapping / cardinality.** Prefer ECS-ish / OTel conventions; drop or hash noise at ingest. Unbounded keys (per-user IDs as field *names*) recreate mapping explosions and rejected docs.

**Hot spotting.** Uneven shard allocation or mixed hardware in a tier creates “one node always red” mysteries. Same-tier nodes should share a hardware profile; use allocation awareness for racks/AZs when self-managing.

**ILM vs “keep forever.”** No policy → disk full / write blocks. Aggressive freeze without query expectations → “logs disappeared” on-call myths. Document what cold/frozen can still answer ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)). APM defaults are aggressive on raw traces (often ~10 days)—know the stream names (`traces-apm`, `logs-apm.error`, aggregated `metrics-apm.*`) before promising year-long flame graphs ([07](./07_APM_Tracing_And_RUM.md)).

**Ingest placement.** Parse at Agent/integration when possible; use Elasticsearch ingest pipelines for shared transforms; reserve Logstash for multi-destination ETL and heavy reshape ([04](./04_Agent_Fleet_Beats_And_Logstash.md), [05](./05_Logs_Ingest_Discover_And_Streams.md)). Wired Streams (preview/GA by version—[05](./05_Logs_Ingest_Discover_And_Streams.md)) centralize log routing; metrics/traces usually stay on classic data streams.

**Reference architectures (pick one write spine).** Agent→ES; Agent→Kafka→ES; Agent→Logstash→ES; Logstash multi-source; air-gapped Agent→ES. Document buffering and failure stores before prod volume ([manage-data ingest](https://www.elastic.co/docs/manage-data/ingest)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Unbounded fields | Mapping explosions, rejected docs, cluster instability |
| No ILM / retention | Disk pressure, write blocks |
| Split identifiers | Trace without logs; Hosts without matching APM service |
| Dual shippers, no plan | Double volume, conflicting fields |
| Wrong data view | On-call searches an empty pattern while data lands elsewhere |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| First dig path | One service: System integration + APM/EDOT → Hosts + Service Inventory + Discover |
| Cost control | Tiered ILM; drop debug; sample traces ([07](./07_APM_Tracing_And_RUM.md), [parent 20](../20_Sampling_Strategies.md)) |
| Security + Observability co-tenant | Spaces, roles, separate data streams; shared cluster ≠ shared blast radius ([18](./18_Security_SIEM_Literacy.md)) |
| IaC | Fleet API / policies as code; index templates and ILM in git ([20](./20_API_Fleet_Automation_And_RBAC.md)) |
| OTel dig | Filter Discover on `resource.attributes.service.name` ([10](./10_OpenTelemetry_To_Elastic.md)) |
| Mapping explosion recovery | Stop dynamic mapping of unbounded keys; fix template; reindex or wait for rollover |
| Self-monitor the platform | Stack Monitoring / AutoOps / dedicated monitoring cluster—do not only watch app hosts |

**Write-path sketch (draw this once)**

```text
[App / Host / K8s]
   → Agent | EDOT | Logstash | Beats
   → (optional Kafka / Logstash buffer)
   → Elasticsearch data streams (logs-* | metrics-* | traces-*)
   → Kibana: Hosts | Service Inventory | Discover | Rules
```

**Staff checklist:** draw the write path; name prod data streams and data views; set ILM before week-two growth; pick correlation keys (`service.name`, `trace.id` / OTel attrs); alert on cluster/disk health itself; practice one dig in staging; document which node roles exist for SLO transforms (`transform`, `ingest`).

## References

- [The Stack](https://www.elastic.co/docs/get-started/the-stack) · [Data store](https://www.elastic.co/docs/manage-data/data-store) · [Data streams](https://www.elastic.co/docs/manage-data/data-store/data-streams) · [Clusters, nodes, shards](https://www.elastic.co/docs/deploy-manage/distributed-architecture/clusters-nodes-shards) · [Distributed architecture](https://www.elastic.co/docs/deploy-manage/distributed-architecture) · [Ingest overview](https://www.elastic.co/docs/manage-data/ingest) · [Data tiers](https://www.elastic.co/docs/manage-data/lifecycle/data-tiers) · [ILM](https://www.elastic.co/docs/manage-data/lifecycle/index-lifecycle-management)  
- [01 When](./01_What_Is_Elastic_Observability_And_When.md) · [03 Deploy](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)
