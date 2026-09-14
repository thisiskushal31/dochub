# 10 — Resource tracking, diffing, webhooks, and control-plane ops

[← Previous](./09_Use_Cases_Pitfalls_And_Staff_Checklist.md) · [Argo CD](./README.md) · [Next: Security and troubleshooting →](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)

---

## 1. Concepts

Chapters 01–09 cover the delivery path. This chapter covers **ownership**, **noisy diffs**, **faster reconcile**, and **keeping the control plane observable and recoverable** — topics that show up the week after the first happy sync.

### Resource tracking (who owns this object?)

Argo CD must know which live objects belong to which Application. Tracking method is configured on the control plane (commonly via `argocd-cm`):

| Method | Mechanism | When |
|--------|-----------|------|
| **`annotation`** (modern default in current lines) | `argocd.argoproj.io/tracking-id` | Prefer when you can — avoids fights with other tools over labels |
| **`annotation+label`** | Annotation for truth + `app.kubernetes.io/instance` for humans/tools | Need the common instance label for other ecosystem tools |
| **`label`** | Instance label only | Legacy; label length (63 chars) and collisions with Helm/operators are real |

**Why it matters:** Helm charts and operators often set `app.kubernetes.io/instance`. If Argo also used only that label for ownership, sync/prune can get confused about who owns a resource. Annotation tracking separates Argo’s ownership from that ecosystem label.

**Multiple Argo CD instances on one cluster:** set an **installation ID** so resources carry which control plane owns them.

**Apps in any namespace** (see [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)) produces longer composite app names — annotation tracking is strongly recommended there.

### Diffing and “still OutOfSync after Sync”

Successful sync does **not** guarantee Synced forever. Common causes:

- A **mutating webhook** or controller rewrites fields after apply  
- Git has fields Kubernetes drops (unknown/extra)  
- **Prune disabled** while Git removed objects  
- Helm templates that are non-deterministic (`randAlphaNum`, …)  
- Controllers that reorder fields (classic HPA `spec.metrics` story)  

**ignoreDifferences** (per Application or system-wide) tells Argo to ignore JSON paths or fields owned by certain managers. Prefer fixing the root cause (omit HPA-owned `replicas` from Git, pin deterministic templates). Use ignore rules when the upstream behavior is immovable.

### Webhooks (stop waiting on the poll)

Without webhooks, Argo CD **polls** Git/OCI/Helm on an interval (on the order of a few minutes). That delay confuses humans (“I merged — why isn’t it syncing?”).

Configure forge (and optionally OCI registry) webhooks to the API server’s webhook endpoint so a push triggers **refresh** quickly. Payload size limits and shared secrets reduce abuse risk if the endpoint is reachable from the internet. Webhooks trigger refresh — they do not replace auth on sync itself.

### Notifications

The notifications controller alerts on sync/health events (Slack, Teams, email, PagerDuty, webhooks, and many others). Subscribe per Application or via namespace-scoped config when apps live outside `argocd`. Treat this as the ChatOps bridge so “CI green” is not the only signal after pull-based CD.

### Metrics

Argo CD exposes Prometheus metrics (application sync/health, reconcile timing, cluster cache, Redis, …). Scrape controller/server metrics endpoints and alert on:

- apps stuck **OutOfSync** or **Degraded** in prod Projects  
- reconcile/sync duration regressions  
- cluster connection failures  

This is how platform teams see GitOps health the same way they see CI queue health ([Observability](../../Observability/README.md) door for Prom/Grafana depth).

### Disaster recovery

Two layers:

1. **Git is the product state** — Applications, Projects, and configs that live in Git can be re-applied. Prefer declarative setup so the control plane is rebuildable.  
2. **Operational state still needs a backup** — repo credentials, cluster secrets, SSO config, and any Applications created only in the UI. Official path: **`argocd admin export` / `import`** (optionally `--strip-status` for a clean re-apply). Test restore; do not discover export syntax during an outage.

If Git is incomplete, restore from export first, then fix Git so the next disaster is shorter.

### Application deletion

Deleting an Application can **cascade** and prune cluster resources (finalizers). If Git is broken and manifests cannot render, deletion can get stuck — break-glass options include deleting with cascade disabled and cleaning resources manually. Know the finalizer behavior before “just delete it” in prod.

---

## 2. Advanced concepts

### Orphaned resources

Objects in the destination namespace that Argo does not track can be reported as orphans. Useful for finding leftover kubectl applies in team namespaces — dangerous if the namespace is intentionally shared with non-GitOps workloads (expect noise).

### Compare options and sync options

Fine-grained flags control dry-run, server-side apply, force, replace, and how diffs are computed. Use them for stubborn CRDs or large resources — not as everyday “force sync” culture.

### Hard refresh

When cache and Git disagree in confusing ways, hard refresh invalidates cached manifests. Teach on-call this before assuming the repo is wrong.

### Status badges and external URLs

Optional UI/readme badges and deep links into the Argo UI help humans; they are conveniences, not security controls.

### Private repositories

SSH keys, HTTPS tokens, GitHub Apps, cloud IAM-style creds — all become Secrets in the Argo CD namespace. Rotate them; scope them read-only to GitOps repos; treat the management cluster as a secrets vault for deploy credentials ([08](./08_Secrets_CI_Integration_And_Operations.md)).

---

## 3. Applications and use cases

| Situation | Use |
|-----------|-----|
| Helm and Argo fight over instance label | Annotation (or annotation+label) tracking |
| Always OutOfSync on `replicas` | Omit replicas; ignoreDifferences as backup |
| Slow feedback after merge | Git webhooks + (optional) auto-sync |
| On-call never sees sync fail | Notifications + metrics alerts |
| Management cluster rebuild | Declarative Git + tested `admin export` backup |
| Migrate from Helm releases to Argo | Understand tracking before prune — orphan/ownership audit first |

---

## References

- [Resource tracking](https://argo-cd.readthedocs.io/en/stable/user-guide/resource_tracking/)  
- [Diffing customization](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/)  
- [Webhooks](https://argo-cd.readthedocs.io/en/stable/operator-manual/webhook/)  
- [Notifications](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)  
- [Metrics](https://argo-cd.readthedocs.io/en/stable/operator-manual/metrics/)  
- [Disaster recovery](https://argo-cd.readthedocs.io/en/stable/operator-manual/disaster_recovery/)  
- [Application deletion](https://argo-cd.readthedocs.io/en/stable/user-guide/app_deletion/)  
