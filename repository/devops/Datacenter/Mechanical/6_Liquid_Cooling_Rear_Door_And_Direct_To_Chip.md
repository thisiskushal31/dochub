# 6 — Liquid cooling: rear door and direct-to-chip

[← Previous](./5_Raised_Floor_Vs_Slab.md) · [README](./README.md) · [Next: Leak detection →](./7_Leak_Detection_And_Fluid_Risk.md)

---

## 1. Concepts

When air cannot economically remove rack heat, **liquid** carries heat from the rack or the silicon to a coolant distribution unit (**CDU**) and then to the facility loop.

| Approach | Where liquid goes | Typical use |
|----------|-------------------|-------------|
| **Rear-door heat exchanger (RDHX)** | Door coil replaces most air exhaust heat | Dense air+liquid hybrid |
| **Direct-to-chip (DTC)** | Cold plates on CPU/GPU | Highest density AI/HPC |
| **Immersion** | Servers in dielectric fluid | Specialty deployments |

### Where it sits

| Element | Place |
|---------|--------|
| Cold plates / RDHX | Rack |
| Manifolds / hoses / quick disconnects | Rack and row |
| **CDU** | Row end or gallery; isolates facility water from IT loop |
| Facility CHW / glycol | Plant side of CDU |

Facility water quality is often **not** allowed directly on chips—CDU primary/secondary loops exist for a reason.

---

## 2. Advanced concepts

### Ratings language

| Term | Meaning |
|------|---------|
| **kW/rack liquid fraction** | How much heat leaves via fluid vs residual air |
| **Supply temp / ΔT** | Loop design; warmer water enables free cooling |
| **Flow (LPM / GPM)** | Capacity; low flow → hot silicon |
| **QD (quick disconnect) type** | Compatibility and drip behavior |
| **Wetted materials** | Corrosion chemistry |

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| CDU pump fail | Loop temp rise | Throttle/shutdown |
| Facility side loss | CDU can’t reject | Same |
| Hose/QD leak | Wet rack ([7](./7_Leak_Detection_And_Fluid_Risk.md)) | Damage + trip |
| Air in loop / low coolant | Hot spots | Intermittent thermal |
| Wrong fluid / mix | Corrosion, biological growth | Slow failure |
| Isolation valve closed after work | No flow | Immediate thermal event |

### How it connects

```text
Chip/RDHX → secondary loop → CDU HX → primary facility water → chiller/tower
Residual heat may still need CRAH air ([2](./2_CRAH_And_CRAC.md))
Power density SKUs: [Electrical/14](../Electrical/14_High_Density_48V_HVDC_And_Busbar.md), [Accelerators](../Accelerators/README.md)
```

### Global variants

OEM liquid ecosystems differ (OEM doors vs OCP-style). Colo “liquid ready” must specify **what** is ready: RDHX only, DTC, fluid type, CDU ownership, and who responds to leaks.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| AI cluster intake | Liquid SKU + CDU capacity + leak response before PO |
| Hybrid row | Know residual air load still on CRAHs |
| Maintenance | Drain/isolate procedure; QD training |
| Colo contract | Who owns fluid, sensors, and emergency shutdown |

**Staff checklist**

- Primary vs secondary loop ownership known  
- Leak detection active before energizing dense liquid racks  
- QD training and drip trays in place  
- Residual CRAH capacity documented  
- Never hot-swap hoses without procedure  

**Good:** CDU-isolated loops, trained staff, tested leak response. **Bad:** facility water straight to plates; no leak plan; “air cooling will catch whatever liquid misses.”

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Open Compute Project](https://www.opencompute.org/)  
- [ASHRAE](https://www.ashrae.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
