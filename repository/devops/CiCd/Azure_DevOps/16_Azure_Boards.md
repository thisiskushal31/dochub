# 16 — Azure Boards

[← Previous](./15_Observability_Hooks_And_Non_Azure_Targets.md) · [README](./README.md) · [Next: Repos →](./17_Azure_Repos_Git_And_TFVC.md)

---

## 1. Concepts

**Azure Boards** tracks work: epics, features, user stories/issues, tasks, bugs — depending on process (Basic / Agile / Scrum / CMMI).

| Surface | Use |
|---------|-----|
| **Work items** | Unit of tracked work with state, assignee, area, iteration |
| **Boards** | Kanban columns by state |
| **Backlogs** | Prioritized lists |
| **Sprints / iterations** | Time-boxed delivery (Scrum/Agile) |
| **Queries / dashboards** | Reporting and personal views |

Link commits and PRs to work item IDs (`AB#123` / `#123` patterns) so delivery is traceable.

---

## 2. Advanced concepts

### Process choice

| Process | Lean toward |
|---------|-------------|
| Basic | Small teams; Issues + Tasks |
| Agile | Stories, features; common product teams |
| Scrum | Explicit bugs + sprint ceremonies |
| CMMI | Formal change/requirement tracking |

Inherited custom processes add fields without chaos — still change-control them.

### Scaling

Area paths and teams split one project into multiple boards. **Delivery Plans** / portfolio backlogs roll up features/epics across teams. Queries and dashboards ([25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md)) make status visible without spreadsheet exports.

Secure Boards data (who sees which area paths) when multi-tenant products share an org — see Microsoft’s Boards security guidance.

### Boards without Azure Repos

Fully valid: GitHub/GitLab for code, Boards for work, Pipelines for CI — use GitHub connections / AB# linking.

---

## 3. Applications and use cases

| Team | Pattern |
|------|---------|
| Product squad | Sprint board + PR links |
| Platform | Epics for paved-road work; separate area path |
| Compliance | Work item ↔ release evidence |

**Good:** Definition of Done includes pipeline green + work item Done. **Bad:** Boards as a graveyard of never-updated tasks.

---

## References

- [What is Azure Boards?](https://learn.microsoft.com/en-us/azure/devops/boards/get-started/what-is-azure-boards)  
- [About processes and process templates](https://learn.microsoft.com/en-us/azure/devops/boards/work-items/guidance/choose-process)  
- [Agile project management best practices](https://learn.microsoft.com/en-us/azure/devops/boards/best-practices-agile-project-management)  
- [Delivery Plans](https://learn.microsoft.com/en-us/azure/devops/boards/plans/review-team-plans)  
- [Link work items](https://learn.microsoft.com/en-us/azure/devops/boards/work-items/about-work-items)  
