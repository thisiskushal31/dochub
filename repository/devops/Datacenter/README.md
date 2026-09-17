# Datacenter

How software lands on **metal and in a hall**: on-prem servers, colo, hosted private cloud, hypervisors, and the facility around them. *Not a public-cloud account. Not kubeadm internals. Not nginx.*

Public clouds (IAM, VPC, GKE/EKS/AKS and cousins): [Cloud/](../Cloud/README.md). What Kubernetes *is*: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes). OpenShift platform: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift). Rancher: [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher). Host web tier: [Servers/](../Servers/README.md). Packet depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Config of hosts: [Automation/](../Automation/README.md).

Someone new should leave able to:

- Tell **owned DC vs colo vs hosted vCenter vs dedicated metal vs public IaaS** apart, including who pages at 3am  
- Walk a first-week DC conversation (kW, U, PDU, BMC, cross-connect, change ticket, remote hands)  
- Name how a three-tier app **and** a cluster actually get onto that fabric  
- Design a second **site**, not a second VLAN, when someone says “DR”  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| What you bought | [1](./1_On_Prem_As_A_Solution.md)–[2](./2_Ownership_Colo_And_Contracts.md) | Estate and contract |
| The hall | [3](./3_Facility_Power_Cooling_And_Rooms.md)–[6](./6_Storage_Backup_And_Restore.md) | Power, rack, fabric, disks |
| What runs on the iron | [7](./7_VMware_vSphere.md)–[8](./8_Other_Hypervisors_And_Private_IaaS.md) | vSphere and the rest |
| How software lands | [9](./9_Deploy_On_The_Estate.md)–[10](./10_Clusters_On_Prem.md) | VM / metal / cluster map |
| Operate two buildings | [11](./11_Identity_Access_And_Change.md)–[12](./12_Sites_DR_Hybrid_And_The_Job.md) | IdP, tickets, DR, hybrid SKUs |

Suggested order: **1 → 6**, then **7 or 8** for the hypervisor you actually have, then **9 → 12**.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 1 | [On-prem as a solution](./1_On_Prem_As_A_Solution.md) | Why metal exists; vs IaaS; shapes |
| 2 | [Ownership, colo, and contracts](./2_Ownership_Colo_And_Contracts.md) | Who owns building, iron, OS, app |
| 3 | [Facility, power, cooling, rooms](./3_Facility_Power_Cooling_And_Rooms.md) | The building as a product |
| 4 | [Rack, BMC, and provisioning](./4_Rack_BMC_And_Provisioning.md) | U, PDU, OOB, PXE/Redfish |
| 5 | [Fabric, cross-connect, and OOB](./5_Fabric_Cross_Connect_And_OOB.md) | How packets leave the cage |
| 6 | [Storage, backup, and restore](./6_Storage_Backup_And_Restore.md) | DAS/NAS/SAN/SDS; snapshots ≠ backups |
| 7 | [VMware vSphere](./7_VMware_vSphere.md) | ESXi, vCenter, HA/DRS, Tanzu |
| 8 | [Other hypervisors and private IaaS](./8_Other_Hypervisors_And_Private_IaaS.md) | KVM, Hyper-V, Proxmox, Nutanix, OpenStack, Stack/Outposts |
| 9 | [Deploy on the estate](./9_Deploy_On_The_Estate.md) | Metal OS, VM fleets, appliances, change windows |
| 10 | [Clusters on-prem](./10_Clusters_On_Prem.md) | kubeadm / OpenShift / Rancher / Tanzu on *this* fabric |
| 11 | [Identity, access, and change](./11_Identity_Access_And_Change.md) | IdP, jump, BMC creds, CAB |
| 12 | [Sites, DR, hybrid, and the job](./12_Sites_DR_Hybrid_And_The_Job.md) | Two buildings, Arc/Outposts, first week |

---

## Cross-links

- Cloud providers (including CtrlS/Yotta as colo SKUs): [Cloud/](../Cloud/README.md)  
- VM fleets in CI: [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
- Delivery spectrum: [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)  
- Self-managed Kubernetes: [Kubernetes 6–7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)  
- OpenShift on metal/vSphere: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)  
- Rancher / RKE2 / k3s: [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher)  
- IaC: [IAC/](../IAC/README.md)  
