# 18 — Platform extras: ingress, HA, UI, clusters, and day-2 surfaces

[← Previous](./17_Sources_Private_Repos_And_Parameters.md) · [Argo CD](./README.md)

## 1. Concepts — everything else operators configure

Chapters 15–17 cover Application and source config. This chapter covers **exposing**, **hardening**, **scaling**, and **UI/ops extras** so the feature map in [14](./14_Feature_And_Configuration_Coverage_Map.md) has a home for each remaining class.

### Exposing the API / UI

| Method | Use |
|--------|-----|
| Port-forward | Labs only |
| LoadBalancer Service | Quick cloud expose; lock down with auth |
| Ingress / Gateway API | Production pattern — TLS at ingress or passthrough |
| Service mesh (Istio, …) | When mesh is already standard |

Configure **`url` in argocd-cm** to the external HTTPS URL before SSO. Root path / base path settings matter behind reverse proxies. Upstream documents patterns for nginx, Contour, Traefik, ALB, GCLB, Ambassador, Istio, Gateway API — pick one platform standard; do not invent a new ingress per team.

**TLS:** terminate at ingress with real certs (cert-manager) or pass through to argocd-server. Avoid permanent `--insecure` CLI culture. **mTLS** between components is tightened in newer versions — follow upgrade notes ([11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)).

### High availability

HA manifests run multiple replicas of API server, repo-server, application controller (sharding), Redis HA as designed by upstream. Use HA for any shared org control plane. Pair with anti-affinity and resource requests. Non-HA `install.yaml` is evaluation-grade.

Related scale features:

| Feature | Role |
|---------|------|
| Manifest compression | Reduce memory for large live caches |
| Dynamic cluster distribution / sharding | Spread controller load across clusters |
| resource.exclusions | Do not watch noisy kinds (Events already excluded by default patterns) |
| Repo-server parallelism / resources | Helm-heavy estates |

### Cluster management

| Action | Meaning |
|--------|---------|
| Register cluster | Secret with kubeconfig/exec creds; destination `server` or `name` |
| In-cluster | `https://kubernetes.default.svc` |
| Namespace-scoped install | Limited local rights; still manage external clusters |
| Cluster add-ons via ApplicationSet | [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md) |
| Bootstrapping | App-of-Apps / declarative Projects |

Least-privilege cluster credentials; prefer impersonation for sync identity where enabled ([11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)).

## 2. Advanced concepts — UI and operator feature catalog

| Feature | What it does | Practice |
|---------|--------------|----------|
| **Web UI** | Apps, sync, diff, logs, resource tree | Primary human interface |
| **CLI** | Automation + power users | Version-align CLI with server |
| **Web-based terminal** | Exec into pods from UI | Disable or RBAC-tight in regulated envs |
| **UI customization / custom styles** | Branding, CSS | Optional |
| **Deep links** | Links from resources to external systems | Nice for tickets/docs |
| **Custom tools** | Extra binaries in repo-server | Platform-owned images |
| **Resource actions** | Buttons/API to patch/restart/… | Custom Lua in argocd-cm; audit who can run |
| **Resources view / scale controls** | Inspect and scale | Prefer Git for durable replica changes unless HPA |
| **Status badges** | SVG/API badges for READMEs | Enable in argocd-cm |
| **External URL / info / notices** | App metadata in UI | Document owners and runbooks |
| **Notification subscriptions** | Per-app or ns subscriptions | Slack/Teams/Pager — [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| **Metrics** | Prometheus endpoints | Alert on sync/health |
| **Git webhooks / OCI webhooks** | Fast refresh | Secrets + payload limits |
| **Reconcile settings** | Timeouts, rates | Tune under load |
| **Signed release assets** | Verify Argo CD images/manifests you install | Supply chain for the control plane |
| **Feature maturity flags** | Alpha/beta features | Hydrator, impersonation — explicit enable |
| **Upgrades** | Versioned guides | Always read from→to |
| **Troubleshooting guides** | Upstream runbooks | Pair with [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) playbook |
| **Extensions** (UI/proxy) | Third-party UI extensions | Platform review before install |
| **managed-by-url** | `argocd.argoproj.io/managed-by-url` on Applications managed by another Argo CD instance so UI links open the right control plane (hub-and-spoke / multi-instance App-of-Apps) | Required when parent and child live on different Argo CDs |
| **UI Scale action** | Scale Deployment/StatefulSet replicas from the UI | Break-glass only — auto-sync or HPA will overwrite; durable scale belongs in Git (or omit replicas for HPA) |
| **ApplicationSet Web UI** | Native list/filter/detail/preview for ApplicationSets (newer releases) | Confirm maturity on your version |
| **Git configuration** | Timeouts and git-related control-plane settings (argocd-cm / cmd-params for your version) | Tune under large-repo load |

### Notifications (configuration kinds)

Triggers (on sync failed, degraded, …) · templates · services (Slack, email, PagerDuty, webhook, …) · subscriptions · monitoring of the notifications controller. Namespace-based config helps when Applications live outside `argocd`.

### Security extras checklist

- SSO required for humans  
- RBAC default deny-ish  
- Admin password rotated; local admin break-glass only  
- Network policies around redis/repo-server  
- Webhook authenticated if public  
- Terminal disabled unless needed  
- Impersonation SAs least-privilege  
- Management cluster treated as tier-0  

## 3. Applications and use cases — putting the platform together

### Recommended production baseline

1. HA install, pinned version  
2. Ingress + real TLS; `url` set  
3. SSO + RBAC; Projects per team  
4. Declarative argocd-cm / rbac / repos in Git  
5. Webhooks + metrics + notifications  
6. Annotation resource tracking  
7. Backup via declarative Git + `argocd admin export` tested  
8. Image Updater or CI digest commits — not both fighting  
9. Rollouts installed only if progressive delivery required  

### Lab baseline

Non-HA, port-forward, `default` Project briefly, one website Application ([12](./12_Worked_Example_Simple_Website_GitOps.md)) — then immediately practice Projects and declarative Application CRs before habits harden.

### After this chapter

You have walked every **feature class** in [14](./14_Feature_And_Configuration_Coverage_Map.md). For field-level YAML on a specific minor version, open the References below for that version — the handbook taught **what exists, why, and how to choose**.

## References

- [Ingress](https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/) · [TLS](https://argo-cd.readthedocs.io/en/stable/operator-manual/tls/) · [mTLS](https://argo-cd.readthedocs.io/en/stable/operator-manual/mtls/)  
- [High availability](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)  
- [Cluster management](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-management/)  
- [Metrics](https://argo-cd.readthedocs.io/en/stable/operator-manual/metrics/) · [Notifications](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)  
- [Web-based terminal](https://argo-cd.readthedocs.io/en/stable/operator-manual/web_based_terminal/) · [UI customization](https://argo-cd.readthedocs.io/en/stable/operator-manual/ui-customization/) · [Deep links](https://argo-cd.readthedocs.io/en/stable/operator-manual/deep_links/)  
- [Resource actions](https://argo-cd.readthedocs.io/en/stable/operator-manual/resource_actions/)  
- [Upgrading](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/overview/) · [Feature maturity](https://argo-cd.readthedocs.io/en/stable/operator-manual/feature-maturity/)  
- [Signed release assets](https://argo-cd.readthedocs.io/en/stable/operator-manual/signed-release-assets/)  
