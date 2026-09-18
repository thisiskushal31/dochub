# 12 — WLAN and AP (lab, office, edge)

[← Previous](./11_Storage_Network_And_Array_Bring_Up.md) · [README](./README.md) · [Next: Petabyte thinking →](./13_Petabyte_Capacity_Thinking.md)

---

## Mental map

```text
Client device ──RF──► Access Point (PoE)
                         │
                    Access switch (PoE)
                         │
                    VLAN / SSID map
                         │
                    Gateway / firewall zone
                         │
                    Internet or DC services (never raw BMC)
```

![Wireless access point](../../Assets/Datacenter/Setup-And-Bring-Up/wifi-access-point.jpg)

*What to notice: AP is an Ethernet endpoint first (PoE + data); RF is the air side. Image: Wikimedia Commons `Access-point-wireless.jpg`.*

**RF / 802.11 depth:** [Networks Advanced — Wireless](https://github.com/thisiskushal31/Networks-Deep-Dive/blob/main/Advanced/5_Wireless_Special_Networks.md).

---

## 1. Concepts

Colo **white space** rarely runs guest Wi‑Fi by design. You still need AP literacy for **NOC rooms, offices, labs, edge sites, and temporary build-outs**.

| Piece | Setup job |
|-------|-----------|
| AP | Mount, PoE, adopt to controller/cloud |
| SSID | Map to VLAN / firewall zone |
| Controller | Channel/power policy; not “auto forever” blind |
| Wired backhaul | Uplink like any access switch |
| Security | WPA3-Enterprise / 802.1X when possible |

**Disconfirm:** Wi‑Fi is **not** a storage or cluster fabric. Covering the cage with consumer mesh is **not** a DC design.

**Confirm:** What VLAN should **never** be bridged to an open SSID?

---

## 2. Advanced concepts

### Operator experience

PoE budget kills APs when switches are undersized. Separate staff vs guest SSIDs. During builds, a temporary SSID for scanners/hands tablets is fine—document and tear down. Channel planning beats cranking power.

### Failure modes

| Failure | Symptom |
|---------|---------|
| AP on BMC VLAN | Exposed mgmt |
| DHCP from wrong scope | Captive confusion |
| Overlapping channels | Slow “Wi‑Fi broken” tickets |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Office next to DC | Enterprise SSID → user VLAN → firewall |
| Lab | Isolated SSID → lab GW only |
| Event-style NOC | Planned RF + wired backhaul + SOC VLAN |

**Staff checklist:** PoE budget; SSID→VLAN matrix; no OOB on Wi‑Fi; RF survey for dense rooms; tear-down for temp SSIDs.

---

## References

- [Networks-Deep-Dive Advanced/5 Wireless](https://github.com/thisiskushal31/Networks-Deep-Dive/blob/main/Advanced/5_Wireless_Special_Networks.md)  
- [1 Hall mental map](./1_Hall_Network_Mental_Map.md)  
- Image: Wikimedia Commons as credited  
