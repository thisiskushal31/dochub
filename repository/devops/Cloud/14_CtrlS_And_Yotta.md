# 14 — CtrlS and Yotta (India datacenter cloud)

[← Previous](./13_Deutsche_Telekom.md) · [README](./README.md) · [Next: Org/IAM (Floor 1) →](./15_Org_IAM_And_Identity_Federation.md) · [Full catalog](./Catalogs/India_CtrlS_Yotta_Products.md) · [Datacenter](../Datacenter/README.md)

## Mental map — Floor 1 jobs still apply

| Job | How it shows up here | Depth |
|-----|----------------------|-------|
| Kind of cloud | Colo vs hosted private vs their regional cloud SKU | [2](./2_Spectrum_And_When_Which.md) |
| Identity | Portal IAM (often thinner than hyperscaler IAM) + your IdP | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network / on-ramp | Public IP, BGP, cross-DC, IX | [16](./16_VPC_And_Network_Constructs.md), [17](./17_Private_Connectivity_And_On_Ramps.md) |
| Compute / K8s | Your metal, their VMware, or their cloud API | [18](./18_Compute_Instances_And_Autoscaling.md), [3](./3_Managed_Kubernetes.md) |
| Capacity | kW / U — colo conversation | [Datacenter Jobs/8](../Datacenter/Jobs/8_Capacity_Conversation.md) |
| Hybrid | Cloud burst + Indian DC | [22](./22_Hybrid_Colo_And_Cloud.md) |

## 1. Concepts

**CtrlS** and **Yotta** are **India-centric datacenter and cloud operators**, not global hyperscalers with an AWS-shaped region map. You meet them as **colocation**, **dedicated racks**, **hosted private cloud** (often VMware), **DR sites**, and **regional cloud** SKUs aimed at Indian data residency.

| Operator | What engineers usually get |
|----------|----------------------------|
| **CtrlS** | Rated-4 Indian DC footprint, colocation, DR, private/hosted cloud |
| **Yotta** | Hyperscale campuses (NM1, D1, G1, …), colocation, hosted/private cloud SKUs |

Treat them as **datacenter + optional cloud API**, not as “AWS in India with a different logo.” Shared Floor 1 jobs still apply; plant depth is [Datacenter/](../Datacenter/README.md).

## 2. Advanced concepts

### Colo vs cloud

| Mode | You operate | They operate |
|------|-------------|--------------|
| **Colocation** | Servers, switches you own, OS, K8s | Building, power, cages |
| **Hosted private cloud** | VMs, maybe Tanzu/OpenShift | Hypervisor, often VMware |
| **Their public/regional cloud** | Instances via their portal/API | DC + virt |

If colo: [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md) or OpenShift on metal. If vCenter: [Datacenter/7](../Datacenter/7_VMware_vSphere.md). If managed K8s endpoint: [3](./3_Managed_Kubernetes.md)-class with **their** SLA.

### Residency and connectivity

India work often needs **in-country** copies and specific interconnects. Do not design “DR in `ap-south-1`” and “prod in CtrlS” without network and identity ([17](./17_Private_Connectivity_And_On_Ramps.md), [22](./22_Hybrid_Colo_And_Cloud.md)).

Portal IAM is often **weaker than AWS IAM**. Compensate with bastions, your IdP, and no shared root ([15](./15_Org_IAM_And_Identity_Federation.md)).

### How you grant permission here (quick)

Portal IAM is often **thinner** than AWS/GCP. Prefer corporate IdP, bastions, least portal admins, and your own OS/K8s RBAC. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy (India DC / regional cloud)

| Need | Pattern | See |
|------|---------|-----|
| Your metal in cage | Colo + kubeadm/OpenShift | [Datacenter/](../Datacenter/README.md) |
| Hosted VMware | Their private cloud SKU | [Datacenter/7](../Datacenter/7_VMware_vSphere.md) |
| Their cloud API | Instances via portal | [2](./2_Spectrum_And_When_Which.md) |
| AI | GPU colo or their SKU + open/hosted models | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | Portal metrics if any + your stack / SaaS; hall DCIM ≠ app APM | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Hybrid burst | On-ramp to hyperscaler | [17](./17_Private_Connectivity_And_On_Ramps.md), [22](./22_Hybrid_Colo_And_Cloud.md) |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Indian residency + your hardware | Colo + kubeadm or OpenShift |
| Indian residency, less metal ops | Their hosted VMware or cloud SKU |
| DR | Second Indian DC (often same operator’s other city) |

**Staff checklist**

- Colo vs hosted vs their cloud SKU written on the contract  
- Who owns vCenter / K8s control plane  
- Physical access, remote hands, and ticket SLAs  
- Network: public IP, BGP, cross-DC  
- Identity: your IdP + least portal admins  

**Good:** colo + your installer + tested remote-hands runbook. **Bad:** “we’re on Yotta so we’re on cloud” with three unmanaged ESXi hosts and no backups.

## References

- **Choose surface:** [CtrlS / Yotta product catalog (what / when / why not)](./Catalogs/India_CtrlS_Yotta_Products.md)  
- [CtrlS](https://www.ctrls.com/) · [CtrlS colocation](https://www.ctrls.com/datacenter-colocation/)  
- [Yotta](https://www.yotta.com/)  
- [Kubernetes on bare metal](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)  
- [Datacenter/](../Datacenter/README.md)  
