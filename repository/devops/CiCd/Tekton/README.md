# Tekton

[← Back to CI/CD](../README.md)

**Tekton** is a CNCF **Kubernetes-native** CI/CD toolkit: you define **Tasks** and **Pipelines** as cluster custom resources; **TaskRuns** / **PipelineRuns** execute as Pods. Supporting projects add **Triggers**, **Pipelines-as-Code**, **CLI (`tkn`)**, **Dashboard**, **Chains** (supply-chain signing), **Results**, **Pruner**, **Operator**, and **Catalog/Hub** reuse.

This folder is a **standalone deep dive** into what Tekton offers and how you configure it — not a second Kubernetes internals course (that lives in [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive)). Forge CI (GitHub Actions, GitLab CI, Jenkins) and GitOps CD (Argo CD, Flux) stay related doors when Tekton is the wrong control plane.

Host-neutral delivery jobs: [24](../24_Workflow_Automation_Beyond_PR_CI.md), [2](../2_CI_CD_Tools.md). Related: [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Jenkins/](../Jenkins/README.md), [Buildkite/](../Buildkite/README.md), [CircleCI/](../CircleCI/README.md), [Argo_CD/](../Argo_CD/README.md), [Flux/](../Flux/README.md), [Argo_Rollouts/](../Argo_Rollouts/README.md).

Someone who knows nothing about Tekton should leave able to:

- Explain Task / Pipeline / Run vs forge workflow YAML  
- Install Pipelines (and Operator literacy) on a cluster  
- Author Tasks/Pipelines with params, results, workspaces  
- Wire least-privilege ServiceAccounts for registry push  
- Add Triggers or Pipelines-as-Code for SCM events  
- Reuse Catalog/Hub Tasks with digest pins; use `tkn` / Dashboard  
- Name Chains, Results, Pruner, resolvers, Operator edges — and find them in the [coverage map](./23_Feature_And_Offering_Coverage_Map.md)  
- Hand off digests to GitOps CD; know when forge CI / Jenkins / classical host paths still fit  
- Separate **Tekton CI** from **Kubernetes internals** (Containerization deep dive)  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Tekton.md)–[04](./04_First_Task_And_PipelineRun.md) | Product; install; core model; first run |
| Authoring | [05](./05_Tasks_Steps_Params_And_Results.md)–[11](./11_Resolvers_Bundles_And_Remote_Resources.md) | Tasks/Pipelines; workspaces; auth; pods; matrix; resolvers |
| Events & reuse | [12](./12_Triggers_EventListeners_And_Interceptors.md)–[16](./16_Dashboard.md) | Triggers; PAC; Catalog; CLI; UI |
| Secure & operate | [17](./17_Chains_Supply_Chain_Security.md)–[20](./20_Observability_HA_Debug_And_Windows.md) | Chains; Results/Pruner; Operator; ops |
| Craft | [21](./21_Worked_Example_Build_Test_Push.md)–[26](./26_GitOps_Handoff_And_Spectrum.md) | Lab; judgment; inventory; spectrum |

Suggested order: **01 → 26**. After **04**, jump to **21** if you learn by building.

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Tekton](./01_What_Is_Tekton.md) | K8s-native CI; when to choose it |
| 02 | [Install](./02_Install_Pipelines_And_Operator.md) | Pipelines release; Operator path |
| 03 | [Core model](./03_Core_Model_Tasks_Pipelines_Runs.md) | Task, Pipeline, Runs |
| 04 | [First Task and PipelineRun](./04_First_Task_And_PipelineRun.md) | First lab loop |
| 05 | [Tasks, steps, params, results](./05_Tasks_Steps_Params_And_Results.md) | Authoring Task |
| 06 | [Pipelines](./06_Pipelines_Ordering_And_Finally.md) | Graph and finally |
| 07 | [Workspaces and artifacts](./07_Workspaces_Artifacts_And_Volumes.md) | Data handoff |
| 08 | [Auth and RBAC](./08_Auth_ServiceAccounts_And_RBAC.md) | SA; registry; secrets |
| 09 | [Pods and compute](./09_Pod_Templates_Compute_And_Affinity.md) | PodTemplate; resources |
| 10 | [Matrix and extensions](./10_Matrix_CustomRuns_And_StepActions.md) | Matrix; CustomRun; StepAction |
| 11 | [Resolvers and bundles](./11_Resolvers_Bundles_And_Remote_Resources.md) | Remote Task/Pipeline refs |
| 12 | [Triggers](./12_Triggers_EventListeners_And_Interceptors.md) | Webhooks → Runs |
| 13 | [Pipelines-as-Code](./13_Pipelines_As_Code.md) | Git-native CI |
| 14 | [Catalog and Hub](./14_Catalog_Hub_And_Reusable_Tasks.md) | Reuse; pin digests |
| 15 | [CLI `tkn`](./15_CLI_tkn.md) | Full `tkn` surface (pre-install literacy) + plugins / `tkn pac` |
| 16 | [Dashboard](./16_Dashboard.md) | Web UI |
| 17 | [Chains](./17_Chains_Supply_Chain_Security.md) | Sign / attest |
| 18 | [Results and Pruner](./18_Results_And_Pruner.md) | Retention and storage |
| 19 | [Operator](./19_Operator_Platform_Config.md) | Platform config CRs |
| 20 | [Operate and observe](./20_Observability_HA_Debug_And_Windows.md) | Metrics; HA; debug |
| 21 | [Worked example](./21_Worked_Example_Build_Test_Push.md) | Build-test-push lab |
| 22 | [Best practices](./22_Best_Practices_And_When_Not_Tekton.md) | Judgment |
| 23 | [Coverage map](./23_Feature_And_Offering_Coverage_Map.md) | Full offering inventory |
| 24 | [YAML/CRD catalog](./24_YAML_CRD_Catalog_And_Troubleshooting.md) | Config index |
| 25 | [Migrate and extras](./25_Migrate_Versioning_And_Extras.md) | Versions; extras |
| 26 | [GitOps handoff and spectrum](./26_GitOps_Handoff_And_Spectrum.md) | CD handoff; related CI |

Start: [01](./01_What_Is_Tekton.md).
