# 11 — Secrets in Git without plaintext

[← Previous](./10_Repository_Structure_Tenancy_And_Multi_Cluster.md) · [README](./README.md) · [Next: Security →](./12_Security_Identity_And_Air_Gap.md)

## 1. Concepts

**Private Git is not encryption.** If a Secret’s `data` is readable in the repo, it is already leaked to everyone with clone access (and to backups, forks, CI logs).

Common safe patterns with Flux:

| Pattern | Plain idea |
|---------|------------|
| **SOPS** | Encrypt Secret values in Git; Flux decrypts in the cluster while applying |
| **Sealed Secrets** | Commit a SealedSecret; a controller unwraps it to a real Secret |
| **External Secrets / Vault** | Flux applies non-secret YAML; another controller pulls secrets from a store |

For SOPS, encrypt `data` / `stringData` only — leave `apiVersion`, `kind`, `metadata` readable (e.g. `--encrypted-regex '^(data|stringData)$'`). Keys: age, PGP, or cloud KMS (AWS/Azure/GCP/Vault).

```yaml
# On the Kustomization that applies those Secrets
spec:
  decryption:
    provider: sops          # SOPS is the supported provider here
    secretRef:
      name: sops-keys       # or use cloud KMS + workload identity
```

## 2. Advanced concepts

### SOPS vs Sealed Secrets

Kustomization `.spec.decryption` is **SOPS-only**. Sealed Secrets is a different controller: Flux just applies the SealedSecret YAML like any other manifest.

### Helm

Put sensitive Helm values in encrypted Secrets and point `valuesFrom` at them — not inline plaintext ([09](./09_HelmRelease_And_Helm_Delivery.md)).

### Who holds the keys?

Prefer cloud KMS + workload identity over long-lived private keys on laptops ([12](./12_Security_Identity_And_Air_Gap.md)). Practice rotation and restore.

### Controller-wide decryption

Docs cover fleet-wide decryption helpers — powerful; treat like production keys.

## 3. Applications and use cases

| Estate | Typical choice |
|--------|----------------|
| Cloud KMS already standard | SOPS + KMS |
| Already run Sealed Secrets | Keep it; Flux applies SealedSecrets |
| Central Vault | External Secrets + Flux for the rest |

**Good:** ciphertext in Git; keys in KMS. **Bad:** “it’s a private repo, we’re fine.”

## References

- [SOPS guide](https://fluxcd.io/flux/guides/mozilla-sops/)  
- [Sealed Secrets guide](https://fluxcd.io/flux/guides/sealed-secrets/)  
- [Secrets management](https://fluxcd.io/flux/security/secrets-management/)  
