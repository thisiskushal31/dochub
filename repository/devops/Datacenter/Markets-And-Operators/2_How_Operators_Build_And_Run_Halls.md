# 2 — How operators build and run halls

[← Previous](./1_Operator_Taxonomy.md) · [README](./README.md) · [Next: Research any operator →](./3_Research_Any_Operator.md)

## 1. Concepts

Whether Equinix-class, wholesale, or regional colo, the **lifecycle jobs** rhyme:

1. **Site selection** — power, fiber, flood/seismic, latency to market  
2. **Design** — concurrent maintainability, kW/rack, liquid readiness  
3. **Build** — switchgear, UPS, generators, CRAHs, structure  
4. **Fit-out** — racks, cabling, OOB, MMR  
5. **Commissioning / IST** — integrated tests ([Electrical/18](../Electrical/18_Commissioning_And_IST_Power.md), [Mechanical/12](../Mechanical/12_Commissioning_Mechanical.md))  
6. **Operate** — NOC, remote hands, change windows, capacity sales  
7. **Interconnect product** (if sold) — cross-connects, Fabric/IX vs pure power+space  

Device depth stays in Electrical–Fabric tracks; this chapter is **who does which step**.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Sell capacity before IST complete | Customer is the IST |
| Operate without change calendar | Surprise generator tests as outages |
| Fit-out without OOB | Blind metal  
| Interconnect promised, MMR weak | Product fiction |
| Ignore water/power politics | Stranded campus |

### How it connects

Facility rooms/models: [Facility](../Facility/README.md). Jobs roles: [Jobs](../Jobs/README.md). Wholesale vs retail differences: [5](./5_Wholesale_And_Hyperscale_Landlords.md), [4](./4_Equinix_Class_Interconnection.md).

### Global variants

Permitting, emissions, and water rules differ; lifecycle order does not.

### Hyperscale honesty

Internal campus wiring is mostly secret—use region/AZ literacy, not invented floor plans ([8](./8_Tenant_Cloud_Vs_Landlord.md), [16](./16_Architecture_Shapes_By_Operator_Class.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Diligence on a new site | Ask where they are in lifecycle; request IST abstracts |
| Join as facilities hire | Map your role to a step |
| Colo tenant | You enter at operate/fit-out of *your* cage, not their civil build |
| Wholesale tenant | You may own fit-out—budget it |

**Staff checklist**

- Know lifecycle stage of the hall  
- Maintenance calendar subscribed  
- Interconnect product real or not  
- IST evidence for critical claims  
- Never assume “open” means commissioned  

**Good:** staged delivery, tested plant, clear operate model. **Bad:** pre-IST sales; no change notices; MMR marketing only.

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [ASHRAE](https://www.ashrae.org/) (commissioning / datacom)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Operator construction/operations pages (official, per site)  
