# 15 — Platform: teams, SSO, and governance

[← Previous](./14_Package_Registries_And_Test_Engine.md) · [README](./README.md) · [Next: Worked example →](./16_Worked_Example_Build_And_Deploy.md)

## 1. Concepts

**Buildkite Platform** is the org layer around Pipelines:

| Surface | Job |
|---------|-----|
| **Teams** | Who can view/build pipelines |
| **SSO** | Enterprise login |
| **Permissions / governance** | Org policy, audit-oriented controls |
| **APIs** | REST, GraphQL, Agent API, webhooks |
| **Terraform provider** | Org/pipeline as code |
| **Audit log / limits / plans** | Compliance and ceiling literacy ([26](./26_APIs_CLI_Terraform_And_Platform_Extras.md)) |

Pipeline templates, build exports, permissions depth, migration: [25](./25_Governance_Permissions_And_Migration.md).

## 2. Advanced concepts

### Least privilege

Separate builders from unblockers of production; separate agent tokens per cluster; rotate API tokens.

### Incoming webhooks / integrations

Know what can trigger builds. Restrict token scopes.

### Assisted / agentic features

If coding-agent pipeline features are enabled in your org, keep the same gates (review, OIDC scope, no standing prod keys).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Company IdP | SSO + team mapping |
| Many pipelines | Terraform + GraphQL bootstrap |
| Audit story | Cluster isolation + restricted deploy teams |

**Good:** named owners for clusters and deploy pipelines. **Bad:** org admin tokens in chat logs.

## References

- [Platform](https://buildkite.com/docs/platform)  
- [SSO](https://buildkite.com/docs/platform/sso)  
- [Team management](https://buildkite.com/docs/platform/team-management)  
- [REST API](https://buildkite.com/docs/apis/rest-api)  
- [Governance](https://buildkite.com/docs/pipelines/governance)  
