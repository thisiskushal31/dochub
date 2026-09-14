# 01 — What is Azure DevOps

[← README](./README.md) · [Next: Org & project →](./02_Organization_Project_Process_And_Access.md)

---

## 1. Concepts

**Azure DevOps** is one product with five services under a shared **organization** and **project**:

| Service | Job |
|---------|-----|
| **Azure Boards** | Plan and track work (backlogs, boards, sprints) |
| **Azure Repos** | Host Git (or legacy TFVC) and pull requests |
| **Azure Pipelines** | Build, test, and deploy (CI/CD) |
| **Azure Artifacts** | Package feeds (NuGet, npm, Maven, Python, Universal, …) |
| **Azure Test Plans** | Manual test cases, exploratory testing, links to automated results |

**Also in the product (not separate “services” in the left nav sense):** project **Wiki**, **Dashboards**, **Analytics**/reporting, **Notifications**, **Search**, **Marketplace** extensions, org **billing** and **audit** — covered in [25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md).

You can turn core services on/off per project. Many teams use **Pipelines + Artifacts** with **GitHub** as the code host and skip Azure Repos. Others run the full suite. Boards alone is valid when code lives elsewhere.

**Azure DevOps is not “all of Azure.”** Deploying an App Service or AKS cluster uses Azure cloud resources; Azure DevOps is the **control plane for delivery** that talks to those resources through **service connections**.

```text
Plan (Boards) → Code (Repos or GitHub) → Build/Test (Pipelines)
  → Package (Artifacts / container registry)
  → Deploy (Pipelines → Azure / other targets)
  → Verify (Test Plans + monitoring)
```

Same durable jobs as any CI/CD staircase ([CiCd/1](../1_Pipelines_Build_Test_Deploy.md)): build once, promote by digest, gate by environment, recover fast.

### When teams choose it

| Fit | Why |
|-----|-----|
| Microsoft / .NET / Azure-heavy estate | Deep task library and Azure auth integration |
| Need Boards + Pipelines in one billable org | Single identity and permissions model |
| Mix of Windows agents and cloud deploys | First-class Windows hosted/self-hosted agents |
| Regulated on-prem | **Azure DevOps Server** (self-hosted lineage from TFS) |

### When not to force it

| Situation | Prefer |
|-----------|--------|
| Code and culture already on GitHub; no Azure need | [GitHub_Actions/](../GitHub_Actions/README.md) |
| Kubernetes GitOps as primary CD | Pipelines build/push → [Argo_CD/](../Argo_CD/README.md) / [Flux/](../Flux/README.md) |
| Want open-source forge + CI only | GitLab CI, Jenkins, etc. ([2](../2_CI_CD_Tools.md)) |

---

## 2. Advanced concepts

### Services vs Server

**Azure DevOps Services** (SaaS) is the default for new work. **Azure DevOps Server** is the on-premises product: you own SQL, IIS, backups, and upgrade trains. Feature parity is high for Pipelines YAML and Boards; admin surfaces and networking differ. Brownfield enterprises often still run Server.

### Classic vs modern Pipelines (preview)

Two historical shapes still coexist:

- **YAML pipelines** in-repo (`azure-pipelines.yml`) — preferred for reviewable, portable CI/CD.
- **Classic** build/release UI pipelines — still widespread in older estates; release “stages” lived outside the repo.

Treat classic as **brownfield literacy**, not the paved road for new work ([03](./03_Pipelines_Mental_Model_YAML_And_Classic.md)).

### Relationship to Azure cloud tooling

“DevOps in Azure” curricula often mix Cloud Shell, ARM, Terraform, Ansible, Docker, and Kubernetes with Azure DevOps. In this handbook:

- **This track** = Azure DevOps product + how Pipelines deploys.
- **Sister rooms** = deep craft of those tools ([Cloud/](../../Cloud/README.md), [IAC/](../../IAC/README.md), Containerization).

---

## 3. Applications and use cases

| Role | How this product shows up |
|------|---------------------------|
| App engineer | Work items, PRs, pipeline status on the PR, deploy stages |
| Platform / SRE | Org policies, agent pools, service connections, template paved roads |
| Security | Permissions, federated credentials, audit, least-privilege connections |
| SE learning delivery | One suite that still maps to the universal loop in [CiCd/1](../1_Pipelines_Build_Test_Deploy.md) |

**Good:** YAML in Git; scoped service connections; environments with approvals. **Bad:** treating Azure DevOps as a substitute for understanding App Service vs AKS vs VMs ([21](./21_Best_Practices_And_Delivery_Spectrum.md)).

---

## References

- [What is Azure DevOps?](https://learn.microsoft.com/en-us/azure/devops/user-guide/what-is-azure-devops)  
- [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/)  
- [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)  
