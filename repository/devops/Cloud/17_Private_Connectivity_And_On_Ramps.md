# 17 — Private connectivity and on-ramps

[← Previous](./16_VPC_And_Network_Constructs.md) · [README](./README.md) · [Next: Compute instances →](./18_Compute_Instances_And_Autoscaling.md)

---

## 1. Concepts

Private paths between cloud and elsewhere:

| Pattern | Examples |
|---------|----------|
| **Dedicated on-ramp** | Direct Connect, ExpressRoute, Interconnect |
| **VPN** | IPsec to on-prem/colo |
| **Private endpoints** | Private Link / Private Service Connect-class |
| **Colo Fabric attach** | Equinix Fabric-class → cloud |

Physical XC + landlord jobs: [Datacenter Provider-Use/7](../Datacenter/Provider-Use/7_Land_Cloud_On_Ramp.md). Logical BGP: Networks-Deep-Dive.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single on-ramp | Soft SPOF |
| Physical up, BGP down | Half-debug |
| Overlapping CIDRs | Blackhole |
| Treating VPN as DC-grade always | Latency/jitter surprise |

### How it connects

Tenant vs landlord [Datacenter Markets/8](../Datacenter/Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md). MMR physical [Datacenter Fabric-Physical/5](../Datacenter/Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hybrid data | Dual diverse on-ramps |
| SaaS private | Private endpoints |
| Burst | VPN OK for non-critical; dedicated for prod data |
| Cutover | Test before DNS move |

**Staff checklist**

- Dual paths for tier-1  
- Cloud + colo ticket IDs linked  
- CIDR plan conflict-checked  
- Never assume Fabric click replaces routing design  

**Good:** dual on-ramps, tested, owned. **Bad:** single VPN hope; physical-only diligence.

---

## References

- [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/)  
- [Azure ExpressRoute](https://learn.microsoft.com/azure/expressroute/)  
- [Google Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect)  
- [Equinix Fabric docs](https://docs.equinix.com/)  
- [Datacenter Provider-Use/7](../Datacenter/Provider-Use/7_Land_Cloud_On_Ramp.md)  
