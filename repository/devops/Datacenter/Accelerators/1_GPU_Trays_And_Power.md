# 1 — GPU trays and power

[README](./README.md) · [Next: GPU interconnect →](./2_GPU_Interconnect_Ideas.md)

## Mental map

![GPU power density](../../Assets/Datacenter/Accelerators/gpu-power-density.svg)

*What to notice: GPUs move the constraint from **U count** to **kW + cooling**. A filled elevation can still be illegal for the row’s power/cooling budget. White-space density: [White-Space/9](../White-Space/9_High_Density_And_AI_Ready_White_Space.md).*

**Operator experience (verify locally):** Training jobs that “just needed one more node” are how rows trip breakers at shift change.

## 1. Concepts

**GPU servers / trays** pack one or many GPUs into a chassis (PCIe cards, SXM/board trays, or OEM multi-GPU systems). They are ordinary servers until you confront **kW, airflow/liquid, weight, and PCIe/baseboard power**.

### What changes vs CPU-only boxes

| Domain | GPU reality |
|--------|-------------|
| Power | Often 5–10× a general host; multi-kW per chassis common |
| Cooling | Air limits hit fast; liquid (RDHX/DTC) often required ([Mechanical/6](../Mechanical/6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)) |
| PSU | High-watt redundant PSUs; dual-cord mandatory |
| Form | 4U / specialized trays; deep cabinets ([Compute/1](../Compute/1_Server_Form_Factors.md)) |
| Floor | Point loads ([White-Space/3](../White-Space/3_Power_Density_And_Floor_Loading.md)) |

### Where it sits

Dense rows / AI-ready zones ([White-Space/9](../White-Space/9_High_Density_And_AI_Ready_White_Space.md)); A+B rack PDUs; often busway feeds ([Electrical/14](../Electrical/14_High_Density_48V_HVDC_And_Busbar.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Undersized PDU/breaker | Trip on training job ramp |
| Both PSUs on one path | Path loss kills node |
| Air cooling in liquid-needed SKU | Immediate throttle/shutdown |
| Simultaneous rack boot | Inrush cascade |
| Ignoring derating (altitude/inlet) | Unstable clocks |

### Ratings literacy

| Term | Meaning |
|------|---------|
| GPU TGP/TDP | Card/tray thermal design power |
| System input kW | What the hall must supply |
| N+N PSU | Redundant supplies; still need A+B landing |
| Power capping | Software/firmware limits for density |

### How it connects

```text
Hall kW + cool + weight approval → GPU SKU BOM → slot/power map → fabric/optics → jobs
```

Interconnect between GPUs: [2](./2_GPU_Interconnect_Ideas.md). Host CPU/NUMA still matters ([Compute/9](../Compute/9_Allocation_Model_Socket_To_DIMM.md)).

### Global variants

Same physics; liquid SKU availability differs by colo metro. Cloud GPU instances hide the tray—bare metal does not.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| PO checklist | Power + cool + weight + liquid + optics in one ticket |
| Bring-up | Stagger power-on; watch PDU meters |
| Thermal event | Inlet + liquid flow before RMA GPU |
| Colo | Order density zone SKU, not “standard cabinet” |

**Staff checklist**

- Measured/expected kW vs leased capacity  
- Dual PSU → dual PDU verified  
- Cooling type matches OEM  
- Floor loading approved  
- Never land GPU tray on hope and C13 whips  

**Good:** matched density product, true A+B, liquid ready. **Bad:** brochure kW; single-path power; air-only for DTC tray.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Open Compute Project](https://www.opencompute.org/)  
- OEM GPU server power/thermal guides (NVIDIA HGX / AMD Instinct OEM platforms — current for your SKU)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
