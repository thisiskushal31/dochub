# 16 — Shared clusters, tenancy, and scale

[← Previous](./15_Monitoring_Events_Metrics_And_Upgrade.md) · [README](./README.md) · [Next: Flagger →](./17_Flagger_Progressive_Delivery.md)

## 1. Concepts — who is allowed to do what

By default Flux controllers are very powerful (effectively cluster-admin). That is fine on a **trusted single-tenant** cluster. On a **shared** cluster it is dangerous.

Flux’s tenancy model:

- **Platform admins** install Flux, shared operators, namespaces, and RBAC.  
- **Tenants** commit their own Sources and apps.  
- When applying, Flux **impersonates** a ServiceAccount the tenant names (`serviceAccountName`) — so tenants only get the Kubernetes powers that SA has.

### Lockdown patches (from official multitenancy guide)

Typical bootstrap patches:

1. `--no-cross-namespace-refs=true` — no borrowing another namespace’s Sources  
2. `--no-remote-bases=true` — no surprise remote Kustomize bases  
3. `--default-service-account=default` — if you forget `serviceAccountName`, you get a powerless default account  
4. Keep the root `flux-system` Kustomization on the **controller** ServiceAccount  

Copy exact YAML from the [multitenancy guide](https://fluxcd.io/flux/installation/configuration/multitenancy/) — don’t trust memory.

## 2. Advanced concepts — when one Flux is not enough

| Problem | Direction |
|---------|-----------|
| Controllers CPU-starved | Vertical scaling |
| Too many objects / noisy neighbors | Sharding / horizontal scale |
| Big Helm charts OOM | Helm OOM / resource settings |
| Drift fights with Helm | Helm drift detection config |
| Corporate proxy | Proxy settings |
| OpenShift | OpenShift install notes |
| Fleet of clusters | Flux Operator customization |

Tune from **metrics**, not folklore. Cloud integration pages cover AWS/Azure/GCP identity and registries.

## 3. Applications and use cases

| Symptom | What to try |
|---------|-------------|
| Reconciles hours behind | Scale up; then shard; reduce huge Kustomizations |
| Tenant deploys nothing after lockdown | They must set `serviceAccountName` with real RBAC |
| Team A uses Team B’s GitRepository | Enable no-cross-namespace-refs |

**Good:** capacity tested with realistic object counts. **Bad:** default resources forever on a huge fleet; lockdown without teaching tenants about SAs.

## References

- [Multi-tenancy](https://fluxcd.io/flux/installation/configuration/multitenancy/)  
- [Vertical scaling](https://fluxcd.io/flux/installation/configuration/vertical-scaling/)  
- [Sharding](https://fluxcd.io/flux/installation/configuration/sharding/)  
- [Helm drift detection](https://fluxcd.io/flux/installation/configuration/helm-drift-detection/)  
- [Integrations](https://fluxcd.io/flux/integrations/)  
