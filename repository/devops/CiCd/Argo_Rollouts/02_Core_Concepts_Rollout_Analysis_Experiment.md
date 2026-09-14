# 02 — Core concepts: Rollout, Analysis, Experiment

[← Previous](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md) · [README](./README.md) · [Next: Architecture →](./03_Architecture_And_Controller.md)

---

## 1. Concepts

| Term | Meaning |
|------|---------|
| **Rollout** | Workload CRD approximately equal to a Deployment plus `strategy.canary` or `strategy.blueGreen` |
| **stable / canary (or preview)** | Previous successful version versus new version under test |
| **AnalysisTemplate** | Reusable metric, job, or webhook recipe (namespaced) |
| **ClusterAnalysisTemplate** | Same idea, cluster-scoped |
| **AnalysisRun** | One execution resulting in Successful, Failed, or Inconclusive |
| **Experiment** | Short-lived parallel ReplicaSets for comparison (often baseline versus canary) |
| **trafficRouting** | Mesh or ingress integration for true traffic weights |
| **setWeight / pause / analysis steps** | Common canary step kinds |

Without traffic routing, canary weight is approximately a **replica ratio**. With traffic routing, weight can be a true **traffic percentage**.

Analysis is **optional**. You can pause and promote manually via CLI or API and still get progressive structure.

---

## 2. Advanced concepts

### Strategies Rollouts supports

Only **blue-green** and **canary** (plus canary with empty steps, which behaves like a rolling update).

### Analysis outcomes

| Result | Typical effect |
|--------|----------------|
| Successful | Continue or promote |
| Failed | **Abort** back to previous stable |
| Inconclusive | Often **pause** for human judgment |

Background analysis can run while steps advance; inline analysis is an explicit step. Blue-green supports pre- and post-promotion analysis.

### Experiments

Experiments run limited ReplicaSets for a duration (or until stopped), optionally with analysis. Classic use: compare baseline and canary metrics fairly ([09](./09_Experiments_HPA_Metadata_Restart_Rollback.md)).

### Plugins

New **metric**, **traffic**, and **canary step** integrations are expected as **plugins**, not core PRs. Core stays stable; extensions live outside.

---

## 3. Applications and use cases

| Scenario | Concept that matters |
|----------|----------------------|
| Canary at 10 percent but only two pods | Replica ratio versus trafficRouting |
| Synced in Argo CD but users still on old | Rollout paused or analysis running — check Rollout status, not only Application |
| Smoke on preview before cutover | Blue-green `previewService` plus promote |
| A/B baseline comparison | Experiment plus Analysis |

---

## References

- [Concepts](https://argoproj.github.io/argo-rollouts/concepts/)  
- [Analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)  
- [Experiment](https://argoproj.github.io/argo-rollouts/features/experiment/)  
