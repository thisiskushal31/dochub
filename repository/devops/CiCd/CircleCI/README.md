# CircleCI

[← Back to CI/CD](../README.md)

**CircleCI** is a CI/CD platform that runs automated pipelines from **configuration as code** (`.circleci/config.yml`). Jobs run on **CircleCI-managed executors** (Docker, Linux VM, macOS, Windows, …) or on **self-hosted runners**. This folder is a **standalone deep dive** into the product — Cloud and Server literacy, config/workflows/orbs, secrets/OIDC, deploy, security, insights, and tooling.

Related tools: [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Bitbucket/](../Bitbucket/README.md), [Buildkite/](../Buildkite/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Jenkins/](../Jenkins/README.md).

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md), [24](../24_Workflow_Automation_Beyond_PR_CI.md).

Someone who knows nothing about CircleCI or CI/CD should leave able to:

- Explain Cloud vs CircleCI Server and what a project/pipeline is  
- Connect a VCS repo, add `.circleci/config.yml`, and **view** a pipeline run  
- Author jobs, workflows, executors; use orbs and reusable config safely  
- Choose managed executors vs self-hosted runners  
- Use contexts, OIDC, caches/workspaces/artifacts, dynamic config  
- Deploy with approval holds or Smart Deployments; recognize insights, policies, Server  
- Find feature classes in the catalogs  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_CircleCI.md)–[03](./03_Create_Project_Config_And_View_Pipelines.md) | Product map; org/project; first run + UI |
| Config core | [04](./04_Config_Mental_Model_Jobs_Steps_Workflows.md)–[07](./07_Self_Hosted_Runners.md) | YAML model; templates; executors; runners |
| Pipeline craft | [08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md)–[11](./11_Reusable_Config_Commands_Executors_Parameters.md) | Workflows; caches; orbs; reuse |
| Security & dynamic | [12](./12_Contexts_Env_Vars_And_Secrets.md)–[15](./15_Deployments_Approvals_And_Markers.md) | Secrets; OIDC; dynamic; deploy |
| Estate & platform | [16](./16_Security_Permissions_SSO_And_Policies.md)–[18](./18_Server_CLI_API_And_Toolkit.md) | Harden; insights; Server/CLI/API |
| Craft & catalogs | [19](./19_Worked_Example_Build_And_Deploy.md)–[23](./23_Troubleshooting_And_Staff_Checklist.md) | Lab; practices; inventory; checklist |
| Full surface | [24](./24_Integrations_Migrate_Plans_And_Extras.md) | Integrations; migrate; plans |

Suggested order: **01 → 24**. After **05**, jump to **19** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is CircleCI](./01_What_Is_CircleCI.md) | CI/CD; Cloud vs Server; product surface |
| 02 | [Org, project, VCS](./02_Organization_Project_And_VCS.md) | Tenancy; connect GitHub/GitLab/Bitbucket |
| 03 | [Create project and view pipelines](./03_Create_Project_Config_And_View_Pipelines.md) | First config; UI; logs |
| 04 | [Config mental model](./04_Config_Mental_Model_Jobs_Steps_Workflows.md) | workflows → jobs → steps |
| 05 | [Templates and first config.yml](./05_Templates_And_First_Config_Yml.md) | Hello world and shapes |
| 06 | [Managed executors](./06_Managed_Executors_And_Resource_Classes.md) | Docker/machine/macOS/Windows; resource_class |
| 07 | [Self-hosted runners](./07_Self_Hosted_Runners.md) | Machine + container runners; Runner Provisioner |
| 08 | [Workflows and triggers](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md) | requires; filters; matrix; schedules |
| 09 | [Caches, workspaces, artifacts](./09_Caches_Workspaces_And_Artifacts.md) | Speed and handoff |
| 10 | [Orbs](./10_Orbs_Use_And_Author_Literacy.md) | Registry/inline/URL orbs; pin versions |
| 11 | [Reusable config](./11_Reusable_Config_Commands_Executors_Parameters.md) | commands; executors; parameters |
| 12 | [Contexts and secrets](./12_Contexts_Env_Vars_And_Secrets.md) | Shared secrets; env layers |
| 13 | [OIDC](./13_OIDC_And_Cloud_Federation.md) | Short-lived cloud auth |
| 14 | [Dynamic config](./14_Dynamic_Config_And_Continuation.md) | Setup workflows; continuation |
| 15 | [Deployments](./15_Deployments_Approvals_And_Markers.md) | Approvals; markers; Smart Deployments; release agent |
| 16 | [Security and access](./16_Security_Permissions_SSO_And_Policies.md) | IP ranges; SSO; config policies |
| 17 | [Insights and optimize](./17_Insights_Test_Splitting_And_Optimize.md) | Insights; parallelism; usage |
| 18 | [Server, CLI, API](./18_Server_CLI_API_And_Toolkit.md) | Self-managed; CLI; API |
| 19 | [Worked example](./19_Worked_Example_Build_And_Deploy.md) | End-to-end lab |
| 20 | [Best practices](./20_Best_Practices_And_When_Not_CircleCI.md) | Judgment; spectrum |
| 21 | [Feature coverage map](./21_Feature_And_Configuration_Coverage_Map.md) | Inventory |
| 22 | [YAML catalog](./22_YAML_And_Configuration_Catalog.md) | Config surfaces |
| 23 | [Troubleshooting](./23_Troubleshooting_And_Staff_Checklist.md) | Playbook |
| 24 | [Integrations and extras](./24_Integrations_Migrate_Plans_And_Extras.md) | VCS options; migrate; plans |

Start: [01](./01_What_Is_CircleCI.md).
