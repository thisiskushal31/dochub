# 7 — Leak detection and fluid risk

[← Previous](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md) · [README](./README.md) · [Next: VESDA →](./8_Fire_Detection_VESDA.md)

## 1. Concepts

Water and coolant next to electronics is normal in halls—and a top physical risk. **Leak detection** finds fluid early; **response** limits damage.

### Fluids in scope

| Source | Fluid |
|--------|-------|
| CRAH condensate | Water |
| Chilled water / glycol pipes | Water/glycol |
| Humidifiers | Water |
| Liquid cooling loops | Water/glycol / specialty coolants |
| Roof / sprinkler / pre-action | Water (when charged or tripped) |
| Immersion | Dielectric fluids |

### Where detection sits

| Method | Place |
|--------|-------|
| Rope / cable sensors | Under raised floor, drip trays, along pipes |
| Spot probes | Under CDUs, CRAC pans |
| Condensate pan switches | In units |
| Camera / rounds | Supplemental, not a substitute |
| BMS alarms | Aggregation and paging |

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Sensor not installed under new liquid rack | First leak is visual/smell |
| Alarm inhibited | Silent flood |
| Rope contaminated / failed | Blind zone |
| Wrong isolation valve | Flood continues while “fixing” |
| Energized gear in standing water | Shock + destruction |
| Glycol vs water response mix-up | Slippery, cleanup, material compatibility |

### Response literacy (jobs)

1. Alarm → locate zone on map  
2. Protect life (electrical safety)  
3. Isolate source if trained/authorized  
4. Power down affected IT per procedure  
5. Contain spread (absorbent, trays)  
6. Ticket facilities + customer/owner  
7. Do not power on wet gear until certified dry/inspected  

Remote hands ([Provider-Use](../Provider-Use/README.md)) often execute customer SOPs—photos and scope limits matter.

### How it connects

Liquid cooling ([6](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)) raises event rate and consequence. Fire pre-action ([9](./9_Fire_Suppression_Clean_Agent_And_Pre_Action.md)) is another water story. EPO/LOTO ([Electrical/13](../Electrical/13_EPO_And_Safety_Disconnects.md)) may apply when isolating.

### Global variants

Monsoon, roof design, and pipe routing differ. Detection physics does not.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Liquid row go-live | Detection + drip trays + trained response before production |
| Raised floor hall | Rope map current; test intervals |
| Incident | Timeline from BMS leak point, not from first dead server |
| Colo | Know who shuts valves vs who shuts servers |

**Staff checklist**

- Leak zones mapped to physical rows  
- Alarms tested periodically  
- Absorbent / drip supplies stocked  
- Isolation authority clear  
- Never step into standing water near PDUs  

**Good:** early detect, fast isolate, dry procedures. **Bad:** inhibited ropes; liquid racks with no tray; power-on while wet.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
