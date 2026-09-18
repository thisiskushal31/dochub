# 15 — Bring-up failure walks

[← Previous](./14_Role_Playbooks_Bring_Up_Week.md) · [README](./README.md)

---

## Mental map

```text
Symptom → which plane? → physical or config? → roll back last change → verify dual path
```

Worked hall failures: [Integration/](../Integration/README.md).

---

## 1. Concepts — common bring-up breaks

| Walk | Likely cause | First checks |
|------|--------------|--------------|
| No PXE | DHCP/helper/VLAN | Port profile; tcpdump on helper |
| Image OK, prod dark | Port never flipped | Switchport VLAN; bond |
| BMC unreachable | OOB DHCP/cable | Wrong VLAN; PDU port |
| Degraded RAID day 2 | Bad tray / foreign config | Controller log; reseat procedure |
| Cluster flapping | Single path storage/net | Multipath; dual ToR |
| “Wi‑Fi can’t hit BMC” | Correctly blocked—or mis-ACL | Should not be on WLAN |

**Disconfirm:** Rebooting everything is **not** RCA. Green LED is **not** multipath proof.

**Confirm:** Pick one walk and name the plane it lives on.

---

## 2. Advanced concepts

### Operator experience

Change calendar prevents overlapping border + PXE storms. Photograph before/after cable moves. When auto-fabric join fails, stop automating and diff NOS versions.

### Failure modes of the bring-up process itself

| Failure | Fix |
|---------|-----|
| No shared elevation | Stop shipping crates |
| No RACI for port flip | Dual ownership tickets |
| Skipping pilot image | Don’t 100× a broken golden |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Drill | Pull ToR-A uplink in window; expect traffic on B |
| Drill | Fail one storage path; multipath stays up |
| Drill | Kill prod NIC; still reach BMC |

**Staff checklist:** runbooks linked from tickets; dual-path verified before declaring “done”; Integration walks practiced.

**Good:** deliberate failure tests. **Bad:** hope as HA strategy.

---

## References

- [Integration/5 Lose PDU A](../Integration/5_Failure_Lose_PDU_A.md) · [6 Lose ToR](../Integration/6_Failure_Lose_ToR.md)  
- [Fabric-Physical/12](../Fabric-Physical/12_Fabric_Failure_Walks.md) · [Storage-Physical/12](../Storage-Physical/12_Storage_Failure_Walks.md)  
