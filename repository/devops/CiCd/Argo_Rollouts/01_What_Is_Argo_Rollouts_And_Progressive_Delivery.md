# 01 — What is Argo Rollouts and progressive delivery

[← Argo Rollouts](./README.md) · [Next: Core concepts →](./02_Core_Concepts_Rollout_Analysis_Experiment.md)

---

## 1. Concepts

### The problem rolling updates leave open

A Kubernetes **Deployment** rolling update replaces pods gradually using `maxSurge` / `maxUnavailable` and **readiness probes**. That is not enough when you need:

- Fine control of **how much traffic** the new version gets  
- **Metric-gated** promote or abort (error rate, latency, business KPIs)  
- A **preview** stack that never serves production until you cut over  
- Automated **rollback** when analysis fails — not only “halt progression”  

**Progressive delivery** is releasing gradually with **policy + signals**: deploy → shift a little → analyze → more traffic or abort.

**Argo Rollouts** implements that on Kubernetes with a `Rollout` CRD (Deployment-shaped) plus Analysis and optional traffic integrations.

### What it is / is not

| It is | It is not |
|-------|-----------|
| Progressive delivery **controller** for Kubernetes | A CI system |
| Companion to GitOps (often [Argo CD](../Argo_CD/README.md)) | Bundled inside Argo CD install |
| Blue-green + canary + analysis + experiments | A feature-flag product ([Unleash](../Unleash/README.md) = *behavior*) |
| Optional mesh/ingress traffic shaping | Required to use a mesh on day one (blue-green works without one) |

### Where it sits in the loop

```text
CI: build → test → push image@digest
GitOps (Argo CD / Flux / kubectl): update Rollout image
Argo Rollouts: new ReplicaSet → steps / blue-green switch
  → AnalysisRun → promote stable | abort to previous stable
```

---

## 2. Advanced concepts

### Rollouts vs Flagger vs flags

| Mechanism | Controls |
|-----------|----------|
| **Argo Rollouts** | Which pods / traffic % get the new **binary** (`Rollout` object) |
| **Flagger** | Progressive delivery keeping native **Deployment** + `Canary` CR (often with Flux) |
| **Feature flags** | Which **behavior** runs inside an already-deployed binary |

High risk: canary the binary **and** gate features with flags ([9](../9_Progressive_Delivery_Controllers.md)).

### Brownfield

Rollouts only manages **Rollout** resources (or Rollouts that `workloadRef` a Deployment). Normal Deployments are untouched — you can adopt gradually ([10](./10_GitOps_Helm_Kustomize_And_Migrating.md)).

---

## 3. Applications and use cases

| Situation | Lean toward |
|-----------|-------------|
| K8s + metric-gated canary/blue-green | **Argo Rollouts** |
| Already on Argo CD | Rollouts + GitOps digest updates |
| Flux + keep Deployments | Flagger |
| PR preview envs | Not Rollouts — ApplicationSet PR apps |
| Multi-day “preview for a week” | Flags / rethink — Rollouts wants **short** windows |
| Queue workers / exclusive locks | Start **blue-green** or fix app compatibility |
| Non-Kubernetes | Not Rollouts — [3](../3_Deployment_Strategies.md), [18](../18_VM_MIG_And_Host_Based_Deploy.md) |

Upstream guidance: start with **blue-green**, then canaries once metrics and dual-version compatibility are solid. Rollouts first-class strategies are only **blue-green** and **canary** (rolling update = canary with no steps; recreate is not a Rollout strategy) — details in [06](./06_Canary_Strategy_And_Steps.md).

---

## References

- [Overview](https://argoproj.github.io/argo-rollouts/)  
- [Concepts](https://argoproj.github.io/argo-rollouts/concepts/)  
- [CiCd progressive controllers](../9_Progressive_Delivery_Controllers.md)  
- [Google SRE — Canarying](https://sre.google/workbook/canarying-releases/)  
