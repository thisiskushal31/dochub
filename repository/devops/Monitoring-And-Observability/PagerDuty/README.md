# PagerDuty

[← Back to Monitoring & observability](../README.md) · [SRE / on-call practice](../../Methodologies/3_Team_Patterns_SRE_Incident.md) · [On-call door](../32_On_Call_And_Human_Loop_Door.md) · [Pages](../9_Dashboards_Alerts_And_Pages.md)

## 1. Concepts

**PagerDuty** is an **incident management / on-call** product: routes alerts to humans, escalates, tracks incidents, and integrates with Slack/Teams and monitoring tools.

**Plain language:** The phone-tree for production. Monitoring detects; PagerDuty decides **who wakes up** and records what happened.

Practice (schedules, blameless, fatigue) lives in [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md). This folder is **product literacy**.

**What for:** Route and escalate actionable alerts to humans.  
**When:** You have alerts worth waking someone (Prometheus, Grafana, Datadog, cloud alarms, …).  
**Why not:** Using PD as a metrics database; paging on every warning without SLOs ([metrics/SLO](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

First use: [1_Install_And_First_Use](./1_Install_And_First_Use.md).

**Disconfirm:** More pages is **not** better reliability. PagerDuty is **not** your metrics database.

**Confirm:** What is the difference between an alert and an incident?

## 2. Advanced concepts

| Surface | Job |
|---------|------|
| Services / integrations | Prometheus, Grafana, Datadog, cloud alarms → PD |
| Escalation policies | Who, then who, then manager |
| Schedules / overrides | Follow-the-sun, holidays |
| Event intelligence / noise | Dedup, suppress, group (product features vary) |
| Post-incident | Timeline, responders, follow-ups |

Map alert severity to urgency carefully. Actionable pages only.

## 3. Applications

| Goal | Pattern |
|------|---------|
| First on-call | One service, one schedule, one escalation |
| Reduce noise | Fix flappy alerts at source; don’t mute forever |
| Multi-team | Service directory ownership ↔ catalog ([Backstage](../../Cloud-Native/Backstage/README.md)) |

**Staff checklist:** clear urgency rules; secondary escalation; runbook links on services; review unacked pages weekly.

## References

- [PagerDuty docs](https://www.pagerduty.com/docs/)  
- [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md)  
- [On-call door](../32_On_Call_And_Human_Loop_Door.md) · [9 Dashboards / pages](../9_Dashboards_Alerts_And_Pages.md)  
