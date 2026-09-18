# PagerDuty — install and first use

[← PagerDuty](./README.md)

---

## 1. Concepts

Minimal path:

1. Create a **Service** (your app or platform component).  
2. Add an **integration** (Events API / Prometheus / Grafana contact point).  
3. Create a **schedule** and **escalation policy**.  
4. Send a test event; confirm mobile/push.  
5. Attach a runbook URL on the service.

**Disconfirm:** Routing everything to one person 24×7 is **not** a schedule.

---

## 2. First checklist

| Step | Done when |
|------|-----------|
| Test page acknowledged | Mobile works |
| Escalation | Second ping if no ack |
| Low-urgency path | Email/Slack only for non-wake |
| Noise review | Flappy alert fixed or retuned |

Practice depth: [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md).

---

## References

- [PagerDuty getting started](https://support.pagerduty.com/)  
