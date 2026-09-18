# 8 — Server setup playbook

[← Previous](./7_OOB_BMC_Plane_Bring_Up.md) · [README](./README.md) · [Next: Imaging →](./9_Imaging_Path.md)

## Mental map

```text
Rails seated → PSU A→PDU A, PSU B→PDU B
  → NIC0→ToR-A, NIC1→ToR-B (prod)
  → BMC→OOB switch
  → firmware train (BIOS/BMC/NIC/RAID)
  → boot order set → ready to image
```

![Rack / servers](../../Assets/Datacenter/Compute/rack-server-front.jpg)

*What to notice: dense 19″ iron, front serviceability—confirm your SKU’s PSU and NIC layout on the rear. Plate: Wikimedia Foundation servers photo used as hall context (review vs your OEM).*

## 1. Concepts

| Step | Detail |
|------|--------|
| Power | Dual cord to diverse PDUs |
| Data NICs | Dual-home ToR pair |
| BMC | OOB only; unique password |
| Firmware | One train per SKU ([Compute/11](../Compute/11_Firmware_Trains_And_Secure_Boot.md)) |
| Boot | UEFI; OS disk vs SAN boot clarity ([Compute/12](../Compute/12_Boot_UEFI_RAID_NVMe_SAN.md)) |
| Inventory | Serial, MAC, BMC MAC into DCIM |

**Disconfirm:** Both PSUs in one PDU is **not** redundant. Firmware “latest on the internet” is **not** a train.

**Confirm:** List the four cables you expect on a dual-homed dual-PSU box (min).

## 2. Advanced concepts

### Operator experience

Photograph rear after dress. Match NIC PCIe bifurcation to OEM guide. Don’t image until BMC reachable and firmware baseline applied—otherwise you chase ghosts.

### Failure modes

| Failure | Symptom |
|---------|---------|
| NUMA/NIC imbalance | Perf tickets later |
| Secure Boot mismatch | Install fails |
| Wrong boot device | Loops PXE forever |

## 3. Applications

**Staff checklist:** DCIM complete; BMC ping; A/B power LED; link on both NICs; firmware baseline; hand off to imaging ([9](./9_Imaging_Path.md)).

## References

- [Compute/1 Form factors](../Compute/1_Server_Form_Factors.md) · [13 NICs](../Compute/13_NICs_HBAs_And_Slot_Planning.md)  
- OEM hardware install guides  
