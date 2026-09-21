# 17 — Network Monitoring, USM, and GPU Monitoring

[← Previous](./16_Database_Data_Streams_And_Data_Jobs.md) · [README](./README.md) · [Next →](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)

## 1. Concepts — paths, golden signals without code, accelerators

Three products answer questions APM and host metrics miss: **is the path broken?**, **what talks to what without instrumentation?**, and **are GPUs busy or burning money idle?**

### Network Monitoring (CNM / NPM family)

**Network Monitoring** shows traffic and performance across cloud, hybrid, and on-prem **paths**. Use when incidents look like connectivity, DNS, TLS, or east-west loss — not when the stack trace already names a slow query. Correlate apps, devices, and infra so NetOps and app on-call share one map.

| Question | Prefer |
|----------|--------|
| App code slow / erroring | APM ([06](./06_APM_Tracing_And_Correlation.md)) |
| “Can’t reach dependency” / DNS / cross-AZ | Network Monitoring |
| Brownfield binary, no tracer yet | USM first, then APM |

### Universal Service Monitoring (USM)

**USM** derives **golden signals without code changes**: the Agent observes traffic and emits metrics such as `universal.http.server` / `universal.http.client`. Services appear in APM Catalog / Service Map. Naming prefers unified tags when present; otherwise fallbacks (`app`, short image name, …).

**When:** cover brownfield, sidecars, or third-party binaries you cannot instrument this quarter. **When not:** as the permanent substitute for APM on revenue services — you still lack deep spans, custom business tags, and Error Tracking depth.

### GPU Monitoring

**GPU Monitoring** tracks fleet health, utilization, memory, power, idle waste, and provisioning for **GPU hosts** used by AI/ML and rendering. Agent on GPU-accelerated nodes; OOTB monitors for hardware and saturation. Pair with LLM Observability ([23](./23_LLM_Observability_Bits_AI_And_MCP.md)) and Cloud Cost ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)) so idle GPUs show up as both reliability and FinOps problems.

**Disconfirm:** USM replaces APM forever. NPM enabled org-wide with no CIDR/namespace scope ⇒ noise and cost. GPU metrics without team tags ⇒ unowned spend.

**Confirm:** Which CIDRs/namespaces are in scope for Network Monitoring? Which services stay on USM vs get real APM? GPU cost attributed to which teams?

## 2. Advanced — scope, naming, failure modes

**Network Monitoring scope.** Start with paths that have burned you in incidents (egress to payments, cross-region DB, VPN to on-prem). Unscoped collection floods maps and bills. DNS failures and TLS handshake errors are first-class dig signals — teach on-call to open Network before rewriting app code.

**USM + Deployment Tracking.** Combine USM dependency edges with `version` tags so a bad rollout shows as error-rate edges even before full tracing. When unified tags are missing, Service Map names drift — fix tagging ([02](./02_Architecture_Agent_And_Data_Plane.md)) rather than inventing dashboards per fallback name.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Empty USM metrics | eBPF/kernel constraints; Agent feature flags; traffic not HTTP/gRPC as expected |
| Duplicate services in Catalog | USM name + APM `service` mismatch |
| Network map noise | Entire VPC included; no team filter |
| GPU idle alerts ignored | No owner; cost not in FinOps review |

**Cost / security.** Network and USM are usage-sensitive — scope aggressively ([11](./11_Cost_Governance_And_Account_Hygiene.md)). Network flows can reveal topology useful to attackers; RBAC who can see maps. GPU hosts often hold model weights — Agent access follows same host security as other Agents.

**GPU + AI stack.** Utilization alone is not an SLO; pair with job queue lag and LLM latency/token cost. Idle GPUs after batch windows are a Cloud Cost story as much as a Monitoring story.

**CNM vs cloud network metrics.** VPC Flow Logs / cloud firewall metrics via integrations are useful inventory; Network Monitoring’s value is **app-correlated** path performance. Prefer the product that answers the incident question — don’t enable both blindly and double cost.

**USM → APM graduation.** Track a backlog: every USM-only service with an SLO or revenue tag gets a target quarter for real tracing. Leave USM on during graduation so you don’t go blind mid-migration; reconcile Catalog duplicates when both emit.

**Kernel / platform limits.** USM and some network features depend on eBPF / kernel versions — validate on the oldest node pool before declaring “cluster covered.” Document unsupported nodes so on-call doesn’t chase empty metrics.

## 3. Applications — use cases and staff checklist

**Use case 1 — Uninstrumented legacy API.** Enable USM on one cluster; find the service in Service Map; decide APM instrumentation this sprint or leave USM with clear ownership.

**Use case 2 — Cross-AZ payment outage.** Network Monitoring on app→PSP and app→DB paths; confirm elevated retransmits/DNS failures before blaming application code; page NetOps + app with shared dashboard.

**Use case 3 — GPU training fleet.** Agent + GPU Monitoring; alert on sustained idle during business hours and on memory errors; tag `team`/`workload` for chargeback.

**Use case 4 — Migration coverage.** USM for everything in a namespace; APM only for SLO services; weekly review: promote or drop USM-only entries.

**Staff checklist**

- [ ] Network Monitoring scoped to known pain paths (not whole estate on day one)  
- [ ] USM enabled where APM gaps hurt digs; naming/tag policy documented  
- [ ] Plan to add real APM for top USM services by revenue/SLO  
- [ ] GPU Monitoring on accelerated node pools; idle + health monitors  
- [ ] Cost review after enable; RBAC for network maps  
- [ ] Oldest node pool validated for USM/eBPF prerequisites  
- [ ] USM→APM graduation backlog exists for SLO services  

**Good:** path proof + golden signals + GPU utilization with owners. **Bad:** org-wide NPM “because we bought it” and USM forever with no APM backlog.

**Dig path.** Page on dependency errors → Service Map (USM or APM) → Network Monitoring for the edge if “connection refused” / DNS → Profiler/APM if the path is healthy but slow. GPU page → utilization + job queue + Cloud Cost allocation tag before buying more cards.

## References

- [Network Monitoring](https://docs.datadoghq.com/network_monitoring/) · [Cloud Network Monitoring](https://docs.datadoghq.com/network_monitoring/cloud_network_monitoring/)  
- [Universal Service Monitoring](https://docs.datadoghq.com/universal_service_monitoring/) · [GPU Monitoring](https://docs.datadoghq.com/gpu_monitoring/)  
- [18 Profiler / Watchdog](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)
