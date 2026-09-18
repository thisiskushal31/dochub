# 28 — Deployment shapes on cloud

[← README](./README.md) · [Spectrum →](./2_Spectrum_And_When_Which.md) · [Serverless →](./31_Serverless_Functions_And_Containers.md) · [Data →](./32_Managed_Data_And_Databases_On_Cloud.md) · [AI →](./33_AI_And_ML_Platforms_On_Cloud.md) · [Topologies →](./34_Multi_Tier_And_Reference_Topologies.md)

## Mental map

```text
Same delivery jobs:  build → store → deploy → verify → rollback
Spectrum of targets:
  Legacy VM(s) → VM fleets → serverless functions/containers → managed K8s
  → managed data / DB-on-VM → AI (FM API | custom train/serve | GPU K8s)
Knobs change by cloud; jobs do not.
```

*What to notice: Cloud literacy is **when which product**, not memorizing every SKU. CiCd jobs: [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md). AI delivery: [CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md).*

## 1. Concepts

| Shape | Unit of deploy | Typical cloud wiring | Depth |
|-------|----------------|----------------------|-------|
| **Single / small VM group** | Image or package on instances | EC2/GCE/Azure VM | [18](./18_Compute_Instances_And_Autoscaling.md), [34](./34_Multi_Tier_And_Reference_Topologies.md) |
| **VM fleet** | Launch template + ASG/MIG/VMSS | + LB | [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) |
| **Serverless functions** | Function version/alias | Lambda / Cloud Functions / Azure Functions | [31](./31_Serverless_Functions_And_Containers.md) |
| **Serverless containers** | Revision / service | Cloud Run / Fargate / Container Apps | [31](./31_Serverless_Functions_And_Containers.md) |
| **Managed Kubernetes** | Manifest / Helm / GitOps | GKE/EKS/AKS/… | [3](./3_Managed_Kubernetes.md) |
| **Managed database** | Engine as a service | RDS / Cloud SQL / Azure SQL / … | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| **DB on VM** | Engine you patch | VM + disk | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| **Static + CDN** | Object tree + invalidate | [CiCd/17](../CiCd/17_Static_Sites_And_CDN_Deploy.md), [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| **AI — managed FM API** | Prompts + app glue | Bedrock / Vertex / Azure OpenAI | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| **AI — custom train/serve** | Model artifact + endpoint | SageMaker / Vertex / Azure ML | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| **AI — distributed GPU** | GPU fleet / HyperPod / K8s GPU | EKS/GKE/AKS GPU | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| **Hosted private / colo** | Same jobs; different control plane | [Datacenter/](../Datacenter/README.md), [22](./22_Hybrid_Colo_And_Cloud.md) |

**Disconfirm:** “We deployed to the cloud” is **not** a shape. ECS is **not** Kubernetes. Bedrock is **not** SageMaker.

**Confirm:** What is the unit of rollback? Which row in the table are you on? What health signal gates traffic?

## 2. Advanced concepts

### Master when-which (one page)

| Situation | Start here |
|-----------|------------|
| Lift a systemd app | VM or VM fleet |
| Event glue / webhooks | Function ([31](./31_Serverless_Functions_And_Containers.md)) |
| Container HTTP API, little cluster appetite | Serverless container |
| Need Kubernetes API / operators | Managed K8s |
| Standard OLTP | Managed DB ([32](./32_Managed_Data_And_Databases_On_Cloud.md)) |
| Chat/embeddings feature | Managed FM API ([33](./33_AI_And_ML_Platforms_On_Cloud.md)) |
| Fine-tune / custom model ops | ML platform (SageMaker/Vertex/Azure ML) |
| Huge GPU training | Distributed GPU shape |
| Full web system | Wire tiers ([34](./34_Multi_Tier_And_Reference_Topologies.md)) |

### Knobs that differ (same job)

| Job | VM fleets | Serverless containers | Managed K8s |
|-----|-----------|----------------------|-------------|
| Roll forward | Launch template / instance refresh | New revision | New ReplicaSet / Rollout |
| Health gate | LB health | Revision ready | Readiness / Rollouts |
| Traffic shift | Attach to TG | % traffic / tag | Service / Ingress / mesh |
| Identity for deploy | CI OIDC role | Same | Same + cluster RBAC |

### Failure modes

| Failure | Impact |
|---------|--------|
| No readiness before cut | Bad version serves all |
| Image `:latest` | Non-reproducible rollback |
| Quota hit mid-scale | “Outage” that is a limit ([20](./20_FinOps_And_Cost_Controls.md)) |
| Wrong shape for team | Ops thrash |

## 3. Applications and use cases

| Estate | Shape mix |
|--------|-----------|
| Brownfield enterprise | VM fleets + managed DB + one managed cluster |
| Greenfield API | Serverless containers or managed K8s + managed DB |
| GenAI feature | App shape + managed FM API |
| ML platform team | SageMaker/Vertex/Azure ML + GPU capacity plan |
| Marketing site | Static + CDN |
| OpenShift shop | ROSA/ARO/ROKS — not a second vanilla EKS “for apps” |

**Staff checklist**

- Shape named per workload class  
- Data and AI families named if used  
- Rollback unit known  
- CI federated ([15](./15_Org_IAM_And_Identity_Federation.md))  
- Health checks aligned with LB ([23](./23_Load_Balancing_Ingress_And_TLS.md))  

**Good:** paved shape + exception path + tier diagram. **Bad:** every team invents a different home.

## References

- [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md) · [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) · [CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md)  
- [31](./31_Serverless_Functions_And_Containers.md) · [32](./32_Managed_Data_And_Databases_On_Cloud.md) · [33](./33_AI_And_ML_Platforms_On_Cloud.md) · [34](./34_Multi_Tier_And_Reference_Topologies.md)  
