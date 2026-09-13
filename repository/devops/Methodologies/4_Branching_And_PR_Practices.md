# Branching, pull requests, and trunk-based development

[← Back to Methodologies](./README.md)

Branching policy is a delivery control. Pick a model that matches **release risk** and **team size**, then enforce it with protected branches and required checks — not with tribal knowledge.

**Host-neutral:** these rules are about **Git** and **CI**. They apply whether the forge is GitHub, GitLab, Bitbucket, Azure DevOps, or another major host. Prefer durable words (**merge request / pull request**, **protected default branch**, **required checks**). When this handbook names a product, it either stays generic or lists the major hosts — never a single forge by default. Tool primers live under [CiCd/](../CiCd/README.md) (Actions, GitLab CI, Bitbucket Pipelines, Azure Pipelines, Jenkins, CircleCI, Buildkite, Tekton, …).

---

## Models compared

| Model | How it works | Fits | Hurts when |
|-------|--------------|------|------------|
| **Trunk-based** | Short-lived branches; merge to `main` often (daily+) | Fast CI, strong tests, DevOps flow | No CI discipline / broken main tolerated |
| **PR/MR-to-main flow** (often called “GitHub Flow”) | Branch → review → merge to `main` → deploy | Most product teams | `main` is not always deployable |
| **GitFlow** | `develop` + `release/*` + `hotfix/*` + long `feature/*` | Versioned packaged software, rare releases | Microservices / continuous deploy — merge hell |
| **Release branches** | Cut `release/x.y` for stabilization | Mobile / regulated cutovers | Forgetting hotfixes must flow back to trunk |

“GitHub Flow” here is a **branching-model nickname**, not a requirement to use GitHub. GitLab, Bitbucket, and Azure DevOps use the same pattern with merge requests / PRs.

### House default (this handbook)

**Trunk-based + short-lived PR/MR to `main`:**

- Branch from `main`, open a review within hours/days — not weeks  
- Required checks must pass on the forge you use  
- `main` is always deployable (or reverted quickly)  
- Risky behavior behind flags ([2_Practices](./2_Practices_And_Workflows.md))  

Use GitFlow only when you truly ship infrequent versioned artifacts and can staff release management.

---

## The confusion: environment *branches* vs environment *lanes*

People often remember **two Git strategies**. The durable names:

| What people say | Industry name | What actually moves |
|-----------------|---------------|---------------------|
| “Three branches: `dev`, `staging`, `prod`” | **Environment branches** (long-lived) | Code merges *into* an env branch → that env rebuilds/redeploys from branch tip |
| “One main branch + immutable images” | **Trunk-based** + **artifact promotion** | Code merges to **trunk** (`main`); **images/tags/digests** are what staging and prod pin |

**Trunk** = the shared integration line everyone merges into frequently ([trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)). Environments are **not** permanent Git branches in that model — they are **deploy targets** that run a chosen **artifact**.

```text
Environment-branch model (hard under Continuous Delivery):

  feature → merge → develop  → (rebuild) → "dev"
                    staging  → (rebuild) → "staging"   ← often DIFFERENT bytes
                    prod     → (rebuild) → "prod"

Trunk + immutable artifact model (preferred here):

  short-lived PR/MR → merge → main (trunk)
                         │
                         ├─ build image once @sha256:abc
                         ├─ tag :v1.4.0-rc.3  → staging runs THAT digest
                         └─ promote same digest → :v1.4.0 → prod
```

Why env branches feel easy but hurt: each merge rebuilds; staging and prod stop being “the thing we tested.” Merge conflicts and cherry-picks explode. Why one trunk feels hard: **you must stop deploying the branch tip for release lanes** — deploy **tags/digests** instead.

### How “don’t change what’s under RC test” works on a trunk

You do **not** freeze `main` forever. You freeze the **candidate** with a **git tag** (immutable pointer to a commit) and an **image tag** on that build’s digest:

| Under test | Must stay fixed | May keep moving |
|------------|-----------------|-----------------|
| Staging soak of `v1.4.0-rc.20` | Git tag `v1.4.0-rc.20` + image digest | `main` tip (new work for *next* RC) |
| Prod release `v1.4.0` | Same digest as the RC you approved | Later commits / later RCs |

Staging and GitOps should reference `v1.4.0-rc.20` (or `@sha256:…`), **not** `main`. New commits on trunk do not change what staging is testing. SemVer pre-release / release labels: [semver.org](https://semver.org/) ([CiCd/12](../CiCd/12_Release_Versioning_And_Changelogs.md)).

---

## Practical trunk flow (dev snapshots, RC, release)

Keep the **release line** quiet; use **tags** (not long-lived env branches) as the lanes developers and operators share:

```text
optional integration/`dev` → snapshot images (noisy continuous DEV)
  → merge to trunk → vX.Y.Z-rc.N → staging pins that candidate
  → fixes → rc.N+1
  → same tested bytes → vX.Y.Z in production
```

Why this is a methodology choice: you integrate often on a trunk, freeze **candidates** with tags while trunk keeps moving, and you do not pretend `dev`/`staging`/`prod` Git branches are the environments.

How pipelines, SemVer image tags, shared DEV (and optional parallel DEVs), and promote jobs wire this: [CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md), [CiCd/12](../CiCd/12_Release_Versioning_And_Changelogs.md), [CiCd/4](../CiCd/4_Artifacts_And_Registries.md), [CiCd/24](../CiCd/24_Workflow_Automation_Beyond_PR_CI.md). Spec: [semver.org](https://semver.org/).

### When long-lived `dev` / `staging` / `prod` branches are still used

Legacy orgs often keep them. Treat them as **deploy wiring**, not as proof of “what we tested.” Prefer promoting a **digest** (or immutable tag) so staging soak and prod stay the same bytes — see [CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md).

---

## PR / MR hygiene

| Rule | Why |
|------|-----|
| **Small changes** | Reviewable; easy revert |
| **Description** | What / why / how tested / risk |
| **Required reviews** | CODEOWNERS / ownership maps / branch policies for sensitive paths |
| **Required checks** | Build, test, secrets, SAST — see [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md) |
| **No “LGTM” on 2k-line dumps** | Split or reject |

Path ownership examples (names differ by forge: CODEOWNERS-style files, Bitbucket/Azure DevOps branch policies + required reviewers):

```text
# Illustrative ownership map (commit next to the forge’s native file)
/infra/**                @org/platform
/.ci/** or pipelines/**  @org/platform
/src/payments/**         @org/payments
```

---

## Protected branches

On `main` (and release branches) — available on GitHub, GitLab, Bitbucket, Azure DevOps, and similar:

- Require PR / merge request  
- Require status / pipeline checks  
- Restrict who can push  
- Optional: linear history, merge trains / merge queues  
- Block force-push  

Merge queues / merge trains serialize merges so `main` stays green under load (feature name varies by host).

---

## Revert strategy

Prefer **revert commit** over force-push on shared branches.

```text
Bad deploy on main
  → revert merge commit (or revert the merged change)
  → deploy revert
  → fix forward on a new PR/MR
```

Progressive delivery reduces how often you need nuclear revert: [CiCd/3](../CiCd/3_Deployment_Strategies.md).

---

## Minimal PR/MR → CI sketch

Host YAML differs; the **jobs** do not. Concept:

```text
on: open/update PR or MR targeting main
  → checkout
  → build + unit test
  → secrets scan / SAST as policy
  → required check must be green before merge
```

Wire this in your host’s pipeline file (e.g. Actions workflows, `.gitlab-ci.yml`, `bitbucket-pipelines.yml`, `azure-pipelines.yml`, Jenkinsfile, …). Primers: [CiCd/](../CiCd/README.md). Concepts beat memorizing one vendor’s YAML.

---

## Trade-offs

| Optimize for | Lean toward |
|--------------|-------------|
| Speed + learning | Trunk + flags + strong CI |
| Release audit / freeze windows | Release branches + approvals |
| Open-source with many forks | Clear CONTRIBUTING + protected default branch |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Long-lived `feature/epic-q3` | Integrate behind flags daily |
| Direct commits to `main` | Protected branch + break-glass documented |
| Checks that take 45 minutes on every PR/MR | Split fast merge checks vs nightly heavy |
| `dev`/`staging`/`prod` branches that each rebuild | Trunk + promote **digest**; envs pin tags ([CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md)) |
| Staging tracks `main` tip while “testing an RC” | Pin staging to `v*-rc.*` / digest; let trunk move |
| Delete RC tags after release | Keep RC + release tags on the same digest for audit |
| Writing policy as if only one forge exists | Stay host-neutral or name the major hosts together |

## Next

- Pipeline loop: [CiCd/1_Pipelines_Build_Test_Deploy.md](../CiCd/1_Pipelines_Build_Test_Deploy.md)  
- Env ladder + promote digest: [CiCd/8](../CiCd/8_Environments_Promotion_And_Approvals.md)  
- SemVer RC→release: [CiCd/12](../CiCd/12_Release_Versioning_And_Changelogs.md) · learn the spec at [semver.org](https://semver.org/)  
- Metrics for whether branching helps: [5_DORA](./5_DORA_And_Delivery_Metrics.md)

## Further reading

- [Trunk Based Development](https://trunkbaseddevelopment.com/)  
- [Semantic Versioning](https://semver.org/)  
- Host docs (pick yours): protected branches / merge checks on **GitHub**, **GitLab**, **Bitbucket**, **Azure DevOps** (and your forge’s equivalent)  
