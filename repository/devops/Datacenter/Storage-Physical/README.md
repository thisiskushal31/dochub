# Storage-Physical

[← Datacenter](../README.md)

Where bits live when the VM or pod is gone: DAS, NAS, SAN, SDS, object in the hall, paths, multipath, and restore discipline. Survey on-ramp: [../6_Storage_Backup_And_Restore.md](../6_Storage_Backup_And_Restore.md).

### Chapter structure

Concepts → Advanced → Applications → References (official only).

## Chapters

| # | File | Focus | Status |
|---|------|--------|--------|
| 1 | [DAS: local disks and RAID](./1_DAS_Local_Disks_And_RAID.md) | Local disks; RAID vs JBOD for clusters | **filled** |
| 2 | [NAS: NFS and SMB](./2_NAS_NFS_SMB.md) | File storage; datastores; CSI NFS | **filled** |
| 3 | [SAN: Fibre Channel](./3_SAN_Fibre_Channel.md) | FC fabrics; directors vs switches; zoning | **filled** |
| 4 | [SAN: iSCSI and NVMe-oF](./4_SAN_iSCSI_And_NVMe_oF.md) | Ethernet storage paths | **filled** |
| 5 | [HBA, HCA, and multipath](./5_HBA_HCA_And_Multipath.md) | Initiators; multipath; dual fabric | **filled** |
| 6 | [Array controllers and shelves](./6_Array_Controllers_And_Shelves.md) | Controllers; shelves; dual-controller ideas | **filled** |
| 7 | [Software-defined: Ceph, vSAN, and kin](./7_Software_Defined_Ceph_vSAN_Kin.md) | SDS; failure domains = rack | **filled** |
| 8 | [Object on-prem](./8_Object_On_Prem.md) | RGW/MinIO-class; backup landing | **filled** |
| 9 | [Snapshots vs backups vs replication](./9_Snapshots_Vs_Backups_Vs_Replication.md) | Durable copy rules; ransomware literacy | **filled** |
| 10 | [Encryption and key custody](./10_Encryption_And_Key_Custody.md) | SED, array, LUKS; key location | **filled** |
| 11 | [Latency for etcd and databases](./11_Latency_For_Etcd_And_Databases.md) | Disk latency expectations | **filled** |
| 12 | [Storage failure walks](./12_Storage_Failure_Walks.md) | Path down; shelf loss; restore drill | **filled** |

Visual start: [ch1 mental map](./1_DAS_Local_Disks_And_RAID.md) · RAID/bay plates under Assets · whole hall [0c](../0c_Whole_Hall_Mental_Map.md).

## Related

- [Fabric-Physical/](../Fabric-Physical/README.md) · [Compute/](../Compute/README.md) · [Integration/](../Integration/README.md) · Databases-Deep-Dive (engines)  
