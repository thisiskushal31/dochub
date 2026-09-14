# 09 — HelmRelease: Helm the GitOps way

[← Previous](./08_Kustomization_Controller.md) · [README](./README.md) · [Next: Repo structure →](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md)

---

## 1. Concepts

Helm is still Helm. Flux’s **HelmRelease** object says: *“This chart, these values, keep the release matching Git.”*

You do **not** run `helm upgrade` from CI for that release anymore. You change the HelmRelease (or its values) in Git; helm-controller does the Helm actions.

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: podinfo
  namespace: default
spec:
  interval: 10m
  timeout: 5m
  chart:
    spec:
      chart: podinfo
      version: "6.5.0"    # pin in production
      sourceRef:
        kind: HelmRepository
        name: podinfo
        namespace: flux-system
  values:
    replicaCount: 2
```

Charts can also come from Git or OCI — see the HelmRelease reference for `chartRef` / chart template shapes.

---

## 2. Advanced concepts

### Where values come from

| Mechanism | Meaning |
|-----------|---------|
| `valuesFrom` | Ordered ConfigMaps/Secrets; later entries win; supports `optional`, `valuesKey`, `targetPath`, and `literal` (raw strings, like `helm --set-literal`) |
| `values` | Inline map merged on top |

Changing the **combined** values triggers a new release. Keep secrets out of plaintext inline values ([11](./11_Secrets_SOPS_And_Sealed_Secrets.md)).

### Install / upgrade / rollback behavior

HelmRelease has blocks for install, upgrade, test, rollback, and uninstall (hooks, wait, CRD policy, remediation retries, …). Read the API when you need a specific Helm flag equivalent — don’t guess.

Also common: `dependsOn`, `serviceAccountName` (impersonation), `kubeConfig` (remote cluster), post-renderers, release name / namespaces / history size.

### Drift detection

`.spec.driftDetection.mode` can be off, `warn`, or `enabled` (detect and correct). Ignore paths like `/spec/replicas` when HPA owns them — always **scope** ignores. Annotation `helm.toolkit.fluxcd.io/driftDetection: disabled` excludes a rendered resource.

### Jobs around an app

Kubernetes Jobs are awkward to update in place. Flux’s running-jobs use-case uses **separate Kustomizations** (pre → app → post) with `dependsOn`, `wait`, and often `force` on Jobs — see that guide rather than overloading Helm hooks alone.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Third-party operator | HelmRepository + pinned HelmRelease |
| Values per environment | valuesFrom per cluster |
| HPA manages replicas | driftDetection.ignore on replicas |
| Ordered bring-up | dependsOn CRDs/operators first |

**Good:** pin chart versions; encrypt secret values. **Bad:** unbounded version ranges in prod; TLS keys in plain `values:`.

---

## References

- [Manage Helm Releases](https://fluxcd.io/flux/guides/helmreleases/)  
- [HelmRelease API](https://fluxcd.io/flux/components/helm/helmreleases/)  
- [Helm drift detection](https://fluxcd.io/flux/installation/configuration/helm-drift-detection/)  
- [Flux for Helm users](https://fluxcd.io/flux/use-cases/helm/)  
- [Running Jobs with Flux](https://fluxcd.io/flux/use-cases/running-jobs/)  
