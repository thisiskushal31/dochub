# 21 — Best practices and managing Azure DevOps

[← Previous](./20_Worked_Example_Build_And_Deploy.md) · [README](./README.md) · [Next: Coverage map →](./22_Feature_And_Configuration_Coverage_Map.md)

## 1. Concepts — how to manage the product

Managing Azure DevOps well means treating it as a **delivery control plane**: org design, permissions, pipelines, and artifacts — not a pile of unrelated portals.

**Default preferences (greenfield):**

- One clear **org structure** story (see below)  
- **YAML** pipelines in Git; freeze new classic where policy allows  
- **Federated** Azure connections; reduce PATs  
- **Environments** + checks for real deploys  
- **Templates (`extends`)** as the paved road  
- Immutable **digests/versions** promoted unchanged  
- Platform surfaces owned: wiki, dashboards, audit, billing ([25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md))  

## 2. Advanced concepts

### A. Organization and project structure

From Microsoft’s org-planning guidance:

| Boundary | Use when |
|----------|----------|
| **Organization** | Hard admin/billing/compliance isolation; often one Entra tenant connection |
| **Project** | Security or product isolation inside an org |
| **Repo / area path / team** | Collaboration inside a project |

- Prefer **fewer orgs** unless regulation or billing truly splits.  
- Prefer **projects** for isolation that still shares agent pools and templates carefully.  
- Map Entra groups → Azure DevOps groups; avoid per-user ACLs at scale.  
- Document who is org owner vs project admin; use PIM / just-in-time elevation for cloud admin peers where your identity stack supports it.

Detail: [02](./02_Organization_Project_Process_And_Access.md). Official: [Plan your organizational structure](https://learn.microsoft.com/en-us/azure/devops/user-guide/plan-your-azure-devops-org-structure).

### B. Pipeline security and governance

| Practice | Why |
|----------|-----|
| Restrict who creates service connections | Stops silent cloud Owner grants |
| Authorize pipeline **resources** explicitly | Limits YAML from grabbing arbitrary repos/connections |
| Project-scoped build identities where available | Shrinks blast radius |
| Require template `extends` for prod pipelines | Prevents cowboy prod YAML |
| Separate non-prod vs prod connections | Least privilege |
| Secure self-hosted agents like jump hosts | Supply chain |
| Protect secrets (Library / Key Vault; no plaintext in logs) | [06](./06_Variables_Secrets_And_Library.md), [19](./19_Security_Permissions_And_Service_Connections.md) |
| Disable or freeze **new classic** pipelines when ready | Drift and reviewability |

Official entry: [Secure Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/security/overview).

### C. Repos and change control

- Branch policies: required reviewers, build validation, linked work items, comment resolution.  
- Limit force-push on release branches.  
- Enable **GitHub Advanced Security for Azure DevOps** (secret / dependency / code scanning) on repos that need it — licensed; wire PR checks ([19](./19_Security_Permissions_And_Service_Connections.md)).  
- Keep infrastructure / secret-bearing repos permission-tighter than app repos.

### D. Boards hygiene

- One process per product family; don’t customize lightly.  
- Link commits/PRs to work items for traceability.  
- Delivery plans / portfolio views when multiple teams share a project ([16](./16_Azure_Boards.md)).  
- Official agile management practices: [Boards best practices](https://learn.microsoft.com/en-us/azure/devops/boards/best-practices-agile-project-management).

### E. Artifacts and retention

- Private feeds with least-privilege readers/publishers.  
- Retention policies so drops don’t grow forever.  
- Promote by immutable version/digest — not only `latest`.

### F. Day-2 platform ops

| Cadence | Action |
|---------|--------|
| Continuous | Failed prod deploys; connection failures |
| Weekly | Agent pool health; flaky pipelines |
| Monthly | Permission drift; unused pipelines/feeds |
| Quarterly | Audit export review; billing/parallelism; Advanced Security alert backlog |
| On join/leave | Entra group membership → DevOps access |

Wiki + dashboards + notifications: [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md).

### G. Delivery spectrum (what you deploy)

| Spectrum | Azure / host example | Chapter |
|----------|----------------------|---------|
| Classic host / IIS / WinRM | VM or on-prem via self-hosted agent | [12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) |
| VM fleets / VMSS | Image or package roll | [12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) |
| PaaS web | App Service, slots, Functions, SWA | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |
| Data tier scripts | Azure SQL deploy tasks | [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md) |
| Packages | Azure Artifacts | [10](./10_Artifacts_Feeds_And_Packages.md) |
| Containers | ACR → Container Apps / App Service containers | [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |
| Kubernetes | AKS or GitOps handoff | [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md), [Argo_CD/](../Argo_CD/README.md) |
| IaC / config mgmt | ARM, Bicep, Terraform, Ansible | [14](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md) |
| Classic releases / Server / TFVC | Brownfield control planes | [09](./09_Environments_Approvals_Checks_And_Classic_Releases.md), [01](./01_What_Is_Azure_DevOps.md), [17](./17_Azure_Repos_Git_And_TFVC.md) |
| Multi-cloud / hybrid | Non-Azure stages | [15](./15_Observability_Hooks_And_Non_Azure_Targets.md) |

### Good vs bad

| Good | Bad |
|------|-----|
| Entra groups + least privilege | Everyone Project Collection Admin |
| Plan on PR; apply with approval | Apply from laptops with Owner creds |
| Federated connections; few PATs | PAT-in-wiki forever |
| Staging slot / canary then promote | Friday FTP to prod |
| Version-pinned templates | 20 diverged YAML copies |
| Audit + billing owners named | Nobody knows who pays for parallelism |

### When not to use Azure DevOps

GitHub-native teams with no Azure need; pure GitOps CD already solved; org standardized on another forge ([CiCd/2](../2_CI_CD_Tools.md)).

## 3. Applications and use cases

Staff review: walk sections A–F; mark use / defer / N/A. For each deploy estate you run, pick a spectrum row and confirm YAML, connection, environment, and artifact story exist.

## References

- [Plan your organizational structure](https://learn.microsoft.com/en-us/azure/devops/user-guide/plan-your-azure-devops-org-structure)  
- [Make your Azure DevOps secure](https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-overview)  
- [Secure Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/security/overview)  
- [Boards agile best practices](https://learn.microsoft.com/en-us/azure/devops/boards/best-practices-agile-project-management)  
- [CiCd delivery spectrum](../19_Delivery_Spectrum_Legacy_Through_Modern.md)  
