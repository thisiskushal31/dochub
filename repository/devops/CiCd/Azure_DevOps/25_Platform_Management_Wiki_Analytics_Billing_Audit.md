# 25 — Platform management: wiki, analytics, notifications, billing, audit

[← Previous](./24_Troubleshooting_And_Staff_Checklist.md) · [README](./README.md)

---

## 1. Concepts

Beyond the five named services, Azure DevOps includes **cross-cutting platform surfaces** every org admin and tech lead should know:

| Surface | Job |
|---------|-----|
| **Wiki** | Project (or code) wiki for living docs |
| **Dashboards** | Widgets for Boards, Pipelines, Test, Analytics |
| **Analytics** | Reporting store; widgets, in-context reports, Power BI / OData |
| **Notifications** | Email / teams alerts on work, PRs, builds |
| **Service hooks** | Outbound webhooks to Slack, Teams, Grafana, custom apps |
| **Search** | Code and work item search across the project/org |
| **Request feedback** | Stakeholder feedback on work items / builds |
| **Billing & licensing** | Users, Basic vs Stakeholder, Test Plans, parallel jobs, Advanced Security SKUs |
| **Auditing** | Org audit stream for security-relevant events |
| **REST / CLI / integrate** | Automate org ops; prefer Entra tokens over PATs |

These are part of “what Azure DevOps offers,” not optional footnotes.

---

## 2. Advanced concepts

### Wiki

- **Project wiki** for onboarding, runbooks, DoD.  
- **Code wiki** (markdown in a repo) when docs must PR-review like code.  
- Permissions are object-level — treat wiki like any other shared surface ([19](./19_Security_Permissions_And_Service_Connections.md)).

### Dashboards and Analytics

Analytics powers modern reporting (replacing older warehouse patterns on Services). Use:

- Built-in widgets and in-context charts  
- Power BI connector / OData for custom reports  

**Query hygiene:** select only needed fields; preview with small `$top` / aggregates; avoid org-wide expensive queries in hot dashboards ([Analytics best practices](https://learn.microsoft.com/en-us/azure/devops/report/analytics/analytics-best-practices)).

### Notifications and service hooks

Prefer **team-level** notification subscriptions over every user inventing filters. Service hooks for ChatOps ([CiCd/16](../16_Notifications_Webhooks_And_ChatOps.md)) — don’t page humans on every CI flake.

### Request feedback

Stakeholders can be asked for **feedback** on features/builds without full contributor access — useful with Stakeholder access levels. Keep the loop tied to a work item and a known build id.

### Billing and capacity

- Access levels drive Test Plans and some features ([02](./02_Organization_Project_Process_And_Access.md)).  
- **Parallel jobs** cap concurrent pipeline work — plan hosted vs self-hosted cost.  
- **GitHub Advanced Security for Azure DevOps** (secret / dependency / code scanning) is a licensed add-on — enable deliberately ([19](./19_Security_Permissions_And_Service_Connections.md)).

### Auditing

Enable and export **audit logs** for who changed permissions, pipelines, service connections. Retain per compliance. Review after incidents.

### Automation API

Use Azure DevOps REST API + `az devops` for project scaffolding, policy as code, and inventory. Prefer **Microsoft Entra** auth over long-lived PATs; if PATs remain, scope tightly and rotate ([19](./19_Security_Permissions_And_Service_Connections.md)).

### Extra deploy targets (literacy)

Pipelines also documents targets such as **Azure SQL** deployments and **Azure Stack** estates — same pattern as other Azure tasks: service connection → task/script → environment gate. Add to your spectrum table when those estates exist ([21](./21_Best_Practices_And_Delivery_Spectrum.md)).

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| New engineer day-one | Wiki + dashboard with build health |
| Exec reporting | Analytics → Power BI, not spreadsheet exports forever |
| Compliance | Audit export + permission reviews quarterly |
| Cost control | Right-size parallel jobs; retire unused Advanced Security repos |

**Good:** one platform team owns org policies, billing alerts, and audit sinks. **Bad:** every project invents dashboards and PAT sprawl.

---

## References

- [Project wiki](https://learn.microsoft.com/en-us/azure/devops/project/wiki/wiki-create-repo)  
- [About dashboards](https://learn.microsoft.com/en-us/azure/devops/report/dashboards/overview)  
- [What is Analytics?](https://learn.microsoft.com/en-us/azure/devops/report/powerbi/what-is-analytics)  
- [Analytics best practices](https://learn.microsoft.com/en-us/azure/devops/report/analytics/analytics-best-practices)  
- [Notifications](https://learn.microsoft.com/en-us/azure/devops/notifications/about-notifications)  
- [Service hooks](https://learn.microsoft.com/en-us/azure/devops/service-hooks/overview)  
- [Auditing](https://learn.microsoft.com/en-us/azure/devops/organizations/audit/azure-devops-auditing)  
- [Billing overview](https://learn.microsoft.com/en-us/azure/devops/organizations/billing/overview)  
- [Get feedback](https://learn.microsoft.com/en-us/azure/devops/project/feedback/get-feedback)  
- [REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/)  
