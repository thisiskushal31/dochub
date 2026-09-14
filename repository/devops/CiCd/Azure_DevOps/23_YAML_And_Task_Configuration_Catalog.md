# 23 — YAML and task configuration catalog

[← Previous](./22_Feature_And_Configuration_Coverage_Map.md) · [README](./README.md) · [Next: Troubleshooting →](./24_Troubleshooting_And_Staff_Checklist.md)

---

## 1. Concepts — configuration surfaces

| Surface | What you set |
|---------|----------------|
| Pipeline YAML | `trigger`, `pr`, `schedules`, `resources`, `parameters`, `variables`, `stages` / `jobs` / `steps`, cache tasks |
| Deployment job | `environment`, `strategy` (`runOnce` / `rolling` / `canary`) |
| Pool | `vmImage` or named self-hosted pool / demands |
| Templates | `template:` / `extends:` + parameters |
| Library | Variable groups, secure files |
| Service connections | ARM, GitHub, Bitbucket, Kubernetes, Docker, generic |
| Environments | Approvals, checks, K8s/VM resource links |
| Classic only | Release definitions, **deployment groups**, classic gates |
| Feeds | Azure Artifacts permissions, upstreams, retention |

Exact keys: [YAML schema](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema) for your agent/task versions — this catalog names **kinds** of knobs.

---

## 2. Advanced concepts — task families (deploy)

| Family | Examples | Chapter |
|--------|----------|---------|
| App Service / web | `AzureWebApp@1`, `AzureRmWebAppDeployment@5` | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |
| Functions | `AzureFunctionApp@2`, container variants | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |
| Static Web Apps | `AzureStaticWebApp@0` | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |
| VMSS | `AzureVmssDeployment@1` | [12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) |
| Containers | Docker, ACR, `AzureContainerApps@1` | [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |
| Kubernetes | `KubernetesManifest@1`, Helm, kubectl | [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |
| Artifacts | Publish/Download pipeline artifact; NuGet/npm publish | [10](./10_Artifacts_Feeds_And_Packages.md) |
| IaC | AzureResourceManagerTemplateDeployment, Terraform tasks, Ansible | [14](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md) |
| Quality | VSTest, PublishTestResults, code coverage | [15](./15_Observability_Hooks_And_Non_Azure_Targets.md) |

### Good defaults

| Env | Lean toward |
|-----|-------------|
| Lab | Hosted agents; manual environments |
| Staging | Auto deploy on `main`; federated connection |
| Prod | Approvals; separate connection; digest pins |

---

## 3. Applications and use cases

Use as a PR checklist: every non-default YAML block should have a one-line reason.

---

## References

- [YAML schema reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)  
- [Task reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/)  
- [Expressions](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/expressions)  
