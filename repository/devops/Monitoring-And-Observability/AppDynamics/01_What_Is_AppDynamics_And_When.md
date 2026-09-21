# 01 — What is AppDynamics and when

[← README](./README.md) · [Next →](./02_Architecture_Controller_Apps_Tiers_Nodes.md)

## 1. Concepts — Cisco / Splunk AppDynamics as BT-centric APM

**Splunk AppDynamics** (AppD; historically AppDynamics, now in the Cisco / Splunk observability family) is a commercial **application performance monitoring** platform. Language **app-server agents** instrument processes; they report to a **Controller Tenant** (SaaS or on-premises). Digs center on **business transactions (BTs)**—end-to-end request paths across tiers—not only bare spans or host graphs ([parent 24](../24_APM_As_A_Product_Shape.md)).

| Job you already know | AppDynamics surface |
|----------------------|---------------------|
| App latency, errors, deps | Application Performance Monitoring — BTs, flow maps, snapshots |
| Host / process health | Machine Agent + Server Visibility ([07](./07_Infrastructure_And_Machine_Agents.md)) |
| Real browser / mobile UX | End User Monitoring ([08](./08_EUM_Browser_And_Mobile.md)) |
| Database query digs | Database Visibility ([09](./09_Database_Visibility_Literacy.md)) |
| Wake a human | Health rules / policies → email / chat / [PagerDuty](../PagerDuty/README.md) ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| Reliability target | Map golden BTs to SLIs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md))—AppD does not invent SLOs for you |
| Vendor-neutral instrument | OpenTelemetry → AppD paths ([12](./12_OpenTelemetry_To_AppDynamics.md), [OpenTelemetry](../OpenTelemetry/README.md)) |

**Plain language:** Classic enterprise APM cockpit—strong on business transactions and discovered topology. Treat it as **one primary dig plane**, not a second Datadog/New Relic beside the same services ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

### First-week shape (what “started” means)

Ops emails a **SaaS URL** and **Account Name** (or you document your on-prem Controller URL). Log into the **Controller Tenant UI** → **Getting Started → Getting Started Wizard** → install one app-server agent → apply load → confirm the node on the **Application Dashboard**. Then name golden BTs, exclude noise, and attach one health rule ([14](./14_Worked_Example_First_Service.md)). Skip Database Visibility, Analytics sprawl, Network Visibility, and Secure Application until that dig loop works ([15](./15_What_To_Enable_Next_And_When_Not.md)).

### When it fits / when it does not

| Fit | Usually not |
|-----|-------------|
| Org already owns AppD / Cisco APM licenses | Already all-in on [Datadog](../Datadog/README.md) or [New Relic](../New_Relic/README.md) as primary |
| Need BT + flow-map digs without standing up Tempo/Jaeger | Thin team that will not own agent install, BT hygiene, or Controller ops |
| SaaS Tenant or on-prem Controller required by policy | Only need cheap K8s metrics/logs → Prometheus / Loki / Grafana |
| Enterprise brownfield with AppD skills | Want Elastic full-text log estate as the spine → [Elastic](../Elastic/README.md) |
| Hybrid: APM in AppD, pages elsewhere | Dual SaaS APM agents on one process “for redundancy” |

**Disconfirm:** Buying AppDynamics ≠ having SLOs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)). AppD ≠ [PagerDuty](../PagerDuty/README.md). “We have AppD” ≠ cloud audit/compliance logs ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)). Two SaaS APMs on one service is **not** HA.

**Confirm:** SaaS vs on-prem Controller? Who owns agents, BT naming, and license tiers? Primary dig path vs [OpenTelemetry](../OpenTelemetry/README.md) exit? Where do pages go?

## 2. Advanced — product family, peers, lock-in

**Product spine vs sprawl.** Core loop is agent → Controller → BT dig → health rule. Database Visibility, Analytics, EUM, Network Visibility, Cluster Agent, and Secure Application are real adjacent planes—enable after the APM dig works ([15](./15_What_To_Enable_Next_And_When_Not.md), [13](./13_Operations_License_And_Pitfalls.md)). Subscription modules are purchased separately; APM lighting up does not imply EUM or DB Visibility entitlement.

**Vs peers (honest fit)**

| Peer | Same job family? | Typical pick reason |
|------|------------------|---------------------|
| [Datadog](../Datadog/01_What_Is_Datadog_And_When.md) | Yes (SaaS observability) | Breadth + turnkey Agent/tags; AppD when BT/Controller model is the standard |
| [New Relic](../New_Relic/README.md) | Yes | NRQL / account model familiarity vs AppD BT model |
| [Elastic](../Elastic/01_What_Is_Elastic_Observability_And_When.md) | Partial | Full-text ES estate vs BT Controller digs |
| [OpenTelemetry](../OpenTelemetry/README.md) | Instrument layer | Prefer OTel at code edge; dig in AppD today if licensed ([12](./12_OpenTelemetry_To_AppDynamics.md)) |
| [PagerDuty](../PagerDuty/README.md) | No | Incident router—AppD alerts *into* it |

**Exit ramp.** Prefer OTel at the instrument layer when lock-in fear is high; dig in the Tenant UI today. Do not dual-run classic AppD agents and a second APM agent on the same process without a written primary dig path ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**Mental-model lock-in.** AppD unifies on **application / tier / node / BT**. Peers unify on `service`/`env` tags or `service.name` + spans. Translating executives across tools without renaming golden journeys creates two “truths” in one war room.

**Failure modes that look like “AppD doesn’t work”**

| Failure | What you see |
|---------|----------------|
| Wrong Tenant URL / account / access key | Agents “installed,” empty Applications list ([04](./04_Install_App_Server_Agents.md)) |
| BT registry at limit / high-cardinality URIs | New endpoints land in overflow / never appear as useful BTs ([05](./05_Business_Transactions.md)) |
| No load after install | Dashboard empty—agent healthy, nothing to report |
| Second SaaS APM on same process | Split attribution, doubled overhead, no clearer dig |

## 3. Applications — use cases and first moves

| Use case | What “good” looks like |
|----------|------------------------|
| First production service | Wizard install → Application Dashboard → golden BTs named → one health rule ([14](./14_Worked_Example_First_Service.md)) |
| Enterprise brownfield | Keep AppD if skills/licenses exist; freeze “no second SaaS APM” |
| Hybrid cloud | App-server agents on owned compute; Machine Agent for hosts ([07](./07_Infrastructure_And_Machine_Agents.md)) |
| User-facing dig | EUM correlated to BTs after APM works ([08](./08_EUM_Browser_And_Mobile.md)) |
| Page path | Health rule → policy → PagerDuty with runbook ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| OTel-first platform | Instrument with OTel; export/dig via AppD only where licensed ([12](./12_OpenTelemetry_To_AppDynamics.md)) |

**Anti-patterns to refuse early**

- Buying every AppD plane in week one before a single BT dig works.  
- Dual-writing Datadog APM *and* AppD agents on one process “for redundancy.”  
- Declaring SLOs from Controller averages without naming golden BTs ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).  
- Treating AppD as the cloud audit door ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

**Staff checklist**

1. Confirm Tenant URL / account name and deploy shape ([03](./03_SaaS_Vs_On_Prem_Controller.md)).  
2. Install one app-server agent via Getting Started Wizard ([04](./04_Install_App_Server_Agents.md)).  
3. Confirm the node on the Application Dashboard under load.  
4. Name/group golden BTs; exclude noise ([05](./05_Business_Transactions.md)).  
5. Practice one snapshot dig before the first page ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)).  
6. Write who owns agents, BT rules, license, and pages.  
7. Write the peer decision (why not Datadog/New Relic/Elastic-only) in one ADR paragraph.

## References

- [AppDynamics SaaS](https://help.splunk.com/en/appdynamics-saas) · [Get started 26.8.0](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0) · [Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui) · [Application Performance Monitoring 26.8.0](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0)  
- [02 Architecture](./02_Architecture_Controller_Apps_Tiers_Nodes.md) · [Datadog when](../Datadog/01_What_Is_Datadog_And_When.md) · [APM as a product shape](../24_APM_As_A_Product_Shape.md)
