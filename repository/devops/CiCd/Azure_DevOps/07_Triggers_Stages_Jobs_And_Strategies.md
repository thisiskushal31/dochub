# 07 — Triggers, stages, jobs, and strategies

[← Previous](./06_Variables_Secrets_And_Library.md) · [README](./README.md) · [Next: Templates →](./08_Templates_Tasks_And_Extensions.md)

---

## 1. Concepts

### Triggers

| Trigger | Use |
|---------|-----|
| `trigger` (CI) | Push to branches/tags/paths |
| `pr` | Pull request validation |
| `schedules` | Cron (audits, nightly) |
| Manual / `workflow` style | Run pipeline UI / REST / resource triggers |

Path filters keep monorepos from rebuilding everything ([CiCd/14](../14_Monorepo_And_Multi_Repo_CI.md)).

### Stages and jobs

Stages order the delivery story. Jobs inside a stage can run in parallel (`dependsOn`). Use **deployment** jobs when binding to environments.

### Strategies (deployment)

| Strategy | Where it shows up |
|----------|-------------------|
| `runOnce` | Default deploy |
| `rolling` | VM resource rolling updates |
| `canary` | VM canary; Kubernetes canary via `KubernetesManifest@1` actions ([13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md)) |

Matrix (`strategy.matrix`) fans out test jobs across versions/OS.

---

## 2. Advanced concepts

### Pipeline resources and multi-repo checkout

YAML can declare **resources**: other pipelines, repositories, containers. Multiple `checkout:` steps pull those repos (tools repo + app repo is common). Cross-project Azure Repos checkout needs **job authorization scope** configured to allow it ([19](./19_Security_Permissions_And_Service_Connections.md)).

### Source hosts

Pipelines is not Azure-Repos-only. First-class repo connections include **Azure Repos Git**, **GitHub**, **Bitbucket Cloud**, **TFVC**, **Subversion**, and generic Git — each via service connection / OAuth as required ([04](./04_First_Pipeline_And_Project_Setup.md)).

### Runtime parameters

`parameters:` let humans (or automation) pass values at queue time (environment name, skip-deploy flags). Prefer parameters over editing YAML for every one-off run.

### Caching

Pipeline **cache** tasks speed restore of npm/NuGet/Maven/Gradle directories — key on lockfiles. Same durable idea as [CiCd/11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).

### Conditions

`condition:` on stages/jobs/steps (succeeded, failed, custom expressions). Keep conditions readable; hideously nested conditions become untestable.

### Approvals live on environments (and other resources)

Human and automated **checks** can sit on environments, service connections, variable groups, secure files, agent pools, and repositories — not only ad-hoc `ManualIntervention` ([09](./09_Environments_Approvals_Checks_And_Classic_Releases.md)).

### Host-neutral jobs

Scheduled inventory, SemVer promote, reusable templates — same durable jobs as [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md); syntax here is Azure Pipelines YAML.

---

## 3. Applications and use cases

| Goal | Shape |
|------|-------|
| PR CI | `pr:` + test stage only |
| Tag release | `trigger.tags` → build → push digest |
| Nightly audit | `schedules` + OIDC to cloud |
| Monorepo | Path filters + sparse checkout |

**Good:** fail-fast test stage before expensive deploy. **Bad:** one giant stage with no conditions and always-deploy-on-fail paths.

---

## References

- [Triggers](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/triggers)  
- [Stages, jobs, steps](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/stages)  
- [Deployments and strategies](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/deployment-jobs)  
- [Pipeline resources](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/resources)  
- [Multi-repo checkout](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/multi-repo-checkout)  
- [Runtime parameters](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/runtime-parameters)  
- [Pipeline caching](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching)  
