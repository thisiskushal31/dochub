# 3 — Disk to array to host

[← Previous](./2_NIC_To_MMR.md) · [README](./README.md) · [Next: OOB plane →](./4_OOB_Plane_Walk.md)

## 1. Concepts

End-to-end **storage path** (block example):

```text
Drive/shelf → array controllers (or OSD hosts)
  → FC fabrics A/B  or  Ethernet storage VRF
  → HBA/NIC → multipath → host volume/filesystem
```

NAS/object variants branch at the protocol edge but share independence lessons.

Home: [Storage-Physical](../Storage-Physical/README.md); fabric separation [Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md).

## 2. Advanced concepts

### Independence checkpoints

| Claim | Verify |
|-------|--------|
| Dual fabric | Two switches/fabrics |
| Multipath | Paths across both |
| SDS replicas | Not all in one rack/PDU domain |
| Backup | Not only snaps on same array |

### Failure modes

[Storage-Physical/12](../Storage-Physical/12_Storage_Failure_Walks.md). Latency-sensitive placement: [Storage-Physical/11](../Storage-Physical/11_Latency_For_Etcd_And_Databases.md).

### Global variants

FC vs NVMe-oF mix differs; walk order does not.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design review | Trace one LUN/OSD path both ways |
| Incident | Multipath → fabric → controller before disk RMA |
| etcd/DB | Prefer local NVMe when latency critical |
| DR | Replication ≠ backup on the diagram |

**Staff checklist**

- Path count monitored  
- Storage net isolated or proven  
- Restore owner named  
- Never “shared VLAN is fine” without p99 data  

**Good:** dual path + restore plan. **Bad:** single fabric; snap-only DR.

## References

- [SNIA](https://www.snia.org/)  
- [Storage-Physical/](../Storage-Physical/README.md)  
- [Ceph](https://docs.ceph.com/) / array OEM guides as applicable  
- [NVM Express](https://nvmexpress.org/)  
