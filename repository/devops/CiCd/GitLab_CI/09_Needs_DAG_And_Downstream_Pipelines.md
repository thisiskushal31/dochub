# 09 — Needs, DAG, and downstream pipelines

[← Previous](./08_Rules_Workflow_And_Pipeline_Types.md) · [README](./README.md) · [Next: Runners →](./10_Runners_And_Executors.md)

---

## 1. Concepts

### `needs` — run without waiting for the whole stage

```yaml
build:
  stage: build
  script: ["make build"]

test:
  stage: test
  needs: ["build"]
  script: ["make test"]
```

`needs` creates a **DAG**: jobs can start as soon as dependencies finish, even if other jobs in an earlier stage are still running (within documented constraints).

### Downstream pipelines

| Kind | Meaning |
|------|---------|
| **Parent/child** | Same project; child YAML via `trigger` / `include` |
| **Multi-project** | Pipeline in another project triggered from here |

Use downstream when graphs get large or ownership splits across repos.

---

## 2. Advanced concepts

### Artifact/needs interplay

Jobs often `needs` both the job and its artifacts. Be explicit so deploy doesn’t start without the build output.

### Pipeline architectures

Docs describe patterns (basic, directed acyclic, parent-child, multi-project). Pick the simplest architecture that matches ownership.

### Matrix + needs

Combine `parallel:matrix` with `needs` so fan-out jobs still form a clear DAG (e.g. build once → test matrix → single publish). Keyword map: [07](./07_YAML_Mental_Model_And_Keywords.md).

### Resource groups

`resource_group` serializes deployments to the same environment — related deploy safety ([15](./15_Environments_Deployments_And_Release.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Faster MR CI | `needs` instead of strict stage barriers |
| Platform → service | Multi-project trigger into service pipelines |
| Huge monolith | Parent pipeline fans out children |

**Good:** shallow DAGs with clear outputs. **Bad:** deep trigger chains nobody can debug.

---

## References

- [needs keyword](https://docs.gitlab.com/ci/yaml/#needs)  
- [Downstream pipelines](https://docs.gitlab.com/ci/pipelines/downstream_pipelines/)  
- [Pipeline architectures](https://docs.gitlab.com/ci/pipelines/pipeline_architectures/)  
