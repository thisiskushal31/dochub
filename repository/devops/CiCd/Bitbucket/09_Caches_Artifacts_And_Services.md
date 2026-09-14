# 09 — Caches, artifacts, and services

[← Previous](./08_Triggers_Steps_Stages_Parallel.md) · [README](./README.md) · [Next: Pipes →](./10_Pipes_Anchors_And_Reuse.md)

---

## 1. Concepts

| Mechanism | Job |
|-----------|-----|
| **Caches** | Speed dependency restore (npm, Maven, pip, …) across steps/runs |
| **Artifacts** | Pass build outputs to later steps (and download from UI) |
| **Services** | Sidecar containers (databases, Docker daemon) for a step |

Define reusable caches/services under `definitions:` when shared.

### Combined mini-template

```yaml
image: node:20

definitions:
  caches:
    npm: ~/.npm
  services:
    postgres:
      image: postgres:16
      variables:
        POSTGRES_DB: app
        POSTGRES_USER: app
        POSTGRES_PASSWORD: app

pipelines:
  default:
    - step:
        name: Test with DB
        caches:
          - npm
        services:
          - postgres
        script:
          - npm ci
          - npm test
        artifacts:
          - coverage/**
```

Caches speed restores; **artifacts** hand files to later steps / the UI; **services** run beside the step. Memory is shared with the step — size carefully.

---

## 2. Advanced concepts

### Cache hygiene

Key caches on lockfiles. Corrupt caches cause mysterious fails — know how to clear. Don’t cache secrets.

### Artifacts vs registries

Pipeline artifacts are for **within-pipeline** handoff. Immutable release bits belong in a **registry** or package feed promoted by digest ([CiCd/4](../4_Artifacts_And_Registries.md)).

### Service containers

Spin Postgres/Redis for integration tests; use Docker service for image builds. Memory is shared with the step — size accordingly on Cloud vs runners.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Faster Node CI | `caches: [node]` |
| Zip for deploy step | `artifacts: [dist/**]` |
| Integration tests | Service: postgres |

**Good:** small artifacts; registry for releases. **Bad:** artifact the world every build.

---

## References

- [Caches](https://support.atlassian.com/bitbucket-cloud/docs/cache-dependencies/)  
- [Artifacts](https://support.atlassian.com/bitbucket-cloud/docs/use-artifacts-in-steps/)  
- [Databases and service containers](https://support.atlassian.com/bitbucket-cloud/docs/databases-and-service-containers/)  
- [Definitions](https://support.atlassian.com/bitbucket-cloud/docs/definitions-caches-services-and-export-pipelines/)  
