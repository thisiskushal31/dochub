# 9 — Imaging path

[← Previous](./8_Server_Setup_Playbook.md) · [README](./README.md) · [Next: RAID →](./10_RAID_And_Local_Disk_Setup.md)

---

## Mental map

```text
Option A: PXE on provisioning VLAN → installer → config → port flip to prod
Option B: Redfish virtual media ISO → installer (OOB only)
Option C: Ironic / MAAS / Foreman / Tinkerbell orchestration
```

Depth survey: [Compute/15](../Compute/15_Imaging_And_Provisioning_At_Scale.md). VLAN jobs: [6](./6_LAN_Segmentation_Jobs.md).

---

## 1. Concepts

| Path | When |
|------|------|
| **PXE** | Scale; needs DHCP/helpers and provisioning VLAN |
| **Virtual media** | Break-glass; no in-band PXE; slower at huge scale |
| **Metal3 / Ironic / MAAS** | Declarative fleets |

**Disconfirm:** Imaging success is **not** “production ready” until monitoring, disks, and network prod config land. Cloud-init without inventory identity is **not** enough for DCIM.

**Confirm:** Which path works if the prod NIC cable is unplugged?

---

## 2. Advanced concepts

### Operator experience (verify locally)

Classic: PXE Linux → install → register serial/MAC → automation moves switchport to prod. Newer: Redfish inventory + virtual media only. Pin artefact digests; don’t DHCP across planes. Test one golden image before 100×.

### Failure modes

| Failure | Symptom |
|---------|---------|
| Wrong DHCP options | Wrong kernel |
| Port never flipped | Prod with PXE noise |
| Image unsigned/unpinned | Drift / supply risk |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| First 10 nodes | PXE + manual verify |
| Fleet | Ironic/MAAS + GitOps desired state |
| Emergency | Virtual media runbook |

**Staff checklist:** golden image pinned; DHCP scoped; rollback image; BMC console tested.

---

## References

- [OpenStack Ironic](https://docs.openstack.org/ironic/) · [MAAS](https://maas.io/docs)  
- [CiCd/4 Artifacts](../../CiCd/4_Artifacts_And_Registries.md)  
