# 07 — ExternalArtifact and ArtifactGenerator

[← Previous](./06_Sources_Git_OCI_Bucket_Helm.md) · [README](./README.md) · [Next: Kustomization →](./08_Kustomization_Controller.md)

## 1. Concepts

Most teams never need this chapter on day one. Skim it; come back when a monorepo hurts.

**ExternalArtifact** — a generic “here is an artifact” object so other controllers can feed Flux the same way source-controller does.

**ArtifactGenerator** (needs the optional **source-watcher** controller) can:

- **Compose** — combine several Sources into one artifact  
- **Decompose** — split a monorepo so `services/auth/` and `services/payments/` get separate artifacts and only the changed path reconciles  

Revisions are often based on **content hash**: same files ⇒ same revision (no useless churn).

## 2. Advanced concepts

Copy rules support globs, exclusions, and YAML merge — see the ArtifactGenerator API for exact operators.

Kustomization can consume ExternalArtifact when the matching feature gate is enabled (confirm current controller flags).

Building your own ExternalArtifact producer is a platform/Go exercise ([toolkit guides](https://fluxcd.io/flux/gitops-toolkit/)).

### When to skip

One repo, one path, one Kustomization — stay on GitRepository ([06](./06_Sources_Git_OCI_Bucket_Helm.md)). Generators add moving parts; they need an owner and tests.

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Independent services in one Git repo | ArtifactGenerator + path patterns |
| Glue several repos into one deploy unit | Compose multiple sources |
| Simple app | Skip this entirely |

**Good:** platform-owned generators. **Bad:** clever generators nobody understands in the prod path.

## References

- [ExternalArtifact](https://fluxcd.io/flux/components/source/externalartifacts/)  
- [ArtifactGenerator](https://fluxcd.io/flux/components/source/artifactgenerators/)  
- [Source watcher guide](https://fluxcd.io/flux/gitops-toolkit/source-watcher/)  
