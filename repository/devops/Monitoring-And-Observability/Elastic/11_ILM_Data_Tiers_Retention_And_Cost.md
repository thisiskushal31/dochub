# 11 — ILM, data tiers, retention, and cost

[← Previous](./10_OpenTelemetry_To_Elastic.md) · [README](./README.md) · [Next →](./12_Operations_Pitfalls_And_Staff_Checklist.md)

## 1. Concepts — what you pay for and how data ages

Elastic Observability cost is dominated by **how much you index**, **how long you keep it hot**, and **how expensive the hardware (or Cloud SKU) is** for that tier. Time-series logs and metrics should move through **data tiers**; content indices (catalogs, configs, most system indices) stay on the **content** tier for their whole life.

| Tier | Job | Storage shape | Typical signal |
|------|-----|---------------|----------------|
| **Hot** | Ingest + frequent search | Fast SSD; replicas | Last hours/days |
| **Warm** | Less frequent search | Still update-capable; replicas | Recent weeks |
| **Cold** | Infrequent search | Fully mounted searchable snapshots optional (~50% less local disk vs replicas) | Months; compliance digs |
| **Frozen** | Rare search | Partially mounted searchable snapshots; local cache + object storage | Years; forensics |

**Index Lifecycle Management (ILM)** (Stack only — **unavailable on serverless**) automates rollover, migrate, shrink/forcemerge, downsample, searchable-snapshot, and delete on versioned Stack deployments. Policies evaluate phases (`hot` → `warm` → `cold` → `frozen` → `delete`) against age/size/doc conditions. Prefer applying ILM via **data streams** (one named resource) over hand-managing daily indices.

**Data stream lifecycle (DLM)** is the simpler retention/storage tool—**the** lifecycle option on **serverless**, and available on Stack too. It rolls over, tail-merges small segments, optionally downsamples, can move older backing indices to searchable snapshots (Stack 9.5+; not serverless), then deletes by **generation_time** (minimum retention, not exact delete clock). Prefer data streams over manual aliases for logs/metrics.

Highest DevOps failure modes:

1. **No ILM / retention** → disk full, emergency deletes ([12](./12_Operations_Pitfalls_And_Staff_Checklist.md))  
2. **Everything hot forever** → Cloud bill or bare-metal SSD waste ([parent 30](../30_Telemetry_Cost_And_FinOps.md))  
3. **Mapping / field explosion** → heap pressure, reject maps, red cluster ([05](./05_Logs_Ingest_Discover_And_Streams.md))  
4. **Infinite cardinality** in metrics/labels → same pain as Prom/Datadog ([parent 7](../7_Cardinality_And_Label_Contracts.md))

| Control | Practice |
|---------|----------|
| Rollover | Size/age/docs before shards get huge (ILM max_size / DLM default rollover) |
| Retention | Align delete/DLM retention with compliance + dig needs |
| Tier capacity | Warm/cold/frozen **nodes exist** before policy migrates there |
| Snapshot repo | Required for searchable snapshots / frozen / cold fully-mounted |
| Mapping discipline | ECS / OTel fields; never put UUIDs in *field names* |
| Chargeback | `service` / `team` on data streams; weekly ingest volume review |
| Built-in policies | Integrations install default ILM—**customize day one** |

**Disconfirm:** “Cold storage is free to query.” Frozen searches are often orders of magnitude slower. Cloud invoice ≠ “we have Loki-cheap labels.” Dual ELK+Loki with no retention owner doubles cost ([Loki](../Loki/README.md)). Serverless “no ILM” ≠ free storage—you still pay ingest/retention dimensions.

**Confirm:** Who owns ILM (or serverless DLM retention) per data stream? Hot retention days written down? Mapping changes require review? Snapshot repo restore-tested?

## 2. Advanced — searchable snapshots, downsample, rollup literacy, serverless

**Searchable snapshots.** Keep indices searchable while most bytes live in the snapshot repository. **Cold** often uses **fully mounted** indices (recover from snapshot on failure; fewer/no replicas → ~50% disk). **Frozen** uses **partially mounted** indices (local cache + pull from object storage; searches slower). Plan **query SLAs** before moving SLI evidence to frozen. Unequal hardware inside a tier causes hot spotting—same profile per tier.

**Downsampling (preferred).** For **time series data streams (TSDS)**, ILM/DLM can aggregate metrics into fixed intervals (min/max/sum/value_count/avg for gauges; last value for counters). Cuts historical storage while keeping chartable trends. Configure `after` intervals in the template/lifecycle—not a separate search DSL.

**Rollup (deprecated literacy).** Rollup jobs (deprecated 8.11+, removal planned) summarized old high-granularity docs into reduced-granularity ones with `/_rollup_search`. **Do not start new rollup jobs**—migrate eligible TSDS workloads to **downsampling**. Rollup that is not “time + all dimensions” may not migrate cleanly.

**Cardinality and mapping explosion.** Dynamic mapping that creates a new field per request parameter, user id, or UUID in the field *name* exhausts cluster state and heap. Prefer nested/keyword values under stable names; drop high-card keys at Agent/Fleet or Streams processors ([16](./16_Streams_Processors_And_Data_Quality.md)). Metrics with unbounded dimensions hurt like custom metrics elsewhere ([Datadog/04](../Datadog/04_Metrics_Tags_And_Cardinality_Cost.md)).

**Serverless vs Stack billing.** On Elastic Cloud Hosted you feel node sizes and tiers; on serverless Elastic manages storage performance—you set retention/project settings and feel **ingest + retention** dimensions. Either way the cheapest byte is never indexed—filter at Agent before “keep forever on frozen.”

**Cross-project search (CPS).** On serverless, CPS lets Discover/dashboards query linked projects; Observability app scope varies—volume in Discover can disagree with origin-scoped apps ([14](./14_What_To_Enable_Next_And_When_Not.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md)). Plan retention **per project**, not only origin.

**Pair with SLM.** Snapshot lifecycle so restore drills are not hope. ILM errors need `GET …/_ilm/explain` before capacity panic ([12](./12_Operations_Pitfalls_And_Staff_Checklist.md)).

**ILM phases and actions (Stack literacy).** Phases: hot (actively updated/queried) → warm (infrequent updates) → cold (infrequent queries OK slower) → frozen (rare queries OK very slow) → delete. Transitions use **min_age** (must increase across phases; after rollover, age is relative to rollover time). Hot actions include priority, rollover, read-only, downsample, shrink, forcemerge, searchable snapshot. Warm/cold add allocate/migrate; frozen is searchable-snapshot-centric. Policy updates cache phase definitions on indices so unsafe mid-flight edits do not strand an index. All cluster nodes should run the same version before relying on policy behavior.

**Content vs time-series.** Content-tier data (catalogs, most system indices) stays content-tier for life—do not invent “warm” for product docs. Time-series streams are what climb the temperature ladder.

**ECH / ECE vs self-managed tiers.** Cloud deployments start with a shared hot+content tier; add warm/cold/frozen in the Cloud UI with safe migration. Self-managed/ECK assign `data_hot` / `data_warm` / `data_cold` / `data_frozen` / `data_content` roles explicitly. Prefer `_tier_preference` over legacy allocation filters.

## 3. Applications — use cases

| Use case | Moves |
|----------|-------|
| Disk rising | Check ILM errors; force merge / migrate stuck indices; shorten hot; add warm/cold capacity |
| Invoice shock | Drop debug at ship; shorten hot; cold→frozen for compliance-only; one ship path |
| Slow digs on old data | Keep SLO windows on hot/warm; frozen for rare forensics |
| Mapping conflict | Fix template; reindex or new data stream; stop dynamic explosion |
| Metrics history too fat | TSDS + downsample rounds; retire rollup jobs |
| New integration flood | Review default ILM day one; staging retention shorter than prod |
| Serverless project | Set stream retention explicitly; no ILM phases to “fix” |

**Staff checklist:** ILM/DLM owner named; snapshot repo tested; weekly ingest+disk review; field allowlist for custom logs; never “keep forever on hot”; downsample preferred over rollup; CPS retention ownership clear if multi-project.


**Policy ownership and change control.** Treat ILM/DLM edits like production config: PR or ticket, staging soak, then prod. Built-in integration policies (Agent/Beats/Logstash) install defaults—clone and rename before shortening hot retention so upgrades do not silently reset your cost controls. When migrating ILM-managed streams to DLM, follow the documented migrate tutorial and set `prefer_ilm` intentionally so two managers do not fight.

**FinOps review cadence.** Weekly: top data streams by ingest GB, ILM explain errors, mapping field counts on custom streams. Monthly: hot-day budget vs actual, frozen query SLA samples, rollup→downsample debt. Chargeback only works if `service`/`team` exist before the first invoice argument ([parent 30](../30_Telemetry_Cost_And_FinOps.md)).


### Worked retention examples (literacy)

| Stream class | Hot | Warm/cold | Delete / DLM retention | Notes |
|--------------|-----|-----------|------------------------|-------|
| App debug logs | 1–3d | skip or short cold | 7–14d | Drop at Agent first |
| App info/error | 7–14d | warm 30d | 30–90d | SLO dig window on hot/warm |
| Audit / security overlap | 7d hot | cold/frozen | 365d+ | SecOps retention ≠ Obs dig SLA |
| Infra metrics TSDS | 7–14d | downsample | 90–180d | Prefer downsample over rollup |
| Profiling indices | default ~30d hot after rollover | warm | ~60d delete | Customize; serverless N/A |

Write the table for *your* estate; the numbers above are starting points, not compliance advice.

## References

- [Data tiers](https://www.elastic.co/docs/manage-data/lifecycle/data-tiers) · [ILM](https://www.elastic.co/docs/manage-data/lifecycle/index-lifecycle-management) · [Data stream lifecycle](https://www.elastic.co/docs/manage-data/lifecycle/data-stream)  
- [Searchable snapshots](https://www.elastic.co/docs/deploy-manage/tools/snapshot-and-restore/searchable-snapshots) · [Downsampling](https://www.elastic.co/docs/manage-data/data-store/data-streams/downsampling-time-series-data-stream) · [Rollup → downsample](https://www.elastic.co/docs/manage-data/lifecycle/rollup/migrating-from-rollup-to-downsampling)  
- [12 Ops](./12_Operations_Pitfalls_And_Staff_Checklist.md)
