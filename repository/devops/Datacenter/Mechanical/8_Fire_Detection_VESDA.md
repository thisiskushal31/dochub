# 8 — Fire detection and VESDA

[← Previous](./7_Leak_Detection_And_Fluid_Risk.md) · [README](./README.md) · [Next: Suppression →](./9_Fire_Suppression_Clean_Agent_And_Pre_Action.md)

---

## 1. Concepts

Fire risk in halls is low-frequency, high-consequence. **Detection** aims to find incipient events (overheated cable, smoldering dust, battery abuse) before flames destroy a row.

**VESDA** (and similar aspirating smoke detection) draws air through pipes to a high-sensitivity detector—early warning compared with spot smoke heads alone.

### Where it sits

| Layer | Place |
|-------|--------|
| Aspirating pipes / ports | Ceiling, containment, sometimes underfloor |
| Spot smoke / heat | Rooms per code |
| Beam detectors | Large volumes |
| Flame detectors | Special hazards (rare in IT white space) |
| FACP (fire alarm control panel) | Fire control room; monitored 24/7 |
| Battery room / UPS special detection | Chemistry-specific |

Detection is not suppression ([9](./9_Fire_Suppression_Clean_Agent_And_Pre_Action.md))—but it often *triggers* suppression logic.

---

## 2. Advanced concepts

### Alarm stages (typical aspirating)

| Stage | Meaning |
|-------|---------|
| Alert / Action | Investigate—possible maintenance or early event |
| Fire 1 / Fire 2 | Escalating; may release suppression after timers/interlocks |

Exact names vary by vendor—learn **this site’s** stages and what auto-happens at each.

### Failure modes

| Failure | Impact |
|---------|--------|
| Clogged sample pipes | Blind detection |
| Fan failure in detector | Trouble alarm—or silent if ignored |
| Construction dust | Nuisance alarms → people disable |
| Containment changes without pipe redesign | Dead zones |
| Unmonitored trouble | System inoperable during real event |

### How it connects

```text
Smoke/particles → detector → FACP → notify → (optional) suppress / EPO / HVAC actions
```

HVAC shutdown on fire alarm is common—expect thermal consequences for IT during fire events even without flame.

### Global variants

Codes (NFPA, local AHJ, EN) differ on device placement and monitoring. Aspirating is widespread in quality halls globally; do not assume every edge closet has VESDA.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First week | Find FACP monitoring path; know alert vs release |
| Hot work / install dust | Coordinate disable/impairments with fire watch |
| Battery chemistry change | Revisit detection design |
| Nuisance alarm | Fix cause; never leave system impaired |

**Staff checklist**

- Impairment procedure known (who, how long, fire watch)  
- Sample ports not taped over  
- Trouble alarms escalate like fire alarms’ cousins  
- After containment build: detection still valid  
- Never ignore “Alert” as noise without walkdown  

**Good:** early aspirating, tested pipes, strict impairment control. **Bad:** disabled detectors for weeks; dust left as normal.

---

## References

- [NFPA 72](https://www.nfpa.org/codes-and-standards/nfpa-72-standard-development/72) (national fire alarm and signaling — US reference)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
- [ISO](https://www.iso.org/) (fire detection related standards families)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
