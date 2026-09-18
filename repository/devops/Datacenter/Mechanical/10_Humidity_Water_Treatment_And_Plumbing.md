# 10 — Humidity, water treatment, and plumbing

[← Previous](./9_Fire_Suppression_Clean_Agent_And_Pre_Action.md) · [README](./README.md) · [Next: Failure walks →](./11_Mechanical_Failure_Walks.md)

## 1. Concepts

IT cares about **humidity** because electrostatic discharge (too dry) and condensation/corrosion (too wet) both kill hardware. **Water treatment** keeps chillers, towers, and humidifiers from destroying themselves—and then the hall.

### Humidity literacy

| Topic | Ops meaning |
|-------|-------------|
| **RH % / dew point** | Control targets; dew point ties to condensation risk |
| **Humidifier** | Adds moisture (electrode, evaporative, ultrasonic—site-specific) |
| **Dehumidification** | Often via overcool + reheat or dedicated gear |
| **ASHRAE envelopes** | Recommended ranges for IT inlet conditions |

### Water treatment literacy (why IT should know it exists)

| Loop | Risk if neglected |
|------|-------------------|
| Cooling tower | Scale, Legionella risk, capacity loss |
| Chilled water | Corrosion, clogged coils |
| Humidifier feed | Mineral dust (“white dust”) on boards |
| Liquid cooling CDU | Chemistry compatibility with plates/hoses |

### Where plumbing sits

Domestic water to humidifiers; makeup to towers; drains from condensate; rarely, process water for specialty systems. Drains and shutoffs are incident tools ([7](./7_Leak_Detection_And_Fluid_Risk.md)).

## 2. Advanced concepts

### Failure modes

| Failure | IT symptom |
|---------|------------|
| RH too low | ESD events, mysterious component deaths |
| RH too high / cold surfaces | Condensation on coils/doors → drips |
| Humidifier malfunction | Flood or mineral contamination |
| Tower chemistry fail | Plant capacity loss in heat wave |
| Clogged condensate drain | Pan overflow into white space |
| Glycol concentration wrong | Freeze risk / poor HX performance |

### How it connects

```text
BMS humidity sensors → humidifier/CRAH modes → inlet air condition → ESD/condensation risk
Tower chemistry → chiller efficiency → CRAH capacity → inlet temps
```

Liquid cooling chemistry is part of [6](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)—do not mix “any water is fine.”

### Global variants

Desert sites fight dryness; tropics fight moisture; cold climates fight condensation when outdoor air economizers are used. Same jobs: measure, control, treat water, drain correctly.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| ESD cluster of failures | Check RH history before blaming OEM batch |
| White dust on motherboards | Humidifier type/maintenance review |
| Heat wave + rising approach | Ask water treatment status, not only IT load |
| New liquid loop | Fluid spec + monitoring before fill |

**Staff checklist**

- Know RH/dewpoint targets for the hall  
- Condensate drains clear on rounds  
- Water treatment vendor on schedule  
- Shutoff locations for humidifier water  
- Never bypass water treatment “for a week” silently  

**Good:** stable RH in envelope, clean towers, documented fluid chemistry. **Bad:** humidifier floods; desert ESD season ignored; tower basin science fiction.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [ASHRAE](https://www.ashrae.org/)  
- [CDC Legionella resources](https://www.cdc.gov/legionella/) (tower water health context)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
