# 13 — Dynamic pipelines and advanced YAML

[← Previous](./12_Deploy_Targets_And_Pipes_Catalog.md) · [README](./README.md) · [Next: Jira →](./14_Jira_And_Atlassian_Integrations.md)

---

## 1. Concepts

**Dynamic pipelines** let Bitbucket generate or adapt pipeline configuration at runtime (repository or workspace enablement) so large monorepos or intelligent path selection do not require enormous static YAML.

Still review what runs — dynamic does not mean ungated.

---

## 2. Advanced concepts

### When to use

| Fit | Why |
|-----|-----|
| Monorepo path intelligence | Only build changed packages |
| Generated matrices | Language/version fan-out |
| Org policy injection | Workspace-level dynamic rules |

### Risks

Opaque generation hinders PR review. Prefer checked-in generators or clear templates; log the effective pipeline. Keep merge checks honest.

### Other advanced YAML

Clone depth options, max-time, condition expressions, export/import of shared pipeline definitions (Premium), Runtime v3 for Docker services — see configuration reference when sizing Cloud builds ([04](./04_Pipelines_Mental_Model_And_YAML.md), [10](./10_Pipes_Anchors_And_Reuse.md)).

### Agentic Pipelines (beta)

Bitbucket can embed **AI agents** inside pipeline steps (`definitions.agents` + `agent:` in a script). Workspace admins enable the feature; providers and plan requirements are documented by Atlassian and can change while it stays in beta. Treat it as assisted automation on the **same** gated loop (review PRs the agent opens; scope OAuth carefully) — not a replacement for merge checks and human ownership of production.

---

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| 200-package monorepo | Dynamic or path filters + child pipelines |
| Small repo | Static YAML is enough |

**Good:** effective config auditable in logs. **Bad:** dynamic rules only one person understands.

---

## References

- [Dynamic pipelines](https://support.atlassian.com/bitbucket-cloud/docs/dynamic-pipelines/)  
- [Agentic Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/agentic-pipelines/)  
- [Configuration reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)  
