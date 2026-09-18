# 02 — Core concepts: sources and reconciliation

[← Previous](./01_What_Is_Flux_And_GitOps_Toolkit.md) · [README](./README.md) · [Next: Architecture →](./03_Architecture_And_Controllers.md)

## 1. Concepts

Think of Flux as two steps that repeat forever:

1. **Fetch** the desired state from somewhere (Git, OCI, …) → package it as an **artifact**.  
2. **Apply** that artifact to the cluster and check that it worked.

### Words you will see everywhere

| Term | Plain meaning |
|------|----------------|
| **Source** | “Where do the files live, and how do I log in?” — e.g. `GitRepository`, `OCIRepository`, `Bucket`, Helm chart sources |
| **Artifact** | The snapshot Flux stored after a successful fetch (what apply uses) |
| **Reconciliation** | “Make the cluster match that snapshot” (and keep checking) |
| **Kustomization** (Flux object) | “Apply this folder from that Source” (Kustomize or plain YAML) |
| **HelmRelease** | “Install/upgrade this Helm chart the GitOps way” |
| **Ready** | Status saying the last reconcile succeeded (see conditions for detail) |
| **Inventory** | List of objects this apply owns — used later to **prune** (delete) removed things |

### Tiny example

```yaml
# 1) Fetch from Git
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/org/app-config
  ref:
    branch: main
---
# 2) Apply a path from that fetch
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 10m
  path: ./deploy/production
  prune: true
  sourceRef:
    kind: GitRepository
    name: my-app
```

Flux re-checks Sources on an **interval**, and can react sooner via **webhooks** ([14](./14_Notifications_Alerts_And_Receivers.md)). When the Source gets a new revision, delivery objects apply it — usually right away, not only when their own timer fires.

## 2. Advanced concepts

### Gitless GitOps

With `OCIRepository`, the **cluster** can depend on a container registry instead of talking to Git. People may still edit Git; CI publishes an OCI config artifact (`flux push artifact`). Often paired with Flux Operator OCI sync ([04](./04_Install_Bootstrap_And_CLI.md)).

### Share one Source

Many Kustomizations/HelmReleases can point at the same Source — one fetch, many consumers. Git also supports `include` / sparse checkout to shape what goes into the artifact ([06](./06_Sources_Git_OCI_Bucket_Helm.md)).

### Suspend

Setting `suspend: true` pauses work on that object. Use for break-glass; don’t leave production suspended by accident.

### Sync vs “is the app healthy?”

**Ready on a Flux object** means “Flux finished its job for this object.” Pods can still crash. Use health waits / checks on Kustomizations ([08](./08_Kustomization_Controller.md)) and your normal app monitoring.

### Drift

After a successful apply, Flux can detect someone changed the cluster out of band and put it back (Kustomize path uses server-side apply; Helm has its own drift modes — [08](./08_Kustomization_Controller.md), [09](./09_HelmRelease_And_Helm_Delivery.md)).

## 3. Applications and use cases

| Need | Start with |
|------|------------|
| App YAML in Git | GitRepository + Kustomization |
| Cluster must not call Git | OCIRepository |
| Third-party Helm chart | HelmRepository + HelmRelease |
| Faster than waiting for the poll | Receiver webhook |

**Good:** pin tags/digests on purpose. **Bad:** always track mutable `latest`.

## References

- [Core concepts](https://fluxcd.io/flux/concepts/)  
- [Source controllers](https://fluxcd.io/flux/components/source/)  
- [OCI artifacts cheatsheet](https://fluxcd.io/flux/cheatsheets/oci-artifacts/)  
