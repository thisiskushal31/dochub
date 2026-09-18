# 22 — Feature and configuration coverage map

[← Previous](./21_Best_Practices_And_Delivery_Spectrum.md) · [README](./README.md) · [Next: YAML catalog →](./23_YAML_And_Task_Configuration_Catalog.md)

## 1. Concepts

Use this map to see **which Azure DevOps feature classes exist** and **where they are taught**. Field-level YAML and task inputs evolve by version — confirm keys in References when implementing. Official Learn docs remain the place for exhaustive task input lists and Server version notes.

## 2. Advanced concepts — feature inventory

### A. Platform

| Feature | Chapter |
|---------|---------|
| Suite overview (Boards/Repos/Pipelines/Artifacts/Test Plans) | [01](./01_What_Is_Azure_DevOps.md) |
| Wiki, Dashboards, Analytics, Notifications, Search, Billing, Audit, REST | [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) |
| Services vs Server | [01](./01_What_Is_Azure_DevOps.md) |
| Organization / project / process / access | [02](./02_Organization_Project_Process_And_Access.md) |
| CLI (`az devops`) | [02](./02_Organization_Project_Process_And_Access.md), [04](./04_First_Pipeline_And_Project_Setup.md), [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) |

### B. Pipelines core

| Feature | Chapter |
|---------|---------|
| YAML vs classic / job kinds (agent, deployment, server, deployment group) | [03](./03_Pipelines_Mental_Model_YAML_And_Classic.md) |
| First pipeline | [04](./04_First_Pipeline_And_Project_Setup.md) |
| Agents / pools / scale sets / containers | [05](./05_Agents_Hosted_And_Self_Hosted.md) |
| Variables / Library / Key Vault / secure files | [06](./06_Variables_Secrets_And_Library.md) |
| Triggers / stages / jobs / matrix / resources / multi-repo / parameters / cache | [07](./07_Triggers_Stages_Jobs_And_Strategies.md) |
| Templates / tasks / Marketplace | [08](./08_Templates_Tasks_And_Extensions.md) |
| Environments / checks / classic releases / **deployment groups** | [09](./09_Environments_Approvals_Checks_And_Classic_Releases.md) |
| Pipeline artifacts / Azure Artifacts feeds / retention | [10](./10_Artifacts_Feeds_And_Packages.md) |

### C. Azure deploy spectrum

| Feature | Chapter |
|---------|---------|
| App Service / slots / Functions / Static Web Apps | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |
| VMs / VMSS / IIS / hybrid agents | [12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) |
| ACR / Container Apps / AKS / canary manifests | [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |
| ARM / Bicep / Terraform / Ansible from Pipelines | [14](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md) |
| Monitor hooks / multi-cloud / GitOps / language+mobile ecosystems | [15](./15_Observability_Hooks_And_Non_Azure_Targets.md) |
| Azure SQL / Azure Stack (task literacy) | [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md), [21](./21_Best_Practices_And_Delivery_Spectrum.md) |

### D. Suite services

| Feature | Chapter |
|---------|---------|
| Boards / Delivery Plans | [16](./16_Azure_Boards.md) |
| Repos Git + TFVC | [17](./17_Azure_Repos_Git_And_TFVC.md) |
| Test Plans | [18](./18_Azure_Test_Plans.md) |
| GitHub Advanced Security for Azure DevOps | [19](./19_Security_Permissions_And_Service_Connections.md) |

### E. Security and craft

| Feature | Chapter |
|---------|---------|
| Permissions / service connections / federation / Advanced Security | [19](./19_Security_Permissions_And_Service_Connections.md) |
| Worked example | [20](./20_Worked_Example_Build_And_Deploy.md) |
| Management practices + deploy spectrum | [21](./21_Best_Practices_And_Delivery_Spectrum.md) |
| Platform ops (wiki/analytics/billing/audit) | [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) |
| Troubleshooting | [24](./24_Troubleshooting_And_Staff_Checklist.md) |

### F. Deeper upstream essays

| Area | Notes |
|------|-------|
| Per-task input reference (hundreds of tasks) | Task index on Learn; class covered in [08](./08_Templates_Tasks_And_Extensions.md), [23](./23_YAML_And_Task_Configuration_Catalog.md) |
| Per-Server version upgrade guides | Always read upstream for *your* from→to |
| Azure cloud resource deep dives (LB, VNet, ASE) | [Cloud/4](../../Cloud/4_Azure_Literacy.md) |
| Terraform/Ansible language depth | [IAC/](../../IAC/README.md), [Automation/](../../Automation/README.md) |
| Docker/Kubernetes internals | Containerization Deep Dive |
| Per-language / mobile cookbooks (Xcode, Android, …) | Ecosystem essays on Learn; class in [15](./15_Observability_Hooks_And_Non_Azure_Targets.md) |
| Writing Marketplace extensions | Extensibility docs — consume extensions in [08](./08_Templates_Tasks_And_Extensions.md); authoring is contributor work |

## 3. Applications and use cases

Walk A–E (and platform ops in [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md)) when designing a platform checklist: use / defer / N/A per row.

## References

- [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/)  
- [Pipelines task reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/)  
- [YAML schema](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)  
