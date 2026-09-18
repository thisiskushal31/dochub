# 13 — NICs, HBAs, and slot planning

[← Previous](./12_Boot_UEFI_RAID_NVMe_SAN.md) · [README](./README.md) · [Next: Thermal and power →](./14_Thermal_And_Power_Of_The_Box.md)

## 1. Concepts

**Slot planning** decides whether the box can hold the NICs, HBAs, GPUs, and NVMe it needs—*electrically* (lanes/power) and *mechanically* (riser height, cable space).

### Device roles

| Card | Job |
|------|-----|
| **NIC** | Data plane; sometimes storage (iSCSI/NVMe-oF) |
| **HBA / HCA** | FC / InfiniBand / fabric |
| **Boot device** | May be onboard NVMe or add-in |
| **GPU / DPU** | Accelerators ([Accelerators](../Accelerators/README.md)) |

### Dual-home literacy

Production hosts usually want **two NICs** (or dual-port) to two ToRs for fabric redundancy—same independence idea as A+B power.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Both NICs to one ToR | Fake redundancy |
| x16 GPU in bifurcated x8 | Perf cut |
| Slot power exceeded | Instability |
| HBA in wrong root for SAN boot locality | Boot flakiness |
| No spare slot for future | Forklift upgrade |

### Planning worksheet (per SKU)

1. List devices + required lanes/gen  
2. Map to risers/roots ([5](./5_Chipset_PCIe_And_Platform_IO.md))  
3. Check wattage/cooling  
4. Check cable exit / bend  
5. Assign ToR A/B ports in elevation  

### How it connects

Fabric roles: [Fabric-Physical](../Fabric-Physical/README.md). Storage paths: [Storage-Physical](../Storage-Physical/README.md). OOB NIC separate from data NICs ([10](./10_BMC_IPMI_And_Redfish_Deep.md)).

### Global variants

Connector form factors (SFP/QSFP/OSFP) change with speed; planning jobs identical.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard compute | 2×25/100G to leaf A/B + BMC OOB |
| SAN host | Dual HBA to dual fabrics |
| GPU node | Lane/power/cooling first, then NIC leftovers |
| SKU doc | Freeze riser + card BOM |

**Staff checklist**

- Lane/power map signed off  
- Dual-home real on diagrams  
- OOB not piggybacked accidentally  
- Firmware for NIC/HBA on train ([11](./11_Firmware_Trains_And_Secure_Boot.md))  
- Never “just move the GPU up one slot” without map  

**Good:** frozen I/O BOM, true dual-home. **Bad:** both uplinks one switch; surprise no-lanes-left; shared OOB/data.

## References

- [PCI-SIG](https://pcisig.com/)  
- OEM riser and slot power guides  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- NIC vendor documentation (Intel/NVIDIA/Broadcom/etc. for your cards)  
