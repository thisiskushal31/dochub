# 21 — CRD and CLI cheat sheet

[← Previous](./20_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./22_Troubleshooting_And_Staff_Checklist.md)

## 1. Concepts — objects you will create

Check what your cluster actually serves: `kubectl api-resources | grep toolkit.fluxcd`.

| Family | Main kinds | Teach chapter |
|--------|------------|---------------|
| Sources | GitRepository, OCIRepository, Bucket, HelmRepository, HelmChart, ExternalArtifact | [06](./06_Sources_Git_OCI_Bucket_Helm.md), [07](./07_ExternalArtifact_And_ArtifactGenerator.md) |
| Apply YAML | Kustomization | [08](./08_Kustomization_Controller.md) |
| Helm | HelmRelease | [09](./09_HelmRelease_And_Helm_Delivery.md) |
| Notify | Provider, Alert, Receiver | [14](./14_Notifications_Alerts_And_Receivers.md) |
| Images | ImageRepository, ImagePolicy, ImageUpdateAutomation | [13](./13_Image_Update_Automation.md) |
| Flagger | Canary | [17](./17_Flagger_Progressive_Delivery.md) |
| Operator | FluxInstance | [04](./04_Install_Bootstrap_And_CLI.md) |

List many at once via resource categories: [cheatsheet](https://fluxcd.io/flux/cheatsheets/crd-resource-categories/).

### Kustomization — knobs at a glance

`sourceRef`, `path`, `interval`, `retryInterval`, `timeout`, `prune`, `deletionPolicy`, `targetNamespace`, `dependsOn`, `healthChecks`, `wait`, `suspend`, `serviceAccountName`, `patches`, `images`, `postBuild` / substitute, `force`, `ignore`, `kubeConfig`, `decryption`.

### HelmRelease — knobs at a glance

Chart source, `values` / `valuesFrom`, install/upgrade/test/rollback, `driftDetection`, `dependsOn`, `serviceAccountName`, `kubeConfig`, post-renderers, remediation.

### GitRepository — knobs at a glance

`url`, `ref`, `secretRef`, `provider`, `verification`, `ignore`, `sparseCheckout`, `include`, proxy, `suspend`.

## 2. Advanced — CLI verbs

| Intent | Commands (see CLI docs for flags) |
|--------|-----------------------------------|
| Install | `flux check`, `flux bootstrap`, `flux install` |
| See state | `flux get all`, `flux get sources git`, `flux get ks`, `flux get hr`, `flux tree` |
| Act now | `flux reconcile …`, `flux suspend` / `resume` |
| Debug | `flux logs`, `flux events` |
| OCI | `flux push artifact`, `flux pull artifact` |
| Local substitute | `flux envsubst` |

## 3. Applications and use cases

| Task | Start here |
|------|------------|
| Write YAML | Kind’s chapter + official API link |
| Debug | `flux get` → conditions → logs → Git revision |
| CI | Pin CLI version; prefer check/reconcile |

Full man pages and OpenAPI stay upstream.

## References

- [Flux CLI](https://fluxcd.io/flux/cmd/)  
- [GitRepository](https://fluxcd.io/flux/components/source/gitrepositories/)  
- [Kustomization](https://fluxcd.io/flux/components/kustomize/kustomizations/)  
- [HelmRelease](https://fluxcd.io/flux/components/helm/helmreleases/)  
