# 09 — Use cases, pitfalls, and staff checklist

[← Previous](./08_Secrets_CI_Integration_And_Operations.md) · [Argo CD](./README.md) · [Next: Ownership and ops →](./10_Ownership_Diffing_Webhooks_And_Observability.md)

---

## 1. Concepts — where Argo CD shows up

### By engineering role

| Role | Uses Argo CD to… |
|------|------------------|
| **Application engineer** | Ship config and digests through Git; confirm Synced/Healthy; roll back by reverting Git |
| **Platform / SRE** | Run the control plane; register clusters; design Projects and ApplicationSets; capacity and upgrades |
| **Security / AppSec** | Shrink standing deploy credentials; enforce destination allowlists; push secret operators and signing |
| **CI engineer** | End pipelines at artifact + GitOps commit (or Image Updater); stop baking `kubectl apply` into every job |
| **Incident commander** | Distinguish sync failures, health failures, and bad desired state; revert Git or sync last known good revision |

### By delivery situation

| Situation | Fit |
|-----------|-----|
| Many microservices on Kubernetes | Strong — Applications + ApplicationSets |
| Multi-cluster SaaS / regional fleets | Strong — one control plane, many destinations |
| Regulated production | Strong **with** manual sync / windows / strict Projects |
| Mixed estate (K8s + VMs + classic hosts) | Use Argo CD **only** for the K8s slice; other adapters elsewhere ([19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)) |
| Need canary % traffic | Argo CD + [Argo Rollouts](../Argo_Rollouts/README.md) (or Flagger + Flux) |
| Only CI build/test, no K8s | Do not install Argo CD for that |

### Argo CD vs Flux (short)

Both are GitOps on Kubernetes. Argo CD is often chosen for an **app-centric UI**, Application/Project tenancy, and ApplicationSets. Flux is a **toolkit** of controllers (and pairs naturally with Flagger). Pick one primary GitOps stack per platform team unless you have a deliberate split ([2](../2_CI_CD_Tools.md), [Flux](../Flux/README.md)).

---

## 2. Advanced concepts — failure modes and pitfalls

| Pitfall | What goes wrong | Better |
|---------|-----------------|--------|
| CI and Argo both apply | Controllers fight; audit lies | GitOps owns apply |
| `:latest` in GitOps | Synced ≠ reproducible | Digests / immutable tags |
| Unpinned Helm/Kustomize remotes | Meaning changes without your commit | Pin versions/SHAs |
| Permissive `default` Project in prod | Any repo → any namespace | Dedicated Projects |
| Auto-prune + empty path | Environment wiped | Careful prune; allowEmpty off unless intended |
| Secrets in rendered manifests | Leak via cache | Destination secret operators |
| kubectl hotfix as normal | Drift; self-heal wars | Commit the fix; sync |
| Assuming Rollouts included | No progressive CRDs | Install Rollouts separately |
| PR previews as only DEV | Cost/noise; weak integration | Shared DEV default ([8](../8_Environments_Promotion_And_Approvals.md)) |
| Ignoring Synced+Degraded | Users down while Git “looks fine” | Health alerts + verify stage ([5](../5_Verify_Rollback_And_Synthetic_Tests.md)) |
| Application delete ≠ image delete | Surprise leftover artifacts | Registry lifecycle separate |
| Sync hooks as full test suite | Slow fragile deploys | Keep heavy tests in CI |

### Rollback literacy

Rollback is usually **Git revert** (or sync to a previous revision/SHA), not a mysterious UI-only action disconnected from history. Confirm database migrations still follow expand/contract rules when versions overlap ([7](../7_DB_Migrations_In_Pipelines.md)).

---

## 3. Applications and use cases — worked narratives

### Narrative A — First microservice on GitOps

Platform installs Argo CD (HA when shared). Team gets a Project limited to `team-a/*` namespaces and their GitOps repo. They add `overlays/dev` and `overlays/staging` Applications (or one ApplicationSet). CI pushes digests to those overlays. Staging auto-syncs; prod is manual sync after verify.

### Narrative B — Platform add-ons everywhere

Cluster generator ApplicationSet deploys cert-manager and observability agents to every registered cluster. Adding a cluster secret to Argo CD enrolls it in add-on delivery without a new ticket per chart.

### Narrative C — Brownfield coexistence

Jenkins still deploys a fleet of VMs. New services land on Kubernetes with Argo CD. The handbook and the org chart both say which path owns which runtime — no forced “everything GitOps tomorrow.”

---

## Staff checklist

When reviewing an Argo CD installation or a GitOps change:

- Desired state for the change is in Git/OCI (or an approved Image Updater path) — not a silent kubectl-only prod edit  
- Image references use **digest** or immutable SemVer tag  
- Remote bases / Helm dependencies are **pinned** where reproducibility matters  
- Application uses a **locked-down Project** for prod (not long-term `default`)  
- Sync policy matches the environment (auto in lower envs; gated sync or windows in prod as required)  
- Prune / allowEmpty blast radius is understood  
- Secrets use destination-cluster operators — not plaintext Git, not preferred via render plugins  
- One apply authority: GitOps owns cluster apply  
- Shared DEV is the default; parallel or PR envs are justified if used  
- Progressive traffic needs are handled by Rollouts/Flagger when required — not assumed from Deployment rolling updates  
- SSO/RBAC in place for humans; CI tokens scoped  
- Notifications or checks exist for OutOfSync / Degraded in environments that matter  
- Rollback path is “Git revision,” and data migrations are safe across versions  
- Control-plane ops covered in [10](./10_Ownership_Diffing_Webhooks_And_Observability.md)–[11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) (tracking, webhooks, DR, tenancy, troubleshooting)

---

## How this track maps to the CiCd staircase

| Floor | Link |
|-------|------|
| Loop | [1](../1_Pipelines_Build_Test_Deploy.md) |
| Tools | [2](../2_CI_CD_Tools.md) |
| Artifacts | [4](../4_Artifacts_And_Registries.md) |
| Verify | [5](../5_Verify_Rollback_And_Synthetic_Tests.md) |
| Supply chain | [6](../6_Supply_Chain_And_Signing.md) |
| Environments | [8](../8_Environments_Promotion_And_Approvals.md) |
| Progressive | [9](../9_Progressive_Delivery_Controllers.md) · [Argo_Rollouts](../Argo_Rollouts/README.md) |
| Versioning | [12](../12_Release_Versioning_And_Changelogs.md) |
| Secrets parity | [13](../13_Config_Secrets_And_Env_Parity.md) |
| Host CI automation | [24](../24_Workflow_Automation_Beyond_PR_CI.md) |

---

## References

- [Argo CD documentation](https://argo-cd.readthedocs.io/)  
- [Best practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)  
- [OpenGitOps](https://opengitops.dev/)  
- Track start: [01](./01_What_Is_Argo_CD_And_Why_GitOps.md) · [README](./README.md)  
