# Argo CD

[← Back to CI/CD](../README.md)

Declarative **GitOps** continuous delivery for Kubernetes. Desired state in Git (or OCI); the controller **pulls** and reconciles. Concepts: [2](../2_CI_CD_Tools.md), [OpenGitOps](https://opengitops.dev/). Progressive delivery add-on: [Argo_Rollouts/](../Argo_Rollouts/README.md).

---

## What it is

- Watches Git/Helm/Kustomize/OCI sources  
- Syncs cluster resources to match desired state  
- Shows **sync status** and **health**; optional auto-sync and self-heal (drift repair)  
- **Application** and **ApplicationSet** (multi-cluster / multi-app generation)  
- UI + CLI + API — common platform choice for app-centric GitOps  

CNCF graduated project.

---

## Push CI vs pull GitOps

```text
CI: build + test + push image@digest (+ optionally commit manifest bump)
Argo CD: pull manifests → apply → health
```

CI should not need standing `kubectl` admin into prod if GitOps owns apply ([2](../2_CI_CD_Tools.md)).

**Image tags after CI:** common pattern is CI only **build + push**; **Argo CD Image Updater** (or Flux image automation) writes the new tag/digest into the GitOps values repo. Keep emergency manual value bumps as escape hatches, not the happy path ([24](../24_Workflow_Automation_Beyond_PR_CI.md), SemVer lanes in [12](../12_Release_Versioning_And_Changelogs.md)).

---

## Applications for shared DEV (and optional parallels)

Shared DEV, staging, and prod should be Argo CD Applications (or ApplicationSet children) — create/destroy is **Git-managed**.

**Optional:** short-lived parallel DEV Applications when shared DEV contention is chronic ([8](../8_Environments_Promotion_And_Approvals.md)). Most teams only need `dev-shared` + staging + prod.

```text
usual:   apps/dev-shared/ · staging · prod
optional: apps/dev-<task>/  → remove path → Argo prunes
```

| Mechanism | Use |
|-----------|-----|
| **Application per env path** | Folders for shared DEV, staging, prod (and rare `dev-<task>`) |
| **ApplicationSet PR/SCM generator** | Only if you adopt optional per-PR previews |
| **App-of-Apps** | One parent owns a multi-service stack for that env |

Same snapshot image tag can be reused; deleting an Application does not delete the registry image. Trunk posture: [Methodologies/4](../../Methodologies/4_Branching_And_PR_Practices.md).

Docs: [ApplicationSet Pull Request generator](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/generators/pull-request/).

---

## First use (outline)

1. Install Argo CD in a management cluster/namespace ([getting started](https://argo-cd.readthedocs.io/en/stable/getting_started/)).  
2. Register a Git repo; create an Application pointing at a path/Helm chart.  
3. Sync; confirm health.  
4. Change image digest in Git; let auto-sync (or manual sync) roll out.  
5. Add RBAC (SSO groups); separate prod apps with stricter sync policy.  

Pin to digests in manifests ([4](../4_Artifacts_And_Registries.md)); enable signature verification patterns where you use cosign ([6](../6_Supply_Chain_And_Signing.md)).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Manual kubectl drift as normal | Self-heal or forbid UI-only edits |
| Secrets in plain Git | External secrets / sealed + [13](../13_Config_Secrets_And_Env_Parity.md) |
| Auto-sync without policies | Sync windows, manual for prod if required |
| Hand-built namespaces for any env | Application in Git + prune on remove |
| Parallel DEVs as the default platform | Shared DEV first; parallels only when needed ([8](../8_Environments_Promotion_And_Approvals.md)) |
| Deleting an Application expecting the image gone | Image stays in registry; only cluster desired state is removed |

## Further reading

- [Argo CD documentation](https://argo-cd.readthedocs.io/)  
- [ApplicationSet Pull Request generator](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/generators/pull-request/)  
- [OpenGitOps principles](https://opengitops.dev/)  
- Parallel DEV pattern (optional): [8](../8_Environments_Promotion_And_Approvals.md)  
