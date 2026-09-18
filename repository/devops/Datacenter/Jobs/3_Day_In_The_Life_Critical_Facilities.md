# 3 — Day in the life: critical facilities

[← Previous](./2_Day_In_The_Life_Colo_Tech.md) · [README](./README.md) · [Next: NOC →](./4_Day_In_The_Life_NOC.md)

---

## 1. Concepts

**Critical facilities** owns the plant: UPS, generators, chillers, sequences, capacity, IST leftovers.

### Typical loop

| Block | Work |
|-------|------|
| Monitoring | EPMS/BMS trends, fuel, CHW |
| Maintenance | LOTO procedures, vendor escort |
| Testing | Transfer tests, load banks |
| Projects | Capacity adds, Cx witnessing |
| Incidents | Lead plant RCA |

Tracks: Electrical + Mechanical deep; Integration power/cooling walks.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Test without IT notice | Perceived outage |
| Inhibits left on | Blind plant |
| Capacity sold past design day | Heat wave fail |
| Skipping retransfer checks | Flicker loops |

### How it connects

Commissioning [Electrical/18](../Electrical/18_Commissioning_And_IST_Power.md), [Mechanical/12](../Mechanical/12_Commissioning_Mechanical.md). Safety [7](./7_Safety_LOTO_And_EPO.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Monthly genset | Scripted test + IT calendar |
| Heat wave | Spare chiller status + water chemistry |
| New liquid row | Cx mini-IST with IT |
| Mentoring | Teach one-line reading ([Integration/9](../Integration/9_Reading_A_One_Line_And_Elevation.md)) |

**Staff checklist**

- Sequence docs current  
- Inhibits cleared after work  
- IT notices sent  
- Never disable auto-start casually  

**Good:** tested plant, communicated windows. **Bad:** tribal transfers; silent inhibits.

---

## References

- [NFPA 110](https://www.nfpa.org/codes-and-standards/nfpa-110-standard-development/110)  
- [ASHRAE](https://www.ashrae.org/)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [Electrical/](../Electrical/README.md) · [Mechanical/](../Mechanical/README.md)  
