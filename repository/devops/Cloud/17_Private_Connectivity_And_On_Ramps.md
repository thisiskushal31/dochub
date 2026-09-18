# 17 — Private connectivity and on-ramps

[← Previous](./16_VPC_And_Network_Constructs.md) · [README](./README.md) · [Next: Compute instances →](./18_Compute_Instances_And_Autoscaling.md) · [Hybrid →](./22_Hybrid_Colo_And_Cloud.md)

## Mental map

```text
Cloud VPC  ←→  (DX / ExpressRoute / Interconnect | IPsec VPN | Private endpoint)
           ←→  colo cage / on-prem / SaaS
Physical XC + LOA  =  Datacenter Provider-Use
Logical BGP/routes =  Networks + this chapter
```

*What to notice: “on-ramp” is a **pair**—landlord physical path + tenant cloud attachment.*

## 1. Concepts

Private paths between cloud and elsewhere:

| Pattern | Examples | When |
|---------|----------|------|
| **Dedicated on-ramp** | Direct Connect, ExpressRoute, Cloud Interconnect | Prod data, stable bandwidth |
| **VPN** | IPsec to on-prem/colo | Bootstrap, lower criticality |
| **Private endpoints** | Private Link / Private Service Connect-class | SaaS/PaaS without public IP |
| **Colo Fabric attach** | Equinix Fabric-class → cloud | Interconnect ecosystems |

Physical XC + landlord jobs: [Datacenter Provider-Use/7](../Datacenter/Provider-Use/7_Land_Cloud_On_Ramp.md). Logical BGP: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Hybrid interfaces: [22](./22_Hybrid_Colo_And_Cloud.md).

**Disconfirm:** A green “connected” light on Fabric is **not** a routing design. VPN is **not** automatically DC-grade.

**Confirm:** How many diverse paths? Who owns the colo ticket vs the cloud VIF? Are CIDRs conflict-checked ([16](./16_VPC_And_Network_Constructs.md))?

## 2. Advanced concepts

### Cross-cloud names

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| Dedicated | Direct Connect | Cloud Interconnect | ExpressRoute | OCI FastConnect; Aliyun Express Connect; … |
| VPN | Site-to-Site VPN | Cloud VPN | VPN Gateway | Similar |
| Private to PaaS | PrivateLink | PSC | Private Endpoint | Similar |

### Failure modes

| Failure | Impact |
|---------|--------|
| Single on-ramp | Soft SPOF |
| Physical up, BGP down | Half-debug across two NOCs |
| Overlapping CIDRs | Blackhole |
| Treating VPN as always DC-grade | Latency/jitter surprise |
| No link between colo + cloud ticket IDs | Ping-pong RCA |

### How it connects

Tenant vs landlord [Datacenter Markets/8](../Datacenter/Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md). MMR physical [Datacenter Fabric-Physical/5](../Datacenter/Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hybrid data | Dual diverse on-ramps |
| SaaS private | Private endpoints |
| Burst | VPN OK for non-critical; dedicated for prod data |
| Cutover | Test before DNS move ([25](./25_DNS_CDN_And_Edge_HTTP.md)) |

**Staff checklist**

- Dual paths for tier-1  
- Cloud + colo ticket IDs linked  
- CIDR plan conflict-checked  
- Never assume Fabric click replaces routing design  
- RACI across cloud and colo teams written ([22](./22_Hybrid_Colo_And_Cloud.md))  

**Good:** dual on-ramps, tested, owned. **Bad:** single VPN hope; physical-only diligence.

## References

- [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/)  
- [Azure ExpressRoute](https://learn.microsoft.com/azure/expressroute/)  
- [Google Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect)  
- [Equinix Fabric docs](https://docs.equinix.com/)  
- [Datacenter Provider-Use/7](../Datacenter/Provider-Use/7_Land_Cloud_On_Ramp.md)  
