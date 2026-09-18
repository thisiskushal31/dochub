# 10 — Matrix, CustomRuns, and StepActions

[← Previous](./09_Pod_Templates_Compute_And_Affinity.md) · [README](./README.md) · [Next: Resolvers →](./11_Resolvers_Bundles_And_Remote_Resources.md)

## 1. Concepts

Beyond a linear Pipeline graph, Pipelines offers three extension shapes:

| Feature | Role |
|---------|------|
| **Matrix** | Fan-out one Pipeline task across combinations of params |
| **CustomRun** | Run type for **custom executors** (not a standard Task Pod graph) |
| **StepAction** | Reusable **step-level** building block shared across Tasks |

```yaml
# Matrix — confirm exact schema for your Pipelines version
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: multi-go
spec:
  tasks:
    - name: test
      matrix:
        params:
          - name: go-version
            value: ["1.21", "1.22", "1.23"]
      taskRef: { name: go-test }
      params:
        - name: go-version
          value: $(matrix.go-version)
```

Prefer matrix over copy-pasted Tasks per version. Prefer StepAction over copy-pasted step blobs. Prefer CustomRun only when a Catalog Task cannot express the runtime.

## 2. Advanced concepts

### Matrix discipline

| Concern | Practice |
|---------|----------|
| Combinatorial explosion | Cap axes; exclude impossible pairs |
| Quotas | Cluster ResourceQuotas / LimitRanges; Kueue literacy ([19](./19_Operator_Platform_Config.md)) |
| Failure policy | Fail-fast vs continue — confirm for your version |
| Results | Aggregate carefully; do not assume one result slot |

### CustomRun

Custom Tasks need a **controller** you operate. Treat them like a platform product: version, RBAC, runbooks. `tkn customrun` exists for day-2 ([15](./15_CLI_tkn.md)).

### StepAction

Pin StepAction versions the same way you pin Tasks (resolver + SHA/digest). Breaking step contracts break every consumer Task.

### Version nuance

Matrix / StepAction / CustomRun fields evolve with Pipelines API lines — match examples to your installed version ([25](./25_Migrate_Versioning_And_Extras.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Multi-version CI | Matrix on runtime/tool versions |
| Special VM/cloud executor | CustomRun + owned controller |
| Org micro-reuse | StepAction library in internal catalog |
| Cost control | Smaller matrices on PRs; full matrix on main |

**Staff checklist**

- Matrix size bounded and documented  
- CustomRun controllers owned (on-call)  
- StepActions pinned; no floating `main`  

**Good:** matrix for versions. **Bad:** 200-cell matrix without quotas or owners.

## References

- [Matrix](https://tekton.dev/docs/pipelines/matrix/)  
- [CustomRuns](https://tekton.dev/docs/pipelines/customruns/)  
- [StepActions](https://tekton.dev/docs/pipelines/stepactions/)  
