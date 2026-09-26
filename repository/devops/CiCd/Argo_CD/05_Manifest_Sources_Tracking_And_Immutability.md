# 05 — Manifest sources, tracking, and immutability

[← Previous](./04_Install_Access_And_First_Application.md) · [Argo CD](./README.md) · [Next: Sync and Projects →](./06_Sync_Policies_Waves_Projects_And_RBAC.md)

## 1. Concepts

Argo CD does not invent a new templating language. It **renders** Kubernetes manifests from tools you already use, then syncs the result.

### Supported source shapes

| Source | What you point at |
|--------|-------------------|
| **Directory** | Folder of YAML/JSON (and optionally Jsonnet) |
| **Helm** | Chart in Git, Helm repo, or OCI |
| **Kustomize** | `kustomization.yaml` tree |
| **OCI** | Manifests or charts stored as OCI artifacts |
| **Config management plugin** | Custom render (use sparingly; operational cost is real) |
| **Multiple sources** | One Application combining several sources (pattern for chart + values from different repos) |

### Separate config repo from app source

Keep **application source code** and **deploy manifests** in different repositories when you can:

- Config-only commits (replica tweaks, env values) do not rebuild the app.  
- Git history for production is readable.  
- Permissions split: many can push app code; fewer can push prod manifests.  
- CI that commits image digests into the *same* app repo can loop or blur audit trails.

Monorepos can still separate `apps/` (code) from `deploy/` (manifests) with CODEOWNERS — the principle is separation of *concern and access*, not necessarily two Git remotes.

### Tracking strategies (what “revision” means)

| Strategy | Behavior | Typical env |
|----------|----------|-------------|
| **Branch / HEAD** | Follow tip of branch | Shared DEV |
| **Git tag** | Track a tag (retag moves meaning) | Staging / controlled promote |
| **Commit SHA** | Immutable pin | Production |
| **SemVer constraint on tags** | Resolve newest matching tag | Pre-prod automation — understand prerelease rules |
| **Helm chart version / range** | Pin chart version in prod; ranges accept upstream chart drift | Chart consumers |

Promotion often means: CI or a human updates `targetRevision` or the image digest *inside* the manifests, then Argo syncs. Environment branches are optional; many teams use **one trunk** of manifests with **paths or overlays per env** ([Methodologies/4](../../Methodologies/4_Branching_And_PR_Practices.md), [CiCd/8](../8_Environments_Promotion_And_Approvals.md)).

### Image references

Prefer **changing SemVer or build tags** (or digests) in GitOps — every environment, including DEV. Floating `:latest` makes “Synced” meaningless for debug, security, and rollback; Helm values stuck on `latest` often **do not refresh** the image because the tag string never changes ([4](../4_Artifacts_And_Registries.md), [12](../12_Release_Versioning_And_Changelogs.md)). Use Image Updater / Flux image automation / CI MRs to keep the tag moving.

### Example GitOps layout

```text
gitops/
  apps/
    myapi/
      base/           # or chart/
      overlays/
        dev/
        staging/
        prod/
  platform/           # optional: Application CRs, Projects, ApplicationSets
```

Each overlay path becomes an Application (or an ApplicationSet output).

## 2. Advanced concepts

### Immutability traps

Rendered meaning can change **without** your Git commit changing when you depend on:

- a remote Kustomize base at `main` / unpinned ref  
- a Helm chart version range that picks a new chart  
- mutable image tags  

Pin bases (`?ref=vX.Y.Z` or commit SHA), pin chart versions in prod, pin image digests.

### Parameter overrides

UI/CLI parameter overrides can shadow Git. They are useful for emergencies and toxic for “Git is source of truth.” Prefer committing the change; treat live overrides as break-glass and remove them.

### Helm-specific literacy

Argo CD can pass value files, parameters, and release names. Know whether you store values in Git beside the chart or reference a chart from a registry with values in Git (common). Helm hooks vs Argo hooks are different mechanisms — do not assume Helm pre-install hooks behave like Argo PreSync without reading both.

### Kustomize-specific literacy

Overlays for env differences (replicas, Ingress host, ConfigMap) keep base DRY. Remote bases must be pinned. Huge overlays slow repo-server renders.

### Ignoring HPA-owned fields

If HPA owns replicas, **omit `replicas` from Git** so you are not fighting the autoscaler. ignoreDifferences is a backup, not the design.

### Multi-source Applications

Useful when the chart lives upstream and values live in your org repo. Complexity rises (permissions, pins, debugging diffs). Start single-source unless you have a clear split.

### Rendered manifests / source hydrator

Some teams commit **fully rendered** YAML to Git (after Helm/Kustomize) so reviews show exact cluster objects. Argo CD’s **source hydrator** (beta on recent versions) can automate pushing hydrated manifests before sync. Optional maturity step — see [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md).

## 3. Applications and use cases

| Team need | Source approach |
|-----------|-----------------|
| Simple microservice | Directory or Kustomize overlay per env |
| Shared internal platform chart | Helm chart + values per env in GitOps repo |
| Consume third-party operator | Helm/OCI with **pinned** chart version; review upgrades as commits |
| Many services, same shape | Kustomize components or ApplicationSet + directory generator |
| Fast DEV, strict prod | DEV tracks branch tip; prod tracks SHA or release tag + digest |

### Promotion mental model

```text
CI builds image@sha256:abc
  → PR/commit to gitops overlays/staging (digest abc)
  → Argo syncs staging
  → after verify, same digest committed to overlays/prod
  → Argo syncs prod (manual or gated auto)
```

Same artifact, different Git paths — not “rebuild for prod” ([4](../4_Artifacts_And_Registries.md)).

## References

- [Tracking strategies](https://argo-cd.readthedocs.io/en/stable/user-guide/tracking_strategies/)  
- [Best practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)  
- [Helm](https://argo-cd.readthedocs.io/en/stable/user-guide/helm/) · [Kustomize](https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/) · [OCI](https://argo-cd.readthedocs.io/en/stable/user-guide/oci/)  
- [Artifacts](../4_Artifacts_And_Registries.md) · [Versioning](../12_Release_Versioning_And_Changelogs.md)  
