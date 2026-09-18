# 13 — Petabyte capacity thinking

[← Previous](./12_WLAN_And_AP_Lab_Office_Edge.md) · [README](./README.md) · [Next: Role playbooks →](./14_Role_Playbooks_Bring_Up_Week.md)

---

## Mental map

```text
Usable PB  ≠  raw PB
raw disks → protection (RAID/erasure/replicas) → filesystem overhead → usable
         ↘ network bandwidth to fill/rebuild must be planned
```

SDS: [Storage-Physical/7](../Storage-Physical/7_Software_Defined_Ceph_vSAN_Kin.md). Object: [8](../Storage-Physical/8_Object_On_Prem.md).

---

## 1. Concepts

| Question | Why |
|----------|-----|
| Raw vs usable | 3-way replication ≈ 33% usable; erasure codes differ |
| Shelf/rack power & weight | PB is also kW and kg |
| Network | Rebuild traffic can saturate leaves |
| Failure domain | Rack vs host vs disk |
| Durability job | Snapshot ≠ offsite backup |

**Disconfirm:** “We bought 1 PB of drives” does **not** mean 1 PB usable. RAID 6 across a petabyte JBOD without a plan is **not** a platform.

**Confirm:** Name two things besides disks that gate petabyte growth.

---

## 2. Advanced concepts

### Operator experience

Plan rebuild parallelism vs client SLOs. Keep failure domains = racks for SDS. Bandwidth math: filling 1 PB at 10 Gb/s is days—design ingest NICs accordingly. Cooling for dense storage rows is a facilities conversation early.

### Rough literacy math

```text
usable ≈ raw / replication_factor   (replicas)
# or use erasure coding calculator from your SDS docs
rebuild_time ≈ (disk_size / rebuild_throughput) * risk_window
```

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Backup landing | Object + immutable / offsite copy |
| Hot analytics | NVMe tiers + erasure for warm |
| Growth | Add shelves in failure-domain-aware chunks |

**Staff checklist:** usable capacity model; power/cooling signed; network rebuild budget; backup independent of primary.

---

## References

- [Storage-Physical/7](../Storage-Physical/7_Software_Defined_Ceph_vSAN_Kin.md) · [9 Snapshots vs backups](../Storage-Physical/9_Snapshots_Vs_Backups_Vs_Replication.md)  
- SDS vendor capacity planning docs  
