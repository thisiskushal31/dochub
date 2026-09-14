# 06 — Sources: where desired state comes from

[← Previous](./05_First_Reconcile_And_Day1_Loop.md) · [README](./README.md) · [Next: ExternalArtifact →](./07_ExternalArtifact_And_ArtifactGenerator.md)

---

## 1. Concepts

A **Source** tells Flux: *where the files are, how to authenticate, and which version to take.* After a successful fetch, Flux stores an **artifact** other objects consume.

| Kind | When you use it |
|------|-----------------|
| **GitRepository** | Manifests live in Git |
| **OCIRepository** | Manifests live as an OCI artifact in a registry (Gitless) |
| **Bucket** | Manifests live in S3-compatible storage |
| **HelmRepository** | Helm chart index or OCI Helm repo |
| **HelmChart** | A concrete chart version ready for HelmRelease |

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: app-config
  namespace: flux-system
spec:
  interval: 1m
  timeout: 60s
  url: https://github.com/org/app-config
  ref:
    branch: main
  ignore: |
    /**/*.md
    /tests/**
```

One Source can feed many Kustomizations — fetch once, apply many ways.

---

## 2. Advanced concepts

### GitRepository features worth knowing

| Feature | Why you care |
|---------|----------------|
| `ref` | Branch vs tag vs semver vs commit — pin production on purpose |
| `secretRef` | HTTPS token or SSH key |
| `provider` | GitHub App / cloud Git integrations (see current spec) |
| `serviceAccountName` | Workload-identity style auth where supported |
| `verification` | Require signed/verified commits when policy says so |
| `ignore` | Leave docs/tests out of the artifact |
| `sparseCheckout` | Clone only listed folders (big monorepos) |
| `include` | Merge another GitRepository’s artifact into this one |
| `proxySecretRef` | Corporate proxy |
| `suspend` | Pause fetching |

### OCI / Gitless

Production clusters talk to a registry, not Git. Humans still edit Git; CI runs `flux push artifact` (or similar). Pair with Operator OCI sync if that is your install path ([04](./04_Install_Bootstrap_And_CLI.md)).

### Helm sources

`HelmRepository` + `HelmChart` (or a chart stored in Git/OCI) feed [09](./09_HelmRelease_And_Helm_Delivery.md). Prefer exact chart versions in production.

### Verification

Cosign/PGP-style options exist on sources — turn on when supply-chain policy requires ([12](./12_Security_Identity_And_Air_Gap.md)).

---

## 3. Applications and use cases

| Scenario | Choice |
|----------|--------|
| Normal GitOps | GitRepository |
| Huge monorepo | sparseCheckout / ignore / generators ([07](./07_ExternalArtifact_And_ArtifactGenerator.md)) |
| Cluster must not reach Git | OCIRepository |
| Third-party charts | HelmRepository |
| Want sync right after push | Receiver ([14](./14_Notifications_Alerts_And_Receivers.md)) |

**Good:** credentials in Secrets or workload identity. **Bad:** tokens pasted into Source YAML; production on floating `latest`.

---

## References

- [Source controllers](https://fluxcd.io/flux/components/source/)  
- [GitRepository](https://fluxcd.io/flux/components/source/gitrepositories/)  
- [OCIRepository](https://fluxcd.io/flux/components/source/ocirepositories/)  
- [HelmRepository](https://fluxcd.io/flux/components/source/helmrepositories/)  
- [Bucket](https://fluxcd.io/flux/components/source/buckets/)  
- [OCI cheatsheet](https://fluxcd.io/flux/cheatsheets/oci-artifacts/)  
