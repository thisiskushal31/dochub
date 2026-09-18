# 10 — Units, voltage, and frequency literacy

[← Previous](./9_Reading_A_One_Line_And_Elevation.md) · [README](./README.md)

---

## 1. Concepts

Skills transfer across metros when units are fluent:

| Quantity | Common units | Notes |
|----------|--------------|-------|
| Power | kW, kVA | IT cares about **kW**; PF links them |
| Cooling | kW, ton | ~3.5 kW/ton literacy—not identity |
| Space | U, rack, sq ft / m² | Elevation vs floor |
| Floor load | psf, kN/m² | Dense GPU gate |
| Electrical | V, A, Hz | 120/208/480 (60 Hz) vs 230/400/415 (50 Hz) |
| Airflow | CFM, m³/h | CRAH talk |
| Optic | dBm | DOM |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Mixing kW and kVA casually | Undersized plant |
| Assuming 208 V whips worldwide | Won’t land |
| Ignoring 50 vs 60 Hz on gear | Import mistakes |
| Nameplate amp sum as truth | Oversubscribe |

### How it connects

Electrical global variants throughout Electrical track; Mechanical tons/ASHRAE; White-Space loading.

### Hyperscale honesty

Public region docs won’t teach you their bus voltages—learn principles; read *your* landlord SKU.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Travel between metros | Re-read nameplates; don’t assume NEMA |
| Capacity meeting | Speak kW + U + ports + XC lead time ([Jobs/8](../Jobs/8_Capacity_Conversation.md)) |
| PO gear | Confirm V/Hz/connector  
| Training | Drill conversions until automatic |

**Staff checklist**

- Site V/Hz known  
- Connector standard known  
- kW vs kVA discipline  
- Never ship 60 Hz-only gear to 50 Hz halls blindly  

**Good:** unit-fluent, site-specific checks. **Bad:** US defaults everywhere; kVA/kW mush.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [IEC](https://www.iec.ch/)  
- [NIST](https://www.nist.gov/) (metrology / SI literacy)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
