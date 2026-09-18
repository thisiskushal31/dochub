# 02 — Install Pipelines and Operator

[← Previous](./01_What_Is_Tekton.md) · [README](./README.md) · [Next: Core model →](./03_Core_Model_Tasks_Pipelines_Runs.md)

## 1. Concepts

Install **Tekton Pipelines** first (the core CRDs and controllers). Add Triggers, Dashboard, Chains, Results, Pruner, Pipelines-as-Code as needed.

| Path | When |
|------|------|
| **Release YAML** (`kubectl apply -f …release…`) | Labs; explicit versions |
| **Operator** | Platform teams managing components via `TektonConfig` CRs ([19](./19_Operator_Platform_Config.md)) |
| Distro bundles (e.g. OpenShift Pipelines) | Vendor-supported stack — still learn upstream CRDs |

Prerequisites: a Kubernetes cluster you can admin; enough capacity for controller Pods **and** build Pods.

```bash
# Shape only — pin the release URL/version from current install docs
kubectl apply -f https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
kubectl get pods -n tekton-pipelines
```

Confirm CRDs: `tasks.tekton.dev`, `pipelines.tekton.dev`, `taskruns.tekton.dev`, `pipelineruns.tekton.dev`.

## 2. Advanced concepts

### Version pinning

Prefer a **known release**, not forever-`latest`, in production. Pair with cluster upgrade policy.

### Operator path

Operator installs/reconciles Pipelines, Triggers, Dashboard, Chains, Results, Pruner, add-ons. Literacy: [19](./19_Operator_Platform_Config.md). Values encyclopedias stay upstream.

### Air-gap / private registries

Mirror images; Operator docs cover air-gap image configuration. Plan pull secrets before first PipelineRun.

### Additional configuration

After install, Pipelines exposes **additional configuration options** (feature gates, defaults, performance-related settings). Treat them as platform config — document alongside Operator/GitOps ([20](./20_Observability_HA_Debug_And_Windows.md)).

### Windows agents

Pipelines support Windows node literacy ([20](./20_Observability_HA_Debug_And_Windows.md)) — optional for most Linux platforms.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Lab | Kind/minikube + Pipelines release YAML + `tkn` |
| Enterprise platform | Operator + GitOps of `TektonConfig` |
| Add webhooks later | Install Triggers after core is healthy |

**Good:** documented versions + smoke TaskRun. **Bad:** apply `latest` on Friday with no rollback.

## References

- [Installation](https://tekton.dev/docs/installation/)  
- [Pipelines install](https://github.com/tektoncd/pipeline/blob/main/docs/install.md)  
- [Operator](https://tekton.dev/docs/operator/)  
