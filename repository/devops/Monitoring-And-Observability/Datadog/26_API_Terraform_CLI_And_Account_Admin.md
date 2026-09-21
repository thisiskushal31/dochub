# 26 — API, Terraform, CLI, and account admin

[← Previous](./25_Cloud_Cost_IDP_And_Platform_Services.md) · [README](./README.md)

## 1. Concepts — automate and govern the account

Everything earlier becomes unsafe at scale without **keys**, **as-code**, **CLI**, and **RBAC/audit**. This chapter is how you operate Datadog as a platform, not a shared demo login.

### API keys vs application keys

| Key type | Purpose | Typical use |
|----------|---------|-------------|
| **API key** | Authenticate Agent / ingest / telemetry submit | Agents, Extension, DogStatsD→HTTP, some shippers |
| **Application key** | Authorize **user-scoped** API actions | Terraform, CI automation, Workflows, custom apps |

Never conflate them: an API key alone should not edit monitors; an app key without an API key cannot ingest Agent metrics. Both belong in a **secrets manager**, not chat or git.

### HTTP API

Programmatic access: metrics submit/query, events, monitors, dashboards, logs query, and product-specific endpoints. Prefer official client libraries where available; respect rate limits; paginate list endpoints.

### Terraform / as-code

Manage monitors, dashboards, auth pieces, pipelines, synthetics, and more as code for reviewable change — **after** the UI path works once for a given resource type. Drift between UI click-ops and Terraform state is a leading cause of “who deleted the page?”

### CLIs

| CLI | Job |
|-----|-----|
| **`datadog-agent`** | `status`, `flare`, check runs on hosts |
| **`datadog-ci`** | CI tracing, tags, gates ([21](./21_CI_Visibility_Testing_And_Delivery_Gates.md)) |
| Product CLIs | As documented per feature |

### Account management

Orgs, users, roles/**RBAC**, SAML/SSO, Teams, **Audit Trail**, API key rotation, usage/billing, sensitive data controls, domain allowlists, site selection (`datadoghq.com` vs `datadoghq.eu`, etc.). **Audit Trail** answers “who changed that monitor?”

**Fleet Automation / Remote Configuration** manages Agent fleets at scale ([02](./02_Architecture_Agent_And_Data_Plane.md)) — which Agents use which keys, config push, version skew.

**Disconfirm:** Long-lived app keys in CI without rotation. Admin role for everyone. Terraform without state locking/review. SSO optional for humans.

**Confirm:** Break-glass admin documented? SSO enforced? Audit Trail enabled and retained? Key inventory quarterly?

## 2. Advanced — RBAC, multi-org, failure modes

**RBAC design.** Separate: who can create high-cost resources (indexes, custom metrics, synthetics), who can mute monitors, who can manage security products, who is org admin. Map Datadog Teams to GitHub/IdP groups for IDP ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)).

**Key hygiene.** One API key per environment or fleet slice when practical; revoke on leak; Fleet Automation shows Agents still on dead keys. App keys: per automation principal (Terraform CI, Workflows), least privilege, expiry where supported.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Agents red after rotation | Key rotated without Fleet/rollout plan |
| Terraform fights UI | Dual management; no ownership of resource class |
| Silent permission change | No Audit Trail alert on role edits |
| Cross-org confusion | Multiple orgs without documented purpose |

**Partners / MSP.** Multi-customer org patterns need strict RBAC and sometimes separate orgs — follow partner docs; don’t share app keys across customers.

**Client SDKs.** DogStatsD libraries, official API clients, and tracing SDKs are different tools — don’t put a tracing app key pattern on a DogStatsD UDP socket.

**Cost.** Audit Trail and multi-org multiply seats/usage visibility work — still cheaper than an unowned admin estate ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

**Site and org topology.** Pick `DD_SITE` once per org and document it; Agents pointed at the wrong site look “healthy locally” and send nowhere useful. Multi-org splits (prod vs security, or regional) need written rules for what crosses orgs — telemetry sharing is not automatic.

**Terraform resource classes.** Decide which resource types are code-owned (paging monitors, SLOs, log indexes, security detection rules) vs UI-ok (ad-hoc scratch dashboards). Publish the list; enforce with codeowners on the Terraform repo.

**Emergency access.** Break-glass accounts bypass SSO — store credentials offline, alert Audit Trail on use, rotate after each use. Test restoration of a deleted monitor from Terraform before you need it in a Sev1.

## 3. Applications — use cases and staff checklist

**Use case 1 — Secrets baseline.** API + app keys in secrets manager; inventory quarterly; alert Audit Trail on key create/delete and admin role grants.

**Use case 2 — Terraform one slice.** Codify one paging monitor + one dashboard; PR review required; UI freeze for those resources.

**Use case 3 — SSO + break-glass.** Enforce SAML for humans; two break-glass accounts in a sealed procedure; test annually.

**Use case 4 — Fleet Automation.** View which Agents use which API key before rotation; staged rollout; `datadog-agent flare` only via documented support path.

**Staff checklist**

- [ ] API keys vs app keys understood by platform eng  
- [ ] Keys in secrets manager; rotation runbook exists  
- [ ] SSO enforced for human users  
- [ ] RBAC: admin ≠ everyone; high-cost actions restricted  
- [ ] Audit Trail on; alert on dangerous permission changes  
- [ ] Terraform (or equivalent) owns critical monitors/dashboards  
- [ ] Fleet Automation / Agent key mapping reviewed before rotations  
- [ ] Break-glass admin procedure documented and tested  

**Good:** least-privilege keys, as-code monitors, audited admins. **Bad:** one forever app key in CI and shared admin logins.

## References

- [API](https://docs.datadoghq.com/api/) · [Authentication](https://docs.datadoghq.com/api/latest/authentication/) · [API and Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/)  
- [Account management](https://docs.datadoghq.com/account_management/) · [RBAC](https://docs.datadoghq.com/account_management/rbac/) · [Audit Trail](https://docs.datadoghq.com/account_management/audit_trail/)  
- [Terraform provider](https://docs.datadoghq.com/infrastructure/infrastructure_as_code/) · [Fleet Automation](https://docs.datadoghq.com/agent/fleet_automation/)  
- [Offering map](./14_What_To_Enable_Next_And_When_Not.md) · [README](./README.md)
