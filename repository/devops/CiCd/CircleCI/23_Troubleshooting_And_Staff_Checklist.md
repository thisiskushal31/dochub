# 23 — Troubleshooting and staff checklist

[← Previous](./22_YAML_And_Configuration_Catalog.md) · [README](./README.md) · [Next: Extras →](./24_Integrations_Migrate_Plans_And_Extras.md)

---

## 1. Concepts — frequent failures

| Symptom | Likely cause | Where |
|---------|--------------|-------|
| Pipeline never runs | Project/trigger not connected; wrong branch | [02](./02_Organization_Project_And_VCS.md), [03](./03_Create_Project_Config_And_View_Pipelines.md) |
| Queued forever | Concurrency limit; no runner capacity | [01](./01_What_Is_CircleCI.md), [07](./07_Self_Hosted_Runners.md) |
| Config error on parse | YAML/`version: 2.1` issues | [04](./04_Config_Mental_Model_Jobs_Steps_Workflows.md), CLI validate |
| Context empty | Not attached on workflow job | [12](./12_Contexts_Env_Vars_And_Secrets.md) |
| OIDC missing on fork | Fork secrets setting | [13](./13_OIDC_And_Cloud_Federation.md) |
| Cache weirdness | Bad key; corrupt cache | [09](./09_Caches_Workspaces_And_Artifacts.md) |
| Deploy skipped | filters / missing approval | [08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md), [15](./15_Deployments_Approvals_And_Markers.md) |
| Runner job pending | resource_class mismatch | [07](./07_Self_Hosted_Runners.md) |

---

## 2. Advanced concepts — debug moves

- Open failed **step** log; confirm image and command.  
- `circleci config validate` / `process` locally.  
- SSH into job when safe.  
- Check Insights for systemic flakes.  
- Confirm which context names the workflow actually requested.

---

## 3. Applications and use cases — staff checklist

- Config in Git; orbs/images pinned  
- Contexts least-privileged; OIDC for cloud  
- Production behind approval (or equivalent)  
- Promote by digest; resource classes right-sized  
- Runners owned/patched if used; classes isolated by trust  
- SSO/roles considered; fork secret policy explicit  
- Cloud vs Server choice documented  
- Rollback / previous digest path known  

---

## References

- [Troubleshoot](https://circleci.com/docs/reference/troubleshoot/)  
- [Runner troubleshoot](https://circleci.com/docs/guides/execution-runner/troubleshoot-self-hosted-runner/)  
