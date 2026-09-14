# 01 — What is GitHub Actions

[← GitHub Actions](./README.md) · [Next: Core model →](./02_Core_Model_Workflows_Jobs_Steps_Runners.md)

---

## 1. Concepts

If your code already lives on GitHub, **GitHub Actions** is automation that runs **when something happens in that repo** — a push, a pull request, a schedule, a button click, a call from another workflow, or an external `repository_dispatch`.

You write **workflows** as YAML under `.github/workflows/`. GitHub starts a **run**; **jobs** execute on **runners**; each job is **steps** (shell or reusable **actions**). Results show up as checks on PRs, deployment history, and logs.

Mental model in one line: **event → workflow run → jobs on runners → steps**.

### What it is good at

| Job | Typical Actions shape |
|-----|------------------------|
| PR continuous integration | `pull_request` → lint/test/scan |
| Continuous delivery | build → push image → gate on `environment` → promote |
| Scheduled platform work | `schedule` (cron) audits, inventory, cleanup |
| Manual promote / break-glass | `workflow_dispatch` with inputs |
| Org paved road | `workflow_call` reusable workflows pinned by tag/SHA |

### Actions vs GitHub Apps

**Actions** = workflow automation inside a repo (CI/CD, repo chores). **GitHub Apps** = long-lived integrations with webhooks, fine-grained permissions, and API identity outside a single workflow run. Use an App when you need durable bot identity across many repos; use Actions when the trigger is “this repo’s delivery loop.”

---

## 2. Advanced concepts

### Product surfaces you will meet

| Surface | What you get |
|---------|----------------|
| Hosted runners | Ephemeral VMs (`ubuntu-latest`, Windows, macOS) |
| Larger runners | More CPU/RAM, custom images, networking options (plan-gated) |
| Self-hosted / ARC | Your machines or Kubernetes scale sets |
| Marketplace / custom actions | Packaged steps (`uses:`) |
| Environments | Protection rules, env secrets, deployment history |
| OIDC | Short-lived cloud credentials without static keys |
| Artifact attestations | Provenance / SLSA-oriented build evidence |
| Metrics & billing | Usage visibility; minutes/storage limits by plan |
| Importer | Accelerates migration from other CI systems |

### Where it sits in the delivery staircase

Cross-host delivery jobs (CI, schedule, promote, reusable templates) also live on GitLab, Bitbucket, Azure Pipelines, Jenkins, CircleCI, Buildkite — see [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md) and [2](../2_CI_CD_Tools.md). Prefer those for **host-neutral** patterns; open **this** track when the forge is GitHub.

GitOps apply (Flux/Argo) often owns the cluster; Actions often owns **build + attest + push digest**.

### When *not* to force Actions

| Situation | Better fit |
|-----------|------------|
| Code not on GitHub | Other forge CI |
| Policy forbids cloud CI / air-gap | On-prem CI or carefully isolated self-hosted + GHES |
| Only need cluster sync | Flux / Argo CD |

---

## 3. Applications and use cases

| Team | Use Actions for |
|------|-----------------|
| App squad | PR checks, image build, gated promote |
| Platform | Org reusable workflows, runner groups, OIDC trust |
| Security | Least-privilege tokens, fork policy, attestations |
| Brownfield | Importer-assisted migration, then delete drift |

**Good:** GitHub is source of truth → Actions is the automation plane. **Bad:** treating Actions as a general-purpose job queue for work that never touches GitHub.

---

## References

- [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)  
- [GitHub Actions documentation](https://docs.github.com/en/actions)  
- [GitHub Actions vs GitHub Apps](https://docs.github.com/en/actions/get-started/actions-vs-apps)  
- [Continuous integration](https://docs.github.com/en/actions/get-started/continuous-integration)  
- [Continuous deployment](https://docs.github.com/en/actions/get-started/continuous-deployment)  
