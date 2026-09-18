# 2 — NAS: NFS and SMB

[← Previous](./1_DAS_Local_Disks_And_RAID.md) · [README](./README.md) · [Next: SAN FC →](./3_SAN_Fibre_Channel.md)

## 1. Concepts

**NAS** exports **files** over the network (NFS, SMB/CIFS). Hypervisors use NFS datastores; Kubernetes uses NFS CSI; users use home/project shares.

### Where it sits

Filer heads or SDS gateways in storage racks; dual NICs to storage or general fabric ([Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md)); disks behind controllers or object/SDS.

### Protocol literacy

| Protocol | Common hall use |
|----------|-----------------|
| **NFSv3/v4** | Linux/VMware datastores, CSI |
| **SMB** | Windows, some backup, mixed estates |

Engine internals → [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) not required for path literacy here.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single head / single LIF | Share dark |
| Mount options wrong (sync/async, locking) | Corruption risk |
| Network congestion with storage+prod mixed | Latency storms ([11](./11_Latency_For_Etcd_And_Databases.md)) |
| Snapshot ≠ backup belief | Ransomware pain ([9](./9_Snapshots_Vs_Backups_Vs_Replication.md)) |
| Auth/ID mapping drift | Permission chaos |

### How it connects

```text
Clients → (dedicated VLAN/VRF) → NAS LIFs → controllers → shelves
```

IP storage paths share Ethernet failure domains with [4](./4_SAN_iSCSI_And_NVMe_oF.md) unless separated.

### Global variants

Same protocols; AD/LDAP integration patterns differ by org. Export policy discipline is universal.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| vSphere datastore | NFS on isolated network; multipathing/LIF HA |
| K8s RWX | NFS CSI with clear recovery owner |
| User shares | SMB + AD; backup separate from snap |
| Migrate | Same UID/ACL strategy planned |

**Staff checklist**

- HA LIFs / dual controllers understood  
- Storage network separated or QoS’d  
- Mount options documented  
- Snap + backup policy distinct  
- Never put etcd on high-latency NFS without measuring  

**Good:** HA exports, isolated net, tested restore. **Bad:** single IP filer; snaps as only backup; noisy neighbor VLAN.

## References

- [IETF NFS](https://datatracker.ietf.org/doc/html/rfc7530) (NFSv4 family pointers)  
- [SNIA](https://www.snia.org/)  
- Vendor ONTAP/PowerScale/TrueNAS/etc. docs for your filer  
- [Kubernetes NFS CSI](https://kubernetes-csi.github.io/)  
