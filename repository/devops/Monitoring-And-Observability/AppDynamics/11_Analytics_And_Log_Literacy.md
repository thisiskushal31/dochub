# 11 — Analytics and log literacy

[← Previous](./10_Health_Rules_Policies_And_Alerting.md) · [README](./README.md) · [Next →](./12_OpenTelemetry_To_AppDynamics.md)

## 1. Concepts — Analytics is not your only log plane

**Application Analytics** (Transaction Analytics, Log Analytics, Browser/Mobile/Synthetic Analytics where licensed) indexes **events** for ad-hoc ADQL search, funnels, Business Journeys, Experience Levels, and metrics from scheduled searches. It is built on the platform **Events Service** (document store). It supplements APM snapshots—it does **not** replace a deliberate full-text log strategy such as [Loki](../Loki/README.md), [Elastic](../Elastic/README.md), or cloud log stores.

| Source | What you get |
|--------|----------------|
| Transaction Analytics | BT-level event fields for business/ops queries |
| Log Analytics | Structured/semi-structured logs via Analytics Agent / collectors (or agentless paths where documented) |
| Browser / Mobile Analytics | EUM-adjacent session/event analysis ([08](./08_EUM_Browser_And_Mobile.md)) |
| Custom events API | Your publishers → Events Service (metered; needs Transaction Analytics licensing) |
| Scheduled Analytics → metric | Search runs on a schedule → Metric Browser → health rules ([10](./10_Health_Rules_Policies_And_Alerting.md)) |

**Plain language:** Use Analytics when you need AppD-correlated business or transaction questions in the same Controller UX. Keep a **primary** log plane for long retention, compliance search, and cheap high-volume debug—then correlate with BT/GUID/node ids.

**Licenses.** Transaction Summary widgets need at least one Analytics-enabled application and active Transaction Analytics licenses. EUM Analytics widgets need matching Browser/Mobile Analytics enablement. Expired Transaction Analytics licenses stop new ingest while historical widgets may still show old data.

**Permissions.** Analytics RBAC is separate from “can see the application”: grant transaction/log Analytics scopes deliberately ([16](./16_API_Automation_And_RBAC.md)).

**Disconfirm:** “We turned on Log Analytics” ⇒ retired Elastic/Loki. Shipping every container line into Analytics day one. Custom events without a license/volume plan. Analytics as SIEM.

**Confirm:** Primary log plane named? Analytics only for fields you will query? API keys least-privilege per event type?

## 2. Advanced — Events Service, metrics, security, when not

**Events Service vs Controller APIs.** Analytics Events API uses `X-Events-API-AccountName` / `X-Events-API-Key`—not Controller basic-auth or OAuth REST ([16](./16_API_Automation_And_RBAC.md)). Custom event volume is metered like transaction analytics units. Schema sprawl burns cost and slows searches. On-prem Controllers make Events Service disk a first-class ops concern ([13](./13_Operations_License_And_Pitfalls.md)).

**Create metrics from searches.** Useful for SLI-ish signals that are not native BT metrics—then alert via health rules. Disable metrics stuck in “Disabled due to repetitive failures”; delete only when consumer count is zero. Treat scheduled-search → metric → page as a production pipeline: owner, failure mode, disable path.

**ADQL / dig UX.** Analytics Home widgets are fixed ADQL; digs live in Searches. Empty widgets usually mean missing license, missing enablement, or RBAC—not “Events Service is down” by default.

**Data security.** Scrub PII before ingest; limit who can query logs vs transactions; rotate Analytics API keys. Do not put account name + API key pairs in git. Analytics and Data Security permissions are the control plane.

**Correlation literacy.** Prefer stable identifiers (request GUID, BT id, node id) shared with your primary log plane ([parent 21](../21_Correlation_And_Dig_Methodology.md)). Splunk Log Observer Connect–style bridges (where used) enrich logs with AppD context; they still assume a Splunk/log strategy.

**Analytics Agent placement.** Another agent class to upgrade and size—budget CPU/disk beside app and machine agents ([13](./13_Operations_License_And_Pitfalls.md)). Prefer structured JSON at the source. Monitor Analytics Agent health when you deploy agents. Agentless paths exist for some sources—read the deploy guide for your shape.

### What to put where

| Workload | Prefer |
|----------|--------|
| Hot path debug + compliance retention | Primary log plane (Elastic/Loki/cloud) |
| Business funnels / BT-field questions | Transaction Analytics |
| Ad-hoc “grep production” across every microservice | Not Analytics alone |
| Org-wide SIEM / threat hunting | Security product—not Analytics |

**Browser / Mobile Analytics.** Only after EUM is intentional ([08](./08_EUM_Browser_And_Mobile.md)); do not enable “because the checkbox exists.”

**Vs Elastic / Loki / Datadog Logs.** Elastic Discover and Loki LogQL remain better fits for org-wide log platforms; AppD Analytics is the **APM-adjacent** slice ([Elastic](../Elastic/README.md), [Loki](../Loki/README.md), [Datadog](../Datadog/README.md)).

### Failure modes

| Failure | What you see |
|---------|----------------|
| No Transaction Analytics license | Custom publish fails / empty UX |
| Unbounded custom schemas | Cost + slow searches |
| Analytics-only retention hope | Compliance gap vs primary store |
| Over-permissioned Analytics roles | Data leak surface |
| Metric from flappy search | Noise pages |
| Confused Controller vs Events credentials | One API works, the other 401s |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| Business dig | Transaction Analytics on checkout fields; dashboard + one health rule metric |
| App-correlated logs | Log Analytics for app tiers you already APM; keep platform logs in Elastic/Loki |
| Custom KPI | Events API → scheduled metric → health rule → PagerDuty |
| Security baseline | Analytics data security permissions reviewed with platform RBAC ([16](./16_API_Automation_And_RBAC.md)) |
| Cost control | Sample/filter at Analytics Agent; drop debug in prod |
| Kill criteria | Disable Log Analytics ingest if primary plane already answers digs cheaper |

**Good:** Analytics for named BT/business questions; Elastic/Loki for estate logs. **Bad:** shipping debug volume into Analytics to “centralize everything.”

**Staff checklist**

1. Primary log plane documented (Elastic/Loki/cloud).  
2. Analytics license owner; scrubbing policy written.  
3. API keys in secrets manager; Events vs Controller credential literacy.  
4. No “Analytics replaces SIEM/logs” claim in runbooks.  
5. Correlation ids shared across planes.  
6. Kill criteria for Log Analytics volume ([15](./15_What_To_Enable_Next_And_When_Not.md)).

**When not (summary).** If Elastic/Loki already answers digs and compliance, do not enable Log Analytics to “centralize everything.” If you only need BT error rate pages, Transaction Analytics can wait ([15](./15_What_To_Enable_Next_And_When_Not.md)).

**Deploy path literacy.** Plan Analytics Agent vs without-agent deploy shapes from the Analytics hub before inventing a third shipper. Upgrade paths and job-file → source-rule migrations are real ops work—budget them ([13](./13_Operations_License_And_Pitfalls.md)).

## References

- [Overview of Analytics](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0/analytics/overview-of-analytics) · [Analytics hub](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0) · [Analytics and Data Security](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0/analytics/deploy-analytics-with-the-analytics-agent/analytics-and-data-security) · [Create Analytics Metrics From Scheduled Queries](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0/analytics/using-analytics-data/create-analytics-metrics-from-scheduled-queries)  
- [Analytics Events API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/analytics-events-api)  
- [Elastic](../Elastic/README.md) · [Loki](../Loki/README.md) · [16 API / RBAC](./16_API_Automation_And_RBAC.md) · [08 EUM](./08_EUM_Browser_And_Mobile.md)
