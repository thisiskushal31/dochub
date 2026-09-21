# 15 — What to enable next / when not

[← Previous](./14_Worked_Example_First_Service.md) · [README](./README.md) · [Next →](./16_API_Automation_And_RBAC.md)

## 1. Concepts — finish core APM before the catalog

Finish the **core reliability loop** first ([14](./14_Worked_Example_First_Service.md)): Wizard → app-server agent → golden BTs → snapshot dig → one health rule → page. Then enable **one** adjacent capability at a time with an owner, a license check, and **kill criteria** ([13](./13_Operations_License_And_Pitfalls.md)).

### Core track (01–14)

| Need | Chapter |
|------|---------|
| What / when | [01](./01_What_Is_AppDynamics_And_When.md) |
| Architecture | [02](./02_Architecture_Controller_Apps_Tiers_Nodes.md) |
| SaaS vs on-prem | [03](./03_SaaS_Vs_On_Prem_Controller.md) |
| Install agents | [04](./04_Install_App_Server_Agents.md) |
| Business transactions | [05](./05_Business_Transactions.md) |
| Snapshots / digs | [06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md) |
| Machine / infra | [07](./07_Infrastructure_And_Machine_Agents.md) |
| EUM browser/mobile | [08](./08_EUM_Browser_And_Mobile.md) |
| Database Visibility | [09](./09_Database_Visibility_Literacy.md) |
| Health rules / policies | [10](./10_Health_Rules_Policies_And_Alerting.md) |
| Analytics / logs | [11](./11_Analytics_And_Log_Literacy.md) |
| OpenTelemetry | [12](./12_OpenTelemetry_To_AppDynamics.md) |
| Day-2 ops / license | [13](./13_Operations_License_And_Pitfalls.md) |
| First-service lab | [14](./14_Worked_Example_First_Service.md) |

### Admin and automation (16)

| Need | Chapter |
|------|---------|
| Controller REST, API Clients, RBAC, audit | [16](./16_API_Automation_And_RBAC.md) |

**Defer until core APM works:** **EUM** ([08](./08_EUM_Browser_And_Mobile.md)), **Database Visibility** ([09](./09_Database_Visibility_Literacy.md)), **Analytics** sprawl ([11](./11_Analytics_And_Log_Literacy.md)), and **ASM / synthetics**-style blackbox (use AppD synthetic offerings only with an owner—or keep synthetics elsewhere). Machine Agent ([07](./07_Infrastructure_And_Machine_Agents.md)) can wait until host correlation blocks a dig.

**Disconfirm:** Enabling five products in one week. Using this map instead of finishing [14](./14_Worked_Example_First_Service.md). Adding a second SaaS APM “for coverage.”

**Confirm:** Core loop green? Named owner + license baseline before the next enable? Kill criteria written?

## 2. Advanced — order, kill criteria, when AppD should not grow

**Suggested order after the lab:** (1) tighten BT exclusions and paging hygiene, (2) Machine Agent on the host that runs checkout, (3) Database Visibility only if SQL digs dominate, (4) EUM when frontend SLIs are the pain, (5) Analytics when you have queries worth licensing, (6) OTel path when exit/migration or polyglot standards demand it ([12](./12_OpenTelemetry_To_AppDynamics.md)), (7) API/RBAC hardening in parallel once humans share the Tenant ([16](./16_API_Automation_And_RBAC.md)).

**How to use kill criteria.** Before each enable: write the pain hypothesis, license baseline, owner, and a dated kill line (“disable if digs do not improve in two weeks / if cost > X / if dual ship begins”). Kill criteria without an owner become shelfware—same as orphan health rules.

### Product enablement map with kill criteria

| Enable | Do when | Kill / do not if |
|--------|---------|------------------|
| Machine Agent / Server Visibility | Digs stall on “host looks fine” | Cloud host metrics already answer; no agent owner |
| Database Visibility | Repeated “DB slow” without SQL truth | BT digs already show pool/N+1; no concurrent DB license headroom |
| EUM | Frontend field truth is the Sev1 path | No CSP/snippet owner; only need backend BT pages |
| Transaction Analytics | Named business questions on BT fields | Primary log plane + BT snapshots already suffice |
| Log Analytics | Need AppD-adjacent structured log slice | Elastic/Loki already primary; would double ship volume |
| AppD for OpenTelemetry | Polyglot / exit optionality / OTIG gateway | Dual APM risk; support matrix gaps for promised UX |
| Synthetics / ASM | Owned user journey blackbox | Journey orphaned; duplicate of existing uptime tool |
| API + RBAC as-code | Click-ops drift; shared Tenant | No automation owner; still one admin password |

**When not to expand AppD**

| Situation | Prefer |
|-----------|--------|
| Org standardized on Datadog/NR/LGTM | That primary ([Datadog](../Datadog/README.md), [New Relic](../New_Relic/README.md), [OpenTelemetry](../OpenTelemetry/README.md), [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| Need cheap high-volume full-text logs | [Elastic](../Elastic/README.md) / [Loki](../Loki/README.md)—Analytics is adjacent, not the platform |
| Need PromQL / Grafana-native | [Grafana](../Grafana/README.md) stack |
| Cloud audit evidence | Cloud-native audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |
| Thin team, no agent owners | Do not add EUM+DB+Analytics |

**Pitfalls:** ASM/synthetics without journey ownership; EUM snippets without CSP/snippet plan; DB collectors on every shard day one; OTel + classic + Datadog triple path; enabling Analytics “to replace Elastic”; treating this chapter as a shopping list instead of a queue.

**Vs peer enablement maps.** Same discipline as Elastic’s offering map ([Elastic 14](../Elastic/14_What_To_Enable_Next_And_When_Not.md)): core loop first, one adjacent product, kill criteria, dual-APM ban.

## 3. Applications — pain → next enable

| If this is your pain… | Enable next | Chapter |
|-----------------------|-------------|---------|
| “Host looks fine in cloud, app red” | Machine Agent | [07](./07_Infrastructure_And_Machine_Agents.md) |
| “DB is slow” without SQL truth | Database Visibility | [09](./09_Database_Visibility_Literacy.md) |
| Frontend field truth | EUM | [08](./08_EUM_Browser_And_Mobile.md) |
| Business queries on BT fields | Transaction Analytics | [11](./11_Analytics_And_Log_Literacy.md) |
| Vendor-neutral instrument | AppD for OpenTelemetry | [12](./12_OpenTelemetry_To_AppDynamics.md) |
| Rule drift / admin sprawl | API + RBAC | [16](./16_API_Automation_And_RBAC.md) |
| Pages ignored | Health-rule hygiene only | [10](./10_Health_Rules_Policies_And_Alerting.md) |
| Dual APM temptation | None—pick primary | [13](./13_Operations_License_And_Pitfalls.md) |

**Staff checklist:** one enable per week max; license before/after; kill criteria written and dated; dual APM still banned; link back to core dig path; revert plan if digs do not improve in two weeks.

**Good:** core loop green, then one adjacent product. **Bad:** EUM+DB+Analytics+OTel in the same change window as first agent install.

**Queue discipline.** Maintain a short ordered backlog of enables with owners and kill dates. If the backlog grows past three items, you are shopping—pause until the top item ships or dies.

## References

- [AppDynamics SaaS help hub](https://help.splunk.com/en/appdynamics-saas) · [Getting Started — OpenTelemetry](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/splunk-appdynamics-for-opentelemetry/getting-started) · [Database Visibility](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0) · [Analytics](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0)  
- [14 Worked example](./14_Worked_Example_First_Service.md) · [16 API / RBAC](./16_API_Automation_And_RBAC.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [Elastic enablement map](../Elastic/14_What_To_Enable_Next_And_When_Not.md)
