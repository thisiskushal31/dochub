# 12 — Storage failure walks

[← Previous](./11_Latency_For_Etcd_And_Databases.md) · [README](./README.md)

## 1. Concepts

Walk storage incidents from **path → fabric → controller/OSD → media → restore**. Pair with compute and fabric walks.

## 2. Advanced concepts

### Walk library

| Failure | Expected good | Classic bad |
|---------|---------------|-------------|
| **One FC/iSCSI path down** | Multipath continues | Single path unnoticed |
| **Fabric A dark** | Fabric B carries | Both HBAs on A |
| **Controller failover** | Brief blip; I/O OK | Stuck degraded forever |
| **Shelf path loss** | Redundant backend | Daisy-chain SPOF |
| **Disk fail** | Rebuild; spare kicks in | Delayed spare; second fail |
| **OSD/host loss** | Cluster rebalances | Full rack of replicas lost |
| **NAS LIF fail** | Partner LIF serves | Single IP clients |
| **Ransomware** | Immutable backup restore | Snap-only on same box |
| **Key lost** | Escrow recovery | Permanent wipe |
| **Restore untested** | — | Fiction RTO |

### Independence checklist

- Dual path ≠ dual fabric  
- Replication ≠ backup  
- Snapshot ≠ offsite  

### How it connects

Fabric walks: [Fabric-Physical/12](../Fabric-Physical/12_Fabric_Failure_Walks.md). Power loss during write: Electrical + controller cache policy. Roles: [Jobs](../Jobs/README.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Tabletop | Pull path A; lose one shelf path; restore file from backup |
| On-call | Order: multipath → switch/zone → array → disk |
| DR | Timed restore drill quarterly |
| RCA | Include rebuild storms as first-class events |

**Staff checklist**

- Multipath alerts on  
- Known restore owner  
- Spares on site  
- Diagram of fabrics current  
- Never skip restore evidence in RCA  

**Good:** tested path pulls + restore drills. **Bad:** first restore is the disaster; ignored failed path.

## References

- [SNIA](https://www.snia.org/)  
- [Ceph operations](https://docs.ceph.com/)  
- OEM array troubleshooting guides  
- [etcd](https://etcd.io/docs/) / DB runbooks as applicable  
