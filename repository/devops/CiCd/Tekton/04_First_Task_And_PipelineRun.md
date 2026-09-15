# 04 — First Task and PipelineRun

[← Previous](./03_Core_Model_Tasks_Pipelines_Runs.md) · [README](./README.md) · [Next: Tasks depth →](./05_Tasks_Steps_Params_And_Results.md)

---

## 1. Concepts

1. Install Pipelines ([02](./02_Install_Pipelines_And_Operator.md)).  
2. Apply a Task; apply a TaskRun (or `tkn task start`).  
3. Watch Pod/logs; fix YAML; re-run.  

```bash
kubectl apply -f task.yaml
kubectl apply -f taskrun.yaml
kubectl get taskrun
tkn taskrun logs -f echo-hello-run   # if tkn installed ([15](./15_CLI_tkn.md))
```

```yaml
# task.yaml
apiVersion: tekton.dev/v1
kind: Task
metadata:
  name: unit-test
spec:
  params:
    - name: package
      type: string
      default: "."
  steps:
    - name: test
      image: golang:1.22
      script: |
        #!/bin/bash
        set -euo pipefail
        cd $(params.package)
        go test ./...
```

```yaml
# taskrun.yaml
apiVersion: tekton.dev/v1
kind: TaskRun
metadata:
  generateName: unit-test-
spec:
  taskRef:
    name: unit-test
  params:
    - name: package
      value: "."
```

Compose two Tasks into a Pipeline when the lab needs ordering ([06](./06_Pipelines_Ordering_And_Finally.md)). Official Getting Started guides cover the same loop.

---

## 2. Advanced concepts

Use `generateName` for Runs so re-applies do not collide. Prefer namespace-per-team or per-env for blast radius. Dashboard ([16](./16_Dashboard.md)) is optional UX.

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| Controllers up | `tekton-pipelines` Pods Ready |
| First green Run | Succeeded TaskRun + logs |
| YAML in Git | Task definitions reviewed |

**Staff checklist**

- First TaskRun succeeds in a dedicated namespace  
- YAML committed before sharing the pattern  

**Good:** change via Git + apply/PAC. **Bad:** only live-edit CRDs in prod with no source.

---

## References

- [Getting started](https://tekton.dev/docs/getting-started/)  
- [TaskRuns](https://tekton.dev/docs/pipelines/taskruns/)  
- [CLI](https://tekton.dev/docs/cli/)  
