# 9 — High-density and AI-ready white space

[← Previous](./8_Crash_Cart_KVM_And_Serial_Aggregation.md) · [README](./README.md) · [Next: Safety →](./10_White_Space_Safety_And_Housekeeping.md)

---

## 1. Concepts

**AI-ready / high-density** white space is not “the same cages with hotter servers.” It is a **coordinated SKU**: power, cooling (often liquid), weight, aisle width, busbars, and operations.

### What changes vs classic 5–8 kW racks

| Domain | Change |
|--------|--------|
| Electrical | 3-phase PDUs, larger whips, busway ([Electrical/14](../Electrical/14_High_Density_48V_HVDC_And_Busbar.md)) |
| Mechanical | RDHX/DTC/CDU, residual air ([Mechanical/6](../Mechanical/6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)) |
| Structural | Higher floor loading ([3](./3_Power_Density_And_Floor_Loading.md)) |
| Layout | Wider service aisles; manifold space; fewer racks per cage sometimes |
| Ops | Leak drills; QD training; different remote-hands SOP |

### Where it sits

Purpose-built rows or zones in a hall; sometimes separate rooms. Colo sells it as a product—ask for the **zone manual**, not only a kW number.

---

## 2. Advanced concepts

### Failure modes unique to density

| Failure | Impact |
|---------|--------|
| Liquid without leak detection | Catastrophic wet event |
| Air-only assumption on DTC rack | Immediate thermal trip |
| Aisle too narrow for service | Unsafe QD/cable work |
| Fabric/optics density ignored | Build stalls on MPO plant |
| Shared non-density PDU math | Breaker trips on bring-up |

### How it connects

```text
Accelerators ([Accelerators](../Accelerators/README.md))
  → rack/cage SKU (this chapter)
  → electrical + mechanical readiness
  → fabric bandwidth + optics
```

Hyperscale AI halls may hide internal designs—use published principles and **your** landlord’s documented zone rules. No invented floor plans.

### Global variants

Liquid adoption varies by metro and operator. “AI-ready” marketing without liquid/power detail is a yellow flag.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Cluster PO | Single checklist across power/cool/weight/liquid/fabric |
| Colo tour | Walk the actual density zone, not a classic row |
| Migration | Don’t drag air-cooled SOP into liquid row |
| Incident | Thermal + leak + power walks together ([Mechanical/11](../Mechanical/11_Mechanical_Failure_Walks.md)) |

**Staff checklist**

- Zone SKU doc in hand before racking  
- CDU ownership and leak response named  
- Service clearance verified  
- Optics/MPO capacity ordered with power  
- Never land a DTC rack on “standard colo” assumptions  

**Good:** matched density product, trained staff, tested leak/power. **Bad:** brochure “AI-ready”; adapters and hope; no manifold space.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Open Compute Project](https://www.opencompute.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
