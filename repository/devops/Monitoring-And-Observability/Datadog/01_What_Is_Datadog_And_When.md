# 01 — What is Datadog and when

[← README](./README.md) · [Next →](./02_Architecture_Agent_And_Data_Plane.md)

## 1. Concepts

Datadog is an **observability platform**: many products (metrics, logs, APM, RUM, synthetics, security, CI, …) that you can use alone or together. For day-to-day reliability work, the spine is:

| You need | Datadog gives you |
|----------|-------------------|
| Host / container health | Agent + Infrastructure |
| App latency / errors / deps | APM (tracing) |
| “What did this request log?” | Log Management (correlated by tags / trace id) |
| “Did checkout work from outside?” | Synthetics |
| “What did real users hit?” | RUM (+ optional Session Replay) |
| Wake a human | Monitors → notification / [PagerDuty](../PagerDuty/README.md) |
| Track a target | SLOs |

Hundreds of **integrations** layer the same UI over AWS, Kubernetes, databases, and more.

**Plain language:** You rent the glass cockpit. You still own SLIs, tag discipline, and page hygiene ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md), [9](../9_Dashboards_Alerts_And_Pages.md)).

### When it fits / when it doesn’t

| Fit | Usually not |
|-----|-------------|
| Need one UI across infra + APM + logs quickly | Must own PromQL + self-hosted LGTM as the skill path |
| Platform team is small | Finance won’t fund SaaS at your tag/ingest volume |
| Org already bought Datadog | Only need cloud provider audit/compliance logs |

**Disconfirm:** Buying Datadog ≠ having SLOs. The Datadog UI ≠ CloudTrail / Activity logs ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

**Confirm:** Who pays the bill? Who owns the Agent fleet? Where do pages go?

## 2. Advanced

Pick your **Datadog site** (e.g. `datadoghq.com`, `datadoghq.eu`) up front—API keys and Agent `site` / `DD_SITE` must match, or intake fails with “invalid API key.”

Multi-org vs single-org, Teams, and RBAC matter once more than one product team shares an account ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

## 3. Applications — what to do first

1. Create account → copy **API key** → note **site**.  
2. Install Agent on one host or a K8s cluster ([03](./03_Install_Host_Container_And_Kubernetes.md)).  
3. Confirm `datadog.agent.running` in Metrics Summary.  
4. Add unified tags, then APM for one service ([13](./13_Worked_Example_First_Service.md)).

## References

- [Getting started](https://docs.datadoghq.com/getting_started/) · [Datadog sites](https://docs.datadoghq.com/getting_started/site/)  
- [02 Architecture](./02_Architecture_Agent_And_Data_Plane.md)
