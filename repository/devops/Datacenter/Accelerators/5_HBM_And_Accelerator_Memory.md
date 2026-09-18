# 5 — HBM and accelerator memory

[← Previous](./4_FPGA_And_IPU.md) · [README](./README.md) · [Next: Optics →](./6_Optics_DAC_AOC_Transceivers.md)

---

## 1. Concepts

Accelerators often use **HBM** (High Bandwidth Memory) stacked on-package—not the DDR DIMMs in host slots. Host DRAM and HBM are different pools with different failure and thermal stories.

### Pools compared

| Pool | Where | Typical job |
|------|-------|-------------|
| **Host DDR** | DIMM slots | OS, frameworks, staging |
| **HBM / device memory** | On GPU/accelerator | Model weights, kernels, tensors |
| **CXL / expansion** (emerging) | Platform-dependent | Expansion use cases ([Compute/5](../Compute/5_Chipset_PCIe_And_Platform_IO.md)) |

### Where it sits

On the accelerator package; cooled with the GPU/FPGA thermal solution (air or liquid). Not field-replaceable like a DIMM in most SKUs—**GPU/tray RMA** replaces HBM.

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| HBM ECC / training errors | Job crashes, Xid-class errors (vendor-specific) |
| Thermal of stack | Throttle, unreliability |
| Host OOM while HBM free | Mis-sized pipeline |
| HBM full | Framework OOM; not “add a DIMM” |
| Ignoring PCIe vs HBM bandwidth | Host staging bottleneck |

### How it connects

```text
Storage/network → host DDR → PCIe → HBM → compute
```

NUMA/CPU locality still affects staging performance ([Compute/8](../Compute/8_Memory_Population_And_NUMA.md)). Power/thermal of trays: [1](./1_GPU_Trays_And_Power.md).

### Global variants

Same HBM physics; capacity points differ by GPU generation. Cloud exposes device memory as instance limits—bare metal exposes OEM error logs.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Size models | Fit in HBM or plan model parallel / offload |
| Incident | Read accelerator error logs before reseating DIMMs |
| Cooling design | HBM thermals part of liquid decision |
| Spare strategy | Whole accelerator/tray spare ([10](./10_Accelerator_Failure_And_Spares.md)) |

**Staff checklist**

- Know host vs device memory for the SKU  
- Monitor accelerator memory errors  
- Don’t “add DIMMs” to fix HBM OOM  
- Thermal solution matches TDP including HBM  
- Capture vendor log evidence for RMA  

**Good:** clear memory architecture diagram per SKU. **Bad:** DIMM folklore applied to GPUs; ignoring device ECC; undersized host staging.

---

## References

- [JEDEC](https://www.jedec.org/) (HBM standards family)  
- OEM GPU memory error / Xid (or equivalent) guides for your platform  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- Framework docs for device memory (CUDA/ROCm literacy pointers via vendor)  
