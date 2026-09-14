# 10 — Artifacts, feeds, and packages

[← Previous](./09_Environments_Approvals_Checks_And_Classic_Releases.md) · [README](./README.md) · [Next: App Service deploy →](./11_Deploy_App_Service_Functions_And_Static_Web.md)

---

## 1. Concepts

Two related but different ideas:

| Kind | Role |
|------|------|
| **Pipeline artifacts** / **build drops** | Files produced by a run (binaries, zip, manifests) published for later stages or release |
| **Azure Artifacts feeds** | Versioned package repositories (NuGet, npm, Maven, Python, Universal Packages, Cargo, …) |

Also common: push **container images** to **Azure Container Registry** (or other registries) — image digest is the immutable artifact ([CiCd/4](../4_Artifacts_And_Registries.md)).

```text
build job → publish pipeline artifact / push package / push image@digest
  → deploy job downloads or pulls that exact bit
```

---

## 2. Advanced concepts

### Publish and download

`PublishPipelineArtifact` / `DownloadPipelineArtifact` (and older `PublishBuildArtifacts`) move drops between jobs/stages. Prefer pipeline artifacts for new YAML.

### Feeds and upstreams

Feeds can include **upstream sources** (nuget.org, npmjs) with caching and control. Scope feed permissions; public feeds are rare in enterprises.

### Retention

**Retention policies** control how long runs, artifacts, and releases are kept (project/org settings; leases can pin important runs). Align with compliance: how long must a prod bit stay downloadable vs rebuildable from Git+digest. Classic releases had their own retention UI — inventory it before migration.

### Symbols / debugging

Publishing symbols for .NET debugging is a common Artifacts-adjacent pattern — know it exists for Windows estates.

---

## 3. Applications and use cases

| Output | Store |
|--------|-------|
| Web deploy zip | Pipeline artifact → App Service task |
| Internal NuGet | Azure Artifacts feed |
| Container | ACR by digest |
| Mixed | Feed for libraries + ACR for runtime image |

**Good:** promote by digest/version immutably. **Bad:** “latest” tags as the only prod pointer.

---

## References

- [Pipeline artifacts](https://learn.microsoft.com/en-us/azure/devops/pipelines/artifacts/pipeline-artifacts)  
- [Azure Artifacts](https://learn.microsoft.com/en-us/azure/devops/artifacts/)  
- [Build and release retention](https://learn.microsoft.com/en-us/azure/devops/pipelines/policies/retention)  
- [Publish NuGet / npm / …](https://learn.microsoft.com/en-us/azure/devops/pipelines/artifacts/artifacts-overview)  
