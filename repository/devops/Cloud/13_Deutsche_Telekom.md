# 13 — Deutsche Telekom (Open Telekom Cloud)

[← Previous](./12_OVHcloud.md) · [README](./README.md) · [Next: CtrlS & Yotta →](./14_CtrlS_And_Yotta.md)

---

## 1. Concepts

**Deutsche Telekom** cloud work for engineers usually means **T-Systems** and **Open Telekom Cloud (OTC)** — a **public OpenStack cloud** aimed at European data residency — plus **private / managed** estates T-Systems runs in Telekom DCs, and sometimes **partner hyperscalers** (AWS/Azure) sold under a Telekom contract.

OTC is the literacy target when someone says “Telekom cloud” as an IaaS API. It is T-Systems’ **public OpenStack cloud** (Huawei Cloud technology): projects, IAM, Elastic Cloud Server VMs, VPC, object storage. Managed Kubernetes is **Cloud Container Engine (CCE)** — they host the master; you run workers.

| Job | Typical OTC / T-Systems name |
|-----|------------------------------|
| Org | Domain / project (OpenStack) |
| VM | Elastic Cloud Server / Nova instance |
| Network | VPC (OpenStack networking wrapped) |
| Object | Object Storage Service |
| Managed K8s | CCE (Cloud Container Engine) |
| Private DC | T-Systems managed private cloud / colocation |

---

## 2. Advanced concepts

OpenStack clouds use **Keystone** identity. Federation to a corporate IdP is the human path. Application credentials / EC2-style keys for Terraform exist — treat them like AWS keys.

Do not assume AWS Terraform modules apply. Use the OTC/OpenStack provider.

Telekom also operates **5G/edge** and campus networks. That is Networks + this folder’s hybrid story, not “another AZ in `eu-central-1`.”

If the contract is “T-Systems runs our VMware,” you are in [Datacenter/2](../Datacenter/2_Ownership_Colo_And_Contracts.md) + [vSphere](../Datacenter/7_VMware_vSphere.md), not OTC public.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| German/EU public IaaS | OTC project + VPC + managed K8s or VMs |
| Telco-managed private | T-Systems private cloud; you still own app IAM |
| Hyperscaler via Telekom | AWS/Azure account under their org — still [3](./5_AWS_Literacy.md)/[4](./6_Azure_Literacy.md) |

**Staff checklist**

- OTC public vs T-Systems private vs resold AWS/Azure named  
- OpenStack project quotas (they bite)  
- Kubernetes SKU vs kubeadm on VMs named  

**Good:** OTC project-per-env, IdP federation, documented K8s SKU. **Bad:** one OpenStack user with admin, VMs in the default network, no AZ story.

---

## References

- [Open Telekom Cloud](https://www.open-telekom-cloud.com/)  
- [OTC documentation](https://docs.otc.t-systems.com/)  
- [OTC CCE](https://docs.otc.t-systems.com/cloud-container-engine/)  
- [T-Systems](https://www.t-systems.com/)  
