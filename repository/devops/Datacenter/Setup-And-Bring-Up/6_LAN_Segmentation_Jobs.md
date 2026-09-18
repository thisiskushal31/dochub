# 6 — LAN segmentation jobs

[← Previous](./5_Gateway_Border_Firewall_Boxes.md) · [README](./README.md) · [Next: OOB/BMC →](./7_OOB_BMC_Plane_Bring_Up.md)

## Mental map

```text
Same physical ToR port over time:
  [provisioning VLAN + DHCP/PXE]
           │ install OS
           ▼
  [production VLAN / L3 / BGP-to-host]
           │
  Never: BMC VLAN == guest Wi-Fi VLAN
```

```mermaid
flowchart LR
  PXE[PXE_DHCP_VLAN]
  Install[OS_install]
  Prod[Prod_VLAN_or_L3]
  PXE --> Install --> Prod
```

## 1. Concepts

**Segmentation** is how one cable plant serves many trust and boot jobs without mixing them.

| Segment | Purpose |
|---------|---------|
| Provisioning | PXE/DHCP/TFTP or HTTP boot |
| Production | App/hypervisor traffic |
| Storage Ethernet | iSCSI/NVMe-oF isolated |
| OOB | BMC only |
| Lab/WLAN | Humans |

**Disconfirm:** Leaving ports on the PXE VLAN forever is **not** “simpler.” L3-to-the-host does **not** remove the need for a first-boot story.

**Confirm:** Who flips the switchport from provisioning to prod—network eng or automation?

## 2. Advanced concepts

### Operator experience (verify locally)

Common pattern: untagged/access provisioning VLAN with DHCP helpers → image → automation resets port to prod trunk/L3. BGP-to-server designs still need a boot path (temporary L2 or OOB virtual media). Document MAC/serial inventory before the flip.

### Failure modes

| Failure | Symptom |
|---------|---------|
| DHCP shared across planes | Wrong image / IP storm |
| Forgot port flip | Server “works” in prod with PXE options still present |
| No helper on new leaf | PXE timeout |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Greenfield rack | Template port profiles: pxe / prod / storage / oob |
| Break-glass | Virtual media via BMC when PXE plane down ([9](./9_Imaging_Path.md)) |

**Staff checklist:** VLAN matrix owned; DHCP scopes per plane; port-flip runbook; Integration with imaging.

## References

- [Fabric-Physical/4 Provisioning network](../Fabric-Physical/4_Provisioning_Network.md)  
- [Compute/15 Imaging](../Compute/15_Imaging_And_Provisioning_At_Scale.md)  
- Networks-Deep-Dive (VLAN/DHCP relay)  
