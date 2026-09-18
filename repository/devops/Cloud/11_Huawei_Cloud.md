# 11 — Huawei Cloud

[← Previous](./10_Tencent_Cloud.md) · [README](./README.md) · [Next: OVH →](./12_OVHcloud.md) · [Full catalog](./Catalogs/Huawei_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

## Mental map — Floor 1 jobs on Huawei Cloud

| Job | Huawei wiring | Depth |
|-----|---------------|-------|
| Isolation | Account / IAM | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | VPC | [16](./16_VPC_And_Network_Constructs.md) |
| Compute | ECS | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | OBS | [24](./24_Object_Block_And_File_Storage.md) |
| K8s | **CCE** (public) / Cloud Stack variants | [3](./3_Managed_Kubernetes.md) |
| Registry | SWR | [27](./27_Container_Registries_And_Artifacts.md) |

## 1. Concepts

**Huawei Cloud** offers public IaaS/PaaS and **Cloud Stack** (on-prem/partner-operated stacks that feel like the public API). Managed Kubernetes is **CCE**. Object storage is **OBS**.

You may meet Huawei Cloud as a **public** tenant or as the technology under another operator’s OpenStack cloud (e.g. OTC — [13](./13_Deutsche_Telekom.md)). Classify: public Huawei account vs Cloud Stack vs Telekom OTC.

## 2. Advanced concepts

Same durable jobs: IAM, VPC, LB, CCE vs ECS fleets ([28](./28_Deployment_Shapes_On_Cloud.md)). China/regional residency and export-control constraints can matter — read current contract and region list; do not invent geopolitics in runbooks.

Cloud Stack means “API literacy transfers; operations and SLAs are the partner’s.”

### How you grant permission on Huawei Cloud (quick)

IAM users/agencies/roles on projects; Cloud Stack follows partner IAM. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on Huawei Cloud

| Need | Product | See |
|------|---------|-----|
| VMs | ECS | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Kubernetes | CCE | [3](./3_Managed_Kubernetes.md) |
| Object / DB | OBS + RDS-class | [24](./24_Object_Block_And_File_Storage.md), [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| AI | ModelArts-class (current docs) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | AOM / LTS-class (current docs) | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Public Huawei | Account + CCE/ECS + OBS |
| Stack under partner | Partner runbook + CCE-class SKU |
| EU OpenStack cousin | Often OTC ([13](./13_Deutsche_Telekom.md)) — confirm brand |

**Staff checklist**

- Public vs Cloud Stack vs OTC named  
- IAM + private VPC for workers  
- CCE vs self-managed chosen  

**Good:** clear product boundary + CCE. **Bad:** mixing OTC tickets with Huawei public console folklore.

## References

- **Choose surface:** [Huawei product catalog (what / when / why not)](./Catalogs/Huawei_Products.md)  
- [Huawei Cloud](https://www.huaweicloud.com/intl/en-us/) *(API depth after you chose)*  
- [CCE](https://www.huaweicloud.com/intl/en-us/product/cce.html)  
