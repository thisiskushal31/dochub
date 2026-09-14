# 14 — Alerts and webhooks (notifications)

[← Previous](./13_Image_Update_Automation.md) · [README](./README.md) · [Next: Monitoring →](./15_Monitoring_Events_Metrics_And_Upgrade.md)

---

## 1. Concepts

Two directions:

| Object | Direction | Plain job |
|--------|-----------|-----------|
| **Provider** | Out | “Send to Slack / Teams / generic webhook” |
| **Alert** | Out | “Which Flux events go to that Provider?” |
| **Receiver** | In | “Git host calls this URL → reconcile now” |

Without Receivers, Flux still works — it just waits for the next poll interval. Receivers make “push to main → cluster updates” feel immediate.

---

## 2. Advanced concepts

### Alert noise

Alert on **failures**, not every success. On multi-tenant clusters, cross-namespace event access is often locked down.

### Secure Receivers

Use shared secrets / HMAC as documented. A public unauthenticated Receiver is a free “poke my cluster” endpoint.

### Secrets for Providers

Chat tokens live in Kubernetes Secrets referenced by the Provider — not in Git plaintext.

Provider type list evolves — check the Providers API when wiring a new system.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Page when prod sync fails | Provider + Alert on Failure |
| Fast GitOps after push | Git webhook → Receiver |
| Ship events to your bus | Generic webhook Provider |

**Good:** alerts go to the team that owns the fleet. **Bad:** every Successful reconcile in `#general`.

---

## References

- [Notification controller](https://fluxcd.io/flux/components/notification/)  
- [Webhook receivers guide](https://fluxcd.io/flux/guides/webhook-receivers/)  
- [Providers](https://fluxcd.io/flux/components/notification/providers/)  
- [Alerts](https://fluxcd.io/flux/components/notification/alerts/)  
- [Receivers](https://fluxcd.io/flux/components/notification/receivers/)  
