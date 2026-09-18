# 02 — Organization, project, and VCS

[← Previous](./01_What_Is_CircleCI.md) · [README](./README.md) · [Next: Create project →](./03_Create_Project_Config_And_View_Pipelines.md)

## 1. Concepts

| Layer | Meaning |
|-------|---------|
| **Organization** | Billing, contexts, SSO, shared settings |
| **Project** | One connected code repository + pipelines |
| **Pipeline** | A run of your config (triggered by VCS or schedule/API) |
| **User / roles** | Who can view, run, edit, administer |

### Connect code

CircleCI integrates with **GitHub** (App and legacy paths), **GitLab**, **Bitbucket**, and related options (including Origin/Cursor paths where documented). You authorize the VCS, then **create a project** that points at a repository.

Without a connected repo (or equivalent), there is nothing for CircleCI to build.

### Invite team

Org admins invite collaborators so they can see projects and contribute config — pair with roles ([16](./16_Security_Permissions_SSO_And_Policies.md)).

## 2. Advanced concepts

GitHub App vs older OAuth/GitHub Checks differences matter for triggers and permissions — follow the in-app path for your integration type when setting up.

Multiple pipelines / config files per project are supported for advanced layouts ([08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md), [14](./14_Dynamic_Config_And_Continuation.md)).

A pipeline has a **config source** (where `.circleci/config.yml` lives) and a **checkout source** (what `checkout` pulls). On some VCS integrations these can differ; GitLab typically keeps them the same repo — see pipelines overview for your integration.

Stop building / rename org-repo mappings carefully — docs cover rename and delete flows under security guides.

## 3. Applications and use cases

| Shape | Pattern |
|-------|---------|
| One product repo | One project, one `.circleci/config.yml` |
| Monorepo | Path filters, dynamic config, or multiple pipelines |
| Agency / multi-client | Separate orgs or strict project isolation |

**Good:** least privilege on VCS app install. **Bad:** org-wide secrets on every project by default.

## References

- [Create an organization](https://circleci.com/docs/guides/getting-started/create-an-organization/)  
- [Create project](https://circleci.com/docs/guides/getting-started/create-project/)  
- [Users, organizations, integrations](https://circleci.com/docs/guides/permissions-authentication/users-organizations-and-integrations-guide/)  
