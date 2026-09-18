# 10 — White space safety and housekeeping

[← Previous](./9_High_Density_And_AI_Ready_White_Space.md) · [README](./README.md)

## 1. Concepts

Most white-space injuries and many outages come from **mundane physical failure**: trips, dropped chassis, blocked egress, cardboard in aisles, and foreign objects in airflow paths.

### Non-negotiables

| Rule | Why |
|------|-----|
| Clear egress / aisle minimums | Fire and crash-cart access |
| No cardboard/wood in production aisles | Fire load |
| Lift with team / use lifts for heavy gear | Injury + dropped servers |
| ESD discipline where required | Component damage |
| Eye/hand protection for cable/fiber work | Injury |
| Know EPO / exits | [Electrical/13](../Electrical/13_EPO_And_Safety_Disconnects.md), [Mechanical/9](../Mechanical/9_Fire_Suppression_Clean_Agent_And_Pre_Action.md) |

### Where “housekeeping” sits in ops

Daily rounds: trash, tiles seated, doors closed, leak evidence, abandoned packaging, tools left behind.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Boxes in cold aisle | Airflow + trip + fire load |
| Open perforated tiles left out | Ankle injury + airflow |
| Tools on live busway/PDU | Arc/shock risk |
| Food/drink in white space | Contamination + spill |
| Unattended step stools | Trip hazard |
| Fiber shards | Persistent injury risk |

### Foreign object debris (FOD)

Screws, washer, cut zip-tie ends inside chassis or PDUs cause shorts later. Bag and remove hardware; don’t leave “spares” on the chassis lid.

### How it connects

Colo rules often ban cardboard and wood in cages—Smart Hands tickets can reject messy work. Safety culture is part of [Jobs](../Jobs/README.md).

### Global variants

PPE and LOTO details follow local regulation; aisle fire-load rules follow AHJ and landlord. The job—leave the aisle safer than you found it—is universal.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Install day | Staging room for unbox; only iron+tools in aisle |
| End of shift | Walk aisle: doors, blanking, trash, tiles, tools |
| Audit | Photo standards for cage readiness |
| Incident | Don’t create secondary hazards while rushing |

**Staff checklist**

- Aisles clear to site minimum  
- Packaging out before energize  
- Two-person lift rules followed  
- Tiles/doors restored  
- No food/drink; FOD removed  

**Good:** clean sealed aisles, staged unboxing, PPE normal. **Bad:** warehouse-in-the-row; solo deadlift of a GPU server; fiber scraps on the floor.

## References

- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
