# 23 — Best practices and when not GitLab

[← Previous](./22_Worked_Example_CI_Build_And_Promote.md) · [README](./README.md) · [Next: Coverage map →](./24_Feature_And_Offering_Coverage_Map.md)

## 1. Concepts — defaults that age well

| Do | Don’t |
|----|-------|
| Pin components/templates | Floating `@main` includes |
| `rules` + efficient workflows | Double MR+branch pipelines by accident |
| Protected vars/envs | Secrets on unprotected branches |
| ID tokens / OIDC | Long-lived cloud keys |
| Promote by digest | Rebuild for prod |
| `needs` where it helps | Stage-only bottlenecks without reason |
| Job token allowlists | Broad tokens everywhere |
| Own runners & schedules | Orphan privileged runners / silent cron failures |
| GitOps for cluster apply | Unbounded kubectl from every pipeline |

## 2. Advanced — when *not* (or not only) GitLab CI

| Situation | Better fit |
|-----------|------------|
| Code only on GitHub and staying there | [GitHub_Actions/](../GitHub_Actions/README.md) |
| Extreme custom agents already on Buildkite/Jenkins | Keep that plane; maybe mirror status |
| Only need cluster sync | Flux/Argo — GitLab builds images |
| Org refuses GitLab product | Don’t force SCM migration for CI alone |

## 3. Applications and use cases

| Decision | Ask |
|----------|-----|
| Adopt GitLab CI? | Is GitLab (or external-repo CI) the system of record? |
| Self-managed runners? | Who patches and isolates them? |
| Components? | Who versions the paved road? |

## References

- [CI/CD best practices / efficiency](https://docs.gitlab.com/ci/pipelines/pipeline_efficiency/)  
- [Pipeline security](https://docs.gitlab.com/ci/pipeline_security/)  
- [CiCd tools map](../2_CI_CD_Tools.md)  
