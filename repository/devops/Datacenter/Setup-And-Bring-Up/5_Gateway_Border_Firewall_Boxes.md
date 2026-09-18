# 5 — Gateway, border, and firewall boxes

[← Previous](./4_Switch_Roles_In_Practice.md) · [README](./README.md) · [Next: LAN segmentation →](./6_LAN_Segmentation_Jobs.md)

---

## Mental map

```text
Internet / carrier / cloud on-ramp
        │
   ┌────┴────┐
   │ Border  │  (routers — eBGP/static)
   └────┬────┘
   ┌────┴────┐
   │Firewall │  (policy edge, often HA pair)
   └────┬────┘
        │
   Spine / campus core
        │
   ToR / access / WLAN controller path
```

Physical roles: [Fabric-Physical/6](../Fabric-Physical/6_Border_And_Edge_Roles.md). Policies/WAF: [Security/WAF](../../Security/WAF/README.md). Packet detail: Networks-Deep-Dive.

---

## 1. Concepts

| Box | Setup job |
|-----|-----------|
| **Border router** | Dual XC, dual power, routing to providers |
| **Firewall** | HA pair on diverse paths; change control |
| **VPN / SD-WAN** | Separate or same edge—document zones |
| **Lab gateway** | NAT/firewall for WLAN/lab VLANs |

**Plain language:** Gateways are doors. Doors need two hinges (HA) and a lock policy (firewall)—not a single rusty latch.

**Disconfirm:** Cloud “AZ” language is **not** your firewall HA story. A WAF is **not** a border router.

**Confirm:** Where do your cross-connects land relative to the firewall?

---

## 2. Advanced concepts

### Operator experience

Async routing through firewall HA without care drops sessions. Keep border and firewall change windows separate from mass PXE days. Diagram zones (WAN / DMZ / LAN / OOB / WLAN) before first rule install.

### First-config literacy (not a CLI book)

- Mgmt plane reachability out-of-band preferred  
- NTP, logging, AAA  
- Document default-deny vs allow lists  
- Test failover deliberately  

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| New site | Order two diverse XCs before iron arrives |
| Office+DC | WLAN gateway zone ≠ server LAN zone |

**Staff checklist:** HA tested; XC IDs in runbook; rollback for rule changes; Networks owner named.

---

## References

- [Fabric-Physical/5 MMR](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md)  
- [Provider-Use/3 Order interconnect](../Provider-Use/3_Order_Interconnect.md)  
- Networks-Deep-Dive (routing, firewalls literacy)  
