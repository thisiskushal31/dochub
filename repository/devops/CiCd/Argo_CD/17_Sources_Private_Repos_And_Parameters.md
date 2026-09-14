# 17 — Sources in depth: Helm, Kustomize, OCI, plugins, private repos

[← Previous](./16_Control_Plane_Configuration_Catalog.md) · [Argo CD](./README.md) · [Next: Platform extras →](./18_Platform_Ingress_HA_UI_And_Extras.md)

---

## 1. Concepts — every way Argo CD gets manifests

| Source type | How you point Application at it | Typical use |
|-------------|----------------------------------|-------------|
| **Directory** | `path` to YAML/JSON (optional recurse, include/exclude) | Simple apps, raw manifests |
| **Jsonnet** | Directory + `directory.jsonnet` extVars/TLAs | Jsonnet shops |
| **Helm** | Git path chart **or** `chart` + helm repo/OCI; `helm:` block | Most packaged apps |
| **Kustomize** | Path with `kustomization.yaml`; `kustomize:` block | Overlays per env |
| **OCI** | OCI URL as source | Registries as artifact store |
| **Plugin (CMP)** | `plugin:` name/env/parameters | Internal renderers |
| **Multi-source** | `sources:` list (+ `ref` for Helm values from another source) | Chart upstream + values in org Git |
| **Hydrated** | `sourceHydrator` dry vs sync sources | Rendered-manifest pattern ([11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)) |

Tool detection chooses Helm vs Kustomize vs directory from filesystem cues unless you force config. You can disable tools globally in `argocd-cm` (`helm.enable`, etc.).

### Private repositories

| Method | Notes |
|--------|-------|
| HTTPS user/password or token | Common for GitHub/GitLab/Bitbucket |
| SSH private key | known_hosts must include host |
| GitHub App | Preferred over PATs for orgs |
| Cloud IAM / workload identity patterns | Per-cloud docs for your version |
| Credential templates | One secret covers all repos under a URL prefix |
| Helm repo / OCI creds | Separate secrets; `passCredentials` carefully with Helm |

Store as declarative Secrets (encrypted). Test `argocd repo add` in lab; commit the Secret manifest for prod.

---

## 2. Advanced concepts — per-tool configuration catalog

### Directory

| Setting | Role |
|---------|------|
| `directory.recurse` | Descend into subfolders |
| `include` / `exclude` | Glob filters |
| Jsonnet `extVars` / `tlas` | Jsonnet parameters |

### Helm (`spec.source.helm` / multi-source)

| Setting | Role | Practice |
|---------|------|----------|
| `valueFiles` / glob patterns | Values overlays | Values in Git; pin chart version |
| `values` / `valuesObject` | Inline values | Small overrides; prefer files for big YAML |
| `parameters` / `fileParameters` | `--set` / `--set-file` | Escape dots; `forceString` |
| `releaseName` | Helm release name | Stable name for hooks/history |
| `ignoreMissingValueFiles` | Tolerate absent files | Use sparingly |
| `skipCrds` / `skipSchemaValidation` / skip tests | Chart install behavior | Know blast radius of skipCrds |
| `version` (v2/v3) / `kubeVersion` / `apiVersions` | Template environment | Match target cluster |
| `namespace` | Helm template namespace | Defaults to destination ns |
| `passCredentials` | Pass repo creds to chart deps | Security-sensitive |
| Helm hooks vs Argo hooks | Different systems | Prefer Argo waves for GitOps clarity when possible |
| Random data in charts | Non-deterministic → perpetual OutOfSync | Fix chart or ignore carefully |
| Helm plugins | Need tools in repo-server image | Platform-owned image |

Helm **value precedence** matters (parameters vs values files vs chart defaults) — resolve conflicts intentionally.

### Kustomize (`spec.source.kustomize`)

| Setting | Role |
|---------|------|
| `namePrefix` / `nameSuffix` | Rename |
| `commonLabels` / `commonAnnotations` (+ envsubst) | Metadata |
| `images` | Image overrides (digest-friendly) |
| `replicas` | Replica overrides |
| `components` / `ignoreMissingComponents` | Kustomize components |
| `patches` | Strategic/JSON patches |
| `forceCommonLabels` / `labelWithoutSelector` / `labelIncludeTemplates` | Label application rules |
| `version` / `kubeVersion` / `apiVersions` | Binary + template env |
| `namespace` | Set namespace |

Remote bases: **always pin** `ref=` ([05](./05_Manifest_Sources_Tracking_And_Immutability.md), [13](./13_Best_Practices_Topology_And_App_Sizing.md)).

### OCI

Point at OCI artifact holding manifests or charts. Auth via registry credentials. Good for “artifact is the desired state” pipelines that already push to GHCR/ECR/ACR/Harbor.

### Config management plugins

Sidecar or configured CMP renders manifests. Pass `plugin.env` and `parameters`. Discovery rules can auto-match. **Operational cost is high** — use for real org standards, not convenience. Never use primarily to inject secrets ([08](./08_Secrets_CI_Integration_And_Operations.md)).

### Parameters and build environment

Argo injects build env vars (app name, revision, …) usable in some tooling. Parameter overrides from UI/CLI can shadow Git — treat as break-glass ([05](./05_Manifest_Sources_Tracking_And_Immutability.md)).

### Multi-source

Example pattern: source 0 = Helm chart from upstream OCI; source 1 = Git repo of values (`ref:`). Pins and RBAC apply per source. Debug complexity rises — start single-source unless split is required.

### Import

Import existing cluster resources into an Application’s management (migration aid). After import, Git must become the source of truth or you recreate dual-ownership pain.

---

## 3. Applications and use cases

| Scenario | Source choice |
|----------|---------------|
| Static website YAML | Directory or Kustomize overlays ([12](./12_Worked_Example_Simple_Website_GitOps.md)) |
| Third-party operator | Helm chart **pinned** version + values in Git |
| Internal microservice | Kustomize base + env overlays **or** Helm umbrella |
| Values must stay in org Git, chart upstream | Multi-source |
| Rendered YAML only in prod | Hydrator or CI-rendered commit |
| Private GitHub org | GitHub App cred + known TLS |

### Good vs bad

| Good | Bad |
|------|-----|
| Pin chart `1.2.3` in prod | Chart `*` in prod |
| Values files reviewed in PRs | Only UI Helm parameter overrides forever |
| Separate GitOps repo | Digests committed to app repo causing rebuild loops |
| CMP with platform SLOs | Every team invents a plugin |

---

## References

- [Application sources](https://argo-cd.readthedocs.io/en/stable/user-guide/application_sources/)  
- [Helm](https://argo-cd.readthedocs.io/en/stable/user-guide/helm/) · [Kustomize](https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/) · [OCI](https://argo-cd.readthedocs.io/en/stable/user-guide/oci/) · [Directory](https://argo-cd.readthedocs.io/en/stable/user-guide/directory/) · [Jsonnet](https://argo-cd.readthedocs.io/en/stable/user-guide/jsonnet/)  
- [Private repositories](https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/)  
- [Multiple sources](https://argo-cd.readthedocs.io/en/stable/user-guide/multiple_sources/)  
- [Config management plugins](https://argo-cd.readthedocs.io/en/stable/operator-manual/config-management-plugins/)  
- [Tracking strategies](https://argo-cd.readthedocs.io/en/stable/user-guide/tracking_strategies/)  
