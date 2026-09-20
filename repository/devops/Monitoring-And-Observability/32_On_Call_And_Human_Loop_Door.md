# 32 — On-call and human loop door

[← Previous](./31_Cloud_Managed_Sinks_And_Audit_Door.md) · [README](./README.md) · [Next →](./33_Kubernetes_Workload_Observability_Patterns.md)

## 1. Concepts — detection without humans is incomplete

Pages exist to **interrupt a human** who can mitigate. Scheduling, escalations, incident etiquette, blameless postmortems, and error-budget negotiations are **team practice**. Depth lives in **[Methodologies/3 — Team patterns, SRE, incident](../Methodologies/3_Team_Patterns_SRE_Incident.md)**.

This folder supplies the *technical* inputs to that loop:

| Technical input | Chapter |
|-----------------|---------|
| What pages | [9](./9_Dashboards_Alerts_And_Pages.md)–[10](./10_Alert_Hygiene_And_Burn_Rates.md) |
| What “good” means | [8](./8_SLI_SLO_SLA_And_Error_Budgets.md) |
| How to dig | [21](./21_Correlation_And_Dig_Methodology.md) |
| How to route the page | PagerDuty tool folder (later) |

```text
SLI burn → page → human → dig path → mitigate → learn → better signals
```

**Disconfirm:** Perfect dashboards with no rotation ≠ operations. Hero culture without hygiene ≠ SRE. Rewriting Methodologies/3 inside this folder ≠ door discipline.

**Confirm:** Who is on-call for your critical service this week? Where is the runbook? Open Methodologies/3 for practice depth.

## 2. Advanced — handoff at the boundary

**Hand this folder → Methodologies when discussing:** shadow on-call, incident command, communication templates, budget policy with product.

**Keep here:** alert design, signal quality, dig tooling shape.

**Failure mode:** Buying PagerDuty while every warning still pages → burnout; fix [10](./10_Alert_Hygiene_And_Burn_Rates.md) first.

## 3. Applications

**Staff checklist**

- Every page-worthy alert maps to a rotation  
- Runbooks linked from alerts  
- Postmortems file signal gaps back into this track’s backlog  

**Next read:** [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md).

## References

- [Methodologies/3 — Team patterns, SRE, incident](../Methodologies/3_Team_Patterns_SRE_Incident.md)  
- [10 Alert hygiene](./10_Alert_Hygiene_And_Burn_Rates.md) · [PagerDuty](./PagerDuty/README.md)
