# 4 — Containment: hot and cold aisle

[← Previous](./3_Chillers_Towers_And_Free_Cooling.md) · [README](./README.md) · [Next: Raised floor vs slab →](./5_Raised_Floor_Vs_Slab.md)

---

## 1. Concepts

**Containment** physically separates cold supply from hot return so air goes through IT, not around it.

| Type | Idea |
|------|------|
| **Cold-aisle containment (CAC)** | Enclose cold aisle; supply stays cold |
| **Hot-aisle containment (HAC)** | Enclose hot aisle / chimney to return |
| **Chimney / ducted exhaust** | Cabinet exhaust to ceiling plenum |
| **In-row cooling** | Short path; still needs sealing discipline |

### Where it sits

Doors, roofs, blanking, brushes at rack and aisle; sometimes drop-ceiling return plenums. White-space layout owns rack orientation ([White-Space](../White-Space/README.md)).

### Why it exists

Without containment, raising CRAH fan speed mostly increases **bypass and mixing**. With containment, the same tons cool more kW.

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Open containment door propped | Aisle mixing | Inlet spikes |
| Missing blanking / side panels | Recirculation inside rack | Hot U positions |
| Cable brush seal gaps | Bypass | Capacity loss |
| Mixed front-facing racks | Broken aisle scheme | Chronic hot spots |
| Fire/egress conflicts | Doors don’t close or aren’t allowed | Design tension—follow AHJ |

### Ratings / design notes

Containment interacts with fire detection/suppression ([8](./8_Fire_Detection_VESDA.md), [9](./9_Fire_Suppression_Clean_Agent_And_Pre_Action.md)) and lighting/egress. Do not improvise Lexan roofs without facilities approval.

### How it connects

```text
CRAH supply → contained cold → IT → contained hot → return
Liquid RDHX ([6](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)) changes exhaust behavior—containment strategy must match.
```

### Global variants

Same physics worldwide. Some operators standardize HAC for high density; others CAC. Learn the site’s standard before “fixing” a row.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Raise density | Containment before more CRAH tons alone |
| Hot U in rack | Blanking + airflow direction check |
| Remote hands | Require doors closed / photos after work |
| Audit | Walk for propped doors and missing blanking |

**Staff checklist**

- Know CAC vs HAC for the hall  
- Doors self-close; not taped open  
- Blanking on unused U  
- Brush seals at cable openings  
- Never remove a containment panel for “temporary cable” permanently  

**Good:** sealed aisles, closed doors, matched rack facing. **Bad:** containment theater with open roofs and missing blanking.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
