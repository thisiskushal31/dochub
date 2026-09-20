# 14 — What to enable next (full offering map)

[← Previous](./13_Worked_Example_First_Service.md) · [README](./README.md) · [Next →](./15_Serverless_And_Cloud_Integrations.md)

## 1. Concepts — the whole platform in one place

Finish the **core reliability loop** first ([13](./13_Worked_Example_First_Service.md)): Agent → unified tags → metrics/APM/logs → monitors/SLOs. Then enable **one** row below with an owner and a Usage check ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

### Core observability (chapters 01–13)

| Need | Chapter |
|------|---------|
| What / when | [01](./01_What_Is_Datadog_And_When.md) |
| Agent & tags | [02](./02_Architecture_Agent_And_Data_Plane.md)–[03](./03_Install_Host_Container_And_Kubernetes.md) |
| Metrics & cost | [04](./04_Metrics_Tags_And_Cardinality_Cost.md), [11](./11_Cost_Governance_And_Account_Hygiene.md) |
| Logs | [05](./05_Logs_Pipelines_And_Indexes.md) |
| APM | [06](./06_APM_Tracing_And_Correlation.md) |
| RUM / Synthetics / Session Replay | [07](./07_RUM_Synthetics_And_Client_Signals.md) |
| Monitors / SLOs / dashboards | [08](./08_Monitors_SLOs_And_Dashboards.md) |
| Containers / K8s / infra | [09](./09_Containers_Kubernetes_And_Infrastructure.md) |
| OpenTelemetry | [10](./10_OpenTelemetry_To_Datadog.md) |
| Day-2 ops | [12](./12_Operations_Pitfalls_And_Staff_Checklist.md) |

### Application & data depth

| Offering | Chapter |
|----------|---------|
| Serverless + cloud integrations | [15](./15_Serverless_And_Cloud_Integrations.md) |
| Database Monitoring, Data Streams, data jobs | [16](./16_Database_Data_Streams_And_Data_Jobs.md) |
| Network Monitoring, USM, GPU | [17](./17_Network_USM_And_GPU_Monitoring.md) |
| Profiler, Error Tracking, Watchdog, Events | [18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) |

### Respond, secure, ship

| Offering | Chapter |
|----------|---------|
| Incident, Workflows/Actions, Notebooks | [19](./19_Incident_Workflows_And_Collaboration.md) |
| Security (SIEM, Cloud Security, AAP, Code Security, AI Guard, SDS, Workload) | [20](./20_Security_Products.md) |
| CI Visibility, Continuous Testing, gates, test optimization | [21](./21_CI_Visibility_Testing_And_Delivery_Gates.md) |
| Observability Pipelines / BYOC-style routing | [22](./22_Observability_Pipelines.md) |

### AI, product, platform, admin

| Offering | Chapter |
|----------|---------|
| LLM / Agent Observability, Bits AI, MCP | [23](./23_LLM_Observability_Bits_AI_And_MCP.md) |
| Feature Flags, Experiments, Product Analytics, Journeys | [24](./24_Feature_Flags_Experiments_And_Product_Analytics.md) |
| Cloud Cost, IDP, Cloudcraft, DDSQL, Extend, Integrations | [25](./25_Cloud_Cost_IDP_And_Platform_Services.md) |
| API, Terraform, CLI, account/RBAC/audit | [26](./26_API_Terraform_CLI_And_Account_Admin.md) |

### Also part of Datadog (covered inside the chapters above)

Session Replay, Mobile app, Reference tables, Change/Deployment/PR gates, Delivery performance, Source code integration, Sensitive Data Scanner, Marketplace integrations, Partner/MSP patterns, Administrators guide topics, Disaster-recovery/org topology notes—see the linked chapter rather than a separate file for each doc bucket.

## 2. When Datadog should not be the only answer

- PromQL + self-hosted LGTM is the mandated skill/stack ([Grafana](../Grafana/README.md)).  
- Budget cannot absorb SaaS cardinality/ingest.  
- Compliance **audit** evidence must live in cloud-native audit products even if Datadog is present ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

## 3. Applications — pick next week’s enable

1. Core loop green for one service.  
2. Choose **one** non-core chapter (15–26).  
3. Re-check Usage before/after; keep a named owner.

## References

- [Docs home](https://docs.datadoghq.com/) · [All products](https://www.datadoghq.com/product/) · [Integrations](https://docs.datadoghq.com/integrations/)  
- [15 Serverless](./15_Serverless_And_Cloud_Integrations.md)
