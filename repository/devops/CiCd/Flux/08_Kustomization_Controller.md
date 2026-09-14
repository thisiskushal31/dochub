# 08 — Kustomization: apply YAML the Flux way

[← Previous](./07_ExternalArtifact_And_ArtifactGenerator.md) · [README](./README.md) · [Next: HelmRelease →](./09_HelmRelease_And_Helm_Delivery.md)

---

## 1. Concepts

A Flux **Kustomization** answers: *“Take this folder from that Source, build it, put it on the cluster, and keep it there.”*

Pipeline in order:

1. Fetch the Source’s **artifact**  
2. Optionally **decrypt** Secrets (SOPS)  
3. **Build** (run Kustomize, or invent a `kustomization.yaml` for plain YAML)  
4. Validate, then **apply** (server-side apply)  
5. Optionally **wait** until workloads look healthy  
6. Remember what was applied (**inventory**) so **prune** can delete removed objects later  

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: apps
  namespace: flux-system
spec:
  interval: 10m          # how often to re-check (usually ≥ 60s)
  retryInterval: 2m      # how often to retry after failure
  timeout: 5m            # max time for apply / health wait
  path: ./apps/production
  prune: true            # delete objects that disappeared from Git
  wait: true             # Ready only after health looks good
  targetNamespace: apps  # namespace must exist or be created here
  sourceRef:
    kind: GitRepository
    name: fleet-infra
  dependsOn:
    - name: infra        # wait for another Kustomization first
```

If this succeeds, status shows the Git/OCI **revision** applied and an **inventory** of owned objects.

---

## 2. Advanced concepts

### Order and health (“don’t start the app before the database operator”)

| Field | Plain meaning |
|-------|----------------|
| `dependsOn` | Wait until other Flux objects are Ready (optional CEL `readyExpr`) |
| `healthChecks` | Explicit list of Deployments/CRDs/… that must be healthy |
| CEL health expressions | Custom “is it healthy?” logic when defaults aren’t enough |
| `wait` | Block Ready until health passes |
| `timeout` | Give up waiting after this long |

### Change manifests without forking the whole repo

| Field | Plain meaning |
|-------|----------------|
| `patches` | Inline patches (strategic merge or JSON6902) aimed at selected resources |
| `images` | Change image name/tag/**digest** without writing a patch |
| `namePrefix` / `nameSuffix` | Rename every resource |
| `commonMetadata` | Add labels/annotations to everything |
| `components` | Kustomize components (still experimental — use carefully) |
| `postBuild.substitute` / `substituteFrom` | After build, replace `${cluster_env}`-style vars from a map and/or ConfigMap/Secret |
| `decryption` | Decrypt SOPS-encrypted Secrets in-cluster ([11](./11_Secrets_SOPS_And_Sealed_Secrets.md)) |

Skip substitution on one object with annotation `kustomize.toolkit.fluxcd.io/substitute: disabled`.

### Prune, force, and “don’t fight the HPA”

| Field / annotation | Plain meaning |
|--------------------|----------------|
| `prune: true` | If it’s gone from Git, delete it from the cluster (also when the Kustomization itself is deleted, by default) |
| `deletionPolicy` | On delete: mirror prune, always delete, wait for termination, or **orphan** (leave objects) |
| `kustomize.toolkit.fluxcd.io/prune: disabled` | Never prune this one object |
| `force: true` | Recreate objects when immutable fields change — **use briefly**; prefer per-object `kustomize.toolkit.fluxcd.io/force: enabled` |
| `ignore` | During drift fix, skip these JSON paths (e.g. `/spec/replicas` when HPA owns replicas). Always **scope** with `target` |

Between applies, Flux dry-runs to spot drift and can put fields back.

### Multi-tenant and remote clusters

| Field | Plain meaning |
|-------|----------------|
| `serviceAccountName` | Act as this ServiceAccount while applying (limits blast radius) |
| `sourceRef.namespace` | Use a Source in another namespace — often **blocked** on shared clusters |
| `kubeConfig.secretRef` | Apply to another cluster using a kubeconfig Secret |
| `kubeConfig.configMapRef` | Prefer this: cloud **workload identity** to EKS/AKS/GKE (or generic OIDC) without a long-lived kubeconfig file |

If you set both `kubeConfig` and `serviceAccountName`, Flux logs into the remote API, then impersonates an SA that must exist in the **same namespace name on the remote cluster**.

### Pause

`suspend: true` stops applies and drift fixes until you clear it.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Install operators before apps | Two Kustomizations + `dependsOn` |
| Different values per cluster | `postBuild.substituteFrom` a per-cluster ConfigMap |
| Secrets in Git safely | `decryption.provider: sops` |
| One hub manages many clusters | `kubeConfig` + remote SA |
| HPA owns replica count | Scoped `ignore` on `/spec/replicas` |

**Good:** small Kustomizations with clear owners; rare `force`. **Bad:** one giant Kustomization for everything; `force: true` left on forever; ignore rules with no `target`.

Field-by-field encyclopedia: [Kustomization API](https://fluxcd.io/flux/components/kustomize/kustomizations/).

---

## References

- [Kustomize controller](https://fluxcd.io/flux/components/kustomize/)  
- [Kustomization CRD](https://fluxcd.io/flux/components/kustomize/kustomizations/)  
- [CEL healthchecks](https://fluxcd.io/flux/cheatsheets/cel-healthchecks/)  
- [SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/)  
