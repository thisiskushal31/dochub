# 5 — MMR and cross-connect physical

[← Previous](./4_Provisioning_Network.md) · [README](./README.md) · [Next: Border →](./6_Border_And_Edge_Roles.md)

## 1. Concepts

The **meet-me room (MMR)** is where carriers, internet exchanges, and customer cages physically interconnect. A **cross-connect** is a cable (fiber/copper) between demarcation points ordered as a product.

### Physical pieces

| Piece | Role |
|-------|------|
| Carrier racks / cages | Provider demarcs |
| Customer patch panels | Your side |
| Cross-connect path | Landlord-installed run |
| LOA/CFA | Authorization paperwork ([Provider-Use](../Provider-Use/README.md)) |

### Where it sits

MMR and interconnect cages—not inside every customer rack. On-ramp: [../5_Fabric_Cross_Connect_And_OOB.md](../5_Fabric_Cross_Connect_And_OOB.md).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single cross-connect | Circuit SPOF |
| Wrong panel / strand | Dark until re-order |
| Untested after install | Silent until cutover |
| Shared risk (same duct) | Correlated cut |
| No labeling | Hours lost |

### How it connects

```text
Your gear → cage panel → (cross-connect) → MMR panel → carrier/IX/cloud on-ramp
```

Ordering jobs are Provider-Use; packet/BGP depth is Networks-Deep-Dive. Equinix-class Fabric is a product on top of physical interconnect literacy.

### Global variants

MMR culture strongest in interconnection colo hubs (Ashburn, Singapore, Frankfurt, …). Enterprise DCs may have carrier EMRs instead—same jobs: dual paths, LOA, test.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dual ISP | Two carriers, diverse MMR paths if possible |
| Cloud on-ramp | Cross-connect to provider cage + logical circuit |
| Audit | Document panel IDs and circuit IDs |
| Incident | Separate physical cut vs logical BGP down |

**Staff checklist**

- Panel/strand IDs recorded  
- Diversity requested and verified  
- Light levels tested at handoff  
- LOA/CFA archived  
- Never run production on a single untested XC  

**Good:** diverse XCs, labeled, tested. **Bad:** single strand; paperwork-only diversity; mystery panels.

## References

- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Equinix / Digital Realty interconnect documentation (official operator docs for your site)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- Provider-Use track (order jobs)  
