# 15 — Rollout spec and strategy configuration catalog

[← Previous](./14_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./16_Troubleshooting_And_Staff_Checklist.md)

## 1. Concepts — configuration surfaces

| Surface | What you set |
|---------|----------------|
| `spec` common | replicas, selector, template, revisionHistoryLimit, minReadySeconds, … (Deployment-like) |
| `spec.strategy.blueGreen` | active/preview Services, promotion, analysis, scaleDown delays, antiAffinity, … |
| `spec.strategy.canary` | steps, services, trafficRouting, analysis, maxSurge/Unavailable, scales, plugins, … |
| AnalysisTemplate / ClusterAnalysisTemplate | metrics, args, providers |
| Experiment | templates, duration, analyses |
| Annotations / ephemeral metadata | canary-aware labels |
| workloadRef | Reference Deployment pod template |

Exact fields: official [Rollout specification](https://argoproj.github.io/argo-rollouts/features/specification/) for your version — this catalog names the **kinds** of knobs.

## 2. Advanced concepts — strategy knobs checklist

### Blue-green (see also [05](./05_Blue_Green_Strategy.md))

`activeService` · `previewService` · `autoPromotionEnabled` · `autoPromotionSeconds` · `previewReplicaCount` · `scaleDownDelaySeconds` · `scaleDownDelayRevisionLimit` · `abortScaleDownDelaySeconds` · `prePromotionAnalysis` · `postPromotionAnalysis` · `antiAffinity` · `activeMetadata` · `previewMetadata`

### Canary (see also [06](./06_Canary_Strategy_And_Steps.md))

**Steps:** `setWeight` · `pause` · `setCanaryScale` · `setHeaderRoute` · `setMirrorRoute` · inline `analysis` · inline `experiment` · `plugin` (alpha)

**Strategy fields:** `canaryService` · `stableService` · `pingPong` · `trafficRouting` (+ `managedRoutes`) · background `analysis` · `maxSurge` · `maxUnavailable` · `dynamicStableScale` · `abortScaleDownDelaySeconds` · `scaleDownDelaySeconds` · `antiAffinity` · `canaryMetadata` · `stableMetadata` · omit `steps` for rolling-update mimic

### Traffic routing block

Provider-specific nested config (Istio VirtualService refs, NGINX annotation mode, ALB, …) — pick one platform provider ([07](./07_Traffic_Management.md)).

### Analysis template metric block

Provider type · query · interval · count · successCondition · failureCondition · inconclusive handling · args

### Good defaults

| Env | Lean toward |
|-----|-------------|
| Lab | Manual promote; simple steps |
| Staging | Auto steps + analysis; abort on fail |
| Prod | trafficRouting if available; strict analysis; short pauses; GitOps digests |

## 3. Applications and use cases

Use this chapter as a review checklist against a Rollout PR: every non-default field should have a one-line reason.

## References

- [Rollout specification](https://argoproj.github.io/argo-rollouts/features/specification/)  
- [Blue-green](https://argoproj.github.io/argo-rollouts/features/bluegreen/) · [Canary](https://argoproj.github.io/argo-rollouts/features/canary/)  
- [Analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)  
