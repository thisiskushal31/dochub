# Argo Rollouts

[← Back to CI/CD](../README.md)

**This folder is the Argo Rollouts primer** (Kubernetes **progressive delivery** controller). Strategy patterns: [3](../3_Deployment_Strategies.md). Controller comparison: [9](../9_Progressive_Delivery_Controllers.md). GitOps sibling that usually owns the desired image: [Argo_CD/](../Argo_CD/README.md). Flux-side progressive option: Flagger ([9](../9_Progressive_Delivery_Controllers.md), [Flux/](../Flux/README.md)).

CNCF project. Docs: [argoproj.github.io/argo-rollouts](https://argoproj.github.io/argo-rollouts/) · [argo-rollouts.readthedocs.io](https://argo-rollouts.readthedocs.io/).

---

## What it is

A Kubernetes **controller + CRDs** that add blue-green, canary, metric analysis, and progressive promotion/abort on top of ReplicaSets. A **`Rollout`** is the workload object teams use instead of a plain `Deployment` when rolling updates are not enough (no fine traffic control, weak automated abort, readiness-only safety).

| Concept | Meaning |
|---------|---------|
| **Rollout** | Drop-in Deployment-shaped workload with `canary` / `blueGreen` strategies |
| **AnalysisTemplate** | Reusable “how to measure success” (queries, frequency, pass/fail) |
| **ClusterAnalysisTemplate** | Same, cluster-scoped |
| **AnalysisRun** | One execution of a template → Successful / Failed / Inconclusive |
| **Experiment** | Short-lived parallel ReplicaSets (e.g. baseline vs canary) for comparison |
| **trafficRouting** | Optional mesh/ingress integration for fine-grained weights (Istio, NGINX, ALB, Gateway API plugins, …) |

Without traffic routing, canary `setWeight` is a **best-effort replica ratio**. With traffic routing, weight can be a true traffic percentage.

Rollouts does **not** require Argo CD — it is self-contained — but the usual delivery path is: CI publishes digest → GitOps updates the Rollout → Rollouts shifts traffic + analysis.

---

## When to pick Argo Rollouts

| Situation | Lean toward |
|-----------|-------------|
| Kubernetes + need metric-gated canary / blue-green | **Argo Rollouts** (or Flagger) |
| Already on Argo CD GitOps | Rollouts as the progressive layer |
| Flux + keep native Deployments | Flagger ([9](../9_Progressive_Delivery_Controllers.md)) |
| Ephemeral PR preview environments | Not Rollouts — Argo CD ApplicationSet PR generator / similar |
| Multi-day “preview stays up for a week” experiments | Prefer flags ([Unleash/](../Unleash/README.md)) or rethink; Rollouts assumes **brief** progressive windows |
| Shared-resource / queue workers that cannot run two versions | Start with **blue-green** or fix app compatibility first |
| Non-Kubernetes primary runtime | Not Rollouts — [18](../18_VM_MIG_And_Host_Based_Deploy.md) / host strategies ([3](../3_Deployment_Strategies.md)) |

Upstream guidance: start with **blue-green** (simpler, works without a traffic manager), then canaries once metrics and app compatibility are solid.

---

## Push CI vs progressive CD

```text
CI (Actions / GitLab / Jenkins / …):
  build → test → push image@digest
  (+ GitOps commit / Image Updater)

GitOps (often Argo CD):
  sync Rollout + Services + AnalysisTemplates

Argo Rollouts:
  new ReplicaSet → steps / blue-green switch
  → AnalysisRun → promote stable | abort to previous stable
```

CI should not “sleep and curl once” as a substitute for AnalysisRuns ([5](../5_Verify_Rollback_And_Synthetic_Tests.md)).

---

## Strategy literacy

| Strategy | Behavior | Notes |
|----------|----------|-------|
| **Blue-green** | New version up on preview; active stays on stable until promote | Works without traffic manager; good for queue/DB workers that cannot split live traffic |
| **Canary (basic)** | `setWeight` + `pause` (+ optional analysis) | Without mesh/ingress: weight ≈ replica ratio |
| **Canary + trafficRouting** | True % / header routing via mesh or ingress | Fine-grained blast-radius control |
| **Canary with empty steps** | Behaves like Deployment rolling update (`maxSurge` / `maxUnavailable`) | Escape hatch, not progressive delivery |

**App compatibility:** not every app can run two versions at once (shared files, exclusive locks, naive queue consumers). Confirm with owners before canaries. Do **not** put platform add-ons (cert-manager, CoreDNS, ingress controllers) on Rollouts.

**Scope:** one application per cluster (controller installed where Rollouts run). Not a multi-cluster orchestrator.

---

## Analysis (how promote/abort is decided)

| Mode | Idea |
|------|------|
| **Background analysis** | AnalysisRun runs while canary steps advance; failure aborts |
| **Inline / step analysis** | Explicit analysis step in the canary list |
| **Pre-/post-promotion** (blue-green) | Checks before or after traffic cutover |

Failed → abort (canary weight back / previous stable). Inconclusive → typically pause for human judgment. Built-in providers include Prometheus, Datadog, New Relic, jobs, webhooks, and others; **new** metric or traffic integrations are expected as **plugins**, not core PRs.

Goal: automated promote/abort on KPIs that answer in **minutes**, not humans staring at dashboards for hours. Dry-run analysis templates before trusting production.

---

## First use (outline)

1. Install the controller in each cluster that will run Rollouts ([installation](https://argoproj.github.io/argo-rollouts/installation/)).  
2. Install the kubectl plugin (`kubectl argo rollouts`) for status and promote/abort.  
3. Convert a Deployment to a **Rollout** (or start fresh) with a simple **blue-green** or short canary step list ([getting started](https://argoproj.github.io/argo-rollouts/getting-started/)).  
4. Add stable (+ canary/preview) **Services**; add `trafficRouting` only when you need fine weights.  
5. Add an **AnalysisTemplate** against your metrics backend; attach it as background or step analysis.  
6. Point GitOps at the Rollout manifests; ship a **digest**; watch `kubectl argo rollouts get rollout <name>`.  
7. Practice abort and successful promote in non-prod before enabling aggressive auto-promote in prod.

Illustrative canary shape (fields vary by version — follow current docs):

```yaml
# Conceptual — pin API versions from current Argo Rollouts docs
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: myapp
spec:
  replicas: 10
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: app
          image: registry.example.com/myapp@sha256:…
  strategy:
    canary:
      canaryService: myapp-canary
      stableService: myapp-stable
      steps:
        - setWeight: 20
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: { duration: 10m }
      analysis:
        templates:
          - templateName: success-rate
        startingStep: 1
```

Pin digests in Git ([4](../4_Artifacts_And_Registries.md)). Schema overlap still needs expand/contract ([7](../7_DB_Migrations_In_Pipelines.md)).

---

## How it fits the delivery staircase

| Floor | Link |
|-------|------|
| Strategies | [3](../3_Deployment_Strategies.md) — patterns Rollouts implements |
| Controllers | [9](../9_Progressive_Delivery_Controllers.md) — Rollouts vs Flagger vs flags |
| Loop | [1](../1_Pipelines_Build_Test_Deploy.md) — progressive step after deploy |
| Artifact | [4](../4_Artifacts_And_Registries.md) — pin digest the Rollout consumes |
| Verify | [5](../5_Verify_Rollback_And_Synthetic_Tests.md) — analysis > sleep+curl |
| Environments | [8](../8_Environments_Promotion_And_Approvals.md) |
| GitOps CD | [Argo_CD/](../Argo_CD/README.md) |
| Flags (behavior) | [Unleash/](../Unleash/README.md) — which *behavior*, not which *pods* |
| Tools map | [2](../2_CI_CD_Tools.md) |

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Canary without canary-vs-stable metrics | Version/track labels; SRE canary guidance; AnalysisTemplate that compares cohorts |
| Analysis on noisy global SLOs | Tighten queries; A/A-test the template |
| Manual pause forever as “production process” | Automate on metrics; pauses for experiments only |
| Expecting fine % with 2 replicas and no mesh | Raise replica count or add trafficRouting |
| Two apply paths (CI kubectl set image + GitOps) | One desired-state path — usually GitOps |
| Floating `:latest` on the Rollout | Digest or immutable SemVer tag ([4](../4_Artifacts_And_Registries.md), [12](../12_Release_Versioning_And_Changelogs.md)) |
| Multi-day preview + mid-flight hotfixes | Keep progressive windows short; use flags for long experiments |
| Rollouts for cert-manager / ingress / CoreDNS | Leave platform add-ons on normal Deployments |
| Skipping DB expand/contract while two versions run | Still required ([7](../7_DB_Migrations_In_Pipelines.md)) |
| Flags *or* canaries only for high risk | Binary canary **and** behavior flags when both matter ([9](../9_Progressive_Delivery_Controllers.md)) |

---

## Further reading

- [Argo Rollouts documentation](https://argoproj.github.io/argo-rollouts/)  
- [Concepts](https://argoproj.github.io/argo-rollouts/concepts/) · [Getting started](https://argoproj.github.io/argo-rollouts/getting-started/) · [Installation](https://argoproj.github.io/argo-rollouts/installation/)  
- [Canary](https://argoproj.github.io/argo-rollouts/features/canary/) · [Blue-green](https://argoproj.github.io/argo-rollouts/features/bluegreen/) · [Analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)  
- [Traffic management](https://argoproj.github.io/argo-rollouts/features/traffic-management/) · [Best practices](https://argoproj.github.io/argo-rollouts/best-practices/)  
- [Google SRE Workbook — Canarying](https://sre.google/workbook/canarying-releases/)  
- Concept chapter: [9](../9_Progressive_Delivery_Controllers.md)  
- GitOps CD: [Argo_CD/](../Argo_CD/README.md)  
