# 07 — Infrastructure and machine agents

[← Previous](./06_Snapshots_Call_Graphs_And_Troubleshooting.md) · [README](./README.md) · [Next →](./08_EUM_Browser_And_Mobile.md)

## 1. Concepts — Machine Agent and Server Visibility

**Infrastructure Visibility** covers the hardware and OS under your APM nodes. The **Machine Agent** collects host-level metrics; **Server Visibility** is an add-on module that deepens process, service, and resource views and strengthens correlation with APM ([Overview of Infrastructure Visibility](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/overview-of-infrastructure-visibility)).

```text
App-server agent ──► BT / JVM (or runtime) metrics ──► Controller
Machine Agent    ──► host / process / (Server Visibility) ──► Controller
                         │
                         └── correlate via tier / node / snapshot Server tab
```

| Piece | Job |
|-------|-----|
| **Machine Agent** | Basic OS/hardware metrics (CPU, memory, disk, network I/O); extensions; remediation scripts; JVM Crash Guard |
| **Server Visibility** | Extended metrics, process/service views, Docker/container digs, tier metric correlator, server tags, server-group health rules |
| **Network Agent** (literacy) | Packet/TCP issues on nodes—adjacent plane when net is a suspect |
| **Cluster Agent** (literacy) | Kubernetes cluster-level monitoring—separate from per-host Machine Agent |
| **APM correlation** | Jump server ↔ APM node; snapshot **Server** tab during slow BTs |

### Multi-layer monitoring (official model)

1. **App-server agent** — BTs, stalls, application issues.  
2. **Network Agent** (optional) — lost/retransmitted packets, TCP bottlenecks, RTT.  
3. **Machine Agent** — basic hardware **or** Server Visibility process/resource depth.

Java vs .NET nuance: Java Agent covers app/JVM; Machine Agent covers OS (+ Server Visibility). .NET Agent includes a **.NET Machine Agent** for IIS/hardware metrics; standalone Machine Agent still supplies Server Visibility metrics on Windows when that module is in play.

### Install literacy (new Machine Agent)

Plan config → download the OS package from Downloads → install (RPM, ZIP+JRE, Windows ZIP, non-JRE ZIP + own JRE 8+) → verify → start with `<machine_agent_home>/bin/machine-agent` ([Installation for New Machine Agent](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/machine-agent/install-the-machine-agent/installation-for-new-machine-agent)). Point it at the **same Controller Tenant** (host/port/SSL/account/access key) as app agents ([03](./03_SaaS_Vs_On_Prem_Controller.md), [04](./04_Install_App_Server_Agents.md)).

**UI path:** **Servers** / Infrastructure Visibility views in the Tenant UI; from APM, use server correlation links and snapshot **Server** tabs.

**Plain language:** App agents answer “is the transaction slow?”; Machine Agent / Server Visibility answer “was the box hot, starved, or restarting while it was slow?”

**Disconfirm:** Expecting host CPU graphs from app-server agents alone. Enabling every infra extension week one. Treating Machine Agent as a replacement for cloud provider host metrics / audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)). Assuming Server Visibility features without the add-on license.

**Confirm:** Which hosts need Machine Agent vs APM-only? Is Server Visibility licensed? Who owns agent upgrades on golden images?

## 2. Advanced — correlate with APM tiers

**Snapshot → Server path.** From a slow snapshot, open the call drill-down **Server** tab for CPU, memory, disk, network, and process clues when Server Visibility is on ([Call drill downs](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-transactions/troubleshoot-business-transaction-performance-with-transaction-snapshots/call-drill-downs)).

**Flow map / tier → server.** From application flow maps, drill tiers/nodes into server health summaries; from Servers dashboards use **APM Correlation** to open the associated APM node ([Navigating between server and application contexts](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/server-visibility/monitor-your-servers-using-server-visibility/navigating-between-server-and-application-contexts)).

**Tier Metric Correlator.** With Server Visibility, compare load/performance anomalies across all nodes in a tier (clusters/containers)—useful when “only some pods” are sick.

**Containers / K8s.** Server Visibility helps relate container resource issues to app nodes; Cluster Agent covers cluster-level Kubernetes literacy separately. Still align K8s requests/limits and cloud node metrics outside AppD.

**Network Visibility (adjacent).** Network Agent literacy covers lost/retransmitted packets and TCP bottlenecks when the dig says “exit call slow” but the peer app looks fine—enable when net owns a recurring incident class, not on day one ([15](./15_What_To_Enable_Next_And_When_Not.md)).

**Alerting hygiene.** Health rules on GC time, pool contention, or CPU catch issues early—but page when they threaten golden BTs, not on raw host CPU alone ([10](./10_Health_Rules_Policies_And_Alerting.md)).

**Machine Agent extensions.** The Machine Agent supports custom metric extensions and remediation scripts (optionally approval-gated)—useful for host-local runbooks, easy to overuse as a second monitoring product. Keep extensions rare and owned.

**Vs Datadog Infra.** Same job as Datadog host/container views ([Datadog 09](../Datadog/09_Containers_Kubernetes_And_Infrastructure.md)); pick one primary host dig plane per estate. Elastic Hosts UI is another peer lens ([Elastic 06](../Elastic/06_Metrics_Infra_And_Hosts.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| Machine Agent wrong Controller | Host metrics nowhere near the APM application |
| Server Visibility not licensed | “Process digs” missing; only basic hardware |
| Agent on wrong host vs app node | Correlation links empty; snapshot Server tab thin |
| Page on raw CPU | Noise pages; BT still green |
| Multiple Machine Agents on one host (unplanned) | Duplicate/conflicting host identity; messy Servers list |

## 3. Applications — when to add infra agents

| Goal | Pattern |
|------|---------|
| First APM service | App agent first; add Machine Agent when host suspicion is real |
| JVM on noisy neighbors | Machine Agent + Server Visibility on the host/VM |
| K8s nodes | Machine Agent on nodes or documented container strategy; correlate to APM nodes |
| Incident dig | BT snapshot → Server tab → process list → APM Correlation reverse path |
| Net-owned incidents | Add Network Agent after APM+host digs stall |
| Windows/.NET IIS | Lean on .NET Machine Agent + Server Visibility literacy; still one dig grammar |

**Staff checklist**

1. Inventory which hosts run APM nodes without Machine Agent.  
2. Install Machine Agent on one staging host; verify in Servers UI.  
3. Confirm Server Visibility entitlement before promising process digs.  
4. Practice snapshot → Server tab once ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)).  
5. Document Controller connection props shared with app agents.  
6. Do not page on raw host CPU without tying to golden BT impact ([10](./10_Health_Rules_Policies_And_Alerting.md)).  
7. Decide Network Agent / Cluster Agent only after the host↔BT dig works ([15](./15_What_To_Enable_Next_And_When_Not.md)).

## References

- [Overview of Infrastructure Visibility](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/overview-of-infrastructure-visibility) · [Installation for New Machine Agent](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/machine-agent/install-the-machine-agent/installation-for-new-machine-agent) · [Server Visibility monitoring](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/server-visibility/monitor-your-servers-using-server-visibility) · [Server ↔ application navigation](https://help.splunk.com/en/appdynamics-saas/infrastructure-visibility/26.8.0/server-visibility/monitor-your-servers-using-server-visibility/navigating-between-server-and-application-contexts)  
- [08 EUM](./08_EUM_Browser_And_Mobile.md) · [Datadog infra peer](../Datadog/09_Containers_Kubernetes_And_Infrastructure.md)
