# Tekton

[← Back to CI/CD](../README.md)

**Kubernetes-native** CI/CD building blocks: Tasks, Pipelines, PipelineRuns as custom resources. Good fit when the platform team already operates clusters and wants pipelines as cluster API objects.

Concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md). K8s depth: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

---

## Core model

| Resource | Role |
|----------|------|
| **Task** | Steps (usually containers) with inputs/outputs/params |
| **Pipeline** | Ordered graph of Tasks |
| **TaskRun / PipelineRun** | One execution |
| **Trigger** / EventListener | Webhooks → PipelineRuns (Tekton Triggers) |
| **Workspace / Results** | Share data between steps/tasks |

Pipelines run **in** the cluster (pods), so registry/auth and RBAC design matter for supply chain ([6](../6_Supply_Chain_And_Signing.md)).

---

## Where it sits vs GitHub Actions

| Tekton | SaaS YAML CI |
|--------|----------------|
| CRDs, kubectl/GitOps apply | Hosted workflow files |
| Strong K8s platform fit | Strong SCM-integrated fit |
| You run the control plane pieces | Vendor runs control plane |

Often paired with GitOps CD (Argo/Flux) after Tekton builds and pushes digests.

---

## First use (outline)

1. Install Tekton Pipelines (and Triggers if needed) per [tekton.dev](https://tekton.dev/docs/).  
2. Apply a simple Task (e.g. run tests in a language image).  
3. Compose a Pipeline; create a PipelineRun.  
4. Add a build-push Task with workload identity to the registry.  

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Pipeline SA with cluster-admin | Least-privilege SA per pipeline |
| Floating `:latest` task images | Digest-pin task images |

## Further reading

- [Tekton documentation](https://tekton.dev/docs/)  
- [Pipeline concepts](https://tekton.dev/docs/pipelines/)  
