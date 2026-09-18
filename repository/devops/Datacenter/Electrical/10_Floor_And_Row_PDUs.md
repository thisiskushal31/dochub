# 10 — Floor and row PDUs

[← Previous](./9_Busway_Vs_Cable_Distribution.md) · [README](./README.md) · [Next: Rack PDU →](./11_Rack_PDU_A_And_B.md)

---

## 1. Concepts

**Floor PDUs** and **row PDUs** (and **remote power panels / RPPs**) transform and distribute UPS (or LV) power into branch circuits for racks. They sit between building electrical and the whips you see at the cabinet.

### Where it sits

| Device | Typical place |
|--------|----------------|
| Floor PDU | End of row or electrical gallery; often with XFMR |
| Row PDU / busway tap panel | Mid/end of aisle |
| RPP | Panelboard extension closer to load |

Nameplates vary by vendor; the job is: **protected, metered, landable branch power** for IT.

### What they provide

- Step-down (e.g. 480→208 V or MV-derived LV already present)  
- Panelboard breakers for whips  
- Often **metering** per panel or breaker  
- Grounding/bonding landing  
- Sometimes STS or dual-input options  

---

## 2. Advanced concepts

### Redundancy patterns

| Pattern | Meaning |
|---------|---------|
| Dual floor PDUs (A/B) | Feed A and B rack PDUs independently |
| Single PDU dual panels | Easy to fake redundancy—trace upstream |
| Shared XFMR two panels | Common mode failure |

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Main breaker trip | Whole PDU dark | Many racks on that side |
| Branch breaker trip | One whip dark | One rack side |
| XFMR thermal | Alarms; eventual trip | Row capacity loss |
| Miswired neutral/ground | Noise, trips, hazards | Intermittent + safety |
| Meter CT wrong | EPMS lies | Bad capacity decisions |

### How it connects

```text
UPS / busway → floor/row PDU → L6-30 / 32A / IEC whips → rack PDU inlets
```

Connector standards differ by region (NEMA vs IEC). Same job: correct ampacity, locking connectors where required, labeled circuits.

### Capacity and density

Row PDUs are often the **real** kW gate—not the rack PDU sticker. GPU rows fail here first when everyone believes “the busway is fine.”

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Land a new rack | Spare breaker + whip length + A/B availability |
| kW audit | Read PDU metering, not server nameplate sum alone |
| Incident side-A dark | Check floor PDU breaker before blaming PSU |
| Colo | Landlord owns floor PDUs; you own whip discipline and rack PDUs |

**Staff checklist**

- Map rack → breaker → floor PDU → UPS path  
- A/B PDUs not fed from same upstream breaker  
- Breaker labels match cage/rack IDs  
- Spare poles reserved vs “sold out silently”  
- Never land both whips on one PDU “temporarily”  

**Good:** clear A/B floor PDUs, metered, labeled. **Bad:** mystery panels; shared upstream; no spare for growth.

---

## References

- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [IEC](https://www.iec.ch/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
