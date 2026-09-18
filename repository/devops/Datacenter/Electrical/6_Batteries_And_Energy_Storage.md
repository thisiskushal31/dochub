# 6 — Batteries and energy storage

[← Previous](./5_UPS_Topologies.md) · [README](./README.md) · [Next: Generators →](./7_Generators_And_Fuel_Systems.md)

---

## 1. Concepts

Energy storage on the UPS **DC link** supplies power until generators start—or until a planned short autonomy ends. Chemistry and maintenance culture decide whether “five minutes” is real.

### Chemistries you will see

| Type | Traits | Ops notes |
|------|--------|-----------|
| **VRLA (AGM/gel)** | Common legacy; sensitive to heat | Shorter life in hot battery rooms |
| **Flooded lead-acid** | Serviceable; vents/hydrogen | Room design and spill control |
| **Li-ion (UPS-class)** | Higher density; BMS-managed | Different fire and BMS procedures |
| **Flywheel** | Seconds of kinetic; rare as sole store | Often paired with fast generators |

### Where it sits

Battery cabinets or rooms adjacent to UPS; bus bars to the DC link; monitoring via UPS and sometimes dedicated BMS. Fire detection/suppression rules differ by chemistry—Mechanical/fire track owns suppression detail; electrical owns the energy job.

### Runtime math (literacy)

Runtime is a **curve**, not a constant:

- Higher kW → shorter minutes  
- End-of-life capacity < nameplate new  
- Temperature and age change available Ah  
- Manufacturer tables beat napkin math for design; ops uses **measured** discharge tests

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Open cell / open string | Reduced capacity; imbalance alarms | Short autonomy |
| Thermal runaway risk (esp. mismanaged Li / abused VRLA) | Heat, smoke risk | Safety event + path loss |
| Charger failure | Batteries deplete over time | Silent until outage |
| Dry VRLA (age) | Sudden capacity cliff | Generator late → outage |
| Loose DC connection | Heat, arcing | Fire/electrical hazard |
| BMS fault (Li-ion) | Contactor open | Immediate loss of autonomy |

### Redundancy language

| Pattern | Meaning |
|---------|---------|
| Dual strings | Survive one string fault (design-dependent) |
| Shared battery plant | Economy vs blast radius—read the design |
| A/B UPS each with own batteries | Preferred for 2N IT |

### How it connects

```text
UPS rectifier → DC bus ← batteries / flywheel
DC bus → inverter → critical AC
```

Generators ([7](./7_Generators_And_Fuel_Systems.md)) must start within autonomy **plus margin**. Autonomy is not a substitute for fuel and transfer testing.

### Global / environmental

Battery room HVAC setpoints matter worldwide. Hot metros (Middle East, India summers, US South) punish VRLA. Li-ion changes footprint and fire strategy—site acceptance is a facilities decision, not a “swap SKU in the rack.”

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Validate autonomy | Scheduled discharge test under controlled load |
| After utility outage | Check depth of discharge; schedule recovery/equalization per OEM |
| Chemistry refresh | Replace end-of-life strings before the next long outage |
| Incident | Compare UPS “battery time remaining” to actual historical tests |

**Staff checklist**

- Chemistry and age of strings known  
- Last discharge test date and result  
- Temp alarms for battery room on EPMS  
- Li-ion: BMS and fire procedure training current  
- Never bridge or jumper around BMS/protection “to get runtime”  

**Good:** tested autonomy > generator start SLA with margin. **Bad:** decade-old VRLA, no discharge history, eco mode + weak batteries.

---

## References

- [IEC 62040](https://webstore.iec.ch/) (UPS / battery interface context)  
- [IEEE](https://www.ieee.org/) (battery maintenance practice families)  
- [NFPA](https://www.nfpa.org/) (stationary storage fire-related standards — use current editions)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
