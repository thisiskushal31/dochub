# 15 — Monitoring, upgrades, and day-2 ops

[← Previous](./14_Notifications_Alerts_And_Receivers.md) · [README](./README.md) · [Next: Scale →](./16_Scale_Multitenancy_And_Platform_Config.md)

## 1. Concepts

Operate Flux like any other cluster service — watch whether it is doing its job.

| Signal | Question it answers |
|--------|---------------------|
| **Status conditions** | Is this Source/Kustomization/HelmRelease Ready? |
| **Events** | What just happened? |
| **Logs** | Why did it fail? (`flux logs`) |
| **Metrics** | Are we slow or stuck in queue? |
| **Alerts** | Who gets notified? ([14](./14_Notifications_Alerts_And_Receivers.md)) |
| **Inventory / history** | What did we apply / prune? |

Alert when something stays **Not Ready** too long — not only when a Pod crashes.

## 2. Advanced concepts

### Upgrades

Follow official upgrade docs. Try staging first. Watch CRD storage-version migrations. Re-running bootstrap is a common upgrade path (idempotent). Flux Operator can automate distribution upgrades if you use it ([04](./04_Install_Bootstrap_And_CLI.md)).

### Uninstall

Read uninstall docs before you run them. Prune may remove apps Flux managed.

### CI helpers

Flux GitHub Action and E2E guides help pipelines assert GitOps health — pin CLI versions.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Platform SLO | Metrics on Ready + reconcile lag |
| Safe upgrade | Staging → prod with a changelog |
| Incident | conditions → events → logs → Git revision → revert |

**Good:** Flux health on the platform dashboard. **Bad:** discovering Failed Sources only when users complain.

## References

- [Monitoring](https://fluxcd.io/flux/monitoring/)  
- [Metrics](https://fluxcd.io/flux/monitoring/metrics/)  
- [Upgrade](https://fluxcd.io/flux/installation/upgrade/)  
- [Uninstall](https://fluxcd.io/flux/installation/uninstall/)  
- [Flux GitHub Action](https://fluxcd.io/flux/flux-gh-action/)  
