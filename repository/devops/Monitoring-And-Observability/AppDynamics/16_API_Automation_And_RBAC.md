# 16 — API, automation, and RBAC

[← Previous](./15_What_To_Enable_Next_And_When_Not.md) · [README](./README.md)

## 1. Concepts — operate the Controller as a platform

Everything earlier becomes unsafe at scale without **Controller REST**, **API Clients / OAuth**, **CLI literacy**, and **RBAC**. This chapter is how you administer AppDynamics—not a second APM product.

### Authentication literacy

| Mechanism | Use |
|-----------|-----|
| **Basic HTTP** (`user@account:password`) | Classic Controller REST from scripts; **not** for Cisco IdP–only logins |
| **API Clients + OAuth tokens** | Preferred secure automation identity (`Authorization: Bearer …`); Account Owner / Administer permission to create clients |
| **Analytics Events API keys** | Events Service only—`X-Events-API-AccountName` + `X-Events-API-Key` ([11](./11_Analytics_And_Log_Literacy.md)) |
| **Agent / OTel access keys** | Agents and OTel ingest—not for editing health rules |

Never put **account name**, access keys, client secrets, or OAuth tokens in git or chat. Secrets manager + rotation runbook. Invalid characters in usernames/passwords can break basic auth—prefer API Clients for automation.

### Controller REST surface (high-signal)

Base URI (typical): `https://<controller>/controller/rest/<REST_URI>` (same primary port as UI/agents). Prefer `?output=JSON`. Do **not** paste Metric Browser REST URLs into a browser—programmatic/CLI only.

| API family | Examples |
|------------|----------|
| Application Model / Metric & Snapshot | Inventory, metric queries (Metric Browser can copy REST URLs for CLI use) |
| Alert and Respond | Health rules, policies, actions, suppressions, schedules ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| Configuration import/export | Move config between apps/Controllers |
| Database Visibility | Collectors CRUD ([09](./09_Database_Visibility_Literacy.md)) |
| Analytics Events | Custom events publish/query (Events Service creds) |
| RBAC | Users, groups, roles |
| License | Usage / rules (model-dependent) |
| Controller Audit History | Who changed what |
| Agent Management / Installer | Fleet-oriented automation where licensed |

**API Client lifecycle.** Create client → generate secret (password-like UUID) → attach roles → generate temporary UI token **or** short-lived token via `POST /controller/api/oauth/access_token` (`grant_type=client_credentials`, `client_id=<name>@<account>`). Default API-generated token expiration is short (often minutes)—refresh in CI. Regenerating does **not** immediately kill older temporary tokens until they expire; revoke/delete client when compromised. Scope each client to the minimum roles needed.

**CLI literacy.** Documented command-line REST patterns / vendor tools exist for Controller calls—use them for scripted digs and automation. Prefer API Clients over shared admin passwords in CI. Metric Browser “copy REST URL” is a dig accelerator—still execute via CLI/`curl` with OAuth.

**High-signal first surfaces.** Start with Application Model inventory, Metric & Snapshot for golden BTs, Alert and Respond for the paging path, then License and Audit. Database Visibility and Analytics Events come later—and use different credentials for Events.

**Disconfirm:** Shared “admin” login for the whole org. Long-lived tokens in CI without rotation. Account name committed beside Helm values. Basic auth for Cisco IdP–only humans.

**Confirm:** Break-glass admin documented? SSO/IdP for humans? Automation uses least-privilege API Client?

## 2. Advanced — RBAC, audit, secrets, failure modes

**RBAC design.** Separate who can: install/configure agents (keys), edit BT detection, create paging health rules, manage Analytics data security, administer users/API Clients. Map IdP groups to AppD roles/groups. Analytics permissions are an extra axis ([11](./11_Analytics_And_Log_Literacy.md)). REST calls enforce RBAC for the identity the token represents.

**Admin users.** Few Controller Admins / Account Owners; application-scoped admins for app teams; read-only for most engineers. Quarterly access review. Creating API Clients requires Account Owner or Administer users/groups/roles permission.

**Audit.** Controller Audit History API / UI answers “who deleted that policy?” Alert on role grants and key creation when your process allows.

**As-code.** Codify critical health rules/policies via Alert and Respond APIs after one UI success ([10](./10_Health_Rules_Policies_And_Alerting.md)). Avoid dual click-ops + automation ownership of the same objects. Database Visibility API for collector lifecycle with license checks ([09](./09_Database_Visibility_Literacy.md)).

**On-prem.** Same RBAC story plus OS/Enterprise Console access—Controller admins ≠ box root without change control ([03](./03_SaaS_Vs_On_Prem_Controller.md), [13](./13_Operations_License_And_Pitfalls.md)). On-prem Controllers often use default account `customer1` for basic auth examples; SaaS uses your tenant account name.

**Secrets hygiene.** Inventory: agent access keys, OTel keys, Analytics Events keys, API Client secrets, PagerDuty integration keys in HTTP templates. Rotate on schedule and on leak. Purge git history if secrets were committed. Never log full Bearer tokens.

### Failure modes

| Symptom | Likely cause |
|---------|----------------|
| 401/403 from scripts | Wrong account name, expired OAuth, IdP blocks basic auth |
| Analytics publish works, Controller API fails | Different credential planes confused |
| “Ghost” config drift | UI and API both editing rules |
| Key leak | Account identifiers in git history—rotate + purge |
| Token “still works” after regenerate | Old temporary tokens not yet expired—revoke/delete client |
| Browser paste of Metric URL | Unsupported / insecure—use CLI |

## 3. Applications — use cases and staff checklist

**Use case 1 — Secrets baseline.** Agent access keys, OTel keys, Analytics keys, API Client secrets, PagerDuty template vars in a vault; inventory quarterly.

**Use case 2 — Page as code.** Create one health rule + policy via API in staging; PR review; freeze UI for that pair.

**Use case 3 — SSO + break-glass.** Humans via IdP; two break-glass local admins offline; audit on use; automation on API Clients only.

**Use case 4 — Collector automation.** Database Visibility API for collector lifecycle with concurrent-license checks ([09](./09_Database_Visibility_Literacy.md)).

**Use case 5 — Audit dig.** After a mystery silence, pull Audit History for policy/health-rule/role changes before blaming agents.

**Staff checklist**

- [ ] Account name / keys never stored in git  
- [ ] API Clients for automation; humans on SSO  
- [ ] RBAC: admin ≠ everyone; paging-rule edit restricted  
- [ ] Audit history reviewed / retained per policy  
- [ ] Analytics API keys scoped by event type  
- [ ] Runbook for key rotation and agent re-key  
- [ ] Metric Browser REST URLs used only via CLI/programmatic clients  
- [ ] Token refresh in CI; no forever Bearer in Jenkins  

**Good:** least-privilege tokens, audited admins, as-code paging rules. **Bad:** one forever password in Jenkins and account name in the Dockerfile.

**Account API literacy.** Accounts / license observation APIs sit beside License API for headroom automation—still name a human owner for purchase and allocation decisions ([13](./13_Operations_License_And_Pitfalls.md)).

## References

- [Using the Controller APIs](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/using-the-controller-apis) · [API Clients](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/api-clients) · [Platform API Index](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/platform-api-index) · [Application Model API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/application-model-api) · [Alert and Respond API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/alert-and-respond-api)  
- [RBAC API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/rbac-api) · [Controller Audit History API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/controller-audit-history-api) · [License API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/license-api) · [Analytics Events API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/analytics-events-api) · [Analytics and Data Security](https://help.splunk.com/en/appdynamics-saas/analytics/26.8.0/analytics/deploy-analytics-with-the-analytics-agent/analytics-and-data-security)  
- [15 Offering map](./15_What_To_Enable_Next_And_When_Not.md) · [Datadog admin analog](../Datadog/26_API_Terraform_CLI_And_Account_Admin.md) · [README](./README.md)
