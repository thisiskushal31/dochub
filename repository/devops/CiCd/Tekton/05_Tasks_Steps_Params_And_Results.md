# 05 — Tasks: steps, params, and results

[← Previous](./04_First_Task_And_PipelineRun.md) · [README](./README.md) · [Next: Pipelines →](./06_Pipelines_Ordering_And_Finally.md)

---

## 1. Concepts

A **Task** declares:

| Field | Role |
|-------|------|
| `steps` | Ordered containers (`image` + `script` or `command`) |
| `params` | Inputs (string/array) |
| `results` | Small outputs written under `/tekton/results/…` |
| `workspaces` | Filesystem mounts ([07](./07_Workspaces_Artifacts_And_Volumes.md)) |
| `volumes` / `sidecars` | Extra mounts and helper containers |
| `stepTemplate` | Defaults applied to every step |

```yaml
apiVersion: tekton.dev/v1
kind: Task
metadata:
  name: build-report
spec:
  params:
    - name: version
      type: string
  results:
    - name: digest
      description: Image digest
  steps:
    - name: build
      image: gcr.io/kaniko-project/executor:v1.23.2
      # … build …
    - name: write-result
      image: alpine:3.20
      script: |
        #!/bin/sh
        echo -n "sha256:…" > $(results.digest.path)
```

Variable substitution: `$(params.name)`, `$(results.name.path)`, workspace paths — see variables docs.

---

## 2. Advanced concepts

### Scripts vs command/args

`script:` is convenient; still pin images by digest in prod.

### Step controls (staff depth)

| Knob | Role |
|------|------|
| `when` on steps | Guard step execution |
| `onError` | Continue / fail / ignore patterns |
| Timeouts | Per-step / Task |
| `stdoutConfig` / `stderrConfig` | Redirect streams |
| `displayName` | UI-friendly names |
| `stepTemplate` | Defaults for every step |
| `sidecars` | Helper containers (Docker-in-Docker alternatives, proxies, …) |

### Results size

Results are for small metadata (digests, URLs). Large outputs → workspaces / artifacts ([07](./07_Workspaces_Artifacts_And_Volumes.md)). Sidecar-log paths exist for larger results — confirm current docs.

### Array params and substitution

String and array params; substitution rules differ in `script` vs `args` — see variables docs.

### Step security

Run as non-root where images allow; do not mount Docker socket casually ([08](./08_Auth_ServiceAccounts_And_RBAC.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Reusable test Task | Params for module path; result = junit path |
| Image build | Kaniko/buildah Task; result = digest |
| Org paved road | Thin wrappers over Catalog Tasks ([14](./14_Catalog_Hub_And_Reusable_Tasks.md)) |

**Staff checklist**

- Params documented; secrets not in params  
- Step images pinned where feasible  
- Results only for small metadata  

**Good:** small Tasks, clear params. **Bad:** secret values as params logged in status.

---

## References

- [Tasks](https://tekton.dev/docs/pipelines/tasks/)  
- [Variables](https://tekton.dev/docs/pipelines/variables/)  
