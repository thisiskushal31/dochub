# 18 — Feature and configuration coverage map

[← Previous](./17_Best_Practices_And_When_Not_Buildkite.md) · [README](./README.md) · [Next: YAML catalog →](./19_YAML_And_Configuration_Catalog.md)

---

## 1. Concepts

Use this map to see **which Buildkite feature classes exist** and **where they are taught**. Plan gates evolve — confirm in References when implementing. GraphQL field encyclopedias and every package-ecosystem click-path stay upstream — literacy here, not a paste of the schema.

---

## 2. Advanced concepts — feature inventory

### A. Platform & tenancy

| Feature | Chapter |
|---------|---------|
| What Buildkite is; hybrid vs hosted | [01](./01_What_Is_Buildkite.md) |
| Org / teams / clusters | [02](./02_Organization_Teams_And_Clusters.md) |
| SSO / teams door | [15](./15_Platform_Teams_SSO_And_Governance.md) |
| Permissions / templates / exports / migration | [25](./25_Governance_Permissions_And_Migration.md) |
| APIs / CLI / Terraform / audit / limits / plans / AI surfaces | [26](./26_APIs_CLI_Terraform_And_Platform_Extras.md) |

### B. Agents & compute

| Feature | Chapter |
|---------|---------|
| Self-hosted vs hosted agents | [04](./04_Agents_Self_Hosted_And_Hosted.md) |
| Queues / targeting | [05](./05_Queues_Clusters_And_Targeting.md) |
| Hooks / lifecycle / install OS & cloud | [22](./22_Agent_Hooks_Lifecycle_And_Install_Spectrum.md) |
| Hosted ops (shapes, cache, network, images) | [23](./23_Hosted_Agent_Operations.md) |
| Elastic CI AWS / Agent Stack K8s / GCP / Azure | [13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md) |

### C. Source control

| Feature | Chapter |
|---------|---------|
| Create pipeline / view builds | [03](./03_Create_Pipeline_Connect_Git_And_View_Builds.md) |
| Providers + private code access | [21](./21_Source_Control_Providers_And_Code_Access.md) |

### D. Pipelines

| Feature | Chapter |
|---------|---------|
| YAML / step types | [06](./06_Pipeline_YAML_And_Step_Types.md) |
| Templates / examples | [07](./07_Templates_And_First_Pipeline_Yml.md) |
| Workflows / matrix / schedules / block | [08](./08_Workflows_Depends_Matrix_Schedules_And_Blocks.md) |
| Plugins / artifacts / cache / annotations | [09](./09_Plugins_Artifacts_Cache_And_Annotations.md) |
| Secrets / env / OIDC | [10](./10_Secrets_Environment_And_OIDC.md) |
| Dynamic pipelines / upload | [11](./11_Dynamic_Pipelines_And_Pipeline_Upload.md) |
| Deployments + target guides | [12](./12_Deployments_And_Environments.md) |
| Integrations / notifications / observability / insights | [24](./24_Integrations_Notifications_Observability_And_Insights.md) |

### E. Sibling products

| Feature | Chapter |
|---------|---------|
| Package Registries ecosystems / Test Engine suites | [14](./14_Package_Registries_And_Test_Engine.md) |

### F. Craft

| Feature | Chapter |
|---------|---------|
| Worked example | [16](./16_Worked_Example_Build_And_Deploy.md) |
| Practices | [17](./17_Best_Practices_And_When_Not_Buildkite.md) |
| Troubleshooting | [20](./20_Troubleshooting_And_Staff_Checklist.md) |

### G. Explicitly upstream (not duplicated)

| Area | Why |
|------|-----|
| Full GraphQL schema / every REST resource | Use API docs when coding clients |
| Per-ecosystem Package Registries tutorials | Start from ecosystem page you need |
| Every plugin’s README | Pin and read the plugin you adopt |
| Agent CLI flag encyclopedia | Agent CLI reference |

---

## 3. Applications and use cases

Walk A–F for a platform checklist: use / defer / N/A per row.

---

## References

- [Buildkite docs](https://buildkite.com/docs)  
- [Pipelines configure](https://buildkite.com/docs/pipelines/configure)  
