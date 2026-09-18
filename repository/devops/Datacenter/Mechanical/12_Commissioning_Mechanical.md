# 12 — Commissioning mechanical

[← Previous](./11_Mechanical_Failure_Walks.md) · [README](./README.md)

---

## 1. Concepts

**Mechanical commissioning** proves air, water, and liquid systems deliver design temperatures, flows, and redundancy—alone and with electrical sequences ([Electrical/18](../Electrical/18_Commissioning_And_IST_Power.md)).

IST that only “starts the generators” but never proves chillers on generator is incomplete for a hall.

### Lifecycle

```text
Design → install → TAB (test/adjust/balance) → functional Cx → integrated Cx/IST → seasonal + ongoing tests
```

Ops inherits: setpoints, sequences, as-built duct/pipe drawings, alarm lists, water chemistry baselines.

---

## 2. Advanced concepts

### Tests you should recognize

| Test | Intent |
|------|--------|
| Air balance / TAB | CFM and pressures match design |
| Containment verification | Bypass/recirculation within limits |
| CRAH failover | N+1 behavior under load |
| CHW flow / ΔT | Coils get design water |
| Chiller + tower performance | Plant meets design day assumptions |
| Economizer changeover | Modes actually work |
| Leak detection functional | Rope/zones alarm correctly |
| Liquid CDU performance | Secondary loop ΔT/flow at load |
| Integrated power+cooling IST | Utility loss with mechanical on backup power |
| Room integrity (if clean agent) | Hold time for suppression |

### Failure modes of weak Cx

| Gap | Later symptom |
|-----|----------------|
| No loaded thermal test | First heat wave fails |
| Sensors never verified | BMS lies forever |
| Sequences not documented | Operators guess |
| Liquid QD not leak-tested | First maintenance floods |
| Seasonal economizer untested | Winter/summer surprises |

### How it connects

Facility ratings language: [Facility](../Facility/README.md). Build/ops roles: [Markets-And-Operators](../Markets-And-Operators/README.md). Full-building walks: [Integration](../Integration/README.md).

### Global variants

Cx scripts cite owner standards and local codes. Climate makes seasonal testing mandatory in some metros. The jobs—prove airflow, water, failover, alarms, as-builts—are universal.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New hall | Demand mechanical IST evidence with power IST |
| Liquid zone add | Mini-Cx: CDU, leak, residual air, failovers |
| After major setpoint change | Re-verify under load |
| Lease high-density | Ask what was tested for that SKU |

**Staff checklist**

- As-built airflow/pipe drawings available  
- Setpoint list current  
- Failover tests dated  
- Chemistry baselines recorded  
- Never accept “units ran for an hour” as IST  

**Good:** balanced air, proven N+1, integrated power+cooling tests, living sequences. **Bad:** Cx binder closed forever; production is the thermal IST.

---

## References

- [ASHRAE Guideline 0 / commissioning resources](https://www.ashrae.org/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
