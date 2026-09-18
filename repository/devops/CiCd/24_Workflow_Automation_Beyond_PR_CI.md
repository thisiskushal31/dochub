# Workflow automation beyond PR CI

[← Back to CI/CD](./README.md)

**Staircase:** Floor 5 (after the core ship loop). Teams use **host-native CI** (or a separate engine like Jenkins / CircleCI / Buildkite / Tekton) not only for “build on every PR/MR,” but for **scheduled ops**, **reusable paved-road CI/build**, **SemVer RC→release image lanes**, and **GitOps tag write-back**.

Jobs are durable; YAML is not. Primers: [GitHub_Actions/](./GitHub_Actions/README.md), [GitLab_CI/](./GitLab_CI/README.md), [Bitbucket/](./Bitbucket/README.md), [Azure_DevOps/](./Azure_DevOps/README.md), [Jenkins/](./Jenkins/README.md), [CircleCI/](./CircleCI/README.md), [Buildkite/](./Buildkite/README.md), [Tekton/](./Tekton/README.md). Immutable promote: [4](./4_Artifacts_And_Registries.md). Version lanes + [semver.org](https://semver.org/): [12](./12_Release_Versioning_And_Changelogs.md). Tool map: [2](./2_CI_CD_Tools.md). Classical Jenkins ops: [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md).

## Host-native CI vs self-operated CI

| | **Host-native CI** (typical) | **Self-operated CI** (typical) |
|--|------------------------------|--------------------------------|
| Examples | GitHub Actions, GitLab CI, Bitbucket Pipelines, Azure Pipelines | Jenkins (often); also self-hosted runners/agents on any of the above |
| Control plane | Forge/vendor operates it | **You** run controller HA, plugins, upgrades, backups |
| Runners / agents | Hosted VMs (or your self-hosted) | You provision/patch agents |
| Definition | Pipeline YAML next to code | Same idea (Jenkinsfile / YAML) — you also own the server |
| Fit | Code already on that forge; want low CI-server ops | Air-gap, exotic agents, large existing estate |

Durable rule: prefer **CI that sits next to your Git host** when you do not need to operate a separate automation server. Jenkins remains excellent when you already run it well or must keep builds inside a hard network boundary — see [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md). This is an **ops-cost** choice, not a moral one.

## Use case A — scheduled / cron workflows (ops automation)

Not every pipeline is “developer pushed a commit.” Common **workflow** jobs:

| Job | Example |
|-----|---------|
| **Inventory / drift audit** | List cloud resources vs expected tags; open an issue on drift |
| **Costing / FinOps audit** | Pull spend; fail or notify on budget burn ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)) |
| **Security / compliance scan** | Nightly SCA of main, secret scan of org, stale key report |
| **Stale environment cleanup** | Delete preview / ephemeral DEV stacks older than N days ([8](./8_Environments_Promotion_And_Approvals.md)) |
| **Synthetic / smoke on a schedule** | Keep watching prod journeys ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)) |

Every major CI supports **cron / schedule** plus **manual run** (Actions `schedule` + `workflow_dispatch`; GitLab `rules:schedule` / pipelines schedules; Bitbucket schedules; Azure Pipelines schedules; Jenkins timers; CircleCI / Buildkite / Tekton equivalents). Use POSIX cron in UTC unless your product documents otherwise.

```text
# Concept — schedule + optional manual trigger
on: cron "0 6 * * 1"  (Mondays 06:00 UTC)  OR  manual dispatch
  → OIDC to cloud (prefer over long-lived keys)
  → run ./scripts/inventory_audit.sh
  → notify on failure  ([16](./16_Notifications_Webhooks_And_ChatOps.md))
```

Illustrative Actions YAML (same jobs on other hosts — see primers above):

```yaml
# .github/workflows/inventory-audit.yml — one host’s shape only
name: inventory-audit
on:
  schedule:
    - cron: "0 6 * * 1"
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      issues: write
    steps:
      - uses: actions/checkout@v4
      - name: Run audit
        run: ./scripts/inventory_audit.sh
```

**Name it clearly:** these are still **workflows / pipelines** — scheduled delivery of *operational truth*, not application releases. Keep scripts in Git; prefer OIDC over long-lived cloud keys ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

## Use case B — promote release-candidate image → production tag

**Problem:** you built and tested an image once. Staging runs `app:rc-20260314` (or `app@sha256:abc…`). Production must get the **same bytes**, not a rebuild.

**Job name:** **artifact promotion** (or **image retag / channel promote**). Tags are **pointers**; the digest is the immutable identity ([4](./4_Artifacts_And_Registries.md)).

```text
build → push digest D + tag :rc-<id> or :staging
  → verify on staging
  → promote: point :prod / :1.2.3 / :stable at the SAME digest D
  → deploy prod by digest (or by the new tag that resolves to D)
```

Illustrative promote (no rebuild) — resolve source tag to digest, then create the prod tag on that digest (`docker buildx imagetools create`, `crane copy`, `skopeo copy`, or registry API):

```bash
# Conceptual — pin tool versions in real workflows
SRC=ghcr.io/org/app:rc-42
DIGEST=$(crane digest "$SRC")          # e.g. sha256:abc…
crane copy "$SRC" "ghcr.io/org/app@${DIGEST}"  # ensure present
crane tag "ghcr.io/org/app@${DIGEST}" "1.4.0"  # release tag
crane tag "ghcr.io/org/app@${DIGEST}" "prod"   # channel tag (if you use one)
# Deploy: image: ghcr.io/org/app@sha256:abc…  (preferred in manifests)
```

Wire this as a **separate pipeline** with **manual trigger** (and optional production environment / approval gate) so humans promote deliberately — Continuous **Delivery**. Continuous Deployment would automate promote after gates ([Methodologies/13](../Methodologies/13_Continuous_Everything.md)). Mechanism names: Actions `workflow_dispatch` + environments; GitLab manual jobs / protected environments; Bitbucket manual steps / deployment environments; Azure Pipelines environments + approvals; Jenkins input steps; CircleCI / Buildkite / Tekton approval patterns.

```text
# Concept — manual promote, no rebuild
inputs: rc_tag (soaked), release_tag (e.g. 1.4.0)
  → require production approval
  → resolve rc_tag → digest
  → apply release_tag to SAME digest
```

Never “promote” by rebuilding from `main` and hoping it matches staging.

### SemVer lanes (git tags drive image tags)

Many orgs map **git refs → image tags** so humans and Image Updaters share one scheme ([12](./12_Release_Versioning_And_Changelogs.md); full rules at [semver.org](https://semver.org/)). Pair this with **trunk-based** Git: environments pin tags/digests — they are not long-lived `dev`/`staging`/`prod` branches ([Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)).

| Git ref | Typical image tag scheme | Lane |
|---------|--------------------------|------|
| Integration / `dev` (or PR/MR) | Date/run/sha snapshot | Dev continuous (noisy) |
| Trunk + `vX.Y.Z-rc.N` | Pre-release SemVer | Staging / soak (**pinned**) |
| Same digest + `vX.Y.Z` | Release SemVer | Production |

**Immutable contract:** staging runs the **candidate** RC digest. Production gets that **same digest** under the release SemVer — retag, do not rebuild from a moved branch tip. While `rc.N` is soaking, new work lands on trunk as the *next* RC; it must not rewrite the tag under test.

Deploy path is usually **GitOps**: CI pushes the image; a reconciler (Argo CD Image Updater, Flux image automation, or a controlled values bump) writes the tag/digest into the desired-state repo — not `kubectl set image` in the build job ([Argo_CD](./Argo_CD/README.md), [8](./8_Environments_Promotion_And_Approvals.md)).

## Use case C — reusable CI templates (org paved road)

Copy-pasting the same lint/test/build YAML into every service repo drifts. Prefer a **central templates / shared pipelines** repo (or group includes) that each service calls thinly:

| Host family | Typical reuse mechanism |
|-------------|-------------------------|
| GitHub Actions | `workflow_call` reusable workflows; pin `@vN` |
| GitLab CI | `include:` from another project / CI components |
| Bitbucket Pipelines | YAML anchors / pipe definitions / shared pipe repos |
| Azure Pipelines | Template files (`extends` / `template:`) |
| CircleCI | Orbs |
| Jenkins | Shared libraries |
| Buildkite / Tekton | Pipeline templates / shared Tasks |

```text
# Concept — thin caller in the service repo
on: PR/MR or push to main
  → call org shared CI template @v10
  → pass image_name / language inputs
  → inherit secrets / variables per forge rules
```

| Piece | Role |
|-------|------|
| **Shared template** | Shared CI or build-push; inputs for image name, Dockerfile, notify flags |
| **Caller pipeline** | Triggers + thin include/uses + repo Variables (WIF, registry, service name) |
| **Pin** | Call a **versioned** template tag/SHA, not floating `main` |
| **Language variants** | Go / Node / Python / frontend — same gates, different toolchains |

**Data / backend / frontend** services should all call the same paved road: a scheduler, webhook worker, API, and SPA differ in **inputs**, not in inventing a new pipeline shape. Scheduled **ops** jobs (inventory, cost) stay Use case A; they can still share notify/OIDC helpers.

Primers: [GitHub_Actions](./GitHub_Actions/README.md), [GitLab_CI](./GitLab_CI/README.md), [Bitbucket](./Bitbucket/README.md), [Azure_DevOps](./Azure_DevOps/README.md), [CircleCI](./CircleCI/README.md), [Jenkins](./Jenkins/README.md), [Buildkite](./Buildkite/README.md), [Tekton](./Tekton/README.md).

## Putting it on the paved road

| Pipeline (example) | Trigger | Job |
|--------------------|---------|-----|
| Shared CI template | PR/MR / push | Lint, test, security gates |
| Shared build template | `main` + SemVer tags | Build/push snapshot, `v*-rc.*`, or `vX.Y.Z` |
| Promote (or GitOps updater) | Manual / Image Updater | RC → release pointer, **same digest** |
| Inventory / cost audit | Cron + manual | Cloud inventory / spend |
| Data or batch job repos | Same shared CI/build | Artifact + schedule/deploy like any service |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Rebuild for production to “be safe” | Promote digest; rebuild only on failure to reproduce |
| Mutating `:prod` without keeping previous digest | Keep `:prod-previous` or digest in release notes for rollback |
| Cron pipelines with standing cloud admin keys | OIDC + least privilege |
| Standing up Jenkins only because the forge is not GitHub | Use **host-native CI** on GitLab / Bitbucket / Azure DevOps / … unless you need Jenkins’ control plane |
| Unpinned shared templates (`@main`) | Pin template **tags/SHAs** |
| Duplicate CI YAML per language/repo | Central reusable templates + inputs |
| CI that `kubectl set image` | Push image; let GitOps / Image Updater write desired state |
| Docs that assume one forge | Stay host-neutral or list major hosts together |

## Next on the staircase

- Tool primers: [2](./2_CI_CD_Tools.md) and folders under [CiCd/](./README.md)  
- Digests & registries: [4](./4_Artifacts_And_Registries.md)  
- SemVer: [12](./12_Release_Versioning_And_Changelogs.md) · [semver.org](https://semver.org/)  

## Further reading

- [Semantic Versioning](https://semver.org/)  
- [Docker Buildx imagetools create](https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/) (retag/promote pattern)  
- Schedule / manual / reusable pipeline docs for **your** host (GitHub Actions, GitLab CI, Bitbucket Pipelines, Azure Pipelines, Jenkins, CircleCI, Buildkite, Tekton)  
- Version lanes: [12](./12_Release_Versioning_And_Changelogs.md)  
- Branching / trunk: [Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md)  
