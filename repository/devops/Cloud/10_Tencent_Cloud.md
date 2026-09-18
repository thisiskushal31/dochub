# 10 — Tencent Cloud

[← Previous](./9_Alibaba_Cloud.md) · [README](./README.md) · [Next: Huawei →](./11_Huawei_Cloud.md) · [Full catalog](./Catalogs/Tencent_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map — Floor 1 jobs on Tencent Cloud

| Job | Tencent wiring | Depth |
|-----|----------------|-------|
| Isolation | Account | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Identity | **CAM** | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | VPC | [16](./16_VPC_And_Network_Constructs.md) |
| Compute | CVM | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | COS | [24](./24_Object_Block_And_File_Storage.md) |
| LB | CLB | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| K8s | **TKE** | [3](./3_Managed_Kubernetes.md) |
| Registry | TCR | [27](./27_Container_Registries_And_Artifacts.md) |

---

## 1. Concepts

**Tencent Cloud** is a major China (and international) public cloud. Identity is **CAM**. VMs are **CVM**. Managed Kubernetes is **TKE**. Object storage is **COS**.

Tencent’s ecosystem (WeChat, games, payments) often drives **why** a team is here — latency to those users — not a generic “third cloud.” Design for that, then pick TKE vs CVM fleets ([28](./28_Deployment_Shapes_On_Cloud.md), [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)).

---

## 2. Advanced concepts

Same China vs international diligence as Aliyun: accounts, ICP, CDN/DNS, cross-border ([25](./25_DNS_CDN_And_Edge_HTTP.md)). CAM roles for workloads; ban long-lived keys in CI ([15](./15_Org_IAM_And_Identity_Federation.md)).

CLB health checks and listeners are the same **LB job** as ALB/NLB with different consoles ([23](./23_Load_Balancing_Ingress_And_TLS.md)).

---


### How you grant permission on Tencent Cloud (quick)

**CAM** users/roles + policies; roles for CVM/TKE; ban standing keys in CI. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on Tencent Cloud

| Need | Product | See |
|------|---------|-----|
| VMs | CVM | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Functions | SCF | [31](./31_Serverless_Functions_And_Containers.md) |
| Kubernetes | TKE | [3](./3_Managed_Kubernetes.md) |
| Managed DB | TencentDB-class | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| AI | TI / Hunyuan-class platforms (current docs) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | Cloud Monitor / CLS-class logs (current docs) | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Latency to Tencent ecosystem | In-region CVM/TKE |
| Vanilla K8s | TKE managed |
| Classic fleets | CVM + CLB |

**Staff checklist**

- CAM least privilege + federated CI where offered  
- China networking/ICP if public  
- TKE vs CVM shape named  

**Good:** in-region estate + CAM roles. **Bad:** remote VPN-only “China strategy.”

---

## References

- **Choose surface:** [Tencent product catalog (what / when / why not)](./Catalogs/Tencent_Products.md)  
- [Tencent Cloud docs](https://www.tencentcloud.com/document/product) *(API depth after you chose)*  
- [CAM](https://www.tencentcloud.com/document/product/598) · [TKE](https://www.tencentcloud.com/document/product/457)  
