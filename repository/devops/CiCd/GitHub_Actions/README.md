# GitHub Actions

[← Back to CI/CD](../README.md)

**GitHub Actions** runs automated **workflows** from YAML under `.github/workflows/`. An **event** (push, pull request, schedule, manual dispatch, …) starts a run; **jobs** execute on **runners** (GitHub-hosted VMs or machines you host); each job is a sequence of **steps** (shell or reusable **actions**).

This folder is a **standalone deep dive**. Host-neutral delivery jobs (CI, schedule, promote, reusable templates) also exist on other forges — see [24](../24_Workflow_Automation_Beyond_PR_CI.md) and [2](../2_CI_CD_Tools.md). Prefer those concept chapters for cross-host patterns; open **this** track when the forge is GitHub.

Related tools: [GitLab_CI/](../GitLab_CI/README.md), [Bitbucket/](../Bitbucket/README.md), [CircleCI/](../CircleCI/README.md), [Buildkite/](../Buildkite/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Jenkins/](../Jenkins/README.md), [Flux/](../Flux/README.md), [Argo_CD/](../Argo_CD/README.md).

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md), [24](../24_Workflow_Automation_Beyond_PR_CI.md).

Depth pass: product surface mapped from official docs inventory. **Final offering map:** [21](./21_Feature_And_Configuration_Coverage_Map.md) (diagram + full inventory — free and paid/SKU surfaces listed; plan gates called out, not omitted). Language/cloud cookbooks stay upstream.

Someone who knows nothing about Actions should leave able to:

- Explain workflow → job → step → runner  
- Add a first CI workflow and read the run in the UI  
- Use matrix, cache, artifacts, reusable workflows, and environments  
- Prefer OIDC over long-lived cloud keys; harden permissions and fork PRs  
- Promote by **image digest**; hand off to GitOps when that is the platform path  
- Find **every** product offering (hosted/larger/self-hosted/ARC, OIDC, attestations, Importer, …) in the [coverage map](./21_Feature_And_Configuration_Coverage_Map.md) — paid or free — then open the chapter  


### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_GitHub_Actions.md)–[03](./03_First_Workflow_And_Actions_UI.md) | Product; model; first run |
| Syntax & craft | [04](./04_Workflow_Syntax_Mental_Model.md)–[07](./07_Contexts_Expressions_And_Variables.md) | YAML; events; jobs; expressions |
| Compute | [08](./08_GitHub_Hosted_Runners.md)–[10](./10_Actions_Runner_Controller_ARC.md) | Hosted, self-hosted, ARC literacy |
| Reuse & data | [11](./11_Actions_Marketplace_And_Pinning.md)–[13](./13_Reusable_Workflows_And_Composites.md) | Actions; cache; paved road |
| Secure & ship | [14](./14_Secrets_Variables_And_Environments.md)–[17](./17_Deploy_Environments_And_Promote.md) | Secrets; OIDC; harden; deploy |
| Craft & catalogs | [18](./18_Monitor_Metrics_And_Billing_Literacy.md)–[24](./24_Migrate_Packages_And_Extras.md) | Ops; lab; judgment; inventory |

Suggested order: **01 → 24**. After **05**, jump to **19** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is GitHub Actions](./01_What_Is_GitHub_Actions.md) | CI/CD on GitHub; when to choose it |
| 02 | [Core model](./02_Core_Model_Workflows_Jobs_Steps_Runners.md) | Workflow, job, step, action, runner |
| 03 | [First workflow and UI](./03_First_Workflow_And_Actions_UI.md) | First YAML; Actions tab; checks |
| 04 | [Workflow syntax](./04_Workflow_Syntax_Mental_Model.md) | `on`, jobs, permissions, env |
| 05 | [Events and triggers](./05_Events_And_Triggers.md) | push/PR, schedule, dispatch, call |
| 06 | [Jobs, needs, concurrency, matrix](./06_Jobs_Needs_Concurrency_And_Matrix.md) | Graph; cancel; matrices |
| 07 | [Contexts and expressions](./07_Contexts_Expressions_And_Variables.md) | github/secrets/vars; conditionals |
| 08 | [GitHub-hosted runners](./08_GitHub_Hosted_Runners.md) | Labels; larger runners; networking |
| 09 | [Self-hosted runners](./09_Self_Hosted_Runners_And_Groups.md) | Labels; groups; hygiene |
| 10 | [ARC](./10_Actions_Runner_Controller_ARC.md) | Kubernetes scale sets literacy |
| 11 | [Actions and pinning](./11_Actions_Marketplace_And_Pinning.md) | `uses:`; pin versions/SHAs |
| 12 | [Caches and artifacts](./12_Caches_And_Artifacts.md) | Speed and handoff |
| 13 | [Reusable workflows](./13_Reusable_Workflows_And_Composites.md) | Org paved road |
| 14 | [Secrets and environments](./14_Secrets_Variables_And_Environments.md) | Secrets; protection rules |
| 15 | [OIDC](./15_OIDC_And_Cloud_Federation.md) | Short-lived cloud auth |
| 16 | [Security hardening](./16_Security_Hardening_Permissions_And_Forks.md) | Perms; forks; injections |
| 17 | [Deploy and promote](./17_Deploy_Environments_And_Promote.md) | Approvals; digest promote |
| 18 | [Monitor and billing literacy](./18_Monitor_Metrics_And_Billing_Literacy.md) | Runs; metrics; limits |
| 19 | [Worked example](./19_Worked_Example_CI_Build_And_Promote.md) | End-to-end lab |
| 20 | [Best practices](./20_Best_Practices_And_When_Not_Actions.md) | Judgment |
| 21 | [Coverage map](./21_Feature_And_Configuration_Coverage_Map.md) | Full offering diagram + inventory (free/paid) |
| 22 | [YAML catalog](./22_YAML_And_Configuration_Catalog.md) | Config surfaces |
| 23 | [Troubleshooting](./23_Troubleshooting_And_Staff_Checklist.md) | Playbook |
| 24 | [Migrate and extras](./24_Migrate_Packages_And_Extras.md) | Importer; packages; extras |

Start: [01](./01_What_Is_GitHub_Actions.md).
