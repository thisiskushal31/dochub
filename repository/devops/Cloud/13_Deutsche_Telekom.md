# 13 — Deutsche Telekom (Open Telekom Cloud)

[← Previous](./12_OVHcloud.md) · [README](./README.md) · [Next: CtrlS & Yotta →](./14_CtrlS_And_Yotta.md) · [Full catalog](./Catalogs/OTC_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map — Floor 1 jobs on OTC / T-Systems

| Job | Typical OTC / T-Systems name | Depth |
|-----|------------------------------|-------|
| Isolation | Domain / project (OpenStack) | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Identity | Keystone / IAM; federation to IdP | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | VPC (OpenStack networking wrapped) | [16](./16_VPC_And_Network_Constructs.md) |
| Compute | Elastic Cloud Server / Nova instance | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | Object Storage Service | [24](./24_Object_Block_And_File_Storage.md) |
| K8s | **CCE** | [3](./3_Managed_Kubernetes.md) |
| Private DC | T-Systems managed private / colo | [Datacenter/](../Datacenter/README.md) |

---

## 1. Concepts

**Deutsche Telekom** cloud work usually means **T-Systems** and **Open Telekom Cloud (OTC)** — a **public OpenStack cloud** aimed at European data residency — plus private/managed estates, and sometimes partner hyperscalers sold under a Telekom contract.

OTC is the literacy target when someone says “Telekom cloud” as an IaaS API (Huawei Cloud technology under the hood — related to [11](./11_Huawei_Cloud.md), different operator).

---

## 2. Advanced concepts

OpenStack **Keystone** identity; federation for humans; application credentials for Terraform — treat like cloud keys ([15](./15_Org_IAM_And_Identity_Federation.md), [19](./19_Portals_CLI_And_API_Patterns.md)). Do not assume AWS Terraform modules apply.

If the contract is “T-Systems runs our VMware,” you are in [Datacenter/2](../Datacenter/2_Ownership_Colo_And_Contracts.md) + [vSphere](../Datacenter/7_VMware_vSphere.md), not OTC public. Telekom **5G/edge** is Networks + hybrid ([22](./22_Hybrid_Colo_And_Cloud.md)), not “another AZ in `eu-central-1`.”

---


### How you grant permission on OTC (quick)

OpenStack **Keystone** projects/roles; federate corporate IdP; treat app credentials like cloud keys. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on OTC / T-Systems

| Need | Product | See |
|------|---------|-----|
| VMs | ECS / Nova | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Kubernetes | CCE | [3](./3_Managed_Kubernetes.md) |
| Managed VMware | T-Systems private (not OTC API) | [Datacenter/](../Datacenter/README.md) |
| AI | Limited catalog — GPU instances / partner | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | OTC/CES-class monitoring (current docs) + export | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| EU OpenStack public | OTC project + CCE or VMs |
| Telekom-managed VMware | Datacenter path, not OTC API |
| Partner hyperscaler under Telekom paper | Still AWS/Azure literacy ([5](./5_AWS_Literacy.md)/[6](./6_Azure_Literacy.md)) |

**Staff checklist**

- OTC public vs T-Systems private vs partner hyperscaler named  
- Keystone/IAM federation for humans  
- CCE vs self-managed chosen  

**Good:** clear OTC project + CCE. **Bad:** Telekom contract with unknown control plane.

---

## References

- **Choose surface:** [OTC product catalog (what / when / why not)](./Catalogs/OTC_Products.md)  
- [Open Telekom Cloud docs](https://docs.otc.t-systems.com/) *(API depth after you chose)*  
- [OTC CCE](https://docs.otc.t-systems.com/cloud-container-engine/)  
