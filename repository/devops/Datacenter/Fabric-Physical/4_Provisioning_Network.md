# 4 — Provisioning network

[← Previous](./3_OOB_Management_Network.md) · [README](./README.md) · [Next: MMR →](./5_MMR_And_Cross_Connect_Physical.md)

---

## 1. Concepts

The **provisioning network** carries PXE/iPXE, DHCP for install, imaging APIs, and sometimes discovery—traffic that is powerful and dangerous on production VLANs.

### Where it sits

Isolated VLAN/segment reachable during bare-metal boot; DHCP helpers; image servers; often related to but not identical with OOB ([3](./3_OOB_Management_Network.md)). Imaging: [Compute/15](../Compute/15_Imaging_And_Provisioning_At_Scale.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| DHCP on prod | Rogue install risk / IP chaos |
| Missing helper / wrong VLAN | Nodes won’t image |
| Open PXE forever | Persistent attack surface |
| Same broadcast domain as users | Accidental boots |
| No rate limits | Storms |

### How it connects

```text
Node boot NIC → provisioning VLAN → DHCP/PXE → image → then move to prod networks
BMC path parallel on OOB for virtual media alternative
```

Secure Boot policies still apply ([Compute/11](../Compute/11_Firmware_Trains_And_Secure_Boot.md)).

### Global variants

Some use OOB virtual media only (no PXE). Jobs: isolate, authenticate, disable when idle if policy says.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fleet image | Provisioning VLAN + allowlist |
| Breakglass | Redfish media if PXE blocked |
| Security | PXE disabled outside windows where required |
| Colo | Confirm which VLAN landlord tags for PXE |

**Staff checklist**

- DHCP scoped tightly  
- Document boot NIC vs BMC  
- Image signing/versions  
- Turn down open PXE when done if required  
- Never run org-wide DHCP from a laptop “temporarily”  

**Good:** isolated provisioning, controlled windows, signed images. **Bad:** forever-open PXE on prod; mystery helpers.

---

## References

- [iPXE](https://ipxe.org/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [Ironic](https://docs.openstack.org/ironic/) / [MAAS](https://maas.io/docs) / [Foreman](https://theforeman.org/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
