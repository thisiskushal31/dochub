# 3 — Rooms, campus, and adjacencies

[← Previous](./2_Tiers_Ratings_And_Concurrent_Maintainability.md) · [README](./README.md) · [Next: Cage cabinet →](./4_Cage_Cabinet_Suite_And_Hands.md)

## 1. Concepts

A hall is a set of **rooms with jobs**:

| Room | Job |
|------|-----|
| White space | IT racks |
| Electrical | Utility→UPS→PDU plant |
| Mechanical | Chillers/CRAHs/liquid |
| MMR | Carriers / XC |
| NOC / security | Eyes and access |
| Staging / loading | Intake path |
| Storage / media | Sometimes separate |

Campus adjacencies: dark fiber between buildings, shared plant, meet-me gravity.

## 2. Advanced concepts

### Failure modes

| Mistake | Impact |
|---------|--------|
| Staging as production | Risk |
| MMR far from cage without fiber plan | Cost/latency |
| Shared plant misunderstood as two sites | Fake DR |

### How it connects

Campus vs single [5](./5_Campus_Vs_Single_Building.md). MMR physical [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First walk | Map rooms before touching iron |
| GPU intake | Staging + weight path confirmed |
| DR | True second building/plant |

**Staff checklist**

- Room map known  
- Dock→cage path known  
- Never produce in the loading bay  

**Good:** room-literate ops. **Bad:** white-space-only mental model.

## References

- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- On-ramp [3](../3_Facility_Power_Cooling_And_Rooms.md)  
- [Uptime Institute](https://uptimeinstitute.com/)  
