# 24 — Feature flags, experiments, and product analytics

[← Previous](./23_LLM_Observability_Bits_AI_And_MCP.md) · [README](./README.md) · [Next →](./25_Cloud_Cost_IDP_And_Platform_Services.md)

## 1. Concepts — release controls meet product truth

Progressive delivery and product questions need the same `service`/`version` plane as APM and RUM. Datadog’s flag/experiment/analytics offerings put **change context** next to errors and conversions.

### Feature Flags

Manage targeting and progressive delivery with hooks into observability: flag changes become Events and dimensions for APM/RUM digs. If LaunchDarkly/Flagsmith/etc. is already the org standard, **keep one primary flag plane** — still emit change events Datadog can correlate rather than running two conflicting sources of truth.

**When:** kill-switches and percentage rollouts owned by the same teams that watch Error Tracking. **When not:** as a second flag system “because Datadog has one.”

### Experiments

Experimentation / exposure analysis for measuring change impact. Pair with flags (who saw variant B?) and Product Analytics (did they convert?). Use Error Tracking ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)) to catch bad cohorts early — a “winning” conversion with a spike in exceptions is not a win.

### Product Analytics

Adoption, conversion, and behavior from client SDK events (often shares instrumentation with RUM ([07](./07_RUM_Synthetics_And_Client_Signals.md))). Server-side events via API when the decision isn’t in the browser. Privacy review before collecting PII-ish properties.

### Journey Monitoring

User-journey oriented monitoring across multi-step digital experiences — beyond a single synthetic URL check. Use when funnel drops (browse → cart → pay) matter as much as HTTP 500s.

| Offering | Primary question |
|----------|------------------|
| Feature Flags | Who gets the change, and can we kill it? |
| Experiments | Did the change improve the metric? |
| Product Analytics | What do users do? |
| Journey Monitoring | Where do multi-step flows break? |

**Disconfirm:** Flags without kill-switch ownership. Product Analytics as the only APM. Experiments without error-rate guardrails.

**Confirm:** Flag → monitor correlation on releases? Privacy review for analytics events? One primary flag system named?

## 2. Advanced — tagging, privacy, failure modes

**Unified tags.** Tie flag key / variant to `version` and Deployment Tracking so digs answer “was this the 10% rollout?” Events on flag change should match CI deploy Events in the timeline ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)).

**Guardrail metrics.** Every experiment needs a reliability guardrail (error rate, latency, synthetic journey) beside the product KPI. Auto-stop or page when guardrails breach — don’t wait for the experiment end date.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Flag on, no dig context | Events not emitted; RUM not tagged with flag |
| Dual flag systems | Teams flip both; targeting drifts |
| Analytics PII incident | Properties not reviewed; SDS skipped ([20](./20_Security_Products.md)) |
| Journey noise | Too many optional steps; no SLO on critical path only |

**Cost.** Client event volume can rival RUM — sample, allowlist properties, drop high-cardinality IDs ([04](./04_Metrics_Tags_And_Cardinality_Cost.md), [11](./11_Cost_Governance_And_Account_Hygiene.md)).

**Governance.** Who can create prod flags? Who approves 100% promote? Document kill-switch runbooks in Notebooks/IDP ([19](./19_Incident_Workflows_And_Collaboration.md), [25](./25_Cloud_Cost_IDP_And_Platform_Services.md)).

## 3. Applications — use cases and staff checklist

**Use case 1 — Low-risk flag migration.** If Datadog is the flag store: one non-critical flag; wire change Events; dashboard error rate by variant.

**Use case 2 — Checkout experiment.** Flag splits traffic; Experiment tracks conversion; Journey Monitoring on pay step; Error Tracking + latency as guardrails; auto-halt on error spike.

**Use case 3 — External flag system.** Keep LaunchDarkly (example) as source of truth; emit Datadog Events on change; tag RUM/APM with flag variant for correlation.

**Use case 4 — Funnel dig.** Product Analytics shows drop at step 3; Journey + Synthetics confirm; APM shows dependency timeout — fix backend, not the marketing copy.

**Staff checklist**

- [ ] Single primary flag system decided and documented  
- [ ] Kill-switch owners and runbook for top flags  
- [ ] Flag/experiment variants visible in APM/RUM or Events  
- [ ] Experiments include reliability guardrails  
- [ ] Product Analytics privacy review done  
- [ ] Journey Monitoring only on critical multi-step paths  

**Good:** progressive delivery with error guardrails and one flag plane. **Bad:** two flag systems and analytics events full of emails.

## References

- [Feature Flags](https://docs.datadoghq.com/feature_flags/) · [Experiments](https://docs.datadoghq.com/experiments/)  
- [Product Analytics](https://docs.datadoghq.com/product_analytics/) · [Journey Monitoring](https://docs.datadoghq.com/journey_monitoring/)  
- [25 Cloud Cost / IDP](./25_Cloud_Cost_IDP_And_Platform_Services.md)
