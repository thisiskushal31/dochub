# 1 — Heat load and airflow path

[README](./README.md) · [Next: CRAH and CRAC →](./2_CRAH_And_CRAC.md)

---

## Mental map

![Heat and airflow loop](../../Assets/Datacenter/Mechanical/heat-airflow-loop.svg)

*What to notice: heat is the **byproduct of power**. Cold aisle → inlet → exhaust → return → plant. Bypass and recirculation steal capacity without tripping a breaker. Whole-hall: [0c](../0c_Whole_Hall_Mental_Map.md).*

**Operator experience (verify locally):** The first “mystery throttle” after a cable party is often missing blanking panels—not a bad CPU.

## 1. Concepts

Almost all IT electrical power becomes **heat**. Cooling’s job is to move that heat out of the white space before inlet temperatures force throttling or shutdown.

### Watts → heat (literacy)

| Idea | Ops meaning |
|------|-------------|
| **1 W ≈ 1 J/s of heat** | Nameplate kW is a heat budget, not just a breaker size |
| **IT load vs facility load** | Servers + network + storage; CRAHs/chillers add facility power (PUE) |
| **Sensible heat** | What IT mostly produces (dry heat) |
| **Latent heat** | Humidity changes; humidifiers/dehumidifiers |

### Airflow path (the product)

Cold supply air → server inlet → hot exhaust → return to cooling unit → heat rejected to plant.

| Path piece | Job |
|------------|-----|
| **Supply** | Cold aisle / underfloor / overhead duct |
| **IT gear** | Moves air front-to-back (or designed path) |
| **Return** | Hot aisle / ceiling plenum / chimney |
| **Bypass** | Air that skips IT — wasted capacity |
| **Recirculation** | Hot exhaust mixing into inlets — high inlet temps |

Blanking panels, brush strips, and cable openings decide whether the designed path is real.

### Where it sits

Heat is born in the rack ([White-Space](../White-Space/README.md), [Compute](../Compute/README.md)). Removal gear is CRAH/CRAC ([2](./2_CRAH_And_CRAC.md)), plant ([3](./3_Chillers_Towers_And_Free_Cooling.md)), or liquid ([6](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)).

---

## 2. Advanced concepts

### Ratings language

| Term | Meaning |
|------|---------|
| **kW/rack** | Design heat density |
| **CFM / m³/h** | Airflow volume |
| **ΔT** | Temperature rise across IT (supply vs exhaust) |
| **Inlet temp** | What ASHRAE classes and OEM warranties care about |
| **Tons** (cooling) | Plant capacity language (≈ 3.5 kW per ton) — literacy, not identity |

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Missing blanking | Hot spots, uneven inlets | Throttle / random thermal trips |
| Floor tile leaks / open tiles | Bypass; starving distant racks | Localized overheating |
| Cable dam underfloor | Blocks supply | Same |
| Overstuffed rack vs airflow | Exhaust recirculation | Same even if “kW sold” |
| Containment breach | Aisle mixing | Row-wide inlet rise |

### How it connects

```text
IT watts → rack heat → aisle air (or liquid) → CRAH/CDU → chiller/tower/ambient
Electrical path failure can kill fans/pumps ([Electrical](../Electrical/README.md)) — cooling is not independent of power.
```

### Global variants

Desert dry bulb, tropical humidity, and Nordic free cooling change *how* heat is rejected ([3](./3_Chillers_Towers_And_Free_Cooling.md)). The airflow *job* in the hall stays the same.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First walk of a row | Feel/measure inlets; look for blanking and open tiles |
| GPU rack PO | Heat + airflow/liquid readiness before power SKU alone |
| Mystery throttle | BMC inlet sensors + aisle inspection before CPU RMA |
| Capacity add | ΔT and CFM headroom, not only breaker amps |

**Staff checklist**

- Design kW/rack vs actual draw and cooling type  
- Blanking and brush seals installed  
- Know supply/return direction for the hall  
- Inlet temp policy posted and monitored  
- Never “open a tile for airflow” as a permanent fix  

**Good:** sealed path, measured inlets in range, heat budget matches cooling. **Bad:** Swiss-cheese floor, no blanking, 20 kW in a 5 kW airflow design.

---

## References

- [ASHRAE TC 9.9 thermal guidelines](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
