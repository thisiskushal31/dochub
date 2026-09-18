# 1 — DAS: local disks and RAID

[README](./README.md) · [Next: NAS →](./2_NAS_NFS_SMB.md)

## Mental map

![RAID levels](../../Assets/Datacenter/Storage-Physical/raid-levels-board.svg)

![Disk bays sketch](../../Assets/Datacenter/Storage-Physical/disk-bay-front.svg)

Setup procedures (controller steps, hot-spare, JBOD vs RAID): [Setup-And-Bring-Up/10](../Setup-And-Bring-Up/10_RAID_And_Local_Disk_Setup.md).

## 1. Concepts

**DAS** (direct-attached storage) is disks in or cabled to the server—NVMe, SAS, SATA—owned by that host. Clusters often prefer **JBOD + software** over shared hardware RAID for data planes; OS disks may still use hardware or software mirrors.

### Patterns

| Pattern | Use |
|---------|-----|
| Mirrored NVMe OS | Fast rebuild of the node identity |
| Hardware RAID volume | Legacy / appliance comfort |
| JBOD for Ceph/vSAN/data | Failure domain = disk/host |
| External SAS JBOD shelf | Capacity beside the host |

### Where it sits

Drive bays / NVMe slots; HBA/RAID in PCIe ([Compute/13](../Compute/13_NICs_HBAs_And_Slot_Planning.md)); boot path ([Compute/12](../Compute/12_Boot_UEFI_RAID_NVMe_SAN.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single OS disk | Node rebuild from image |
| RAID battery/cache fail | Write risk / perf drop |
| Silent bit rot without scrub | Corrupt data later |
| Using hardware RAID under Ceph | Dual RAID anti-pattern |
| Hot-swap without procedure | Surprise volume drop |

### How it connects

SDS failure domains: [7](./7_Software_Defined_Ceph_vSAN_Kin.md). Multipath appears when DAS is replaced by SAN ([5](./5_HBA_HCA_And_Multipath.md)).

### Global variants

Same disk physics; OEM backplane quirks differ. Prefer OEM QVL drives for enterprise arrays/servers.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Stateless K8s worker | Small mirrored OS + ephemeral or remote volumes |
| Ceph OSD host | JBOD NVMe/SAS; no hardware RAID on OSDs |
| Appliance VM host | Hardware RAID still common—document cache policy |
| Replace disk | Identify serial via BMC/OS before pull |

**Staff checklist**

- OS vs data disk roles clear  
- No double RAID under SDS  
- Spares match form factor/speed  
- Scrub/patrol scheduled where applicable  
- Never yank a drive mid-rebuild without knowing role  

**Good:** clear OS/data policy, QVL drives, tested rebuild. **Bad:** RAID+Ceph; single OS disk; mystery slots.

## References

- [SNIA](https://www.snia.org/)  
- OEM RAID/HBA guides for your SKU  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- Linux md/NVMe documentation  
