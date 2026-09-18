# 10 — GitOps, Helm, Kustomize, and migrating from Deployments

[← Previous](./09_Experiments_HPA_Metadata_Restart_Rollback.md) · [README](./README.md) · [Next: Notifications & CLI →](./11_Notifications_Metrics_And_Kubectl_Plugin.md)

## 1. Concepts

### Pairing with Argo CD (usual path)

1. CI pushes `image@sha256:…`  
2. GitOps commit updates Rollout (or Helm values)  
3. Argo CD syncs the Rollout  
4. Rollouts controller executes strategy + analysis  

Argo CD does **not** need to “understand” canary steps — it syncs desired YAML. Health may need awareness of Rollout status for Application health (custom health if required).

Rollouts also works with Flux, plain kubectl, or Helm — self-contained.

### Helm and Kustomize

Official notes cover packaging Rollouts with **Helm** and **Kustomize** (CRDs, hooks pitfalls, strategic merge). Prefer GitOps-rendered or chart-pinned manifests; pin image digests in values/overlays.

### Migrating from Deployment

Two approaches:

1. **Convert:** change `apiVersion`/`kind` to Rollout; replace `strategy.rollingUpdate` with `blueGreen` or `canary`.  
2. **`workloadRef`:** Rollout references an existing Deployment’s pod template — migration aid so you do not duplicate the pod spec immediately.

Migrate one service at a time; leave unrelated Deployments alone (controller ignores them).

## 2. Advanced concepts

### One apply path

Do not CI `kubectl set image` **and** GitOps sync the same Rollout — dual controllers of desired state.

### Schema expand/contract

While two versions run, DB migrations still need expand/contract ([7](../7_DB_Migrations_In_Pipelines.md)).

### Progressive delivery ≠ env promotion

Rollouts moves traffic **inside** an environment. Promoting digest DEV → staging → prod remains GitOps paths / Application policies ([Argo_CD](../Argo_CD/README.md), [8](../8_Environments_Promotion_And_Approvals.md)).

## 3. Applications and use cases

| Situation | Practice |
|-----------|----------|
| Argo CD shop | Rollout manifests in GitOps repo; AnalysisTemplates too |
| Helm umbrella | Chart templates Rollout + Services + AnalysisTemplate |
| Cautious migrate | workloadRef first, then full Rollout |

**Good:** digest in Git; analysis templates versioned beside apps. **Bad:** only live `kubectl argo rollouts set image` in prod.

## References

- [Migrating](https://argoproj.github.io/argo-rollouts/migrating/)  
- [Helm](https://argoproj.github.io/argo-rollouts/features/helm/) · [Kustomize](https://argoproj.github.io/argo-rollouts/features/kustomize/)  
- [Argo CD track](../Argo_CD/README.md)  
