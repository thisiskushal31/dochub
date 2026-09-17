# 6 — Storage, backup, and restore

[← Previous](./5_Fabric_Cross_Connect_And_OOB.md) · [README](./README.md) · [Next: vSphere →](./7_VMware_vSphere.md)

---

## 1. Concepts

On-prem storage is **where bits live when the VM or pod is gone**. Cloud disks hide the array. Here you name it.

| Kind | What it is | Typical use |
|------|------------|-------------|
| **DAS** | Disks in the server | Fast local; dies with the box |
| **NAS** | File (NFS/SMB) | Home dirs, some VM datastores, some CSI |
| **SAN** | Block (Fibre Channel / iSCSI / NVMe-oF) | VM datastores, databases |
| **Software-defined** (Ceph, vSAN, Longhorn, …) | Clustered disks | When you refuse a classic array — you inherited a storage *team* |
| **Object** (on-prem RGW, MinIO, …) | S3-shaped API in the hall | Backups, artifacts; not a POSIX database disk |
| **Tape / vault / other site** | Offline / offsite | When ransomware is in the threat model |

**Snapshots are not backups.** A snapshot on the same array is a convenience. Databases, etcd, and Active Directory need a **restore onto different disks** that you have tested.

Datastores and CSI are consumers of this chapter. vSphere datastores: [7](./7_VMware_vSphere.md). Cluster CSI: [10](./10_Clusters_On_Prem.md). Database engines: [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive).

---

## 2. Advanced concepts

### Performance knobs that actually matter

| Knob | Why |
|------|-----|
| **Latency** | etcd and some DBs die on slow fsync; OpenShift documents etcd disk expectations |
| **IOPS vs throughput** | VDI is IOPS; backups are throughput; GPUs can be both |
| **Queue depth / multipath** | SAN paths; a single HBA is one failure domain |
| **RAID / erasure coding** | Rebuild time is a failure domain — a second disk death during rebuild |
| **Cache / tiering** | Array caches lie if you pull the plug mid-write; know write-back vs write-through |

Do not put etcd or a primary DB on the same spinning SATA pool as backups.

### Failure domains for data

- Disk → node → rack → array controller → site  
- Replication **inside** the hall is not DR. Replication **to the same array** is not a backup.  
- Ceph / vSAN: understand **replication vs erasure**, **failure domain = rack** (or you lose a rack and the cluster).  
- Stretch clusters (metro vSAN, stretch Ceph): witness + latency budget. If RTT is a WAN, it is not a stretch, it is a hope.

### Backup is a pipeline

```text
App-consistent (agent / VSS / pre-freeze hook)
  → backup software
  → landing (other array / other room / object / tape)
  → restore test onto *other* iron
  → retention / immutability
```

VM crash-consistent snapshots are not app-consistent. SQL, Oracle, etcd, Kafka each have a restore story. “We have Veeam” is not a restore test.

**3-2-1** (three copies, two media, one offsite) is still the literacy. Immutability (WORM / object lock) is how you survive ransomware that encrypts the NAS you also backed up to.

### Boot vs data

Hypervisor boot on RAID1 DAS; VMs on SAN/vSAN — common. Kubernetes: OS on small RAID1; PVs on CSI to Ceph/SAN/NFS. Mixing hostPath “because it was fast” is how you lose a node and a dataset together.

### Encryption

At rest: array SED, vSphere VM encryption, LUKS, application. In flight: FC is not encrypted by default; iSCSI/NFS over a flat VLAN is a finding. Key custody: if the keys live only on the same array, you encrypted for compliance theater.

### Brownfield arrays

NetApp, EMC/PowerMax, Pure, HPE, IBM FlashSystem, Hitachi — you will meet them. The durable jobs are the same: LUNs/exports, multipath, snapshots, replication, support contract. Learn **this** array’s restore drill; do not collect logos.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Classic three-tier | SAN or NFS datastore; DB LUNs separate from web VMs |
| Kubernetes on metal | CSI with a **real** backend; etcd on fast dedicated disks |
| Ransomware resistance | Immutable offsite copy; restore test quarterly |
| Cheap lab | DAS + honest “this dies with the box” label |
| GPU training scratch | Local NVMe; checkpoint to object/NAS that will survive the node |

**Staff checklist**

- Where each dataset lives (array, pool, LUN/export, site)  
- Multipath / dual controller / dual ToR for storage NICs  
- etcd / DB disks meet latency, not “whatever datastore”  
- Snapshot ≠ backup; last **restore** date recorded  
- Offsite / immutable copy exists or a signed exception  
- Encryption keys not only on the same array  
- Support contract and spares for the array  

**Good:** documented restore onto other iron, rack-aware SDS, etcd on SSD that is not the backup target. **Bad:** one NAS for VMs + backups + home dirs, snapshots forever, hostPath for prod, stretch L2 “DR.”

---

## References

- [SNIA](https://www.snia.org/)  
- [Ceph documentation](https://docs.ceph.com/)  
- [VMware vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan.html)  
- [NVMe-oF](https://nvmexpress.org/)  
- [OpenShift etcd practices](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/backup_and_restore/control-plane-backup-and-restore)  
- [Kubernetes persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)  
