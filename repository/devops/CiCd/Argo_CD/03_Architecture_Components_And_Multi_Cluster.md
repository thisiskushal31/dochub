# 03 — Architecture, components, and multi-cluster

[← Previous](./02_Core_Concepts_Applications_Sync_And_Health.md) · [Argo CD](./README.md) · [Next: Install →](./04_Install_Access_And_First_Application.md)

## 1. Concepts

Argo CD runs as a set of Kubernetes components (usually in an `argocd` namespace). You do not need every internal detail to ship an app, but you do need the control-plane shape so incidents and scale decisions make sense.

### Main components

| Component | Responsibility |
|-----------|----------------|
| **API server** | gRPC/REST API for UI, CLI, and automation: Applications, sync/rollback, repo and cluster credentials, auth, RBAC, Git webhooks |
| **Repository server** | Caches Git/OCI content; **renders** manifests (Helm, Kustomize, Jsonnet, plugins) for a given revision and settings |
| **Application controller** | Watches Applications; compares live vs target; performs sync; optional self-heal; runs hooks |
| **Redis** | Cache and transient state (including rendered manifests). Treat access to Redis as sensitive — especially if anyone injects secrets into rendered YAML |
| **ApplicationSet controller** | (When installed) generates Applications from ApplicationSet CRs |
| **Notifications controller** | (Optional) alerts on sync/health events |

 entally: **repo-server renders**, **controller reconciles**, **API server is the front door**.

### How a change becomes a cluster update

1. Someone commits to the tracked Git path (or pushes a new OCI tag), or a webhook notifies Argo CD.  
2. Controller/repo-server **refresh**: fetch revision, render manifests.  
3. Diff against live objects → sync status.  
4. If policy allows (auto-sync or manual Sync), controller **applies** (and optionally prunes).  
5. Health evaluators update Application health from child resources.

### Local cluster vs remote clusters

- **In-cluster destination** `https://kubernetes.default.svc` — Argo CD deploys into the same cluster it runs on (common for getting started and for a dedicated “management” cluster that also hosts platform apps).  
- **Remote clusters** — register another cluster’s API with credentials; Applications set that server as destination. One Argo CD instance can manage many clusters.

Platform pattern: **management cluster** runs Argo CD; **workload clusters** receive apps. Smaller teams often run Argo CD on the same cluster as the apps until multi-tenancy or blast-radius concerns force a split.

## 2. Advanced concepts

### Multi-tenant vs core install

| Install style | Intent |
|---------------|--------|
| **Multi-tenant** (full install) | UI, API, SSO, multi-team — the usual platform install |
| **Core** | Headless: no API/UI; cluster admins drive via kube API / `--core` CLI — fewer moving parts |

Production platforms almost always want the multi-tenant install (and often the **HA** manifest set with multiple replicas). Evaluation laptops can use the non-HA `install.yaml`.

### Namespace-install vs cluster-scoped install

- **Standard install** — includes cluster-scoped permissions so Argo CD can manage the local cluster broadly.  
- **Namespace install** — tighter local privileges; often used when Argo CD only manages *external* clusters with explicit credentials. CRDs may need a separate apply.

Changing the install namespace requires fixing ClusterRoleBindings that hard-code `argocd`.

### Why server-side apply shows up in install docs

Some Argo CD CRDs are large. Client-side `kubectl apply` can fail annotation size limits. Installs commonly use **server-side apply** (with force-conflicts on upgrades). For production, prefer a **pinned version** of the manifests, not only the moving `stable` pointer, once you leave the first experiment.

### Webhooks vs polling

Without webhooks, Argo CD polls repositories on an interval — fine, but slower to notice commits. Configuring Git/forge webhooks to the API server reduces lag for busy repos.

### Scaling pressure points

- **Repo-server** CPU/memory when many large Helm charts render concurrently  
- **Application controller** when thousands of Applications / resources are managed  
- **Redis** and network policies — who can read cached manifests  

HA installs and official sizing guidance exist for large estates; treat “one tiny Redis and 5,000 apps” as a design smell.

### Security boundary of the control plane

Anyone who can change Argo CD’s cluster secrets (repo credentials, cluster kubeconfigs) or bypass Projects can effectively deploy. Harden the `argocd` namespace like a production control plane: RBAC, network policy, SSO instead of shared admin, audited upgrades.

## 3. Applications and use cases

| Situation | Architectural choice |
|-----------|----------------------|
| Single team, one cluster | In-cluster install; start simple; add Projects early |
| Platform team, many product teams | Multi-tenant HA; SSO; strict Projects; maybe dedicated management cluster |
| Regulated prod | Manual sync or sync windows; separate Projects for prod destinations; no shared admin password |
| Edge / many identical clusters | One Argo CD + ApplicationSet cluster generator (or hub-and-spoke design) |
| Air-gapped | Mirror images and Helm/OCI; plan repo access; core vs full depends on whether UI is required |

## References

- [Architecture overview](https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/)  
- [Installation](https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/)  
- [High availability](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)  
- [Cluster management](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-management/)  
