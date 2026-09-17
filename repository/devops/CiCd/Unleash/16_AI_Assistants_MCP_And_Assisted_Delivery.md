# 16 — AI assistants, MCP, and assisted delivery

[← Previous](./15_Integrations_Terraform_Webhooks_And_Chatops.md) · [README](./README.md) · [Next: Security →](./17_Security_Privacy_And_Compliance.md)

---

## 1. Concepts

Unleash documents integrations with **coding assistants** and an **MCP server** so agents can help create/manage flags inside guardrails. Treat this as **assisted delivery literacy**, not a requirement to run Unleash.

Surfaces you may see:

| Surface | Role |
|---------|------|
| **Unleash MCP** | Tooling bridge for agents to query/change Unleash via MCP (local or remote server settings) |
| **IDE agents** | Copilot, Claude Code, Cursor, Codex, Kiro, OpenCode, Gemini/Antigravity — same MCP, different install recipes (upstream) |
| **Flags for AI features** | Gate model prompts, providers, or risky AI paths in *your* product |

Same rule as humans: **prod exposure needs governance** ([13](./13_Change_Requests_Release_Management_And_Governance.md)). An agent with an admin token is still an admin.

---

## 2. Advanced concepts

### Threat model

- Scope MCP credentials like CI tokens — project/env least privilege  
- Ban unsupervised prod 100% rollouts from agents  
- Log agent-driven Admin API changes like any automation  

### Flags *for* AI products

Use flags to:

- Switch model providers  
- Disable generative features under cost/error spikes (kill switch)  
- Experiment on prompt variants (strategy variants + impressions)  

Do not store proprietary prompts as the only copy inside a public frontend flag payload.

### Spectrum door

Assisted delivery sits on the same spectrum as forge CI and GitOps ([22](./22_Config_Catalog_Migrate_And_Spectrum.md), Methodologies assisted-modern doors). Flags remain the behavior control plane.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Faster flag scaffolding | Agent + MCP in **dev** |
| AI feature kill switch | Ops flag default-on, easy off |
| Prompt experiment | Variants + impressions |

**Staff checklist**

- Agent credentials non-prod by default  
- Human approve for prod strategy changes  
- AI feature flags owned like any release flag  

**Good:** agent opens draft change request. **Bad:** agent holds org admin token in a shared chat.

---

## References

- [Unleash MCP server](https://docs.getunleash.io/ai-coding-assistants/mcp)  
- [AI coding assistants hub](https://docs.getunleash.io/ai-coding-assistants)  
- [Manage AI models with feature flags](https://docs.getunleash.io/guides/manage-ai-models-with-feature-flags)  
