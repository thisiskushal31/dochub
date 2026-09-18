# 14 — Catalog, Hub, and reusable Tasks

[← Previous](./13_Pipelines_As_Code.md) · [README](./README.md) · [Next: CLI →](./15_CLI_tkn.md)

## 1. Concepts

**Tekton Catalog** holds community (and org) Tasks/Pipelines. **Hub** is the discovery/UI/API surface for finding them.

Reuse via:

1. Copy YAML into your repo (simple; drifts), or  
2. **Resolvers** (`hub` / `git` / `bundle`) with **pinned** revisions ([11](./11_Resolvers_Bundles_And_Remote_Resources.md)).

```yaml
taskRef:
  resolver: hub
  params:
    - name: task
      value: git-clone
    - name: version
      value: "0.9"
```

Prefer building an **internal catalog** Git repo for org standards; treat public Hub as ingredients you pin and review.

## 2. Advanced concepts

### Contracts / bundles

Tekton bundle contracts package immutable Task sets as OCI artifacts.

### Versioning

Catalog Tasks version folders (0.1, 0.9, …). Read changelogs before bumping.

### Upstream-only

This track will **not** document every Hub Task — open Hub for the Task you adopt.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Git clone / Kaniko | Pinned Hub or internal fork |
| Org lint/test | Internal catalog + git resolver |
| Air-gap | Mirror bundles |

**Staff checklist**

- Internal catalog Git repo (or mirrored bundles) for org standards  
- Public Hub Tasks reviewed + pinned before prod  
- Bundle contracts used when you need immutable Task sets  

**Good:** reviewed pins. **Bad:** unpinned Hub `latest` in prod.

## References

- [Catalog](https://tekton.dev/docs/catalog/)  
- [Tekton Hub](https://hub.tekton.dev/)  
