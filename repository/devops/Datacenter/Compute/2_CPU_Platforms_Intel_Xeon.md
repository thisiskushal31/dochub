# 2 — CPU platforms: Intel Xeon

[← Previous](./1_Server_Form_Factors.md) · [README](./README.md) · [Next: AMD EPYC →](./3_CPU_Platforms_AMD_EPYC.md)

## 1. Concepts

**Intel Xeon** is a major datacenter CPU family. Generations change socket, memory tech, PCIe generation, and core counts—your job is to read **platform constraints**, not memorize every SKU marketing name.

### What to learn per generation (checklist)

| Topic | Why |
|-------|-----|
| Socket / platform name | Board + cooler + spares compatibility |
| Max TDP / cTDP | Power and cooling budget |
| Memory type & channels | DDR4 vs DDR5; population rules |
| PCIe generation & lanes | NIC/GPU/NVMe headroom |
| UPI / interconnect links | Dual-socket behavior ([6](./6_CPU_Interconnect_Ideas.md)) |
| AVX / AMX / accelerators on-die | Workload fit (literacy) |

Exact generation tables churn—use OEM and Intel ark/docs at purchase time; this chapter teaches the **questions**.

### Where it sits

In dual-socket (or single-socket) boards; paired with DIMMs on channels; connected to I/O via root complexes ([5](./5_Chipset_PCIe_And_Platform_IO.md)).

## 2. Advanced concepts

### Failure modes / ops realities

| Issue | Impact |
|-------|--------|
| Mixed steppings / SKUs in one cluster | Performance and feature skew |
| Wrong cooler / airflow for TDP | Thermal throttle |
| Assuming old population rules on new gen | Reduced bandwidth / no boot |
| Ignoring SGX/TDX/feature licensing | Security feature surprise |
| BIOS not generation-matched | Instability |

### Chiplet vs monolithic literacy

Modern Xeons may use multi-die packaging. Treat it like other chiplet CPUs: **NUMA and cache behavior can be less “one big CPU” than marketing implies**—validate with OEM NUMA docs ([8](./8_Memory_Population_And_NUMA.md)).

### How it connects

Hypervisor and OS scheduling care about topology ([18](./18_Hypervisor_On_The_Box_Map.md)). Firmware trains must match CPU microcode ([11](./11_Firmware_Trains_And_Secure_Boot.md)).

### Global variants

Same silicon worldwide; power/thermal envelope still constrained by local hall SKUs. Cloud instance types abstract this; bare metal does not.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fleet buy | Lock generation + SKU list; spare CPUs/heatsinks |
| Perf triage | Check throttle, NUMA, memory config before “CPU slow” |
| Refresh | Don’t mix gens in one HA pair without testing |
| Feature need (AMX etc.) | Confirm SKU + BIOS enablement |

**Staff checklist**

- Platform/socket documented per SKU  
- TDP vs PSU/cooling OK  
- Memory and PCIe gen known  
- Microcode/BIOS train current  
- Never reseat CPUs without ESD and torque procedure  

**Good:** generation-locked fleet, topology documented. **Bad:** random Xeon mix; ignoring TDP; population folklore from prior gen.

## References

- [Intel Xeon product documentation](https://www.intel.com/content/www/us/en/products/details/processors/xeon.html)  
- [Intel Resource & Documentation center](https://www.intel.com/content/www/us/en/support/articles/000005614/processors.html)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- OEM platform guides (Dell/HPE/Lenovo/Supermicro — use current for your SKU)  
