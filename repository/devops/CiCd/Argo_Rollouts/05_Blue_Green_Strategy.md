# 05 — Blue-green strategy

[← Previous](./04_Install_Plugin_Dashboard_And_First_Rollout.md) · [README](./README.md) · [Next: Strategies & steps →](./06_Canary_Strategy_And_Steps.md)

---

## 1. Concepts

Blue-green keeps **two stacks**: **active** (production traffic) and optional **preview** (new version for tests). The controller updates Service selectors (via pod-template-hash) so active points at stable until promotion, then switches active to the new ReplicaSet.

**Why start here:** works **without** a traffic manager; only one version receives live traffic at a time; good for apps that cannot run two live versions (queues, exclusive locks) once you accept all-or-nothing cutover.

Mandatory: `spec.strategy.blueGreen.activeService`. Optional: `previewService` for pre-prod probing.

```yaml
strategy:
  blueGreen:
    activeService: myapp-active
    previewService: myapp-preview
    autoPromotionEnabled: false
```

Promote: `kubectl argo rollouts promote <name>` (or auto when enabled / after `autoPromotionSeconds`).

---

## 2. Advanced concepts

| Field | Role |
|-------|------|
| `autoPromotionEnabled` | If false, pause before cutover (default **true** if omitted) |
| `autoPromotionSeconds` | Delay then auto-promote |
| `previewReplicaCount` | Scale of preview stack before promotion |
| `scaleDownDelaySeconds` | Wait before scaling down old RS (iptables/propagation; default ~30s) |
| `scaleDownDelayRevisionLimit` | How many old revisions to keep scaled |
| `abortScaleDownDelaySeconds` | Delay before scaling down preview RS on abort (`0` = leave up) |
| `prePromotionAnalysis` / `postPromotionAnalysis` | Gate cutover or verify after |
| `antiAffinity` | Prefer not co-locating active/preview pods |
| `activeMetadata` / `previewMetadata` | Ephemeral labels/annotations on active vs preview pods |

Together with canary, these are the **only** first-class strategies — shapes and steps: [06](./06_Canary_Strategy_And_Steps.md).

**Propagation delay:** after Service selector change, nodes need time before old pods are safe to kill — that is why `scaleDownDelaySeconds` exists.

**AWS ALB caveat:** blue-green with ALB can see target groups briefly empty during re-register — risk of downtime the controller cannot fully prevent. Prefer other ingress/mesh patterns or understand ALB limitations before prod.

Sequence (simplified): new RS ready → (optional analysis) → point active Service at new → wait scaleDownDelay → scale down old.

---

## 3. Applications and use cases

| Use | Fit |
|-----|-----|
| Preview + QA before prod traffic | previewService + manual promote |
| Workers / DB-locked legacy | Prefer blue-green over canary |
| Need gradual % traffic | Use canary + trafficRouting instead |

**Good:** digest-pinned images; promote after smoke on preview. **Bad:** auto-promote with no analysis and no tests on preview.

---

## References

- [Blue-green](https://argoproj.github.io/argo-rollouts/features/bluegreen/)  
- [Getting started](https://argoproj.github.io/argo-rollouts/getting-started/)  
