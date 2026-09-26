# Pipelines: build, test, deploy

[← Back to CI/CD](./README.md)

This is the handbook’s **core delivery narrative**. Vocabulary (CI vs Continuous Delivery vs Continuous Deployment) lives in [Methodologies/13](../Methodologies/13_Continuous_Everything.md). This file is the *how the loop is wired*.

Primary pattern: the **deployment pipeline** (Humble & Farley, *Continuous Delivery*; Farley’s earlier “Deployment Pipeline” write-up). Every commit is a release candidate that gains confidence by passing a sequence of automated stages.

## The loop (end to end)

```text
Commit / PR
  → commit stage (build + fast tests + static checks)
  → publish immutable artifact
  → security / quality gates
  → deploy to an environment
  → verify (smoke / synthetic / canary signals)
  → promote same artifact (or auto-release)
  → observe + notify
```

Gate detail (order of security checks): [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md).  
Artifacts: [4](./4_Artifacts_And_Registries.md). Verify/rollback: [5](./5_Verify_Rollback_And_Synthetic_Tests.md). Signing: [6](./6_Supply_Chain_And_Signing.md). Schema: [7](./7_DB_Migrations_In_Pipelines.md). Strategies: [3](./3_Deployment_Strategies.md).

## Deployment pipeline stages (conceptual)

| Stage | Job | Failure means |
|-------|-----|----------------|
| **Commit / CI** | Compile/package, unit tests, lint/static analysis — *fast feedback* (minutes) | Fix immediately; do not pile more commits on a red commit stage |
| **Acceptance / broader tests** | Automated acceptance, integration, contract tests against the **same** artifact | Artifact is not releasable yet |
| **Security gates** | SCA, image/binary scan, policy (see Security folder) | Do not promote |
| **Publish** | Push immutable artifact + metadata (digest, provenance) | Nothing trustworthy to deploy |
| **Deploy** | Install that digest into an environment (push job or GitOps pull) | Rollout blocked |
| **Verify** | Health, smoke, synthetics, optional canary analysis | Rollback / hold / roll-forward with fix |
| **Promote / release** | Same bytes → next env or prod (Delivery = on demand; Deployment = automatic) | Business or automation decision |

Humble & Farley’s guidance: prefer **parallel short stages** over a long serial chain so lead time stays short while confidence still rises.

## Build once

Anti-pattern: rebuild “for staging” then again “for production.” That breaks the guarantee that what you tested is what you run.

Correct pattern ([4](./4_Artifacts_And_Registries.md)):

1. Build **one** artifact from the commit.  
2. Name it with a **lane tag**: DEV → **snapshot** (`YYYY.MM.DD.run-….sha-…`); staging/prod → **SemVer**. **Never** `:latest`, including DEV.  
3. Promote RC SemVer → release SemVer on the **same** bytes. Keep updating GitOps/Helm values to the new tag (CI, Argo CD Image Updater, Flux, or a bot). Optional: sticky DEV + TTL ephemeral DEVs on the same snapshot tags ([8](./8_Environments_Promotion_And_Approvals.md)). Details: [4](./4_Artifacts_And_Registries.md).

## Pipeline as code

Store pipeline definition next to the product (Jenkinsfile, GitHub Actions workflow, `.gitlab-ci.yml`, Tekton YAML, etc.). Reasons that hold across tools:

- Reviewable like application code  
- Reproducible across branches  
- Auditable history  

Tool map: [2_CI_CD_Tools.md](./2_CI_CD_Tools.md).

## CI vs CD wiring (practical)

| You want… | Pipeline behavior |
|-----------|-------------------|
| **CI** | Every integrate triggers build + tests; mainline stays green |
| **Continuous Delivery** | Every green path produces a **production-ready** artifact; human/business may still click “release” |
| **Continuous Deployment** | Every green path **automatically** ships to production (needs strong tests + progressive delivery + fast rollback) |

Many excellent teams stop at Continuous Delivery. That is not a failure — see [Methodologies/13](../Methodologies/13_Continuous_Everything.md).

## Environments and promotion

Typical ladder (names vary):

```text
PR / preview → integration / staging → production
```

Rules of thumb:

- Promote the **artifact**, not a new build.  
- Config/secrets differ by environment; the **binary/image** should not.  
- Database changes must be compatible across overlapping app versions during rollout ([7](./7_DB_Migrations_In_Pipelines.md), Fowler blue-green + parallel change).

## Feedback when something fails later

If a bug escapes to exploratory testing or production:

- Improve earlier automated tests (unit/acceptance) — Farley/Humble feedback loop  
- Do not only “add a manual checklist”

That is the Second Way applied to pipelines ([Methodologies/10](../Methodologies/10_Core_Principles_Three_Ways_CALMS.md)).

## Beginner path

1. Green **commit stage** on every PR/mainline push.  
2. Publish one immutable artifact.  
3. Automated deploy to a non-prod env + smoke verify.  
4. Add security gates without killing feedback speed.  
5. Only then automate prod promote (Delivery → optional Deployment).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “CI/CD” that only builds nightly | Integrate frequently; trigger on every change |
| Rebuild per environment | Build once, promote by digest |
| Deploy without verify | Smoke/synthetics/canary hooks ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |
| Manual ssh deploys as the real path | Scripted/self-service deploy from the pipeline |
| Security only at the end | Shift-left gates ([Security/4](../Security/4_Security_Gate_Chain.md)) |

## Next on the staircase

Floor 1 complete → Floor 2 quality: [10_Testing_In_The_Pipeline.md](./10_Testing_In_The_Pipeline.md) → [4_Artifacts_And_Registries.md](./4_Artifacts_And_Registries.md)  

(Full climb: [CiCd README — staircase](./README.md). Mindset first if needed: [Methodologies](../Methodologies/README.md).)

## Further reading

- [Continuous Delivery — deployment pipeline patterns](https://continuousdelivery.com/implementing/patterns/)  
- [Farley — The Deployment Pipeline (PDF)](https://continuousdelivery.com/wp-content/uploads/2010/01/The-Deployment-Pipeline-by-Dave-Farley-2007.pdf)  
- [Humble — Continuous Delivery vs Continuous Deployment](https://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment/)  
- *Continuous Delivery* (Humble, Farley) — foundational book  
