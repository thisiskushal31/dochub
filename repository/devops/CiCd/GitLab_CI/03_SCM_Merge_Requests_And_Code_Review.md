# 03 — SCM, merge requests, and code review

[← Previous](./02_Groups_Projects_And_Namespaces.md) · [README](./README.md) · [Next: Planning →](./04_Planning_And_Work_Items_Literacy.md)

## 1. Concepts

GitLab hosts **Git** repositories. The change vehicle is the **merge request (MR)** — review, discussion, approvals, and often **MR pipelines** that must pass before merge.

CI connects here:

- Pipelines on branch push and/or MR events  
- **Merged results** / **merge train** behaviors (tier/features vary)  
- Required status checks via MR merge checks  
- Protected branches + protected variables/environments

```text
branch push / MR update
  → pipeline
  → checks on MR
  → merge (if rules allow)
```

## 2. Advanced concepts

### Protection that CI must respect

| Control | Effect |
|---------|--------|
| Protected branches | Who can push/merge; which runners/variables qualify as protected |
| CODEOWNERS / approval rules | Human gates beside CI (tier-aware options exist) |
| Push rules / commit rules | Policy on history (Self-Managed/settings) |

### MR pipeline types (preview)

Merge request pipelines, merged results pipelines, and merge trains change *what* is tested relative to the target branch — detail in [08](./08_Rules_Workflow_And_Pipeline_Types.md).

### External repos

GitLab can run CI for some external repositories (e.g. GitHub integration patterns) — literacy when code isn’t in GitLab ([26](./26_Migrate_Plans_And_Extras.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Block bad merges | MR pipelines + merge when pipeline succeeds |
| Protect prod branch | Protected branch + protected env vars |
| Fast feedback | Path rules so monorepo MRs don’t run the world |

**Good:** CI status is a merge input, not a surprise after merge. **Bad:** unprotected variables readable from feature-branch pipelines that anyone can push.

## References

- [Merge requests](https://docs.gitlab.com/user/project/merge_requests/)  
- [Protected branches](https://docs.gitlab.com/user/project/repository/branches/protected/)  
- [Manage your code](https://docs.gitlab.com/topics/manage_code/)  
- [Merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/)  
