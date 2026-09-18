# 7 — VMware vSphere

[← Previous](./6_Storage_Backup_And_Restore.md) · [README](./README.md) · [Next: Other hypervisors →](./8_Other_Hypervisors_And_Private_IaaS.md)

## 1. Concepts

Most enterprise halls still run **VMware vSphere** for the fleet of distributed applications: **ESXi** on the host, **vCenter Server** as the API, clusters with HA/DRS, datastores, port groups. Docs now live under Broadcom techdocs; the product jobs did not change.

This chapter is the **hypervisor as IaaS you operate**. Hosted vCenter (someone else patches ESXi) is still this API with a different BMC story ([2](./2_Ownership_Colo_And_Contracts.md)). Public cloud: [Cloud/](../Cloud/README.md). How a three-tier app rolls: [9](./9_Deploy_On_The_Estate.md) and [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md).

| Piece | Job |
|-------|-----|
| **ESXi** | Hypervisor on a host |
| **vCenter Server** | API and UI for VMs, templates, folders, permissions |
| **Datacenter / cluster** (vSphere objects) | Inventory; HA / DRS across hosts |
| **Datastore** | VMFS, NFS, vSAN, or vVols on an array |
| **VM** | Guest + VMDKs + NICs on port groups |
| **vMotion / Storage vMotion** | Move running VM / disks (when the fabric allows) |
| **HA** | Restart VMs when a host dies |
| **DRS** | Place / balance VMs |
| **NSX** (when present) | Overlay, distributed firewall, sometimes LB |
| **Supervisor / TKG / Tanzu** | Kubernetes **on** vSphere |
| **VMware Cloud Foundation (VCF)** | Stacked VMware private-cloud product (SDDC manager + vSphere/vSAN/NSX) |

**VMware “cloud”** still means one of: on-prem vSphere, hosted private cloud (you get vCenter), or VMware Cloud on AWS-class SDDC. Identity is vCenter SSO / Entra / LDAP unless you added something else.

Deploying a three-tier app is: **template → clone → guest customization → LB pool** — not `kubectl apply`, unless you added Supervisor.

## 2. Advanced concepts

### Clusters, HA, DRS — what they do not do

HA restarts VMs on another host. It does not make a single-VM database highly available. It needs **shared storage** (or a supported stretched model) and enough spare CPU/RAM. **Admission control** reserves that spare; turning it off to “fit more” means HA cannot restart.

DRS is not anti-affinity unless you write rules. Two app VMs on one host is one failure domain.

vMotion needs compatible CPUs (or EVC), shared storage (for classic vMotion), and a working vMotion network. If vMotion fails during maintenance, you are in a **host outage**, not a live migrate.

### Templates, clones, snapshots

Golden templates + guest customization (SID, hostname, IP) beat snowflake VMs. Linked clones and instant clones exist (VDI). **Snapshots are not backups** — they sit on the same datastore, grow, and will one day fill it ([6](./6_Storage_Backup_And_Restore.md)). Chains of snapshots are a support call.

Content libraries distribute templates/ISOs across vCenters.

### Networking

vSphere Standard Switch vs **Distributed Switch**. Port groups are your VLANs. **NIOC**, teaming, and MTU (9000 for vSAN/vMotion if you said jumbo) must match the physical ToR ([5](./5_Fabric_Cross_Connect_And_OOB.md)).

NSX overlay: you now have two networks to understand. Do not debug DNS in NSX by only looking at the physical switch.

### Storage integration

VMFS on FC/iSCSI, NFS datastores, **vSAN** (HCI), vVols. Multipath (NMP/PSP) is a production setting. Queue depth and path down policies are how a dual-fabric SAN looks like an outage.

vSAN failure domains should be **racks**, not “the default.” Stretch vSAN needs a witness and a latency budget.

### Licensing and ops reality

vSphere is licensed; after Broadcom, SKU bundles and OEM terms changed for many customers. That is a **procurement and support** fact: you still need a supported build and a path to patches. Do not run an orphaned ESXi build because the portal login moved.

vCenter is a **single brain**. Back it up (VAMI / file-based backup). Protect SSO. Do not give the app team `Administrator`. Use roles, folders, tags.

### Kubernetes on this fabric

| Path | Control plane | Nodes |
|------|---------------|-------|
| Supervisor / TKG | VMware-managed or you, depending on SKU | VMs on vSphere |
| OpenShift IPI on vSphere | You + installer | VMs |
| kubeadm on VMs | You (Kubernetes 6) | VMs |
| Vanilla on physical | Kubernetes 7 | The box, not a VM |

CSI talks to vSphere disks (CNS). Load balancers are often NSX, AVI, or hardware. [10](./10_Clusters_On_Prem.md).

### Host lifecycle

Image ESXi from a known ISO/vLCM image, not “next/next” per box. vLCM (vSphere Lifecycle Manager) is how clusters stay at one firmware+driver+ESXi combo. Mixed driver VIBs are a vMotion tax.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Classic three-tier | Template + customization + hardware or NSX/AVI LB |
| Lift to “VMware cloud” | Hosted SDDC or VMC-class — still vSphere API; not AWS IAM |
| Kubernetes without leaving vSphere | Supervisor/TKG **or** OpenShift IPI **or** kubeadm VMs — pick one |
| Maintenance | DRS/vMotion evacuate, patch ESXi, fail a host on purpose in a window |
| DR | SRM / replicated datastores / second vCenter — [12](./12_Sites_DR_Hybrid_And_The_Job.md); not a snapshot |

**Staff checklist**

- vCenter backup tested; SSO not a shared admin  
- HA admission control on; spare capacity real  
- Anti-affinity for the pairs that matter  
- Snapshot policy: age and size limits; backups elsewhere  
- vMotion / storage / ToR MTU consistent  
- vLCM (or equivalent) image, not snowflake hosts  
- CSI/LB story if Kubernetes is in scope  
- License/support path for patches  

**Good:** templates, roles, HA with spare, vCenter backup, vLCM. **Bad:** 200 hand-cloned VMs, snapshots forever, HA off, Administrator for developers, one datastore for everything.

## Go deeper

- [Compute/](./Compute/README.md) · [Jobs/](./Jobs/README.md) · [Storage-Physical/](./Storage-Physical/README.md)  

## References

- [vSphere documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere.html)  
- [VMware Cloud Foundation](https://techdocs.broadcom.com/us/en/vmware-cis/vcf.html)  
- [vSphere Supervisor](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere-supervisor.html)  
- [vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan.html)  
- [NSX](https://techdocs.broadcom.com/us/en/vmware-cis/nsx.html)  
