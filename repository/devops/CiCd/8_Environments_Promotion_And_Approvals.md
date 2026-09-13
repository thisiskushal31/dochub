# Environments, promotion, and approvals

[← Back to CI/CD](./README.md)

Continuous Delivery needs a **path through environments** with clear promote rules — not ad-hoc “SSH to prod.” This chapter is the promotion model that sits on top of [1](./1_Pipelines_Build_Test_Deploy.md) and [4](./4_Artifacts_And_Registries.md).

---

## Typical ladder

Names vary; the jobs do not:

```text
Local / PR preview
  → Integration / DEV
  → Staging / pre-prod (prod-like)
  → Production
```

| Environment | Purpose |
|-------------|---------|
| **Preview / PR or MR** | Short-lived env per change; smoke + optional DAST |
| **Integration** | Shared team testing; APIs wired together |
| **Staging** | Prod-like config, data shape, and traffic patterns (scaled down) |
| **Production** | Real users; progressive delivery ([3](./3_Deployment_Strategies.md), [9](./9_Progressive_Delivery_Controllers.md)) |

Twelve-Factor **dev/prod parity**: keep gaps small (same kind of DB, queue, runtime) so Continuous Delivery stays believable ([12factor.net/dev-prod-parity](https://12factor.net/dev-prod-parity)).

---

## Git strategy vs environment ladder (do not conflate them)

The ladder above is **where software runs**. How code integrates (trunk vs long-lived env branches) is covered in [Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md).

In the pipe: build once, pin environments to **tags/digests**, freeze an RC under test while trunk moves, then promote the **same digest** to release SemVer ([4](./4_Artifacts_And_Registries.md), [12](./12_Release_Versioning_And_Changelogs.md), [semver.org](https://semver.org/)).

---

## Shared DEV (default) and optional parallel DEV

Most teams run **one shared DEV / integration** environment. Snapshot images from the integration line (or PR builds) land there; people coordinate soaks on that stack. That is the normal case — expect it.

**Optional later:** if shared DEV often blocks the team (one long soak freezes everyone else), you *may* stand up short-lived parallel DEVs on the **same snapshot tag** via GitOps, then destroy them. Do not treat parallel stacks as required platform maturity.

**Prefer GitOps for every env you do run.** Shared DEV, staging, prod — and any optional ephemeral — should be Argo CD **Applications** (or ApplicationSet children) whose desired state lives in Git (or OCI). Create = sync; destroy = remove desired state and prune. Same idea with Flux or another reconciler. IaC still owns cluster/network/DB when needed; Argo owns *what apps run where*.

```text
Usual:
  apps/dev-shared/     → always on (snapshot tags roll here)
  apps/staging/ … prod/

Optional when contention hurts:
  apps/dev-<task>/     → ephemeral Application (same snapshot tag)
       └── remove from Git → Argo prunes → shared DEV untouched
```

| Piece | Role |
|-------|------|
| **Shared DEV** | Default integration lane; one Application in Git |
| **Ephemeral DEV** | Optional extra Application when shared DEV is saturated |
| **Argo CD** | Sync / prune from desired state — not hand `kubectl` |
| **CI/CD** | Produces digests/tags; envs consume them via Git values |

After soak on shared DEV (or an optional parallel), merge and cut an RC when ready ([Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md), [12](./12_Release_Versioning_And_Changelogs.md)). Destroying an Application does **not** delete the registry image.

If you add ephemerals, ApplicationSet PR/SCM generators can create/remove them ([Argo_CD](./Argo_CD/README.md)). Most teams never need that.

### If you add parallel DEVs — cost guardrails

Parallel stacks buy flow and cost compute/LB/DB ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)). Only worth it when shared DEV contention is real:

| Guardrail | Why |
|-----------|-----|
| TTL / destroy when Git desired state is removed | Orphans are the bill shock |
| Cap concurrent ephemerals (small N) | Hard budget |
| Sleep / scale-to-zero when idle | Keeps spend low |
| Labels: `env=dev-ephemeral`, `owner=…` | Attribution |
| Smaller than staging | Not a second prod |

### Distributed vs monolith (only if you run parallels)

**Deploying** a monolith preview is usually simpler (one app + one DB). **Assembling** a microservices preview is harder. On a **shared DEV**, the hard part is coordination and data pollution — not spinning stacks. If you do run parallels, isolate **writable state** (especially monolith DB); never point ephemerals at shared DEV’s writable DB or at production data.

Default path: build snapshot → **shared DEV** → merge → RC → staging → release digest. Parallel DEVs are a **side option**, not the trunk of the model.

---

## Promote the artifact, inject config

```text
Build once → store digest D
  → deploy D + staging config → verify
  → deploy D + prod config → verify
```

Anti-pattern: rebuild “for production” or bake env-specific config into the image ([4](./4_Artifacts_And_Registries.md), [13](./13_Config_Secrets_And_Env_Parity.md)).

---

## Approvals (Continuous Delivery gates)

| Gate type | When it fits |
|-----------|--------------|
| **Automated** | Tests, security policy, smoke, canary analysis — prefer these |
| **Human approve** | Regulated change, high blast radius, business release timing |
| **Scheduled / freeze** | Change windows — still use the same artifact and pipeline |

Humble & Farley: Continuous Delivery means you *could* release anytime; a human button can still start prod. Continuous **Deployment** removes that button ([Methodologies/13](../Methodologies/13_Continuous_Everything.md)).

Record who approved what digest for audit.

---

## Environment protection (platform features)

Most CI / forge platforms (GitHub, GitLab, Bitbucket, Azure DevOps, and kin) offer:

- Required reviewers before a job targeting `production`  
- Environment secrets scoped to that env  
- Deployment history / URL  

Use them so “prod credentials” are not available to every PR/MR job.

---

## Multi-service promotion

When several services must move together:

- Share a **release train** / change ID across pipelines  
- Or use GitOps desired-state that updates multiple apps in one commit  
- Avoid silent skew: app A on v5 talking to B still on v3 without compatibility tests  

Contract tests in CI help ([10](./10_Testing_In_The_Pipeline.md)).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Staging that is nothing like prod | Close parity where it matters (data shape, auth, deps) |
| Manual promote with a different build | Same digest |
| Prod secrets on every PR runner | Environment-scoped secrets + OIDC |
| Approval theater with no automated gates | Automate first; humans for residual risk |
| Promote by merging `staging` → `prod` branch | Retag digest / update GitOps to the soaked RC |
| Staging follows branch tip during RC soak | Pin `v*-rc.*` or digest ([Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)) |
| Fighting over one shared DEV | Coordinate soaks; flags; or *optionally* a short-lived parallel DEV ([Argo_CD](./Argo_CD/README.md)) |
| Hand-`kubectl` for any env | Desired state in Git; Argo sync / prune |
| Standing up parallel DEVs by default | One shared DEV first; parallels only when contention is chronic |
| Ephemeral env without TTL / owner tags | Auto-destroy + FinOps labels ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)) |
| Ephemeral pointing at shared writable DEV DB | Isolated DB / branch per env |
| Full microservices copy for every tiny UI tweak | Hybrid or request-isolation when cost explodes |

## Next

- Config vs artifact: [13](./13_Config_Secrets_And_Env_Parity.md)  
- Verify after each promote: [5](./5_Verify_Rollback_And_Synthetic_Tests.md)  
- Trunk vs env branches: [Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)  
- SemVer RC→release: [12](./12_Release_Versioning_And_Changelogs.md)  
- Cost of non-prod: [Methodologies/8](../Methodologies/8_FinOps_Literacy.md)  
- IaC for create/destroy: [IAC/](../IAC/README.md)

## Further reading

- [Twelve-Factor — Dev/prod parity](https://12factor.net/dev-prod-parity)  
- [Continuous Delivery — deployment pipeline](https://continuousdelivery.com/implementing/patterns/)  
- [Argo CD ApplicationSet — Pull Request generator](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/generators/pull-request/) (auto create/destroy previews)  
- Preview / ephemeral patterns: environment isolation vs request isolation (share baseline, fork what changed) — see industry write-ups under “ephemeral environments” / “preview environments”
