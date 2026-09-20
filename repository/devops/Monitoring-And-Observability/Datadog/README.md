# Datadog

[← Back to Monitoring & observability](../README.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [OSS/SaaS](../26_OSS_Managed_SaaS_And_Hybrid.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [PagerDuty](../PagerDuty/README.md)

**Datadog** is a commercial **observability and security platform**: infrastructure, APM, logs, RUM, synthetics, serverless, databases, networks, CI, AI/LLM, security, and platform services in one SaaS UI. You run the open-source **Datadog Agent** (or OTLP / cloud integrations), tag with `env` / `service` / `version`, then dig and page in the app.

```text
Apps · hosts · K8s · serverless · cloud APIs
                    │
                    ▼
     Datadog Agent / OTel / Forwarder / integrations
                    │
                    ▼
              Datadog SaaS
     metrics · logs · traces · RUM · security · …
                    │
                    ▼
     Dashboards · Monitors · SLOs · Incidents · pages
```

### How to use this folder

| Question | Start |
|----------|--------|
| What is Datadog? | [01](./01_What_Is_Datadog_And_When.md) |
| How do I run it? | [03](./03_Install_Host_Container_And_Kubernetes.md) → [13](./13_Worked_Example_First_Service.md) |
| How do I dig without drowning in cost? | [02](./02_Architecture_Agent_And_Data_Plane.md), [04](./04_Metrics_Tags_And_Cardinality_Cost.md), [11](./11_Cost_Governance_And_Account_Hygiene.md) |
| What else does Datadog offer? | [14](./14_What_To_Enable_Next_And_When_Not.md) (full map) → [15](./15_Serverless_And_Cloud_Integrations.md)–[26](./26_API_Terraform_CLI_And_Account_Admin.md) |

Parent `0–37` = monitoring/observability **jobs**. This folder = **Datadog the product**, end to end. OSS shape: [Prometheus](../Prometheus/README.md) + [Grafana](../Grafana/README.md).

| | |
|--|--|
| **What for** | One vendor for infra + APM + logs + security/CI/AI adjacent products |
| **When** | Speed, thin platform team, or org standard on Datadog |
| **Why not** | Uncontrolled cardinality/ingest; PromQL/LGTM-first mandate; cloud audit still required ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |

**Suggested core path:** `01 → 03 → 04 → 06 → 08 → 13`, then open [14](./14_What_To_Enable_Next_And_When_Not.md) for everything else.

## Chapters

### Core loop

| # | File | Focus |
|---|------|--------|
| 01 | [What is Datadog and when](./01_What_Is_Datadog_And_When.md) | Platform; fit |
| 02 | [Architecture, Agent, data plane](./02_Architecture_Agent_And_Data_Plane.md) | Agent; unified tags |
| 03 | [Install — host, container, K8s](./03_Install_Host_Container_And_Kubernetes.md) | How to run |
| 04 | [Metrics, tags, cardinality cost](./04_Metrics_Tags_And_Cardinality_Cost.md) | Custom metrics bill |
| 05 | [Logs, pipelines, indexes](./05_Logs_Pipelines_And_Indexes.md) | Collect; scrub |
| 06 | [APM, tracing, correlation](./06_APM_Tracing_And_Correlation.md) | Instrument; dig |
| 07 | [RUM, synthetics, client signals](./07_RUM_Synthetics_And_Client_Signals.md) | Users + probes |
| 08 | [Monitors, SLOs, dashboards](./08_Monitors_SLOs_And_Dashboards.md) | Detect → page |
| 09 | [Containers, K8s, infrastructure](./09_Containers_Kubernetes_And_Infrastructure.md) | Cluster / host |
| 10 | [OpenTelemetry to Datadog](./10_OpenTelemetry_To_Datadog.md) | OTel / DDOT |
| 11 | [Cost governance and account hygiene](./11_Cost_Governance_And_Account_Hygiene.md) | Usage; keys |
| 12 | [Operations, pitfalls, staff checklist](./12_Operations_Pitfalls_And_Staff_Checklist.md) | Day-2 |
| 13 | [Worked example — first service](./13_Worked_Example_First_Service.md) | End-to-end |
| 14 | [What to enable next (full offering map)](./14_What_To_Enable_Next_And_When_Not.md) | Entire catalog index |

### Full platform

| # | File | Focus |
|---|------|--------|
| 15 | [Serverless and cloud integrations](./15_Serverless_And_Cloud_Integrations.md) | Lambda, Azure, GCP, cloud APIs |
| 16 | [Database, Data Streams, data jobs](./16_Database_Data_Streams_And_Data_Jobs.md) | DBM; queues/streams |
| 17 | [Network, USM, GPU](./17_Network_USM_And_GPU_Monitoring.md) | CNM; no-code golden signals; GPUs |
| 18 | [Profiler, Error Tracking, Watchdog, events](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) | Code hotspots; AI insights |
| 19 | [Incident, workflows, collaboration](./19_Incident_Workflows_And_Collaboration.md) | Incidents; Actions; notebooks |
| 20 | [Security products](./20_Security_Products.md) | SIEM, CSPM, AAP, Code Security, AI Guard, SDS |
| 21 | [CI Visibility, testing, delivery gates](./21_CI_Visibility_Testing_And_Delivery_Gates.md) | Pipelines; Continuous Testing |
| 22 | [Observability Pipelines](./22_Observability_Pipelines.md) | Route/control telemetry |
| 23 | [LLM Observability, Bits AI, MCP](./23_LLM_Observability_Bits_AI_And_MCP.md) | AI apps and agents |
| 24 | [Feature flags, experiments, product analytics](./24_Feature_Flags_Experiments_And_Product_Analytics.md) | Release + product |
| 25 | [Cloud Cost, IDP, platform services](./25_Cloud_Cost_IDP_And_Platform_Services.md) | FinOps; portal; integrations |
| 26 | [API, Terraform, CLI, account admin](./26_API_Terraform_CLI_And_Account_Admin.md) | Automation; RBAC; audit |

## References

- [Datadog docs](https://docs.datadoghq.com/) · [Getting started](https://docs.datadoghq.com/getting_started/) · [Product](https://www.datadoghq.com/product/)  
- [Agent](https://docs.datadoghq.com/agent/) · [Security](https://docs.datadoghq.com/security/) · [OpenTelemetry](https://docs.datadoghq.com/opentelemetry/) · [API](https://docs.datadoghq.com/api/)  
