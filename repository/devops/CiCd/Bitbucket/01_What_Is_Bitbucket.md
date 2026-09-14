# 01 — What is Bitbucket

[← README](./README.md) · [Next: Store a repository →](./02_Workspace_Project_Repo_And_Access.md)

---

## 1. Concepts

If you are new to delivery tools: **CI/CD** means automating build, test, and deploy when code changes — the durable loop in [CiCd/1](../1_Pipelines_Build_Test_Deploy.md). **Bitbucket** is Atlassian’s place to **host Git repositories** and collaborate (pull requests, permissions). On **Bitbucket Cloud**, **Pipelines** is the built-in CI/CD that runs those automations from a file in the repo.

You do not need to know Jenkins or GitHub Actions first. Mental model:

```text
People store code in a Bitbucket repository (Git)
  → teammates review changes with pull requests
  → Pipelines builds/tests/deploys when you push or open a PR
  → optional: Jira issues link the work; Deployments show what is live where
```

### Cloud vs Data Center

| | **Bitbucket Cloud** | **Bitbucket Data Center** |
|--|---------------------|---------------------------|
| Host | Atlassian SaaS (`bitbucket.org`) | You operate it |
| Built-in CI | **Pipelines** | Not Pipelines — typically Bamboo, Jenkins, or other CI |
| This track | **Primary** | Brownfield literacy ([17](./17_Best_Practices_And_Cloud_Vs_Data_Center.md)) |

### What Bitbucket Cloud offers (product surface)

| Area | What you get |
|------|----------------|
| **Git hosting** | Repositories (private or public), clone/push/pull |
| **Projects & workspaces** | Organize repos; billing and users at workspace |
| **Pull requests** | Review, discuss, merge |
| **Branch permissions** | Who can write/merge to which branches |
| **Merge checks** | Conditions before merge (approvals, builds, …); **enforced** checks are Premium |
| **Pipelines** | CI/CD from `bitbucket-pipelines.yml` |
| **Deployments** | Environments + dashboard of what is deployed |
| **Runners** | Self-hosted agents when Cloud-hosted builds are not enough |
| **Variables / OIDC** | Secrets and cloud federation for Pipelines |
| **Pipes** | Packaged integrations in steps |
| **Code search** | Search across repos you can access |
| **Code insights** | Reports/annotations on commits/PRs (tests, scans, …) |
| **Snippets** | Small Git-backed shareable files |
| **Git LFS** | Large file storage (plan quotas) |
| **APIs & tokens** | Automate Bitbucket (API tokens; access tokens) |
| **Jira / Access** | Issue linkage; SSO/org policies via Atlassian organization |
| **Wiki / issues** | Lightweight Cloud surfaces — many teams use Confluence/Jira instead |

Plan tiers (Free / Standard / Premium) change **minutes**, **LFS**, and **admin controls**. Premium adds capabilities such as **enforced merge checks**, **deployment permissions**, **IP allowlisting**, **required two-step verification**, **Pipelines configuration sharing**, and (where offered) **smart mirroring**. Exact pricing and limits change — confirm on Atlassian’s plan page when buying; this handbook names the **capability**, not a price list.

### When teams choose Bitbucket

| Fit | Why |
|-----|-----|
| Already on Jira / Atlassian | Issue keys, Smart Commits, Access |
| Want forge + CI without a second product | Pipelines in the same UI |
| Cloud-first team | Atlassian operates the control plane |

### When not to force it

| Situation | Prefer |
|-----------|--------|
| GitHub is already source of truth | [GitHub_Actions/](../GitHub_Actions/README.md) |
| Self-managed Bitbucket expecting Pipelines | Data Center ≠ Pipelines; plan Bamboo/Jenkins |
| Need a different forge | [GitLab_CI/](../GitLab_CI/README.md), [Azure_DevOps/](../Azure_DevOps/README.md), … |

---

## 2. Advanced concepts

### Pipelines in one sentence

Steps run in **Docker containers** (Atlassian-hosted or your **runners**). You pay in **build minutes** (and larger `size:` steps consume more minutes). Limits and concurrency depend on plan.

### Naming this folder

Public path `Bitbucket/` is the CiCd tool home; content covers the **Bitbucket product**, with Pipelines as the delivery engine.

---

## 3. Applications and use cases

| Role | How Bitbucket shows up |
|------|------------------------|
| App engineer | Clone, branch, PR, watch Pipelines status |
| Platform | Workspace policies, runners, deployment permissions |
| Security | IP allowlists, 2FA/SSO, secured variables, OIDC |
| SE learning delivery | Forge-native CI mapped to the universal loop |

**Good:** Pipelines YAML in Git; merge checks require green builds on protected branches. **Bad:** assuming Cloud Premium controls exist unchanged on Data Center.

---

## References

- [Bitbucket overview](https://bitbucket.org/product/guides/getting-started/overview)  
- [Bitbucket Cloud Premium](https://www.atlassian.com/software/bitbucket/premium)  
- [Get started with Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/)  
- [Manage plan and billing](https://support.atlassian.com/bitbucket-cloud/docs/manage-your-plan-and-billing/)  
