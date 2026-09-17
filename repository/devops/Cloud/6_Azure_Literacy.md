# 6 — Microsoft Azure literacy

[← Previous](./5_AWS_Literacy.md) · [README](./README.md) · [Next: Oracle →](./7_Oracle_Cloud.md)

---

## 1. Concepts

Azure’s isolation unit is the **subscription**, sitting under an **Entra ID tenant** and optional **management groups**. Inside a subscription you group resources into **resource groups** (delete/lifecycle boundary). Regions are Azure regions; **availability zones** exist in many of them.

### Identity

| Principal | Use |
|-----------|-----|
| Entra ID users / groups | Humans (this is Azure AD) |
| **Managed identity** | Azure resources getting tokens without secrets |
| **App registration + federated credential** | CI OIDC → Azure |

RBAC is **role assignment** on a scope (management group / subscription / RG / resource). Prefer built-in roles at the smallest scope that works.

### Compute — when which

| Product | Job |
|---------|-----|
| **Virtual Machines** | VMs; **VM Scale Sets** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **App Service** | PaaS web apps (not a cluster API) |
| **AKS** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **ARO** | Managed **OpenShift** on Azure ([OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)) — not AKS |
| **VMs + kubeadm / CAPI** | Self-managed Kubernetes on Azure VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Azure Functions** | Event/function grain |
| **Container Apps** | Serverless containers (Revision/scale model, not full K8s) |

App Service and Container Apps are valid production paths. They are not AKS with the knobs hidden.

### Data and glue (names)

| Job | Product |
|-----|---------|
| Object storage | Blob Storage (Storage account) |
| Images | Azure Container Registry (ACR) |
| Secrets | Key Vault |
| Logs / metrics | Azure Monitor / Log Analytics |
| SQL doors | Azure SQL, Cosmos DB — [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |

---

## 2. Advanced concepts

### Network

**VNet** is regional. Subnets host NICs. **NSGs** are the usual allow-lists. **Application Gateway** (L7) vs **Load Balancer** (L4). **Front Door** for global HTTP; **Azure DNS** for zones. Private endpoints / Private Link keep PaaS off the public internet.

AKS and self-managed clusters still need a VNet, a plan for outbound (NAT / load balancer), and the **Azure cloud provider** so Kubernetes `LoadBalancer` Services and Azure Disks attach.

### Workload identity

AKS **workload identity** federates a Kubernetes SA to an Entra managed identity / app — same family as IRSA and GKE WI. Use it instead of putting a service principal secret in a Secret.

### Policy and landing zones

Azure Policy (and enterprise landing-zone patterns) constrain SKUs, locations, and public IPs the same way GCP org policy and AWS SCPs do. Meet the platform team before inventing a second subscription layout.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| HTTP API | App Service or AKS + AGW/Front Door |
| Classic fleet | VMSS + LB + images |
| CI deploy | Federated credential on the app; no client secret in CI |
| K8s without AKS | kubeadm/CAPI on VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |

**Staff checklist**

- Tenant → management group → subscription → RG layout documented  
- Managed identities / federated CI; no standing client secrets  
- Key Vault for secrets; ACR with pull-only for nodes  
- NSGs and private compute by default  

**Good:** workload identity + private AKS or private VM nodes. **Bad:** subscription Owner SP with a secret in GitHub, public SSH on every VM.

---

## References

- [Azure documentation](https://learn.microsoft.com/azure/)  
- [Azure resource hierarchy](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)  
- [Entra ID](https://learn.microsoft.com/entra/fundamentals/whatis)  
- [Managed identities](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview)  
- [AKS](https://learn.microsoft.com/azure/aks/)  
- [ARO](https://learn.microsoft.com/azure/openshift/)  
- [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)  
