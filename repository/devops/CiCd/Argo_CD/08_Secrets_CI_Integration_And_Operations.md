# 08 — Secrets, CI integration, and day-2 operations

[← Previous](./07_ApplicationSets_App_Of_Apps_And_Scale.md) · [Argo CD](./README.md) · [Next: Use cases and checklist →](./09_Use_Cases_Pitfalls_And_Staff_Checklist.md)

## 1. Concepts

### Secrets: preferred model

GitOps wants config in Git. **Secrets** are the awkward exception. Two broad approaches exist:

| Approach | Idea | Recommendation |
|----------|------|----------------|
| **Destination cluster** | Controllers on the workload cluster materialize Secrets (External Secrets, Sealed Secrets, Secrets Store CSI, Vault Secrets Operator, cloud equivalents) | **Prefer** — Argo never renders plaintext secrets into its cache |
| **Render-time injection** | A config-management plugin injects secrets while Argo CD generates manifests | **Avoid when you can** — secrets land in Redis / repo-server caches; updates couple to syncs |

Sealed Secrets encrypt for a specific cluster key and *can* live in Git as ciphertext. External Secrets reference a vault/cloud SM and sync into Kubernetes Secrets. Both keep Argo CD’s role “apply the Secret *object* or ExternalSecret CR,” not “know the password.”

Tie this to environment parity thinking in [13](../13_Config_Secrets_And_Env_Parity.md).

### CI’s job after GitOps

Canonical loop:

1. CI builds and pushes `image@sha256:…`  
2. CI (or Image Updater) updates the GitOps repo with that digest  
3. Argo CD syncs  

CI **does not** need permanent cluster-admin kubeconfigs for routine deploys. If CI must talk to Argo CD (sync now, wait for health), authenticate narrowly.

### Authenticating CI to Argo CD

Headless options (pick what your platform allows):

- **Project role token** — scoped to one AppProject  
- **Local account API token** — with `apiKey` capability  
- **OIDC / Dex token exchange** — forge OIDC identity → Argo token  
- **External OIDC ID token** — when Argo trusts the same issuer as CI  
- **`argocd login --core`** — kube credentials, bypasses Argo user auth (management cluster automation)

Store tokens in the CI secret store; rotate; never embed in Git.

### Argo CD Image Updater

Companion project: watches registries and writes new tags/digests into Git (or updates Applications per its modes). Useful when you want CI to only `docker push` and not commit. Still keep write access to GitOps controlled; still prefer digests in prod. It is **not** bundled inside the core Argo CD install — install and configure separately if you use it.

### Notifications and day-2 signals

Wire sync failures and degraded health to ChatOps / Pager ([Methodologies](../../Methodologies/README.md) on-call patterns). Watching only CI green is not enough once CD is pull-based — the failure may be sync/health after merge.

## 2. Advanced concepts

### Why render-time secrets hurt

Argo CD caches generated manifests. Injected secrets become readable to anyone who can reach Redis or the repo-server API. Network policies and dedicated clusters mitigate but do not remove the smell. Prefer destination operators; if stuck on plugins, treat Redis/repo-server as secret stores in your threat model.

### Repo credentials and cluster credentials

Both live as Secrets in the Argo CD namespace. Compromise of the management cluster is compromise of every registered cluster’s deploy path. Harden accordingly: limited RBAC, separate management cluster when scale justifies it, encrypt secrets at rest, audit access.

### GPG / signature verification

Argo CD can require signed commits or signed tags for sync. Pair with org signing policy and supply-chain practice ([6](../6_Supply_Chain_And_Signing.md)). This is optional but valuable for prod Applications.

### Webhooks for faster reconcile

Configure forge webhooks so pushes notify Argo CD immediately instead of waiting for poll intervals — less “why didn’t it deploy?” confusion.

### Disaster recovery

Back up Argo CD’s critical state (Redis/config, or better: ensure **all** Applications, Projects, and configs are reconstructible from Git). Official tooling: `argocd admin export` / `import`. If Git is complete, rebuilding Argo CD and re-syncing is the recovery path. Test that story — detail in [10](./10_Ownership_Diffing_Webhooks_And_Observability.md).

### Progressive delivery handoff

Argo CD syncs a **Rollout** (or Deployment). Rollouts controller shifts traffic and runs analysis ([Argo_Rollouts](../Argo_Rollouts/README.md)). CD ownership stays Git → Argo CD; progressive behavior is the workload controller. Do not invent sleep-and-curl in CI as a substitute ([5](../5_Verify_Rollback_And_Synthetic_Tests.md)).

### Upgrades and capacity

Day-2 includes version upgrades (read upgrade notes), HA replica counts, repo-server resources for heavy Helm, and metrics from Argo CD’s own endpoints for controller lag.

## 3. Applications and use cases

| Role | Day-2 focus |
|------|-------------|
| **App developer** | Commit digests/values; read sync/health; open PRs to GitOps; no prod kubectl habit |
| **CI maintainer** | Push image; update GitOps or Image Updater; scoped tokens only |
| **Platform** | SSO, Projects, repo/cluster secrets, HA, upgrades, notifications |
| **Security** | Secret operators, signing, Project boundaries, management-cluster hardening |

### Anti-patterns

- Long-lived cluster-admin kubeconfig in every CI job “just in case”  
- Plaintext passwords in GitOps YAML  
- Image Updater writing `:latest` into prod  
- Ignoring OutOfSync in prod because “the site works”  
- One shared `admin` password for the whole company  

## References

- [Secret management](https://argo-cd.readthedocs.io/en/stable/operator-manual/secret-management/)  
- [CI automation](https://argo-cd.readthedocs.io/en/stable/user-guide/ci_automation/)  
- [User management / CI auth](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/)  
- [Argo CD Image Updater](https://argocd-image-updater.readthedocs.io/)  
- [Notifications](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)  
- [Config / secrets parity](../13_Config_Secrets_And_Env_Parity.md)  
