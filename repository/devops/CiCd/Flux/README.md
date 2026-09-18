# Flux

[← Back to CI/CD](../README.md)

**Flux** keeps a Kubernetes cluster matching what you declared in Git (or an OCI registry). You change the desired state in version control; Flux **pulls** that state into the cluster and keeps fixing drift. It is **CD** (continuous delivery), not CI — your pipelines still build, test, and push images.

Flux is a **toolkit**: several small controllers and Kubernetes APIs (CRDs) you compose, rather than one big “Application” UI product. Progressive delivery (canary / blue-green with metrics) is a related tool called **Flagger** — separate install.

Related tools: [Argo_CD/](../Argo_CD/README.md), [Argo_Rollouts/](../Argo_Rollouts/README.md), [GitHub_Actions/](../GitHub_Actions/README.md), [Jenkins/](../Jenkins/README.md). Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [9](../9_Progressive_Delivery_Controllers.md). [OpenGitOps](https://opengitops.dev/).

### Flux vs Argo CD (same job, different shape)

| | **Flux** | **Argo CD** |
|--|----------|-------------|
| **Shape** | Composable controllers + CRDs | App-centric control plane + strong UI |
| **Main delivery objects** | `Kustomization`, `HelmRelease` (+ Sources) | `Application` (+ ApplicationSet, AppProject) |
| **Progressive delivery** | [Flagger](https://docs.flagger.app/main) | [Argo Rollouts](../Argo_Rollouts/README.md) |
| **Day-to-day UX** | CLI and Git-native | UI + CLI |

Both pull desired state and reconcile. Choose based on how your platform team likes to work ([2](../2_CI_CD_Tools.md)) — not slogans.

Someone who knows nothing about Flux should leave able to:

- Explain why GitOps beats “CI runs kubectl” for routine releases  
- Install Flux, commit an app’s YAML, and prove it with `flux get`  
- Read and write Sources, Kustomizations, and HelmReleases with confidence  
- Handle secrets, image bumps, alerts, and (when needed) Flagger  
- Find any feature class in the coverage map  

### Chapter structure

Each chapter: **Concepts** (plain language) → **Advanced** (real knobs) → **Applications** → **References** (official docs only).

### Progression

| Phase | Chapters | You will be able to |
|-------|----------|---------------------|
| Foundation | [01](./01_What_Is_Flux_And_GitOps_Toolkit.md)–[03](./03_Architecture_And_Controllers.md) | Say what Flux is and which piece does what |
| First ship | [04](./04_Install_Bootstrap_And_CLI.md)–[05](./05_First_Reconcile_And_Day1_Loop.md) | Install and sync something real |
| Sources & delivery | [06](./06_Sources_Git_OCI_Bucket_Helm.md)–[09](./09_HelmRelease_And_Helm_Delivery.md) | Fetch state and apply it |
| Estate craft | [10](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md)–[12](./12_Security_Identity_And_Air_Gap.md) | Layout repos; keep secrets and access safe |
| Automation & ops | [13](./13_Image_Update_Automation.md)–[16](./16_Scale_Multitenancy_And_Platform_Config.md) | Automate digests; alert; scale; lock down tenants |
| Progressive & craft | [17](./17_Flagger_Progressive_Delivery.md)–[19](./19_Best_Practices_And_When_Not_Flux.md) | Canaries; lab; judgment |
| Catalogs | [20](./20_Feature_And_Configuration_Coverage_Map.md)–[22](./22_Troubleshooting_And_Staff_Checklist.md) | Inventory; knobs; fix breaks |

Suggested order: **01 → 22**. After **05**, you can jump to **18** if you learn by building.

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Flux](./01_What_Is_Flux_And_GitOps_Toolkit.md) | Problem, GitOps, toolkit vs Argo CD |
| 02 | [Core concepts](./02_Core_Concepts_Sources_And_Reconciliation.md) | Source → artifact → reconcile |
| 03 | [Architecture](./03_Architecture_And_Controllers.md) | Which controller does which job |
| 04 | [Install and bootstrap](./04_Install_Bootstrap_And_CLI.md) | CLI bootstrap and Flux Operator |
| 05 | [First reconcile](./05_First_Reconcile_And_Day1_Loop.md) | Day-1 loop with `flux get` |
| 06 | [Sources](./06_Sources_Git_OCI_Bucket_Helm.md) | Git, OCI, Bucket, Helm |
| 07 | [ExternalArtifact & generators](./07_ExternalArtifact_And_ArtifactGenerator.md) | Compose / split monorepos |
| 08 | [Kustomization](./08_Kustomization_Controller.md) | Apply YAML/Kustomize from Git |
| 09 | [HelmRelease](./09_HelmRelease_And_Helm_Delivery.md) | Helm the GitOps way |
| 10 | [Repo structure & tenancy](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md) | How to split Git and clusters |
| 11 | [Secrets](./11_Secrets_SOPS_And_Sealed_Secrets.md) | Encrypt secrets in Git |
| 12 | [Security & identity](./12_Security_Identity_And_Air_Gap.md) | Keys, cloud identity, air-gap |
| 13 | [Image automation](./13_Image_Update_Automation.md) | Registry scan → Git commit |
| 14 | [Notifications](./14_Notifications_Alerts_And_Receivers.md) | Slack alerts and Git webhooks |
| 15 | [Monitoring & day-2](./15_Monitoring_Events_Metrics_And_Upgrade.md) | Health signals and upgrades |
| 16 | [Scale & platform](./16_Scale_Multitenancy_And_Platform_Config.md) | Shared clusters and scale |
| 17 | [Flagger](./17_Flagger_Progressive_Delivery.md) | Canary / blue-green literacy |
| 18 | [Worked example](./18_Worked_Example_Bootstrap_And_App.md) | End-to-end lab |
| 19 | [Best practices](./19_Best_Practices_And_When_Not_Flux.md) | Good defaults; when to skip Flux |
| 20 | [Coverage map](./20_Feature_And_Configuration_Coverage_Map.md) | Feature inventory |
| 21 | [CRD & CLI catalog](./21_CRD_And_CLI_Catalog.md) | Object and CLI cheat sheet |
| 22 | [Troubleshooting](./22_Troubleshooting_And_Staff_Checklist.md) | Playbook and review checklist |

Start: [01](./01_What_Is_Flux_And_GitOps_Toolkit.md).
