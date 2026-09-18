# 1 — Hall network mental map

[README](./README.md) · [Next: Crate to live rack →](./2_Crate_To_Live_Rack.md)

## Mental map

![Hall network planes](../../Assets/Datacenter/Setup-And-Bring-Up/hall-planes-map.svg)

*What to notice: five planes can share a building and still be separate failure domains. Colo white space often has no WLAN—lab/office/edge still needs AP→gateway literacy.*

```text
People / devices
   ├─ WLAN / edge (AP → access switch → gateway)     [lab/office/event]
   ├─ Server LAN (NIC → ToR leaf → spine → border)
   ├─ OOB / BMC (dedicated mgmt switches)
   ├─ Storage fabric (FC or Ethernet storage VLANs)
   └─ MMR / border (carriers, cloud XC leave here)
```

## 1. Concepts

**Plain language:** A datacenter is not “one network.” It is several **planes** that must not casually share fate. Mixing BMC DHCP with production PXE is how you brick a change window.

| Plane | Job | Typical gear |
|-------|-----|----------------|
| Server LAN | App/hypervisor traffic | ToR, spine, NICs |
| OOB | Lights-out manage servers/PDUs | Mgmt switches, BMC |
| Provisioning | First boot / PXE (often temporary VLAN) | Same ToR ports, different VLAN |
| Storage | Block/file paths | FC directors or Ethernet |
| Edge/WLAN | Humans and IoT | AP, PoE switch, gateway |
| MMR/border | Leave the building | Routers, firewalls, XC |

Device depth: [Fabric-Physical/](../Fabric-Physical/README.md). Protocols: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

**Disconfirm:** “Everything is flat VLAN 1” is **not** a hall design. Wi‑Fi in the cage is **not** required for colo white space.

**Confirm:** Name three planes that should not share a single ToR downlink casually.

## 2. Advanced concepts

### Operator experience (verify locally)

Themes operators repeat (e.g. r/networking fabric threads): dual leaf per rack on **diverse PDUs**; spines on **diverse racks/power**; “spine-leaf” with two spines is still hub-and-spoke unless scale justifies more. Auto-provision fabrics fail when software versions disagree—validate manually first.

### Failure modes

| Mistake | Symptom |
|---------|---------|
| OOB on prod DHCP | Rogue images / IP conflicts |
| Storage on best-effort Wi‑Fi path | Cluster partitions |
| Single border | Site offline on one XC cut |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First cage | Draw the six planes on one whiteboard before ordering XC |
| Lab/office adjacent | Document AP SSID → VLAN → firewall zone |
| Audit | Trace one packet from laptop and one from BMC |

**Staff checklist:** plane diagram owned; A/B power named per plane; who owns each plane’s change window.

**Good:** planes drawn and dual-homed. **Bad:** one switch does BMC, PXE, iSCSI, and guest Wi‑Fi.

## References

- [Fabric-Physical/1 Leaf-spine](../Fabric-Physical/1_Leaf_Spine_And_Classic_Three_Tier.md)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Networks-Deep-Dive (routing/switching)  
- Image: handbook SVG `hall-planes-map.svg`  
