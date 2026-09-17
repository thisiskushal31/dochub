# 18 — Scale, upgrade, operate, and troubleshoot

[← Previous](./17_Security_Privacy_And_Compliance.md) · [README](./README.md) · [Next: Worked example →](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md)

---

## 1. Concepts

Day-2 Unleash is mostly **boring platform ops**:

| Concern | Work |
|---------|------|
| **Scale** | Edge for fan-out; size Postgres; resource limits |
| **Upgrade** | Follow Unleash upgrade notes; backup first |
| **HA** | Multi-instance server + managed Postgres |
| **Sync** | Import/export / instance sync when running multiple Unleash |
| **Troubleshoot** | Toggle lag, token mismatch, context missing, SDK skew |

Resource limits cap flags, strategies, constraints, segments, tokens, projects, environments (OSS: **1 project, 2 environments**, not overridable). Enterprise raises ceilings (e.g. 50k flags, 500 projects). Self-host can override most via `UNLEASH_*_LIMIT` env vars — prefer talking to Unleash rather than silently raising.

---

## 2. Advanced concepts

### Import / export and instance sync

Move flag configs **between environments on one instance** or **between instances** (self-host ↔ cloud). Use tagged exports and dedicated source/target tokens. This is a migration/DR tool, not chatops.

### Network view, applications, Edge observability

**Network** dashboards show inbound request volume from SDKs, Edge, and Admin UI. **Applications** list connected clients and outdated SDKs. **Enterprise Edge observability** shows Edge node health in Admin settings. Use these before guessing at toggle lag.

### Maintenance mode, banners, command menu

**Maintenance mode** makes the instance mostly read-only (freeze config during upgrades). **Banners** are instance-wide UI messages. **Command menu** is Admin UX for jumping to flags/projects — not a control plane. **Search** on Flags overview / project flag lists / Projects is full-text plus filters (type, stale, tags, segments, last seen, favorites) — operators, not a second API.

### Toggle lag runbook

1. Confirm environment and token.  
2. Check Edge/server health and sync mode (poll vs stream).  
3. Verify SDK received config (metrics/applications).  
4. Playground the context.  
5. Only then blame “caching magic.”

### Upgrades

Read breaking changes; upgrade Edge and server as a pair when required; pin images; smoke Admin + one backend + one frontend SDK after.

### Backups

Postgres is the SoR for self-host. Test restore. Cloud customers still need export discipline for catastrophic vendor/project mistakes.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Enterprise fan-out | Edge per region |
| DR drill | Restore Postgres → verify flags |
| “Flag not applying” | Runbook above |

**Staff checklist**

- Backup/restore owner  
- Upgrade window defined  
- Edge+server monitored  
- On-call knows kill-switch path  

**Good:** Edge absorbs SDK storms. **Bad:** vertical-scale only the server forever.

---

## References

- [Resource limits](https://docs.getunleash.io/concepts/resource-limits)  
- [Import and export](https://docs.getunleash.io/concepts/import-export)  
- [Network](https://docs.getunleash.io/concepts/network-view)  
- [Scaling Unleash](https://docs.getunleash.io/guides/scaling-unleash)  
- [Upgrade Unleash](https://docs.getunleash.io/deploy/upgrading-unleash)  
- [Troubleshooting](https://docs.getunleash.io/support/troubleshooting)  
- [Synchronize instances](https://docs.getunleash.io/guides/how-to-synchronize-unleash-instances)  
- [Search](https://docs.getunleash.io/concepts/search-operators)  
