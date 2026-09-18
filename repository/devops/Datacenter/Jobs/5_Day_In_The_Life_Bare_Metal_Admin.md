# 5 — Day in the life: bare-metal admin

[← Previous](./4_Day_In_The_Life_NOC.md) · [README](./README.md) · [Next: Ticket taxonomy →](./6_Ticket_Taxonomy_And_Escalation.md)

---

## 1. Concepts

The **bare-metal / hypervisor admin** (“hypervisor killer” track consumer) owns BMC, firmware, imaging, OS/hypervisor health—and must still respect hall physics.

### Typical loop

| Block | Work |
|-------|------|
| Fleet health | BMC sensors, failed PSU/DIMM, firmware drift |
| Provision | Image pipelines ([Compute/15](../Compute/15_Imaging_And_Provisioning_At_Scale.md)) |
| Change | Firmware trains, BIOS, NIC  
| Incidents | Console via OOB; NUMA/power before app blame |
| Colo | Hands tickets with serial/U; notice calendar |

Tracks: Compute, Accelerators, on-ramp 7–11, Provider-Use when colo.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Ignoring facility notices | Self-inflicted outages |
| Reimage before power path check | Waste |
| Snowflake firmware | Heisenbugs |
| No OOB | Travel required |

### How it connects

Compute failure walks [Compute/17](../Compute/17_Compute_Failure_Walks.md). Integration PDU/ToR failures. Hypervisor map [Compute/18](../Compute/18_Hypervisor_On_The_Box_Map.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New node | SKU checklist + image + elevation  
| DIMM alarm | Evidence → spare → re-image if needed |
| GPU row | Power/cool gate with facilities  
| HA event | Hardware/BMC before only vCenter blame |

**Staff checklist**

- OOB always first path  
- Firmware train pinned  
- Hall calendar on your calendar  
- Never dual-cord both PSUs to A “temporarily”  

**Good:** metal pipeline + hall awareness. **Bad:** app-only debugging; USB heroes.

---

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [Compute/](../Compute/README.md)  
- On-ramp [7](../7_VMware_vSphere.md)–[10](../10_Clusters_On_Prem.md)  
- [Provider-Use/5](../Provider-Use/5_Remote_Hands_Tickets.md)  
