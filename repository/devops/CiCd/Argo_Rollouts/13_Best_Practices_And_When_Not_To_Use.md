# 13 — Best practices and when not to use Rollouts

[← Previous](./12_Worked_Example_Canary_A_Service.md) · [README](./README.md) · [Next: Coverage map →](./14_Feature_And_Configuration_Coverage_Map.md)

---

## 1. Concepts — trade rules

Upstream best practices (and platform experience) converge on:

| Do | Do not |
|----|--------|
| Confirm app can run **two versions** (or use blue-green only) | Canary apps with shared mutable files / naive queue consumers |
| Keep progressive windows **short** (minutes–couple hours) | Multi-day preview as the default release process |
| Get **metrics** that decide in ~5–15 minutes | Humans watching dashboards for hours as the “analysis” |
| Prefer **automated** promote/abort | Manual pause forever as production process |
| Use Rollouts for **app** workloads | Put cert-manager, CoreDNS, ingress controllers on Rollouts |
| One stable + one new version model | Expect N simultaneous versions as a first-class design |
| GitOps owns image digest | Habitual kubectl set image in prod |
| Start **blue-green**, then canary | Jump to mesh canary with no analysis |

Not for: ephemeral PR environments (use GitOps PR apps); long experiments (use feature flags).

---

## 2. Advanced concepts — sizing and ownership

### How many Rollouts?

**One Rollout per deployable unit per namespace/environment** — same judgment as one Deployment before. Do not merge unrelated services into one Rollout.

### Hotfixes mid-canary

If you change the template during a canary, Rollouts scales down the in-progress new RS and progresses the newest template against **prior stable** (hotfix assumption). Long overlapping releases create debate — another reason to keep windows short.

### Analysis ownership

Platform provides Prometheus (or other) + template patterns; app teams own query labels and thresholds. Dry-run templates in staging.

### Rollouts vs Argo CD responsibilities

| Concern | Owner |
|---------|--------|
| Desired YAML / digest in Git | GitOps (Argo CD) |
| Traffic steps / abort | Rollouts |
| Who may sync prod | Argo CD Projects/RBAC |
| Who may promote manually | Kubernetes RBAC + process |

---

## 3. Applications and use cases — decision cheatsheet

**Use Rollouts when:** Kubernetes service, need blast-radius control, can invest in metrics or accept blue-green manual promote.

**Do not use when:** non-K8s; platform add-ons; app cannot dual-run and blue-green is also unacceptable; you only needed a flag.

**Flags + Rollouts:** ship dark code behind flags; canary the binary; open flags gradually.

---

## References

- [Best practices](https://argoproj.github.io/argo-rollouts/best-practices/)  
- [Concepts — which strategy](https://argoproj.github.io/argo-rollouts/concepts/)  
- [FAQ](https://argoproj.github.io/argo-rollouts/FAQ/)  
