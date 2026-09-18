# 20 — Troubleshooting and staff checklist

[← Previous](./19_YAML_And_Configuration_Catalog.md) · [README](./README.md) · [Next: Snippets & search →](./21_Snippets_Search_Code_Insights_And_Wiki.md)

## 1. Concepts — frequent failures

| Symptom | Likely cause | Where |
|---------|--------------|-------|
| Pipeline never runs | Pipelines disabled; YAML path; trigger mismatch | [05](./05_First_Pipeline_And_Enablement.md), [08](./08_Triggers_Steps_Stages_Parallel.md) |
| Waiting for runner | Label mismatch; no capacity | [06](./06_Runners_Cloud_And_Self_Hosted.md) |
| Secured var empty / leaked concern | Wrong scope; script echo | [07](./07_Variables_Secrets_And_OIDC.md) |
| Merge allowed while red | Merge checks only suggested (need Premium **enforce**) | [03](./03_Pull_Requests_Branch_Permissions_Merge_Checks.md) |
| Deploy lacks permission | Deployment permissions / Premium | [11](./11_Deployments_And_Environments.md) |
| OIDC fail | Cloud trust / audience misconfig | [07](./07_Variables_Secrets_And_OIDC.md) |
| Minutes exhausted | Plan limits; large `size:` multipliers | [01](./01_What_Is_Bitbucket.md), [08](./08_Triggers_Steps_Stages_Parallel.md) |
| `4x`/`8x` rejected | Needs Standard or Premium | [08](./08_Triggers_Steps_Stages_Parallel.md) |

## 2. Advanced concepts — debug moves

- Open **Pipelines** → run → step **logs**; confirm image and script.  
- Clear caches if dependency weirdness.  
- Confirm **which commit digest** deployed.  
- For runners: connectivity, labels, disk.  
- Dynamic pipelines: inspect generated config in logs.  
- Rerun failed steps only when artifacts are still within retention (Atlassian documents a retention window for artifacts).

## 3. Applications and use cases — staff checklist

- Pipelines YAML in Git; pipes version-pinned  
- Branch permissions + merge checks on default branch; **enforce** on Premium for production  
- OIDC (or short-lived creds); no prod keys on PR pipelines  
- Deployment environments with restricted prod deployers (Premium deployment permissions when available)  
- Promote by digest; manual prod when practicing Continuous Delivery  
- Runners patched and owned if used  
- Jira issue keys on production-bound PRs when Atlassian is SoR for work  
- Cloud vs Data Center CI choice explicit (Pipelines vs Bamboo/Jenkins)  
- Workspace admins named; Access/SSO and required 2SV considered for enterprise  
- Rollback / previous digest path known  
- Plan gates known: minutes, LFS, step sizes `4x+`, Premium admin controls  

## References

- [Pipelines troubleshooting](https://support.atlassian.com/bitbucket-cloud/docs/troubleshoot-bitbucket-pipelines/)  
- [View your pipeline](https://support.atlassian.com/bitbucket-cloud/docs/view-your-pipeline/)  
- [Keep your workspace secure](https://support.atlassian.com/bitbucket-cloud/docs/keep-your-workspace-secure/)  
