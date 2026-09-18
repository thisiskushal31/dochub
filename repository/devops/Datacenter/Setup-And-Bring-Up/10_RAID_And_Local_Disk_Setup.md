# 10 — RAID and local disk setup

[← Previous](./9_Imaging_Path.md) · [README](./README.md) · [Next: Storage network →](./11_Storage_Network_And_Array_Bring_Up.md)

---

## Mental map

![RAID concept](../../Assets/Datacenter/Setup-And-Bring-Up/raid-concept.svg)

![RAID levels board](../../Assets/Datacenter/Storage-Physical/raid-levels-board.svg)

![Disk bay sketch](../../Assets/Datacenter/Storage-Physical/disk-bay-front.svg)

*What to notice: physical trays ≠ the volume the installer sees; pick level before first format.*

Encyclopedia: [Storage-Physical/1](../Storage-Physical/1_DAS_Local_Disks_And_RAID.md).

---

## 1. Concepts

| Choice | Typical use |
|--------|-------------|
| RAID 1 / 10 OS | Node identity disks |
| RAID 5/6 data (legacy) | Single-host capacity |
| JBOD + SDS | Ceph/vSAN data planes |
| HW controller vs mdadm/ZFS | Ops skill + battery/cache policy |

### Setup procedure (hardware RAID literacy)

1. Enter RAID BIOS/UEFI or vendor utility via BMC  
2. Clear foreign configs deliberately (don’t wipe wrong box)  
3. Create virtual disk (level, stripe, write-back vs write-through)  
4. Confirm BBU/flash cache status  
5. Install OS to the virtual disk  
6. Document VD name ↔ serials in DCIM  
7. Set hot-spare / rebuild rate per policy  

**Disconfirm:** RAID is **not** backup. Hardware RAID under Ceph is usually an **anti-pattern**. RAID 0 for “prod data” is **not** clever.

**Confirm:** When do you choose JBOD over RAID 6 for cluster data?

---

## 2. Advanced concepts

### Operator experience

Write-back without battery is a power-loss footgun. Scrub/patrol reads catch silent rot. Label failed trays before pull; follow hot-swap order. For NVMe OS mirrors, know whether RAID is CPU volume mgmt or HBA.

### Failure modes

| Failure | Impact |
|---------|--------|
| Foreign config import wrong | Data loss |
| Rebuild on degraded array under load | Second failure |
| Mixed firmware drives | Unstable VD |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Hypervisor boot | RAID 1 NVMe/SAS |
| Ceph OSD hosts | JBOD, one disk one OSD |
| Petabyte shelf | Prefer SDS/erasure ([13](./13_Petabyte_Capacity_Thinking.md)) |

**Staff checklist:** level chosen; cache policy; hot-spare; DCIM updated; alert on degraded VD.

---

## References

- [Storage-Physical/1](../Storage-Physical/1_DAS_Local_Disks_And_RAID.md)  
- OEM RAID controller guides  
- SVGs: handbook originals in Assets  
