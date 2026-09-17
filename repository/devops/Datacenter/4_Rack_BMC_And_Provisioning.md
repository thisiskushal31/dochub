# 4 — Rack, BMC, and provisioning

[← Previous](./3_Facility_Power_Cooling_And_Rooms.md) · [README](./README.md) · [Next: Fabric →](./5_Fabric_Cross_Connect_And_OOB.md)

---

## 1. Concepts

The **rack** is the unit of deploy. Cloud instance replace is an API. Here, replace is **BMC + image + hands**.

- **U** (rack units), depth, rail kit, weight, airflow (front-to-back vs the aisle plan)  
- **Rack PDU**: often A (odd) and B (even); C13/C19; metered vs switched  
- **Structured cabling**: power and data are separate; **labeling** is how you debug at 3am  
- **Out-of-band (OOB)**: BMC on a **management network** that is not the production VLAN  

If you cannot reach the BMC when the OS is dead, you do not own the box.

### BMC names you will see

| Vendor | Typical BMC |
|--------|-------------|
| HPE | iLO |
| Dell | iDRAC |
| Lenovo | XCC / IMM |
| Cisco UCS | CIMC / UCSM |
| SuperMicro / others | IPMI / vendor BMC; often **Redfish** |

**IPMI** is the older out-of-band family. **Redfish** (DMTF) is the modern HTTP/JSON management API. Use Redfish when the box has it. Default BMC passwords left in production are an **incident** ([11](./11_Identity_Access_And_Change.md)).

### What “provisioning” means

Make a **bare chassis** into a **known OS** (or hypervisor) with a known firmware level, then hand it to config management or a cluster installer.

```text
Rack + dual PSU + labeled cables
  → BMC on OOB, reachable, unique password, inventory asset tag
  → Firmware (BIOS, NIC, RAID, BMC) at a pinned version
  → Boot: PXE / iPXE / Redfish virtual media / vendor ISO
  → OS or hypervisor image
  → Automation (Ansible, …) or cluster bootstrap
```

---

## 2. Advanced concepts

### Firmware is part of the OS

A NIC firmware bug is a production incident. Pin versions. Stage firmware in burn-in. Do not “latest” 200 BMCs on Friday. GPU and RAID firmware especially — mixed versions in one cluster are a support nightmare.

**Secure Boot / TPM**: decide a policy. Kubernetes and OpenShift on metal often want TPM for encryption-at-rest stories; vSphere has its own. Changing Secure Boot after imaging can look like a bricked host.

### Boot methods

| Method | When |
|--------|------|
| **PXE / iPXE** | Hall with DHCP/TFTP (or HTTP) on a **provisioning** VLAN; classic at scale |
| **Redfish virtual media** | Mount ISO/img over BMC; good for one-off and for IPI-style installers that talk BMC |
| **Vendor ISO / USB** | Break-glass; remote hands with a photographed stick |
| **MAAS / Foreman / Cobbler** | Image + DHCP + inventory as a system |
| **Ironic / Metal3** | OpenStack or Kubernetes-style bare-metal machine API |
| **OpenShift IPI on bare metal** | Installer talks BMC; you still provide machines, network, LB, storage — [10](./10_Clusters_On_Prem.md) |

DHCP on the **production** VLAN as your only PXE plan will one day netboot a database. Keep provisioning L2 (or tightly scoped DHCP) separate.

### RAID vs software disks vs SAN boot

Hardware RAID for a hypervisor boot disk is still common. Kubernetes nodes often want **JBOD + CSI** rather than hiding disks behind a RAID card. SAN boot (FC/iSCSI to the HBA) exists in brownfield vSphere. Pick one per class of machine and write it down. Mixed boot in one cluster is how kubelet disk pressure surprises you.

### Inventory

Asset tag, serial, U position, PDU port, switch port, BMC MAC, prod MAC, purchase date, warranty. If this lives in a spreadsheet that is a year stale, your remote-hands ticket will reseat the wrong box.

### Spares

Same SKU, same NIC, same RAID. A “close” spare that needs a different driver is not a spare. For GPU nodes, the spare is a **GPU node**.

### Break-glass console

Serial-over-LAN, HTML5 KVM on the BMC, physical crash cart. Test it **before** the OS is dead. Some BMCs share a NIC with production (sideband) — know if OOB dies when the prod bond dies.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First 10 servers | Redfish virtual media + documented image; do not automate chaos |
| 100+ servers | PXE/Foreman/MAAS/Ironic + inventory source of truth |
| OpenShift IPI metal | BMC credentials in install-config; still you own LB/DNS/storage |
| Dead node at 3am | Remote-hands: “U12, serial XYZ, reseat PSU A, photo before/after” |
| Firmware wave | Burn-in rack → stage → rolling, one failure domain at a time |

**Staff checklist**

- BMC on a dedicated OOB network; unique creds; MFA/jump for humans  
- Dual PSU on A+B; labeled  
- Provisioning network ≠ production DHCP  
- Firmware pinned and recorded  
- Image pipeline (not “the ISO on someone’s laptop”)  
- Inventory: serial ↔ U ↔ ports  
- Spare pool of the **same** SKU  
- Serial/KVM tested  

**Good:** Redfish inventory, PXE on a provisioning VLAN, firmware as a change ticket. **Bad:** BMC on the prod LAN with `admin/admin`, USB imaging in production, no spare, unlabeled patch cords.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [OpenBMC](https://www.openbmc.org/)  
- [Foreman](https://theforeman.org/)  
- [MAAS](https://maas.io/docs)  
- [Ironic](https://docs.openstack.org/ironic/latest/)  
- [Metal3](https://metal3.io/)  
- [iPXE](https://ipxe.org/)  
