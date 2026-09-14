# 19 — Security, permissions, and service connections

[← Previous](./18_Azure_Test_Plans.md) · [README](./README.md) · [Next: Worked example →](./20_Worked_Example_Build_And_Deploy.md)

---

## 1. Concepts

Three layers:

| Layer | Controls |
|-------|----------|
| **People** | Access levels + group membership + project/object ACLs |
| **Pipelines** | Who can edit/queue; templates; environment checks; resource authorization |
| **Cloud & externals** | **Service connections** (Azure ARM, GitHub, Docker Registry, Kubernetes, …) |

**Service connections** are how Pipelines authenticates to Azure and other systems. Prefer **workload identity federation** (federated credentials) over long-lived client secrets ([Security/5](../../Security/5_OIDC_CI_And_Least_Privilege.md)).

Org hardening overview: [Make your Azure DevOps secure](https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-overview).

---

## 2. Advanced concepts

### Identity and tokens

| Mechanism | Prefer |
|-----------|--------|
| Microsoft Entra ID sign-in + groups | Primary human identity |
| Federated service connections | Pipeline → Azure |
| Entra tokens for API automation | Over PATs when possible |
| PATs | Last resort: short-lived, scoped, stored in a secret manager — never in wiki |

Reduce PAT sprawl deliberately; conditional access on the Entra tenant protects the human plane.

### Network and data

- **IP allowlisting** for Azure DevOps access when policy requires.
- Restrict **public projects**; know what “public” exposes.
- Encrypt and classify what lands in artifacts and wikis.

### Azure Resource Manager connections

| Auth | Prefer? |
|------|---------|
| Federated identity | **Yes** for Services |
| Service principal secret | Legacy / constrained |
| Managed identity (self-hosted) | Agents in Azure |

Scope RBAC to resource groups — not subscription Owner. Separate **non-prod** and **prod** connections.

### Pipeline permissions and protections

- Restrict who creates/uses service connections and secure files.  
- **Authorize pipeline resources** (repos, connections, environments) explicitly — don’t allow every YAML to grab everything.  
- **Limit job authorization scope** to the current project when you do not need cross-project repo access (breaks multi-repo checkout until you grant exceptions).  
- Prefer **template `extends`** locks for production pipelines ([08](./08_Templates_Tasks_And_Extensions.md)).  
- Project settings that limit which repos can run YAML.  
- Protect `main` with branch policies ([17](./17_Azure_Repos_Git_And_TFVC.md)).  
- Object-level ACLs on pipelines, environments, variable groups, feeds.

Official: [Secure Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/security/overview).

### Secrets

Library secret vars, Key Vault-backed groups, secure files ([06](./06_Variables_Secrets_And_Library.md)). Never echo secrets; audit secure-file downloads.

### GitHub Advanced Security for Azure DevOps

Licensed add-on on Azure Repos:

| Feature | Job |
|---------|-----|
| **Secret scanning** (+ push protection) | Block/alert on credentials in Git |
| **Dependency scanning** | Vulnerable OSS direct/transitive deps (`AdvancedSecurity-Dependency-Scanning@1`) |
| **Code scanning** (CodeQL) | Static app vulns |

Enable per org/project/repo as needed; remediate secrets by **rotating** and moving to Key Vault — not by deleting the commit alone. Wire PR build validation so new high findings block merge. Pair with [CiCd/6](../6_Supply_Chain_And_Signing.md) and [Security/4](../../Security/4_Security_Gate_Chain.md).

### Azure DevOps Server

AD/NTLM/Entra hybrid auth; federation options differ — plan with identity. Same least-privilege ideas; you also harden the Windows/SQL host.

### Object-level permission surfaces

Repos, branches, pipelines, releases, environments, variable groups, secure files, feeds, wikis — each has a security dialog. Default is collaborative; **Deny** and custom groups tighten when needed.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Deploy App Service | Federated ARM → RG Contributor |
| GitHub source | GitHub App service connection |
| Prod gate | Environment approvals + limited deployers |
| Secret hygiene | Advanced Security push protection + Key Vault |
| API automation | Entra app / managed identity; PATs only if unavoidable |

**Good:** separate prod connection; audit on; Advanced Security on default branch. **Bad:** one subscription Owner connection; PAT in a README.

---

## References

- [Make your Azure DevOps secure](https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-overview)
- [Secure Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/security/overview)
- [Service connections](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints)
- [Connect to Azure with federated credentials](https://learn.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure)
- [Permissions and groups](https://learn.microsoft.com/en-us/azure/devops/organizations/security/about-permissions)
- [Object-level permissions](https://learn.microsoft.com/en-us/azure/devops/organizations/security/set-object-level-permissions)
- [Configure Advanced Security features](https://learn.microsoft.com/en-us/azure/devops/repos/security/configure-github-advanced-security-features)
