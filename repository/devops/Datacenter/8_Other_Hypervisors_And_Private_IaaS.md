# 8 — Other hypervisors and private IaaS

[← Previous](./7_VMware_vSphere.md) · [README](./README.md) · [Next: Deploy →](./9_Deploy_On_The_Estate.md)

## 1. Concepts

vSphere is common, not mandatory. The **jobs** are the same: isolate tenants, place VMs, attach disks, attach networks, live-migrate when you can, restart when a host dies. The API names change.

| Stack | Hypervisor | Control plane you will hear |
|-------|------------|------------------------------|
| **KVM + libvirt** | KVM | virsh, Cockpit, scripts; DIY |
| **Proxmox VE** | KVM + LXC | Proxmox datacenter / cluster / Ceph |
| **oVirt / RHV** | KVM | oVirt engine (RHEL-centric) |
| **Hyper-V** | Hyper-V | Failover Clustering, optional SCVMM |
| **Nutanix** | AHV (KVM-based) | Prism; HCI |
| **OpenStack** | Usually KVM | Nova, Neutron, Cinder, Glance, Keystone, … |
| **Xen / XenServer / XCP-ng** | Xen | Smaller estates; still production somewhere |
| **Vendor cloud stack in the hall** | Varies | Azure Local / Stack, AWS Outposts, Google Distributed Cloud, Huawei Cloud Stack |

Pick **one** primary VM API per estate unless you have a written reason. Dual-running vSphere and OpenStack “for strategy” is two on-call rotations.

Public OpenStack (OTC): [Cloud/13](../Cloud/13_Deutsche_Telekom.md). Huawei public vs HCS: [Cloud/11](../Cloud/11_Huawei_Cloud.md). Hybrid SKUs: [12](./12_Sites_DR_Hybrid_And_The_Job.md).

## 2. Advanced concepts

### KVM family

KVM is the Linux kernel hypervisor. **libvirt** is the usual management layer. Production means: bridged or SR-IOV networking, hugepages if you promised them, CPU pinning for NFV/telecom, storage that is not a random qcow2 on root.

**Proxmox VE** packages KVM, LXC, clustering, and often Ceph. It is a real estate API. Treat it like vCenter: backup the config, pin versions, do not run prod VMs on local disks you called “Ceph later.”

**oVirt** is the upstream of what was Red Hat Virtualization. Engine + hosts; similar jobs to vCenter.

### Hyper-V

Windows Server **Failover Clustering** + Cluster Shared Volumes (or SMB). **Hyper-V Replica** is async DR, not HA. SCVMM is optional (templates, fabric). Guest is often Windows; Linux guests work if integration services are honest. Identity is AD. If the hall is already AD-centric, Hyper-V is a consistent choice — not a lesser vSphere.

### Nutanix HCI

AHV + Prism: compute and storage as one cluster (like vSAN, different vendor). Failure domains, rebuild, and firmware still apply. Prism is the API; do not SSH to every CVM as a culture.

### OpenStack as private IaaS

OpenStack is **many services**. The ones you must be able to name:

| Service | Job |
|---------|-----|
| **Keystone** | Identity |
| **Nova** | Compute (VMs) |
| **Neutron** | Networks, often with ML2/OVN |
| **Cinder** | Block volumes |
| **Glance** | Images |
| **Placement** | Capacity |
| **Horizon / CLI / Heat** | UI / API / templates |
| **Ironic** | Bare metal as Nova target |
| **Magnum / Octavia** | K8s clusters / LB (when used) |
| **Swift / RGW** | Object |

You operate a **distributed system**, not a hypervisor checkbox. Upgrades are a program. If the team cannot staff Keystone+Neutron+Nova, do not pick OpenStack to “avoid VMware licensing.”

**Huawei Cloud Stack, similar OEM OpenStacks:** same jobs, vendor portal. Do not confuse with that vendor’s **public** cloud account.

### Cloud-on-prem appliances

**AWS Outposts**, **Azure Local / Stack Hub**, **Google Distributed Cloud**: a slice of their control plane in your rack. You still provide power, cooling, network, and often identity integration. Latency to the parent region may be a hard dependency — read whether the rack works **disconnected**. These are not colo; they are a **hybrid product** sitting on this chapter’s iron ([12](./12_Sites_DR_Hybrid_And_The_Job.md)).

### Containers vs VMs

LXC on Proxmox, Kata, OpenShift virtualization ([OpenShift 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/OpenShift/7_Virtualization.md)) — VMs and containers can share a hall. Isolation, PCI passthrough, and live migrate behave differently. Do not mix GPU passthrough and DRS-like moves without a test.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Linux-only hall, small team | Proxmox or libvirt **with** backup and cluster, not a single node |
| AD-centric estate | Hyper-V + Failover Clustering |
| HCI refresh off vSAN | Nutanix or vSAN — pick; do not run both as a science fair |
| Self-service IaaS API | OpenStack only with a platform team |
| “Need AWS APIs in the building” | Outposts/Stack — contract the disconnected behavior |
| Telecom / NFV | KVM with pinning/SR-IOV; often not DRS-style overcommit |

**Staff checklist**

- One primary VM API named  
- HA/restart story (cluster, not a single host)  
- Image/template pipeline  
- Backup of the **manager** (vCenter equivalent)  
- Network: bridge vs overlay vs SR-IOV documented  
- If OpenStack: named services and upgrade owner  
- If Outposts/Stack: parent-region dependency written down  

**Good:** one stack, templates, manager backup, firmware cadence. **Bad:** vSphere + Proxmox + OpenStack for the same app tier, local qcow2 as prod, no cluster, cloud-on-prem assuming the WAN always works.

## Go deeper

- [Compute/](./Compute/README.md) · [Markets-And-Operators/](./Markets-And-Operators/README.md)  

## References

- [KVM](https://www.linux-kvm.org/) · [libvirt](https://libvirt.org/)  
- [Proxmox VE](https://pve.proxmox.com/)  
- [oVirt](https://www.ovirt.org/)  
- [Hyper-V](https://learn.microsoft.com/windows-server/virtualization/hyper-v/hyper-v-technology-overview)  
- [Nutanix](https://www.nutanix.com/products)  
- [OpenStack docs](https://docs.openstack.org/)  
- [XCP-ng](https://xcp-ng.org/)  
- [AWS Outposts](https://docs.aws.amazon.com/outposts/)  
- [Azure Local](https://learn.microsoft.com/azure/azure-local/)  
