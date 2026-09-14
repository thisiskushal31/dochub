# Buildkite

[← Back to CI/CD](../README.md)

**Buildkite** is a CI/CD platform whose core idea is: **Pipelines** orchestrate builds in Buildkite’s control plane; **agents** (yours or Buildkite-hosted) execute the jobs. This folder is a **standalone deep dive** into the full product surface — Pipelines, agents/queues/clusters/hooks, source control connections, secrets/OIDC, deployments, integrations/insights, governance, APIs — plus literacy for **Package Registries**, **Test Engine**, and **Platform** (teams/SSO/Terraform/audit).

Sister tools: [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Bitbucket/](../Bitbucket/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Jenkins/](../Jenkins/README.md).

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md), [24](../24_Workflow_Automation_Beyond_PR_CI.md).

Someone who knows nothing about Buildkite or CI/CD should leave able to:

- Explain hybrid (you run agents) vs Buildkite hosted agents  
- Create an organization/pipeline, connect Git, and **view** a build  
- Author `.buildkite/pipeline.yml` (steps, wait/block, depends_on, agents/queues)  
- Choose self-hosted stacks (AWS / GCP / Azure / K8s) vs hosted ops  
- Use secrets/OIDC, hooks, artifacts, plugins, dynamic `pipeline upload`  
- Recognize Package Registries, Test Engine, governance, and APIs  
- Find feature classes in the catalogs  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Buildkite.md)–[03](./03_Create_Pipeline_Connect_Git_And_View_Builds.md) | Product map; org; first pipeline + UI |
| Agents | [04](./04_Agents_Self_Hosted_And_Hosted.md)–[05](./05_Queues_Clusters_And_Targeting.md) | Where jobs run; queues/clusters |
| Pipeline YAML | [06](./06_Pipeline_YAML_And_Step_Types.md)–[09](./09_Plugins_Artifacts_Cache_And_Annotations.md) | Steps; templates; workflows; plugins |
| Security & dynamic | [10](./10_Secrets_Environment_And_OIDC.md)–[12](./12_Deployments_And_Environments.md) | Secrets; dynamic upload; deploy |
| Estate & siblings | [13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md)–[15](./15_Platform_Teams_SSO_And_Governance.md) | Stacks; packages/tests; platform |
| Craft & catalogs | [16](./16_Worked_Example_Build_And_Deploy.md)–[20](./20_Troubleshooting_And_Staff_Checklist.md) | Lab; practices; inventory; checklist |
| Full product surface | [21](./21_Source_Control_Providers_And_Code_Access.md)–[26](./26_APIs_CLI_Terraform_And_Platform_Extras.md) | SCM; hooks; hosted ops; integrations; governance; APIs |

Suggested order: **01 → 26**. After **07**, jump to **16** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Buildkite](./01_What_Is_Buildkite.md) | Product surface; hybrid vs hosted |
| 02 | [Organization, teams, clusters](./02_Organization_Teams_And_Clusters.md) | Tenancy and access |
| 03 | [Create pipeline, Git, view builds](./03_Create_Pipeline_Connect_Git_And_View_Builds.md) | First pipeline UI path |
| 04 | [Agents](./04_Agents_Self_Hosted_And_Hosted.md) | Self-hosted vs Buildkite hosted |
| 05 | [Queues, clusters, targeting](./05_Queues_Clusters_And_Targeting.md) | Route jobs to agents |
| 06 | [Pipeline YAML and step types](./06_Pipeline_YAML_And_Step_Types.md) | `pipeline.yml` objects |
| 07 | [Templates and first pipeline.yml](./07_Templates_And_First_Pipeline_Yml.md) | Example shapes |
| 08 | [Workflows](./08_Workflows_Depends_Matrix_Schedules_And_Blocks.md) | depends_on; matrix; schedules; block |
| 09 | [Plugins, artifacts, cache](./09_Plugins_Artifacts_Cache_And_Annotations.md) | Speed and reuse |
| 10 | [Secrets, env, OIDC](./10_Secrets_Environment_And_OIDC.md) | Credential hygiene |
| 11 | [Dynamic pipelines](./11_Dynamic_Pipelines_And_Pipeline_Upload.md) | Generate + upload |
| 12 | [Deployments](./12_Deployments_And_Environments.md) | Promote patterns; target guides |
| 13 | [Self-hosted stacks](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md) | Elastic CI AWS; K8s; GCP/Azure |
| 14 | [Package Registries and Test Engine](./14_Package_Registries_And_Test_Engine.md) | Sibling products |
| 15 | [Platform security](./15_Platform_Teams_SSO_And_Governance.md) | Teams; SSO; governance door |
| 16 | [Worked example](./16_Worked_Example_Build_And_Deploy.md) | End-to-end lab |
| 17 | [Best practices](./17_Best_Practices_And_When_Not_Buildkite.md) | Judgment; spectrum |
| 18 | [Feature coverage map](./18_Feature_And_Configuration_Coverage_Map.md) | Inventory |
| 19 | [YAML catalog](./19_YAML_And_Configuration_Catalog.md) | Config surfaces |
| 20 | [Troubleshooting and checklist](./20_Troubleshooting_And_Staff_Checklist.md) | Playbook |
| 21 | [Source control providers](./21_Source_Control_Providers_And_Code_Access.md) | GitHub/GitLab/Bitbucket/…; clone access |
| 22 | [Agent hooks and install](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md) | Hooks; lifecycle; OS/cloud install |
| 23 | [Hosted agent operations](./23_Hosted_Agent_Operations.md) | Shapes; caches; network; images |
| 24 | [Integrations and insights](./24_Integrations_Notifications_Observability_And_Insights.md) | Plugins; notify; waterfall; metrics |
| 25 | [Governance and migration](./25_Governance_Permissions_And_Migration.md) | Templates; permissions; converters |
| 26 | [APIs, CLI, Terraform](./26_APIs_CLI_Terraform_And_Platform_Extras.md) | REST/GraphQL; audit; plans |

Start: [01](./01_What_Is_Buildkite.md).
