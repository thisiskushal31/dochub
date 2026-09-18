# 02 — Store a repository: workspace, project, clone, and push

[← Previous](./01_What_Is_Bitbucket.md) · [README](./README.md) · [Next: PRs →](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md)

## 1. Concepts — where code lives

| Layer | Meaning |
|-------|---------|
| **Workspace** | Top Cloud tenancy (users, billing, plan, shared runners/variables) |
| **Project** | Folder of repositories (shared project settings, e.g. branch restrictions) |
| **Repository** | One Git repo + settings (Pipelines, deployments, access) |

### Create a repository (Cloud UI)

1. **Create → Repository**.  
2. Choose **workspace** and **project** (or create a project).  
3. Set **Repository name** (appears in the URL).  
4. Keep **Private** unless you intentionally want public visibility.  
5. Optionally include a README.  
6. Version control: **Git** (default).  
7. **Create**, then **clone** to your machine.

You can also **import** an existing Git repo from another host into Bitbucket.

### Clone, change, push (day-to-day Git)

1. In the repo, open **Clone** and copy HTTPS or SSH.  
2. Locally: `git clone <url>` (creates a directory with the code).  
3. Edit files; then:

```text
git add …
git commit -m "message"
git push
```

Authentication for HTTPS uses an **API token** (with your Bitbucket username) or SSH keys. **App passwords are deprecated** — prefer API tokens or **repository / project / workspace access tokens** for automation.

That is “storing a repository”: Bitbucket holds the remote Git history; your laptop holds a clone; `git push` updates Bitbucket.

### What you can do with a stored repo

| Action | Chapter |
|--------|---------|
| Branch, open a **pull request**, merge with checks | [03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) |
| Run **Pipelines** on push/PR | [04](./04_Pipelines_Mental_Model_And_YAML.md)–[05](./05_First_Pipeline_And_Enablement.md) |
| Deploy and track environments | [11](./11_Deployments_And_Environments.md) |
| Search code; share snippets; insights on PRs | [21](./21_Snippets_Search_Code_Insights_And_Wiki.md) |
| Link Jira issues | [14](./14_Jira_And_Atlassian_Integrations.md) |

## 2. Advanced concepts

### Access control

- Workspace / project / repository **user and group** permissions (admin, create, write, read).  
- Prefer groups over one-off users.  
- Map IdP groups via Atlassian organization / Access when SSO is required ([15](./15_Security_Access_And_Workspace_Hardening.md)).

### Tokens for Git and API

| Token kind | Tied to | Use |
|------------|---------|-----|
| **API token** | User | Git + REST with scoped permissions |
| **Repository access token** | One repo | CI/scripts limited to that repo |
| **Project / workspace access token** | Broader | Automation across many repos |

Scope tokens narrowly; store in secret managers or Pipelines secured variables — never in the repo.

### Git LFS

Large binaries can use **Git LFS**. Cloud plans include an LFS quota; overages are billed. Use LFS for large assets, not as a substitute for artifact registries for release bits ([CiCd/4](../4_Artifacts_And_Registries.md)).

### Branching model

Repos can enable Bitbucket’s **branching model** (development/production/feature/release/hotfix branch types) to standardize names and permissions — pair with branch permissions ([03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md)).

### Variables scope preview

Workspace variables → many repos; repository variables → one repo; **deployment** variables → one environment ([07](./07_Variables_Secrets_And_OIDC.md)).

## 3. Applications and use cases

| Shape | When |
|-------|------|
| Empty remote, then clone | Greenfield |
| Import from GitHub/GitLab | Migration |
| Public open-source repo | Explicit public access |
| Private product repo | Default for companies |

**Good:** private by default; documented admins; SSH or scoped tokens. **Bad:** embedding tokens in clone URLs committed to disk forever.

## References

- [Create a repository](https://support.atlassian.com/bitbucket-cloud/docs/create-a-repository-in-bitbucket-cloud/)  
- [Clone a Git repository](https://support.atlassian.com/bitbucket-cloud/docs/clone-a-git-repository/)  
- [Push code to Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/push-code-to-bitbucket/)  
- [Import a repository](https://support.atlassian.com/bitbucket-cloud/docs/import-a-repository/)  
- [Using API tokens](https://support.atlassian.com/bitbucket-cloud/docs/using-api-tokens/)  
- [Repository access tokens](https://support.atlassian.com/bitbucket-cloud/docs/repository-access-tokens/)  
- [Git LFS](https://support.atlassian.com/bitbucket-cloud/docs/use-git-lfs-with-bitbucket/)  
