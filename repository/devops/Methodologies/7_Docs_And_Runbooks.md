# Docs-as-code and runbooks

[← Back to Methodologies](./README.md)

When production hurts, people need **short, tested instructions** — not a wiki novel. Docs-as-code keeps those instructions next to the system they describe and subject to the same review culture as code.

## Docs next to code vs wiki

| Approach | Pros | Cons |
|----------|------|------|
| **Markdown in repo** | Versioned, PR-reviewed, stays near code | Needs discoverability (README index) |
| **Wiki / Notion** | Easy editing for non-git users | Drift; no PR; hard to tie to a commit |
| **Hybrid** | ADRs + runbooks in git; narrative in wiki | Must state which is source of truth |

**House lean:** runbooks and on-call procedures in git (`/docs/runbooks` or service repo). Link them from alerts.

Architecture decision records (ADRs): short “why we chose X” files in git. Deeper design discourse → [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts).

## Runbook structure

Every runbook should answer: **what is broken**, **how bad**, **what to do**, **how to know it is fixed**, **who to call**.

### Template (copy)

```markdown
# Runbook: <alert or symptom name>

## Trigger
What alert / user report starts this? Link to the alert rule.

## Impact
Who / what is affected? Severity hint (SEV1–3).

## Immediate mitigation (first 15 minutes)
1. …
2. …
3. Rollback command / flag / scale step (exact)

## Diagnosis
- Dashboards: <links>
- Logs / traces: <queries>
- Common causes: …

## Escalation
- Primary: …
- Secondary / vendor: …

## Verification
How to confirm recovery (SLI, synthetic check, user path).

## Follow-ups
- Ticket template / postmortem link
- Last tested: YYYY-MM-DD
```

## Example outline: high error rate on service X

```markdown
# Runbook: payments-api high 5xx

## Trigger
Alert: `payments_api_5xx_rate > 5%` for 5m
Dashboard: https://grafana.example/d/payments

## Impact
Checkout failures; SEV1 if >15% or payments queue backed up.

## Immediate mitigation
1. Check recent deploy in #deploys — if <60m, rollback:
   `helm rollback payments <n>`  # or your real command
2. Disable flag `new_pricing_engine` if enabled
3. Scale pods if CPU/mem saturated: `kubectl scale …`

## Diagnosis
- Trace: spike on dependency `charge-svc`?
- Logs: `payment_gateway_timeout`
- Downstream: Redis / DB connections

## Escalation
PagerDuty schedule `payments`; platform secondary if node/cluster issue

## Verification
5xx < 1% for 15m; synthetic checkout green
```

Replace commands with your real paved-road commands — accuracy beats prose.

## Hygiene

- **Short** — one alert family per runbook when possible  
- **Test quarterly** — game day or shadow on-call walks the steps  
- **Link from alert** — annotation / runbook_url  
- **Update in the postmortem** — action item closes only when doc changed ([1](./1_DevOps_Culture_And_Collaboration.md))  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| 40-page “ops manual” | One page per symptom |
| Runbook with stale kubectl flags | Test after each paved-road change |
| Docs only in someone’s head | On-call cannot scale |

## Next

- Cost awareness as ops hygiene: [8_FinOps_Literacy](./8_FinOps_Literacy.md)  
- Incident roles that use these docs: [3_Team_Patterns_SRE_Incident](./3_Team_Patterns_SRE_Incident.md)

## Further reading

- Google SRE — “Emergency Response” / playbooks  
- ADR templates (MADR, Nygard) — pick one and stay consistent  
