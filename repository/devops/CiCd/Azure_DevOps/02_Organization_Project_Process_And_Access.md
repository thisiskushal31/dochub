# 02 — Organization, project, process, and access

[← Previous](./01_What_Is_Azure_DevOps.md) · [README](./README.md) · [Next: Pipelines model →](./03_Pipelines_Mental_Model_YAML_And_Classic.md)

## 1. Concepts

| Layer | Meaning |
|-------|---------|
| **Organization** | Top tenancy (`https://dev.azure.com/{org}`). Billing, users, policies, agent pools can live here. |
| **Project** | Container for repos, boards, pipelines, artifacts for a product or team. |
| **Team** | Subset of a project with its own board/backlog area paths (optional multi-team). |
| **Process** | Work item types and states: **Agile**, **Scrum**, **Basic**, or **CMMI** (and inherited custom processes). |

Create an organization once; create projects for product boundaries (or one large project with area paths — trade-offs below).

**Access levels** (Services): Stakeholder / Basic / Basic + Test Plans / Visual Studio subscriber — control which features a user can use (especially Test Plans). Permissions are separate from access levels.

**CLI entry:** `az devops` (Azure CLI extension) and `az pipelines` for automation; Cloud Shell can run the same against your org. Deep Azure resource CLI stays in [Cloud/4](../../Cloud/4_Azure_Literacy.md).

## 2. Advanced concepts

### One org vs many, one project vs many

| Boundary | Prefer when |
|----------|-------------|
| **More orgs** | Hard compliance/billing/Entra-tenant isolation |
| **Fewer orgs** | Shared agents, templates, and users (default for most companies) |
| **More projects** | Need lock-down between products inside one org |
| **Fewer projects + Area Paths / Teams** | Collaboration first; Boards multi-team without project sprawl |

Microsoft’s rule of thumb: organizations are **hard** boundaries; projects are **security/visibility** boundaries; repos/teams are collaboration units. Full management practices: [21](./21_Best_Practices_And_Delivery_Spectrum.md). Official: [Plan your organizational structure](https://learn.microsoft.com/en-us/azure/devops/user-guide/plan-your-azure-devops-org-structure).

### Process customization

Inherited processes let you add fields and states without forking the whole model. Changing processes mid-flight affects every team on that process — treat as platform change.

### Permissions mental model

- **Organization** settings: users, policies (e.g. restrict public projects), OAuth apps, billing, audit.  
- **Project** settings: repos, pipelines, service connections, environments.  
- **Object-level:** pipeline permissions, feed permissions, environment approvals, wiki.

Default Microsoft groups (Project Administrators, Contributors, Readers, Build Administrators, …) are starting points — least privilege usually means **Entra groups** → custom DevOps groups + scoped service connections ([19](./19_Security_Permissions_And_Service_Connections.md)).

### Billing touchpoint

Access levels and parallel jobs are org billing concerns — capacity planning lives with platform ops ([25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md)).

### Azure DevOps Server note

Collections replace some org semantics; you manage SQL and application tiers. Map “collection ≈ org-ish” when reading SaaS docs.

## 3. Applications and use cases

| Use | Pattern |
|-----|---------|
| New product on Azure | New project; Basic/Agile process; enable Pipelines + Repos (or GitHub) |
| Enterprise with many apps | Org-level template repo + project-per-product or mono-project with areas |
| External contractors | Stakeholder or limited group; no service connection admin |

**Good:** document who owns org vs project admin. **Bad:** every engineer is Project Collection Administrator.

## References

- [Get started with Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/get-started/)  
- [Plan your organizational structure](https://learn.microsoft.com/en-us/azure/devops/user-guide/plan-your-azure-devops-org-structure)  
- [About projects and scaling](https://learn.microsoft.com/en-us/azure/devops/organizations/projects/about-projects)  
- [About access levels](https://learn.microsoft.com/en-us/azure/devops/organizations/security/access-levels)  
- [Azure DevOps CLI](https://learn.microsoft.com/en-us/azure/devops/cli/)  
