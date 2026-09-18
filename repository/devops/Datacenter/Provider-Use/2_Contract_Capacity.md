# 2 — Contract capacity

[← Previous](./1_Qualify_A_Site.md) · [README](./README.md) · [Next: Order interconnect →](./3_Order_Interconnect.md)

## 1. Concepts

Contract the **space/power product** clearly:

| Object | Meaning |
|--------|---------|
| **U / cabinet / cage / suite** | Space boundary |
| **kW commit** | Power budget (and often billing basis) |
| **A+B feeds** | Dual path landing expectations |
| **Hands SLA** | Remote/smart hands inclusions |
| **Term / renewal / exit** | Lock-in and leave costs |
| **Cross-connect rights** | Often separate orderables |

On-ramp contracts survey: [../2_Ownership_Colo_And_Contracts.md](../2_Ownership_Colo_And_Contracts.md).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| kW commit << GPU draw | Trip or throttle |
| Ambiguous A+B | Soft SPOF |
| Unlimited hands assumption | Invoice shock |
| Ignoring exit | Stuck iron |
| Burst power undefined | Fight later |

### How it connects

Density reality: [White-Space/3](../White-Space/3_Power_Density_And_Floor_Loading.md). Electrical landing: [Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard cage | Cabinets + kW + A+B + hands package |
| Growth | Options for more kW/U without full recontract if possible |
| Wholesale | Power delivery milestones in contract |
| Review | Redline exit and XC lead times |

**Staff checklist**

- kW vs measured plan  
- A+B language explicit  
- Hands scope attached  
- Exit/decommission costs known ([10](./10_Exit_Relocation_And_Decommission.md))  
- Never verbal-only power promises  

**Good:** written kW/A+B/hands/exit. **Bad:** handshake power; unlimited hands myth.

## References

- Official colo MSA / product definitions for your landlord  
- [Uptime Institute](https://uptimeinstitute.com/) (topology language literacy)  
- On-ramp [2](../2_Ownership_Colo_And_Contracts.md)  
- Operator order forms (current)  
