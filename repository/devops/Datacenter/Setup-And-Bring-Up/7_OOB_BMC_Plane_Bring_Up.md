# 7 — OOB / BMC plane bring-up

[← Previous](./6_LAN_Segmentation_Jobs.md) · [README](./README.md) · [Next: Server setup →](./8_Server_Setup_Playbook.md)

---

## Mental map

```text
Laptop / jump / DCIM
        │
   OOB mgmt switches (dedicated)
        │
   ┌────┼────┬─────────┐
 BMC   PDU   Switch-mgmt  Serial console
```

Physical plane: [Fabric-Physical/3](../Fabric-Physical/3_OOB_Management_Network.md). BMC depth: [Compute/10](../Compute/10_BMC_IPMI_And_Redfish_Deep.md).

---

## 1. Concepts

**OOB** (out-of-band) is how you reach iron when the OS or prod network is dead.

| Bring-up step | Result |
|---------------|--------|
| Dedicated mgmt switches + VLAN | Isolation |
| DHCP or reserved IPs for BMC | Inventory |
| Default passwords rotated | Security |
| Redfish/IPMI from jump only | Least privilege |
| PDU outlets mapped to U | Remote power |

**Disconfirm:** Sharing prod DHCP with BMC is **not** OK. “We’ll secure BMC later” is **not** OK on day one.

**Confirm:** Can you power-cycle a server with the OS NIC unplugged?

---

## 2. Advanced concepts

### Operator experience

Modern flows invent with Redfish, then install via virtual media—sometimes skipping in-band PXE. Still keep OOB DHCP disciplined. Document which jump hosts may speak IPMI/Redfish.

### Failure modes

| Failure | Impact |
|---------|--------|
| BMC on VLAN with guests | Attack surface |
| Firmware mismatch | Redfish flaky |
| No serial fallback | Blind brick |

---

## 3. Applications

**Staff checklist:** mgmt VRF/VLAN; credential vault; TLS where supported; monitoring BMC reachability; next server playbook ([8](./8_Server_Setup_Playbook.md)).

---

## References

- [Fabric-Physical/3](../Fabric-Physical/3_OOB_Management_Network.md)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
