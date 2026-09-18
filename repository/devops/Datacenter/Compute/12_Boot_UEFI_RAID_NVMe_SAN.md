# 12 — Boot: UEFI, RAID, NVMe, SAN

[← Previous](./11_Firmware_Trains_And_Secure_Boot.md) · [README](./README.md) · [Next: NICs and HBAs →](./13_NICs_HBAs_And_Slot_Planning.md)

## 1. Concepts

**Boot path** is how firmware finds an OS loader. Modern default is **UEFI**; legacy BIOS still appears on brownfield.

### Common boot targets

| Target | Notes |
|--------|-------|
| **Local NVMe / SATA** | Simplest; watch which namespace/drive |
| **Hardware RAID volume** | Boot from virtual disk; battery/cache awareness |
| **HBA + JBOD + mdadm/ZFS** | Software RAID literacy |
| **SAN boot (FC/iSCSI)** | Brownfield; multipath critical ([Storage-Physical](../Storage-Physical/README.md)) |
| **HTTP/PXE / virtual media** | Provisioning ([15](./15_Imaging_And_Provisioning_At_Scale.md)) |

### Where it sits

UEFI boot order in BIOS; Option ROMs for HBA/NIC; OS NVRAM boot entries.

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Wrong boot order after update | Back to installer forever |
| RAID controller cache fail | Perf loss or write risk |
| SAN path down at boot | Stuck waiting |
| NVMe namespace confusion | Boots wrong OS |
| Secure Boot reject | Immediate stop |
| Broken EFI boot entry | Fallback chaos |

### RAID vs NVMe literacy

Many modern fleets prefer **OS on mirrored NVMe** and data on separate devices—fewer proprietary RAID batteries. Hardware RAID remains common; know *your* SKU.

### How it connects

Storage fabrics and multipath: Storage-Physical. NIC PXE/UEFI HTTP boot: Fabric + imaging. Dual-path SAN boot needs dual HBAs planned ([13](./13_NICs_HBAs_And_Slot_Planning.md)).

### Global variants

Same UEFI ideas; SAN boot more common in older enterprise estates than greenfield cloud-style metal.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Greenfield | UEFI + mirrored NVMe OS disk |
| Brownfield SAN | Dual HBA, multipath, documented WWN boot LUN |
| Recover | Virtual media → fix boot entries |
| Clone | Ensure EFI vars and boot order templated |

**Staff checklist**

- Boot order documented per SKU  
- Know OS disk vs data disks  
- SAN boot multipath tested  
- After firmware: confirm boot target  
- Never leave USB installer first in production order  

**Good:** deterministic UEFI path, tested recovery media. **Bad:** mystery RAID packs; single-path SAN boot; installer-first boot order.

## References

- [UEFI Forum](https://uefi.org/)  
- [UEFI HTTP Boot](https://uefi.org/specs) (see current UEFI spec / networking)  
- SNIA / OEM SAN boot guides  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- Linux NVMe / md documentation  
