# 05 — First reconcile: the day-1 loop

[← Previous](./04_Install_Bootstrap_And_CLI.md) · [README](./README.md) · [Next: Sources →](./06_Sources_Git_OCI_Bucket_Helm.md)

---

## 1. Concepts

After install, every normal change follows the same loop:

1. **Change Git** (or OCI) — preferably via pull request  
2. Flux **fetches** a new artifact  
3. Flux **applies** it  
4. You **check Ready** — or read why it failed  

```bash
flux get all -A
flux get sources git
flux get kustomizations -A
flux reconcile source git flux-system          # nudge now
flux reconcile kustomization flux-system
flux logs --follow
```

The official get-started guide adds a sample app (podinfo) by committing YAML or using `flux create` helpers. Either is fine — what matters is that **Git keeps the history**.

---

## 2. Advanced concepts

### How to read failures

Ask which step broke:

| Layer | Typical symptom |
|-------|-----------------|
| Source | Cannot clone / wrong branch / bad credentials |
| Build | Invalid Kustomize / wrong `path` |
| Apply | RBAC denied / missing CRD / immutable field |
| Health | Applied, but `wait` / healthChecks never pass |

### Revisions

Look at the artifact revision / `lastAppliedRevision`. If Git moved and the cluster didn’t, you know where to look.

### Faster than the timer

`flux reconcile` is for “do it now.” For everyday speed after every push, add a **Receiver** webhook ([14](./14_Notifications_Alerts_And_Receivers.md)).

### Suspend

`flux suspend` / `resume` pauses an object. Use with a ticket in production.

### Drift sanity check

If prune/heal is on, a manual `kubectl edit` should get reverted. If it doesn’t, check `ignore` rules or suspend ([08](./08_Kustomization_Controller.md)).

---

## 3. Applications and use cases

| Checkpoint | Pass when |
|------------|-----------|
| Bootstrap | Controllers Ready; fleet path syncing |
| First app | Kustomization/HelmRelease Ready; pods up |
| Change loop | A Git commit changes the cluster without kubectl apply |
| Undo | Git revert brings the old version back |

**Good:** every fix is a commit. **Bad:** only running `flux reconcile` with nothing new in Git.

---

## References

- [Get started](https://fluxcd.io/flux/get-started/)  
- [Flux CLI](https://fluxcd.io/flux/cmd/)  
- [Troubleshooting cheatsheet](https://fluxcd.io/flux/cheatsheets/troubleshooting/)  
