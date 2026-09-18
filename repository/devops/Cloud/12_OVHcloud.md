# 12 — OVHcloud

[← Previous](./11_Huawei_Cloud.md) · [README](./README.md) · [Next: Deutsche Telekom →](./13_Deutsche_Telekom.md) · [Full catalog](./Catalogs/OVH_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map — Floor 1 jobs on OVHcloud

| Job | OVH wiring | Depth |
|-----|------------|-------|
| Isolation | Customer account / Public Cloud project | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Identity | OVHcloud IAM | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | vRack / Private Network / Public Cloud networking | [16](./16_VPC_And_Network_Constructs.md) |
| Compute | Public Cloud instance; Bare Metal | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | Object Storage (S3-compatible APIs) | [24](./24_Object_Block_And_File_Storage.md) |
| K8s | **MKS** | [3](./3_Managed_Kubernetes.md) |
| DNS | OVHcloud DNS | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| Hosted private | VMware Hosted Private Cloud | [Datacenter/7](../Datacenter/7_VMware_vSphere.md) |

---

## 1. Concepts

**OVHcloud** is a European hyperscaler: **Public Cloud** (OpenStack-based IaaS), **Bare Metal**, **Hosted Private Cloud** (typically VMware), and **Managed Kubernetes Service (MKS)**. Full public cloud — not colo — and **not** AWS with French branding.

Three estates people mix up ([2](./2_Spectrum_And_When_Which.md)):

1. **Public Cloud VM** + MKS — closest to “AWS lite.”  
2. **Bare Metal** — vanilla kubeadm is [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md).  
3. **Hosted Private Cloud** — VMware as a service ([Datacenter/2](../Datacenter/2_Ownership_Colo_And_Contracts.md)).

---

## 2. Advanced concepts

EU residency is a common **why**. Terraform: current OVH provider — do not assume AWS resource names ([19](./19_Portals_CLI_And_API_Patterns.md)). LB and deploy knobs still follow Floor 1 jobs ([23](./23_Load_Balancing_Ingress_And_TLS.md), [28](./28_Deployment_Shapes_On_Cloud.md)).

---


### How you grant permission on OVHcloud (quick)

Customer IAM users/roles on Public Cloud projects — thinner than hyperscaler IAM; compensate with IdP + bastion. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on OVHcloud

| Need | Product | See |
|------|---------|-----|
| VMs | Public Cloud instance | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Dedicated | Bare Metal | [2](./2_Spectrum_And_When_Which.md) |
| Kubernetes | MKS | [3](./3_Managed_Kubernetes.md) |
| VMware | Hosted Private Cloud | [Datacenter/7](../Datacenter/7_VMware_vSphere.md) |
| AI | Often DIY GPU instance + open models | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | Native metrics/logs where offered; else DIY/SaaS | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| EU public cloud | Public Cloud + MKS |
| Dedicated performance | Bare Metal + your installer |
| VMware comfort | Hosted Private Cloud |

**Staff checklist**

- Which of the three estates is contracted  
- MKS vs kubeadm-on-instance vs bare-metal kubeadm named  
- IAM users/roles; no shared root for CI  

**Good:** estate named + MKS or deliberate metal path. **Bad:** “OVH” without saying Public vs Bare Metal vs VMware.

---

## References

- **Choose surface:** [OVH product catalog (what / when / why not)](./Catalogs/OVH_Products.md)  
- [OVHcloud help](https://help.ovhcloud.com/) *(API depth after you chose)*  
- [Managed Kubernetes](https://help.ovhcloud.com/csm/en-public-cloud-kubernetes)  
