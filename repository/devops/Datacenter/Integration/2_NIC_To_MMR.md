# 2 — NIC to MMR

[← Previous](./1_Utility_To_DIMM.md) · [README](./README.md) · [Next: Disk path →](./3_Disk_To_Array_To_Host.md)

## 1. Concepts

End-to-end **packet path** through the hall:

```text
NIC (dual-home) → ToR A/B → leaf-spine → border/firewall
  → cage panel → cross-connect → MMR → carrier/IX/cloud on-ramp
```

OOB is a **parallel** plane ([4](./4_OOB_Plane_Walk.md))—not a substitute when data NICs die.

Homes: [Fabric-Physical](../Fabric-Physical/README.md); protocols → [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive); XC jobs → [Provider-Use](../Provider-Use/README.md).

## 2. Advanced concepts

### Independence checkpoints

| Claim | Verify |
|-------|--------|
| Dual NIC | Two ToRs, not one |
| MLAG pair | Peer-link + dual power |
| Diverse XC | Different paths/ducts when required |
| Cloud on-ramp | Physical + logical both up |

### Failure modes

See [6](./6_Failure_Lose_ToR.md), [8](./8_Failure_Lose_MMR_Cross_Connect.md), [Fabric-Physical/12](../Fabric-Physical/12_Fabric_Failure_Walks.md).

### Global variants

Same roles worldwide; MMR richness differs by metro ([Markets](../Markets-And-Operators/README.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hybrid design | Draw NIC→cloud including XC IDs |
| Incident | DOM/LACP before BGP panic |
| Audit | Trace one host’s both uplinks physically |
| Colo | Boundary at panel vs landlord MMR |

**Staff checklist**

- Dual-home real  
- Circuit IDs on the diagram  
- OOB separate  
- Never conflate management SSH path with data plane HA  

**Good:** labeled path to MMR. **Bad:** single XC hope; ToR theater.

## References

- [Fabric-Physical/](../Fabric-Physical/README.md)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [PeeringDB](https://www.peeringdb.com/)  
