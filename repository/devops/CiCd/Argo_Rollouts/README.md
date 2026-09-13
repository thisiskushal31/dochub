# Argo Rollouts

[← Back to CI/CD](../README.md)

Kubernetes **progressive delivery** controller from the Argo family. Concept chapter: [9_Progressive_Delivery_Controllers.md](../9_Progressive_Delivery_Controllers.md). GitOps sibling: [Argo_CD/](../Argo_CD/README.md).

---

## What it is

**Argo Rollouts** adds a `Rollout` resource that behaves like a Deployment with richer strategies:

- **Canary** — declarative steps (`setWeight`, `pause`, analysis)  
- **Blue-green** — preview ReplicaSet, then switch  
- **AnalysisTemplate / AnalysisRun** — metric queries that continue, pause, or **abort** the rollout  
- Optional **trafficRouting** integrations (Istio, Gateway API, NGINX, …) for true traffic percentages  

Without trafficRouting, canary weight often maps to replica ratios.

---

## Where it sits

```text
CI builds image@digest
  → GitOps (Argo CD) updates Rollout image
  → Rollouts controller steps traffic + analysis
  → success → stable updated | failure → abort to previous stable
```

---

## Mental model

| Resource | Role |
|----------|------|
| `Rollout` | Replaces Deployment for progressive strategies |
| `AnalysisTemplate` | Reusable “how to measure success” |
| `AnalysisRun` | One execution; Successful / Failed / Inconclusive |

Official docs: canary steps and analysis background vs inline analysis.

---

## First use (outline)

1. Install the Rollouts controller in the cluster (see current [install docs](https://argoproj.github.io/argo-rollouts/installation/)).  
2. Convert a Deployment to a Rollout (or start fresh) with a simple canary step list.  
3. Add an AnalysisTemplate against Prometheus (or your metrics backend).  
4. Point Argo CD (or kubectl/Git) at the Rollout manifest; ship a digest and watch `kubectl argo rollouts get rollouts`.  

Pin versions; follow upstream RBAC and metrics adapter requirements.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Analysis on noisy global SLOs | Canary vs stable metric split |
| Forgetting schema compatibility | Expand/contract ([7](../7_DB_Migrations_In_Pipelines.md)) |
| Manual kubectl set image in prod | GitOps desired state + digest |

## Further reading

- [Argo Rollouts docs](https://argoproj.github.io/argo-rollouts/)  
- [Canary](https://argoproj.github.io/argo-rollouts/features/canary/) · [Analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/)  
