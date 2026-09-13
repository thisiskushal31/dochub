# Bitbucket Pipelines

[← Back to CI/CD](../README.md)

Atlassian’s CI/CD for Bitbucket Cloud (and related Bitbucket hosting). Same jobs as other CI tools: build, test, publish, deploy — defined as code in the repo.

Index: [2_CI_CD_Tools.md](../2_CI_CD_Tools.md). Concepts: [1](../1_Pipelines_Build_Test_Deploy.md).

---

## What it is

- Pipeline definitions in **`bitbucket-pipelines.yml`** at the repo root  
- **Steps** run in Docker containers (Atlassian-hosted or self-hosted/runners depending on plan)  
- Branches, PRs, and custom pipelines; deployment environments with permissions  
- Native fit if source of truth is already Bitbucket (+ Jira for change linkage)

---

## Compared to siblings

| | Bitbucket Pipelines | GitHub Actions | GitLab CI |
|--|---------------------|----------------|-----------|
| Config file | `bitbucket-pipelines.yml` | `.github/workflows/*.yml` | `.gitlab-ci.yml` |
| Best when | Bitbucket is home | GitHub is home | GitLab is home |

Prefer the CI that sits next to your Git host unless compliance forces a separate CI.

---

## First use (outline)

1. Enable Pipelines for the repository in Bitbucket settings.  
2. Add `bitbucket-pipelines.yml` with a default branch build (lint/test).  
3. Add a deploy step to a named **environment** with restricted writers for production.  
4. Store secrets in repository/workspace variables; prefer OIDC/cloud roles where Atlassian docs support them for your cloud.  

Follow current [Bitbucket Pipelines docs](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/) for YAML schema and runner options — they evolve.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Prod credentials on every PR step | Deployment environment restrictions |
| Rebuild per environment | Promote digest ([4](../4_Artifacts_And_Registries.md)) |

## Further reading

- [Bitbucket Pipelines — get started](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/)  
