# 03 — Pull requests, branch permissions, and merge checks

[← Previous](./02_Workspace_Project_Repo_And_Access.md) · [README](./README.md) · [Next: Pipelines model →](./04_Pipelines_Mental_Model_And_YAML.md)

## 1. Concepts

Bitbucket’s change-control trio:

| Control | Job |
|---------|-----|
| **Branch permissions** | Who can push or merge to a branch / pattern |
| **Merge checks** | Conditions that must pass before merge (approvals, builds, tasks) |
| **Pull requests** | Review UI; default reviewers; merge strategies |

Together they protect `main` the way GitHub branch protection or Azure Repos policies do.

## 2. Advanced concepts

### Branch permissions

Restrict write and merge-via-PR by user/group for named branches, branching-model types, or patterns (`release/*`). Project-level restrictions apply across repos.

### Merge checks

Common required checks:

- Minimum approvals (and default-reviewer approvals)  
- No unresolved PR tasks  
- Minimum successful builds on the latest commit (Pipelines or commit-status API)  
- Reset approvals when the source branch changes  

**Custom merge checks** (Forge apps) extend rules for workspace-wide policy — workspace admin territory.

### Pull request settings

Default reviewers, delete-source-branch defaults, merge strategies (merge commit, squash, fast-forward). Pick a default that matches how you want history to read ([Methodologies](../../Methodologies/README.md) branching literacy).

### Create a pull request (minimum path)

1. Push a **branch** with your commits (not direct push to protected `main`).  
2. **Create → Pull request** (or open the prompt Bitbucket shows after push).  
3. Set source and destination branches; add reviewers/description.  
4. Create; wait for Pipelines / merge checks; address review comments.  
5. Merge when checks pass.

Compare branches first if you want a diff before opening the PR.

### Branching model

Optional repository **branching model** standardizes development/production/feature/release/hotfix names so permissions and merge checks can target **types**, not only one branch name.

### Enforced merge checks (Premium)

On Free/Standard you can **recommend** checks. **Premium** can **enforce** them so merges are blocked until conditions pass — treat that as the production-grade control.

### Pipelines linkage

PR pipelines should report commit status so merge checks can require green builds ([08](./08_Triggers_Steps_Stages_Parallel.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Protect `main` | No direct push; PR + 2 approvals + 1 green build |
| Release branches | Pattern permissions; fewer merger groups |
| Monorepo | Same checks; path-filtered pipelines still must satisfy “builds” wisely |

**Good:** checks required, not only suggested, on production branches. **Bad:** optional checks everyone clicks through.

## References

- [Branch permissions](https://support.atlassian.com/bitbucket-cloud/docs/use-branch-permissions/)  
- [Merge checks](https://support.atlassian.com/bitbucket-cloud/docs/suggest-or-require-checks-before-a-merge/)  
- [Pull request and merge settings](https://support.atlassian.com/bitbucket-cloud/docs/pull-request-and-merge-settings/)  
- [Project branch restrictions](https://support.atlassian.com/bitbucket-cloud/docs/configure-a-projects-branch-restrictions/)  
- [Create a pull request](https://support.atlassian.com/bitbucket-cloud/docs/create-a-pull-request/)  
- [Bitbucket Cloud Premium](https://www.atlassian.com/software/bitbucket/premium)  
