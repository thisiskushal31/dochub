# 5 — HBA, HCA, and multipath

[← Previous](./4_SAN_iSCSI_And_NVMe_oF.md) · [README](./README.md) · [Next: Arrays →](./6_Array_Controllers_And_Shelves.md)

---

## 1. Concepts

**HBAs** (FC) and **HCAs** (InfiniBand / some RDMA) are initiator cards. **Multipath** bonds multiple physical paths into one logical device so a cable/switch/array-port loss does not kill the volume.

### Where it sits

PCIe slots ([Compute/13](../Compute/13_NICs_HBAs_And_Slot_Planning.md)); dual cards preferred to dual fabrics/switches; OS multipath daemon or hypervisor PSA/NMP equivalents.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Both HBAs to fabric A | Fake redundancy |
| Incorrect path policy | Failover slow/storm |
| Firmware mismatch | Link flaky |
| ALUA misunderstanding | Wrong optimized path |
| Single HBA SAN boot | Boot SPOF |

### How it connects

```text
HBA0 → Fabric A → Array Ctrl A/B ports
HBA1 → Fabric B → Array Ctrl A/B ports
         ↓
    multipath device
```

InfiniBand HCAs appear in HPC/GPU clusters ([Accelerators](../Accelerators/README.md))—same dual-path thinking.

### Global variants

`multipath-tools`, PowerPath-class, VMware NMP/SATPs—different UIs, same jobs: discover paths, set policy, alert on path loss.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Production LUN | ≥2 paths across ≥2 fabrics/switches |
| Path incident | Identify which path died before reseating both |
| Build standard | Freeze HBA SKU + firmware train |
| Test | Pull one FC/Ethernet path in window; confirm I/O continues |

**Staff checklist**

- Dual physical independence real  
- Path count monitored  
- Policy matches array ALUA  
- Firmware on train ([Compute/11](../Compute/11_Firmware_Trains_And_Secure_Boot.md))  
- Never zone both HBAs identically to one port “temporarily”  

**Good:** dual fabric, healthy multipath, tested pull. **Bad:** four paths on one switch; ignored failed path alarms.

---

## References

- [SNIA](https://www.snia.org/)  
- Linux device-mapper multipath  
- VMware storage/multipathing docs  
- OEM HBA firmware and multipath guides  
