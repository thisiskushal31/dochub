# 10 — Accelerator failure and spares

[← Previous](./9_Environmental_Sensors_And_PDU_Meters.md) · [README](./README.md)

---

## 1. Concepts

Accelerators fail differently from CPU DIMMs: **whole trays**, **optics**, **mezzanines**, and **DPU/FPGA bitstreams** dominate sparing—not a loose HBM stick.

### Spares classes

| Class | Examples |
|-------|----------|
| **Whole node/tray** | Fastest MTTR for GPU fleets |
| **GPU/module** (if FRU) | OEM-specific; often not field DIY |
| **Optics / DAC / AOC** | High failure/consumption rate |
| **PSU / fan** | Still common |
| **DPU/FPGA** | Card + approved firmware/bitstream |
| **Console / timing** | Low count, high criticality |

SKU discipline from Compute applies harder here ([Compute/16](../Compute/16_Spares_SKU_Discipline.md)).

---

## 2. Advanced concepts

### Failure walks (accelerator-flavored)

| Symptom | Walk |
|---------|------|
| Job Xid / device lost | Logs → nvidia-smi/rocm-smi equiv → reseat/optics → RMA |
| Node dark | Power path → BMC → then GPU ([Compute/17](../Compute/17_Compute_Failure_Walks.md)) |
| Thermal | Liquid/air → inlet → fans → throttle evidence |
| Link down multi-node | Optic DOM → ToR → interconnect cables ([2](./2_GPU_Interconnect_Ideas.md), [6](./6_Optics_DAC_AOC_Transceivers.md)) |
| DPU silence | DPU console/firmware before host reimage ([3](./3_DPU_And_SmartNIC.md)) |

### Failure modes of bad sparing

| Mistake | Impact |
|---------|--------|
| No tray spare | Days of cluster hole |
| Random optic brands | Compatibility lottery |
| Mixing GPU gens in pool | Scheduler pain |
| Lab consumes prod optics | Stockout mid-incident |

### How it connects

Remote hands need serial/U/photos ([White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md)). Liquid leaks during swaps: [Mechanical/7](../Mechanical/7_Leak_Detection_And_Fluid_Risk.md).

### Global variants

Lead times for GPUs can be extreme—plan capacity + spares early. Cloud burst is a business hedge, not a spare part.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| N-tray cluster | Keep ≥1 cold spare tray + optic kit |
| Colo | Store spares in cage; document Smart Hands SOP |
| RMA | Capture logs/serial before pull |
| Change | Drain workloads; follow QD/liquid procedures |

**Staff checklist**

- Spare BOM per accelerator SKU  
- Optics kit stocked and approved  
- RMA evidence checklist  
- Liquid/electrical LOTO for tray pulls  
- Never cannibalize the last spare silently  

**Good:** tray+optics spares, clear RMA, gen-locked pools. **Bad:** zero spare GPUs; random optics; heroic mid-job reseats without drain.

---

## References

- OEM GPU/DPU RMA and FRU procedures for your platforms  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- Switch/NIC optic compatibility matrices  
