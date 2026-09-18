# 21 — Feature and configuration coverage map

[← Previous](./20_Best_Practices_And_When_Not_CircleCI.md) · [README](./README.md) · [Next: YAML catalog →](./22_YAML_And_Configuration_Catalog.md)

## 1. Concepts

Use this map to see **which CircleCI feature classes exist** and **where they are taught**. Plan gates and resource class tables evolve — confirm in References. Full config key encyclopedias and every orb README stay upstream.

## 2. Advanced concepts — feature inventory

### A. Platform & tenancy

| Feature | Chapter |
|---------|---------|
| What CircleCI is; Cloud vs Server | [01](./01_What_Is_CircleCI.md) |
| Org / project / VCS | [02](./02_Organization_Project_And_VCS.md) |
| Permissions / SSO / **config policies (Scale+)** / IP ranges | [16](./16_Security_Permissions_SSO_And_Policies.md) |
| Plans / migrate / integrations extras | [24](./24_Integrations_Migrate_Plans_And_Extras.md) |
| Server / CLI / API | [18](./18_Server_CLI_API_And_Toolkit.md) |

### B. Execution

| Feature | Chapter |
|---------|---------|
| Managed executors / resource classes / ARM / GPU / iOS | [06](./06_Managed_Executors_And_Resource_Classes.md) |
| Self-hosted runners / **Runner Provisioner (preview)** | [07](./07_Self_Hosted_Runners.md) |

### C. Config & orchestration

| Feature | Chapter |
|---------|---------|
| Create project / view UI | [03](./03_Create_Project_Config_And_View_Pipelines.md) |
| Jobs / steps / workflows model | [04](./04_Config_Mental_Model_Jobs_Steps_Workflows.md) |
| Templates / examples | [05](./05_Templates_And_First_Config_Yml.md) |
| Workflows / filters / matrix / triggers | [08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md) |
| Caches / workspaces / artifacts | [09](./09_Caches_Workspaces_And_Artifacts.md) |
| Orbs | [10](./10_Orbs_Use_And_Author_Literacy.md) |
| Reusable config | [11](./11_Reusable_Config_Commands_Executors_Parameters.md) |
| Dynamic config | [14](./14_Dynamic_Config_And_Continuation.md) |
| Deployments / approvals / markers / **Smart Deployments** / release agent | [15](./15_Deployments_Approvals_And_Markers.md) |

### D. Security & identity

| Feature | Chapter |
|---------|---------|
| Contexts / env vars | [12](./12_Contexts_Env_Vars_And_Secrets.md) |
| OIDC | [13](./13_OIDC_And_Cloud_Federation.md) |

### E. Insights & craft

| Feature | Chapter |
|---------|---------|
| Insights / test split / optimize | [17](./17_Insights_Test_Splitting_And_Optimize.md) |
| Worked example | [19](./19_Worked_Example_Build_And_Deploy.md) |
| Practices | [20](./20_Best_Practices_And_When_Not_CircleCI.md) |
| Troubleshooting | [23](./23_Troubleshooting_And_Staff_Checklist.md) |

### F. Explicitly upstream

| Area | Why |
|------|-----|
| Full configuration-reference keys | Look up when implementing |
| Every orb in the registry | Pin and read the orb you adopt |
| Every Server operator runbook | Use versioned Server docs |
| Every cloud deploy how-to | Start from deploy guide for that target |
| Smart Deployments validation field encyclopedia | Release validation reference |
| Every Server operator runbook version | Pin your Server 4.x docs |
| Runner Provisioner Helm/KubeVirt encyclopedia | Runner Provisioner guide (preview) |

## 3. Applications and use cases

Walk A–E: use / defer / N/A per row.

## References

- [CircleCI docs](https://circleci.com/docs/)  
- [Configuration reference](https://circleci.com/docs/reference/configuration-reference/)  
