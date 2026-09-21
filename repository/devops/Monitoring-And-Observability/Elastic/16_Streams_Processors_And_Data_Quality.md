# 16 — Streams, processors, and data quality

[← Previous](./15_Cloud_Integrations.md) · [README](./README.md) · [Next →](./17_Profiling_And_Network_Topology.md)

## 1. Concepts — structure logs so digs are cheap

**Streams** is a Kibana-centered way to **organize, parse, route, and set retention** on Elasticsearch data streams—so you spend less time hand-writing Grok for every new format ([05](./05_Logs_Ingest_Discover_And_Streams.md)). Use it when log quality blocks correlation, not as a substitute for finishing the first-service dig ([13](./13_Worked_Example_First_Service.md)).

| Capability | Job |
|------------|-----|
| **Organize / partition** | Split by source/component without one mega-index of chaos |
| **Processors** | Extract/transform fields (grok, dissect, JSON, date, redact, drop, enrich, set/rename/remove, …) |
| **Map fields** | Align to ECS / queryable schema |
| **Retention** | Per-stream lifecycle knobs ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) |
| **Data quality** (Streams tab) | Failed + degraded documents, scores, trends, alerts |
| **Data Set Quality** page | **Beta** estate-wide overview of degraded/failed datasets |
| **Wired Streams** | **Preview**: normalized ingest endpoints; ECS↔OTel field naming |
| **Significant Events** | **Experimental**: KI extraction → ES\|QL rules → correlated incidents ([19](./19_Observability_AI.md)) |

**Processors** turn unstructured `message` into fields you can filter and join to APM (`service.name`, `trace.id`, `http.response.status_code`). Prefer drop/redact early for debug noise and secrets.

**Failed vs degraded.** **Failed** documents are rejected (mapping/pipeline) and land in a **failure store** (not silently dropped). **Degraded** documents ingest with `_ignored` fields (malformed types, ignore_malformed, field limits). Quality scores (Streams data quality): **Good** (0% failed/degraded), **Degraded** (≤3%), **Poor** (>3%). Fix processors against failure-store samples in the **Processing** tab’s data preview before prod apply.

**Disconfirm:** Streams AI suggestions ⇒ no need for field contracts. Enabling Streams org-wide day one without owners ([14](./14_What_To_Enable_Next_And_When_Not.md)). Ignoring degraded % because “data is in Discover.” Significant Events ⇒ owned SLOs.

**Confirm:** Who can edit processors? Quality score alerted? `service.name` / `trace.id` present after parse? Failure store readable by the fixer role?

## 2. Advanced — Wired Streams, Significant Events, privileges

**Wired Streams field naming (preview).** Ingest via wired endpoints normalizes fields. On current docs:

- **`logs.ecs` endpoint** — stores ECS field names as-is.  
- **`logs.otel` endpoint** — stores OTel semantic fields (`message` → `body.text`, `log.level` → `severity_text`, `host.name` → `resource.attributes.host.name`, custom → `attributes.*`) with **ECS aliases** for backward-compatible queries.

Know which endpoint your shipper uses before writing processors or ES|QL ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Significant Events / Knowledge Indicators (experimental).** Pipeline: LLM + deterministic extractors build Knowledge Indicators → generate ES|QL detection rules → change-point detections → Discovery/Judge agents promote Significant Events. Requires **Enterprise** (or trial) + GenAI connector + data in Streams. Nightshift consumes these for investigations ([19](./19_Observability_AI.md)). Treat as assistive triage, not a replacement for owned SLOs ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

**Data Set Quality (beta).** Management page across log/metric/trace/synthetic datasets: Good / Degraded / Poor by degraded-doc %; Failed docs % and failure-store jump (serverless). Needs appropriate index privileges (`monitor` on `logs-*-*` for some summaries; `read_failure_store` for failures).

**Privileges.** Managing Streams needs template/pipeline/data-stream privileges (or serverless Admin/Editor). View-only roles cannot “fix quality” in production—document break-glass.

**Vs Logstash/ingest pipelines.** Classic ingest pipelines and Logstash remain valid. Streams is the modern UI/workflow for many Observability estates; don’t run three competing parse layers on the same source.

**CPS warning.** Streams remains **origin-project scoped**—opening a stream from Discover for a linked-project document can warn and show different counts ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Cost / change control.** Better structure often reduces storage (drop + efficient fields) but AI connectors and reprocessing still cost. Baseline ingest before/after ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)). Processor edits rewrite every new document—require review; keep before/after sample docs.

**Processor toolkit (literacy).** Common building blocks: **dissect/grok** for plaintext, **json** extract, **date**, **convert**, **redact**, **drop**, **enrich**, **set/rename/remove/append**, **user-agent**, **uri-parts**, **network-direction**. Prefer dissect when delimiters are stable; grok when patterns vary. Manual pipeline configuration remains an escape hatch—do not maintain a silent second Logstash parse on the same stream.

**Operator guide for Significant Events.** KI extraction and rule generation burn LLM tokens and create alerting assets—schedule, review promoted rules, and dismiss noisy discoveries. Gaps listed on investigations (missing fields, missing connectors) are backlog items for Streams quality, not “AI failed.”

**Alerting on quality.** Create data-quality alerts when degraded or failed percentages cross your threshold; page the stream owner, not every service on-call. Pair with mapping-template review so `_ignored` does not become normal.

## 3. Applications — use cases and staff checklist

| Use case | Moves |
|----------|-------|
| Plaintext nginx / app logs | Dissect/grok → ECS; verify Discover filters |
| Mapping rejects | Data quality tab → fix processor against failure store |
| PII in messages | Redact processor; shorter retention |
| OTel + ECS mixed queries | Wired Streams aliases; standardize shipper endpoint |
| Noisy debug | Drop processor at stream; don’t keep forever on hot |
| Alert on quality | Data quality alert when degraded/failed % crosses threshold |
| Experimental triage | Significant Events / Nightshift with named owner and kill switch |

**Staff checklist:** processor change review; quality Good/Degraded/Poor thresholds alerted; failure store monitored; one parse path per source; field taxonomy linked to APM correlation; Wired Streams / Significant Events marked experimental-or-preview in runbooks; beta Data Set Quality watched by platform.


**Rollout pattern.** Pick one noisy stream (often nginx or a vendor JSON blob). Capture ten sample docs → build processors in staging → validate against failure-store samples → apply → watch quality score for 48h → then clone the pattern. Never org-enable Wired Streams or Significant Events until that first stream is Good and the field taxonomy is written ([14](./14_What_To_Enable_Next_And_When_Not.md)).

**Failure-store privileges.** Fixers need `read_failure_store` (or equivalent). If only admins can see failures, quality stays Poor forever while on-call guesses. Document break-glass for mapping emergencies separately from day-2 processor edits.


### Quality score quick reference

| Score | Failed % or degraded % | Action |
|-------|------------------------|--------|
| **Good** | 0% | Keep; still watch trends |
| **Degraded** | >0% and ≤3% | Fix top ignored fields this week |
| **Poor** | >3% | Stop new sources on this stream; fix processors/templates |

Data Set Quality (**beta**) is the estate view; each stream’s **Data quality** tab is the fix view. Use both—beta UI ≠ optional hygiene.


**Wired Streams vs classic streams.** Classic Streams organize existing data streams; Wired Streams add normalized ingest endpoints (`logs.ecs` / `logs.otel`) with field translation. Mark **preview** in runbooks; standardize on one endpoint per shipper class so processors and ES\|QL do not fork ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Retention per stream.** Configure retention on the stream after processors stabilize—do not keep Poor streams for 90 days “for forensics.” Failure-store samples are enough to fix parsers; long hot retention of garbage is pure cost ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

When quality is Good for two weeks, only then consider Significant Events / Nightshift on that stream ([19](./19_Observability_AI.md)).

## References

- [Streams](https://www.elastic.co/docs/solutions/observability/streams) · [Manage data quality](https://www.elastic.co/docs/solutions/observability/streams/manage-data-quality) · [Parse and process](https://www.elastic.co/docs/solutions/observability/streams/parse-and-process)  
- [Wired streams field naming](https://www.elastic.co/docs/solutions/observability/streams/wired-streams-field-naming) · [Significant Events](https://www.elastic.co/docs/solutions/observability/streams/significant-events) · [Data set quality](https://www.elastic.co/docs/solutions/observability/data-set-quality-monitoring)  
- [17 Profiling](./17_Profiling_And_Network_Topology.md)
