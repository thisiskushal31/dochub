# 8 — Serial console servers

[← Previous](./7_PTP_Grandmaster_And_Time.md) · [README](./README.md) · [Next: Environmental sensors →](./9_Environmental_Sensors_And_PDU_Meters.md)

---

## 1. Concepts

A **serial console server** (terminal server) aggregates RS-232/USB-serial connections from switches, PDUs, firewalls, and legacy appliances so operators get remote consoles without a crash cart visit.

Treat it as **first-class infrastructure**—not a dusty lab toy.

### Where it sits

Management rack; ports patched to device serial; uplink on **OOB/management** network; dual power preferred; AAA to the org IdP where supported.

Related: crash carts ([White-Space/8](../White-Space/8_Crash_Cart_KVM_And_Serial_Aggregation.md)), BMC for servers ([Compute/10](../Compute/10_BMC_IPMI_And_Redfish_Deep.md)).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Console server down | Blind during switch recovery |
| Wrong baud/pinout | Garbage; wasted hours |
| Ports unlabeled | Dangerous misconfiguration |
| On production VLAN | Security blast radius |
| No dual power | Dark with PDU A |
| Shared root passwords | Audit fail |

### How it connects

```text
Device serial → patch → console server → OOB → operator (SSH/HTTPS)
```

Remote hands can reseat serial cables if elevations document port maps ([White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md)).

### Global variants

Cisco/OpenGear/Digi/etc. brands differ; jobs identical: aggregate, authenticate, label, monitor.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Leaf-spine build | Console every switch before relying on SSH only |
| PDU recovery | Serial to metered PDUs where available |
| Incident | Console server is priority-1 OOB gear |
| Colo | Map which devices need serial vs BMC-only |

**Staff checklist**

- Port→device map current  
- OOB-only reachability  
- AAA + unique creds  
- Dual power / dual path preference  
- Baud cheat-sheet posted  

**Good:** labeled, vaulted, monitored console fabric. **Bad:** mystery RJ45 serial; console server on prod; baud roulette.

---

## References

- Vendor console server documentation for your platform  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish) (server OOB contrast)  
- [TIA-606](https://tiaonline.org/) (labeling/admin)  
- [NIST](https://www.nist.gov/) (credential/auth hygiene — org policy)  
