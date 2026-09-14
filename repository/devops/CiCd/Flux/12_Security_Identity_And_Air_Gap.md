# 12 — Security, cloud identity, and air-gap

[← Previous](./11_Secrets_SOPS_And_Sealed_Secrets.md) · [README](./README.md) · [Next: Image automation →](./13_Image_Update_Automation.md)

---

## 1. Concepts

Anyone who can push to the fleet path Flux watches can change the cluster. Treat that Git path like production access.

| Surface | Practical rule |
|---------|----------------|
| **Git credentials** | Bot account, least scopes, rotate deploy keys |
| **Workload identity** | Prefer cloud identity for registries/KMS/remote clusters over static passwords |
| **Impersonation** | Tenant Kustomizations/HelmReleases set `serviceAccountName` so they don’t inherit cluster-admin |
| **Cross-namespace Sources** | Disable on shared clusters so team A can’t use team B’s repo object |
| **Remote Kustomize bases** | Disable so only Flux Sources can change the cluster |
| **Verification** | Verify artifacts/commits when policy requires |
| **Air-gap** | Mirror images/charts/OCI; no surprise internet calls |

---

## 2. Advanced concepts

### Multitenancy lockdown (bootstrap patches)

Official patches typically: `--no-cross-namespace-refs`, `--no-remote-bases`, `--default-service-account=default` (no SA ⇒ no power), and keep the root `flux-system` Kustomization on the controller SA ([16](./16_Scale_Multitenancy_And_Platform_Config.md)).

### Cloud guides

AWS/Azure/GCP integration pages cover registry auth and EKS/AKS/GKE remote `kubeConfig` shapes.

### Proxy / OpenShift

First-class docs — use them in constrained networks and OpenShift clusters.

### Contextual authorization

Security docs go beyond naive RBAC for who may reconcile what — read when building a shared platform.

---

## 3. Applications and use cases

| Threat | Mitigation |
|--------|------------|
| Stolen personal Git token | Bot + fine-grained / short-lived credentials |
| Tenant reads another team’s Source | no-cross-namespace-refs |
| Surprise remote base pull | no-remote-bases |
| Offline cluster | Mirrored registries + tested upgrades |

**Good:** fleet PRs reviewed like production code. **Bad:** cluster-admin kubeconfig checked into CI “for Flux debugging.”

---

## References

- [Security](https://fluxcd.io/flux/security/)  
- [Best practices](https://fluxcd.io/flux/security/best-practices/)  
- [Workload identity](https://fluxcd.io/flux/installation/configuration/workload-identity/)  
- [Air-gapped install](https://fluxcd.io/flux/installation/configuration/air-gapped/)  
- [Integrations](https://fluxcd.io/flux/integrations/)  
