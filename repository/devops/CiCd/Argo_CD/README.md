# Argo CD

[← Back to CI/CD](../README.md)

Argo CD is a **declarative GitOps continuous delivery** controller for **Kubernetes**. Desired application state lives in **Git** or **OCI**; Argo CD **pulls** that state, compares it to what is running, and **syncs** the cluster until they match. It is **CD**, not CI: pipelines still **build**, **test**, and **push** images; Argo CD owns **apply** and **reconcile**.

### Argo CD vs Argo Rollouts (same cluster)

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
- **Neither replaces CI** (build/test/push) or **feature flags** (in-process behavior). Depth: chapters here · [Argo_Rollouts/](../Argo_Rollouts/README.md).

Other GitOps toolkit: [Flux/](../Flux/README.md). Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [9](../9_Progressive_Delivery_Controllers.md).

This folder is a **standalone deep dive**. Someone who knows nothing about Argo CD should leave able to:

- Explain how it works (pull GitOps, sync vs health, Projects, ApplicationSets)  
- Install and configure it the **right** way (and name **bad** practices)  
- Ship a simple website end-to-end from Git ([12](./12_Worked_Example_Simple_Website_GitOps.md))  
- Choose Application vs App-of-Apps vs ApplicationSet sizing ([13](./13_Best_Practices_Topology_And_App_Sizing.md))  
- Find **every feature class and configuration kind** Argo CD offers ([14](./14_Feature_And_Configuration_Coverage_Map.md) → catalogs 15–18)  

CNCF graduated. Optional version-exact field reference: [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/) (CLI man pages, per-IdP cookbooks, and upgrade changelogs stay there — see [14](./14_Feature_And_Configuration_Coverage_Map.md) section H).

### Chapter structure

Each numbered chapter uses the same arc: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Argo_CD_And_Why_GitOps.md)–[02](./02_Core_Concepts_Applications_Sync_And_Health.md) | GitOps CD mental model; Application, sync, health, Project |
| Internals & first ship | [03](./03_Architecture_Components_And_Multi_Cluster.md)–[04](./04_Install_Access_And_First_Application.md) | Components; install; first sync |
| Day-to-day control | [05](./05_Manifest_Sources_Tracking_And_Immutability.md)–[06](./06_Sync_Policies_Waves_Projects_And_RBAC.md) | Sources/pins; sync policy; tenancy |
| Scale & CI | [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md)–[08](./08_Secrets_CI_Integration_And_Operations.md) | Fan-out; secrets; CI auth |
| Judgment | [09](./09_Use_Cases_Pitfalls_And_Staff_Checklist.md)–[11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) | Pitfalls; ownership; security; troubleshoot |
| Hands-on & trade craft | [12](./12_Worked_Example_Simple_Website_GitOps.md)–[13](./13_Best_Practices_Topology_And_App_Sizing.md) | Website sync; good/bad; how many apps |
| Complete catalogs | [14](./14_Feature_And_Configuration_Coverage_Map.md)–[18](./18_Platform_Ingress_HA_UI_And_Extras.md) | Every feature class; Application/sync/control-plane/sources/platform config |

Suggested order: **01 → 18**. After **04**, you can pause and do **12** early if you learn best by building.

### Fit in the CiCd staircase

| Need | Start here |
|------|------------|
| What a deployment pipeline is | [CiCd/1](../1_Pipelines_Build_Test_Deploy.md) |
| Tools map | [CiCd/2](../2_CI_CD_Tools.md) |
| Environments / shared DEV | [CiCd/8](../8_Environments_Promotion_And_Approvals.md) |
| Progressive traffic | [CiCd/9](../9_Progressive_Delivery_Controllers.md) · [Argo_Rollouts](../Argo_Rollouts/README.md) |
| This product end-to-end | Chapters **01–18** below |

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Argo CD and why GitOps](./01_What_Is_Argo_CD_And_Why_GitOps.md) | Problem, pull model, when to choose it |
| 02 | [Core concepts](./02_Core_Concepts_Applications_Sync_And_Health.md) | Application, target/live, sync, health, Projects |
| 03 | [Architecture](./03_Architecture_Components_And_Multi_Cluster.md) | API server, repo-server, controller, multi-cluster |
| 04 | [Install, access, first Application](./04_Install_Access_And_First_Application.md) | Install variants, CLI/UI, first sync |
| 05 | [Sources and tracking](./05_Manifest_Sources_Tracking_And_Immutability.md) | Helm, Kustomize, OCI, pins, GitOps layout |
| 06 | [Sync, waves, Projects, RBAC](./06_Sync_Policies_Waves_Projects_And_RBAC.md) | Auto-sync, prune, self-heal, tenancy |
| 07 | [ApplicationSets and App-of-Apps](./07_ApplicationSets_App_Of_Apps_And_Scale.md) | Generators, scale patterns |
| 08 | [Secrets, CI, day-2 ops](./08_Secrets_CI_Integration_And_Operations.md) | Secrets, CI auth, Image Updater |
| 09 | [Use cases, pitfalls, checklist](./09_Use_Cases_Pitfalls_And_Staff_Checklist.md) | Roles, anti-patterns, review criteria |
| 10 | [Ownership, diffing, webhooks, ops](./10_Ownership_Diffing_Webhooks_And_Observability.md) | Tracking, ignoreDifferences, metrics, DR |
| 11 | [Security, tenancy, hydrator, troubleshooting](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) | JWT/RBAC, apps-any-ns, impersonation, playbook |
| 12 | [Worked example: simple website](./12_Worked_Example_Simple_Website_GitOps.md) | End-to-end GitOps website sync |
| 13 | [Best practices and app sizing](./13_Best_Practices_Topology_And_App_Sizing.md) | Good/bad; how many Applications / App-of-Apps |
| 14 | [Feature and configuration coverage map](./14_Feature_And_Configuration_Coverage_Map.md) | Inventory of every feature class |
| 15 | [Application and sync config catalog](./15_Application_And_Sync_Configuration_Catalog.md) | Spec fields, all sync options, hooks |
| 16 | [Control-plane config catalog](./16_Control_Plane_Configuration_Catalog.md) | argocd-cm, rbac, secrets, cmd-params |
| 17 | [Sources in depth](./17_Sources_Private_Repos_And_Parameters.md) | Helm/Kustomize/OCI/plugins/private repos |
| 18 | [Platform ingress, HA, UI, extras](./18_Platform_Ingress_HA_UI_And_Extras.md) | Expose, HA, clusters, UI/notifications extras |

Start: [01 — What is Argo CD and why GitOps](./01_What_Is_Argo_CD_And_Why_GitOps.md).
