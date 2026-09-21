# AppDynamics (AppD / Splunk AppDynamics)

[← Back to Monitoring & observability](../README.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [Datadog](../Datadog/README.md) · [New Relic](../New_Relic/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [PagerDuty](../PagerDuty/README.md)

**Splunk AppDynamics** (often **AppD**; Cisco / Splunk product family) is a commercial **enterprise APM** platform: **business-transaction**-centric application performance, flow maps, infrastructure correlation, end-user monitoring, and health-rule alerting—via language **app-server agents** reporting to a **Controller Tenant** (SaaS or on-premises).

```text
Apps · tiers · nodes · browsers / mobile · hosts
                    │
                    ▼
     App-server agents · Machine Agent · EUM agents
                    │
                    ▼
           Controller Tenant
     BTs · snapshots · flow maps · health rules
                    │
                    ▼
     Dig in Tenant UI · alert → page ([PagerDuty](../PagerDuty/README.md))
```

### How to use this folder

| Question | Start |
|----------|--------|
| What is AppDynamics? | [01](./01_What_Is_AppDynamics_And_When.md) |
| How do I run it? | [03](./03_SaaS_Vs_On_Prem_Controller.md) → [04](./04_Install_App_Server_Agents.md) → [14](./14_Worked_Example_First_Service.md) |
| How do I dig without drowning in BT noise? | [02](./02_Architecture_Controller_Apps_Tiers_Nodes.md) (naming / Tenant UI), [05](./05_Business_Transactions.md) (detect/exclude/limits), [06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md) (snapshots / call graphs) |
| Agent connection / SaaS vs on-prem? | [03](./03_SaaS_Vs_On_Prem_Controller.md) · [04](./04_Install_App_Server_Agents.md) (host/port/account/access key) |
| Host digs / real-user correlation? | [07](./07_Infrastructure_And_Machine_Agents.md) · [08](./08_EUM_Browser_And_Mobile.md) |
| What else does AppD offer? | [15](./15_What_To_Enable_Next_And_When_Not.md) → [09](./09_Database_Visibility_Literacy.md)–[16](./16_API_Automation_And_RBAC.md) |

Parent `0–37` = monitoring/observability **jobs**. This folder = **AppDynamics the product**, end to end. SaaS peers: [Datadog](../Datadog/README.md), [New Relic](../New_Relic/README.md). Classic SPL search (not this folder): [Splunk](../Splunk/README.md). Exit / dual-export literacy: [OpenTelemetry](../OpenTelemetry/README.md).

| | |
|--|--|
| **What for** | BT-centric APM + topology digs in estates standardized on AppD/Cisco/Splunk |
| **When** | Org owns AppDynamics; need Controller-hosted APM without standing up Tempo/Jaeger; SaaS or on-prem Controller fits policy |
| **Why not** | Already primary on Datadog/New Relic/Elastic APM; thin team that will not own BT/agent/Controller hygiene; never drop cloud audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |

**Suggested core path:** `01 → 03 → 04 → 05 → 06 → 10 → 14`, then open [15](./15_What_To_Enable_Next_And_When_Not.md).

## Chapters

### Core loop

| # | File | Focus |
|---|------|--------|
| 01 | [What is AppDynamics and when](./01_What_Is_AppDynamics_And_When.md) | Fit; vs Datadog / New Relic / Elastic / OTel |
| 02 | [Architecture — Controller, apps, tiers, nodes](./02_Architecture_Controller_Apps_Tiers_Nodes.md) | Tenant model; agents report in |
| 03 | [SaaS vs on-prem Controller](./03_SaaS_Vs_On_Prem_Controller.md) | Deploy shapes; Enterprise Console literacy |
| 04 | [Install app-server agents](./04_Install_App_Server_Agents.md) | Getting Started Wizard; naming |
| 05 | [Business transactions](./05_Business_Transactions.md) | Detection; limits; exclude noise |
| 06 | [Snapshots, call graphs, troubleshooting](./06_Snapshots_Call_Graphs_And_Troubleshooting.md) | Slow/error dig path |
| 07 | [Infrastructure and machine agents](./07_Infrastructure_And_Machine_Agents.md) | Server Visibility; correlate with APM |
| 08 | [EUM — browser and mobile](./08_EUM_Browser_And_Mobile.md) | Real-user experience literacy |
| 09 | [Database Visibility literacy](./09_Database_Visibility_Literacy.md) | DB agents; query digs |
| 10 | [Health rules, policies, alerting](./10_Health_Rules_Policies_And_Alerting.md) | Detect → page |
| 11 | [Analytics and log literacy](./11_Analytics_And_Log_Literacy.md) | Analytics plane |
| 12 | [OpenTelemetry to AppDynamics](./12_OpenTelemetry_To_AppDynamics.md) | OTel / Cisco paths |
| 13 | [Operations, license, pitfalls](./13_Operations_License_And_Pitfalls.md) | Day-2 |
| 14 | [Worked example — first service](./14_Worked_Example_First_Service.md) | Wizard → BT → health rule |
| 15 | [What to enable next / when not](./15_What_To_Enable_Next_And_When_Not.md) | Offering map |
| 16 | [API, automation, RBAC](./16_API_Automation_And_RBAC.md) | Controller REST / CLI |

## References

- [AppDynamics SaaS](https://help.splunk.com/en/appdynamics-saas) · [Get started](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0) · [APM 26.8.0](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0)  
- [On-premises](https://help.splunk.com/en/appdynamics-on-premises) · [Infrastructure Visibility](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0) · [End User Monitoring](https://help.splunk.com/en/appdynamics-saas/end-user-monitoring/26.8.0)
