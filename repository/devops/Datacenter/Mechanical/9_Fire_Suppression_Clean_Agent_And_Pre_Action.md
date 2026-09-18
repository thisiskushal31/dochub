# 9 — Fire suppression: clean agent and pre-action

[← Previous](./8_Fire_Detection_VESDA.md) · [README](./README.md) · [Next: Humidity and water →](./10_Humidity_Water_Treatment_And_Plumbing.md)

---

## 1. Concepts

**Suppression** removes heat, oxygen, or chemical reaction—or applies water in a controlled way. IT halls prefer strategies that limit collateral water damage.

| Strategy | Idea | IT note |
|----------|------|---------|
| **Clean agent** (e.g. FK-5-1-12 / “Novec”-class, other listed agents) | Gaseous total flooding | Room integrity matters |
| **Inert gas** (IG-541 etc.) | Oxygen reduction | Pressure venting design |
| **Pre-action sprinkler** | Pipe dry until detection + release logic | Water only if both conditions met |
| **Wet pipe** | Water always in pipe | Higher accidental discharge risk—often avoided in white space |
| **Portable extinguishers** | Class C / clean agent cans | Trained use; not a plant substitute |

Brand names change; use **listed agent + design concentration** language.

### Where it sits

Agent cylinders in a dedicated room; nozzles in white space; pre-action valves in fire riser rooms; abort switches where provided; integration to FACP.

---

## 2. Advanced concepts

### Room integrity

Clean agent designs need doors closed, dampers shut, and leakage within tested limits. Propped containment doors and open cable holes can fail a discharge hold time.

### Failure modes

| Failure | Impact |
|---------|--------|
| Accidental discharge | Expensive; breathing/egress procedures; downtime |
| Failed discharge (empty, closed valve) | Fire continues |
| Pre-action unintended fill | Water risk near IT |
| Abort misuse | Delay needed release—or false sense of control |
| HVAC not shut down as designed | Agent loss / smoke spread |
| People in room at discharge | Life safety event—egress training required |

### How it connects

Detection ([8](./8_Fire_Detection_VESDA.md)) arms logic. EPO ([Electrical/13](../Electrical/13_EPO_And_Safety_Disconnects.md)) may or may not trip—**site-specific**. Water from sprinklers is a leak event ([7](./7_Leak_Detection_And_Fluid_Risk.md)).

### Global variants

Agent approvals, environmental rules, and AHJ preferences differ. Some regions restrict certain legacy agents. Always follow current site documentation—not a 2012 training memory.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New hire | Egress + abort + what discharge means for IT power |
| Door propped culture | Breaks agent integrity—fix operationally |
| After construction | Integrity test if envelope changed |
| Vendor work | Hot work permits + impairment + fire watch |

**Staff checklist**

- Know suppression type for your hall  
- Egress routes clear  
- Cylinder pressures / inspection tags in date (facilities)  
- Impairments controlled  
- Never use EPO/suppress as a joke or power cycle  

**Good:** maintained agent system or pre-action, drilled egress, integrity kept. **Bad:** wet pipe over servers without need; chronic door props; unknown abort behavior.

---

## References

- [NFPA 2001](https://www.nfpa.org/codes-and-standards/nfpa-2001-standard-development/2001) (clean agent systems)  
- [NFPA 13](https://www.nfpa.org/codes-and-standards/nfpa-13-standard-development/13) (sprinkler systems)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
- [ISO](https://www.iso.org/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
