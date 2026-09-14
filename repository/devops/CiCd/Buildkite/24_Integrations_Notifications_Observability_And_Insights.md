# 24 — Integrations, notifications, observability, and insights

[← Previous](./23_Hosted_Agent_Operations.md) · [README](./README.md) · [Next: Governance →](./25_Governance_Permissions_And_Migration.md)

---

## 1. Concepts

Beyond core steps, Pipelines connects outward:

| Class | Examples (see docs tiles) |
|-------|---------------------------|
| **Plugins** | Docker, tests, deploy helpers, secrets — pin versions ([09](./09_Plugins_Artifacts_Cache_And_Annotations.md)) |
| **Notifications** | Chat/email/status when builds finish |
| **Observability** | Export metrics/traces/logs to your stack |
| **Security & compliance** | Scanners / policy plugs via integrations |
| **Artifacts & packages** | Bridges to Package Registries / external stores |
| **Insights** | Waterfall, queue metrics, cluster insights |

### Waterfall view

On a finished build: **View → Waterfall**. Shows wait (gray) / dispatch (yellow) / run (green/red) per job. Groups/matrices nest. Limits apply (large builds may not render) — use when debugging slow graphs.

### Queue metrics / cluster insights

Operational views for wait times and cluster health. Deeper cluster insights may be **plan-gated** (e.g. Enterprise) — confirm docs/pricing.

---

## 2. Advanced concepts

### Speed tools

Docs cover flaky-test reduction and tooling such as **bktec** for faster test feedback — adopt when test volume justifies; still fail the build on real failures ([14](./14_Package_Registries_And_Test_Engine.md)).

### Notification hygiene

Don’t spam production channels on every PR; route by pipeline/branch.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| “Why is CI slow?” | Waterfall + queue metrics |
| Slack on main failure | Notification integration |
| Org scanner gate | Security integration / plugin |

**Good:** pinned plugins; owned notification routes. **Bad:** twenty chat bots on every step.

---

## References

- [Integrations](https://buildkite.com/docs/pipelines/integrations)  
- [Plugins](https://buildkite.com/docs/pipelines/integrations/plugins)  
- [Waterfall view](https://buildkite.com/docs/pipelines/insights/waterfall)  
- [Queue metrics](https://buildkite.com/docs/pipelines/insights/queue-metrics)  
- [Cluster insights](https://buildkite.com/docs/pipelines/insights/clusters)  
