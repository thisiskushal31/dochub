# CI/CD tools index

[← Back to CI/CD](./README.md)

Tools change. **Categories and jobs** do not. Use this file to pick the right *kind* of tool; how-to lives in each tool folder.

Core loop: [1_Pipelines_Build_Test_Deploy.md](./1_Pipelines_Build_Test_Deploy.md). Full concept map: [README](./README.md).

---

## Two halves of “CI/CD tooling”

| Half | Job | Tools in this handbook |
|------|-----|------------------------|
| **CI / build orchestration** | On commit: build, test, scan, publish | Jenkins, GitHub Actions, GitLab CI, CircleCI, Tekton, Azure Pipelines, Buildkite, Bitbucket Pipelines |
| **CD / cluster sync (often GitOps)** | Keep runtime matching desired state | Argo CD, Flux |
| **Progressive delivery** | Metric-gated canary/blue-green | Argo Rollouts, Flagger (with Flux) |
| **Feature flags** | Deploy ≠ release | Unleash (+ OpenFeature in apps) |

OpenGitOps ([opengitops.dev](https://opengitops.dev/)): declarative, versioned/immutable desired state, **pulled** automatically, **continuously reconciled**.

Classic **push CD**: CI applies once with cluster creds.  
**GitOps pull CD**: in-cluster agent reconciles ongoing drift.

---

## Tool folders

| Tool | Folder | Category |
|------|--------|----------|
| Jenkins | [Jenkins/](./Jenkins/README.md) | CI/CD server; Jenkinsfile; agents |
| GitHub Actions | [GitHub_Actions/](./GitHub_Actions/README.md) | SCM-native CI/CD |
| GitLab CI | [GitLab_CI/](./GitLab_CI/README.md) | SCM-native CI/CD |
| CircleCI | [CircleCI/](./CircleCI/README.md) | Hosted CI; orbs |
| Tekton | [Tekton/](./Tekton/README.md) | K8s-native pipelines |
| Bitbucket Pipelines | [Bitbucket_Pipelines/](./Bitbucket_Pipelines/README.md) | Bitbucket Cloud CI/CD |
| Azure DevOps | [Azure_DevOps/](./Azure_DevOps/README.md) | Azure Pipelines |
| Buildkite | [Buildkite/](./Buildkite/README.md) | You-run-agents CI |
| Argo CD | [Argo_CD/](./Argo_CD/README.md) | GitOps CD |
| Flux | [Flux/](./Flux/README.md) | GitOps toolkit |
| Argo Rollouts | [Argo_Rollouts/](./Argo_Rollouts/README.md) | Progressive delivery |
| Unleash | [Unleash/](./Unleash/README.md) | Feature flags |

---

## Shared capabilities

| Capability | Why | Concept |
|------------|-----|---------|
| Pipeline as code | Reviewable release machinery | [11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md) |
| Caching / matrix | Fast honest feedback | [11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md) |
| OIDC / short-lived cloud auth | No immortal keys in CI | [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md) |
| Environments / approvals | Continuous Delivery gates | [8](./8_Environments_Promotion_And_Approvals.md) |
| Notifications | Failures reach owners | [16](./16_Notifications_Webhooks_And_ChatOps.md) |

---

## Choosing without fashion

| Situation | Lean toward |
|-----------|-------------|
| Repo on **GitHub**, want low CI server ops | **GitHub Actions** (hosted runners) — [GitHub_Actions/](./GitHub_Actions/README.md), [24](./24_Workflow_Automation_Beyond_PR_CI.md) |
| Repo on GitLab / Bitbucket | Native GitLab CI / Bitbucket Pipelines |
| Existing healthy Jenkins estate | Keep improving Jenkinsfile + agents ([20](./20_Classical_Jenkins_Host_And_Web_Deploy.md)); migrate only with a plan |
| Need runners in your VPC / air-gap | Buildkite, self-hosted Actions/GitLab runners, Jenkins agents |
| Kubernetes + GitOps | Argo CD or Flux |
| Automated canaries | Argo Rollouts or Flagger ([9](./9_Progressive_Delivery_Controllers.md)) |
| Dark launches / kill switches | Unleash / OpenFeature |
| Cron inventory/cost audits, RC→prod image retag | Host-native workflows (`schedule` / `workflow_dispatch`) — [24](./24_Workflow_Automation_Beyond_PR_CI.md) |

**Ops note:** Jenkins asks you to run a controller (plugins, HA, backups). GitHub-hosted Actions shifts that burden to the platform. Prefer the lower-ops default when it fits; do not abandon a working Jenkins platform for fashion alone.

Sister-repo depth: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Five CI products, one org | Paved road ([Methodologies/16](../Methodologies/16_Roles_Teams_And_Platforms.md)) |
| Calling push `kubectl` from CI “GitOps” | Continuous reconciliation agents |
| Tool tour before a green commit stage | [1](./1_Pipelines_Build_Test_Deploy.md) first |

## Next

- Progressive delivery: [9](./9_Progressive_Delivery_Controllers.md)  
- Pick one CI folder + one CD folder and implement a thin vertical slice  

## Further reading

- [OpenGitOps](https://opengitops.dev/)  
- Official docs linked from each tool folder  
