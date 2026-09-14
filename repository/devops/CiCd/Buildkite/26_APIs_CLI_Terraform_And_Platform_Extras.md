# 26 — APIs, CLI, Terraform, and platform extras

[← Previous](./25_Governance_Permissions_And_Migration.md) · [README](./README.md)

---

## 1. Concepts

### APIs

| API | Use |
|-----|-----|
| **REST** | Pipelines, builds, agents, org resources |
| **GraphQL** | Rich queries/mutations (large schema — use for automation, not memorization) |
| **Agent API** | What agent stacks / controllers use to acquire jobs |
| **Webhooks** | Push events to your systems |
| **MCP / model providers** | Current AI-adjacent platform surfaces — enable deliberately |

Manage **API tokens** with least privilege; prefer short life; store outside Git.

### CLIs

| CLI | Job |
|-----|-----|
| **buildkite-agent** | On the machine: start, upload pipeline, artifacts, annotate, oidc |
| **Platform CLI** (`bk` / platform CLI per current docs) | Org/user workflows from a laptop |

### Terraform provider

Codify pipelines, teams, clusters, and related resources for reviewable org changes.

### Platform extras (literacy)

| Surface | Note |
|---------|------|
| **Audit log** | Who changed what |
| **Limits** | Rate/size ceilings |
| **Pricing and plans** | Confirm gates; don’t invent |
| **Artifact storage billing** | Cost literacy for artifact volume |
| **AI agents / coding agents** | Assisted features on the same gated loop |
| **VS Code extension** | Editor convenience |
| **Emojis / accessibility** | Product UX details |

---

## 2. Advanced concepts

OAuth device/token exchange flows exist for some API clients — follow current API auth docs.

GraphQL descriptions under `apis/` are generated encyclopedia — public handbook points here; do not paste the schema into notes.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Bootstrap 200 pipelines | GraphQL/REST + Terraform |
| Incident forensics | Audit log + build exports |
| Local “retry upload” | agent CLI `pipeline upload` |

**Good:** token inventory with owners. **Bad:** org-admin token in CI logs.

---

## References

- [APIs](https://buildkite.com/docs/apis)  
- [REST API](https://buildkite.com/docs/apis/rest-api)  
- [GraphQL API](https://buildkite.com/docs/apis/graphql-api)  
- [Managing API tokens](https://buildkite.com/docs/apis/managing-api-tokens)  
- [Terraform provider](https://buildkite.com/docs/platform/terraform-provider)  
- [Audit log](https://buildkite.com/docs/platform/audit-log)  
- [Pricing and plans](https://buildkite.com/docs/platform/pricing-and-plans)  
- [Platform CLI](https://buildkite.com/docs/platform/cli)  
