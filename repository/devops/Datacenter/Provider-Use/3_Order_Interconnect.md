# 3 — Order interconnect

[← Previous](./2_Contract_Capacity.md) · [README](./README.md) · [Next: Access →](./4_Access_Badges_And_Change_Windows.md)

---

## 1. Concepts

**Interconnect** orders create physical (and sometimes virtual) connectivity:

| Orderable | Job |
|-----------|-----|
| **Cross-connect (XC)** | Cable between panels |
| **LOA/CFA** | Letter of authorization / connect facility assignment |
| **Metro connect** | Between buildings/metros on operator network |
| **Fabric / IX / cloud on-ramp** | Productized interconnect ([7](./7_Land_Cloud_On_Ramp.md)) |

Physical MMR: [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md). Lifecycle: [9](./9_Bandwidth_And_Cross_Connect_Lifecycle.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single XC | Circuit SPOF |
| Wrong panel/strand in order | Dark until redo |
| LOA mismatch parties | Delay |
| Untested light | Surprise at cutover |
| “Diverse” sharing duct | Correlated cut |

### How it connects

Equinix-class products: [Markets/4](../Markets-And-Operators/4_Equinix_Class_Interconnection.md). Portal patterns: [6](./6_Customer_Portal_Patterns.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dual ISP | Two XCs, diversity requested |
| Peer connection | XC to peer cage / IX fabric |
| Cloud | On-ramp order + logical circuit |
| Cutover | Test → migrate → decommission old |

**Staff checklist**

- Z-end details exact  
- Diversity notes in order  
- Circuit IDs filed  
- Test results kept  
- Never cutover on untested XC  

**Good:** dual diverse XCs, clean LOA, tested. **Bad:** single strand; paperwork diversity; hope.

---

## References

- [Equinix docs](https://docs.equinix.com/) (Fabric/XC as applicable)  
- Official Digital Realty / operator interconnect guides  
- [PeeringDB](https://www.peeringdb.com/)  
- [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md)  
