# 06 — Dashboards and provisioning as code

[← Previous](./05_Datasources_Explore_And_Correlation.md) · [README](./README.md) · [Next: Alerting →](./07_Alerting_OnCall_And_Boundaries.md)

## 1. Concepts

Dashboards answer **known** questions; Explore answers **new** ones. Prefer **provisioning** (Git → Grafana) over click-ops for anything that pages or is “source of truth.”

| Practice | Why |
|----------|-----|
| Folder per team/service | Ownership |
| Variables (`service`, `env`) | One board, many targets—keep combo cardinality sane |
| Library / reusable rows | Golden signals consistency |
| Links to Explore / runbooks | Dig path |
| Recorded PromQL | Fast boards ([Prometheus/07](../Prometheus/07_Recording_Rules_And_SLIs.md)) |

**Disconfirm:** 200 orphan boards ≠ maturity. Screenshot-only runbooks ≠ operable.

**Confirm:** Is the service overview in Git? Who approves changes?

## 2. Advanced

**Grafana as code:** provisioning YAML, Terraform providers, or dashboards-as-JSON in CI. Review like application code.

**Huge dashboards:** split by job (overview vs dig); avoid 40-panel monsters that timeout mid-incident.

## 3. Applications

**Staff checklist**

- Top services: Git-provisioned overview (RED + burn + links)  
- Quarterly delete unused boards  
- Variables documented  

## References

- [Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)  
- [07 Alerting](./07_Alerting_OnCall_And_Boundaries.md)
