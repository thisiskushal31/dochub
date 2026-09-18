# 9 — Alibaba Cloud

[← Previous](./8_IBM_Cloud.md) · [README](./README.md) · [Next: Tencent →](./10_Tencent_Cloud.md) · [Full catalog](./Catalogs/Alibaba_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map — Floor 1 jobs on Alibaba Cloud

| Job | Alibaba wiring | Depth |
|-----|----------------|-------|
| Isolation | Account (+ China vs international split) | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Identity | **RAM** (users, roles, STS) | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | VPC; Express Connect / CEN for cross-border | [16](./16_VPC_And_Network_Constructs.md), [17](./17_Private_Connectivity_And_On_Ramps.md) |
| Compute | ECS | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | OSS | [24](./24_Object_Block_And_File_Storage.md) |
| LB | SLB / ALB-class products | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| K8s | **ACK** | [3](./3_Managed_Kubernetes.md) |
| Registry | ACR | [27](./27_Container_Registries_And_Artifacts.md) |

---

## 1. Concepts

**Alibaba Cloud** (Aliyun) is the large public cloud in **China** with a growing **international** footprint. Assume **Mainland China ≠ international** for accounts, ICP, networking, and SKUs. Many global companies run a **dedicated China account** plus AWS/GCP elsewhere.

ACK is the GKE/EKS analog. **ACK managed** = they run the control plane. **ACK dedicated** ≈ masters on your ECS (closer to [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)).

---

## 2. Advanced concepts

**RAM roles** for ECS and ACK worker identities are the IRSA/WI family ([15](./15_Org_IAM_And_Identity_Federation.md)). RAM users with long-lived AccessKey IDs are the CI anti-pattern ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

China networking: **ICP filing** for public websites, different CDN/DNS ([25](./25_DNS_CDN_And_Edge_HTTP.md)), and cross-border links are first-class design. Do not copy a `us-east-1` VPC diagram into `cn-hangzhou`.

---


### How you grant permission on Alibaba Cloud (quick)

**RAM** users/roles + policies; STS assume-role; RRSA-class for ACK; never leave AccessKeys in CI. China vs international accounts. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on Alibaba Cloud

| Need | Product | See |
|------|---------|-----|
| VMs | ECS | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Functions | Function Compute (FC) | [31](./31_Serverless_Functions_And_Containers.md) |
| Kubernetes | ACK | [3](./3_Managed_Kubernetes.md) |
| Managed DB | RDS-class | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| AI | PAI / Model Studio-class (current docs; residency) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | CloudMonitor / SLS-class logs (current docs) | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Users in Mainland | Aliyun account + ACK/ECS in a China region; ICP if public HTTP |
| Global + China | Two estates; replicate artifacts; do not one-VPC both |
| Deploy shape | ACK vs ECS fleets named ([28](./28_Deployment_Shapes_On_Cloud.md)) |

**Staff checklist**

- China vs international account named  
- RAM roles for machines/CI; no standing AccessKeys in git  
- ICP/CDN plan if public HTTP  
- ACK managed vs dedicated vs kubeadm-on-ECS chosen  

**Good:** separate China estate + RAM roles + ACK. **Bad:** one global VPC fantasy; AccessKeys in CI.

---

## References

- **Choose surface:** [Alibaba product catalog (what / when / why not)](./Catalogs/Alibaba_Products.md)  
- [Alibaba Cloud help](https://www.alibabacloud.com/help) *(API depth after you chose)*  
- [RAM](https://www.alibabacloud.com/help/ram) · [ACK](https://www.alibabacloud.com/help/ack)  
