# 08 — Monitors, SLOs, and dashboards

[← Previous](./07_RUM_Synthetics_And_Client_Signals.md) · [README](./README.md) · [Next →](./09_Containers_Kubernetes_And_Infrastructure.md)

## 1. Concepts — what to do with the data

| Object | Job |
|--------|-----|
| **Dashboard** | Explore and explain (not a page by itself) |
| **Monitor** | Condition → notify (chat, email, PagerDuty) |
| **SLO** | Target + error budget / burn |
| **Incident** | Coordinate humans when it matters |

Write **symptom-first** monitors (user-facing latency/errors), not “disk 70%” pages unless that disk is the product ([parent 9](../9_Dashboards_Alerts_And_Pages.md), [10](../10_Alert_Hygiene_And_Burn_Rates.md)). One page path per symptom—don’t also page from three overlapping monitors.

SLOs can be metric- or monitor-based. Burn alerts wake people; dashboards don’t.

**Disconfirm:** A wall of green dashboards = reliability. Hundreds of warning monitors = coverage.

**Confirm:** Named owner and runbook link on every paging monitor?

## 2. Advanced

Manage monitors as code (Terraform / API) for reviewable change. Composite, anomaly, and Watchdog signals are helpers—not a substitute for knowing your SLIs. Downtime/maintenance windows reduce false pages during deploys.

## 3. Applications — minimal set for one service

1. RED dashboard filtered by `service:` + `env:`.  
2. Latency and error-rate monitors with clear thresholds.  
3. One SLO on the user journey you care about.  
4. Notification → on-call only ([PagerDuty](../PagerDuty/README.md)).

## References

- [Monitors](https://docs.datadoghq.com/monitors/) · [SLOs](https://docs.datadoghq.com/service_level_objectives/) · [Dashboards](https://docs.datadoghq.com/dashboards/)  
- [09 Containers](./09_Containers_Kubernetes_And_Infrastructure.md)
