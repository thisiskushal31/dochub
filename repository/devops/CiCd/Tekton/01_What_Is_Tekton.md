# 01 — What is Tekton

[← Tekton](./README.md) · [Next: Install →](./02_Install_Pipelines_And_Operator.md)

## 1. Concepts

**Tekton** is a CNCF **Kubernetes-native** CI/CD toolkit. Pipeline definitions are **API objects** (CRDs). Runs become **Pods** on your cluster.

| Idea | Plain meaning |
|------|----------------|
| **Task** | Steps (containers) + params / results / workspaces |
| **Pipeline** | Graph of Tasks |
| **TaskRun / PipelineRun** | One execution |
| **Triggers** | Webhooks / events → Runs |
| **Pipelines-as-Code** | Git-native CI (`.tekton/`) |
| **Catalog / Hub** | Reusable Tasks/Pipelines |
| **Chains** | Sign / attest artifacts |
| **Results / Pruner** | Persist run data; GC old Runs |
| **Operator** | Install/manage Tekton components as CRs |

```text
event or apply → PipelineRun/TaskRun → Pod(s) → digest/artifacts → registry / GitOps
```

### When Tekton fits

| Situation | Fit |
|-----------|-----|
| Platform already operates Kubernetes | Strong |
| Builds must obey cluster RBAC / NetworkPolicy | Strong |
| Want forge-hosted YAML, zero cluster CI ops | [GitHub_Actions/](../GitHub_Actions/README.md) / [GitLab_CI/](../GitLab_CI/README.md) often simpler |
| Classical host/WAR CI | [Jenkins/](../Jenkins/README.md), [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| Only desired-state sync | [Argo_CD/](../Argo_CD/README.md) / [Flux/](../Flux/README.md) — Tekton builds images they deploy |

## 2. Advanced concepts

Tekton is a **family** of projects — install what you need ([02](./02_Install_Pipelines_And_Operator.md)). API lines moved (`v1beta1` → `v1`); match docs to your installed version ([25](./25_Migrate_Versioning_And_Extras.md)).

Durable jobs (build, attest, promote-by-digest) outlive any one CI product — Tekton is one implementation family ([CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Platform CI | Pipelines + Catalog + workload identity |
| PR checks | Pipelines-as-Code or Triggers |
| Regulated | Chains + GitOps promote |

Kubernetes **what it is** (API, Pods, RBAC mechanics) lives in [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive). This track teaches Tekton **on** that platform.

**Staff checklist**

- Team can explain Task vs PipelineRun vs forge workflow  
- Cluster ops ownership exists before adoption  
- Spectrum doors known for non-K8s estates in the same company  

**Good:** reviewed CRDs/YAML. **Bad:** cluster-admin SA on every Run.

## References

- [Tekton docs](https://tekton.dev/docs/)  
- [Concepts](https://tekton.dev/docs/concepts/)  
- [CiCd tools map](../2_CI_CD_Tools.md)  
