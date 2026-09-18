# 5 — Chipset, PCIe, and platform I/O

[← Previous](./4_CPU_Platforms_ARM_And_Others.md) · [README](./README.md) · [Next: CPU interconnect →](./6_CPU_Interconnect_Ideas.md)

---

## 1. Concepts

The **platform I/O complex** connects CPUs to NICs, GPUs, NVMe, HBAs, and BMC-side devices. In modern servers much of this is **PCIe** rooted in the CPU/IOD rather than a classic southbridge—but people still say “chipset.”

### PCIe literacy

| Term | Meaning |
|------|---------|
| **Generation** (Gen3/4/5/…) | Link speed per lane |
| **Lane count** (x4/x8/x16) | Width |
| **Root complex** | Host side of the tree |
| **Bifurcation** | Splitting a x16 slot into x8x8 etc. |
| **Hotplug** | Where supported (drives more than GPUs often) |

Bandwidth ≈ gen × lanes (minus overhead)—enough to starve a NIC or GPU if under-slotted.

### CXL literacy (ideas)

**CXL** builds on PCIe physical ideas for memory expansion / sharing use cases. Treat as emerging platform capability: confirm OEM support, BIOS, and OS—don’t invent topologies.

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Card in electrically x4 physical x16 | Slow GPU/NIC |
| Bifurcation wrong in BIOS | Drives/NICs missing |
| Shared lanes between NVMe and slot | Surprise capacity loss |
| Insufficient motherboard lanes for ambition | Riser puzzles |
| AER / link errors | Flapping devices, CRCs |

### How it connects

```text
CPU/IOD → PCIe roots → risers/slots → NIC/HBA/GPU/NVMe
                      → sometimes chipset-attached legacy I/O
```

Slot planning: [13](./13_NICs_HBAs_And_Slot_Planning.md). Accelerators eat lanes and power: [Accelerators](../Accelerators/README.md).

### Global variants

Same PCIe gens worldwide. OEM riser options differ—order the riser SKU deliberately.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dual 100G NICs + NVMe | Draw lane map before PO |
| GPU node | x16 Gen matching GPU; cooling/power first |
| “Disk missing” | Check bifurcation and link speed in BMC/OS |
| CXL pilot | OEM reference config only |

**Staff checklist**

- Lane map documented for the SKU  
- BIOS bifurcation matches backplane  
- Gen negotiated as expected (`lspci` / BMC)  
- Don’t exceed slot power limits  
- Never assume physical slot size = electrical width  

**Good:** written I/O map, verified link speeds. **Bad:** surprise x4 links; riser lottery; lane oversubscription.

---

## References

- [PCI-SIG](https://pcisig.com/)  
- [CXL Consortium](https://www.computeexpresslink.org/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- OEM platform PCIe/riser guides  
