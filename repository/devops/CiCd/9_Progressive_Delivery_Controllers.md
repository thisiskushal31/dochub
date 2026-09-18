# Progressive delivery controllers

[← Back to CI/CD](./README.md)

[3_Deployment_Strategies](./3_Deployment_Strategies.md) defines *patterns* (canary, blue-green, flags). This chapter covers **Kubernetes controllers** that automate progressive delivery: traffic steps, metric analysis, pause, promote, abort.

Depth of meshes/Gateway API: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). Flags product folder: [Unleash/](./Unleash/README.md).

## Progressive delivery (definition)

Expose a new version gradually, driven by **policy + signals**, not a single big cutover:

```text
deploy new version → shift a little traffic → analyze metrics
  → more traffic … or abort/rollback
```

Google SRE canarying and Spinnaker/automated analysis popularized metric-gated rollouts; on Kubernetes, **Argo Rollouts** and **Flagger** are common controllers.

## Argo Rollouts

- **Rollout** CRD: drop-in replacement for Deployment with `canary` and `blueGreen` strategies  
- Declarative **steps**: e.g. `setWeight`, `pause`, inline analysis  
- **AnalysisTemplate** / **AnalysisRun**: how to query metrics (Prometheus, etc.), success/fail thresholds  
- Failed analysis → **abort**; success → continue / promote  
- Optional **trafficRouting** (Istio, Gateway API, …) for precise weights; without it, weight often approximates via replica counts  

Folder for install notes: [Argo_Rollouts/](./Argo_Rollouts/README.md).

## Flagger

- Works with standard **Deployments** (plus Canary custom resource)  
- Control loop: raise canary weight by `stepWeight`, on `interval`, until `maxWeight`, checking KPIs (success rate, latency, pod health) and optional webhooks  
- Supports canary, A/B (headers/cookies), blue/green, mirroring — depending on mesh/ingress  
- Part of the Flux project family for progressive delivery alongside Flux GitOps  

Often paired with Flux ([Flux/](./Flux/README.md)).

## Argo Rollouts vs Flagger (practical)

| | Argo Rollouts | Flagger |
|--|---------------|---------|
| Primary object | `Rollout` replaces Deployment | Keeps `Deployment` + `Canary` |
| Step model | Explicit step list | Interval / stepWeight loop |
| GitOps fit | Works with Argo CD | Natural with Flux |
| Both | CNCF ecosystem; metric-driven promote/abort |

Pick one progressive-delivery controller per platform team unless you have a clear split (e.g. Flux+Flagger vs Argo CD+Rollouts).

## Feature flags vs progressive delivery

| Mechanism | Controls |
|-----------|----------|
| **Rollouts / Flagger** | *Which pods / traffic %* get the new binary |
| **Feature flags** (OpenFeature, Unleash, …) | *Which behavior* runs inside a binary already deployed |

Use both: ship dark code safely, then open flags; or canary the binary *and* gate risky features.

OpenFeature is a **vendor-neutral API** for flag evaluation in apps — not a Kubernetes traffic controller.

## Pipeline wiring

```text
CI publishes digest D
  → GitOps updates Rollout/Canary to D
  → controller shifts traffic + AnalysisRun/Flagger checks
  → success: stable = D | failure: abort to previous stable
```

CI should not “sleep 30m and curl once” as a substitute for controller analysis — see [5](./5_Verify_Rollback_And_Synthetic_Tests.md).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Canary without canary-vs-control metrics | Version/track labels; SRE canary guidance |
| Analysis on flaky SLOs | Tune thresholds; A/A test the analysis |
| Flags *or* canaries only | Combine for high-risk changes |
| Skipping schema expand/contract | Still required when versions overlap ([7](./7_DB_Migrations_In_Pipelines.md)) |

## Next

- Strategies primer: [3](./3_Deployment_Strategies.md)  
- GitOps CD: [Argo_CD/](./Argo_CD/README.md), [Flux/](./Flux/README.md)

## Further reading

- [Argo Rollouts — canary](https://argoproj.github.io/argo-rollouts/features/canary/)  
- [Argo Rollouts — analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/)  
- [Flagger — deployment strategies](https://docs.flagger.app/usage/deployment-strategies)  
- [Google SRE Workbook — Canarying](https://sre.google/workbook/canarying-releases/)  
- [OpenFeature](https://openfeature.dev/)  
