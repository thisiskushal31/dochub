# 6 — Border and edge roles

[← Previous](./5_MMR_And_Cross_Connect_Physical.md) · [README](./README.md) · [Next: Bonding and MLAG →](./7_Bonding_MLAG_And_Dual_Home.md)

## 1. Concepts

**Border** devices connect the hall fabric to carriers, cloud on-ramps, partner networks, and sometimes internet. **Edge** roles also include firewalls, WAN routers, and DDoS appliances as *physical boxes* with power, optics, and HA pairs.

### Typical roles

| Role | Job |
|------|-----|
| Border router | eBGP/static to providers |
| Firewall pair | Policy edge |
| WAN / SD-WAN | Branch aggregation |
| DDoS scrubbing handoff | As designed |

Protocol detail → Networks-Deep-Dive / Security-Deep-Dive. Here: placement, HA, power, failure domain.

### Where it sits

MMR-adjacent cages or network rooms; dual power; dual upstream XCs ([5](./5_MMR_And_Cross_Connect_Physical.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single border | Site offline |
| HA pair same ToR/PDU | Soft SPOF |
| Firewall async paths without care | Drops |
| Optics dirty on only uplink | Flap |
| Change without rollback | Self-inflicted outage |

### How it connects

```text
Internet/carrier → XC → border/firewall → spines/core → leaves → hosts
```

LB appliances may sit inside ([9](./9_Load_Balancer_Appliances.md)). Cloud on-ramps are logical + physical ([Provider-Use](../Provider-Use/README.md)).

### Global variants

Same roles; carrier diversity quality differs by metro. Hyperscale edges unpublished—customer borders remain your responsibility.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dual ISP | Two borders or dual-homed border pair + diverse XC |
| Firewall HA | Stateful sync + independent power/net paths |
| Cutover | Drain, swap optics, verify, then remove old |
| Audit | Document ASN, circuits, patch IDs |

**Staff checklist**

- Upstream diversity real  
- HA not co-located on one PDU  
- Console on OOB  
- Change windows with rollback  
- Never “save bandwidth” by dropping the second ISP silently  

**Good:** diverse edges, HA independent, documented circuits. **Bad:** one router; HA twins on one strip; untested failover.

## References

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Vendor border/firewall HA guides  
- [NIST](https://www.nist.gov/) (edge security program themes → Security-Deep-Dive)  
