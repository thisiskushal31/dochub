# Azure DevOps

[← Back to CI/CD](../README.md)

**Azure DevOps** is Microsoft’s integrated delivery suite: **Boards**, **Repos**, **Pipelines**, **Artifacts**, and **Test Plans**. This folder is a **standalone deep dive** into that product — with **Pipelines** as the delivery spine, full suite literacy, and every common **Azure deployment pattern** you drive *from* Pipelines (legacy host → App Service → containers → AKS → IaC).

It is **not** a second Azure cloud textbook. Subscriptions, VNets, Load Balancers, and AKS internals live under [Cloud/](../../Cloud/README.md), [IAC/](../../IAC/README.md), [Automation/](../../Automation/README.md), and Containerization. Here you learn how Azure DevOps **plans, builds, promotes, and deploys** onto those targets.

### Azure DevOps Services vs Server

| | **Azure DevOps Services** | **Azure DevOps Server** |
|--|---------------------------|-------------------------|
| Host | Microsoft SaaS (`dev.azure.com`) | You install on Windows Server (ex-TFS lineage) |
| Updates | Continuous | You patch / upgrade |
| Typical | Most new estates | Air-gap, regulated on-prem |

Same product family; YAML Pipelines and Boards concepts transfer. Call out Server where install/admin diverges.

### Suite vs “DevOps on Azure”

| Need | Home |
|------|------|
| Boards / Repos / Pipelines / Artifacts / Test Plans | **These chapters** |
| Azure CLI / Cloud Shell / PowerShell as cloud tools | Literacy here for *pipeline agents*; deep Azure ops → [Cloud/4](../../Cloud/4_Azure_Literacy.md) |
| ARM / Bicep / Terraform / Ansible as craft | Pipelines wiring here → depth in [IAC/](../../IAC/README.md), [Automation/](../../Automation/README.md) |
| Docker / Kubernetes as craft | Deploy-from-ADO here → Containerization deep dive |
| GitOps (Argo CD / Flux) after Pipelines builds | [Argo_CD/](../Argo_CD/README.md), [Flux/](../Flux/README.md) |

Delivery-loop concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [8](../8_Environments_Promotion_And_Approvals.md), [19](../19_Delivery_Spectrum_Legacy_Through_Modern.md).

Someone who knows nothing about Azure DevOps should leave able to:

- Explain the five services **and** platform surfaces (wiki, analytics, billing, audit)  
- Author YAML Pipelines (and reason about classic / Server estates)  
- Wire agents, secrets, environments, approvals, and federated Azure auth  
- Deploy the common Azure targets from Pipelines (web, VM fleets, packages, containers, AKS, IaC)  
- Use Boards / Repos / Artifacts / Test Plans at operator literacy  
- Apply org and pipeline **management** practices (structure, least privilege, Advanced Security)  
- Find feature classes and config surfaces in the catalogs  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Azure_DevOps.md)–[03](./03_Pipelines_Mental_Model_YAML_And_Classic.md) | Suite map; org/project; YAML vs classic |
| First ship | [04](./04_First_Pipeline_And_Project_Setup.md)–[06](./06_Variables_Secrets_And_Library.md) | First run; agents; secrets |
| Pipeline craft | [07](./07_Triggers_Stages_Jobs_And_Strategies.md)–[10](./10_Artifacts_Feeds_And_Packages.md) | Triggers; templates; environments; artifacts |
| Azure deploy spectrum | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md)–[15](./15_Observability_Hooks_And_Non_Azure_Targets.md) | Web → VM → containers → IaC → other |
| Suite services | [16](./16_Azure_Boards.md)–[18](./18_Azure_Test_Plans.md) | Boards; Repos/TFVC; Test Plans |
| Security & craft | [19](./19_Security_Permissions_And_Service_Connections.md)–[21](./21_Best_Practices_And_Delivery_Spectrum.md) | AuthZ; lab; management practices |
| Catalogs & platform ops | [22](./22_Feature_And_Configuration_Coverage_Map.md)–[25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) | Inventory; YAML/tasks; troubleshoot; wiki/analytics/billing/audit |

Suggested order: **01 → 25**. After **04**, jump to **20** if you learn by building.

### Fit in the CiCd staircase

| Need | Start here |
|------|------------|
| What a deployment pipeline is | [CiCd/1](../1_Pipelines_Build_Test_Deploy.md) |
| Tools map | [CiCd/2](../2_CI_CD_Tools.md) |
| Host-neutral schedule / promote | [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md) |
| This product end-to-end | Chapters **01–25** below |

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Azure DevOps](./01_What_Is_Azure_DevOps.md) | Suite; Services vs Server; when to choose |
| 02 | [Org, project, process](./02_Organization_Project_Process_And_Access.md) | Tenancy, processes, access levels |
| 03 | [Pipelines mental model](./03_Pipelines_Mental_Model_YAML_And_Classic.md) | YAML vs classic releases; key objects |
| 04 | [First pipeline](./04_First_Pipeline_And_Project_Setup.md) | Project setup; first YAML run |
| 05 | [Agents](./05_Agents_Hosted_And_Self_Hosted.md) | Microsoft-hosted, self-hosted, scale sets |
| 06 | [Variables and secrets](./06_Variables_Secrets_And_Library.md) | Library, variable groups, secure files |
| 07 | [Triggers, stages, jobs](./07_Triggers_Stages_Jobs_And_Strategies.md) | CI/PR; matrix; deployment jobs |
| 08 | [Templates and tasks](./08_Templates_Tasks_And_Extensions.md) | Reuse; Marketplace tasks |
| 09 | [Environments and approvals](./09_Environments_Approvals_Checks_And_Classic_Releases.md) | Checks; classic release lineage |
| 10 | [Artifacts and feeds](./10_Artifacts_Feeds_And_Packages.md) | Pipeline artifacts; Azure Artifacts |
| 11 | [App Service, Functions, Static Web](./11_Deploy_App_Service_Functions_And_Static_Web.md) | Slots, WebDeploy, SWA |
| 12 | [VMs and fleets](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) | IIS, WinRM, SSH, availability sets |
| 13 | [Containers and AKS](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) | ACR, Container Apps, AKS |
| 14 | [IaC from Pipelines](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md) | ARM/Bicep/TF/Ansible wiring |
| 15 | [Observability and other targets](./15_Observability_Hooks_And_Non_Azure_Targets.md) | Monitor hooks; AWS/GCP; GitOps handoff |
| 16 | [Azure Boards](./16_Azure_Boards.md) | Work items, sprints, Kanban |
| 17 | [Azure Repos](./17_Azure_Repos_Git_And_TFVC.md) | Git, TFVC legacy, policies |
| 18 | [Azure Test Plans](./18_Azure_Test_Plans.md) | Manual/automated test literacy |
| 19 | [Security](./19_Security_Permissions_And_Service_Connections.md) | Permissions; federation; Advanced Security |
| 20 | [Worked example](./20_Worked_Example_Build_And_Deploy.md) | End-to-end lab narrative |
| 21 | [Best practices and managing ADO](./21_Best_Practices_And_Delivery_Spectrum.md) | Org/pipeline governance; spectrum |
| 22 | [Feature coverage map](./22_Feature_And_Configuration_Coverage_Map.md) | Feature inventory |
| 23 | [YAML and task catalog](./23_YAML_And_Task_Configuration_Catalog.md) | Config surfaces |
| 24 | [Troubleshooting and checklist](./24_Troubleshooting_And_Staff_Checklist.md) | Playbook + staff review |
| 25 | [Platform management](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) | Wiki; analytics; billing; audit |

Start: [01](./01_What_Is_Azure_DevOps.md).
