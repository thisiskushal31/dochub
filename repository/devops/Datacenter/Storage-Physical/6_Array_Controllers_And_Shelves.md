# 6 — Array controllers and shelves

[← Previous](./5_HBA_HCA_And_Multipath.md) · [README](./README.md) · [Next: SDS →](./7_Software_Defined_Ceph_vSAN_Kin.md)

## 1. Concepts

A classic **disk array** is dual (or more) **controllers** plus **shelves** of drives. Controllers own caches, RAID/erasure, host ports; shelves are just capacity with expanders—until you lose the wrong path.

### Where it sits

Storage racks with serious power/cooling; dual power cords; host ports to FC/Ethernet; backend SAS/NVMe shelves daisy-chained per OEM rules.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single controller mode | Degraded; next fault hurts |
| Shelf daisy-chain break | Many drives dark |
| Cache without battery/destage | Data risk on power loss |
| Non-hot-swap mistake | Outage |
| Mixing drive firmware wildly | Rebuild hell |

### Dual-controller ideas

| Idea | Meaning |
|------|---------|
| Active/active | Both serve (ALUA optimized paths) |
| Active/passive | One serves until failover |
| Non-disruptive upgrade | Controllers rolling—test in window |

### How it connects

Host multipath must match controller pathing ([5](./5_HBA_HCA_And_Multipath.md)). Encryption keys: [10](./10_Encryption_And_Key_Custody.md). Snapshots vs backups: [9](./9_Snapshots_Vs_Backups_Vs_Replication.md).

### Global variants

NetApp/Dell/HPE/Pure/IBM-class products differ; jobs—dual ctrl, shelf discipline, NDUs, spares—transfer.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Size | Controllers for IOPS; shelves for capacity—don’t conflate |
| Maintenance | Confirm partner healthy before takeover |
| Expand | Follow OEM cabling topology exactly |
| RMA drive | Confirm rebuild complete before next pull |

**Staff checklist**

- Dual power + dual host paths  
- Shelf map posted  
- Hot spares policy known  
- Controller failover tested  
- Never break both daisy-chain paths at once  

**Good:** dual-ctrl healthy, documented shelves, tested NDUs. **Bad:** forever degraded mode; mystery expanders; pull two drives in one RAID set blindly.

## References

- [SNIA](https://www.snia.org/)  
- OEM array hardware/installation guides for your model  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series) (storage rack thermal)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish) (where supported)  
