# GitHub Actions

[← Back to CI/CD](../README.md)

**This folder is the GitHub-specific primer.** The same delivery jobs (CI, schedule, promote, reusable templates) exist on GitLab CI, Bitbucket Pipelines, Azure Pipelines, Jenkins, CircleCI, Buildkite, Tekton, and kin — see [24](../24_Workflow_Automation_Beyond_PR_CI.md) and [2](../2_CI_CD_Tools.md). Prefer host-neutral concepts in Methodologies / CiCd concept chapters; open this page when the forge is GitHub.

CI/CD and automation built into GitHub. **Workflows** are YAML under `.github/workflows/`. For many teams whose code already lives on GitHub, this is the default instead of operating a separate Jenkins controller — GitHub-hosted runners remove most of the “keep the CI server alive” tax. Keep Jenkins when you need that control plane ([20](../20_Classical_Jenkins_Host_And_Web_Deploy.md), [2](../2_CI_CD_Tools.md)).

Concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).  
**Scheduled audits · reusable templates · SemVer RC→prod (all hosts):** [24](../24_Workflow_Automation_Beyond_PR_CI.md). SemVer spec: [semver.org](https://semver.org/).

---

## Core model

| Concept | Meaning |
|---------|---------|
| **Workflow** | YAML file; triggered by events |
| **Job** | Runs on a runner; jobs can `need` others |
| **Step** | Shell or **action** (`uses:`) |
| **Runner** | **GitHub-hosted** VM (common default) or **self-hosted** |
| **Environment** | Named deploy target with protection rules / secrets |
| **Reusable workflow** | Shared YAML with `on: workflow_call`; callers `uses:` it |
| **Composite action** | Shared local action under `.github/actions/` |

### Triggers you will use

| Trigger | Use |
|---------|-----|
| `pull_request` / `push` | Classic CI on every change |
| `push` tags `v*` | Build RC / release image tags ([12](../12_Release_Versioning_And_Changelogs.md)) |
| `workflow_dispatch` | Manual run (promote image, emergency GitOps bump, one-off audit) |
| `schedule` (cron) | Inventory / cost / compliance / synthetic watches |
| `workflow_call` | Reusable workflows (org paved road) |

---

## Why teams pick Actions over self-operated Jenkins

| Factor | Actions (hosted) | Jenkins (self-operated) |
|--------|------------------|-------------------------|
| Server upkeep | Vendor runs control plane | You patch controller, plugins, backups |
| Runner upkeep | Ephemeral hosted VMs (typical) | You size and harden agents |
| Config location | In-repo workflows | Jenkinsfile + often UI/job state |
| Best when | GitHub is SoR for code; want low CI ops | Air-gap, heavy custom agents, large existing estate |

Self-hosted Actions runners exist when jobs must stay in your VPC — you then own runner hygiene again ([11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md)).

---

## Illustrative CI workflow

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

Pin actions by version tag or commit SHA. Use **OIDC** (`permissions: id-token: write`) to cloud/registries ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

---

## Scheduled ops workflow (inventory / cost audit)

```yaml
name: cost-audit
on:
  schedule:
    - cron: "0 7 * * *"    # daily 07:00 UTC
  workflow_dispatch:
jobs:
  audit:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Audit
        run: ./scripts/cost_audit.sh
```

Same pattern for inventory drift, stale preview cleanup, nightly scans — details in [24](../24_Workflow_Automation_Beyond_PR_CI.md).

---

## Reusable workflows (central paved road)

Put shared CI/build in an org **workflows** repo; service repos only call them:

```yaml
# org/workflows — reusable-build.yaml (shape)
on:
  workflow_call:
    inputs:
      image_name:
        type: string
        required: true
    # secrets: inherit from caller when needed

# service-repo — build.yml
jobs:
  build:
    uses: org/workflows/.github/workflows/reusable-build.yaml@v10
    with:
      image_name: ${{ vars.SERVICE_NAME }}
    secrets: inherit
```

**Version the paved road:** pin `@v10` (or commit SHA). Bumping the workflows tag is a deliberate platform change — same discipline as dependency upgrades.

Typical split:

| Reusable file | When |
|---------------|------|
| `reusable-ci-*.yaml` | PR/push: lint, test, SCA, image smoke |
| `reusable-build-*.yaml` | Push to default branch or SemVer tags: build + push registry |
| Language/frontend variants | Go / Node / Python / Next-style — shared gates, different setup |

**Data plane services** (schedulers, workers, batch APIs) use the **same** reusable CI/build as HTTP services — only `image_name` / Dockerfile inputs change. Cron **ops** audits stay Use-case-A workflows ([24](../24_Workflow_Automation_Beyond_PR_CI.md)).

GitHub: [Reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows).

---

## SemVer image build + promote (immutable candidate)

**Build lane** (often inside `reusable-build`, triggered by ref):

| Git ref | Image tag scheme | Intent |
|---------|------------------|--------|
| `main` | Snapshot (`YYYY.MM.DD.run-….sha-…`) | Continuous / dev |
| `vX.Y.Z-rc.N` | Pre-release SemVer | Test in staging |
| `vX.Y.Z` | Release SemVer | Production pointer |

**Promote contract:** after staging proves the RC (or snapshot) digest, production must reference **that digest** — retag to `vX.Y.Z` and/or write GitOps values (Image Updater / PR). Do not treat a fresh rebuild on the release tag as “the same” unless digests match.

Manual promote shape:

1. `workflow_dispatch` (often `environment: production` approval).  
2. Resolve RC tag → digest.  
3. Apply `:1.4.0` / `:prod` to **that digest** (`crane` / `skopeo` / `docker buildx imagetools create`).  
4. Deploy by digest (GitOps preferred over `kubectl set image` in CI).

Full narrative: [24](../24_Workflow_Automation_Beyond_PR_CI.md), [4](../4_Artifacts_And_Registries.md), [12](../12_Release_Versioning_And_Changelogs.md).

---

## Common patterns

- Matrix builds (`strategy.matrix`)  
- Caching (`actions/cache`) keyed on lockfiles  
- Central reusable workflows + composite actions  
- Environment approvals for production ([8](../8_Environments_Promotion_And_Approvals.md))  
- Build provenance attestations when applicable ([6](../6_Supply_Chain_And_Signing.md))  
- Slack/ChatOps on build/CI/release ([16](../16_Notifications_Webhooks_And_ChatOps.md))  

---

## First use (outline)

1. Thin `ci.yml` calling `reusable-ci@vN` (or local CI until the paved road exists).  
2. Required checks on `main`.  
3. `build.yml` calling `reusable-build@vN` with OIDC; snapshot on `main`, SemVer on tags.  
4. Promote RC → release **same digest** (manual workflow or Image Updater + policy).  
5. One scheduled audit workflow your team actually needs.  

Docs: [GitHub Actions](https://docs.github.com/en/actions).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Floating action / reusable tags (`@main`) | Pin versions/SHAs |
| Fork PR secrets leakage | Restrict; careful `pull_request_target` |
| Rebuild for prod promote | Retag same digest ([24](../24_Workflow_Automation_Beyond_PR_CI.md)) |
| Long-lived cloud keys in secrets | OIDC |
| Per-repo copy-paste of CI YAML | `workflow_call` paved road |
| CI mutates cluster directly | Push image; GitOps writes desired state |

## Further reading

- [Understanding GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)  
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) (`schedule`, `workflow_dispatch`, `workflow_call`)  
- [Reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)  
- [Security hardening for Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)  
- [24 — Beyond PR CI](../24_Workflow_Automation_Beyond_PR_CI.md)  
