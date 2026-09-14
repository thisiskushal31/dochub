# 04 — Install, plugin, dashboard, and first Rollout

[← Previous](./03_Architecture_And_Controller.md) · [README](./README.md) · [Next: Blue-green →](./05_Blue_Green_Strategy.md)

---

## 1. Concepts

### Install controller (lab shape)

```bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

For production: **pin a release version**, not only `latest`. If using another namespace, fix ClusterRoleBinding service account namespace. GKE may need cluster-admin binding for CRD/RBAC creation.

Namespace-scoped install: apply CRDs separately, then `namespace-install.yaml`.

### Kubectl plugin (recommended)

```bash
brew install argoproj/tap/kubectl-argo-rollouts
# or install from GitHub releases for your OS
kubectl argo rollouts version
```

Common commands: `get rollout`, `promote`, `abort`, `retry`, `undo`, `dashboard`, `lint`.

### Dashboard

```bash
kubectl argo rollouts dashboard
```

Optional UI to visualize steps, promote, and abort. Not required for GitOps automation.

### First Rollout (blue-green outline)

1. Create active (and optional preview) Services.  
2. Apply a Rollout with `strategy.blueGreen.activeService` (and `previewService`).  
3. Point traffic Ingress at the **active** Service.  
4. Change image digest; watch `kubectl argo rollouts get rollout <name> --watch`.  
5. Promote when ready (`autoPromotionEnabled: false` for manual).

Canary-first labs: `setWeight` + `pause` steps without mesh — understand replica ratios before adding Istio/NGINX.

### Migrate later

Convert Deployment → Rollout (apiVersion/kind/strategy) or use `workloadRef` ([10](./10_GitOps_Helm_Kustomize_And_Migrating.md)).

---

## 2. Advanced concepts

### Controller in every cluster

GitOps may live centrally; Rollouts must run where the pods run.

### Upgrade

Read release notes; CRD changes need care. Keep plugin version roughly aligned with controller.

### RBAC

Teams need rights to Rollouts, AnalysisRuns, Experiments, and to patch Services / mesh CRs the controller uses. Least privilege per namespace.

---

## 3. Applications and use cases

| Goal | Path |
|------|------|
| Learn | Non-prod cluster; blue-green with manual promote; then canary + Prometheus analysis |
| Platform | Pin version; dashboard optional; notifications later ([11](./11_Notifications_Metrics_And_Kubectl_Plugin.md)) |
| With Argo CD | Install Rollouts on destination clusters; GitOps owns Rollout manifests |

---

## References

- [Installation](https://argoproj.github.io/argo-rollouts/installation/)  
- [Getting started](https://argoproj.github.io/argo-rollouts/getting-started/)  
- [Kubectl plugin](https://argoproj.github.io/argo-rollouts/features/kubectl-plugin/)  
- [Dashboard](https://argoproj.github.io/argo-rollouts/dashboard/)  
