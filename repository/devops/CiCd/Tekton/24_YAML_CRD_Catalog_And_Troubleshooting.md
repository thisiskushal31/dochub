# 24 — YAML/CRD catalog and troubleshooting

[← Previous](./23_Feature_And_Offering_Coverage_Map.md) · [README](./README.md) · [Next: Migrate →](./25_Migrate_Versioning_And_Extras.md)

---

## 1. Concepts — surfaces you configure

| Surface | Typical objects | Chapter |
|---------|-----------------|---------|
| Task / Pipeline definitions | `Task`, `Pipeline` | [05](./05_Tasks_Steps_Params_And_Results.md)–[06](./06_Pipelines_Ordering_And_Finally.md) |
| Executions | `TaskRun`, `PipelineRun` | [03](./03_Core_Model_Tasks_Pipelines_Runs.md) |
| Workspaces | bindings on Runs | [07](./07_Workspaces_Artifacts_And_Volumes.md) |
| Auth | `ServiceAccount`, secrets | [08](./08_Auth_ServiceAccounts_And_RBAC.md) |
| Triggers | EL, Trigger, Binding, Template | [12](./12_Triggers_EventListeners_And_Interceptors.md) |
| PAC | `.tekton/`, Repository CR | [13](./13_Pipelines_As_Code.md) |
| Remote refs | `taskRef.resolver` | [11](./11_Resolvers_Bundles_And_Remote_Resources.md) |
| Operator | TektonConfig / component CRs | [19](./19_Operator_Platform_Config.md) |
| Chains / Results / Pruner | component installs + config | [17](./17_Chains_Supply_Chain_Security.md)–[18](./18_Results_And_Pruner.md) |

```yaml
# Minimal PipelineRun skeleton
apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  generateName: ci-
spec:
  serviceAccountName: ci-builder
  pipelineRef: { name: ci }
  params: []
  workspaces: []
```

---

## 2. Advanced — troubleshooting playbook

| Symptom | Likely cause | Look at |
|---------|--------------|---------|
| Run Pending forever | SA/RBAC; PVC pending; no nodes | Pod events; quotas |
| ImagePullBackOff | Bad image / pull secret | SA imagePullSecrets |
| Step OOM | Limits too low | [09](./09_Pod_Templates_Compute_And_Affinity.md) |
| Workspace empty | Binding mismatch | Pipeline vs Task workspace names |
| Resolver fail | Bad revision / network | [11](./11_Resolvers_Bundles_And_Remote_Resources.md) |
| Webhook 403 | Interceptor / secret | [12](./12_Triggers_EventListeners_And_Interceptors.md) |
| PAC not firing | Annotations / provider app / webhook | [13](./13_Pipelines_As_Code.md) |
| SCM status missing | PAC status mapping / permissions | [13](./13_Pipelines_As_Code.md) |
| etcd / API pressure | Too many old Runs | [18](./18_Results_And_Pruner.md) |
| Dashboard unauthorized | SSO/OAuth2 proxy / RBAC | [16](./16_Dashboard.md) |
| Chains not signing | Chains install/config / SA to registry | [17](./17_Chains_Supply_Chain_Security.md) |
| Matrix storm | Too many combinations | [10](./10_Matrix_CustomRuns_And_StepActions.md) |

---

## 3. Applications — staff checklist

- Pipelines version pinned; Operator/GitOps for platform config  
- SA least privilege; no cluster-admin on CI  
- Remote Tasks pinned by SHA/digest  
- Untrusted PRs isolated  
- Pruner (and Results if needed) configured  
- Digests promoted; Chains if verifiers exist  
- Controllers monitored  

Full inventory: [23](./23_Feature_And_Offering_Coverage_Map.md).

---

## References

- [Pipelines docs](https://tekton.dev/docs/pipelines/)  
- [Troubleshooting Triggers](https://tekton.dev/docs/triggers/troubleshooting/)  
