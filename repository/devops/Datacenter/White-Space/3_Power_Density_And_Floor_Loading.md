# 3 — Power density and floor loading

[← Previous](./2_Cabinet_Airflow_And_Chimneys.md) · [README](./README.md) · [Next: Copper cabling →](./4_Structured_Cabling_Copper.md)

---

## 1. Concepts

**Power density** (kW per rack / per sq ft) and **floor loading** (psf or kN/m²) are the two physical budgets that kill GPU dreams.

### Power density

| Term | Meaning |
|------|---------|
| **Nameplate kW** | Sum of PSU ratings (often overstated vs draw) |
| **Expected / measured kW** | What EPMS and rack PDUs show |
| **Design kW/rack** | What cooling + electrical were built for |
| **A+B capacity** | Each path must carry the plan (failover math) |

Electrical landing: [Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md), [Electrical/14](../Electrical/14_High_Density_48V_HVDC_And_Busbar.md). Cooling: [Mechanical](../Mechanical/README.md).

### Floor loading

| Load source | Note |
|-------------|------|
| Cabinets + servers | Static load |
| Liquid doors / manifolds | Extra concentrated load |
| People + crash carts | Live load during work |
| Seismic bracing | Adds hardware and load paths |

### Where limits live

Lease docs, site manuals, structural drawings, and colo order forms—not Slack folklore.

---

## 2. Advanced concepts

### Failure modes

| Failure | Result |
|---------|--------|
| Sold 5 kW cooling with 15 kW draw | Thermal throttle / trip |
| Both PSUs on one path sized for half | Path loss → outage |
| Overweight rack on raised floor | Tile/pedestal failure |
| Seismic kit omitted where required | Code/safety fail; gear movement |
| Ignoring inrush / simultaneous boot | Breaker trips on paper-OK steady state |

### How it connects

```text
PO of dense gear → check kW + voltage/phase + cooling type + floor loading + aisle width
                 → then order power and schedule remote hands
```

### Global variants

Seismic zones (Japan, California, NZ, etc.) change bracing requirements. Units: learn both psf and metric. Skills transfer; stamped limits are local.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| AI rack intake | One checklist: power, cool, weight, liquid, fabric |
| Capacity conversation | Measured kW trends, not nameplate fantasy |
| Raised-floor site | Point loads vs tile rating |
| Audit | Spot-check PDU amps vs leased kW |

**Staff checklist**

- Design kW vs measured draw  
- Floor loading approval for dense SKUs  
- A/B failover amps considered  
- Seismic requirements known  
- Never “temporary” overload a circuit for a cluster bring-up  

**Good:** matched electrical+mechanical+structural budgets. **Bad:** nameplate packing; overweight liquid door on light tile; hope-based density.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [Open Compute Project](https://www.opencompute.org/)  
