# 04 — Planning and work items (literacy)

[← Previous](./03_SCM_Merge_Requests_And_Code_Review.md) · [README](./README.md) · [Next: CI core model →](./05_CI_Core_Model_Pipelines_Jobs_Stages.md)

## 1. Concepts

GitLab planning surfaces (issues, epics, boards, milestones, iterations, work items, OKRs on some tiers) sit **beside** delivery — they are not CI. This chapter is a **door**: enough to navigate and link MRs/pipelines to work, not a project-management course.

Typical loop: issue/epic → MR → pipeline → deploy → close work item.

## 2. Advanced concepts

| Surface | Literacy point |
|---------|----------------|
| Issues / work items | Unit of planned work; labels; assignees |
| Epics | Roll-up (tier-aware) |
| Boards | Workflow columns |
| Milestones / iterations | Timeboxes |
| Requirements / test cases | Traceability features where licensed |
| Analytics | Value stream / productivity views — confirm tier |

Planning features vary heavily by **Premium/Ultimate**. Treat docs cards as the source of truth.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Trace deploy to intent | MR description closes issue; env deployment links commit |
| Platform squad | Don’t rebuild Jira inside GitLab unless the org commits |

**Good:** thin planning in GitLab if code already lives here. **Bad:** forcing every PMO process into GitLab when the org’s system of record is elsewhere.

## References

- [Plan and track work](https://docs.gitlab.com/topics/plan_and_track/)  
- [Issues](https://docs.gitlab.com/user/project/issues/)  
- [Epics](https://docs.gitlab.com/user/group/epics/)  
