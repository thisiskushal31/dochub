# 08 — Monitors, SLOs, and dashboards

[← Previous](./07_RUM_Synthetics_And_Client_Signals.md) · [README](./README.md) · [Next →](./09_Containers_Kubernetes_And_Infrastructure.md)

## 1. Concepts — what to do with the data

| Object | Job |
|--------|-----|
| **Dashboard** | Explore and explain (not a page by itself) |
| **Monitor** | Condition → notify (chat, email, PagerDuty) |
| **SLO** | Target + error budget / burn |
| **Incident** | Coordinate humans when it matters ([19](./19_Incident_Workflows_And_Collaboration.md)) |

Write **symptom-first** monitors (user-facing latency/errors), not “disk 70%” pages unless that disk *is* the product ([parent 9](../9_Dashboards_Alerts_And_Pages.md), [10](../10_Alert_Hygiene_And_Burn_Rates.md)). One page path per symptom—do not also page from three overlapping monitors.

SLOs can be metric- or monitor-based (and synthetic-backed). Burn alerts wake people; dashboards do not.

**Disconfirm:** A wall of green dashboards = reliability. Hundreds of warning monitors = coverage. SLO without a page = operated SLO.

**Confirm:** Named owner and runbook link on every paging monitor? Notification tests into a quiet channel first?

## 2. Advanced — as-code, composites, noise

Manage monitors and dashboards as code (Terraform / API) once the UI path works ([26](./26_API_Terraform_CLI_And_Account_Admin.md)). Composite, anomaly, outlier, and Watchdog signals are helpers—not a substitute for knowing your SLIs ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)).

**Downtime / maintenance** windows reduce false pages during deploys. Tag monitors with `team`/`service` for ownership and mute hygiene.

**Evaluation delay and missing data** settings matter for sparse metrics—wrong choices flap or go silent. Log and trace monitors have different query costs than metric monitors—budget Explore abuse.

## 3. Applications — use cases

| Use case | Minimal set |
|----------|-------------|
| One HTTP service | RED dashboard; latency + error monitors; one availability/latency SLO |
| Synthetic journey | Synthetic monitor → page on consecutive failures |
| Multi-team platform | Terraform monitors; RBAC so only owners edit paging alerts |
| Burn | Fast-burn page; slow-burn ticket—not both paging |

**Staff checklist**

1. Monitor → runbook link.  
2. Mute policy during deploys.  
3. SLO list matches real user journeys from [13](./13_Worked_Example_First_Service.md).  
4. Quarterly delete unused dashboards and warning-only spam.

## References

- [Monitors](https://docs.datadoghq.com/monitors/) · [SLOs](https://docs.datadoghq.com/service_level_objectives/) · [Dashboards](https://docs.datadoghq.com/dashboards/)  
- [09 Containers](./09_Containers_Kubernetes_And_Infrastructure.md)
