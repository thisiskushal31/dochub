# 09 — Experiments, HPA/VPA, metadata, restart, rollback

[← Previous](./08_Analysis_And_Metric_Providers.md) · [README](./README.md) · [Next: GitOps & migrate →](./10_GitOps_Helm_Kustomize_And_Migrating.md)

## 1. Concepts

Beyond blue-green and canary steps, Rollouts offers supporting features:

| Feature | Purpose |
|---------|---------|
| **Experiment** | Run one or more ReplicaSets for a duration; optional analysis; baseline vs canary comparison |
| **HPA support** | HorizontalPodAutoscaler works with Rollouts (details/version nuances in official HPA doc) |
| **VPA support** | Vertical Pod Autoscaler considerations with Rollouts |
| **Ephemeral metadata** | Labels/annotations distinguishing canary vs stable pods (pair with Downward API) |
| **Restart** | Restart pods in a Rollout without full strategy (see restart docs) |
| **Scale down aborted RS** | Control how aborted canary ReplicaSets are scaled down |
| **Rollback window** | Limits / behavior around undo to prior revisions |
| **Anti-affinity** | Prefer not co-locating stable and canary pods |

## 2. Advanced concepts

### Experiments

Use when you need a **controlled parallel run** that is not the main canary step machine — e.g. spin baseline + canary, compare metrics, then decide. Experiments can reference AnalysisTemplates. They are not a substitute for day-to-day canary steps on every release.

### HPA / VPA

Autoscaling interacts with canary scales and replica counts. Read current HPA/VPA support notes for your version before assuming Deployment-identical behavior. Prefer omitting Git `replicas` when HPA fully owns scale (same GitOps lesson as Deployments).

### Ephemeral metadata

Apps that must know “am I canary?” read injected labels via Downward API — useful for metrics dimensions and feature defaults.

### Rollback / undo

`kubectl argo rollouts undo` and revision history interact with rollback window settings. Prefer Git revert of the digest when GitOps owns desired state, then let the Rollout progress — keep Git and cluster aligned ([10](./10_GitOps_Helm_Kustomize_And_Migrating.md)).

## 3. Applications and use cases

| Need | Feature |
|------|---------|
| Fair metric compare | Experiment + Analysis |
| Scale with load during canary | HPA support literacy |
| Canary-aware app config | Ephemeral metadata |
| Abort cleanup policy | Scaledown aborted RS |

## References

- [Experiment](https://argoproj.github.io/argo-rollouts/features/experiment/)  
- [HPA](https://argoproj.github.io/argo-rollouts/features/hpa-support/) · [VPA](https://argoproj.github.io/argo-rollouts/features/vpa-support/)  
- [Ephemeral metadata](https://argoproj.github.io/argo-rollouts/features/ephemeral-metadata/)  
- [Restart](https://argoproj.github.io/argo-rollouts/features/restart/) · [Rollback](https://argoproj.github.io/argo-rollouts/features/rollback/)  
- [Anti-affinity](https://argoproj.github.io/argo-rollouts/features/anti-affinity/anti-affinity/)  
- [Scaledown aborted](https://argoproj.github.io/argo-rollouts/features/scaledown-aborted-rs/)  
