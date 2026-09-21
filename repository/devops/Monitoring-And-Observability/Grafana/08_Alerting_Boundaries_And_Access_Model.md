# 08 — Alerting boundaries and access model

[← Previous](./07_Explore_Correlation_And_Dashboard_Model.md) · [README](./README.md) · [Next →](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md)

## 1. Concepts — who pages, who can see

Two boundaries matter early: **where alerts fire** and **who can access what** in Grafana. Full SSO/IRM how-to waits for [15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md); first alert wiring is [11](./11_Dashboards_Variables_And_First_Alert.md).

**Plain language:** Pick **one page path per symptom**. Folders and roles keep digs usable; they are not a substitute for backend ACLs.

### Page-path boundary

| Path | Typical owner | Fit |
|------|---------------|-----|
| **Prometheus / Mimir + Alertmanager** | Platform / metrics SRE | Prom-native estates; recording rules already there |
| **Grafana Alerting** | Teams living in Grafana | Multi-datasource rules; Cloud UX |
| **Both for same symptom** | Nobody happy | Duplicate pages—refuse |

Pages often land in Slack/email/[PagerDuty](../PagerDuty/README.md)—Grafana/AM notify; PagerDuty routes ([parent 9](../9_Dashboards_Alerts_And_Pages.md)).

### Access model literacy

| Concept | Job |
|---------|-----|
| **Org** | Hard tenancy boundary |
| **Team** | Group users for folder/dashboard permissions |
| **Role** (Viewer / Editor / Admin …) | Coarse power |
| **Folder permissions** | Who edits service boards |
| **Datasource permissions** (Enterprise/Cloud) | Who may query a store |
| **RBAC** (finer, licensed tiers) | Action-level grants—practice in [15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) |
| **Service accounts** | Automation tokens—not shared human Admin passwords |

**Disconfirm:** Grafana Alerting *and* Alertmanager paging the same burn ≠ HA. Viewer role ≠ safe on sensitive SQL datasources. More Admin users ≠ faster incidents. Buying OnCall ≠ alert quality.

**Confirm:** One page path per symptom class? Who is Admin? Folder owners? Where do pages go (PagerDuty?)? Datasource service-user least privilege?

## 2. Advanced — dual-home, notification policy, tenancy

**Dual-home trap.** Migrating from AM to Grafana Alerting (or reverse) without a freeze window doubles noise. Cut over by rule class with an explicit mute on the old path.

**Notification policies / routing.** Grouping, timing, and silence hygiene matter as much as the threshold—conceptually the same job as Alertmanager routes. Bad grouping pages the whole company for one pod flap.

**Grafana-managed vs datasource-managed rules.** Know which engine evaluates the rule; don’t mix ownership stories without a diagram.

**IRM / OnCall.** Scheduling and escalation are adjacent products—enable after the dig loop works ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md), [16](./16_What_To_Enable_Next_And_When_Not.md)).

**Multi-org vs folders.** Orgs split blast radius and also split alert/datasource admin. Prefer folders until compliance demands org split ([02](./02_Architecture_UI_Datasources_And_Plugins.md)).

**Backend auth ≠ Grafana auth.** Grafana Viewer can still see whatever the datasource credentials allow if the proxy uses a powerful service account—design datasource users carefully.

**Failure modes**

| Failure | Symptom |
|---------|---------|
| Dual-home migrate | Two pages per burn; people silence everything |
| Broad Editor on General | Dashboard thrash; mystery rule edits |
| Powerful DS credentials | “Viewer” still dumps prod DB via SQL plugin |
| No runbook link | Page with nowhere to dig ([07](./07_Explore_Correlation_And_Dashboard_Model.md)) |

## 3. Applications — decide before you click

| Decision | Write it down |
|----------|---------------|
| Metrics pages | Grafana Alerting **or** Prometheus AM—not both |
| Log/trace-based pages | Usually Grafana Alerting (or don’t page on raw logs yet) |
| On-call destination | PagerDuty/Slack owner + escalate policy |
| Access | Default Viewer; Editors on team folders; few Admins |
| Sensitive DS | Separate credentials + permissions |
| Automation | Service accounts with scoped tokens ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)) |

**Anti-patterns**

- Alerting before one Explore dig works.  
- Org-per-team sprawl without a tenancy reason.  
- Treating RBAC as a substitute for collector/backend ACLs.

**Staff checklist**

- Page-path ADR one paragraph  
- Critical symptoms mapped to one notifier path  
- Folder owners named  
- Admin account inventory  
- Datasource credential least privilege reviewed  
- IRM/SSO deep work scheduled after first dig ([11](./11_Dashboards_Variables_And_First_Alert.md), [15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md))  
- PagerDuty (or equivalent) as router—not a second metrics DB  

## References

- [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/) · [Roles and permissions](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/) · [RBAC](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/access-control/) · [User management](https://grafana.com/docs/grafana/latest/administration/user-management/) · [Service accounts](https://grafana.com/docs/grafana/latest/administration/service-accounts/)  
- [Grafana Cloud Alerting & IRM](https://grafana.com/docs/grafana-cloud/alerting-and-irm/) · [PagerDuty](../PagerDuty/README.md) · [11 First alert](./11_Dashboards_Variables_And_First_Alert.md) · [15 IRM/SSO/RBAC](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)
