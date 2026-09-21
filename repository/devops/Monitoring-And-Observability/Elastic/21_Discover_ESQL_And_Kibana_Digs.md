# 21 — Discover, ES|QL, and Kibana digs

[← Previous](./20_API_Fleet_Automation_And_RBAC.md) · [README](./README.md) · [Next →](./22_CI_CD_Observability.md)

## 1. Concepts — the glass for every signal

Observability apps (Logs, APM, Hosts) are opinionated lenses. **Discover** is the general-purpose dig surface over Elasticsearch documents: search/filter, inspect fields, pattern-analyze logs, save sessions, and pin findings to dashboards or alerts.

| Tool | Job |
|------|-----|
| **Discover** | Ad-hoc explore; field stats; document compare; pattern analysis |
| **KQL / Lucene** | Classic Kibana filter/query bar languages |
| **ES\|QL** | Piped query language for powerful exploration and on-the-fly charts |
| **Data views** | Which indices/streams Discover sees |
| **Dashboards / Lens** | Durable views for on-call and stakeholders |
| **Dev Tools Console** | Raw Elasticsearch APIs when UI abstractions hide the truth |

**Query literacy.** Elasticsearch makes documents **searchable** (full-text, filters, vectors) and **aggregatable** (counts, date histograms, terms). Observability digs are usually filter + time + a few aggregations—not a second warehouse. Prefer **structured fields** you indexed on purpose over hunting free text forever ([05](./05_Logs_Ingest_Discover_And_Streams.md)).

**Logs Essentials vs Complete.** Discover/dashboards exist on both serverless tiers; ML/pattern analysis and some AI-assisted digs need **Complete** ([01](./01_What_Is_Elastic_Observability_And_When.md), [03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).

**Plain language:** When the APM UI lies or is empty, Discover is where you prove whether the documents exist.

**Disconfirm:** Pretty Hosts/APM screens ≠ you can dig arbitrary fields. Saving nothing from Discover ≠ a reusable dig path ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**Confirm:** Default data view for on-call? ES|QL vs KQL skill on the team? Who can create alerts from Discover searches?

## 2. Advanced — correlation, CPS, background search

**Correlation fields.** Practice Discover filters on `service.name`, `trace.id`, `host.name`, and OTel `resource.attributes.*` ([10](./10_OpenTelemetry_To_Elastic.md)). Save column layouts so on-call does not rebuild the dig every page.

**Cross-project search (CPS).** On Serverless, Discover may show linked projects by default while some Observability apps stay origin-scoped—counts can disagree when navigating ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md), [14](./14_What_To_Enable_Next_And_When_Not.md)). Identify origin vs linked docs before blaming ingest.

**ES|QL vs KQL.** KQL is fine for quick filters; ES|QL shines for pipes, stats, and charts from the query itself—keep a cheat sheet of three digs you actually run (error rate by `service.name`, top hosts, trace id lookup).

**Pattern analysis / change points.** Use to find outliers in unstructured logs; still fix structure at ingest ([05](./05_Logs_Ingest_Discover_And_Streams.md), [16](./16_Streams_Processors_And_Data_Quality.md)).

**Runtime fields.** Handy for one-off digs; don’t permanently paper over bad mappings—promote winners into templates/pipelines.

**Background search.** Heavy queries can run async—know when your tier supports it so on-call doesn’t freeze the browser.

**Alerts from Discover.** Creating a rule from a search is powerful and dangerous—every such rule needs an owner and silence path ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

**Machine learning (literacy).** Anomaly jobs and inventory rules live near alerting—Discover validates the underlying docs those jobs see.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Wrong data view | “No results” while APM shows traffic |
| Mapping conflict | Field is both text and keyword; aggregations break |
| CPS scope mismatch | Discover vs Streams/APM different counts |
| Unbounded `*` queries | Cluster heat, slow digs |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| Prove ingest | Discover: filter `_index` / data stream + `@timestamp` last 15m |
| Trace → logs | Copy `trace.id` from APM → Discover filter |
| On-call starter | Saved Discover session per tier-1 service with columns fixed |
| Dashboard | Lens from ES\|QL or aggregatable fields; link from alert |
| Mapping debug | Inspect ignored fields / data set quality ([16](./16_Streams_Processors_And_Data_Quality.md)) |

**Staff checklist:** on-call data view documented; one saved search per tier-1 service; ES\|QL cheat sheet for common filters; alert-from-search only with owners; practice dig monthly.

## References

- [Discover](https://www.elastic.co/docs/explore-analyze/discover) · [Try ES\|QL](https://www.elastic.co/docs/explore-analyze/discover/try-esql) · [Query and filter](https://www.elastic.co/docs/explore-analyze/query-filter) · [Dashboards](https://www.elastic.co/docs/explore-analyze/dashboards)  
- [05 Logs](./05_Logs_Ingest_Discover_And_Streams.md) · [09 Alerting](./09_Alerting_SLOs_And_Incident_Management.md) · [22 CI/CD](./22_CI_CD_Observability.md)
