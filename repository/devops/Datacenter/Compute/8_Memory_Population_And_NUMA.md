# 8 — Memory population and NUMA

[← Previous](./7_Memory_DIMM_Types_And_Channels.md) · [README](./README.md) · [Next: Allocation model →](./9_Allocation_Model_Socket_To_DIMM.md)

---

## 1. Concepts

**Population rules** say which slots to fill first for a given DIMM count. **NUMA** (Non-Uniform Memory Access) means local memory is faster than remote memory across sockets (and sometimes within chiplet domains).

### Population principles

| Principle | Why |
|-----------|-----|
| Mirror channels across CPUs | Balance bandwidth |
| Follow OEM slot order diagrams | Validated training/timings |
| Prefer identical DIMMs | Avoid lowest-common-denominator surprises |
| Empty slots intentional | Per guide—not “random gaps” |

### NUMA principles

| Idea | Ops meaning |
|------|-------------|
| NUMA node | CPU + its local memory (simplified) |
| Local vs remote access | Latency/bandwidth difference |
| `numactl` / OS policies | Bind memory and CPU |
| Hypervisor nodes | Expose or hide topology to VMs |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| All memory on socket0 | Socket1 always remote |
| Imbalanced channel fill | Lost memory bandwidth |
| NPS/NUMA BIOS mode misunderstood (EPYC) | Unexpected node count |
| VM ballooning across nodes blindly | Perf noise |
| IRQ/NIC on far node | Latency tax |

### How it connects

Interconnect ideas: [6](./6_CPU_Interconnect_Ideas.md). Full mental model: [9](./9_Allocation_Model_Socket_To_DIMM.md). Apps and hypervisors: [18](./18_Hypervisor_On_The_Box_Map.md).

### Observability

- `lscpu`, `numactl -H`, `/sys/devices/system/node/`  
- BMC inventory of DIMM slots  
- Perf counters / vendor tools for remote access rates  

### Global variants

BIOS knobs names differ; the job—balanced fill + locality—does not.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| DB / low-latency | Pin process + memory local; local NIC |
| Throughput farm | Still balance DIMMs; less pinning OK |
| Add memory later | Re-read population guide for new count |
| Perf regression after DIMM add | Check imbalance and speed drop |

**Staff checklist**

- OEM population diagram at the rack/SKU doc  
- `numactl -H` matches expectations after BIOS changes  
- Dual-socket memory symmetric  
- Document BIOS NUMA/NPS mode  
- Never fill “whatever slots are empty” randomly  

**Good:** guide-faithful population, verified NUMA map. **Bad:** lopsided DIMMs; mystery BIOS NUMA mode; apps unbound on dual-socket DB hosts.

---

## References

- OEM memory population guides (mandatory per SKU)  
- Linux NUMA documentation (kernel docs)  
- [Intel](https://www.intel.com/) / [AMD](https://www.amd.com/) topology whitepapers for your gen  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
