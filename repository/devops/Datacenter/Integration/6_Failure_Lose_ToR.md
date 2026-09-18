# 6 — Failure: lose ToR

[← Previous](./5_Failure_Lose_PDU_A.md) · [README](./README.md) · [Next: Lose CRAH →](./7_Failure_Lose_CRAH_Row.md)

---

## 1. Concepts

**Worked failure:** Top-of-rack switch A dies (power, crash, or uplink isolation).

### Expected good outcome

| Layer | Behavior |
|-------|----------|
| Dual-homed hosts | LACP/ECMP continues on ToR B |
| Single-NIC hosts | Dark |
| OOB | May survive if separate |
| Storage on same ToR only | Risk if not dual-pathed |

### Classic bad outcome

Both NICs to ToR A; MLAG pair on one PDU; storage and prod sharing the dead box.

---

## 2. Advanced concepts

### Walk order

1. Confirm ToR A down (console/OOB)  
2. LACP/bond status on sample hosts  
3. Spine/ECMP health  
4. Storage/iSCSI paths if any  
5. Replace/RMA with spare optics ready  

Deep: [Fabric-Physical/7](../Fabric-Physical/7_Bonding_MLAG_And_Dual_Home.md), [Fabric-Physical/12](../Fabric-Physical/12_Fabric_Failure_Walks.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Test | Admin-down ToR A in window |
| Audit | Trace both NIC far ends  
| GPU rack | Ensure both NICs + storage paths independent |
| Incident | DOM/optics before “routing broken” |

**Staff checklist**

- Dual-home verified physically  
- ToR A/B power diverse  
- Spare ToR/optics plan  
- Never bond two ports on one ToR as “HA”  

**Good:** rack stays reachable. **Bad:** whole rack dark; fake bond.

---

## References

- [Fabric-Physical/12](../Fabric-Physical/12_Fabric_Failure_Walks.md)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- Vendor ToR HA guides  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
