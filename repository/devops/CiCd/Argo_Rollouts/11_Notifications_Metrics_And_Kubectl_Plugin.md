# 11 — Notifications, metrics, and kubectl plugin

[← Previous](./10_GitOps_Helm_Kustomize_And_Migrating.md) · [README](./README.md) · [Next: Worked example →](./12_Worked_Example_Canary_A_Service.md)

## 1. Concepts

### Notifications

Rollouts can emit notifications on progress, promote, abort, analysis failure, etc. Same family of notification services as other Argo projects (Slack, Teams, email, PagerDuty, webhook, …). Configure triggers/templates; wire ChatOps so humans see aborts without staring at the dashboard.

### Controller metrics

The controller exposes Prometheus metrics for operational health (reconcile, rollouts in progress, …). Scrape and alert — progressive delivery failures are production events ([controller metrics](https://argoproj.github.io/argo-rollouts/features/controller-metrics/)).

### Kubectl plugin surfaces

| Command family | Use |
|----------------|-----|
| `get` / `list` | Status, steps visualization |
| `promote` / `abort` / `retry` | Manual control |
| `undo` | Rollback revision |
| `set image` | Imperative image bump (prefer Git in prod) |
| `dashboard` | UI |
| `lint` | Validate Rollout manifests |
| `create analysisrun` | Ad-hoc analysis |
| notifications helpers | Test templates |

Full command reference lives upstream — version-aligned with the controller.

## 2. Advanced concepts

Prefer **automation** (analysis) over manual promote as the steady state. Notifications + metrics close the loop for on-call. Imperative CLI is for break-glass and labs.

Dashboard is optional; never the only audit trail — Git + AnalysisRun objects are the record.

## 3. Applications and use cases

| Role | Use |
|------|-----|
| Platform | Metrics + notifications defaults |
| App team | `get --watch` during first canaries; then trust analysis |
| On-call | Abort alerts; promote only with policy |

## References

- [Notifications](https://argoproj.github.io/argo-rollouts/features/notifications/)  
- [Controller metrics](https://argoproj.github.io/argo-rollouts/features/controller-metrics/)  
- [Kubectl plugin](https://argoproj.github.io/argo-rollouts/features/kubectl-plugin/)  
