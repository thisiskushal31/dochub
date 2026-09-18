# 2 — Tiers, ratings, and concurrent maintainability

[← Previous](./1_Site_Types_And_Products.md) · [README](./README.md) · [Next: Rooms →](./3_Rooms_Campus_And_Adjacencies.md)

---

## 1. Concepts

**Uptime Institute Tiers** and **TIA-942 Rated** language describe *site topology ideas*—not magic stickers.

| Idea | Meaning |
|------|---------|
| **N** | No redundancy |
| **N+1** | Spare component |
| **Concurrently maintainable** | Service a path without dropping IT—*if your landing matches* |
| **Fault tolerant** | Survive worst-case single failure (design-specific) |

Honest use: walk the one-line; don’t stop at brochure Tier IV.

---

## 2. Advanced concepts

### Failure modes

| Mistake | Impact |
|---------|--------|
| Marketing Tier without path drawings | False comfort |
| Dual cord on one UPS called 2N | Soft SPOF |
| Ignoring maintainability windows | Surprises |

### How it connects

Electrical independence [Electrical](../Electrical/README.md). Integration one-line [Integration/9](../Integration/9_Reading_A_One_Line_And_Elevation.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| RFP | Ask topology questions + drawings |
| Colo | Match A+B landing to claimed maintainability |
| Audit | Trace first common failure point |

**Staff checklist**

- Labels vs one-line reconciled  
- Your cords match site claim  
- Never buy on sticker alone  

**Good:** concurrent maintainability proven for *your* path. **Bad:** Tier cosplay.

---

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md)  
- On-ramp [3](../3_Facility_Power_Cooling_And_Rooms.md)  
