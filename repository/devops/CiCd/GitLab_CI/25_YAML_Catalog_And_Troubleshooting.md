# 25 — YAML catalog and troubleshooting

[← Previous](./24_Feature_And_Offering_Coverage_Map.md) · [README](./README.md) · [Next: Extras →](./26_Migrate_Plans_And_Extras.md)

## 1. Concepts — surfaces you edit

| Surface | Where |
|---------|--------|
| Pipeline config | `.gitlab-ci.yml` (or custom path) |
| Includes / components | Other projects / Catalog |
| CI/CD variables | Project/group/instance settings |
| Runners | Admin / group / project runner pages |
| Environments | Deployments UI + YAML `environment` |
| Protected branches/envs | Repository / CI settings |
| Security policies | Group security (tier-aware) |

### Keyword index (map)

Global: `stages`, `workflow`, `default`, `include`, `variables`, `image`, …  
Job: `script`, `run`, `rules`, `needs`, `cache`, `artifacts`, `tags`, `environment`, `trigger`, `parallel`, `retry`, `timeout`, `id_tokens`, …  

Full list: [YAML reference](https://docs.gitlab.com/ci/yaml/).

## 2. Advanced — troubleshooting playbook

| Symptom | Likely cause | Look at |
|---------|--------------|---------|
| Pipeline never created | `workflow:rules` / push options | Workflow rules; MR vs branch |
| Job stuck pending | No matching runner/tags | Runner status; tags |
| Variable empty/wrong | Protected scope / YAML parse | Protected flag; quoting |
| OIDC fails | `id_tokens` / cloud trust | ID token aud; cloud provider trust |
| DinD cannot connect | Service/TLS/privileged | Docker build troubleshooting |
| Double pipelines | Branch + MR both on | `workflow:rules` |
| Component not found | Version/pin/path | Component ref; Catalog |
| Deploy not gated | Env not protected | Protected environments |

## 3. Applications — staff checklist

- Pipeline required to merge on protected branches
- Components/templates pinned
- Protected variables for secrets; ID tokens for cloud
- Protected environments for production
- Promote-by-digest documented
- Runner tags and ownership clear
- Job token allowlists reviewed
- Schedules have owners
- Security scanner findings have triage owners (if enabled)

**Good:** fix in Git. **Bad:** retry until green without root cause.

## References

- [Debugging CI/CD](https://docs.gitlab.com/ci/debugging/)  
- [CI/CD YAML](https://docs.gitlab.com/ci/yaml/)  
- [Job control](https://docs.gitlab.com/ci/jobs/job_control/)  
