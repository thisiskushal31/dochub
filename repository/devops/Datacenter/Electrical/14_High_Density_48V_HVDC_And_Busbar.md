# 14 — High density, 48V, HVDC, and busbar

[← Previous](./13_EPO_And_Safety_Disconnects.md) · [README](./README.md) · [Next: EPMS →](./15_EPMS_BMS_And_Power_Monitoring.md)

## 1. Concepts

Classic halls distribute **AC** to rack PDUs and server PSUs. Dense AI/GPU and some hyperscale designs add or shift toward:

| Approach | Idea |
|----------|------|
| **High-density AC** | Higher kW/rack via 3-phase PDUs, larger whips, overhead bus |
| **Busbar / busway taps** | Modular overhead distribution ([9](./9_Busway_Vs_Cable_Distribution.md)) |
| **48 V distribution** | Lower-voltage DC to trays/shelves (OCP-class ideas) |
| **HVDC / facility DC** | Higher-voltage DC distribution in specialized plants |

You will meet these as **variants of the same jobs**: ampacity, redundancy, protection, metering, and failure isolation—not as a replacement for learning AC A+B.

### Where it sits

Overhead bus over dense rows; DC plants in dedicated electrical galleries; shelf-level DC-DC in OCP-style racks; still UPS/battery concepts at the plant level (chemistry and conversion stages change).

## 2. Advanced concepts

### Why density forces electrical change

| Pressure | Electrical response |
|----------|---------------------|
| 20–40+ kW/rack | 3-phase PDUs, careful phase balance |
| Cable congestion | Busway / busbar |
| Conversion losses | Fewer AC/DC stages (design-specific)  
| Liquid cooling adjacency | Power and fluid service envelopes interact ([Mechanical](../Mechanical/README.md)) |

### Failure modes (variant-specific)

| Failure | Notes |
|---------|-------|
| Phase imbalance on 3-phase PDU | One leg trips; odd PSU behavior |
| DC bus fault | Different protection gear—trained staff only |
| Busbar tap mis-land | High energy fault risk |
| Mixing AC and DC assumptions | Wrong meter, wrong PPE, wrong LOTO |
| Connector / busbar thermal | Hot spots under continuous GPU load |

### How it connects

Accelerators and GPU trays ([Accelerators](../Accelerators/README.md)) drive many of these designs. Colo landlords may offer “high density zones” with different power SKUs—Provider-Use capacity jobs must ask **voltage, phase, connector, and cooling** together.

### Honesty limits

Hyperscaler internal HVDC/48 V fabrics are often unpublished. Learn principles and what your landlord documents. Do not invent campus DC schematics.

### Global variants

OCP and Open Rack appear more in some operators than others. EU/US connector and voltage norms still apply at the cage edge even when the tray is 48 V inside the rack.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| GPU cluster intake | Confirm kW, voltage, phase, connector, busbar taps, liquid readiness |
| Brownfield upgrade | Do not force 40 kW into 5 kW AC row without plant redesign |
| Incident in dense row | Check phase currents and bus temps, not only OS |
| Colo order | SKU must name electrical + cooling as one product |

**Staff checklist**

- Know if the row is standard AC or special density SKU  
- 3-phase balance monitored  
- Trained before any DC bus work  
- PPE and LOTO match the energy type  
- Never assume C13 whips scale to GPU racks  

**Good:** density zone with matched power+cooling design. **Bad:** adapter pyramids; DC work without procedure; nameplate ignorance.

## References

- [Open Compute Project](https://www.opencompute.org/)  
- [IEC](https://www.iec.ch/)  
- [IEEE](https://www.ieee.org/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
