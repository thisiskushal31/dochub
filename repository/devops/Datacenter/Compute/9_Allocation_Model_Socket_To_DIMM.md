# 9 — Allocation model: socket to DIMM

[← Previous](./8_Memory_Population_And_NUMA.md) · [README](./README.md) · [Next: BMC and Redfish →](./10_BMC_IPMI_And_Redfish_Deep.md)

## 1. Concepts

This is the **mental model** that replaces brand trivia:

```text
Sockets
  → NUMA nodes (≈ socket-local memory domains; chiplet caveats)
    → Cores / threads
      → Caches (L1/L2/L3 — sharing differs by microarchitecture)
    → Memory channels → DIMM slots
  → PCIe root complexes → slots / NVMe / accelerators
```

When something is “slow,” walk this diagram before guessing software.

### Where each layer bites you

| Layer | Classic miss |
|-------|----------------|
| Socket | Cross-socket memory/IRQ |
| Core/thread | Oversubscribe, wrong pinning |
| Cache | False sharing, noisy neighbors |
| Channel/DIMM | Imbalance, failed DIMM |
| PCIe | Under-slotted NIC/GPU |

## 2. Advanced concepts

### Allocation jobs (durable)

| Job | Action |
|-----|--------|
| Size a host | Cores + DRAM bandwidth + PCIe + TDP |
| Place a VIP process | Local node + local NIC |
| Place a VM/pod | Topology-aware scheduler settings |
| Diagnose | Is the bottleneck CPU, memory remote, disk, or net? |

### Failure modes of bad mental models

| Bad model | Result |
|-----------|--------|
| “More GHz fixes all” | Ignores memory/IO |
| “Dual socket = 2×” | Ignores interconnect |
| “DIMM count = capacity only” | Ignores channels |
| “Any slot for the GPU” | Ignores root locality & lanes |

### How it connects

CPU chapters [2](./2_CPU_Platforms_Intel_Xeon.md)–[4](./4_CPU_Platforms_ARM_And_Others.md), memory [7](./7_Memory_DIMM_Types_And_Channels.md)–[8](./8_Memory_Population_And_NUMA.md), I/O [5](./5_Chipset_PCIe_And_Platform_IO.md). Accelerators add HBM and fabric links on top.

### Global variants

Diagram labels change; the walk order does not.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design review | Force the socket→DIMM→PCIe walk on paper |
| Incident | Annotate which layer failed |
| Training | Draw topology of one SKU from `lscpu` + OEM doc |
| Purchasing | Reject SKUs that can’t explain the map |

**Staff checklist**

- One topology one-pager per fleet SKU  
- Team shares the same diagram language  
- Perf tickets require layer hypothesis  
- Don’t jump to app rewrite before locality check  
- Update one-pager on BIOS NUMA mode changes  

**Good:** shared allocation model across bare-metal and virt teams. **Bad:** each engineer owns a different folklore map.

## References

- OEM platform topology guides  
- Linux `lscpu` / NUMA documentation  
- [Intel](https://www.intel.com/) / [AMD](https://www.amd.com/) architecture optimization references (current gen)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
