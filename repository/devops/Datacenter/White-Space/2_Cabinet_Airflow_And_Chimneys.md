# 2 — Cabinet airflow and chimneys

[← Previous](./1_Rack_Standards_And_Form_Factors.md) · [README](./README.md) · [Next: Power density →](./3_Power_Density_And_Floor_Loading.md)

## 1. Concepts

A cabinet is part of the **air machine**. Door perforation, blanking, side seals, and optional **chimneys** (ducted exhaust) decide whether cold air reaches inlets and hot air returns cleanly.

### Airflow pieces at the rack

| Piece | Job |
|-------|-----|
| Front door perforation | Admit cold aisle air |
| Blanking panels | Block empty U recirculation |
| Side panels / seals | Stop bypass around chassis |
| Rear door / RDHX | Exhaust path or liquid heat removal |
| **Chimney / ducted exhaust** | Couples hot exhaust to ceiling return |
| Brush strips | Cable openings without open holes |

### Where it sits

Fits the hall’s cold/hot aisle or containment scheme ([Mechanical/4](../Mechanical/4_Containment_Hot_And_Cold_Aisle.md)). Wrong door type in a contained aisle breaks the design.

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Solid door on supply face | Starved inlets |
| No blanking | Hot U spots mid-rack |
| Chimney disconnected | Hot air dumps into aisle |
| Overfilled cable openings | Recirculation + mess |
| Front-to-back gear mixed with side-intake appliances | Local hot spots |
| Rear-door HX offline | Sudden air load spike on CRAHs |

### How it connects

Liquid rear doors ([Mechanical/6](../Mechanical/6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)) change exhaust behavior—chimney strategy must match. High-density rows ([9](./9_High_Density_And_AI_Ready_White_Space.md)) often mandate specific door/chimney SKUs.

### Ratings literacy

Door free-area / perforation % is a real spec. “Looks perforated” ≠ enough CFM for a 20 kW stack.

### Global variants

Same physics. Some landlords lock cabinet door SKUs in the colo manual—deviating voids airflow assumptions.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Install server | Blank unused U before leaving the aisle |
| Thermal ticket | Check blanking and door seating before CRAH blame |
| Containment row | Confirm chimney coupling if HAC |
| Remote hands | “Re-seat chimney; close doors; photo” |

**Staff checklist**

- Door type matches aisle role  
- Blanking on all open U  
- Chimney seated if required  
- Side panels on  
- Never leave rear door open for “temporary cables”  

**Good:** sealed rack path matching hall containment. **Bad:** missing blanking, open chimney gap, solid front door on cold aisle.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [Open Compute Project](https://www.opencompute.org/)  
