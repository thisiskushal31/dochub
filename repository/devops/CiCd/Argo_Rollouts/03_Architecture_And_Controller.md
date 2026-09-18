# 03 — Architecture and controller

[← Previous](./02_Core_Concepts_Rollout_Analysis_Experiment.md) · [README](./README.md) · [Next: Install →](./04_Install_Plugin_Dashboard_And_First_Rollout.md)

## 1. Concepts

### Components

| Piece | Role |
|-------|------|
| **Rollouts controller** | Watches `Rollout` (and related) CRs; reconciles ReplicaSets, Services, traffic objects, AnalysisRuns |
| **Rollout** | Desired pod template + strategy |
| **ReplicaSets** | Stable and canary/preview sets; controller-owned — do not manage them by hand |
| **Services** | Stable / canary / active / preview selectors updated by the controller |
| **Ingress / mesh resources** | Optional; manipulated for weighted routing |
| **AnalysisTemplate / AnalysisRun** | Metric or job success criteria |
| **CLI plugin / dashboard** | Optional day-2 UX |

The controller **ignores ordinary Deployments**. Only Rollouts (and referenced workloads) participate.

### Multi-cluster note

Install the controller **in every cluster** that runs Rollout workloads. Rollouts is not a multi-cluster orchestrator; GitOps (Argo CD) often spans clusters while each cluster runs its own Rollouts controller.

## 2. Advanced concepts

### Namespace vs cluster install

Standard `install.yaml` is cluster-scoped. `namespace-install.yaml` needs separate CRD apply — useful for multiple controllers per cluster with isolation. Pin release versions in production.

### What changes on each update

A change to `spec.template` (usually image digest) creates a new ReplicaSet. The strategy decides how traffic and scale move from stable to new. Mid-flight template changes scale down the in-progress canary/preview and restart progression toward the newest template (hotfix semantics — see best practices).

### Traffic path

Users → Ingress/mesh → Service(s) → pods. Without a traffic provider, split is pod-count based. With a provider, the controller updates mesh/ingress objects to match `setWeight`.

## 3. Applications and use cases

| Need | Architecture choice |
|------|---------------------|
| Single cluster, one team | Standard install in `argo-rollouts` ns |
| Many workload clusters | Controller per cluster; Argo CD manages Rollout YAML |
| Shared cluster, team isolation | Namespace install + careful RBAC |
| Observe without kubectl | Enable dashboard; still automate via Git |

## References

- [Architecture](https://argoproj.github.io/argo-rollouts/architecture/)  
- [Installation](https://argoproj.github.io/argo-rollouts/installation/)  
