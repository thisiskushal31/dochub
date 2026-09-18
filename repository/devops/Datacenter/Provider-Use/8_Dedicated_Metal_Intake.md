# 8 — Dedicated metal intake

[← Previous](./7_Land_Cloud_On_Ramp.md) · [README](./README.md) · [Next: XC lifecycle →](./9_Bandwidth_And_Cross_Connect_Lifecycle.md)

---

## 1. Concepts

Two intake shapes share “dedicated servers” language:

| Shape | Motion |
|-------|--------|
| **Colo your iron** | Ship/rack in cage; you own BMC/ToR habits |
| **Bare-metal cloud** | Order SKU; provider racks; portal/API rescue ([Markets/7](../Markets-And-Operators/7_Bare_Metal_Cloud_Factories.md)) |

### Colo intake steps (jobs)

1. Capacity & rails ready ([2](./2_Contract_Capacity.md))  
2. Ship to dock; chain of custody  
3. Hands or self-rack; A+B power; dual NIC  
4. BMC on OOB; inventory tags  
5. Image ([Compute/15](../Compute/15_Imaging_And_Provisioning_At_Scale.md))  

API SKU depth for bare-metal clouds → Cloud later.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Server arrives, no kW left | Dock queen |
| Wrong rail kit | Delay |
| BMC not on OOB | Blind install  
| No elevation update | Future hands fail |
| Bare-metal treated as colo | Wrong tickets |

### How it connects

White-space safety [White-Space/10](../White-Space/10_White_Space_Safety_And_Housekeeping.md). Hands tickets [5](./5_Remote_Hands_Tickets.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Colo cluster | Spares + elevation + imaging pipeline |
| Bare-metal burst | SKU order + rescue console tested |
| Hybrid | Document which nodes are whose iron |
| Refresh | Drain → pull → decommission ([10](./10_Exit_Relocation_And_Decommission.md)) |

**Staff checklist**

- Shape named (colo vs BM cloud)  
- Power/network ready before iron ships  
- Serials into CMDB day-0  
- BMC creds vaulted  
- Never leave untagged chassis in cage  

**Good:** ready hall, tagged, imaged, documented. **Bad:** iron before power; mystery serials; wrong support path.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [OVHcloud](https://docs.ovh.com/) / [Hetzner](https://docs.hetzner.com/) bare-metal docs  
- Operator dock/shipping guides  
- [Compute/15](../Compute/15_Imaging_And_Provisioning_At_Scale.md)  
