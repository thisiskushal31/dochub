# 02 — Groups, projects, and namespaces

[← Previous](./01_What_Is_GitLab.md) · [README](./README.md) · [Next: SCM and MRs →](./03_SCM_Merge_Requests_And_Code_Review.md)

## 1. Concepts

| Concept | Plain meaning |
|---------|----------------|
| **Project** | Repo + issues/MRs/CI/registry settings for one codebase (or more) |
| **Group** | Folder of projects (and subgroups) with shared permissions and often shared runners/variables |
| **Namespace** | URL/path owner — user or group path that owns projects |

CI inherits context from the project (and can use group/instance runners and variables). Permissions (Guest → Owner roles, plus custom roles on higher tiers) decide who can merge, run pipelines, or manage runners.

## 2. Advanced concepts

### Inheritance that affects CI

| Surface | Why it matters for pipelines |
|---------|------------------------------|
| Group runners | Shared compute across projects |
| Group/instance CI variables | Org defaults (careful with secrets) |
| Group security policies | May inject/require jobs (tier-aware) |
| Shared project access | Who can trigger protected pipelines |

### Organization patterns

| Pattern | Use when |
|---------|----------|
| Monorepo one project | Simple; use `rules:changes` |
| Group per product, project per service | Clear ownership; multi-project pipelines |
| Nested subgroups | Large orgs; deeper ACL trees |

### GitLab.com limits literacy

SaaS has free-user / push limits and compute-minute concepts — confirm current subscription and CI minutes docs; don’t hard-code folklore numbers into policy.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Shared CI standards | Group templates/components + group variables |
| Isolate prod deploy rights | Protected environments + role checks |
| Contractor access | Tight project membership; no group Owner |

**Good:** group structure mirrors ownership. **Bad:** flat hundreds of projects with duplicated variables and no runner strategy.

## References

- [Organize work with projects](https://docs.gitlab.com/user/project/organize_work_with_projects/)  
- [Groups](https://docs.gitlab.com/user/group/)  
- [Namespaces](https://docs.gitlab.com/user/namespace/)  
