# 16 — Troubleshooting and staff checklist

[← Previous](./15_Rollout_Spec_And_Strategy_Configuration_Catalog.md) · [README](./README.md)

---

## 1. Concepts — playbook

| Symptom | Likely causes | What to try |
|---------|---------------|-------------|
| Weight not matching traffic | No trafficRouting; too few replicas | Add mesh/ingress; raise replicas |
| Stuck paused | Manual pause step; inconclusive analysis | `promote` or fix analysis; check AnalysisRun |
| Immediate abort | Analysis failing; bad thresholds | `kubectl describe analysisrun`; dry-run queries |
| Argo CD Synced but old traffic | Rollout still progressing/paused | `kubectl argo rollouts get rollout` |
| Preview unreachable | previewService / selector / Ingress | Check Services and Endpoints |
| ALB blue-green blip | ALB target group behavior | Read ALB caveats; consider other ingress |
| HPA fighting canary | Replica ownership | Align HPA/Rollout support notes; omit Git replicas if needed |
| Two tools set image | CI kubectl + GitOps | Single desired-state path |
| Abort RS lingering | Scaledown policy | Check scaledown aborted settings |
| CRD / install errors | Version skew; namespace install without CRDs | Pin version; apply CRDs |

---

## 2. Advanced concepts

Use `kubectl argo rollouts get rollout NAME --watch` as the first pane. Inspect AnalysisRuns and Experiments next. Controller logs in `argo-rollouts` namespace for provider/patch errors.

FAQ-class issues (health, providers) — see official FAQ; keep Git and live digest aligned after `undo`.

---

## 3. Applications and use cases — staff checklist

When reviewing a Rollout or progressive-delivery design:

- App can dual-run **or** strategy is blue-green with eyes open  
- Progressive window is short; not a multi-day preview process  
- Image digests (or immutable tags) in Git  
- Analysis present for automated prod canaries — or explicit manual promote policy  
- Canary-vs-stable metrics, not only noisy globals  
- trafficRouting when fine percentages are claimed  
- Abort tested in non-prod  
- Not used for cluster add-ons (ingress, DNS, cert-manager)  
- GitOps owns desired state; CLI promote is break-glass  
- DB expand/contract respected while versions overlap  
- Notifications/metrics for abort in environments that matter  
- Rollouts controller installed on every target cluster  
- Separate from Argo CD install — both present if using both  

### Map to CiCd staircase

| Topic | Link |
|-------|------|
| Strategies | [3](../3_Deployment_Strategies.md) |
| Controllers | [9](../9_Progressive_Delivery_Controllers.md) |
| Verify | [5](../5_Verify_Rollback_And_Synthetic_Tests.md) |
| GitOps CD | [Argo_CD](../Argo_CD/README.md) |
| Flags | [Unleash](../Unleash/README.md) |

---

## References

- [FAQ](https://argoproj.github.io/argo-rollouts/FAQ/)  
- [Best practices](https://argoproj.github.io/argo-rollouts/best-practices/)  
- Track start: [01](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md) · [README](./README.md)  
