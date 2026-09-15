# Jenkins

[← Back to CI/CD](../README.md)

**Jenkins** is a self-contained open-source **automation server**: you run a **controller**, attach **agents**, and automate build/test/deploy (and more) with **Freestyle** jobs or **Pipeline** (`Jenkinsfile`). It remains one of the most common CI/CD engines in brownfield and regulated estates — including classical VM/WAR deploy paths.

This folder is a **standalone deep dive** into what Jenkins offers and how it is configured: install, architecture, job types, Pipeline (Declarative/Scripted/Multibranch), agents/clouds, credentials, shared libraries, JCasC, security/RBAC, plugins, scaling/ops, and migration. Classical host/web deploy detail also lives in [20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) — this track teaches Jenkins; that chapter is the host-deploy lab companion.

Host-neutral delivery jobs: [24](../24_Workflow_Automation_Beyond_PR_CI.md), [2](../2_CI_CD_Tools.md). Related: [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md), [CircleCI/](../CircleCI/README.md), [Buildkite/](../Buildkite/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), [Tekton/](../Tekton/README.md), [Flux/](../Flux/README.md), [Argo_CD/](../Argo_CD/README.md).

Someone who knows nothing about Jenkins should leave able to:

- Explain controller vs agents vs executors vs labels  
- Install an LTS controller safely and avoid building on the built-in node  
- Configure via UI **and** **Configuration as Code (JCasC)** / init hooks  
- Author Declarative Jenkinsfiles; load shared libraries; run Multibranch  
- Wire credentials, triggers, artifacts/fingerprints  
- Harden authz, CSRF, script security, agent-to-controller  
- Operate plugins, backups, reverse proxies, and scale literacy  
- Find any offering class in the [coverage map](./24_Feature_And_Offering_Coverage_Map.md)  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Jenkins.md)–[04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md) | Product; install; architecture; config surfaces |
| Jobs & Pipeline | [05](./05_Job_Types_Freestyle_And_Matrix.md)–[10](./10_Multibranch_And_Organization_Folders.md) | Freestyle; Pipeline; syntax; Multibranch |
| Runtime & reuse | [11](./11_Agents_Clouds_Docker_And_Kubernetes.md)–[15](./15_Artifacts_Fingerprints_And_Promotions.md) | Agents; secrets; libraries; triggers; artifacts |
| Secure & operate | [16](./16_Security_Folders_RBAC_And_Hardening.md)–[21](./21_Blue_Ocean_CLI_And_Remote_API.md) | Security; plugins; classical deploy; ops; API |
| Craft | [22](./22_Worked_Example_Pipeline_Build_And_Deploy.md)–[26](./26_Migrate_LTS_Upgrades_And_Extras.md) | Lab; judgment; inventory |

Suggested order: **01 → 26**. After **07**, jump to **22** if you learn by building.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Jenkins](./01_What_Is_Jenkins.md) | Automation server; LTS; when to choose it |
| 02 | [Install the controller](./02_Install_Controller_And_LTS.md) | Packages, Docker, WAR, K8s; wizard |
| 03 | [Architecture](./03_Architecture_Controller_Agents_Executors.md) | Controller, agents, executors, labels |
| 04 | [Configuration surfaces](./04_Configuration_Surfaces_UI_JCasC_And_Init.md) | UI, JCasC, Groovy init, properties, CLI |
| 05 | [Job types](./05_Job_Types_Freestyle_And_Matrix.md) | Freestyle, matrix, multi-config |
| 06 | [Pipeline core](./06_Pipeline_Core_And_Jenkinsfile.md) | Pipeline as code; Declarative vs Scripted |
| 07 | [First Pipeline and UI](./07_First_Pipeline_And_UI.md) | First Jenkinsfile; Blue Ocean/classic UI |
| 08 | [Declarative syntax](./08_Declarative_Pipeline_Syntax.md) | Stages, agents, when, post, options |
| 09 | [Scripted Pipeline](./09_Scripted_Pipeline_And_CPS.md) | Groovy CPS; when Scripted fits |
| 10 | [Multibranch and org folders](./10_Multibranch_And_Organization_Folders.md) | Branch/PR discovery |
| 11 | [Agents and clouds](./11_Agents_Clouds_Docker_And_Kubernetes.md) | SSH, Docker, K8s, clouds |
| 12 | [Credentials](./12_Credentials_Secrets_And_Binding.md) | Credentials; binding; stores |
| 13 | [Shared libraries and Job DSL](./13_Shared_Libraries_And_Job_DSL.md) | Org paved road |
| 14 | [Triggers and SCM](./14_Triggers_Webhooks_Poll_SCM_And_Timers.md) | Webhook, poll, cron, remote trigger |
| 15 | [Artifacts and fingerprints](./15_Artifacts_Fingerprints_And_Promotions.md) | Archive, fingerprint, promote |
| 16 | [Security and RBAC](./16_Security_Folders_RBAC_And_Hardening.md) | Authz, CSRF, script security |
| 17 | [Plugins](./17_Plugins_Update_Center_And_Hygiene.md) | Pin, update, CVE posture |
| 18 | [Classical host deploy](./18_Classical_Host_And_Web_Deploy.md) | Door to CiCd/20 |
| 19 | [Managing Jenkins](./19_Managing_Tools_Nodes_Users_And_System.md) | Tools, nodes, users, system config |
| 20 | [Scale and operate](./20_Scaling_HA_Backup_And_Monitoring.md) | HA, backup, reverse proxy, monitor |
| 21 | [CLI and Remote API](./21_Blue_Ocean_CLI_And_Remote_API.md) | CLI, REST, Blue Ocean literacy |
| 22 | [Worked example](./22_Worked_Example_Pipeline_Build_And_Deploy.md) | End-to-end lab |
| 23 | [Best practices](./23_Best_Practices_And_When_Not_Jenkins.md) | Judgment |
| 24 | [Coverage map](./24_Feature_And_Offering_Coverage_Map.md) | Full offering + config inventory |
| 25 | [Config catalog](./25_Jenkinsfile_JCasC_And_Config_Catalog.md) | Surfaces index |
| 26 | [Migrate and LTS](./26_Migrate_LTS_Upgrades_And_Extras.md) | Upgrades; migrate; extras |

Start: [01](./01_What_Is_Jenkins.md).
