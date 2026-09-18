# 18 — Commissioning and IST (power)

[← Previous](./17_Power_Path_Failure_Walks.md) · [README](./README.md)

---

## 1. Concepts

**Commissioning** proves the electrical system was installed and operates as designed—component tests through integrated tests. **IST (integrated systems testing)** runs the plant as a whole: utility loss, generator start, UPS behavior, transfers, and often mechanical together.

Skipping IST ships unknown failure modes into production. Paper “Tier” claims without tested sequences are marketing.

### Where it sits in the lifecycle

```text
Design → install → component Cx → subsystem Cx → IST → steady operations → periodic re-tests
```

Ops inherits the artifacts: sequence docs, setpoints, alarm lists, as-built one-lines.

---

## 2. Advanced concepts

### Power tests you should recognize

| Test | Intent |
|------|--------|
| Factory / site acceptance of UPS & gensets | Unit works alone |
| Cable / bus megger & torque | Installation integrity |
| Protection calibration | Breakers trip as coordinated |
| UPS battery discharge | Autonomy real |
| ATS/STS transfer | Timers and sources correct |
| Parallel load share | Gensets behave as a plant |
| Pull-the-plug IST | Utility removed; IT load (or load bank) survives |
| Retransfer | Return to utility clean |

Load banks protect production IT during early tests; production-loaded IST is higher fidelity and higher risk—planned deliberately.

### Failure modes of weak commissioning

| Gap | Later symptom |
|-----|----------------|
| No loaded genset test | First storm fail |
| No retransfer test | Flicker loops forever |
| Alarm points not verified | Silent failures |
| As-builts wrong | Impossible RCA |
| Eco mode enabled post-Cx untested | Surprise transfers |

### How it connects

Mechanical IST belongs with [Mechanical](../Mechanical/README.md). Full building IST narratives land in [Integration](../Integration/README.md) and [Facility](../Facility/README.md). Markets/build chapters explain who pays for Cx on wholesale vs retail colo.

### Global variants

Cx scripts cite local codes and owner standards (Uptime, company playbooks). The jobs—prove start, transfer, runtime, alarms, as-builts—are universal.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New hall / major electrical add | Demand IST evidence before production load-in |
| Lease a dense cage | Ask for test abstracts relevant to your power SKU |
| After major UPS swap | Mini-IST: transfer, runtime, bypass, alarms |
| Annual assurance | Load bank + sequence drill |

**Staff checklist**

- As-built one-lines match field labels  
- Sequence document current after any firmware/timer change  
- Battery and genset test dates inside policy  
- Alarm list verified (not only “pingable”)  
- Never declare done because LEDs are green once  

**Good:** integrated test report, trained operators, living documents. **Bad:** Cx binder shelf-ware; production is the first IST.

---

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [ASHRAE Guideline 0 / commissioning resources](https://www.ashrae.org/)  
- [NFPA 110](https://www.nfpa.org/codes-and-standards/nfpa-110-standard-development/110)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [IEC](https://www.iec.ch/)  
