# 11 — Security, tenancy, hydrator, and troubleshooting

[← Previous](./10_Ownership_Diffing_Webhooks_And_Observability.md) · [Argo CD](./README.md) · [Next: Website example →](./12_Worked_Example_Simple_Website_GitOps.md)

---

## 1. Concepts

### Security model (what to remember)

Argo CD’s API authenticates with **JWTs** (not long-lived username/password bearer tokens for ongoing API use):

| Subject | How they get a token |
|---------|----------------------|
| Local **admin** | Password → session JWT (password change revokes existing admin JWTs) |
| **SSO** users | OIDC / Dex (or direct OIDC) — IdP issues JWT; groups drive RBAC |
| **Automation** | Project role tokens (scoped); local accounts with `apiKey`; OIDC exchange from CI |

Authorization walks group claims against **RBAC** policy and Project roles. Network paths between API server, repo-server, and controller are expected over TLS; Redis historically needs explicit hardening (treat cached manifests as sensitive if anyone ever injected secrets into render — prefer destination secret operators instead).

Signed release assets and supply-chain practices for *installing* Argo CD itself matter for platform teams (verify what you deploy onto the management cluster).

### Applications in any namespace

By default Applications live in the control-plane namespace (usually `argocd`). **Apps in any namespace** lets team namespaces hold Application CRs so teams GitOps their own Application objects without writing into `argocd`.

It is powerful and easy to misconfigure:

1. Globally allow namespaces (`application.namespaces` / controller & server flags).  
2. Each **AppProject** must list allowed **sourceNamespaces** — an Application outside `argocd` may only use Projects that permit its namespace.  
3. Requires a **cluster-scoped** Argo CD install.  
4. Prefer **annotation** resource tracking (composite names get long).  

Misconfiguration can become a privilege-escalation path (wrong Project = wrong destinations). Enable deliberately; document which namespaces and Projects pair together. ApplicationSets can similarly live outside the control-plane namespace when that feature is enabled for your version — same tenancy caution.

### Sync (and UI) impersonation

By default, sync often uses Argo CD’s powerful controller identity. **Impersonation** (beta-quality in recent 3.x lines — confirm on your version) lets sync and related UI/API actions run as a **destination ServiceAccount** mapped in the AppProject (`destinationServiceAccounts`).

Why platforms want it: least privilege per team/namespace; better audit of *which* identity mutated the workload cluster; multi-tenant isolation when one Argo CD serves many teams.

Enable only with Projects correctly mapped and destination SAs granted the verbs you need (get/patch/delete/logs/actions as applicable). Wrong SA = sync failures that look like “Argo is broken.”

### Source integrity (signed Git)

Argo CD can require **GnuPG-verified** commits/tags (and related source-integrity controls as your version matures) before syncing. Pair with org signing policy and [CiCd/6](../6_Supply_Chain_And_Signing.md). Unsigned emergency hotfixes need an explicit break-glass process or you will block prod during incidents.

### Source hydrator (rendered-manifest pattern)

**Beta** in recent lines (for example around 3.5 — check your version): Helm/Kustomize stay DRY in a “dry” source, but Argo can **commit hydrated (fully rendered) manifests** to Git (optionally a separate sync repo) before applying them.

Why teams want it: reviewers see *exact* YAML that will hit the cluster; PR diffs become real objects, not template puzzles; aligns with “rendered manifests” GitOps practice.

Cost: commit-server component, push credentials to Git, hydration lag, and another moving part. Disabled by default; use install variants that include the hydrator when you adopt it. Not required for successful GitOps — optional maturity step.

### Custom health and resource actions

Override health Lua (or equivalent) for CRDs Argo does not understand. Without that, Applications can stay **Progressing** forever (Ingress controllers that never fill `loadBalancer` status; SealedSecrets; custom operators). Resource actions add UI/API verbs (restart, …) for operators — useful, also an RBAC surface.

---

## 2. Advanced concepts

### mTLS and internal hardening

Recent releases tighten **internal mTLS** and related supply-chain controls between components. When upgrading into those versions, read the upgrade notes — enabling required mTLS without rolling all components correctly causes cryptic control-plane outages.

### Config management plugins

Custom render plugins extend beyond Helm/Kustomize. They increase operational burden (plugin containers, caching, secret-injection temptation). Prefer standard tools; use plugins when the org has a non-negotiable internal renderer — and still keep secrets out of the render cache when possible.

### Skip reconcile / sync windows / freeze

Operational freezes: sync windows, or skipping reconcile on selected Applications during incidents. Document who may freeze and how unfreeze is audited.

### Version literacy

Argo CD 2.x → 3.x and minor upgrades change defaults (tracking, ApplicationSet behavior, hydrator, impersonation maturity). **Pin the version**, read **from→to upgrade guides**, and test on a non-prod management cluster. Do not treat `stable` floating manifests as production policy forever.

---

## 3. Applications and use cases

| Need | Feature |
|------|---------|
| Team owns Application CRs in their ns | Apps in any namespace + Project `sourceNamespaces` |
| Sync must not use cluster-admin SA | Impersonation + destination ServiceAccounts |
| Auditors want exact YAML in Git | Source hydrator / rendered manifest repo |
| Only signed commits to prod | Source integrity / GPG verification |
| CRD never goes Healthy | Custom health |
| SSO groups → who can sync | Dex/OIDC + RBAC + Project roles |

---

## Troubleshooting playbook

| Symptom | Likely causes | What to try |
|---------|---------------|-------------|
| **OutOfSync right after Sync** | ignoreDifferences needed; mutating webhook; prune off; non-deterministic Helm | Diff UI; fix Git or ignore path; enable prune deliberately |
| Stuck **Progressing** | Ingress/LB status empty; StatefulSet quirks; hook Pods; SealedSecret health | Custom health; fix controller status; check hooks |
| Sync **fails** on CRD/order | Waves/hooks; missing CRD; RBAC on destination (or impersonation SA) | Sync waves; install CRDs first; check destination SA permissions |
| “Git changed but Argo quiet” | Poll delay; bad repo creds; wrong revision/path | Webhook; hard refresh; `argocd app get` |
| Cannot **delete** Application | Finalizer; cannot render manifests (broken repo) | Fix repo or delete with cascade false + manual cleanup |
| **Permission denied** for team | Project destination/source; RBAC groups; apps-in-any-ns Project mismatch | Check Project + SSO groups + sourceNamespaces |
| Self-heal **undoes** hotfix | Working as designed | Commit hotfix to Git or temporarily disable self-heal with change control |
| Image never updates | Git still old digest; Image Updater not installed/configured | Trace CI → GitOps commit path ([08](./08_Secrets_CI_Integration_And_Operations.md)) |
| Two tools fight ownership | Label tracking clash | Switch to annotation tracking; audit instance labels |

---

## Staff checklist (additions to [09](./09_Use_Cases_Pitfalls_And_Staff_Checklist.md))

- Resource tracking method understood (annotation preferred for multi-tool clusters)  
- Webhooks or accepted poll latency documented  
- Metrics/notifications cover prod OutOfSync/Degraded  
- `argocd admin export` (or equivalent) backup tested  
- Apps-in-any-namespace / impersonation / hydrator only if intentionally enabled and Project-mapped  
- Upgrade notes read for current minor; version pinned  
- Custom health for critical CRDs that otherwise stick Progressing  

---

## References

- [Security](https://argo-cd.readthedocs.io/en/stable/operator-manual/security/)  
- [Applications in any namespace](https://argo-cd.readthedocs.io/en/stable/operator-manual/app-any-namespace/)  
- [Sync impersonation](https://argo-cd.readthedocs.io/en/stable/operator-manual/app-sync-using-impersonation/)  
- [Source integrity](https://argo-cd.readthedocs.io/en/stable/user-guide/source-integrity/)  
- [Source hydrator](https://argo-cd.readthedocs.io/en/stable/user-guide/source-hydrator/)  
- [Health customization](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/)  
- [FAQ](https://argo-cd.readthedocs.io/en/stable/faq/)  
- [Upgrading](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/overview/)  
