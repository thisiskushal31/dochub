# 12 — Caching, artifacts, and job tokens

[← Previous](./11_Images_Services_And_Docker_Build.md) · [README](./README.md) · [Next: Includes →](./13_Includes_Components_And_CI_Catalog.md)

## 1. Concepts

| Tool | Purpose |
|------|---------|
| **Cache** | Speed dependency downloads across jobs/pipelines (best-effort) |
| **Artifacts** | Pass build outputs between jobs / keep for download |
| **Job token** | Short-lived token for the running job to call GitLab APIs/registry |

```yaml
build:
  script: ["npm ci", "npm run build"]
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths: [node_modules/]
  artifacts:
    paths: [dist/]
```

Cache ≠ artifacts: caches can miss/evict; artifacts are the deliberate handoff (and expire).

## 2. Advanced concepts

### Cache practices

Multiple caches, fallback keys, `policy: pull/push`, disabling per job — see caching docs. Don’t cache secrets.

### Artifacts & reports (testing surface)

Artifacts can include **reports** that MR widgets understand: JUnit, coverage, code quality, metrics, and security reports (SAST, dependency scanning, …). That is how GitLab’s **testing** docs plug into CI — configure `artifacts:reports:*` rather than only raw log scraping. Detail for scanners: [17](./17_Security_Scanning_And_Compliance_Literacy.md).

### Job token hardening

Limit job token permissions / allowed projects so a job can’t reach arbitrary group resources. Prefer least privilege.

## 3. Applications and use cases

| Goal | Use |
|------|-----|
| Faster npm/Go builds | Cache |
| Deploy job needs binary | Artifacts or registry |
| Cross-project fetch | Job token allowlists |

**Good:** registry holds release truth; artifacts for pipeline plumbing. **Bad:** treating cache as a reliable release store.

## References

- [Caching](https://docs.gitlab.com/ci/caching/)  
- [Job artifacts](https://docs.gitlab.com/ci/jobs/job_artifacts/)  
- [CI/CD job token](https://docs.gitlab.com/ci/jobs/ci_job_token/)  
