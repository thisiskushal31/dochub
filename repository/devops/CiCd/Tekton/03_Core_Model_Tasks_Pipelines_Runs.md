# 03 — Core model: Tasks, Pipelines, Runs

[← Previous](./02_Install_Pipelines_And_Operator.md) · [README](./README.md) · [Next: First run →](./04_First_Task_And_PipelineRun.md)

## 1. Concepts

| Resource | Role |
|----------|------|
| **Task** | Reusable step list (definition) |
| **TaskRun** | Execute a Task once (creates a Pod) |
| **Pipeline** | Graph of Tasks (definition) |
| **PipelineRun** | Execute a Pipeline once |

Definitions are durable API objects; Runs are executions with status, logs, and (optionally) results.

```yaml
# Mental shape — Task
apiVersion: tekton.dev/v1
kind: Task
metadata:
  name: echo-hello
spec:
  steps:
    - name: echo
      image: alpine:3.20
      script: |
        #!/bin/sh
        echo "hello from Tekton"
```

```yaml
# Mental shape — TaskRun
apiVersion: tekton.dev/v1
kind: TaskRun
metadata:
  name: echo-hello-run
spec:
  taskRef:
    name: echo-hello
```

Pipelines reference Tasks by name (or remote resolver — [11](./11_Resolvers_Bundles_And_Remote_Resources.md)) and declare `params` / `workspaces` bindings at PipelineRun time.

## 2. Advanced concepts

### Status and retries

Runs expose conditions/status; failure leaves Pods for debug unless cleanup policies intervene ([18](./18_Results_And_Pruner.md), [20](./20_Observability_HA_Debug_And_Windows.md)).

### CustomRun / StepAction

Extension points beyond plain Tasks ([10](./10_Matrix_CustomRuns_And_StepActions.md)).

### Legacy PipelineResources

Older resource types are deprecated — prefer workspaces + results + OCI artifacts ([07](./07_Workspaces_Artifacts_And_Volumes.md), [25](./25_Migrate_Versioning_And_Extras.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| One-shot script | Task + TaskRun |
| Multi-stage CI | Pipeline + PipelineRun |
| Shared org steps | Catalog Task refs |

**Good:** small Tasks composed in Pipelines. **Bad:** one 40-step Task that nobody reuses.

## References

- [Tasks and Pipelines](https://tekton.dev/docs/pipelines/)  
- [Tasks](https://tekton.dev/docs/pipelines/tasks/)  
- [Pipelines](https://tekton.dev/docs/pipelines/pipelines/)  
