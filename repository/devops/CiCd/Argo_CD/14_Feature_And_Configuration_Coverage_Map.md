# 14 — Feature and configuration coverage map

[← Previous](./13_Best_Practices_Topology_And_App_Sizing.md) · [Argo CD](./README.md) · [Next: Application config catalog →](./15_Application_And_Sync_Configuration_Catalog.md)

## 1. Concepts

Argo CD’s upstream docs are large (user guide, operator manual, ApplicationSet, upgrades, developer guide). These chapters cover **operator literacy across the feature surface** and **configuration kinds**. Fields and flags evolve by version — tables here name the surface; pin your version and confirm exact keys in References when implementing.

**Outside handbook depth:** contributing to Argo CD itself, full CLI man pages line-by-line, every SSO vendor click-path. Those appear in the map as “official only” with a pointer — you still know *that the feature exists* and *when to use it*.

### What you should be able to do

After these chapters, you should be able to:

- Explain and operate every major feature area below  
- Know which ConfigMap/Secret/CRD holds a setting  
- Choose good topology ([13](./13_Best_Practices_Topology_And_App_Sizing.md))  
- Walk a website from Git to Synced ([12](./12_Worked_Example_Simple_Website_GitOps.md))  

## 2. Advanced concepts — feature inventory

### A. Core delivery objects

| Feature | What it is | Track |
|---------|------------|-------|
| Application | Deployable unit CRD | [02](./02_Core_Concepts_Applications_Sync_And_Health.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| AppProject | Tenancy / allowlists / roles | [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| ApplicationSet | Generate Applications | [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md) |
| App-of-Apps | Parent Application of Application CRs | [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md), [13](./13_Best_Practices_Topology_And_App_Sizing.md) |
| Sync / refresh / health | Reconcile axes | [02](./02_Core_Concepts_Applications_Sync_And_Health.md) |
| Auto-sync, prune, self-heal, allowEmpty | Sync policy | [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Sync windows | Time-based allow/deny sync | [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md) |
| Sync waves / hooks | Ordered PreSync/Sync/PostSync/… | [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Compare options & **diff strategies** | How live vs desired are compared | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Selective sync / ApplyOutOfSyncOnly | Sync subset vs only OutOfSync | [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Skip reconcile | Pause reconcile on an app | [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Sync via kubectl / server-side paths | Advanced apply mechanics | [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Git configuration (timeouts / git subprocess settings) | Control-plane git behavior | [16](./16_Control_Plane_Configuration_Catalog.md) |
| Rollback / history | `revisionHistoryLimit`, rollback API | [12](./12_Worked_Example_Simple_Website_GitOps.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| App deletion / finalizers | Cascade prune behavior | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| ignoreDifferences | Diff noise control | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md), [15](./15_Application_And_Sync_Configuration_Catalog.md) |
| Resource tracking | annotation / label ownership | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| Orphaned resources | Untracked objects in ns | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| Parameters / overrides | Helm-like overrides / UI overrides | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Multi-source Applications | Several sources per app | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Source hydrator | Commit rendered manifests (beta) | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) |
| Source integrity / GPG | Signed commits/tags | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) |
| **Status badge / info / notices / external URL** | UI metadata | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| **managed-by-url** annotation | Multi-instance / hub-spoke App links | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| **UI scale action** | Scale Deploy/StatefulSet from UI | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) — conflicts with HPA + auto-sync |
| Annotations & labels conventions | Hook/sync-option annotations | [15](./15_Application_And_Sync_Configuration_Catalog.md) |

### B. Manifest sources

| Feature | Track |
|---------|-------|
| Directory YAML/JSON | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Jsonnet | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Helm (values, params, hooks, plugins, skip CRDs/schema/tests, pass-credentials, version) | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Kustomize (images, replicas, components, patches, versions) | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| OCI | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Config management plugins (CMP) | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Tool detection | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Private repos / cred templates | [17](./17_Sources_Private_Repos_And_Parameters.md) |
| Tracking strategies (branch/tag/SHA/semver) | [05](./05_Manifest_Sources_Tracking_And_Immutability.md) |
| Local sync (`--local`) | [04](./04_Install_Access_And_First_Application.md) — lab only |
| Import | [17](./17_Sources_Private_Repos_And_Parameters.md) |

### C. Sync options (complete set)

Each is configurable on the Application and/or resource annotation `argocd.argoproj.io/sync-options` — detail in [15](./15_Application_And_Sync_Configuration_Catalog.md):

`Prune=false|confirm` · `Delete=false|confirm` · `Validate=false` · `SkipDryRunOnMissingResource=true` · `ApplyOutOfSyncOnly=true` · `PrunePropagationPolicy=…` · `PruneLast=true` · `Replace=true` · `Force=true` · `ServerSideApply=true` · `ClientSideApplyMigration=…` · `FailOnSharedResource=true` · `RespectIgnoreDifferences=true` · `CreateNamespace=true` (+ managed namespace metadata)

### D. ApplicationSet generators

List · Cluster · Git (directories/files) · OCI · SCM Provider · Pull Request · Matrix · Merge · Cluster Decision Resource · Plugin · Post-selector — [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md). Also: progressive syncs, controlling resource modification, ApplicationSet-any-namespace, Application deletion behavior, Go templates, **ApplicationSet Web UI** (list/filter/preview — maturity varies by version; treat as alpha/beta until your release marks it stable).

### E. Control-plane configuration kinds

| Kind / name | Role | Track |
|-------------|------|-------|
| `argocd-cm` | General config (URL, SSO snippets, resource customizations, tool toggles, …) | [16](./16_Control_Plane_Configuration_Catalog.md) |
| `argocd-cmd-params-cm` | Component flags / env (namespaces, hydrator, …) | [16](./16_Control_Plane_Configuration_Catalog.md) |
| `argocd-rbac-cm` | RBAC policy CSV | [16](./16_Control_Plane_Configuration_Catalog.md) |
| `argocd-secret` | Admin hash, webhook secrets, Dex secrets, … | [16](./16_Control_Plane_Configuration_Catalog.md) |
| Repo Secrets / cred templates | Git/Helm/OCI auth | [16](./16_Control_Plane_Configuration_Catalog.md), [17](./17_Sources_Private_Repos_And_Parameters.md) |
| `argocd-tls-certs-cm` | Extra TLS trust for Git HTTPS | [16](./16_Control_Plane_Configuration_Catalog.md) |
| `argocd-ssh-known-hosts-cm` | SSH known_hosts | [16](./16_Control_Plane_Configuration_Catalog.md) |
| Declarative Applications/Projects | GitOps the GitOps | [16](./16_Control_Plane_Configuration_Catalog.md) |

### F. Install, network, scale, security

| Feature | Track |
|---------|-------|
| Multi-tenant / HA / namespace / core installs | [03](./03_Architecture_Components_And_Multi_Cluster.md), [04](./04_Install_Access_And_First_Application.md), [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Ingress / TLS / mTLS / root path | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Cluster add / credentials / bootstrapping | [03](./03_Architecture_Components_And_Multi_Cluster.md), [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Apps in any namespace | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) |
| Sync impersonation | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) |
| SSO / Dex / OIDC / RBAC / project tokens | [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md), [08](./08_Secrets_CI_Integration_And_Operations.md), [16](./16_Control_Plane_Configuration_Catalog.md) |
| Secret management patterns | [08](./08_Secrets_CI_Integration_And_Operations.md) |
| Webhooks (Git/OCI) | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| Notifications | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md), [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Metrics | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| Health customizations / resource actions | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md), [16](./16_Control_Plane_Configuration_Catalog.md) |
| Manifest compression / dynamic cluster distribution | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Disaster recovery export/import | [10](./10_Ownership_Diffing_Webhooks_And_Observability.md) |
| Web-based terminal / UI customization / deep links / custom tools / styles | [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| GPG / signed release assets | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md), [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Feature maturity / upgrades | [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md), [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |

### G. Companion / related (not core install)

| Piece | Track |
|-------|-------|
| Argo CD Image Updater | [08](./08_Secrets_CI_Integration_And_Operations.md) |
| Argo Rollouts | [Argo_Rollouts](../Argo_Rollouts/README.md) |
| OpenGitOps posture | [01](./01_What_Is_Argo_CD_And_Why_GitOps.md) |

### H. Deeper upstream essays

| Area | Notes |
|------|-------|
| Full `argocd` CLI command reference | Huge; version-specific — use `--help` + official commands docs |
| Per-IdP cookbooks (Auth0, Okta, Keycloak, …) | Same OIDC/Dex pattern; vendor UIs change |
| Per-notification-service YAML (Slack, Teams, PagerDuty, …) | Same triggers/templates model — class covered in [18](./18_Platform_Ingress_HA_UI_And_Extras.md) |
| Per–version-pair upgrade changelogs | Always read upstream for *your* from→to pair |
| Developer guide / releasing Argo CD / e2e internals | Contributor process, not day-2 operator literacy |
| Long CVE-history essays | Security model + practices in [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md); CVE detail stays upstream |

## 3. Applications and use cases

Use this map when designing a platform checklist: walk tables A–G and mark “we use / we defer / N/A.” Anything marked “we use” should have a Git-managed config owner.

## References

- [User guide index](https://argo-cd.readthedocs.io/en/stable/user-guide/)  
- [Operator manual index](https://argo-cd.readthedocs.io/en/stable/operator-manual/)  
- [Declarative setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)  
- [ApplicationSet](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/)  
