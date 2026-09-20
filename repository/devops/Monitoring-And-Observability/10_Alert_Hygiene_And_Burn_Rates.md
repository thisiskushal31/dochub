# 10 — Alert hygiene and burn rates

[← Previous](./9_Dashboards_Alerts_And_Pages.md) · [README](./README.md) · [Next →](./11_Infrastructure_And_Host_Monitoring.md)

## 1. Concepts — keep pages rare and true

**Alert hygiene** is the ongoing work that stops monitoring from becoming noise. Without it, humans mute everything and detection dies.

**Burn rate** (SLO context): how fast you are consuming the error budget relative to the window. High burn → page soon; low burn → ticket / plan reliability work.

```text
Budget = 1 − SLO
Burn rate = (error rate / budget allowance) over a short window
Fast burn (e.g. 14×) → page
Slow burn (e.g. 2×)  → ticket / sprint attention
```

Multi-window alerting (short + long) reduces flap: page when *both* recent pain and sustained burn agree ([Google SRE workbook pattern](https://sre.google/workbook/alerting-on-slos/)).

| Hygiene practice | Purpose |
|------------------|---------|
| Symptom-first pages | Wake on user pain |
| `for:` / duration | Survive scrapes and blips |
| Owner + runbook | Actionable |
| Review / delete orphans | Stop mute culture |
| Inhibit / depend | Don’t page 50 times for one outage |

**Disconfirm:** More alerts ≠ safer. Static CPU thresholds as primary pages ≠ SLO thinking. Never reviewing flappy alerts ≠ “stable monitoring.”

**Confirm:** What is your page rate per on-call week? Which alert would you delete tomorrow?

## 2. Advanced — flapping, storms, and debt

**Flap:** oscillating condition—fix with duration, hysteresis, or better SLI.

**Alert storms:** cascading dependency failures—use inhibition (downstream silences when upstream fires) carefully so you don’t hide unique faults.

**Toil debt:** every page without action trains people to ignore. Track “pages with no ticket / no fix” as a smell.

**Cause alerts as secondary:** disk full can be a ticket while success-ratio burn pages; promote cause alerts only when they predict imminent user pain.

**Failure mode:** Autosilence that never expires → real outage with no page.

## 3. Applications

**Staff checklist**

- SLO burn alerts for critical services (not only raw thresholds)  
- Monthly (or sprint) alert review with delete/demote quota  
- On-call retrospective includes “noise” as a first-class topic  

**Exercise:** Classify last 20 pages: actionable / flappy / duplicate. Fix the top duplicate class.

## References

- [Google SRE workbook — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)  
- [8 SLI/SLO](./8_SLI_SLO_SLA_And_Error_Budgets.md) · [32 On-call door](./32_On_Call_And_Human_Loop_Door.md)
