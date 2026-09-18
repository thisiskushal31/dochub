# 25 — Governance, permissions, and migration

[← Previous](./24_Integrations_Notifications_Observability_And_Insights.md) · [README](./README.md) · [Next: APIs & platform extras →](./26_APIs_CLI_Terraform_And_Platform_Extras.md)

## 1. Concepts

### Permissions

With **teams** enabled, control who can view/create builds, edit pipelines, manage test suites, and (when enabled) registries. Pipeline creators typically get **Full Access** on pipelines they create; tighten with team membership.

**Enterprise** orgs can set organization-wide pipeline/test-suite security defaults — confirm plan docs ([15](./15_Platform_Teams_SSO_And_Governance.md)).

### Governance features

| Feature | Job |
|---------|-----|
| **Pipeline templates** | Standardize required steps/policies |
| **Build exports** | Compliance / archival export of build data |
| **Job log archiving** | Retain logs per governance needs |

### Migration & converters

| Path | When |
|------|------|
| From Jenkins | Map agents→agents, freestyle→command steps, `depends_on` for order |
| From GitHub Actions | Map workflows→pipelines; optional Actions-in-Buildkite preview paths |
| **Pipeline converter** | Assist translating foreign CI YAML — verify output; don’t trust blindly |
| YAML steps upgrade | Leave legacy visual editor |

## 2. Advanced concepts

Incoming webhooks: know what can trigger builds; restrict tokens ([10](./10_Secrets_Environment_And_OIDC.md)).

Public pipelines: intentional only — default private for company code.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Regulated CI | Templates + exports + SSO + audit log ([26](./26_APIs_CLI_Terraform_And_Platform_Extras.md)) |
| Jenkins brownfield | Parallel run; migrate pipeline-by-pipeline |
| Enforce “must scan” | Template or required steps via policy |

**Good:** teams before wide org invite. **Bad:** everyone Full Access on prod deploy pipelines.

## References

- [Governance](https://buildkite.com/docs/pipelines/governance)  
- [Pipeline templates](https://buildkite.com/docs/pipelines/governance/templates)  
- [Permissions](https://buildkite.com/docs/pipelines/security/permissions)  
- [Migration](https://buildkite.com/docs/pipelines/migration)  
- [Pipeline converter](https://buildkite.com/docs/pipelines/converter)  
