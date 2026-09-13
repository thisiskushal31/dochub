# Azure DevOps

[← Back to CI/CD](../README.md)

Microsoft’s DevOps suite: **Azure Pipelines** (CI/CD), Boards, Repos, Artifacts. Use this folder for Pipelines-first literacy; Boards/Repos are adjacent work-tracking.

Install walkthrough: [1_Install_And_First_Use.md](./1_Install_And_First_Use.md). Concepts: [1](../1_Pipelines_Build_Test_Deploy.md).

---

## What Pipelines provides

- YAML pipelines (preferred) or classic UI pipelines  
- Microsoft-hosted or self-hosted **agents**  
- Stages, jobs, environments with approvals/checks  
- Deep Azure cloud integration (service connections, OIDC/federated credentials)  
- Azure Artifacts for packages alongside container registries  

Works with GitHub or Azure Repos as the code host.

---

## Mental model

```text
trigger → pipeline YAML
  → stages (Build → Deploy)
  → environment checks / approvals
  → Azure/K8s/other deployment tasks
```

Promote **digests** the same as any other CI ([4](../4_Artifacts_And_Registries.md)).

---

## First use

See [1_Install_And_First_Use.md](./1_Install_And_First_Use.md). Official: [Azure Pipelines docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Classic-only pipelines with no PR review | YAML in repo |
| Broad service principal forever | Federated identity + scoped roles ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) |

## Further reading

- [YAML schema](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)  
- [Environments and approvals](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments)  
