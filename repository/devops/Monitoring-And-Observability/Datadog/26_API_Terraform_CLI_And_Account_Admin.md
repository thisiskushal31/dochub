# 26 — API, Terraform, CLI, and account admin

[← Previous](./25_Cloud_Cost_IDP_And_Platform_Services.md) · [README](./README.md)

## 1. Concepts

### HTTP API

Full programmatic access: metrics submit/query, events, monitors, dashboards, logs query, and product-specific endpoints. Use **API keys** (Agent/ingest) vs **application keys** (user-scoped automation) correctly.

### Terraform / as-code

Manage monitors, dashboards, authn/z pieces, pipelines, and more as code for reviewable change—after the UI path works once.

### CLI

- **`datadog-agent`** status/flare commands on hosts  
- **`datadog-ci`** for CI tracing/tags ([21](./21_CI_Visibility_Testing_And_Delivery_Gates.md))  
- Other product CLIs as documented  

### Account management

Orgs, users, roles/RBAC, SAML/SSO, Teams, audit trail, API key rotation, usage/billing, sensitive data controls, domain allowlists, and site selection. **Audit Trail** answers “who changed that monitor?”

**Disconfirm:** Long-lived app keys in CI without rotation. Admin = everyone.

**Confirm:** Break-glass admin documented? SSO enforced for humans?

## 2. Advanced

Remote configuration / Fleet Automation for Agent fleets at scale ([02](./02_Architecture_Agent_And_Data_Plane.md)). Partners and MSP patterns for multi-customer orgs. Client SDKs beyond tracing (DogStatsD libraries, etc.).

## 3. Applications — what to do

1. Put API/app keys in a secrets manager; inventory keys quarterly.  
2. Terraform one paging monitor + one dashboard.  
3. Enable Audit Trail; alert on dangerous permission changes.

## References

- [API](https://docs.datadoghq.com/api/) · [Account management](https://docs.datadoghq.com/account_management/) · [Fleet Automation](https://docs.datadoghq.com/agent/fleet_automation/)  
- [Offering map](./14_What_To_Enable_Next_And_When_Not.md) · [README](./README.md)
