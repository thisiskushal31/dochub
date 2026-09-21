# 10 — Health rules, policies, and alerting

[← Previous](./09_Database_Visibility_Literacy.md) · [README](./README.md) · [Next →](./11_Analytics_And_Log_Literacy.md)

## 1. Concepts — detect → policy → action → page

AppDynamics **Alert & Respond** separates three objects:

| Object | Job |
|--------|-----|
| **Health rule** | Condition on metrics/entities (BT, tier/node, overall app, databases, …) → Critical / Warning / Normal / Unknown |
| **Policy** | Which **events** (health-rule open/close, slow/error, anomaly, …) fire which **actions** |
| **Action** | Email, SMS, HTTP request, script, diagnostics, custom — including [PagerDuty](../PagerDuty/README.md) via HTTP templates |

```text
Health rule violates → event (start/end/warn↔crit)
        ↓
   matching Policy
        ↓
     Action(s) → PagerDuty / chat / email digest
```

**Create order.** Health rules first → reusable actions (HTTP template) → policy that binds violation events to those actions. Policies without a pre-created action are silent red.

**Business-transaction health rules** are the default reliability path: error rate, average response, stall—scoped to golden BTs ([05](./05_Business_Transactions.md), [14](./14_Worked_Example_First_Service.md)). Default “everything red” rules create storms.

**Flow:** Health rule violates → event → matching policy → action. AppDynamics is **not** the incident router—PagerDuty/chat owns who wakes ([parent 9](../9_Dashboards_Alerts_And_Pages.md), [parent 10](../10_Alert_Hygiene_And_Burn_Rates.md)).

**Databases.** Same Alert & Respond pattern under Databases / DB Agent health ([09](./09_Database_Visibility_Literacy.md)).

**Disconfirm:** Email-only “pages.” Critical on every auto-detected BT. Policies without owners. AppD replaces PagerDuty.

**Confirm:** Symptom-first thresholds? Staging policy tested before prod? Action lands with runbook / deep link?

## 2. Advanced — Warning/Critical, storms, suppression, PagerDuty hygiene

**Warning vs Critical.** Critical and Warning panels are configured the same way, but **critical conditions evaluate first**. If both are defined on one rule, Warning runs only when Critical is **not** true. Tune so Critical pages and Warning digests/chat. Statuses also include Normal and Unknown; “no data” evaluation can be forced to Critical/Warning/Unknown/Healthy—choose deliberately for agent-offline cases (agent-availability metrics are a known false-positive trap).

**Persistence / evaluation windows.** Persistence thresholds (“N times in the last M minutes”) require evaluation time frames of **30 minutes or less**. Short windows without persistence create deploy storms; over-long windows hide Sev1s. Baseline comparisons can skip when load samples are tiny—quiet staging may not fire like prod.

**Alert storms.** Causes: too many BTs under one rule; node-level rules that fan out on scale-out; Continues Critical without hysteresis; OOTB rules left critical. Mitigate: scope to named BTs; require duration/persistence; **Action Suppression** for maintenance; optional **Execute actions in batch**—do not combine batching with HTTP template **One Request Per Event** under high event volume (Controller performance caution).

**HTTP / PagerDuty hygiene.** Prefer official HTTP Request Templates (PagerDuty, Slack, Opsgenie, Teams). For PagerDuty: store `pd_integration_key` as a template variable (not git); use `trigger` / `resolve` via `pd_event_type`; stable `incident_key` so opens/closes correlate; POST to Events API; expect HTTP 200; **One Request Per Event** when not batching. Include Controller deep links in the payload. Test the template before prod policies ([16](./16_API_Automation_And_RBAC.md)).

**Action suppression.** Temporarily suppress policy actions during maintenance (`Alert & Respond → Actions → Action Suppression`). Scope by application, databases, or servers. Optionally disable metric reporting—expect metric shape changes if on. Review open suppressions weekly. Health Rule Suppression is related but distinct—know which you used.

**Policy trigger literacy.** Bind OPEN_CRITICAL (and resolve) deliberately. Object scope must match health-rule entities or the policy never fires. OPEN_CRITICAL without resolve leaves PagerDuty forever open.

**Anomaly events.** Useful as insight; secondary until baselines are trusted. Do not page solely on anomaly open without runbooks.

**Email digests vs pages.** Digests for morning readers; paging actions few, owned, tested. Mixing FYI and wake-someone in one policy blurs severity.

**Entity scope literacy.** Overall application rules hide which BT hurt; node-level hardware rules fan out on autoscaling. Prefer BT/tier scopes for user-symptom pages.

**As-code.** Health Rule / Policy / Actions / Action Suppression APIs migrate rules after one UI success. Drift between click-ops and automation causes “who deleted the page?” ([16](./16_API_Automation_And_RBAC.md)).

**Vs Datadog monitors / Elastic rules.** Same hygiene: owners, symptom-first, test channel first ([Datadog](../Datadog/README.md), [Elastic](../Elastic/09_Alerting_SLOs_And_Incident_Management.md)). Map AppD Critical → PagerDuty severity deliberately ([PagerDuty](../PagerDuty/README.md)).

### Failure modes

| Failure | What you see |
|---------|----------------|
| Policy missing action | Red health, silent on-call |
| Broad BT scope | Hundreds of emails on deploy |
| Continues Critical every minute | Fatigue |
| Prod page before staging drill | False confidence ([14](./14_Worked_Example_First_Service.md)) |
| Shared inbox as “on-call” | No acknowledgment |
| Forever-open suppression | Sev1 muted |
| Integration key in git | Compromised PagerDuty service |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| First page | One BT error-rate health rule → policy OPEN_CRITICAL → PagerDuty test service |
| Warning vs page | Warning → chat digest; Critical → PagerDuty only |
| Deploy windows | Action suppression scheduled around known freezes |
| Database | Wait/CPU health rule on one collector; page DBA rota only |
| Noise cut | Disable OOTB rules you will not own; keep a short allowlist |
| Migration | Export/recreate health rules via API between Controllers |

**Good:** one golden-BT critical rule → one PagerDuty action → runbook deep link. **Bad:** default templates left critical on every auto-detected BT.

**Staff checklist**

1. Every paging policy has an owner and a tested action.  
2. Test channel / PagerDuty service before prod.  
3. Suppression runbook + weekly open-suppression review.  
4. Quarterly delete unused rules; disable unowned OOTB rules.  
5. PagerDuty keys in vault; stable incident_key + resolve path.  
6. Burn-rate / SLO thinking beside AppD ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md))—health rules ≠ SLOs alone.

**Policy structure literacy.** Alert and Respond is health rule → event → policy → action. Creating a red health rule without a policy is a dashboard color, not a page. Creating a policy without an action is a silent red.

## References

- [Health Rules](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/health-rules) · [Configure Health Rule Evaluation Criteria](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/configure-health-rules/configure-health-rule-evaluation-criteria) · [Create and Configure Conditions](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/configure-health-rules/create-and-configure-conditions) · [Configure Policies](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/policies/configure-policies) · [Action Suppression](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/actions/action-suppression) · [Create a Template for PagerDuty](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/actions/http-request-actions-and-templates/create-a-template-for-pagerduty)  
- [Alert and Respond API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/alert-and-respond-api) · [Health Rule API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/alert-and-respond-api/health-rule-api) · [Policy API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/alert-and-respond-api/policy-api) · [Database Health Rules and Alerts](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/monitor-databases-and-database-servers/database-health-rules-and-alerts)  
- [PagerDuty](../PagerDuty/README.md) · [14 Worked example](./14_Worked_Example_First_Service.md) · [Elastic alerting](../Elastic/09_Alerting_SLOs_And_Incident_Management.md)
