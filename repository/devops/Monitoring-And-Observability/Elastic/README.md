# Elastic (Observability / Elastic Stack)

[← Back to Monitoring & observability](../README.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [Loki](../Loki/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog](../Datadog/README.md)

**Elastic Observability** sits on the **Elastic Stack**: **Elasticsearch** stores and searches; **Kibana** is the glass; **Elastic Agent** (Fleet-managed or standalone) plus optional **Logstash**/Beats literacy ships data. You get full-text logs, metrics, APM/RUM, synthetics, and ILM/data tiers—self-managed, Elastic Cloud, or Observability Serverless.

```text
Hosts · K8s · apps · cloud APIs · synthetics
                 │
                 ▼
   Elastic Agent / EDOT / Logstash / integrations
                 │
                 ▼
           Elasticsearch
        data streams · ILM tiers
                 │
                 ▼
              Kibana
   Discover · APM · Hosts · SLOs · alerts · Security*
```

\\*Security is an adjacent Elastic solution—literacy in [18](./18_Security_SIEM_Literacy.md), not the core observability loop.

### How to use this folder

| Question | Start |
|----------|--------|
| What is Elastic Observability? | [01](./01_What_Is_Elastic_Observability_And_When.md) |
| How do I run it? | [03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) → [04](./04_Agent_Fleet_Beats_And_Logstash.md) → [13](./13_Worked_Example_First_Service.md) |
| How do I dig without drowning the cluster? | [02](./02_Architecture_Stack_And_Data_Plane.md), [05](./05_Logs_Ingest_Discover_And_Streams.md), [11](./11_ILM_Data_Tiers_Retention_And_Cost.md) |
| How do I set up classic ELK / place Elastic in the stack? | [23](./23_ELK_Classic_Setup_And_Monitoring_Placement.md) · [03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) |
| What else does Elastic offer? | [14](./14_What_To_Enable_Next_And_When_Not.md) → [15](./15_Cloud_Integrations.md)–[22](./22_CI_CD_Observability.md) |

Parent `0–37` = monitoring/observability **jobs**. This folder = **Elastic the product**, end to end. Label-cheap logs: [Loki](../Loki/README.md). Search peer (SPL): [Splunk](../Splunk/README.md). SaaS peer: [Datadog](../Datadog/README.md).

| | |
|--|--|
| **What for** | Search-centric logs + Elastic APM/metrics in one stack; SIEM-adjacent estates |
| **When** | Full-text / complex log analytics; existing Elastic skills or Cloud/serverless SKU |
| **Why not** | Only need K8s label streams → [Loki](../Loki/README.md); metrics-first SLO → [Prometheus](../Prometheus/README.md); thin team wants turnkey SaaS without ES ops → Datadog/New Relic |

**Suggested core path:** `01 → 03 → 04 → 05 → 07 → 09 → 13`, then open [14](./14_What_To_Enable_Next_And_When_Not.md).

## Chapters

### Core loop

| # | File | Focus |
|---|------|--------|
| 01 | [What is Elastic Observability and when](./01_What_Is_Elastic_Observability_And_When.md) | Fit; vs Loki/Datadog |
| 02 | [Architecture — Stack and data plane](./02_Architecture_Stack_And_Data_Plane.md) | ES, Kibana, data streams |
| 03 | [Deploy — self-managed, Cloud, serverless](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) | Where it runs |
| 04 | [Agent, Fleet, Beats, Logstash](./04_Agent_Fleet_Beats_And_Logstash.md) | Ship and manage |
| 05 | [Logs — ingest, Discover, streams](./05_Logs_Ingest_Discover_And_Streams.md) | Full-text dig |
| 06 | [Metrics, infra, hosts](./06_Metrics_Infra_And_Hosts.md) | Hosts / K8s health |
| 07 | [APM, tracing, RUM](./07_APM_Tracing_And_RUM.md) | Services and users |
| 08 | [Synthetics and uptime](./08_Synthetics_And_Uptime.md) | Outside-in probes |
| 09 | [Alerting, SLOs, incident management](./09_Alerting_SLOs_And_Incident_Management.md) | Detect → page |
| 10 | [OpenTelemetry → Elastic](./10_OpenTelemetry_To_Elastic.md) | EDOT / OTLP |
| 11 | [ILM, data tiers, retention, cost](./11_ILM_Data_Tiers_Retention_And_Cost.md) | Storage plane |
| 12 | [Operations, pitfalls, staff checklist](./12_Operations_Pitfalls_And_Staff_Checklist.md) | Day-2 |
| 13 | [Worked example — first service](./13_Worked_Example_First_Service.md) | End-to-end |
| 14 | [What to enable next (offering map)](./14_What_To_Enable_Next_And_When_Not.md) | Full catalog index |

### Extended surface

| # | File | Focus |
|---|------|--------|
| 15 | [Cloud integrations](./15_Cloud_Integrations.md) | AWS / Azure / GCP |
| 16 | [Streams, processors, data quality](./16_Streams_Processors_And_Data_Quality.md) | Parse/route/quality |
| 17 | [Profiling and network topology](./17_Profiling_And_Network_Topology.md) | Code + net views |
| 18 | [Security SIEM literacy](./18_Security_SIEM_Literacy.md) | Adjacent Security solution |
| 19 | [Observability AI, Nightshift, LLM apps](./19_Observability_AI.md) | Assist vs Nightshift vs LLM product telemetry |
| 20 | [API, Fleet automation, RBAC](./20_API_Fleet_Automation_And_RBAC.md) | Automation; access |
| 21 | [Discover, ES\|QL, Kibana digs](./21_Discover_ESQL_And_Kibana_Digs.md) | Ad-hoc search; dashboards |
| 22 | [CI/CD observability](./22_CI_CD_Observability.md) | Pipelines as OTel traces |
| 23 | [Classic ELK setup and monitoring placement](./23_ELK_Classic_Setup_And_Monitoring_Placement.md) | ELK stand-up; where Elastic sits vs Prom/Loki/SaaS |

## References

- [Elastic docs](https://www.elastic.co/docs/) · [Observability](https://www.elastic.co/docs/solutions/observability) · [Get started / the stack](https://www.elastic.co/docs/get-started/)  
- [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) · [Fleet / Agent](https://www.elastic.co/guide/en/fleet/current/fleet-overview.html) · [APM](https://www.elastic.co/guide/en/apm/guide/current/index.html)
