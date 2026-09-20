# 9 — Dashboards, alerts, and pages

[← Previous](./8_SLI_SLO_SLA_And_Error_Budgets.md) · [README](./README.md) · [Next →](./10_Alert_Hygiene_And_Burn_Rates.md)

## 1. Concepts — three different jobs

| Artifact | Job | Human expectation |
|----------|-----|-------------------|
| **Dashboard** | Explore and situational awareness | Someone is already looking |
| **Alert** | Signal that a condition is true | May be ticket, chat, or page |
| **Page** | Wake a human now | Interrupt sleep / focus; must be rare and actionable |

Conflating them produces either dashboard theatre (pretty, nobody paged) or page fatigue (everything pages).

```text
Symptom fires ──► Alert evaluation ──► severity route
                      │                    │
                      ▼                    ▼
                 ticket/chat            PAGE + runbook
```

**Good service overview dashboard:** SLI/burn, RED for critical routes, dependency health, recent deploy/event markers, links into traces/logs—not forty unrelated panels.

**Alert design:** prefer symptoms tied to SLOs; include what is broken, for how long, and where to dig ([21](./21_Correlation_And_Dig_Methodology.md)).

**Disconfirm:** A dashboard is not an alert. A Slack message is not automatically a page. “Critical” on every rule destroys urgency.

**Confirm:** For your top service, which panels are overview vs debug? Which conditions page vs ticket?

## 2. Advanced — severity, routing, and change

**Severity model:** page (user-visible burn), ticket (saturation approaching), info (audit). Keep the page bucket small.

**Routing:** service owner rotation, not a shared megaphone channel. Escalation policy lives with on-call tooling ([PagerDuty tool folder](./PagerDuty/README.md) later; practice in [32](./32_On_Call_And_Human_Loop_Door.md)).

**Deploy markers / events:** correlate “what changed” without making every CI log a page ([23](./23_Continuous_Profiling_And_Events.md)).

**Failure mode:** Alert that requires SSH folklore and no runbook → longer MTTR and muted phones.

## 3. Applications

**Staff checklist**

- One canonical overview dashboard per critical service  
- Page-worthy alerts listed and counted (aim: few)  
- Every page has runbook link and owner  

**Exercise:** Remove or demote one alert that has not driven useful action in 60 days.

## References

- [Google SRE — Practical alerting](https://sre.google/workbook/alerting-on-slos/)  
- [10 Alert hygiene](./10_Alert_Hygiene_And_Burn_Rates.md) · [21 Dig path](./21_Correlation_And_Dig_Methodology.md)
