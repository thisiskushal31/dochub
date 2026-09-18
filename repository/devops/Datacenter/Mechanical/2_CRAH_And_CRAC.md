# 2 — CRAH and CRAC

[← Previous](./1_Heat_Load_And_Airflow_Path.md) · [README](./README.md) · [Next: Chillers →](./3_Chillers_Towers_And_Free_Cooling.md)

---

## 1. Concepts

Computer-room air handlers move and condition air for IT. Two names dominate:

| Unit | Cooling coil source | Typical note |
|------|---------------------|--------------|
| **CRAH** | Chilled water (from plant) | Common in large halls |
| **CRAC** | Direct expansion (DX) refrigerant | Common in smaller / edge / legacy |

Vendors blur labels—ask **what rejects the heat**, not the acronym on the door.

### Where it sits

Perimeter of white space, gallery, or in-row; supply into cold aisle / underfloor; return from hot aisle / ceiling. Controls tie to BMS ([Electrical/15](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md) for overlapping monitoring culture).

### What they do

- Circulate air at the designed CFM  
- Cool (and sometimes reheat/dehumidify/humidify)  
- Filter  
- Alarm on fan, condensate, filter, temperature, water detection  

---

## 2. Advanced concepts

### Setpoints and control

| Topic | Ops meaning |
|-------|-------------|
| **Supply vs return control** | What sensor the unit hunts |
| **Inlet/aisle sensors** | Closer to IT reality than unit return alone |
| **N+1 units** | One can be down for maintenance at design load |
| **Teamwork / group control** | Units share load; fighting units waste energy and can create hot spots |
| **Economizer modes** | See plant free cooling ([3](./3_Chillers_Towers_And_Free_Cooling.md)) |

ASHRAE recommended ranges are envelopes—not a dare to run as hot as possible without OEM and application agreement.

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Fan failure | Loss of CFM | Rapid inlet rise in served zone |
| Coil freeze / low water | Alarms; trip | Capacity loss |
| Clogged filters | High ΔP; low airflow | Same |
| Condensate pump fail | Water risk ([7](./7_Leak_Detection_And_Fluid_Risk.md)) | Shutdown or leak |
| Control sensor fault | Wrong cooling | Overcool or hot spots |
| Dual-cord CRAH on one PDU path | Unit dies on path loss | Zone risk |

### How it connects

```text
Chiller plant → chilled water → CRAH coil → supply air → IT
DX CRAC → outdoor condenser / glycol loop → heat reject
```

Redundancy claims need independent power and water/refrigerant paths—same independence lesson as UPS A/B.

### Global variants

DX vs chilled water mix differs by climate and hall size. Setpoint culture differs by operator; follow site BMS, not a previous employer’s numbers.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Row hot | Which CRAHs serve it; fan status; setpoint; containment |
| Maintenance window | Confirm N+1 before taking a unit out |
| Power event | CRAHs on generator? UPS? ([Electrical](../Electrical/README.md)) |
| Colo cage | You rarely own CRAHs—you own blanking and ticket when inlets climb |

**Staff checklist**

- Map racks → serving CRAH/CRAC units  
- Know N vs N+1 at design load  
- Filter and condensate on rounds  
- Power feed redundancy for mechanical  
- Never block return paths with storage boxes  

**Good:** group control, clean filters, proven N+1. **Bad:** units fighting; unknown serving map; mechanical only on utility.

---

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [ASHRAE](https://www.ashrae.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
