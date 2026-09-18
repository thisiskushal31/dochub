# Argo Rollouts

[← Back to CI/CD](../README.md)

Argo Rollouts is a Kubernetes **progressive delivery** controller and set of CRDs. It replaces (or references) a Deployment when you need **blue-green**, **canary**, **metric analysis**, **abort**, and optional **traffic shaping** — not only rolling updates with readiness probes.

### Argo Rollouts vs Argo CD (same cluster)

Same **argoproj** family, **two separate products** — two installs, two controllers, two jobs. Installing Argo CD does **not** install Rollouts (and the reverse is also true).

| | **Argo CD** | **Argo Rollouts** |
|--|-------------|-------------------|
| **Job** | Make the cluster match **Git/OCI** (desired manifests) | Make an update **safe** (canary / blue-green / analysis / abort) |
| **Main object** | `Application` (and ApplicationSet, AppProject) | `Rollout` (and AnalysisTemplate / AnalysisRun, …) |
| **Watches** | Git/OCI vs live cluster for *many* kinds of YAML | `Rollout` resources (ignores ordinary Deployments) |
| **Typical question it answers** | “Is prod what Git says?” | “Should this new version get more traffic — or abort?” |

**When both run in the same cluster, individual roles:**

```text
CI builds image@digest
  → commit digest into GitOps repo
      → Argo CD syncs YAML (including a Rollout + Services + AnalysisTemplates)
          → Argo Rollouts controller sees the new Rollout pod template
              → shifts traffic / runs analysis / promote or abort
```

- **Argo CD** owns *whether* and *when* the desired Rollout manifest (image digest, steps, templates) is applied from Git. It does not implement canary weights or metric abort.  
- **Argo Rollouts** owns *how* pods and traffic move after that desired state is already on the cluster. It does not replace Git as source of truth.  
- **Together:** GitOps + progressive delivery. **Argo CD alone:** sync Deployments (or Rollouts that only roll) without progressive controllers. **Rollouts alone:** progressive delivery without GitOps (kubectl/Helm) — possible, less common in platforms.  
- **Neither replaces CI** (build/test/push) or **feature flags** (in-process behavior). Depth: chapters here · [Argo_CD/](../Argo_CD/README.md).

Flux-side progressive option: Flagger ([9](../9_Progressive_Delivery_Controllers.md), [Flux/](../Flux/README.md)). Strategy patterns: [3](../3_Deployment_Strategies.md). Controller comparison: [9](../9_Progressive_Delivery_Controllers.md).

This folder is a **standalone deep dive** (same depth bar as [Argo_CD/](../Argo_CD/README.md)). Someone who knows nothing about Rollouts should leave able to:

- Explain progressive delivery vs plain Deployments and vs feature flags  
- Install the controller and ship a first blue-green / canary  
- Wire analysis, traffic providers, and GitOps (usually with Argo CD)  
- Name good vs bad practices and when *not* to use Rollouts  
- Find **every feature class and configuration kind** Rollouts offers ([14](./14_Feature_And_Configuration_Coverage_Map.md))  

CNCF project. Optional version-exact reference: [argoproj.github.io/argo-rollouts](https://argoproj.github.io/argo-rollouts/) · [argo-rollouts.readthedocs.io](https://argo-rollouts.readthedocs.io/).

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md)–[03](./03_Architecture_And_Controller.md) | Why PD; CRDs; how the controller works |
| First ship | [04](./04_Install_Plugin_Dashboard_And_First_Rollout.md) | Install; CLI; dashboard; first Rollout |
| Strategies | [05](./05_Blue_Green_Strategy.md)–[06](./06_Canary_Strategy_And_Steps.md) | Blue-green and canary in depth |
| Traffic & analysis | [07](./07_Traffic_Management.md)–[08](./08_Analysis_And_Metric_Providers.md) | Meshes/ingress; AnalysisTemplate/Run |
| Extra features | [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md)–[11](./11_Notifications_Metrics_And_Kubectl_Plugin.md) | Experiments, HPA/VPA, GitOps, notify/CLI |
| Craft | [12](./12_Worked_Example_Canary_A_Service.md)–[13](./13_Best_Practices_And_When_Not_To_Use.md) | Lab; good/bad |
| Catalogs | [14](./14_Feature_And_Configuration_Coverage_Map.md)–[16](./16_Troubleshooting_And_Staff_Checklist.md) | Feature map; Rollout spec; troubleshoot |

Suggested order: **01 → 16**. After **04**, you can jump to **12** if you learn by building.

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Argo Rollouts](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md) | Progressive delivery; when to pick it |
| 02 | [Core concepts](./02_Core_Concepts_Rollout_Analysis_Experiment.md) | Rollout, Analysis*, Experiment, traffic |
| 03 | [Architecture](./03_Architecture_And_Controller.md) | Controller, ReplicaSets, Services |
| 04 | [Install and first Rollout](./04_Install_Plugin_Dashboard_And_First_Rollout.md) | Install, plugin, dashboard |
| 05 | [Blue-green](./05_Blue_Green_Strategy.md) | Active/preview; promote; ALB caveats |
| 06 | [Strategies and canary steps](./06_Canary_Strategy_And_Steps.md) | Strategy shapes and canary step types |
| 07 | [Traffic management](./07_Traffic_Management.md) | Providers catalog |
| 08 | [Analysis](./08_Analysis_And_Metric_Providers.md) | Templates, runs, providers |
| 09 | [Experiments and extras](./09_Experiments_HPA_Metadata_Restart_Rollback.md) | Experiment, HPA/VPA, rollback, … |
| 10 | [GitOps, Helm, migrate](./10_GitOps_Helm_Kustomize_And_Migrating.md) | Argo CD pairing; migrate Deployment |
| 11 | [Notifications, metrics, CLI](./11_Notifications_Metrics_And_Kubectl_Plugin.md) | Day-2 surfaces |
| 12 | [Worked example](./12_Worked_Example_Canary_A_Service.md) | Canary a service end-to-end |
| 13 | [Best practices](./13_Best_Practices_And_When_Not_To_Use.md) | Trade judgment |
| 14 | [Feature coverage map](./14_Feature_And_Configuration_Coverage_Map.md) | Every feature class |
| 15 | [Rollout spec catalog](./15_Rollout_Spec_And_Strategy_Configuration_Catalog.md) | Configuration surfaces |
| 16 | [Troubleshooting & checklist](./16_Troubleshooting_And_Staff_Checklist.md) | Playbook + staff review |

Start: [01](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md).
