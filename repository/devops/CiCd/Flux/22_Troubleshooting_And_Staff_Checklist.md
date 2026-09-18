# 22 — Troubleshooting and staff checklist

[← Previous](./21_CRD_And_CLI_Catalog.md) · [README](./README.md)

## 1. Concepts — when something is red

| What you see | Likely meaning | What to check |
|--------------|----------------|---------------|
| Source not Ready | Cannot fetch | URL, branch/tag, credentials, network, verification |
| Kustomization build error | Bad path / YAML / Kustomize | `path`, overlays, components |
| Apply failed | Permission or API problem | SA RBAC, missing CRDs, immutable fields (`force` only briefly) |
| Never Ready with wait | Health gate | `healthChecks`, `dependsOn`, `timeout` |
| HelmRelease stuck | Chart or values | Chart version, valuesFrom, helm-controller logs |
| Drift fight | Another controller edits fields | Scoped `ignore` / driftDetection.ignore |
| Git moved, cluster didn’t | Poll delay or suspend | Receiver, `flux reconcile`, `suspend` |
| Prune deleted too much | Path too wide | Inventory, Git diff, `deletionPolicy` |
| Image automation quiet | Optional controllers / policy / push rights | Components-extra, ImagePolicy, deploy key write |
| Tenant cannot deploy | Lockdown without SA | `serviceAccountName` + RoleBinding |
| Flagger idle | Mesh/metrics | Canary status, provider, Prometheus |
| Remote cluster fail | kubeConfig / WI | ConfigMap provider fields; remote SA namespace |

Also use the official [troubleshooting cheatsheet](https://fluxcd.io/flux/cheatsheets/troubleshooting/).

## 2. Advanced — a calm order of questions

1. Is the **Source revision** the commit I think it is?  
2. Is the **path** inside the artifact correct (ignore/sparse)?  
3. Are **dependencies** Ready?  
4. Is anything **suspended**?  
5. Is **auth** still valid (Git, OCI, remote cluster)?  
6. Is **another tool** applying the same names?  
7. On a locked cluster, does the **ServiceAccount** have enough power?  

**Undo button:** Git revert → push → reconcile (or wait for Receiver).

## 3. Applications — staff review checklist

- [ ] Fleet repo and per-cluster paths have clear owners / CODEOWNERS  
- [ ] Bot identity + key rotation  
- [ ] Install path chosen (CLI bootstrap and/or Operator)  
- [ ] Shared clusters use multitenancy lockdown  
- [ ] Secrets strategy chosen — no plaintext in Git  
- [ ] Production pins digests/chart versions  
- [ ] prune / deletionPolicy understood  
- [ ] dependsOn / wait used for ordered bring-up  
- [ ] Failure alerts on; Receivers authenticated  
- [ ] Image automation gated for prod if used  
- [ ] Flagger only where metrics + traffic provider exist  
- [ ] Drift ignore rules scoped  
- [ ] Upgrades tested on staging  
- [ ] Runbook: `flux get`, `flux logs`, Git revert  

**Good:** Git is how you roll forward and back. **Bad:** hotfix only inside the cluster.

## References

- [Troubleshooting cheatsheet](https://fluxcd.io/flux/cheatsheets/troubleshooting/)  
- [Advanced debugging](https://fluxcd.io/flux/gitops-toolkit/debugging/)  
- [FAQ](https://fluxcd.io/flux/faq/)  
