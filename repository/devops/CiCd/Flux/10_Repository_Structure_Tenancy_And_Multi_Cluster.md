# 10 — How to structure Git, teams, and clusters

[← Previous](./09_HelmRelease_And_Helm_Delivery.md) · [README](./README.md) · [Next: Secrets →](./11_Secrets_SOPS_And_Sealed_Secrets.md)

---

## 1. Concepts

Controllers are the easy part. **Where files live** decides who can break production.

### Pattern 1 — Monorepo (one repo, many folders)

```text
apps/{base,staging,production}
infrastructure/{base,staging,production}
clusters/{staging,production}     # each cluster’s Flux watches its folder
```

- Install **infrastructure before apps** (`dependsOn`).  
- Staging may auto-bump images; production may require a PR ([13](./13_Image_Update_Automation.md)).  
- Risky services can add Flagger ([17](./17_Flagger_Progressive_Delivery.md)).

### Pattern 2 — Repo per environment

Separate production Git access and smaller reviews. Promotion can be slower for infra changes.

### Pattern 3 — Platform repo + team repos

**Platform admins** install Flux, CRDs, shared operators, tenant namespaces, and RBAC.  
**App teams** own their Sources and Kustomizations/HelmReleases — under a ServiceAccount the platform gives them ([16](./16_Scale_Multitenancy_And_Platform_Config.md)).

---

## 2. Advanced concepts

### Multi-cluster

| Approach | Idea |
|----------|------|
| Flux on every cluster | Each watches its own path in a fleet repo (most common) |
| Hub cluster | Hub Flux applies to spokes with `kubeConfig` ([08](./08_Kustomization_Controller.md)) |
| Gitless | Each cluster pulls OCI; Git is not a prod dependency |

### Pre/post Jobs

Database migrate → deploy app → warm cache: three Kustomizations with `dependsOn` and `wait`. Jobs often need `force: true` because Job specs barely change in place ([running jobs](https://fluxcd.io/flux/use-cases/running-jobs/)).

### Folders are not security

Git cannot hide `production/` from someone who can clone the repo. Use separate repos or forge permissions when that matters.

### Karmada

There is an official Karmada + Flux use-case if you already run that multi-cluster plane — details upstream.

---

## 3. Applications and use cases

| Org shape | Sensible start |
|-----------|----------------|
| Small team | Monorepo |
| Strict prod access | Repo per environment |
| Many product teams | Platform fleet + tenant repos + SA impersonation |

**Good:** each cluster path lists only what that cluster should run. **Bad:** every cluster pointed at the same prod overlay by mistake.

---

## References

- [Repository structure](https://fluxcd.io/flux/guides/repository-structure/)  
- [Multi-tenancy](https://fluxcd.io/flux/installation/configuration/multitenancy/)  
- [Running Jobs with Flux](https://fluxcd.io/flux/use-cases/running-jobs/)  
