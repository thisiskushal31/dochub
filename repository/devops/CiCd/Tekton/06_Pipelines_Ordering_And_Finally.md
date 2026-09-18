# 06 — Pipelines: ordering and finally

[← Previous](./05_Tasks_Steps_Params_And_Results.md) · [README](./README.md) · [Next: Workspaces →](./07_Workspaces_Artifacts_And_Volumes.md)

## 1. Concepts

A **Pipeline** lists `tasks` with `runAfter` (or implied order), shared `params` / `workspaces`, and optional `finally` tasks that always run (cleanup/notify).

```yaml
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: ci
spec:
  params:
    - name: git-url
      type: string
  workspaces:
    - name: source
  tasks:
    - name: fetch
      taskRef: { name: git-clone }   # often from Catalog
      workspaces: [{ name: output, workspace: source }]
      params:
        - { name: url, value: $(params.git-url) }
    - name: test
      runAfter: [fetch]
      taskRef: { name: unit-test }
      workspaces: [{ name: source, workspace: source }]
  finally:
    - name: cleanup
      taskRef: { name: cleanup-workspace }
```

**PipelineRun** supplies param values, workspace bindings (PVC, emptyDir, …), and ServiceAccountName ([08](./08_Auth_ServiceAccounts_And_RBAC.md)).

## 2. Advanced concepts

### Pipelines in Pipelines

A Pipeline task can reference another Pipeline (pipelines-in-pipelines) or an embedded `pipelineSpec` / `taskSpec`. Use for composition; prefer resolvers for org reuse ([11](./11_Resolvers_Bundles_And_Remote_Resources.md)). Watch nesting depth and blast radius.

### Embedded specs vs refs

`taskSpec` / `pipelineSpec` inline definitions help PAC single-file Runs; refs keep Catalog DRY.

### From Task results

Pass `$(tasks.<name>.results.<result>)` into later tasks.

### Timeouts, retries, failure

Pipeline-level and task-level timeouts; retries where supported; failed tasks skip dependents unless configured otherwise — confirm for your API version. `finally` still runs for cleanup/notify.

### PipelineRun knobs

`taskRunTemplate` / `taskRunSpecs` (per-task pod overrides), timeouts, serviceAccountName — staff depth in PipelineRuns docs.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Classic CI | fetch → test → build → push |
| Always notify | `finally` Slack/mail Task |
| Fan-out | Matrix ([10](./10_Matrix_CustomRuns_And_StepActions.md)) |

**Staff checklist**

- `finally` used for cleanup/notify when needed  
- Result passing explicit between tasks  
- Nesting depth justified  

**Good:** readable graph + shared workspaces. **Bad:** hidden coupling via cluster-global state.

## References

- [Pipelines](https://tekton.dev/docs/pipelines/pipelines/)  
- [PipelineRuns](https://tekton.dev/docs/pipelines/pipelineruns/)  
