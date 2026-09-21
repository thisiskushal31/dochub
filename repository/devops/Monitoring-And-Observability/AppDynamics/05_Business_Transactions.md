# 05 — Business transactions

[← Previous](./04_Install_App_Server_Agents.md) · [README](./README.md) · [Next →](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)

## 1. Concepts — what a BT is

In the AppDynamics model, a **business transaction (BT)** is an **end-to-end, cross-tier processing path** that fulfills a request for a service the application provides—login, search, checkout, and similar user-meaningful operations ([What is a Business Transaction?](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/what-is-a-business-transaction)).

**Plain language:** A BT is AppD’s unit of “is checkout slow?”—not a single span, not a host CPU graph. Map golden BTs to SLIs deliberately ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

| Idea | Meaning |
|------|---------|
| **Auto-detect** | Agents discover entry points and register BTs as traffic arrives |
| **BT list** | Registered transactions you monitor, rename, group, or exclude |
| **Detection rules** | Custom include/exclude/priority so important traffic wins |
| **BT limits** | Controllers cap how many BTs an app can register—noise crowds out signal (commonly discussed default around **200** before overflow into `All Other Traffic`) |
| **Service endpoint (SEP)** | KPI metrics for an entry without full BT snapshot overhead |
| **Instrumentation config** | Application → **Configuration → Instrumentation** (transaction detection and related) |

### Auto-detect vs intentional design

Out of the box, auto-detect is useful for first light. Busy apps spawn **too many** BTs (unique URLs, IDs in paths, health checks). Official guidance: set detection priorities, **exclude** unimportant traffic, combine via rules, **rename** for readability, and delete stale BTs so critical operations stay visible ([Organize Business Transactions](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/organize-business-transactions)).

Default naming often uses the **first two URI segments**. Deeper or highly variable paths (`/eCommerce/order/1/add`) burn the BT budget; priority journeys like checkout can fall into overflow. Prefer **custom match rules** that group stable patterns instead of enabling full-URI naming for everything ([Best practices](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/best-practices-to-create-business-transactions)).

**UI path:** open the business application → **Business Transactions** list; tune detection under **Configuration → Instrumentation → Transaction Detection**.

**Disconfirm:** Leaving auto-detect forever on a high-cardinality HTTP API. Using raw UUIDs in BT names. Equating “many BTs” with “good coverage.” Treating BT count as unrelated to license and UI performance. Expecting nested child APIs to each get independent BT snapshots when they run under a parent entry BT.

**Confirm:** Which BTs are golden (user journeys / SLIs)? Who may edit detection rules? Exclude list for `/health`, `/metrics`, static assets?

## 2. Advanced — limits, rules, SEPs, and Instrumentation

**Stay inside limits.** Combine similar transactions into rules; exclude noise; delete old registrations so new critical BTs can register. Hitting the ceiling quietly drops visibility on new entry points—symptoms look like “we shipped an endpoint and AppD never saw it” (or it sits under `All Other Traffic`).

**Rule strategy**

| Strategy | Use when |
|----------|----------|
| Exclude | Probes, scrapers, static files, admin spam |
| Custom match rules | Stable names for `/api/v2/orders` despite query params / path IDs |
| Group / rename | Readable BT list for on-call |
| Priority | Ensure checkout wins over obscure batch URLs |
| Service endpoint | Need CPM / ART / errors **without** full snapshot collection cost |
| Avoid reckless splits | High-variant split outputs explode BT count; prefer SEP splits when needed |

**BT vs service endpoint.** Every BT can collect snapshots/call graphs (periodic + slow/error), which costs agent and Controller resources. If you only need basic KPIs for an API, use a **service endpoint**. SEPs do not replace BT digs for golden journeys—but they keep nested or high-cardinality entries observable without burning BT slots ([Best practices](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/best-practices-to-create-business-transactions)).

**Nested transactions.** Child entry points under a parent BT are often masked for BT purposes; SEPs can still expose those sub-calls as separate KPI surfaces. Do not expect two BTs for parent servlet + inner SOAP endpoint without deliberate design.

**Configuration → Instrumentation.** Control plane for transaction detection, backends, call graphs, and related agent instrumentation at application/tier scope. Change deliberately; record diffs like code. For some entry types (EJB/Spring), prefer custom rules over blindly enabling auto-discovery.

**Health rules on BTs.** Alert on golden BT response time / error rate / stall—not on every auto-detected name ([10](./10_Health_Rules_Policies_And_Alerting.md)).

**Vs Datadog/OTel.** Datadog often centers `service` + resource/operation names; OTel uses spans/traces. AppD’s BT is a **business-shaped** aggregation—translate deliberately when comparing tools ([24](../24_APM_As_A_Product_Shape.md), [Datadog 06](../Datadog/06_APM_Tracing_And_Correlation.md)).

**Load-test / lower envs.** Detection rules should be promoted with the app (or templated); a prod-only exclude list that never existed in staging is how `/health` floods the BT registry on go-live. Snapshot volume scales with unique BTs—noise BTs steal snapshot budget from golden journeys ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)).

**Export / import literacy.** Application instrumentation and BT settings can be exported/imported across Controllers or apps when promoting config—treat detection rules as versioned artifacts, not click-ops folklore ([Business Applications](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-applications)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| BT limit reached | New critical URI missing or under overflow BT |
| Path IDs / UUIDs in names | Exploding BT list; useless baselines |
| Exclude never promoted | Staging clean, prod flooded after cutover |
| Health rules on auto-detect noise | Page storms; on-call ignores AppD |
| Split without exclude values | Combinatorial BT explosion after one rule change |

## 3. Applications — hygiene loop

| Goal | Pattern |
|------|---------|
| Week-one service | Auto-detect → rename top 5 → exclude health checks |
| Noisy brownfield | Export BT list; exclude/group until under soft budget; move KPI-only APIs to SEPs |
| SLI alignment | One BT (or small group) per user journey SLO |
| Before prod alert | Prove BT stability for 1–2 deploys |
| Nested APIs | Parent BT for journey + SEPs for important sub-calls |
| Multi-app product | Same exclude/custom-rule templates per domain application |

**Staff checklist**

1. Open Business Transactions list after load; spot cardinality explosions.  
2. Exclude known noise (`/health`, `/ready`, favicon, actuator spam).  
3. Rename/group golden paths; document the detection rules owner.  
4. Check BT count vs limits; delete stale entries; use SEPs where snapshots are unnecessary.  
5. Only then attach health rules to golden BTs ([10](./10_Health_Rules_Policies_And_Alerting.md)).  
6. Practice snapshot digs on those BTs ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)).  
7. Version BT detection rules with app releases (export/review in PRs or change tickets).

## References

- [Business Transactions](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions) · [What is a Business Transaction?](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/what-is-a-business-transaction) · [Organize Business Transactions](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/organize-business-transactions) · [Best Practices to Create Business Transactions](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/best-practices-to-create-business-transactions) · [Configure Business Transactions](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/configure-business-transactions)  
- [Configure Instrumentation](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/configure-instrumentation) · [Service Endpoints](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/service-endpoints) · [06 Snapshots](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)
