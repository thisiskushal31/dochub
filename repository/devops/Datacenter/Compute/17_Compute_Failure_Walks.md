# 17 — Compute failure walks

[← Previous](./16_Spares_SKU_Discipline.md) · [README](./README.md) · [Next: Hypervisor map →](./18_Hypervisor_On_The_Box_Map.md)

## 1. Concepts

A **compute failure walk** traces a dead or sick node from symptom → BMC/sensors → hardware layer → hall dependencies (power/cool/net).

Method matches electrical/mechanical walks: name the object, expected alarms, blast radius, human action.

## 2. Advanced concepts

### Walk library

| Failure | First checks | Classic miss |
|---------|--------------|--------------|
| **Node down, BMC up** | Console; boot target; panic; disk | Reboot loop without logs |
| **BMC unreachable** | OOB switch/port; creds; PSU standby | Assume motherboard dead too early |
| **Host up, app slow** | NUMA/remote mem; throttle; NIC errors | Blindly add CPU |
| **Correctable ECC storm** | Which DIMM; reseat/replace | Ignore until uncorrectable |
| **Uncorrectable MCA** | Blacklist DIMM/CPU; RMA | Keep in pool |
| **PSU redundancy lost** | PDU cord map | Run until A dies |
| **Thermal throttle** | Inlet vs fan vs hall CRAH | RMA CPU in hot aisle |
| **NIC flap** | Optics/DAC; ToR; AER | Reimage OS first |
| **Won’t PXE** | VLAN/DHCP; Secure Boot; boot order | Blame image server only |
| **Post-firmware brick symptoms** | Rollback train; crash cart | More flashing |

### Independence checklist

- Dual PSU ≠ dual ToR  
- Dual ToR ≠ dual power  
- BMC up ≠ data plane up  

### How it connects

Power: [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md). Cooling: [Mechanical/11](../Mechanical/11_Mechanical_Failure_Walks.md). Fabric: Fabric-Physical failure chapters (Batch 6). Roles: [Jobs](../Jobs/README.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| On-call | Laminated walk order: power → BMC → console → hardware → net |
| Tabletop | Dead DIMM + lost PDU A together |
| Colo | Remote hands photo + serial before dispatch spare |
| RCA | Timeline BMC events vs switch vs CRAH |

**Staff checklist**

- Know OOB path for every SKU  
- Spare parts mapped to walks  
- Don’t skip thermal/power before silicon RMA  
- Capture `lscpu`/sensor evidence  
- Never power-cycle clusters as first step without blast-radius check  

**Good:** layered walks, evidence-first. **Bad:** reimage as culture; ignore BMC SEL; blame “software” for lost PDU A.

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- OEM troubleshooting guides (SEL/MCA interpretation)  
- Linux crash/dump documentation  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series) (thermal context)  
