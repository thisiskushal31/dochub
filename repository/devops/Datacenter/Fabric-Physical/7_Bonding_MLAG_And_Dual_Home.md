# 7 — Bonding, MLAG, and dual-home

[← Previous](./6_Border_And_Edge_Roles.md) · [README](./README.md) · [Next: Optics roles →](./8_Optics_And_Transceiver_Roles.md)

## 1. Concepts

**Dual-home** means a host (or switch) has links to **two independent upstream devices**. **LACP bonding** bundles links; **MLAG / vPC-class** pairs make two ToRs look like one logical neighbor for LACP.

### Patterns

| Pattern | Meaning |
|---------|---------|
| Active/active LACP to MLAG pair | Common ToR HA |
| Active/standby | Simpler; failover delay |
| ECMP from host (two gateways) | Depending on OS/design |
| Single NIC | Not dual-homed |

Protocol minutiae → Networks-Deep-Dive. Hall job: **independence is physical**.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Both cables to one ToR | Fake HA |
| MLAG peer-link down poorly handled | Split-brain risk |
| LACP suspended | Single path silently |
| Same PDU for both ToRs | Power kills “HA” |
| Host misbond | Loops or blackhole |

### How it connects

```text
NIC0 → ToR A
NIC1 → ToR B   (MLAG peers)
ToR A/B → spines
```

Compute slot planning: [Compute/13](../Compute/13_NICs_HBAs_And_Slot_Planning.md). Power A/B still required separately.

### Global variants

Vendor MLAG names differ (vPC, MCLAG, …). Jobs identical: peer link, dual-home hosts, test pull.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard server | 2×NIC to ToR A/B + LACP |
| Switch uplink | Dual to spines |
| Test | Disable one NIC/ToR in window |
| Audit | Trace both cords physically |

**Staff checklist**

- Two upstream devices, not two ports on one  
- ToR power diverse  
- LACP status monitored  
- Peer-link documented  
- Never celebrate “bonded” without tracing far ends  

**Good:** true dual-home, tested failover. **Bad:** bond to one switch; MLAG untested; shared PDU.

## References

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- IEEE 802.1AX (LACP) via standards bodies  
- Vendor MLAG/vPC design guides  
- Linux bonding documentation  
