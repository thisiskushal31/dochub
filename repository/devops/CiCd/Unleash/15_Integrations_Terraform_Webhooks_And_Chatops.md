# 15 — Integrations: Terraform, webhooks, and ChatOps

[← Previous](./14_Impression_Analytics_Impact_And_Playground.md) · [README](./README.md) · [Next: AI assistants and MCP →](./16_AI_Assistants_MCP_And_Assisted_Delivery.md)

---

## 1. Concepts

Unleash integrates in two directions:

1. **Outbound** — Unleash posts when flags/events change (webhooks, Slack, Teams, Datadog, …).  
2. **Inbound / bidirectional** — other systems drive or mirror Unleash (Jira Cloud plugin, ServiceNow CR tracking, Terraform provider, Signals).

Official surface includes Datadog, Jira Cloud, Microsoft Teams workflows, ServiceNow, Slack app, generic **webhook**, plus **Terraform** for instance bootstrap. Community plugins exist; treat them as third-party risk.

**Integration events** log outbound executions so you can see delivery failures without guessing in Slack.

### ChatOps

Post flag changes to channels your responders already watch ([CiCd/16](../16_Notifications_Webhooks_And_ChatOps.md)). Prefer filtered topics (prod only, or tagged projects) over every draft strategy edit.

### Terraform

The Unleash Terraform provider is for **platform setup**: projects, environments, API tokens, users/roles, SSO wiring, context fields, project access and change-request config — reviewed in PR like other platform config. It is **not** the path for day-to-day feature flags (those stay short-lived in the Admin UI / Admin API / MCP). Pair provider credentials with **service accounts** ([11](./11_API_Tokens_Keys_And_Service_Accounts.md)).

---

## 2. Advanced concepts

### Webhooks vs Signals/Actions

Webhooks notify external systems. **Signals** accept POSTs into Unleash; **Actions** mutate flags/environments in response ([13](./13_Change_Requests_Release_Management_And_Governance.md)). For “page → disable flag,” prefer Signal→Action (or Admin API from a runbook bot) over humans clicking under stress.

### Jira and ticket linkage

Jira Cloud integration ties issues to flags so product and engineering share one narrative. Do not invent a second shadow tracker in spreadsheets.

### Developer Toolbar

Toolbar literacy: local/dev visibility into flag state while building — not a production control plane.

### Drift

Terraform owns bootstrap and access. Flag strategy edits belong in UI/CR (or Admin API automation). Do not invent a parallel “flags-as-code forever” model that fights Unleash’s short-lived-flag guidance.

### Event-driven cleanup

Stale-flag events can open PRs or break builds via webhook ([20](./20_Best_Practices_And_When_Not_Unleash.md)) — wire carefully so noise does not train people to ignore chat.

### ChatOps risk

Slack/Teams “enable flag” bots are powerful. Require prod path through change requests / break-glass roles — not unrestricted workspace commands.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Prod change awareness | Slack/Teams on production environment events |
| IaC baseline | Terraform for projects, envs, tokens, SSO — not ephemeral flags |
| Incident kill switch | Signal from alertmanager → Action disable |
| Audit in ITSM | ServiceNow CR sync |
| Observability correlate | Datadog events alongside deploy markers |

**Staff checklist**

- Outbound integrations use dedicated tokens; secrets in a vault  
- Integration events monitored for failures  
- Terraform owns bootstrap; UI/CR owns short-lived flags  
- Chat channels filtered; on-call not flooded by lab flags  
- Webhook destinations authenticated and TLS  
- Chatops cannot silently 100% prod  

**Good:** ChatOps for awareness + CR for authority. **Bad:** chatbot with Admin token that toggles prod from any message.

---

## References

- [Integrations](https://docs.getunleash.io/integrate/integrations)  
- [Webhook](https://docs.getunleash.io/integrate/webhook)  
- [Terraform](https://docs.getunleash.io/integrate/terraform)  
- [Slack app](https://docs.getunleash.io/integrate/slack-app)  
- [Datadog](https://docs.getunleash.io/integrate/datadog)  
- [ServiceNow](https://docs.getunleash.io/integrate/servicenow)  
