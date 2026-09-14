# 08 — Templates, tasks, and extensions

[← Previous](./07_Triggers_Stages_Jobs_And_Strategies.md) · [README](./README.md) · [Next: Environments →](./09_Environments_Approvals_Checks_And_Classic_Releases.md)

---

## 1. Concepts

**Templates** are reusable YAML fragments (stages, jobs, steps, variables) referenced with `template:`. **Tasks** are versioned units from Microsoft or the Marketplace. Together they form the **paved road**.

```yaml
# azure-pipelines.yml
stages:
  - template: templates/ci.yml@templates
    parameters:
      project: MyApp.sln
```

Pin template repo refs (`@refs/tags/v3`) the same way you pin actions elsewhere ([CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md)).

---

## 2. Advanced concepts

### Template types

| Type | Reuses |
|------|--------|
| Step templates | Common lint/test blocks |
| Job / stage templates | Whole CI or deploy shapes |
| Extends | Locked outer skeleton; teams fill parameters (strong platform control) |

`extends` is how platform teams enforce “you may only add these stages.”

### Task versions

Always specify `@major` (e.g. `DotNetCoreCLI@2`). Read task docs before major bumps. Prefer official Microsoft tasks for Azure deploys; third-party Marketplace tasks need supply-chain review.

### Extensions

Org can install Marketplace extensions (extra tasks, Boards widgets, gates). Govern who can install; extensions widen the attack surface.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Org standard CI | Central templates repo + `extends` |
| Language variants | Parameters for Node vs .NET vs Python |
| Disable cowboy YAML | Required template + branch policy |

**Good:** versioned templates; changelog for template tags. **Bad:** every repo copies 400 lines of deploy YAML.

---

## References

- [YAML templates](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates)  
- [Task reference index](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/)  
- [Marketplace](https://marketplace.visualstudio.com/azuredevops)  
