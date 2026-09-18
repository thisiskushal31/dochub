# 11 — Resolvers, bundles, and remote resources

[← Previous](./10_Matrix_CustomRuns_And_StepActions.md) · [README](./README.md) · [Next: Triggers →](./12_Triggers_EventListeners_And_Interceptors.md)

## 1. Concepts

Instead of copying Task YAML into every namespace, **resolvers** fetch remote definitions:

| Resolver | Source |
|----------|--------|
| **git** | Task/Pipeline from a Git repo path (`git` resolver) |
| **hub** | Tekton Hub / Catalog (`hub` resolver) |
| **bundle** | OCI Tekton bundle (`bundle` resolver) |
| **cluster** | Object already in-cluster / other namespace (`cluster` resolver) |
| **http** | HTTP(S) URL (`http` resolver) |

```yaml
taskRef:
  resolver: git
  params:
    - name: url
      value: https://github.com/tektoncd/catalog
    - name: pathInRepo
      value: task/git-clone/0.9/git-clone.yaml
    - name: revision
      value: main   # prefer immutable commit SHA in prod
```

**Resolution** project + Pipelines resolver docs cover enablement and contracts ([tekton.dev resolution](https://tekton.dev/docs/pipelines/resolution/)).

## 2. Advanced concepts

### Pin revisions

Floating `main` is a supply-chain risk. Pin Git SHA or bundle digest ([14](./14_Catalog_Hub_And_Reusable_Tasks.md)).

### Trusted resources

Combine resolvers with admission / trusted resource policies so only approved sources run.

### Air-gap

Prefetch bundles into a private registry; use bundle resolver against the mirror.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Org paved road | git resolver to internal catalog repo |
| Community Task | hub resolver + digest pin |
| Immutable promote | OCI bundle of Task versions |

**Staff checklist**

- Remote refs pinned (SHA/digest)  
- Only approved resolver sources  
- Air-gap mirror if required  

**Good:** pinned remote refs. **Bad:** resolve `latest` from the public internet on every Run.

## References

- [Resolution](https://tekton.dev/docs/pipelines/resolution/)  
- [Resolver reference](https://tekton.dev/docs/pipelines/resolver-reference/)  
- [Hub resolver](https://tekton.dev/docs/pipelines/hub-resolver/)  
