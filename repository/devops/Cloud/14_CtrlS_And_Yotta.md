# 14 — CtrlS and Yotta (India datacenter cloud)

[← Previous](./13_Deutsche_Telekom.md) · [README](./README.md) · [Next: Org/IAM advanced →](./15_Org_IAM_And_Identity_Federation.md)

---

## 1. Concepts

**CtrlS** and **Yotta** are **India-centric datacenter and cloud operators**, not global hyperscalers with an AWS-shaped region map. You meet them as **colocation**, **dedicated racks**, **hosted private cloud** (often VMware), **DR sites**, and **regional cloud** SKUs aimed at Indian data residency.

| Operator | What engineers usually get |
|----------|----------------------------|
| **CtrlS** | Rated-4 Indian DC footprint (Mumbai, Hyderabad, Chennai, Noida, Bengaluru, Kolkata, edge), colocation, DR, private/hosted cloud |
| **Yotta** | Hyperscale campuses (**NM1** Navi Mumbai, **D1** Greater Noida, **G1** GIFT City), colocation, hosted/private cloud SKUs |

Treat them as **datacenter + optional cloud API**, not as “AWS in India with a different logo.” Some SKUs are self-service VMs/K8s; many estates are **you rack servers or they host VMware** and you still do [vanilla kubeadm](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md) or [Datacenter/](../Datacenter/README.md) (colo [2](../Datacenter/2_Ownership_Colo_And_Contracts.md), vSphere [7](../Datacenter/7_VMware_vSphere.md)).

Shared jobs still apply: identity, network isolation, power/cooling as a **capacity** constraint, physical access vs API access.

---

## 2. Advanced concepts

### Colo vs cloud

| Mode | You operate | They operate |
|------|-------------|--------------|
| **Colocation** | Servers, switches you own, OS, K8s | Building, power, cages |
| **Hosted private cloud** | VMs, maybe Tanzu/OpenShift | Hypervisor, often VMware |
| **Their public/regional cloud** | Instances via their portal/API | DC + virt |

If the contract is colo, **vanilla Kubernetes on bare metal** in that cage is [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md). If they hand you vCenter, [Datacenter/7](../Datacenter/7_VMware_vSphere.md). If they hand you a managed K8s endpoint, [3](./3_Managed_Kubernetes.md)-class with **their** SLA.

### Residency and connectivity

India work often needs **in-country** copies and specific interconnects (local IX, dedicated fiber between DCs). Do not design “DR in `ap-south-1`” and “prod in CtrlS” without a network and identity story.

Portal IAM is often **weaker than AWS IAM**. Compensate with bastions, your IdP, and no shared root.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Indian residency + your hardware | Colo (CtrlS/Yotta) + kubeadm or OpenShift |
| Indian residency, less metal ops | Their hosted VMware or cloud SKU |
| DR | Second Indian DC (often the same operator’s other city) |

**Staff checklist**

- Colo vs hosted vs their cloud SKU written on the contract  
- Who owns vCenter / K8s control plane  
- Physical access, remote hands, and ticket SLAs  
- Network: public IP, BGP, cross-DC  

**Good:** colo + your installer + tested remote-hands runbook. **Bad:** “we’re on Yotta so we’re on cloud” with three unmanaged ESXi hosts and no backups.

---

## References

- [CtrlS](https://www.ctrls.com/)  
- [CtrlS colocation](https://www.ctrls.com/datacenter-colocation/)  
- [Yotta](https://www.yotta.com/)  
- [Yotta NM1](https://colocation.yotta.com/data-center/nm1-data-center-in-mumbai-maharashtra/)  
- [Kubernetes on bare metal](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)  
