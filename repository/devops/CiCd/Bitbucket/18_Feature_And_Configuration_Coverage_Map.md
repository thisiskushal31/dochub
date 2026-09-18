# 18 — Feature and configuration coverage map

[← Previous](./17_Best_Practices_And_Cloud_Vs_Data_Center.md) · [README](./README.md) · [Next: YAML catalog →](./19_YAML_And_Configuration_Catalog.md)

## 1. Concepts

Use this map to see **which Bitbucket feature classes exist** and **where they are taught**. YAML keys and plan gates evolve — confirm in References when implementing.

## 2. Advanced concepts — feature inventory

### A. Forge platform

| Feature | Chapter |
|---------|---------|
| Cloud vs Data Center; Pipelines role | [01](./01_What_Is_Bitbucket.md) |
| Workspace / project / repo / access | [02](./02_Workspace_Project_Repo_And_Access.md) |
| PRs / branch permissions / merge checks / branching model | [03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) |
| Create/clone/push repo; LFS; tokens | [02](./02_Workspace_Project_Repo_And_Access.md) |
| Snippets / search / code insights / wiki | [21](./21_Snippets_Search_Code_Insights_And_Wiki.md) |
| Jira / Access / Marketplace | [14](./14_Jira_And_Atlassian_Integrations.md) |
| Security hardening / Premium access controls | [15](./15_Security_Access_And_Workspace_Hardening.md) |

### B. Pipelines

| Feature | Chapter |
|---------|---------|
| YAML mental model | [04](./04_Pipelines_Mental_Model_And_YAML.md) |
| Enablement / configure YAML / **view runs and logs** | [05](./05_First_Pipeline_And_Enablement.md) |
| Runners (Cloud / self-hosted) | [06](./06_Runners_Cloud_And_Self_Hosted.md) |
| Variables / secured / OIDC / vault providers | [07](./07_Variables_Secrets_And_OIDC.md) |
| Triggers / steps / stages / parallel / schedules / step size | [08](./08_Triggers_Steps_Stages_Parallel.md) |
| Caches / artifacts / services | [09](./09_Caches_Artifacts_And_Services.md) |
| Pipes / anchors / child pipelines / **config sharing (Premium)** | [10](./10_Pipes_Anchors_And_Reuse.md) |
| Deployments / environments / permissions | [11](./11_Deployments_And_Environments.md) |
| Deploy target spectrum | [12](./12_Deploy_Targets_And_Pipes_Catalog.md) |
| Dynamic pipelines / advanced YAML | [13](./13_Dynamic_Pipelines_And_Advanced_YAML.md) |
| Agentic Pipelines (beta) | [13](./13_Dynamic_Pipelines_And_Advanced_YAML.md) |

### C. Craft

| Feature | Chapter |
|---------|---------|
| Worked example | [16](./16_Worked_Example_Build_And_Deploy.md) |
| Practices + Cloud vs DC | [17](./17_Best_Practices_And_Cloud_Vs_Data_Center.md) |
| Troubleshooting | [20](./20_Troubleshooting_And_Staff_Checklist.md) |

### D. Deeper upstream essays

| Area | Notes |
|------|-------|
| Full YAML property encyclopedia | Configuration reference on Support |
| Per-cloud deployment cookbooks | Deployment guides; class in [12](./12_Deploy_Targets_And_Pipes_Catalog.md) |
| Writing custom pipes / Forge merge checks | Contributor/extensibility docs |
| Bitbucket Data Center admin / Bamboo | DC docs; CI choice in [17](./17_Best_Practices_And_Cloud_Vs_Data_Center.md) |

## 3. Applications and use cases

Walk A–C for a platform checklist: use / defer / N/A per row.

## References

- [Bitbucket Cloud support](https://support.atlassian.com/bitbucket-cloud/)  
- [Pipelines configuration reference](https://support.atlassian.com/bitbucket-cloud/docs/bitbucket-pipelines-configuration-reference/)  
