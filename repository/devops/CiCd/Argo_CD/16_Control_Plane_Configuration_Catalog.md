# 16 — Control-plane configuration catalog

[← Previous](./15_Application_And_Sync_Configuration_Catalog.md) · [Argo CD](./README.md) · [Next: Sources catalog →](./17_Sources_Private_Repos_And_Parameters.md)

---

## 1. Concepts — configuring Argo CD itself

Application CRs describe **workloads**. These resources describe the **control plane**. Good practice: manage them **declaratively in Git** (Kustomize overlay on upstream install manifests, or a dedicated “argocd-config” Application). Label ConfigMaps with `app.kubernetes.io/part-of: argocd` or Argo may ignore them.

### Atomic configuration objects (one name each)

| Resource | Kind | What you configure there |
|----------|------|---------------------------|
| **argocd-cm** | ConfigMap | URL, SSO/Dex/OIDC snippets, resource customizations (health/actions/ignore), inclusions/exclusions, tool enable flags, Kustomize/Helm build options, status badge, anonymous users, help links, compare defaults, … |
| **argocd-cmd-params-cm** | ConfigMap | Process flags as data keys (application namespaces, hydrator enable, controller/server params) — avoids editing Deployments by hand |
| **argocd-rbac-cm** | ConfigMap | RBAC policy CSV + default policy + scopes |
| **argocd-secret** | Secret | Admin password bcrypt, server secret key, webhook secrets, Dex client secrets, … |
| **Repository Secrets** | Secret | Per-repo connection (URL, username/password, SSH, GitHub App, …) |
| **Repo credential templates** | Secret | Creds shared across URL prefixes |
| **argocd-tls-certs-cm** | ConfigMap | Extra CA certs for HTTPS Git |
| **argocd-ssh-known-hosts-cm** | ConfigMap | SSH known_hosts entries |

Multiple **Application** / **AppProject** / repo Secrets may exist; the ConfigMaps above are singletons — merge before apply.

---

## 2. Advanced concepts — what lives in `argocd-cm` (feature groups)

Exact keys grow over releases; group literacy matters more than memorizing every string.

| Group | Examples of what you set | Why |
|-------|--------------------------|-----|
| **URLs** | `url`, `additionalUrls` | SSO redirects, links in UI |
| **Users** | anonymous enabled, session duration, password pattern | Lab vs prod posture |
| **SSO** | `dex.config`, `oidc.config`, connector id | Humans log in via IdP |
| **Status badge** | enable, override URL | README badges |
| **Help / analytics** | chat URL, GA (optional) | Support UX |
| **Resource customizations** | ignoreDifferences, health Lua, actions Lua, knownTypeFields, ignoreResourceUpdates | CRD health, ignore noise, UI actions |
| **Resource filter** | exclusions, inclusions, selectors, respectRBAC | Performance + least watch |
| **Sensitive masking** | mask annotations on Secrets in UI | Reduce shoulder-surf leaks |
| **Labels** | customLabels, event label include/exclude | UI + events |
| **Compare** | `resource.compareoptions` | Default diff behavior |
| **Tools** | helm/kustomize/jsonnet enable; kustomize paths/buildOptions; Helm options | Lock or extend renderers |
| **Tracking** | resource tracking method / instance label / installation ID | Ownership ([10](./10_Ownership_Diffing_Webhooks_And_Observability.md)) |
| **Compression** | manifest compression in cache | Memory at scale |
| **Git** | git settings as documented for your version | Timeouts, subprocess behavior |

**cmd-params** commonly gate: which namespaces may hold Applications, hydrator on/off, impersonation-related flags, log levels, redis, repo-server parallelism. Prefer cmd-params over unique forks of install YAML when possible.

### RBAC (`argocd-rbac-cm`)

Policy language: subjects (SSO groups, local users) → roles → permissions on resources (`applications`, `projects`, `repositories`, …) and actions (`get`, `sync`, `create`, …). Default role for authenticated/anonymous users matters. **Good:** group → role mapping in Git. **Bad:** everyone is admin.

Project-scoped roles + JWTs still apply for automation ([08](./08_Secrets_CI_Integration_And_Operations.md)).

### Secrets and trust

| Secret/CM | Practice |
|-----------|----------|
| argocd-secret | Rotate admin; never commit real secret values to public Git — use Sealed/ESO for the management cluster |
| Repo secrets | Read-only Git tokens; least repos |
| TLS / known_hosts | Required for private CAs and SSH hosts |

### Declarative setup workflow

1. Overlay upstream install (pinned version).  
2. Commit argocd-cm, rbac-cm, cmd-params, repo Secrets (encrypted), Projects.  
3. Root App-of-Apps or kubectl bootstrap once.  
4. Day-2 changes are PRs to that config repo.  

---

## 3. Applications and use cases

| Need | Where to configure |
|------|---------------------|
| Okta/GitHub login | dex/oidc in argocd-cm + external IdP app |
| Cert-manager Certificate shows Healthy | resource.customizations.health.* |
| Ignore Endpoints noise | resource.exclusions or ignoreDifferences |
| Allow Applications in `team-*` ns | cmd-params application.namespaces + Project sourceNamespaces |
| Enable hydrator | cmd-params hydrator.enabled + install-with-hydrator |
| Status badges in README | statusbadge.* in argocd-cm |
| CI can sync one project only | Project role token — not admin password |

### Good vs bad control-plane hygiene

| Good | Bad |
|------|-----|
| Config in Git, reviewed | Live-edit ConfigMaps in prod with no PR |
| Pin Argo version | Untracked `latest` install |
| SSO + RBAC | Anonymous write in prod |
| Encrypted management secrets | Plain kubeconfig for all clusters in a gist |

---

## References

- [Declarative setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)  
- [argocd-cm example](https://argo-cd.readthedocs.io/en/stable/operator-manual/argocd-cm-yaml/)  
- [RBAC](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/)  
- [User management](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/)  
- [cmd-params](https://argo-cd.readthedocs.io/en/stable/operator-manual/argocd-cmd-params-cm-yaml/)  
