# 3 — Chillers, towers, and free cooling

[← Previous](./2_CRAH_And_CRAC.md) · [README](./README.md) · [Next: Containment →](./4_Containment_Hot_And_Cold_Aisle.md)

---

## 1. Concepts

The **central plant** rejects heat from CRAHs (and liquid CDUs) to the outdoors.

| Equipment | Job |
|-----------|-----|
| **Chiller** | Produces chilled water (or cools glycol loops) |
| **Cooling tower** | Rejects heat to ambient (evaporative) where used |
| **Dry cooler / adiabatic** | Reject heat with less/no evaporative water |
| **Pumps / headers** | Move water between plant and CRAHs/CDUs |
| **Free cooling / economizer** | Use cold ambient to reduce or skip mechanical cooling |

### Where it sits

Chiller yard/roof/plant room; towers outdoors; pipes to white-space CRAHs. Ops lives in BMS mimics and outdoor walkdowns.

### Free cooling literacy

| Mode | Idea |
|------|------|
| **Air-side economizer** | Bring filtered outdoor air (with humidity control) |
| **Water-side economizer** | Use cold ambient via towers/heat exchangers to chill water without full chiller load |
| **Seasonal / climate-bound** | Nordics ≠ tropics; deserts trade water vs power |

---

## 2. Advanced concepts

### Redundancy patterns

| Pattern | Meaning |
|---------|---------|
| N+1 chillers | One spare at design load |
| 2N plants | Rare/expensive; independent headers |
| Shared tower cell risk | Common mode if not isolated |

Concurrent maintainability means taking a chiller/pump/tower cell out **without** cooking IT—only if remaining capacity and valves allow it.

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Chiller trip | CHW temp rises | CRAHs lose capacity → inlet rise |
| Pump failure | No flow | Same |
| Tower fan / basin issue | High condensing temp | Chiller trip or derate |
| Water treatment failure | Scale/biofouling | Capacity cliff over weeks |
| Valve mis-position after work | Starved rows | Localized heat |
| Free-cooling changeover fault | Unexpected mechanical demand | Efficiency loss or temp excursion |

### How it connects

```text
IT heat → CRAH/CDU → chilled water loop → chiller / economizer → tower/ambient
```

Generator sizing must include plant motors ([Electrical/7](../Electrical/7_Generators_And_Fuel_Systems.md)). A genset that covers IT but not chillers fails the hall slowly then suddenly.

### Global variants

- **Water-scarce metros:** dry coolers, adiabatic, water limits  
- **Cold climates:** long free-cooling seasons  
- **Hot-humid:** dehumidification + tower chemistry stress  
- **Coastal:** corrosion and salt air on outdoor gear  

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Heat wave | Watch CHW supply temp, tower approach, spare chiller status |
| Maintenance | Verify remaining plant capacity before isolation |
| PUE project | Economizer hours are real only if changeover is reliable |
| Colo selection | Ask climate strategy and water risk, not only Tier sticker |

**Staff checklist**

- Design day capacity vs current IT load  
- Which chillers/towers are lead/lag  
- Water treatment vendor cadence  
- Plant on emergency power?  
- Never close isolation valves without tagging and BMS update  

**Good:** tested N+1, clean water chemistry, proven economizer changeover. **Bad:** all chillers at 95% on a mild day; unknown tower chemistry.

---

## References

- [ASHRAE](https://www.ashrae.org/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
