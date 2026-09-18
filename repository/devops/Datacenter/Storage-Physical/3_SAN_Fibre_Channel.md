# 3 — SAN: Fibre Channel

[← Previous](./2_NAS_NFS_SMB.md) · [README](./README.md) · [Next: iSCSI and NVMe-oF →](./4_SAN_iSCSI_And_NVMe_oF.md)

## 1. Concepts

**Fibre Channel (FC)** SAN presents **block** devices (LUNs) over a dedicated fabric of HBAs, switches/directors, and array ports. Still common in enterprise halls beside Ethernet storage.

### Fabric pieces

| Piece | Role |
|-------|------|
| **HBA** | Host initiator ([5](./5_HBA_HCA_And_Multipath.md)) |
| **FC switch / director** | Fabric switching; directors = modular high-port |
| **Zoning** | Who may see whom (WWPN) |
| **Array target ports** | Controllers ([6](./6_Array_Controllers_And_Shelves.md)) |
| **ISL** | Switch-to-switch links |

### Where it sits

Often dual independent fabrics (A/B)—same independence idea as power A/B.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single fabric only | Soft SPOF |
| Zoning error | LUN storm / wrong host sees LUN |
| ISL congestion | Latency |
| Soft zoning only without care | Weaker isolation |
| Mixing VSAN/fabric IDs carelessly | Complexity bombs |

### How it connects

```text
Host HBA → patch → FC switch A/B → array ports → LUN → multipath
```

Physical optics/cabling: [White-Space/5](../White-Space/5_Structured_Cabling_Fiber_MPO_MTP.md), [Fabric-Physical](../Fabric-Physical/README.md). Protocols deep elsewhere; zoning is the hall job.

### Global variants

Brocade/Cisco-class fabrics dominate historically; ops jobs (zone, dual fabric, multipath) transfer.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| DB on SAN | Dual HBA, dual fabric, multipath, tested path fail |
| Boot from SAN | Same + documented boot LUN ([Compute/12](../Compute/12_Boot_UEFI_RAID_NVMe_SAN.md)) |
| Change | Zone change is CAB-level |
| Audit | Host↔LUN matrix current |

**Staff checklist**

- Fabric A/B independence verified  
- WWPN inventory accurate  
- Multipath healthy both paths  
- Zoning change tickets with rollback  
- Never “open zone any-any” in prod  

**Good:** dual fabric, tight zones, multipath green. **Bad:** single fabric; sprawling zones; path failover never tested.

## References

- [FCIA / Fibre Channel](https://fibrechannel.org/)  
- [SNIA](https://www.snia.org/)  
- OEM FC switch and array zoning guides  
- Linux device-mapper multipath docs  
