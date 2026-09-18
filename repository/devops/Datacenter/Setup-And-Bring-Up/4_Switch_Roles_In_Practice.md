# 4 — Switch roles in practice

[← Previous](./3_Structured_Cabling_Bring_Up.md) · [README](./README.md) · [Next: Gateway/border →](./5_Gateway_Border_Firewall_Boxes.md)

---

## Mental map

![Leaf-spine sketch](../../Assets/Datacenter/Fabric-Physical/leaf-spine-concept.svg)

![Switch faceplate](../../Assets/Datacenter/Setup-And-Bring-Up/network-switch-front.jpg)

*What to notice on the photo: port density, uplink cages, status LEDs—your ToR will look denser; the job is the same. Image: Wikimedia Commons (3Com OfficeConnect example—illustrative faceplate).*

```text
Server NICs ──► ToR leaf pair (A/B)
                    │
                    ├── uplinks ──► Spine A
                    └── uplinks ──► Spine B
Spine ──► border / firewall / MMR
```

---

## 1. Concepts

| Role | Physical job | First config literacy |
|------|--------------|------------------------|
| **ToR / leaf** | Dual per rack ideal; dual PDU | Mgmt IP, VLANs, LACP to servers, uplinks |
| **Spine** | Few, power-diverse racks | Fabric underlay; no server ports |
| **Mgmt/OOB switch** | Separate plane | BMC/PDU only |
| **Access (office)** | PoE for APs/phones | Different from ToR |

Protocol depth (STP, BGP EVPN): Networks-Deep-Dive. Physical encyclopedia: [Fabric-Physical/2](../Fabric-Physical/2_ToR_EoR_MoR.md).

**Disconfirm:** Two NICs into **one** ToR is **not** dual-homed. Spine and leaf on the same PDU pair is **not** diversity.

**Confirm:** How many spines does each leaf need uplinks to in a classic leaf-spine?

---

## 2. Advanced concepts

### Operator experience (verify locally)

Dual ToR + dual PDU is the repeated floor pattern. Spines at opposite ends / diverse power. Mid-rack ToR can shorten copper. Distrust “auto fabric join” across mixed NOS versions—stage and validate.

### First-config checklist (vendor-neutral)

1. Console/OOB reachability  
2. Unique hostname + mgmt address  
3. NTP / AAA / logging  
4. Uplink LACP or routed ports per design  
5. Server-facing VLANs or L3 interfaces  
6. Save config + backup off-box  

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| New rack | Install leaf pair before mass server land |
| Brownfield | Document which ports are still access VLAN for PXE |

**Good:** leaf pair, diverse power, uplinks to all spines. **Bad:** single ToR “temporary forever.”

---

## References

- [Fabric-Physical/1](../Fabric-Physical/1_Leaf_Spine_And_Classic_Three_Tier.md) · [7 Bonding](../Fabric-Physical/7_Bonding_MLAG_And_Dual_Home.md)  
- [Networks-Deep-Dive Routing-Switching](https://github.com/thisiskushal31/Networks-Deep-Dive)  
