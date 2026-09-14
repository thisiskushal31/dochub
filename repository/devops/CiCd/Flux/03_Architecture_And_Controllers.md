# 03 — Architecture: which controller does what

[← Previous](./02_Core_Concepts_Sources_And_Reconciliation.md) · [README](./README.md) · [Next: Install →](./04_Install_Bootstrap_And_CLI.md)

---

## 1. Concepts

Flux is not one program. It is a **small set of controllers** (Pods) that each own one job. They usually run in the `flux-system` namespace after bootstrap.

| Controller | Job in plain words | Default? |
|------------|--------------------|----------|
| **source-controller** | Download Git/OCI/Bucket/Helm sources; store artifacts | Yes |
| **kustomize-controller** | Apply Kustomization objects | Yes |
| **helm-controller** | Run Helm installs/upgrades from HelmRelease | Yes |
| **notification-controller** | Send alerts; receive Git webhooks | Yes |
| **image-reflector-controller** | Scan container registries for tags | Optional |
| **image-automation-controller** | Commit new image tags/digests back to Git | Optional |
| **source-watcher** | Build/split artifacts (ArtifactGenerator) | Optional |

```text
  source-controller  ──artifact──►  kustomize / helm controllers  ──►  cluster
         ▲                                  │
         │                         notification-controller
         │                              (Slack out / webhook in)
  image-reflector ──► image-automation ──commit──► Git ──► sources again
```

**Flagger** (canaries) is **not** one of these default controllers — install it separately ([17](./17_Flagger_Progressive_Delivery.md)).

Tip: Flux registers resource categories so you can list many Flux kinds with one command (see [categories cheatsheet](https://fluxcd.io/flux/cheatsheets/crd-resource-categories/)).

---

## 2. Advanced concepts

### Why a toolkit?

You enable only what you operate. Need Git + Kustomize? Core set. Need auto digest bumps? Add image controllers. Need monorepo path splitting? Add source-watcher ([07](./07_ExternalArtifact_And_ArtifactGenerator.md)).

Platform teams can also build custom controllers that speak Flux Source APIs — most product teams never do.

### Knobs on controllers

Each controller has flags (concurrency, feature gates, …). Change them with metrics and change control ([16](./16_Scale_Multitenancy_And_Platform_Config.md)) — not by copying random blog flags.

### Multi-cluster shapes

Common choices: **one Flux per cluster** (fleet Git path per cluster), a **hub** that applies to spokes via `kubeConfig`, or **OCI-per-cluster** (Gitless). Pick deliberately ([10](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md)).

---

## 3. Applications and use cases

| Your estate | Controllers to plan for |
|-------------|-------------------------|
| Git + YAML/Kustomize apps | source + kustomize + notification |
| Lots of Helm | + helm |
| Auto staging digests | + image reflector & automation |
| Huge monorepo paths | + source-watcher |
| Canary releases | + Flagger (separate) |

**Good:** every enabled controller has an owner. **Bad:** turn on every optional component “just in case.”

---

## References

- [GitOps Toolkit components](https://fluxcd.io/flux/components/)  
- [Optional components](https://fluxcd.io/flux/installation/configuration/optional-components/)  
