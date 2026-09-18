# 3 — CPU platforms: AMD EPYC

[← Previous](./2_CPU_Platforms_Intel_Xeon.md) · [README](./README.md) · [Next: ARM and others →](./4_CPU_Platforms_ARM_And_Others.md)

---

## 1. Concepts

**AMD EPYC** is the other major x86 server CPU line. Generations (Rome, Milan, Genoa, Bergamo, Turin-class, …) change core density, memory channels, PCIe gen, and chiplet layout.

### Chiplet literacy (ideas, not trivia)

| Idea | Ops meaning |
|------|-------------|
| **CCD** (core complex dies) | Where cores live |
| **IOD** (I/O die) | Memory controllers, PCIe, Infinity Fabric hub |
| Many cores ≠ uniform latency | Cross-CCD / NUMA placement matters for latency-sensitive apps |

You do not need to recite die maps—you need to **read OEM NUMA and population guides** for that generation.

### Checklist per generation

| Topic | Why |
|-------|-----|
| Socket (SP3/SP5/…) | Spares and board lock |
| DDR4 vs DDR5 channels | Bandwidth and DIMM count |
| PCIe gen & lane count | Dense NIC/GPU/NVMe |
| TDP options | Cooling/PSU |
| Infinity Fabric behavior | Dual-socket and IO locality ([6](./6_CPU_Interconnect_Ideas.md)) |

---

## 2. Advanced concepts

### Failure modes

| Issue | Impact |
|-------|--------|
| Memory not populated for channel balance | Lost bandwidth |
| OS/hypervisor old for new topology | Wrong scheduling |
| 1U thermal limits on high-TDP SKU | Throttle |
| Mixed EPYC gens in one cluster | Feature/perf skew |
| Assuming Xeon population habits | Suboptimal or unsupported configs |

### How it connects

Same allocation model as Intel at the *job* level ([9](./9_Allocation_Model_Socket_To_DIMM.md))—different diagrams. PCIe lane wealth often makes EPYC attractive for NVMe-heavy and multi-NIC hosts ([5](./5_Chipset_PCIe_And_Platform_IO.md)).

### Global variants

Widely available in OEM and bare-metal clouds (OVH, Hetzner-class, etc.). Validate OS certification for your distro/hypervisor.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| High core-count general compute | EPYC SKU + balanced DDR + modern kernel |
| Storage/NVMe density | Check PCIe lane map vs drive count |
| Dual-socket latency app | Measure cross-socket; pin carefully |
| Fleet | Lock gen; document NUMActl defaults |

**Staff checklist**

- Socket/gen locked in SKU doc  
- Population guide followed  
- NUMA topology exported to platform team  
- BIOS IF / NPS settings understood (generation-specific)  
- Never mix DIMM sizes carelessly across channels  

**Good:** balanced channels, topology-aware apps, gen-locked spares. **Bad:** Xeon habits on EPYC boards; ignoring NPS/NUMA settings.

---

## References

- [AMD EPYC documentation](https://www.amd.com/en/products/processors/server/epyc.html)  
- [AMD documentation hub](https://www.amd.com/en/support/documents/documentation-hub.html)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- OEM EPYC platform configuration guides (current for your SKU)  
