# 1 — On-prem as a solution

[← Datacenter](./README.md) · [Next: Ownership and colo →](./2_Ownership_Colo_And_Contracts.md)

---

## 1. Concepts

**On-prem** means the computers that run production are **yours to fail**: physical servers (or VMs on a hypervisor **you** operate) sitting in a building you own, lease, or colo. There is no cloud account that can spawn a replacement in another availability zone. Capacity is **purchase, rack, power, and lead time**, not an API quota.

This folder is that **solution**. Named public clouds: [Cloud/](../Cloud/README.md). kubeadm internals: [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md). nginx on a host: [Servers/](../Servers/README.md). Who legally owns the cage vs the iron: [2](./2_Ownership_Colo_And_Contracts.md).

```text
Public cloud IaaS     →  you rent VMs; provider owns building + hypervisor
On-prem / colo metal  →  you (or remote hands) own BIOS → OS → whatever you install
Hosted private cloud  →  they own the hypervisor; you get VMs that feel like a DC, not AWS
Cloud-on-prem SKU     →  their control plane / branded stack in *your* hall (Outposts, Stack, HCS, …)
```

**Hybrid** is some workloads on metal and some in public cloud, with a **deliberate** identity, image, DNS, and network story. A VPN plus hope is not hybrid. Two-site and hybrid products: [12](./12_Sites_DR_Hybrid_And_The_Job.md).

### Why teams still choose on-prem

| Reason | What you actually buy |
|--------|------------------------|
| Data must not leave a site | Latency to the plant, or a legal/residency rule that names **this building** |
| Hardware the catalog will not sell | GPUs, FPGAs, huge RAM, special NICs, air-gap, serial plants |
| Cost at steady high utilization | Capex + colo vs always-on cloud VMs — **run the numbers**, do not slogan |
| Existing estate | Racks already paid for; vSphere already staffed; mainframe already next door |
| Sovereignty / disconnected | No path to a public API; updates arrive on media |
| Deterministic neighbors | No noisy multi-tenant hypervisor you do not control |

None of these automatically beat a managed cloud. You inherited **facilities + firmware + OS + spare parts**. If the reason is “we do not trust cloud,” write the actual control you need (encryption, residency, identity) — many of those exist as cloud SKUs.

### Shapes (pick one in the runbook)

| Shape | You operate | Typical next |
|-------|-------------|--------------|
| **OS on the box** | Linux or Windows; systemd, containers, or kubeadm | [9](./9_Deploy_On_The_Estate.md), [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md), Kubernetes 7 |
| **Hypervisor on the box** | ESXi / KVM / Hyper-V; VMs are your IaaS | [7](./7_VMware_vSphere.md), [8](./8_Other_Hypervisors_And_Private_IaaS.md) |
| **HCI** | Nutanix / vSAN-class: compute+storage as one cluster | [7](./7_VMware_vSphere.md), [8](./8_Other_Hypervisors_And_Private_IaaS.md) |
| **Private IaaS API** | OpenStack (or a vendor cloud stack) in the hall | [8](./8_Other_Hypervisors_And_Private_IaaS.md) |
| **Someone else’s metal, your OS** | Colo cage | [2](./2_Ownership_Colo_And_Contracts.md) |
| **Edge / one site** | A few servers in a plant or store | Still this estate; do not call it a region |
| **Mainframe / midrange adjacency** | z/OS, IBM i, SPARC still in the same building | Delivery: [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md); do not pretend they are Linux VMs |

Local kind/minikube remain learning tools, not production on-prem.

### What “solution” means here

A working on-prem solution is **all** of: power that survives a feed loss, a network that can fail a ToR, disks you can restore onto **other** disks, an identity for humans and machines, a way to image a dead box, and a change process. Skipping the building and jumping to Helm is how you get a cluster that cannot boot after a PDU trip.

---

## 2. Advanced concepts

### Failure domains are physical

Cloud “two AZs” is two provider buildings. On metal, two VMs on one chassis is **one** failure domain. Independent means **racks, feeds, ToR switches, rooms, and often sites** — named in the runbook, not hoped for.

Capacity is lead time: PDU budget, rack U, switch ports, disk shelves, GPU allocation, cooling headroom. Autoscaling that assumes an infinite SKU catalog does not exist. You scale by **ordering**, not by ticking a replica count past the last amp.

### What changes vs cloud IaaS

| Concern | Cloud VM | On-prem |
|---------|----------|---------|
| Replace a dead node | API + image | BMC, spare, remote hands, or a truck |
| Disks | Cloud block + CSI | Local, SAN, Ceph, vSphere datastore |
| Load balancer | Cloud LB | Hardware LB, BGP, MetalLB, NSX/AVI |
| Identity | Cloud IAM | Your IdP / LDAP / certificates; no IRSA unless you build it |
| Patching | New instance | Firmware + hypervisor/OS + whatever is stacked on top |
| Quota | API limit | kW, U, ports, licenses |
| Bill | Metered | Capex + colo + people + spare pool |

### TCO without slogans

On-prem looks cheaper when utilization is high and hardware lives many years. It looks expensive when you count: staff who can firmware a BMC, spare identical SKUs, software licenses (vSphere, Windows, backup), colo kW, generator fuel tests, and the **opportunity cost of waiting eight weeks for GPUs**. Cloud looks expensive at steady 80% of a full rack, and cheap for burst and for teams that should not run a hall. Write both columns. FinOps literacy still applies ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)) — the unit is just **rack + people**, not a SKU hour.

### Hybrid products (literacy)

Hyperscalers sell ways to run **their Kubernetes or control-plane experience** on **your** hardware (EKS Anywhere, Azure Arc-connected clusters, GKE attached / fleet, Azure Stack, AWS Outposts, Google Distributed Cloud, Huawei Cloud Stack). You still own the machines unless the contract says otherwise. Read the SLA: who pages for etcd? Who owns the door?

OpenShift on metal vs **ROSA/ARO** is the same fork as kubeadm-on-EC2 vs EKS. Platform: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift). Cloud SKUs: [Cloud/3](../Cloud/3_Managed_Kubernetes.md). The hall around either: this folder.

### Network honesty

Hybrid usually fails on **identity and DNS**, not on YAML. If a process in colo must reach a cloud database, you are in Networks + Security ([Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive), [Security/](../Security/README.md)). A tunnel is not an architecture. Fabric in *this* building: [5](./5_Fabric_Cross_Connect_And_OOB.md).

### Air-gap is a program

Disconnected does not mean “we turned off the NIC.” It means: how images enter (media, sneakernet registry), how firmware and OS patches enter, how time is sourced, how certificates renew, how you still **restore**. OpenShift documents restricted/disconnected installs; kubeadm needs a mirror. Pretending the cluster is air-gapped while CI pulls Docker Hub is a finding.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Data cannot leave the building | Metal or colo in that building; public cloud is backup, empty, or forbidden |
| Factory / retail edge | Small metal; GitOps from a hub; do not pretend it is an AZ |
| Burst to cloud | Metal baseline + managed K8s for overflow (hard: identity, images, ingress) |
| “We already have vSphere” | Stay on VMs until there is a reason to OS the box — [7](./7_VMware_vSphere.md) |
| Regulated rack | This folder + [11](./11_Identity_Access_And_Change.md); cluster choice in [10](./10_Clusters_On_Prem.md) |
| Mainframe next to Linux | Two runbooks, one building; do not “containerize” CICS as a first move |

**Staff checklist**

- Metal vs colo vs hosted hypervisor vs public IaaS vs cloud-on-prem SKU **named**  
- Physical failure domains (rack / feed / switch / room / site) written down  
- Who owns BMC, hypervisor/OS, and the application stack  
- Spare capacity in **U and amps and ports**, not only replica count  
- Kubernetes, if any: self-managed, OpenShift, Rancher, Tanzu, or a cloud SKU — named  
- Reason for on-prem is a control you can audit, not a slogan  

**Good:** two rooms or two feeds, documented BMC, IdP for humans, lead time on the capacity plan. **Bad:** one tower under a desk, DHCP from office Wi-Fi, called “private GKE.”

---

## References

- [Kubernetes: production environment](https://kubernetes.io/docs/setup/production-environment/)  
- [EKS Anywhere](https://anywhere.eks.amazonaws.com/)  
- [Azure Arc Kubernetes](https://learn.microsoft.com/azure/azure-arc/kubernetes/overview)  
- [GKE attached clusters](https://cloud.google.com/kubernetes-engine/enterprise/attached-clusters/docs)  
- [AWS Outposts](https://docs.aws.amazon.com/outposts/)  
- [Azure Local / Azure Stack](https://learn.microsoft.com/azure/azure-local/)  
- [OpenShift install](https://docs.redhat.com/en/documentation/openshift_container_platform/)  
