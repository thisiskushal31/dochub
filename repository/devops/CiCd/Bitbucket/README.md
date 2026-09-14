# Bitbucket

[← Back to CI/CD](../README.md)

**Bitbucket** is Atlassian’s Git forge and collaboration product. This folder is a **standalone deep dive** into **Bitbucket Cloud** end-to-end — workspaces, repos, pull requests, branch permissions, merge checks — with **Bitbucket Pipelines** as the built-in CI/CD spine (`bitbucket-pipelines.yml`).

**Bitbucket Data Center** (self-managed) is covered as brownfield literacy: same Git/PR ideas; CI is often **Bamboo** or external (Pipelines is Cloud-native). Sister tools: [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Jenkins/](../Jenkins/README.md).

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [24](../24_Workflow_Automation_Beyond_PR_CI.md).

Someone who knows nothing about Bitbucket or CI/CD should leave able to:

- Say what Bitbucket Cloud offers (forge + Pipelines + related surfaces)  
- Create/import a repository, clone, commit, and push  
- Open a PR and protect branches with permissions / merge checks  
- Enable Pipelines, write `bitbucket-pipelines.yml`, and **view** runs/logs  
- Use runners, secrets/OIDC, caches, pipes, deployments  
- Recognize Premium-gated admin controls without inventing plan details  
- Link work to Jira without confusing Bitbucket with Jira  
- Find feature classes in the catalogs  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Bitbucket.md)–[03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) | Product map; store a repo; PR/merge control |
| Pipelines core | [04](./04_Pipelines_Mental_Model_And_YAML.md)–[07](./07_Variables_Secrets_And_OIDC.md) | YAML model; configure + view runs; runners; secrets |
| Pipeline craft | [08](./08_Triggers_Steps_Stages_Parallel.md)–[11](./11_Deployments_And_Environments.md) | Triggers; caches; pipes; deployments |
| Deploy & Atlassian | [12](./12_Deploy_Targets_And_Pipes_Catalog.md)–[14](./14_Jira_And_Atlassian_Integrations.md) | Target spectrum; dynamic pipelines; Jira |
| Security & craft | [15](./15_Security_Access_And_Workspace_Hardening.md)–[17](./17_Best_Practices_And_Cloud_Vs_Data_Center.md) | Harden; lab; judgment |
| Catalogs | [18](./18_Feature_And_Configuration_Coverage_Map.md)–[20](./20_Troubleshooting_And_Staff_Checklist.md) | Inventory; YAML surfaces; checklist |
| Extra Cloud surfaces | [21](./21_Snippets_Search_Code_Insights_And_Wiki.md) | Search, insights, snippets, wiki/issues literacy |

Suggested order: **01 → 21**. After **05**, jump to **16** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Bitbucket](./01_What_Is_Bitbucket.md) | Product surface; Cloud vs Data Center; Pipelines role |
| 02 | [Store a repository](./02_Workspace_Project_Repo_And_Access.md) | Workspace/project; create/clone/push; tokens; LFS |
| 03 | [PRs, branches, merge checks](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) | Review path; permissions; enforced checks (Premium) |
| 04 | [Pipelines mental model](./04_Pipelines_Mental_Model_And_YAML.md) | `bitbucket-pipelines.yml` objects |
| 05 | [Configure and view a pipeline](./05_First_Pipeline_And_Enablement.md) | Enable YAML; history; logs; rerun |
| 06 | [Runners](./06_Runners_Cloud_And_Self_Hosted.md) | Hosted containers vs self-hosted |
| 07 | [Variables, secrets, OIDC](./07_Variables_Secrets_And_OIDC.md) | Secured vars; cloud federation |
| 08 | [Triggers, steps, stages](./08_Triggers_Steps_Stages_Parallel.md) | CI/PR/custom/schedule; parallel; step size |
| 09 | [Caches, artifacts, services](./09_Caches_Artifacts_And_Services.md) | Speed and dependencies |
| 10 | [Pipes and reuse](./10_Pipes_Anchors_And_Reuse.md) | Pipes; anchors; child pipelines; config sharing |
| 11 | [Deployments](./11_Deployments_And_Environments.md) | Environments; dashboards; permissions |
| 12 | [Deploy targets](./12_Deploy_Targets_And_Pipes_Catalog.md) | Cloud/K8s/host spectrum via pipes |
| 13 | [Dynamic / advanced YAML](./13_Dynamic_Pipelines_And_Advanced_YAML.md) | Dynamic generation; agentic (beta) literacy |
| 14 | [Jira and Atlassian](./14_Jira_And_Atlassian_Integrations.md) | Issue keys; Smart Commits; Access |
| 15 | [Security](./15_Security_Access_And_Workspace_Hardening.md) | IP allowlist; 2SV; least privilege |
| 16 | [Worked example](./16_Worked_Example_Build_And_Deploy.md) | End-to-end lab |
| 17 | [Best practices](./17_Best_Practices_And_Cloud_Vs_Data_Center.md) | Management; spectrum; when not |
| 18 | [Feature coverage map](./18_Feature_And_Configuration_Coverage_Map.md) | Feature inventory |
| 19 | [YAML catalog](./19_YAML_And_Configuration_Catalog.md) | Config surfaces |
| 20 | [Troubleshooting and checklist](./20_Troubleshooting_And_Staff_Checklist.md) | Playbook + staff review |
| 21 | [Snippets, search, insights](./21_Snippets_Search_Code_Insights_And_Wiki.md) | Non-CI Cloud surfaces |

Start: [01](./01_What_Is_Bitbucket.md).
