# 13 — Deploy: containers, ACR, Container Apps, and AKS

[← Previous](./12_Deploy_VMs_VMSS_And_Host_Patterns.md) · [README](./README.md) · [Next: IaC →](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md)

## 1. Concepts

Container delivery from Azure Pipelines:

| Target | Role |
|--------|------|
| **Azure Container Registry (ACR)** | Build/push images; promote by **digest** |
| **Azure Container Apps** | Serverless-ish containers; `AzureContainerApps@1` |
| **Azure Kubernetes Service (AKS)** | Full Kubernetes; `KubernetesManifest@1`, Helm, kubectl |
| **App Service for Containers** | Covered under [11](./11_Deploy_App_Service_Functions_And_Static_Web.md) |

```text
CI builds image → push ACR (tag + digest)
  → deploy: Container Apps revision | AKS manifest/Helm | GitOps commit
```

Deep Docker/Kubernetes craft → Containerization Deep Dive. Here: **Pipelines wiring**.

## 2. Advanced concepts

### Build strategies

- Docker task / `docker build` on agent  
- ACR Tasks (build in Azure)  
- Multi-stage Dockerfiles; never ship `:latest` as the only prod pin  

### AKS deploy styles

| Style | When |
|-------|------|
| `KubernetesManifest@1` deploy | Manifests in repo; bake Helm/Kustomize |
| Helm task | Chart-based releases |
| kubectl scripts | Escape hatch |
| GitOps (Argo CD / Flux) | Pipelines only builds/pushes; CD reconciles ([Argo_CD/](../Argo_CD/README.md)) |

KubernetesManifest supports **canary** actions (baseline/canary, promote/reject) with optional service-mesh traffic split — progressive delivery *inside* the task. Heavier progressive delivery may still use [Argo_Rollouts/](../Argo_Rollouts/README.md).

### Container Apps

Deploy from source, Dockerfile, or existing image. Good middle ground when you want containers without full AKS ops. Revisions ≈ staged rollout.

### ImagePullSecrets and identity

Prefer AKS ↔ ACR integration via managed identity over long-lived pull secrets in YAML.

## 3. Applications and use cases

| Need | Choose |
|------|--------|
| Simple containerized API | Container Apps or App Service containers |
| Many services, mesh, custom schedulers | AKS |
| Strict GitOps | Pipelines → ACR; Argo/Flux sync |

**Good:** digest in GitOps values / manifest. **Bad:** `kubectl apply` from CI with floating tags and no authz boundary.

## References

- [Deploy to AKS with Azure Pipelines](https://learn.microsoft.com/en-us/azure/aks/devops-pipeline)  
- [KubernetesManifest@1](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/kubernetes-manifest-v1)  
- [AzureContainerApps@1](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/azure-container-apps-v1)  
- [Build and push to ACR](https://learn.microsoft.com/en-us/azure/devops/pipelines/ecosystems/containers/build-image)  
