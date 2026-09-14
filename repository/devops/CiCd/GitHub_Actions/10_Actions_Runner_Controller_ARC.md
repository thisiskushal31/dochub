# 10 — Actions Runner Controller (ARC)

[← Previous](./09_Self_Hosted_Runners_And_Groups.md) · [README](./README.md) · [Next: Actions →](./11_Actions_Marketplace_And_Pinning.md)

---

## 1. Concepts

**Actions Runner Controller (ARC)** runs self-hosted runners as pods on **Kubernetes**, scaling with demand via **runner scale sets**.

Mental model:

1. Install ARC into a cluster (controller + scale set charts — follow current tutorials).  
2. Authenticate to the GitHub API (App or patterns docs prescribe).  
3. Define a **scale set** with labels / group binding.  
4. Workflows target those labels like any self-hosted runner.  
5. Pods appear for jobs and go away when idle (ephemeral posture).

This chapter is **literacy**, not a Helm ops runbook. Full install/troubleshoot stay in official ARC tutorials.

---

## 2. Advanced concepts

### Components (conceptual)

| Piece | Role |
|-------|------|
| Controller | Reconciles scale sets vs GitHub |
| Listener / scale set | Watches jobs; creates runner pods |
| Runner pods | Execute one job (typical ephemeral mode) |

### Why teams adopt ARC

| Benefit | Trade-off |
|---------|-----------|
| Elastic capacity | Cluster + ARC operational load |
| Ephemeral isolation | Image maintenance; cold start |
| Fits kube platforms | Still need network/IAM design |

### Support boundary

GitHub documents what Support covers for ARC vs what is community/helm. Know the boundary before betting the company CI on it.

### Workflow side

```yaml
runs-on: [self-hosted, my-arc-pool]
```

Labels must match the scale set. Pair with runner groups for tenancy.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Bursty monorepo CI | ARC scale sets |
| Strong isolation | Ephemeral pods + tight RBAC |
| Steady special hardware | Classic self-hosted may be simpler |

**Good:** treat ARC as a platform product with owners. **Bad:** install once, never patch runner images or controller.

**Upstream-only:** Helm values encyclopedias, every troubleshooting error code, multi-cluster federation designs.

---

## References

- [Actions Runner Controller](https://docs.github.com/en/actions/concepts/runners/actions-runner-controller)  
- [Runner scale sets](https://docs.github.com/en/actions/concepts/runners/runner-scale-sets)  
- [Get started with ARC](https://docs.github.com/en/actions/tutorials/use-actions-runner-controller)  
- [Deploying runner scale sets](https://docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/deploy-runner-scale-sets)  
