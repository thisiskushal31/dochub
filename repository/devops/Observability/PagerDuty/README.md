# PagerDuty

[← Back to Observability](../README.md) · [SRE / on-call practice](../../Methodologies/3_Team_Patterns_SRE_Incident.md)

---

## 1. Concepts

**PagerDuty** is an **incident management / on-call** product: routes alerts to humans, escalates, tracks incidents, and integrates with Slack/Teams and monitoring tools.

**Plain language:** The phone-tree for production. Monitoring detects; PagerDuty decides **who wakes up** and records what happened.

Practice (schedules, blameless, fatigue) lives in [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md). This folder is **product literacy**.

First use: [1_Install_And_First_Use](./1_Install_And_First_Use.md).

**Disconfirm:** More pages is **not** better reliability. PagerDuty is **not** your metrics database.

**Confirm:** What is the difference between an alert and an incident?

---

## 2. Advanced concepts

| Surface | Job |
|---------|------|
| Services / integrations | Prometheus, Grafana, Datadog, cloud alarms → PD |
| Escalation policies | Who, then who, then manager |
| Schedules / overrides | Follow-the-sun, holidays |
| Event intelligence / noise | Dedup, suppress, group (product features vary) |
| Post-incident | Timeline, responders, follow-ups |

Map alert severity to urgency carefully. Actionable pages only.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| First on-call | One service, one schedule, one escalation |
| Reduce noise | Fix flappy alerts at source; don’t mute forever |
| Multi-team | Service directory ownership ↔ catalog ([Backstage](../../Cloud-Native/Backstage/README.md)) |

**Staff checklist:** clear urgency rules; secondary escalation; runbook links on services; review unacked pages weekly.

---

## References

- [PagerDuty docs](https://www.pagerduty.com/docs/)  
- [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md)  
- [Observability tools index](../3_Observability_Tools.md)  
