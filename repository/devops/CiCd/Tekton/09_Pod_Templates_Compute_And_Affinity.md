# 09 — Pod templates, compute, and affinity

[← Previous](./08_Auth_ServiceAccounts_And_RBAC.md) · [README](./README.md) · [Next: Matrix →](./10_Matrix_CustomRuns_And_StepActions.md)

## 1. Concepts

Runs create Pods. Control shape with:

| Knob | Role |
|------|------|
| `podTemplate` / `TaskRun.spec.podTemplate` | nodeSelector, tolerations, volumes, securityContext, … |
| Compute resources | CPU/memory requests/limits on steps |
| Affinity assistants | Co-locate Tasks sharing workspaces |

```yaml
spec:
  podTemplate:
    nodeSelector:
      workload: ci
    securityContext:
      fsGroup: 65532
  taskSpec:
    steps:
      - name: build
        image: maven:3.9-eclipse-temurin-21
        computeResources:
          requests: { cpu: "1", memory: 2Gi }
          limits: { memory: 4Gi }
```

Exact field names follow your API version — copy from current docs/snippets.

## 2. Advanced concepts

### Controller flags / performance

Tekton controller performance and flags tune concurrency and queues ([20](./20_Observability_HA_Debug_And_Windows.md)).

### Spot / preemptible nodes

Tolerations + retry policy for interruptible CI nodes.

### Windows

Windows node selectors / scripts — literacy door in ([20](./20_Observability_HA_Debug_And_Windows.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| GPU tests | nodeSelector + resource limits |
| Cheap CI | spot tolerations + non-critical Pipelines |
| Shared PVC | affinity assistants enabled as documented |

**Staff checklist**

- nodeSelector/tolerations owned by platform  
- Requests/limits on heavy steps  
- Affinity assistants considered for shared PVCs  

**Good:** explicit scheduling for heavy Tasks. **Bad:** unbounded parallel PipelineRuns starving the cluster.

## References

- [Pod templates](https://tekton.dev/docs/pipelines/podtemplates/)  
- [Compute resources](https://tekton.dev/docs/pipelines/compute-resources/)  
- [Affinity assistants](https://tekton.dev/docs/pipelines/affinityassistants/)  
