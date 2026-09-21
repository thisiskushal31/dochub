# 14 — What to enable next (full offering map)

[← Previous](./13_Worked_Example_First_Service.md) · [README](./README.md) · [Next →](./15_Serverless_And_Cloud_Integrations.md)

## 1. Concepts — the whole platform in one place

Finish the **core reliability loop** first ([13](./13_Worked_Example_First_Service.md)): Agent → unified tags → metrics/APM/logs → monitors/SLOs. Then enable **one** adjacent capability at a time with an owner and a Usage check ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

### Core observability (01–13)

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

### Application and data depth (15–18)

| Offering | Chapter |
|----------|---------|
| Serverless + cloud integrations | [15](./15_Serverless_And_Cloud_Integrations.md) |
| Database Monitoring, Data Streams, data jobs | [16](./16_Database_Data_Streams_And_Data_Jobs.md) |
| Network Monitoring, USM, GPU | [17](./17_Network_USM_And_GPU_Monitoring.md) |
| Profiler, Error Tracking, Watchdog, Events | [18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) |

### Respond, secure, ship (19–22)

| Offering | Chapter |
|----------|---------|
| Incident, Workflows/Actions, Notebooks | [19](./19_Incident_Workflows_And_Collaboration.md) |
| Security (SIEM, Cloud Security, AAP, Code Security, AI Guard, SDS, Workload) | [20](./20_Security_Products.md) |
| CI Visibility, Continuous Testing, gates | [21](./21_CI_Visibility_Testing_And_Delivery_Gates.md) |
| Observability Pipelines | [22](./22_Observability_Pipelines.md) |

### AI, product, platform, admin (23–26)

| Offering | Chapter |
|----------|---------|
| LLM / Agent Observability, Bits AI, MCP | [23](./23_LLM_Observability_Bits_AI_And_MCP.md) |
| Feature Flags, Experiments, Product Analytics, Journeys | [24](./24_Feature_Flags_Experiments_And_Product_Analytics.md) |
| Cloud Cost, IDP, Cloudcraft, DDSQL, Extend, Integrations | [25](./25_Cloud_Cost_IDP_And_Platform_Services.md) |
| API, Terraform, CLI, account/RBAC/audit | [26](./26_API_Terraform_CLI_And_Account_Admin.md) |

**Disconfirm:** Enabling five products in one week without owners. Using this map as a substitute for finishing [13](./13_Worked_Example_First_Service.md).

**Confirm:** Core loop green? Named owner + Usage baseline before the next enable?

## 2. Advanced — enablement order and pitfalls

**Suggested order after the core loop:** (1) Error Tracking / Watchdog insights you will act on, (2) DBM or Data Streams if those are your digs, (3) Synthetics on the SLO journey, (4) Security SDS early if logs are broad, (5) CI Visibility when pipeline flakiness burns you, (6) everything else with a written why.

**Pitfalls**

| Pitfall | Why it hurts |
|---------|----------------|
| NPM/DBM org-wide day one | Cost + alert noise without owners |
| Security paging SRE by default | Wrong on-call; alert fatigue |
| LLM Observability without PII policy | Compliance incident |
| Observability Pipelines without on-call | Second platform nobody owns |
| Feature Flags as second system of record | Split-brain releases |

When Datadog should not be the only answer: PromQL/LGTM mandate ([Grafana](../Grafana/README.md)); budget cannot absorb SaaS cardinality; cloud **audit** evidence must stay in cloud-native audit products ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

## 3. Applications — use-case driven picks

| If this is your pain… | Enable next | Chapter |
|-----------------------|-------------|---------|
| “DB is slow” without query truth | Database Monitoring | [16](./16_Database_Data_Streams_And_Data_Jobs.md) |
| Kafka/SQS lag cascades | Data Streams | [16](./16_Database_Data_Streams_And_Data_Jobs.md) |
| Uninstrumented brownfield services | USM, then APM on critical paths | [17](./17_Network_USM_And_GPU_Monitoring.md) |
| Same exception 10k times | Error Tracking | [18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) |
| Hot method after slow trace | Continuous Profiler | [18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) |
| Sev1 chaos in Slack threads | Incident Response | [19](./19_Incident_Workflows_And_Collaboration.md) |
| Cloud misconfig / runtime threats | Security suite (scoped) | [20](./20_Security_Products.md) |
| Flaky CI / no deploy correlation | CI Visibility + deploy events | [21](./21_CI_Visibility_Testing_And_Delivery_Gates.md) |
| Log bill dominates | Observability Pipelines / exclusions | [22](./22_Observability_Pipelines.md) |
| LLM features in prod | LLM Observability + AI Guard | [23](./23_LLM_Observability_Bits_AI_And_MCP.md) |
| Chargeback fights | Cloud Cost + tag rules | [25](./25_Cloud_Cost_IDP_And_Platform_Services.md) |
| Monitor drift / key sprawl | Terraform + Audit Trail | [26](./26_API_Terraform_CLI_And_Account_Admin.md) |

**Staff checklist:** one enable per week max; Usage before/after; kill criteria written; link back to core dig path.

## References

- [Docs home](https://docs.datadoghq.com/) · [All products](https://www.datadoghq.com/product/) · [Integrations](https://docs.datadoghq.com/integrations/)  
- [15 Serverless](./15_Serverless_And_Cloud_Integrations.md)
