# 2 — Mindset and anti-patterns

[← Previous](./1_Paired_Practice_Monitoring_And_Observability.md) · [README](./README.md) · [Next →](./3_Monitoring_Program_Anatomy.md)

## 1. Concepts — habits that survive tools

Tools change. Habits decide whether pages are trustworthy.

| Habit | Why it matters |
|-------|----------------|
| Symptom-first alerts | Page on user pain (error rate, latency), not every CPU blip |
| Define “good” before dashboards | SLIs force honest graphs |
| Label contracts | Prevents metric/log explosion |
| Dig path rehearsed | metric → trace → log under stress |
| Budget telemetry | Cost and noise are reliability risks |
| Own the page | Every alert has a runbook owner |

### Anti-patterns (name them out loud)

| Anti-pattern | What it looks like | Fix direction |
|--------------|--------------------|---------------|
| Tool tourism | New vendor each quarter; no SLOs | Freeze logos; finish jobs 3–21 |
| Dashboard theatre | 40 panels, no pages | One service overview + burn alerts |
| Cause-based paging | “Disk > 80%” wakes humans while API is fine | Symptom SLOs; disk as ticket/secondary |
| Log everything | Full request bodies in prod | Structured fields; sample; redact PII |
| Trace every span forever | 100% sample forever | Tail sampling; error bias ([20](./20_Sampling_Strategies.md)) |
| Cardinality by user ID | Labels = user/request IDs | Bound dimensions ([7](./7_Cardinality_And_Label_Contracts.md)) |
| Silent dependencies | No peer SLIs | [13](./13_Dependency_And_Peer_Monitoring.md) |
| Hope cron ran | No last-success | [14](./14_Batch_Cron_And_Async_Monitoring.md) |
| Copy-paste alert rules | Same threshold on every service | SLO-relative burn rates ([10](./10_Alert_Hygiene_And_Burn_Rates.md)) |

**Disconfirm:** More panels ≠ more reliability. Silence ≠ health if you never instrumented the path. “We’ll clean cardinality later” usually means never.

**Confirm:** Name three anti-patterns on your estate today. Which habit would cut page noise fastest?

## 2. Advanced — culture and incentives

Error budgets ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)) only work if product and eng share the burn conversation. Without that, monitoring becomes a private ops hobby.

On-call load is a **design input**: if people mute alerts to sleep, the detect layer has failed—fix in [10](./10_Alert_Hygiene_And_Burn_Rates.md) and [32](./32_On_Call_And_Human_Loop_Door.md).

**Platform vs service ownership:** Platform owns collectors, retention, and shared contracts; service teams own SLIs, instrumentation quality, and runbooks. Blurry ownership produces orphan dashboards.

**Brownfield:** You may inherit cause-based pages and unbounded labels. Treat cleanup as reliability work funded by error budget or explicit platform OKRs—not as hero weekends.

## 3. Applications

**Staff checklist**

- Alert inventory reviewed in last 90 days; orphans deleted or owned  
- No production label that is unbounded (user ID, raw URL, email)  
- New services must pass a minimum signal checklist before GA  
- On-call can describe dig path without opening a vendor marketing page  

**Drill:** Take your noisiest alert. Is it symptom or cause? Can you demote it without losing user-visible coverage?

## References

- [Google SRE — Embracing risk](https://sre.google/sre-book/embracing-risk/)  
- [10 Alert hygiene](./10_Alert_Hygiene_And_Burn_Rates.md) · [28 Scorecard](./28_Shape_Scorecard_Drills_And_Maturity.md)
