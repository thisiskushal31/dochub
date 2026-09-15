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

Resource limits (flags, strategies, …) exist so one project cannot melt the instance — know your edition’s ceilings.

---

## 2. Advanced concepts

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

### Network view / maintenance

Use admin network/application views to find chatty or stale clients. Maintenance mode when you must freeze writes.

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

- [Scaling Unleash](https://docs.getunleash.io/guides/scaling-unleash)  
- [Upgrade Unleash](https://docs.getunleash.io/deploy/upgrading-unleash)  
- [Troubleshooting](https://docs.getunleash.io/support/troubleshooting)  
- [Synchronize instances](https://docs.getunleash.io/guides/how-to-synchronize-unleash-instances)  
