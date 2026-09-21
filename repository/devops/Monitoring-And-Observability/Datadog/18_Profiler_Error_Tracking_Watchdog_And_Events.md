# 18 — Profiler, Error Tracking, Watchdog, and events

[← Previous](./17_Network_USM_And_GPU_Monitoring.md) · [README](./README.md) · [Next →](./19_Incident_Workflows_And_Collaboration.md)

## 1. Concepts — code hotspots, grouped failures, AI baselines, change timeline

These products sit **beside** APM and logs: they shorten the dig from “endpoint is slow / noisy” to “this method / this exception / this deploy / this anomalous shift.”

### Continuous Profiler

Always-on **code-level** CPU and memory profiles correlated with APM. Open Profiler after Trace Explorer shows a slow endpoint and you need the hot method, not another span list. Supported languages follow current Profiler docs (Java, Python, Go, Ruby, Node, .NET, PHP, …).

**When:** sustained CPU, allocation pressure, or “p99 climbed after release.” **When not:** cold-start-only Lambda blips with no profile budget; speculative profiling with no latency symptom.

### Error Tracking

Groups exceptions across **APM, Logs, and RUM** into **issues** you can triage, assign, and trend — instead of the same stack 10k times in Explore. Ownership and regression detection matter as much as the stack frame.

### Watchdog

Built-in **AI/insights engine**: baselines, anomaly / forecast / outlier style stories, faulty deployment detection, and investigation context in explorers. No separate Agent install — tune sensitivity when defaults page too often. Watchdog **suggests**; durable pages still belong in explicit monitors ([08](./08_Monitors_SLOs_And_Dashboards.md)).

### Events

Change and system events (deploys, Agent, integrations, feature flags) as a **timeline** next to metric spikes. Feed meaningful deploy events from CI/CD (`version`, service, env) so “what changed?” is not Slack archaeology.

| Product | Primary question |
|---------|------------------|
| Profiler | Which method burns CPU/RAM? |
| Error Tracking | Which exception is new / regressed? |
| Watchdog | What anomalous shift appeared? |
| Events | What changed near the spike? |

**Disconfirm:** Profiler without a latency or CPU symptom to chase. Watchdog pages as the only alert strategy. Error Tracking enabled with nobody assigned to issues.

**Confirm:** Error Tracking ownership (SRE vs app team)? Deploy events on every release with matching `version` tags? Watchdog faulty-deploy needs good unified tags ([02](./02_Architecture_Agent_And_Data_Plane.md))?

## 2. Advanced — instrumentation, Dynamic Instrumentation, failure modes

**Profiler + APM.** Same Agent/tracer family; enable Continuously for services that already have APM. Profile overhead is usually small but not zero — validate on a canary service. Memory profiles catch leaks that CPU profiles miss.

**Dynamic Instrumentation.** UI-driven spans/probes without redeploy pair with Profiler for production digs. Gate who can attach probes; time-box and remove them; treat like prod config change (Audit Trail, [26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Error Tracking hygiene.** Fingerprinting merges related stacks; noisy libraries need ignore rules. Link issues to services in Catalog. Separate client (RUM) vs server (APM) ownership so mobile crashes don’t page API on-call incorrectly.

**Watchdog tuning.** Faulty deployment detection fails without consistent `version`. Promote recurring Watchdog insights into monitors with thresholds you own; mute or narrow algorithms that cry wolf. Do not auto-page every Watchdog story into PagerDuty without review.

**Events quality.** Low-signal events (every Agent restart) drown deploys. Prefer CI “deploy started/succeeded/failed” and flag change events ([24](./24_Feature_Flags_Experiments_And_Product_Analytics.md)). Correlate Events explorer with metric overlays during postmortems ([19](./19_Incident_Workflows_And_Collaboration.md)).

**Cost / privacy.** Profiler and Error Tracking are SKUs; enable on SLO services first. Stack traces and profiles can include sensitive strings — SDS and log scrubbing still apply ([20](./20_Security_Products.md)).

**Language runtime notes.** JVM/Go/Python profilers differ in what “CPU” means (wall vs on-CPU) and how allocations appear — read the language page once per stack you run ([parent 35](../35_Runtime_And_Language_Specific_Signals.md) for runtime context). Don’t compare a Go profile percentage to a JVM one as if units matched.

**Regression workflow.** Error Tracking issue “regressed” after deploy + Watchdog faulty deployment + Events spike is one incident, not three pages. Collapse to a single Sev with the deploy `version` in the title; fix or roll back; resolve the issue so reopen detection works next time.

## 3. Applications — use cases and staff checklist

**Use case 1 — Slow checkout endpoint.** Trace Explorer → Continuous Profiler → fix hot serialization path; confirm p95 drop; keep a monitor on that endpoint SLO.

**Use case 2 — Exception flood after release.** Error Tracking shows new issue tied to `version`; roll back or patch; assign issue to owning team; Watchdog may flag the same deploy — use both, page once.

**Use case 3 — Mystery CPU on a worker.** Profiler memory + CPU; find unbounded cache growth; add Event for the config change that raised cache size.

**Use case 4 — Insight promotion.** Weekly: review Watchdog stories for the top three services; convert two durable patterns into monitors; dismiss noise.

**Staff checklist**

- [ ] Profiler on at least one slow SLO service with APM already healthy  
- [ ] Error Tracking for that service’s APM (+ logs/RUM if relevant); owners set  
- [ ] Deploy events emitted with `service`/`env`/`version` from CI  
- [ ] Watchdog reviewed; not the sole paging path  
- [ ] Dynamic Instrumentation gated by RBAC  
- [ ] Usage checked after enable ([11](./11_Cost_Governance_And_Account_Hygiene.md))  
- [ ] Weekly Watchdog review on the calendar (not “when we remember”)  
- [ ] Ignore rules for noisy third-party stacks documented  

**Good:** symptom → profile/issue/event → fix → durable monitor. **Bad:** Watchdog spam as culture and Profiler never opened in an incident.

**Dig path.** Slow endpoint → Trace Explorer → Continuous Profiler hot method → fix → confirm p95. Error spike → Error Tracking issue by `version` → Events/Watchdog for deploy → roll back or patch → resolve issue.

## References

- [Continuous Profiler](https://docs.datadoghq.com/profiler/) · [Error Tracking](https://docs.datadoghq.com/error_tracking/) · [Watchdog](https://docs.datadoghq.com/watchdog/) · [Events](https://docs.datadoghq.com/events/)  
- [Dynamic Instrumentation](https://docs.datadoghq.com/dynamic_instrumentation/) · [Deployment Tracking](https://docs.datadoghq.com/tracing/services/deployment_tracking/)  
- [19 Incident / workflows](./19_Incident_Workflows_And_Collaboration.md)
