# 14 — What to enable next (full offering map)

[← Previous](./13_Worked_Example_First_Service.md) · [README](./README.md) · [Next →](./15_Cloud_Integrations.md)

## 1. Concepts — the whole platform in one place

Finish the **core reliability loop** first ([13](./13_Worked_Example_First_Service.md)): deploy → Agent/EDOT → logs/metrics/APM → alert/SLO → dig in Kibana. Then enable **one** adjacent capability at a time with an owner and an ingest/retention check ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

### Core observability (01–13)

| Need | Chapter |
|------|---------|
| What / when | [01](./01_What_Is_Elastic_Observability_And_When.md) |
| Architecture / deploy | [02](./02_Architecture_Stack_And_Data_Plane.md)–[03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) |
| Agent / Fleet / Beats | [04](./04_Agent_Fleet_Beats_And_Logstash.md) |
| Logs / metrics / APM | [05](./05_Logs_Ingest_Discover_And_Streams.md)–[07](./07_APM_Tracing_And_RUM.md) |
| Synthetics / uptime | [08](./08_Synthetics_And_Uptime.md) |
| Alerting / SLOs / incidents | [09](./09_Alerting_SLOs_And_Incident_Management.md) |
| OpenTelemetry → Elastic | [10](./10_OpenTelemetry_To_Elastic.md) |
| ILM / cost | [11](./11_ILM_Data_Tiers_Retention_And_Cost.md) |
| Day-2 ops | [12](./12_Operations_Pitfalls_And_Staff_Checklist.md) |
| First-service lab | [13](./13_Worked_Example_First_Service.md) |

### Adjacent depth (15–20)

| Offering | Chapter |
|----------|---------|
| AWS / Azure / GCP integrations | [15](./15_Cloud_Integrations.md) |
| Streams, processors, data quality | [16](./16_Streams_Processors_And_Data_Quality.md) |
| Universal Profiling, network topology | [17](./17_Profiling_And_Network_Topology.md) |
| Elastic Security (SIEM/EDR literacy) | [18](./18_Security_SIEM_Literacy.md) |
| Observability AI, Nightshift, LLM app obs | [19](./19_Observability_AI.md) |
| APIs, Fleet as code, RBAC | [20](./20_API_Fleet_Automation_And_RBAC.md) |

### Dig UI and delivery (21–22)

| Offering | Chapter |
|----------|---------|
| Discover, ES\|QL, Kibana dig patterns | [21](./21_Discover_ESQL_And_Kibana_Digs.md) |
| CI/CD observability (OTel pipelines) | [22](./22_CI_CD_Observability.md) |
| Classic ELK setup / monitoring placement | [23](./23_ELK_Classic_Setup_And_Monitoring_Placement.md) |

### Named capabilities to place on the map

| Capability | Notes | Where |
|------------|-------|-------|
| **Nightshift** | **Experimental** (Stack 9.5+ / serverless experimental): Significant Events + auto investigations + memory | [19](./19_Observability_AI.md), [16](./16_Streams_Processors_And_Data_Quality.md) |
| **LLM / agentic observability** | Provider metrics/logs + EDOT APM traces for *your* LLM apps — not the same as AI Assistant | [19](./19_Observability_AI.md) |
| **CI/CD Observability** | Jenkins/etc via OTel → EDOT Collector | [22](./22_CI_CD_Observability.md) |
| **Discover / ES\|QL** | General dig glass | [21](./21_Discover_ESQL_And_Kibana_Digs.md) |
| **Cross-project search (CPS)** | Serverless: query linked projects; app scope varies | [03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md), [11](./11_ILM_Data_Tiers_Retention_And_Cost.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md) |
| **Wired Streams** | **Preview**/beta-class field normalization endpoints | [16](./16_Streams_Processors_And_Data_Quality.md) |
| **Data set quality** | **Beta**: degraded/failed docs overview | [16](./16_Streams_Processors_And_Data_Quality.md) |

**Disconfirm:** Enabling Security + Profiling + Nightshift + AI in one week without owners. Using this map as a substitute for finishing [13](./13_Worked_Example_First_Service.md).

**Confirm:** Core loop green? Named owner + ingest baseline before the next enable? Kill criteria written?

## 2. Advanced — enablement order and when not

**Suggested order after the core loop:** (1) short ILM and mapping hygiene, (2) Streams/processors if log quality blocks digs, (3) cloud integrations for control-plane truth, (4) Synthetics on the SLO journey, (5) Discover/ES|QL fluency for diggers ([21](./21_Discover_ESQL_And_Kibana_Digs.md)), (6) Profiling when APM shows “hot method unknown,” (7) CI/CD observability when flaky builds burn you ([22](./22_CI_CD_Observability.md)), (8) Security only with a security on-call owner, (9) AI Assistant / Agent Builder with PII policy, (10) Nightshift only with Streams + Enterprise + GenAI connector and experimental acceptance, (11) Fleet/API automation when click-ops drifts.

**When NOT day one**

| Capability | Why wait |
|------------|----------|
| Elastic Security | Wrong on-call; SIEM ≠ app SLO ([18](./18_Security_SIEM_Literacy.md)) |
| Observability AI / Agent Builder | Needs connector, privilege, PII rules; assists digs, does not replace SLIs ([19](./19_Observability_AI.md)) |
| Nightshift (**experimental**) | Enterprise + Streams + GenAI; auto-rules can surprise on-call |
| Universal Profiling | Extra Agent/eBPF surface; unavailable on serverless Observability ([17](./17_Profiling_And_Network_Topology.md)) |
| Network Topology | Self-managed Kibana + SNMP Logstash path; not ECH/serverless ([17](./17_Profiling_And_Network_Topology.md)) |
| Org-wide Wired Streams / AI processors | Cost + wrong parsers without owners ([16](./16_Streams_Processors_And_Data_Quality.md)) |
| CI/CD Observability estate-wide | Second dig surface; start one pipeline ([22](./22_CI_CD_Observability.md)) |

**Vs other shapes.** Prefer [Loki](../Loki/README.md) when you want cheap label streams and Prom-shaped digs. Prefer [Datadog](../Datadog/README.md) when you want turnkey SaaS without Elastic cluster/ILM ops. Prefer Elastic when full-text search, SIEM-adjacent analytics, or existing Stack skills dominate ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)). Cloud **audit** evidence still belongs in cloud-native audit products ([31](../31_Cloud_Managed_Sinks_And_Audit_Door.md)).

## 3. Applications — use-case driven picks

| If this is your pain… | Enable next | Chapter |
|-----------------------|-------------|---------|
| Disk / invoice rising | ILM tiers + drop filters | [11](./11_ILM_Data_Tiers_Retention_And_Cost.md) |
| Unstructured logs slow digs | Streams processors / quality | [16](./16_Streams_Processors_And_Data_Quality.md) |
| “Is AWS broken or us?” | Cloud integrations | [15](./15_Cloud_Integrations.md) |
| Hot method after slow trace | Universal Profiling | [17](./17_Profiling_And_Network_Topology.md) |
| SNMP / L2–L3 blind | Network Topology (self-managed) | [17](./17_Profiling_And_Network_Topology.md) |
| Threat / endpoint alerts | Elastic Security (scoped) | [18](./18_Security_SIEM_Literacy.md) |
| Slow ES\|QL / triage | Agent Builder / AI Assistant | [19](./19_Observability_AI.md) |
| LLM product in prod | LLM observability (metrics + traces) | [19](./19_Observability_AI.md) |
| Flaky CI / no deploy correlation | CI/CD Observability | [22](./22_CI_CD_Observability.md) |
| Dig UI fluency | Discover / ES\|QL | [21](./21_Discover_ESQL_And_Kibana_Digs.md) |
| “How do we wire ELK / where does Elastic sit?” | Classic ELK + placement | [23](./23_ELK_Classic_Setup_And_Monitoring_Placement.md) |
| Multi-project serverless digs | CPS literacy + scope training | [21](./21_Discover_ESQL_And_Kibana_Digs.md) |
| Policy drift / key sprawl | Fleet API + RBAC | [20](./20_API_Fleet_Automation_And_RBAC.md) |

**Staff checklist:** one enable per week max; ingest before/after; kill criteria written; experimental features opt-in with named owner; link back to core dig path.

## References

- [Observability docs](https://www.elastic.co/docs/solutions/observability) · [Elastic products](https://www.elastic.co/observability/) · [Nightshift](https://www.elastic.co/docs/solutions/observability/nightshift/nightshift) · [CPS](https://www.elastic.co/docs/solutions/observability/cross-project-search)  
- [15 Cloud integrations](./15_Cloud_Integrations.md) · [21 Discover](./21_Discover_ESQL_And_Kibana_Digs.md) · [22 CI/CD](./22_CI_CD_Observability.md)
