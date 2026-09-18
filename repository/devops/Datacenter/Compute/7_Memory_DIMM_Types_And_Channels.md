# 7 — Memory: DIMM types and channels

[← Previous](./6_CPU_Interconnect_Ideas.md) · [README](./README.md) · [Next: Population and NUMA →](./8_Memory_Population_And_NUMA.md)

---

## 1. Concepts

Server memory is organized as **DIMMs** on **channels** owned by memory controllers in the CPU/IOD. Getting type and channel count wrong is the fastest way to leave performance on the table—or fail POST.

### Types you will see

| Type | Notes |
|------|-------|
| **DDR4 RDIMM / LRDIMM** | Prior-gen mainstream |
| **DDR5 RDIMM / LRDIMM** | Current mainstream |
| **MCRDIMM / MRDIMM-class** | Higher capacity/bandwidth variants on new platforms |
| **ECC** | Non-negotiable for servers |
| **HBM** | On accelerators/CPUs—not a slot DIMM usually ([Accelerators](../Accelerators/README.md)) |

### Channel literacy

| Idea | Meaning |
|------|---------|
| Channels per CPU | Parallel memory pipes |
| DIMMs per channel | Capacity vs speed trade (platform rules) |
| Rank | Organization affecting timing/capacity |
| Speed (MT/s) | Negotiated downward if mixed/populated heavily |

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Mixed sizes/speeds unsupported | No POST or degraded |
| Non-ECC accidental | Rejected or dangerous |
| Wrong DDR gen in slot | Won’t seat / damage risk |
| Capacity beyond CPU SKU max | Fail or disable |
| Uncorrected ECC storm | Kernel panics / MCA events |

### How it connects

Population rules and NUMA: [8](./8_Memory_Population_And_NUMA.md). BMC reports DIMM health ([10](./10_BMC_IPMI_And_Redfish_Deep.md)). Failure walks: [17](./17_Compute_Failure_Walks.md).

### Global variants

Same JEDEC families worldwide. OEM validated DIMM lists matter for support—stick to **qualified** parts for production fleets.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Max bandwidth | Populate all channels equally per OEM guide |
| Max capacity | Follow LRDIMM/MCR rules; expect speed trade |
| Replace DIMM | Match exact type/speed/size per channel rules |
| Troubleshoot | Reseat; run BMC memory diagnostics |

**Staff checklist**

- DDR gen matches CPU platform  
- ECC qualified DIMMs only  
- Channel count known for SKU  
- Speeds matched in a set  
- Never mix random retail DIMMs into servers  

**Good:** qualified identical sets, full-channel balance. **Bad:** one fat DIMM per CPU; mixed bins; ignoring OEM QVL.

---

## References

- [JEDEC](https://www.jedec.org/) (DDR SDRAM standards)  
- OEM memory population / QVL guides  
- [Intel](https://www.intel.com/) / [AMD](https://www.amd.com/) platform memory specs  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
