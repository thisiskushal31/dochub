# GitLab CI (and the GitLab product surface)

[← Back to CI/CD](../README.md)

**GitLab** is a DevSecOps platform: Git hosting, merge requests, planning, **CI/CD**, security scanning, package registries, release, infrastructure tooling, and more — on **GitLab.com**, **Self-Managed**, or **Dedicated**.

This folder is a **standalone deep dive**. **CI/CD is the major depth** (`.gitlab-ci.yml`, pipelines, runners, variables/secrets, environments, components). Adjacent chapters give **literacy for the majority of what GitLab offers** so you are not blind outside Verify — without turning the track into a second admin encyclopedia.

Host-neutral delivery jobs also live on other forges — see [24](../24_Workflow_Automation_Beyond_PR_CI.md) and [2](../2_CI_CD_Tools.md). Prefer those for cross-host patterns; open **this** track when the forge/platform is GitLab.

Related tools: [GitHub_Actions/](../GitHub_Actions/README.md), [Bitbucket/](../Bitbucket/README.md), [CircleCI/](../CircleCI/README.md), [Buildkite/](../Buildkite/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Jenkins/](../Jenkins/README.md), [Flux/](../Flux/README.md), [Argo_CD/](../Argo_CD/README.md).

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md), [24](../24_Workflow_Automation_Beyond_PR_CI.md).

Someone who knows nothing about GitLab should leave able to:

- Explain SaaS vs Self-Managed vs Dedicated, and where CI sits in the product  
- Use groups/projects/MRs enough to land a pipeline  
- Author `.gitlab-ci.yml`: stages, jobs, `rules`, `needs`, cache, artifacts  
- Run on shared or self-managed runners; prefer ID tokens / OIDC over static cloud keys  
- Gate deploys with environments; promote by **digest**; hand off to GitOps when that is the path  
- Name the major non-CI offerings (AppSec, packages, Agent, Duo, admin) and open the right chapter  
- Find everything in the [coverage map](./24_Feature_And_Offering_Coverage_Map.md)  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Platform foundation | [01](./01_What_Is_GitLab.md)–[04](./04_Planning_And_Work_Items_Literacy.md) | Product; groups/projects; SCM/MR; planning door |
| CI foundation | [05](./05_CI_Core_Model_Pipelines_Jobs_Stages.md)–[07](./07_YAML_Mental_Model_And_Keywords.md) | Model; first pipeline; YAML map |
| CI craft | [08](./08_Rules_Workflow_And_Pipeline_Types.md)–[13](./13_Includes_Components_And_CI_Catalog.md) | Rules; DAG; runners; Docker; cache; paved road |
| Secure & ship | [14](./14_Variables_Secrets_And_OIDC.md)–[18](./18_Agent_Auto_DevOps_And_Infrastructure.md) | Secrets/OIDC; env/deploy; registry; AppSec; Agent |
| Platform doors & craft | [19](./19_Duo_And_AI_Literacy.md)–[26](./26_Migrate_Plans_And_Extras.md) | Duo; admin; API; lab; judgment; inventory |

Suggested order: **01 → 26**. After **07**, jump to **22** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is GitLab](./01_What_Is_GitLab.md) | Platform; editions; when to choose it |
| 02 | [Groups and projects](./02_Groups_Projects_And_Namespaces.md) | Tenancy model |
| 03 | [SCM and merge requests](./03_SCM_Merge_Requests_And_Code_Review.md) | Git, MRs, protection |
| 04 | [Planning literacy](./04_Planning_And_Work_Items_Literacy.md) | Issues/epics/boards door |
| 05 | [CI core model](./05_CI_Core_Model_Pipelines_Jobs_Stages.md) | Pipeline, stage, job, runner |
| 06 | [First pipeline and UI](./06_First_Pipeline_And_CI_UI.md) | First YAML; pipelines UI |
| 07 | [YAML mental model](./07_YAML_Mental_Model_And_Keywords.md) | Keywords map; lint |
| 08 | [Rules and pipeline types](./08_Rules_Workflow_And_Pipeline_Types.md) | `rules`, workflow, MR pipelines |
| 09 | [Needs and downstream](./09_Needs_DAG_And_Downstream_Pipelines.md) | DAG; parent/child; multi-project |
| 10 | [Runners and executors](./10_Runners_And_Executors.md) | Shared + self-managed |
| 11 | [Images, services, Docker](./11_Images_Services_And_Docker_Build.md) | Images; DinD; Buildah literacy |
| 12 | [Cache and artifacts](./12_Caching_Artifacts_And_Job_Tokens.md) | Speed and handoff |
| 13 | [Includes and components](./13_Includes_Components_And_CI_Catalog.md) | Paved road / Catalog |
| 14 | [Variables, secrets, OIDC](./14_Variables_Secrets_And_OIDC.md) | Vars; ID tokens; Vault |
| 15 | [Environments and release](./15_Environments_Deployments_And_Release.md) | Gates; review apps; release |
| 16 | [Packages and registry](./16_Packages_Container_Registry_And_Dependency_Proxy.md) | Registry surface |
| 17 | [Security and compliance](./17_Security_Scanning_And_Compliance_Literacy.md) | AppSec / policies literacy |
| 18 | [Agent and infrastructure](./18_Agent_Auto_DevOps_And_Infrastructure.md) | Agent; Auto DevOps; GitOps door |
| 19 | [Duo literacy](./19_Duo_And_AI_Literacy.md) | Assisted delivery door |
| 20 | [Self-Managed admin literacy](./20_Self_Managed_Admin_Literacy.md) | Install / ops door |
| 21 | [API and integrations](./21_API_Webhooks_And_Integrations.md) | Extend GitLab |
| 22 | [Worked example](./22_Worked_Example_CI_Build_And_Promote.md) | End-to-end lab |
| 23 | [Best practices](./23_Best_Practices_And_When_Not_GitLab.md) | Judgment |
| 24 | [Coverage map](./24_Feature_And_Offering_Coverage_Map.md) | Full offering diagram + inventory |
| 25 | [Catalog and troubleshooting](./25_YAML_Catalog_And_Troubleshooting.md) | Config index + playbook |
| 26 | [Migrate, plans, extras](./26_Migrate_Plans_And_Extras.md) | Migration; tiers; extras |

Start: [01](./01_What_Is_GitLab.md).
