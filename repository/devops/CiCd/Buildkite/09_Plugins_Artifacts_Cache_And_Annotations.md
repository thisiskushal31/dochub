# 09 — Plugins, artifacts, cache, and annotations

[← Previous](./08_Workflows_Depends_Matrix_Schedules_And_Blocks.md) · [README](./README.md) · [Next: Secrets →](./10_Secrets_Environment_And_OIDC.md)

---

## 1. Concepts

| Mechanism | Job |
|-----------|-----|
| **Plugins** | Packaged step behaviors (checkout variants, Docker, tests, …) |
| **Artifacts** | Upload/download files between jobs / for humans |
| **Cache** | Speed restores (self-managed or hosted cache volumes) |
| **Annotations** | Rich notes on the build page |

```yml
steps:
  - label: "Build"
    command: "npm run build"
    artifact_paths:
      - "dist/**/*"
```

Plugins attach under a step’s `plugins:` key — pin versions like other supply-chain inputs ([CiCd/6](../6_Supply_Chain_And_Signing.md)).

---

## 2. Advanced concepts

### Artifacts vs registries

Pipeline artifacts are for **build handoff**. Release bits belong in a registry (Buildkite Package Registries or external) promoted by digest ([14](./14_Package_Registries_And_Test_Engine.md), [CiCd/4](../4_Artifacts_And_Registries.md)).

### Cache ownership

Self-hosted: you own cache validity. Hosted: use documented cache volumes where available.

### Annotations

Use for deploy summaries, test links, failure context — not for secrets.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Pass `dist/` to deploy job | artifact_paths |
| Dockerized steps | Docker plugin (pinned) |
| Explain deploy | annotation after success |

**Good:** small artifacts. **Bad:** upload `node_modules` every build.

---

## References

- [Artifacts](https://buildkite.com/docs/pipelines/configure/artifacts)  
- [Plugins](https://buildkite.com/docs/pipelines/integrations/plugins)  
- [Cache](https://buildkite.com/docs/pipelines/configure/cache)  
- [Annotations](https://buildkite.com/docs/pipelines/configure/annotations)  
