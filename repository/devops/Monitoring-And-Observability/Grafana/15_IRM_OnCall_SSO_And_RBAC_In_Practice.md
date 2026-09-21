# 15 — IRM / OnCall, SSO, and RBAC in practice

[← Previous](./14_Provisioning_As_Code_And_GitOps.md) · [README](./README.md) · [Next →](./16_What_To_Enable_Next_And_When_Not.md)

## 1. Concepts — who wakes, who can dig

Concepts for alerting boundaries and access live in [08](./08_Alerting_Boundaries_And_Access_Model.md). This chapter is the **practice** path: wire **IRM/OnCall or [PagerDuty](../PagerDuty/README.md)**, turn on **SSO**, and roll **RBAC/folder permissions** without “everyone is Admin.”

| Layer | Practice job |
|-------|----------------|
| **Alert path** | One evaluator → one paging sink per symptom |
| **IRM / OnCall / PD** | Schedules, escalations, who wakes |
| **SSO** | Workforce identity; break-glass local only |
| **Teams / folders** | Ownership of boards and digs |
| **RBAC / LBAC** | Fine-grained and label-scoped query (Cloud/Enterprise) |

**Disconfirm:** IRM without alert hygiene. Prod PD before staging Slack. Everyone org Admin. LBAC as a substitute for Mimir/Loki tenant isolation.

**Confirm:** Staging page proven? Schedule + escalation exist? SSO group map documented? Folder owners named?

## 2. Advanced — IRM, SSO, and access depth

**IRM literacy (Grafana Cloud).** Grafana IRM (OnCall evolution) owns schedules, escalation chains, alert groups, incident workflows. Wire Grafana Alerting → **Grafana IRM** contact point (or Alertmanager → IRM/PD). IRM roles (Admin / Editor / Reader / OnCaller) are **separate** from org Viewer/Editor—responders ack without rewriting integrations.

**PagerDuty boundary.** PD (or IRM) decides **who/when**. Grafana/Prometheus decide **what**. One sink for pages; chat can get a parallel non-paging contact point ([PagerDuty](../PagerDuty/README.md), [10](../10_Alert_Hygiene_And_Burn_Rates.md)).

**SSO / LDAP.** Prefer SAML, OAuth/OIDC, Azure AD, Okta, … Auth is instance-wide across orgs. Map IdP groups → orgs/teams/roles so joiners/leavers are automatic. Keep one break-glass local Admin in the vault.

**RBAC rollout.** Inventory needs → fixed roles first → custom roles sparingly → assign to **teams**. Datasource permissions restrict Explore. LBAC filters one shared Loki/Prom/Tempo DS by team labels—not backend tenancy ([Mimir](../Mimir/README.md) · [Loki](../Loki/README.md)).

**Multi-org.** Prefer folders + teams + RBAC inside one org unless hard legal isolation. Alerts and contact points do not span orgs—people forget org context mid-incident.

**As-code.** Provision RBAC and folder permissions with the boards ([14](./14_Provisioning_As_Code_And_GitOps.md)).

## 3. Applications — wire pages and access

### A. Staging → paging sink

1. Confirm **one** page path for the symptom ([11](./11_Dashboards_Variables_And_First_Alert.md))—Grafana Alerting **or** Prometheus Alertmanager ([Prometheus/08](../Prometheus/08_Alerting_Rules_And_Alertmanager.md)).  
2. Labels: `severity=page`, `service`, `team`.  
3. Contact point → staging Slack; fire once; confirm single notification.  
4. Create IRM schedule + escalation **or** PD service + escalation policy **before** flipping prod.  
5. Add contact point type **Grafana IRM** or **PagerDuty**; test.  
6. Notification policy: `severity=page` → paging sink; `severity=ticket` → Slack/email only.  
7. Annotations: summary + runbook URL ([9](../9_Dashboards_Alerts_And_Pages.md)).  
8. Promote; keep chat from dual-paging.

### B. SSO + starter layout (single org)

1. Enable IdP; map groups (example below).  
2. Teams: one per service or platform crew.  
3. Folders: `checkout`, `platform`, `sre-shared`—team Edit on own folder, View elsewhere.  
4. Restrict datasource query permission to teams that need digs.  
5. Only alert Editors/Admins (or RBAC) change paging rules.  
6. Service accounts for CI/provisioning—migrate off legacy API keys ([14](./14_Provisioning_As_Code_And_GitOps.md)).  
7. Assign IRM **OnCaller** to responders—not org Admin.  
8. Inventory break-glass Admin; rotate password into vault.

| IdP group | Grafana outcome |
|-----------|-----------------|
| `grafana-viewers` | Org Viewer + team memberships |
| `grafana-editors` | Editor or RBAC on owned folders |
| `grafana-admins` | Short list of org Admins |
| `oncall-responders` | IRM OnCaller (Cloud) |

### C. When to add a second org / LBAC

| Signal | Action |
|--------|--------|
| Hard legal/customer isolation | New org or separate Cloud stack |
| Same company, product teams | Folders/teams first |
| Multi-team Explore on one DS | LBAC rules; test as team user |
| Sandbox experiments | Separate org/stack—never mix paging contact points |

| Pitfall | Fix |
|---------|-----|
| Duplicate Grafana + Prom pages | Delete one path; document winner ([08](./08_Alerting_Boundaries_And_Access_Model.md)) |
| IRM without schedule | Build schedule before contact point |
| Everyone Admin | Demote; folder Admin + RBAC |
| LBAC → empty Explore | Test as team member; version rules |
| Silence forever | Time-box; fix the rule |

**Staff checklist**

- One paging sink per symptom; staging tested  
- Schedule + escalation before first prod page  
- SSO group map in Git/runbook  
- Folder/team owners; no mass Admin  
- Service accounts for automation; break-glass inventoried  
- IRM/PD roles assigned separately from org Viewer  

## References

- [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/) · [Alerting and IRM](https://grafana.com/docs/grafana-cloud/alerting-and-irm/) · [RBAC](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/access-control/) · [SSO](https://grafana.com/docs/grafana/latest/setup-grafana/configure-access/)  
- [08 Boundaries](./08_Alerting_Boundaries_And_Access_Model.md) · [PagerDuty](../PagerDuty/README.md) · [10 Alert hygiene](../10_Alert_Hygiene_And_Burn_Rates.md) · [9 Pages](../9_Dashboards_Alerts_And_Pages.md)
