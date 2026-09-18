# 9 — Bandwidth and cross-connect lifecycle

[← Previous](./8_Dedicated_Metal_Intake.md) · [README](./README.md) · [Next: Exit →](./10_Exit_Relocation_And_Decommission.md)

## 1. Concepts

Interconnect is not fire-and-forget. Manage **lead times**, **diversity**, **tests**, **LOA renewals**, **bandwidth changes**, and **decommission**.

| Lifecycle stage | Jobs |
|-----------------|------|
| Order | [3](./3_Order_Interconnect.md) |
| Install / test | Light levels, failover |
| Operate | Monitor, capacity |
| Change | Speed upgrade, move panel |
| Renew | LOA/contracts |
| Exit | Remove XC, update diagrams |

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Forgotten LOA expiry | Unexpected disconnect risk |
| No diversity revisit after move | Quiet SPOF |
| Bandwidth surprise bill | Commercial pain |
| Stale circuit inventory | Wrong RCA |
| Cancel without dependency check | App outage |

### How it connects

Portal inventory [6](./6_Customer_Portal_Patterns.md). Fabric physical [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md). Cloud on-ramp couples logical+physical ([7](./7_Land_Cloud_On_Ramp.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Quarterly | Circuit audit vs portal vs diagrams |
| Growth | Order second path before saturating first |
| Metro move | Parallel XC → cutover → cancel old |
| Incident | Circuit ID timeline with provider NOC |

**Staff checklist**

- Circuit DB current  
- Renewals calendared  
- Diversity re-validated after changes  
- Cancel checklist includes apps  
- Never leave “temporary” XC undocumented  

**Good:** living circuit inventory, calendared renewals. **Bad:** spreadsheet from install day; surprise LOA; orphan XCs.

## References

- Official operator XC/Fabric lifecycle docs  
- [Equinix docs](https://docs.equinix.com/)  
- [PeeringDB](https://www.peeringdb.com/)  
- Cloud Direct Connect / ExpressRoute / Interconnect lifecycle docs  
