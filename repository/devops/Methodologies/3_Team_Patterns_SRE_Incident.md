# Team patterns: SRE and incident response

[← Back to Methodologies](./README.md)

SRE (Site Reliability Engineering) is not a job title you paste on ops. It is a way to run services with **error budgets**, **toil reduction**, and **incident discipline**. This file is the DevOps/SRE overlap — enough to run on-call without pretending this is the full Google SRE corpus.

## SRE practices DevOps must know

| Idea | Meaning |
|------|---------|
| **SLI** | Indicator you measure (e.g. success rate, latency) |
| **SLO** | Target for that indicator (e.g. 99.9% success over 30 days) |
| **Error budget** | Allowed unreliability; when spent, favor reliability work over features |
| **Toil** | Manual, repetitive, automatable work — shrink it |
| **Reliability as a feature** | Same backlog priority rules as product work when budget is burned |

Observability implements SLIs: [Observability/1](../Observability/1_Monitoring_And_Metrics.md). Design trade-offs: [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts).

## On-call rotations

Goals: **human sustainability** + **fast mitigation**.

| Practice | Guidance |
|----------|----------|
| Primary / secondary | Secondary shadows and takes overflow |
| Shift length | Prefer ~12h or follow-the-sun over 24h heroics forever |
| Handoff | Written: open incidents, risky deploys, watch items |
| Page only actionable alerts | If humans ignore pages, you already lost |
| Compensation / time back | Burnout is a reliability risk |

## Incident response (roles)

Keep roles light; scale only if the incident is large.

| Role | Job |
|------|-----|
| **Incident commander** | Coordinates; does not deep-debug everything |
| **Comms** | Status to users/stakeholders |
| **Ops / responders** | Mitigate (rollback, scale, failover, feature flag) |
| **Scribe** | Timeline for the postmortem |

Severity (example language — tune to your org):

- **SEV1** — widespread outage / data risk → page immediately, all-hands as needed  
- **SEV2** — major feature down, workaround exists  
- **SEV3** — degraded / limited impact — business hours OK  

Mitigation beats root-cause during the fire. Root-cause lives in the postmortem ([1_Culture](./1_DevOps_Culture_And_Collaboration.md)).

## On-call tooling (literacy, not vendor cert)

| Product | Role |
|---------|------|
| **PagerDuty** | Schedules, escalation policies, paging, incident timeline |
| **Opsgenie** | Similar Atlassian-oriented paging / routing |
| **Grafana OnCall** | On-call scheduling integrated with Grafana stack |

What to configure everywhere:

1. **Schedule** — who is primary  
2. **Escalation** — if not ack in N minutes → secondary → manager  
3. **Integrations** — alertmanager / monitoring → create incident  
4. **Chat bridge** — optional notify to Slack/Teams ([6_ChatOps](./6_ChatOps_And_Notifications.md))  

Folder stubs for install/first use: [Observability/PagerDuty](../Observability/PagerDuty/README.md). Deep product docs stay with the vendor; you need routing that matches your severity model.

```text
Alert fires (Prometheus / cloud monitor / synthetic)
  → notification channel
  → PagerDuty / Opsgenie / Grafana OnCall
  → page primary
  → ack → mitigate → resolve
  → postmortem + runbook update
```

## Knowledge sharing during and after

- Runbooks linked from the alert ([7_Docs_And_Runbooks](./7_Docs_And_Runbooks.md))  
- Incident channel named clearly (`inc-YYYY-MM-DD-service`)  
- After: blameless postmortem with owned actions ([1](./1_DevOps_Culture_And_Collaboration.md))  
- MTTR feeds DORA ([5](./5_DORA_And_Delivery_Metrics.md))  

## Resilience and chaos engineering (literacy)

**Resilience engineering** asks how the system keeps succeeding under stress — people + process + tech — not only “add retries.”

**Chaos engineering** (popularized by Netflix; taught in many Foundation outlines) means **carefully** injecting failure in a controlled way to learn before real outages teach you.

Beginner rules:

- Start with game days / failure drills on non-prod using the runbook ([7](./7_Docs_And_Runbooks.md)).  
- Never chaotic-test prod without clear blast radius, abort criteria, and executive awareness.  
- Goal is Third Way learning ([10](./10_Core_Principles_Three_Ways_CALMS.md)), not breaking things for sport.  

Deep tooling and experiments can wait until Observability and platform maturity exist.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Hero culture (same person always pages) | Rotations + automation + fix noisy alerts |
| Page on every warning | Alert on symptoms users feel; ticket the rest |
| Incident without commander | Parallel debugging, no mitigation |
| Tooling without runbooks | Faster pages, slower recovery |
| Chaos in prod on day one | Game days first; expand carefully |

## Trade-offs

Strict SRE (error budgets that stop feature work) needs executive buy-in. Lightweight version: define SLOs for critical paths and review them in the same meeting as delivery metrics.

## Next

- Measure delivery: [5_DORA_And_Delivery_Metrics.md](./5_DORA_And_Delivery_Metrics.md)  
- Write the runbook: [7_Docs_And_Runbooks.md](./7_Docs_And_Runbooks.md)

## Further reading

- Google SRE books (free online) — incident management, SLOs  
- PagerDuty / Opsgenie / Grafana OnCall docs — only when you implement  
