# 7 — Asset tags, serials, and elevations

[← Previous](./6_Cable_Management_And_Pathways.md) · [README](./README.md) · [Next: Crash cart →](./8_Crash_Cart_KVM_And_Serial_Aggregation.md)

## 1. Concepts

If you cannot name **which serial is in which U**, you do not own the estate—you rent chaos. **Asset tags**, **serial numbers**, and **rack elevations** are the inventory truth that tickets, remote hands, and audits use.

### Core records

| Record | Holds |
|--------|-------|
| **Asset tag** | Your ID (barcode/RFID) |
| **OEM serial / service tag** | Vendor RMA identity |
| **Rack elevation** | U position, facing, model, power feeds |
| **Port map** | NIC/port → patch panel/ToR |
| **Photo evidence** | Before/after for change |

### Where it sits

Tags on chassis front; elevations in DCIM/CMDB/spreadsheet (truth must be one place); labels on cables ([4](./4_Structured_Cabling_Copper.md), [5](./5_Structured_Cabling_Fiber_MPO_MTP.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Tag ≠ serial in DB | RMA/wrong host downtime |
| Elevation drift after MACs | Remote hands pulls wrong U |
| Duplicate asset tags | Billing and audit fail |
| No photos | Disputes with colo hands |
| “Temporary” unlabeled gear | Becomes permanent ghost |

### Change evidence pattern

1. Ticket with rack/U/serial  
2. Photo before  
3. Work  
4. Photo after (cables, blanking, PDU cords)  
5. Update elevation/DCIM same day  

This is how Provider-Use remote-hands jobs stay safe ([Provider-Use](../Provider-Use/README.md)).

### How it connects

BMC/iLO/iDRAC inventory should match the tag ([Compute](../Compute/README.md)). Fabric port inventories match elevations ([Fabric-Physical](../Fabric-Physical/README.md)).

### Global variants

Colo landlords may require their cage inventory format. Your CMDB still needs OEM serials for break/fix.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Break/fix | Serial from elevation → RMA → reseat same U |
| Audit | Scan tags vs DCIM; fix deltas same shift |
| Incident | Confirm hostname↔serial↔U before reboot |
| Decommission | Wipe tags, update elevation, remove cables |

**Staff checklist**

- One source of truth for elevations  
- Tags readable from aisle  
- Serial captured at unbox  
- MAC updates include DCIM  
- Never leave “unknown” in production racks  

**Good:** scan-matched elevations, photo evidence, same-day updates. **Bad:** mystery boxes; spreadsheet from 2019; wrong U remote power cycle.

## References

- [TIA-606](https://tiaonline.org/) (administration/labeling standards family)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish) (hardware inventory via BMC)  
