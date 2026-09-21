# 06 — Snapshots, call graphs, troubleshooting

[← Previous](./05_Business_Transactions.md) · [README](./README.md) · [Next →](./07_Infrastructure_And_Machine_Agents.md)

## 1. Concepts — transaction snapshots as the dig artifact

When a BT is slow, errored, or stalled, AppDynamics captures **transaction snapshots**—detailed samples of a BT execution you use to troubleshoot ([Troubleshoot with Transaction Snapshots](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots)).

Metrics reflect **every** execution; snapshots cover **selected** instances for depth. A snapshot gives a cross-tier view of one invocation—not a full warehouse of every request.

View snapshots from the **Transaction Snapshots** tab on application, tier, node, or BT dashboards within the UI time range ([Snapshot list](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/use-the-transaction-snapshot-list)).

| Piece | Job |
|-------|-----|
| **Snapshot list** | Filter slow / error / stalled / archived; compare a handful side by side (up to 30 for expensive-call analysis) |
| **Call drill-down** | Code-level detail for the BT on a given tier |
| **Call graph** | Where time was spent in methods / frames (may be partial) |
| **Remote services** | Backend calls (HTTP, DB, queue) contributing to latency |
| **Service endpoints** | Finer entry metrics inside a tier; may appear inside a BT snapshot path |
| **Diagnostic sessions** | Deeper capture windows when reproducing an issue |
| **Archive snapshot** | Retain beyond default purge (`Actions → Archive`; application-level create permission) |

**When snapshots are taken (literacy).** Subject to limits: slow / very slow / stalled / error UX; **periodic** collection (default often **one snapshot per BT every ~10 minutes**); and **diagnostic sessions** (auto or manual from the Business Transaction dashboard) ([Transaction Snapshot Collection](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/transaction-snapshot-collection)).

**Default retention.** Controllers commonly **purge snapshots after two weeks** (configurable; on-prem cluster setting `snapshots.retention.period` in hours, e.g. 336). Archive when a snapshot must survive for RCA write-ups. File-cabinet icon marks archived rows; filter **Only Archived** when hunting sealed evidence.

**Plain language:** Metrics tell you *that* checkout is slow; snapshots tell you *where* in the call graph and which remote service.

**UI path literacy:** Application / Tier / Node / BT dashboard → **Transaction Snapshots** tab → open a row → call drill-down / call graph / remote calls / **Server** tab.

**Disconfirm:** Alerting without ever opening a snapshot. Expecting every request to have a full call graph. Ignoring remote-service time and blaming only “the JVM.” Assuming every slow call left a snapshot (limits apply).

**Confirm:** Can on-call open BT → snapshot → call graph in under five minutes? Are golden BTs stable enough that snapshots land on the right name ([05](./05_Business_Transactions.md))?

## 2. Advanced — collection limits, drill paths, correlated planes

**Partial call graphs.** Snapshots taken when a transaction *becomes* slow/error may start mid-flight—graphs can be incomplete. Periodic and diagnostic-session snapshots tend to be more complete on originating tiers; continuing tiers capture when upstream asks them to ([Retention rules](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/transaction-snapshot-collection/snapshot-and-call-graph-retention-rules)).

**Snapshot limits (ops literacy).** Not every slow/error produces a snapshot. Controllers/agents enforce per-node rate and concurrency caps (originating snapshots often on the order of **~20/min/node** with a small concurrent cap; continuing snapshots allow higher rates; error snapshots are stricter still—e.g. a few per minute). Flooded nodes drop evidence—another reason to keep BT cardinality sane ([Transaction Snapshot Limits](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/transaction-snapshot-collection/transaction-snapshot-limits)).

**Call drill-downs.** A drill-down holds execution detail on a particular tier: overview (timings, node, thread), call graphs, and often a **Server** tab for hardware/JVM when available ([Call drill downs](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/call-drill-downs)). Async segments may appear differently from BT view vs app/tier/node view—expand originating vs async deliberately.

**Service endpoints & remote services.** Use service endpoints for high-cardinality entry literacy inside a tier; use remote services / backends on the flow map to see dependency latency. Deep SQL digs may need Database Visibility ([09](./09_Database_Visibility_Literacy.md)).

**Infra correlation.** With **Server Visibility**, snapshot Server tabs and tier/node → server navigation connect app slowness to CPU, memory, disk, and processes ([07](./07_Infrastructure_And_Machine_Agents.md)).

**Diagnostic sessions.** When intermittent issues refuse to leave a useful snapshot, start a diagnostic session while reproducing—higher capture cost, clearer evidence. Start from the **Business Transaction** dashboard; time-box sessions; do not leave them on forever in prod.

**List actions literacy.** From the snapshot list: filter by experience (slow/error/stalled), compare two snapshots side by side, identify most expensive calls/SQL across a selection (up to ~30), and filter **Only Archived** when hunting postmortem evidence ([Snapshot list](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/use-the-transaction-snapshot-list)).

**Vs Datadog flame graphs / OTel traces.** Same troubleshooting job family—AppD’s packaging is snapshot + call graph + BT. Prefer one primary dig grammar in an incident ([24](../24_APM_As_A_Product_Shape.md), [OpenTelemetry](../OpenTelemetry/README.md), [parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| Snapshot rate limits hit | “Always slow” but empty or thin snapshot list |
| Wrong UI time range | “No snapshots” while they exist outside the window |
| Unarchived evidence | Two weeks later, postmortem has no call graph |
| Diagnostic session left on | Extra overhead; noisy capture; forgotten cost |
| Too many noisy BTs | Snapshot budget spent on health checks; golden journey starved |

## 3. Applications — slow and error playbooks

| Symptom | Dig path |
|---------|----------|
| BT response time up | BT dashboard → slow snapshots → call graph hotspot → remote service |
| Error rate up | Error snapshots → exception + exit call → recent deploy / dependency |
| Intermittent stall | Diagnostic session while reproducing; archive useful snapshots |
| “Only some nodes” | Compare node dashboards + snapshots; check Machine Agent ([07](./07_Infrastructure_And_Machine_Agents.md)) |
| Exit call dominates | Remote services / backends on flow map → owner of dependency; DB Visibility if SQL ([09](./09_Database_Visibility_Literacy.md)) |
| User says “slow,” APM looks fine | Check EUM correlation next ([08](./08_EUM_Browser_And_Mobile.md)) |

**Anti-patterns**

- Paging on tier average response time with no snapshot habit.  
- Comparing snapshots across wildly different time ranges without saying so.  
- Archiving nothing, then needing a purged snapshot for the postmortem.  
- Leaving diagnostic sessions running “just in case.”

**Staff checklist**

1. Practice one slow-BT dig in staging before the first prod page.  
2. Confirm snapshot list filters and time range literacy for on-call.  
3. Document when to start a diagnostic session.  
4. Know who can archive snapshots and where RCA links live.  
5. Tie health rules to golden BTs that actually produce useful snapshots ([10](./10_Health_Rules_Policies_And_Alerting.md)).  
6. Cross-link the dig path in the service runbook (BT name → how to open snapshots).

## References

- [Troubleshoot with Transaction Snapshots](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots) · [Use the Transaction Snapshot List](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/use-the-transaction-snapshot-list) · [Transaction Snapshot Collection](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/transaction-snapshot-collection) · [Transaction Snapshot Limits](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/transaction-snapshot-collection/transaction-snapshot-limits) · [Call Drill Downs](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/call-drill-downs) · [Call Graphs](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/call-graphs)  
- [Service Endpoints](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/service-endpoints) · [Remote Services](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/remote-services) · [07 Infrastructure](./07_Infrastructure_And_Machine_Agents.md)
