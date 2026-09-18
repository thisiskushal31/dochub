# 7 — Land a cloud on-ramp

[← Previous](./6_Customer_Portal_Patterns.md) · [README](./README.md) · [Next: Dedicated metal →](./8_Dedicated_Metal_Intake.md)

---

## 1. Concepts

A **cloud on-ramp** joins colo iron to a public cloud region via physical interconnect + logical circuit products:

| Class (names churn) | Idea |
|---------------------|------|
| **AWS Direct Connect** | Dedicated connectivity to AWS |
| **Azure ExpressRoute** | To Azure |
| **Google Interconnect** | To GCP |
| **Operator Fabric → cloud** | Equinix Fabric-class to cloud attaches |

Jobs: order physical XC/port, complete cloud-side circuit, BGP/routing (Networks depth), test, document.

API/IAM inside the cloud → `Cloud/` advanced later.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Physical up, logical down | “On-ramp broken” mis-ticketed |
| Single on-ramp | Cloud path SPOF |
| Wrong metro pairing | Latency/cost surprise |
| No colo↔cloud runbook ownership | Ping-pong |

### How it connects

Physical XC [3](./3_Order_Interconnect.md), MMR [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md), tenant vs landlord [Markets/8](../Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hybrid data | Dual on-ramps diverse |
| Burst compute | Colo + cloud region adjacency |
| DR | On-ramp to DR region |
| Cutover | Validate before DNS/app shift |

**Staff checklist**

- Cloud + colo ticket IDs linked  
- Dual paths if tier-1  
- BGP/ASN ownership clear  
- Latency measured  
- Never assume Fabric click replaces routing design  

**Good:** dual on-ramps, tested, owned. **Bad:** single path; physical-only diligence; cloud team unaware of XC.

---

## References

- [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/)  
- [Azure ExpressRoute](https://learn.microsoft.com/azure/expressroute/)  
- [Google Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect)  
- [Equinix Fabric docs](https://docs.equinix.com/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
