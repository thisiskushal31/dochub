# 03 — Pipelines mental model: YAML and classic

[← Previous](./02_Organization_Project_Process_And_Access.md) · [README](./README.md) · [Next: First pipeline →](./04_First_Pipeline_And_Project_Setup.md)

## 1. Concepts

Azure Pipelines automates **build, test, and deploy**. The durable objects:

| Object | Role |
|--------|------|
| **Pipeline** | Definition of the automation (YAML file or classic definition) |
| **Run** | One execution of a pipeline |
| **Stage** | Major phase (Build, Deploy-Staging, Deploy-Prod) |
| **Job** | Unit of work — usually an **agent pool** job; also **deployment** jobs (environments) and, in classic releases, **deployment group** jobs |
| **Step** | Script or **task** (prepackaged action) |
| **Agent** | Machine that runs agent-pool jobs ([05](./05_Agents_Hosted_And_Self_Hosted.md)) |
| **Environment** | Named deploy target with approvals/checks ([09](./09_Environments_Approvals_Checks_And_Classic_Releases.md)) — YAML path |
| **Deployment group** | Classic-release set of target machines with agents — brownfield cousin of environments ([09](./09_Environments_Approvals_Checks_And_Classic_Releases.md)) |
| **Artifact** | Output passed between jobs/stages ([10](./10_Artifacts_Feeds_And_Packages.md)) |

```text
trigger → pipeline
  → stage Build → job → steps (restore, test, publish)
  → stage Deploy → deployment job → environment checks → deploy tasks
```

### YAML vs classic

| | **YAML** | **Classic** |
|--|----------|-------------|
| Definition home | Repo (`azure-pipelines.yml` or path you choose) | Stored in Azure DevOps UI/DB |
| Review | Normal PR | Harder; click-ops drift |
| New work | **Prefer** | Maintain / migrate |
| Releases | Stages in same YAML (or multi-stage) | Separate **Classic Release** pipelines common in legacy |

Classic **build** + classic **release** is the old TFS-shaped pattern. Multi-stage **YAML** replaces most of that for greenfield.

## 2. Advanced concepts

### Tasks vs scripts

A **task** is a versioned Marketplace (or built-in) action (`DotNetCoreCLI@2`, `AzureWebApp@1`, …). Pin major versions; read breaking-change notes when bumping. Scripts (`script`, `bash`, `pwsh`) are fine when a task adds no value.

### Deployment jobs

`deployment:` jobs record history against an **environment**, enable approvals/checks, and support strategies (`runOnce`, `rolling`, `canary` for VM resources). Use them for real deploys; keep compile/test as ordinary jobs.

### Job kinds (literacy)

| Kind | Where |
|------|-------|
| **Agent pool job** | Default — runs on hosted/self-hosted agent |
| **Deployment job** | YAML — targets an environment |
| **Server job** | Runs on Azure DevOps (no agent) for limited orchestration steps |
| **Deployment group job** | **Classic releases only** — runs on machines registered in a deployment group |

### Classic release literacy (brownfield)

Classic releases: **artifacts** from builds → **stages** (Dev/QA/Prod) → **tasks** + **approvals** + **gates** + optional **deployment groups**. When migrating: move stage logic into YAML stages/environments (VM/K8s resources on environments replace many deployment-group patterns). Do not rewrite mid-incident — migrate calmly with parity tests.

### Azure DevOps Server

YAML multi-stage works on recent Server versions; confirm your Server version for feature gates (environments, checks, deployment strategies).

## 3. Applications and use cases

| Estate | Shape |
|--------|-------|
| New Azure-centric product | Multi-stage YAML; environments for staging/prod |
| Legacy .NET on classic releases | Keep classic until YAML parity; then freeze classic |
| GitHub code + Azure deploy | Pipeline in Azure DevOps pointing at GitHub repo |

**Good:** one pipeline definition path per product; digest promotion. **Bad:** copy-paste classic definitions per environment with divergent tasks.

## References

- [Key concepts for Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts)  
- [YAML schema reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)  
- [Classic release pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/)  
