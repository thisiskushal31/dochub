# 6 — Microsoft Azure literacy

[← Previous](./5_AWS_Literacy.md) · [README](./README.md) · [Next: Oracle →](./7_Oracle_Cloud.md) · [Full catalog](./Catalogs/Azure_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md) · [LB](./23_Load_Balancing_Ingress_And_TLS.md)

---

## Mental map — Floor 1 jobs on Azure

| Job | Azure wiring | Depth |
|-----|--------------|-------|
| Isolation | Entra tenant → mgmt groups → **subscription** → RG | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Identity | Entra ID; managed identity; federated credentials | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | Regional VNet; NSG | [16](./16_VPC_And_Network_Constructs.md) |
| LB / TLS | App Gateway (L7); Azure LB (L4); Front Door (global) | [23](./23_Load_Balancing_Ingress_And_TLS.md), [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| DNS / CDN | Azure DNS; Azure CDN / Front Door | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| Compute | VMs + VMSS; AKS; Container Apps; Functions | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Storage | Blob; Managed Disks; Azure Files | [24](./24_Object_Block_And_File_Storage.md) |
| Secrets / KMS | Key Vault | [26](./26_Secrets_KMS_And_Encryption.md) |
| Registry | ACR | [27](./27_Container_Registries_And_Artifacts.md) |
| Audit | Activity Log | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Metrics / logs / traces | Azure Monitor + Application Insights; Managed Prometheus / Grafana optional | [30](./30_Cloud_Observability_And_Audit_Doors.md) |

---

## 1. Concepts

Azure’s isolation unit is the **subscription**, sitting under an **Entra ID tenant** and optional **management groups**. Inside a subscription you group resources into **resource groups** (delete/lifecycle boundary). Regions are Azure regions; **availability zones** exist in many of them.

### Identity and permissions

| Principal | Use |
|-----------|-----|
| Entra ID users / groups | Humans |
| **Managed identity** | Azure resources getting tokens without secrets |
| **App registration + federated credential** | CI OIDC → Azure |

RBAC is **role assignment** on a scope (management group / subscription / RG / resource). Prefer built-in roles at the smallest scope that works. Azure Policy is the outer fence ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Compute — when which

| Product | Job |
|---------|-----|
| **Virtual Machines** | VMs; **VM Scale Sets** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **App Service** | PaaS web apps (not a cluster API) |
| **AKS** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **ARO** | Managed **OpenShift** on Azure — not AKS |
| **VMs + kubeadm / CAPI** | Self-managed Kubernetes on Azure VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Azure Functions** | Event/function grain |
| **Container Apps** | Serverless containers (Revision/scale model, not full K8s) |

App Service and Container Apps are valid production paths ([28](./28_Deployment_Shapes_On_Cloud.md)). They are not AKS with the knobs hidden.

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

### Network and entry

**VNet** is regional. Subnets host NICs. **NSGs** are the usual allow-lists. **Application Gateway** (L7) vs **Load Balancer** (L4). **Front Door** for global HTTP ([23](./23_Load_Balancing_Ingress_And_TLS.md), [25](./25_DNS_CDN_And_Edge_HTTP.md)). Private endpoints / Private Link keep PaaS off the public internet ([17](./17_Private_Connectivity_And_On_Ramps.md)).

AKS and self-managed clusters still need a VNet, outbound plan (NAT / load balancer), and the **Azure cloud provider** so Kubernetes `LoadBalancer` Services and Azure Disks attach.

### Workload identity

AKS **workload identity** federates a Kubernetes SA to an Entra managed identity / app — same family as IRSA and GKE WI ([15](./15_Org_IAM_And_Identity_Federation.md)).

### Policy and landing zones

Azure Policy and enterprise landing-zone patterns constrain SKUs, locations, and public IPs ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Quirks vs other majors

| Quirk | Meaning |
|-------|---------|
| Subscription + RG | Two grouping layers (billing vs lifecycle) |
| Front Door vs App Gateway | Global entry vs regional L7 — pick by job |
| Entra is the IdP center | Human identity story is Entra-first |

---


### How you grant permission on Azure (quick)

1. Humans in **Entra ID** groups.  
2. **Azure RBAC** role assignment at subscription / RG / resource.  
3. Machines: **managed identity**.  
4. CI: app registration + **federated credential** (OIDC).  
5. AKS: **workload identity**.  
6. Outer fence: **Azure Policy**.  

Full job: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on Azure

| Need | Product | See |
|------|---------|-----|
| Single/group VMs | Virtual Machines (+ VMSS) | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Event function | Azure Functions | [31](./31_Serverless_Functions_And_Containers.md) |
| Serverless container | Container Apps | [31](./31_Serverless_Functions_And_Containers.md) |
| PaaS web | App Service | [28](./28_Deployment_Shapes_On_Cloud.md) |
| Kubernetes API | AKS (OpenShift: ARO) | [3](./3_Managed_Kubernetes.md) |
| Managed relational | Azure SQL / Flexible Server | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| DB you patch | VM + Managed Disks | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| GenAI hosted FM | Azure OpenAI / Microsoft Foundry | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Custom train/serve | Azure Machine Learning | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Distributed GPU | AKS GPU / GPU VMs | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Platform metrics/logs/traces | Azure Monitor + App Insights; Activity Log | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Managed Prometheus / Grafana | Azure Monitor managed Prometheus + Managed Grafana | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Full N-tier system | Wire [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| HTTP API | App Service or AKS + AGW/Front Door |
| Classic fleet | VMSS + LB + images |
| CI deploy | Federated credential on the app; no client secret in CI |
| K8s without AKS | kubeadm/CAPI on VMs |

**Staff checklist**

- Tenant → management group → subscription → RG layout documented  
- Managed identities / federated CI; no standing client secrets  
- Key Vault for secrets; ACR with pull-only for nodes  
- NSGs and private compute by default  
- Azure Policy baselines on  

**Good:** workload identity + private AKS or private VM nodes. **Bad:** subscription Owner SP with a secret in GitHub, public SSH on every VM.

---

## References

- **Choose surface:** [Azure product catalog (what / when / why not)](./Catalogs/Azure_Products.md)  
- [Azure documentation](https://learn.microsoft.com/azure/) *(API depth after you chose)*  
- [Landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)  
- [Entra ID](https://learn.microsoft.com/entra/fundamentals/whatis) · [Managed identities](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview)  
- [AKS](https://learn.microsoft.com/azure/aks/) · [ARO](https://learn.microsoft.com/azure/openshift/) · [Container Apps](https://learn.microsoft.com/azure/container-apps/)  
- [Application Gateway](https://learn.microsoft.com/azure/application-gateway/) · [Front Door](https://learn.microsoft.com/azure/frontdoor/)  
