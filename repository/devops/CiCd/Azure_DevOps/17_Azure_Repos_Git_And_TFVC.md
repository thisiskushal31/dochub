# 17 — Azure Repos: Git and TFVC

[← Previous](./16_Azure_Boards.md) · [README](./README.md) · [Next: Test Plans →](./18_Azure_Test_Plans.md)

---

## 1. Concepts

**Azure Repos** hosts code:

| System | Status |
|--------|--------|
| **Git** | Default; PRs, branch policies, forks |
| **TFVC** | Legacy centralized VCS; still in brownfield Server/Services estates |

Most new work is Git. Know TFVC exists so migrations and old release docs make sense (similar spirit to CVS/SVN literacy in rule 9).

---

## 2. Advanced concepts

### Branch policies and Advanced Security

Require reviewers, linked work items, successful build validation, path filters, optional merge strategies. Where licensed, enable **GitHub Advanced Security for Azure DevOps** (secret / dependency / code scanning) and block merges on new high findings ([19](./19_Security_Permissions_And_Service_Connections.md)).

### PRs

Required reviewers, draft PRs, auto-complete, comment resolution. Pipelines PR triggers should match policy build validation.

### Permissions

Repo-level ACLs separate from project Contributors — restrict force-push and rewrite on release branches.

### GitHub as code host

Skip Azure Repos entirely if GitHub is SoR; still use Pipelines + Boards ([20](./20_Worked_Example_Build_And_Deploy.md) patterns, [19](./19_Security_Permissions_And_Service_Connections.md) for GitHub App connections).

### Import / migrate

Import from GitHub/GitLab/TFVC tools exist — plan LFS, permissions, and pipeline rewiring.

---

## 3. Applications and use cases

| Estate | Choice |
|--------|--------|
| New Azure DevOps-centric | Git in Azure Repos |
| Microsoft shop with TFVC history | Migrate to Git when possible; otherwise TFVC literacy |
| GitHub Enterprise already standard | GitHub + Azure Pipelines |

**Good:** branch policies + YAML PR builds. **Bad:** everyone pushes to `main` with no policy.

---

## References

- [What is Azure Repos?](https://learn.microsoft.com/en-us/azure/devops/repos/get-started/what-is-repos)  
- [Branch policies](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies)  
- [TFVC](https://learn.microsoft.com/en-us/azure/devops/repos/tfvc/what-is-tfvc)  
