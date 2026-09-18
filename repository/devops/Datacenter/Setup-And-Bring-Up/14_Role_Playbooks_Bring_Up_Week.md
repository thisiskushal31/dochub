# 14 — Role playbooks: bring-up week

[← Previous](./13_Petabyte_Capacity_Thinking.md) · [README](./README.md) · [Next: Failure walks →](./15_Bring_Up_Failure_Walks.md)

## Mental map

```text
Facilities / hands     Network eng          Bare-metal           Storage
   rack+power    →    leaf/VLAN/LACP   →   BMC+image+OS    →   fabric+LUN
         ↘________________ daily stand-up / change calendar ________________↙
```

Role index: [Jobs/1](../Jobs/1_Role_Map.md).

## 1. Concepts — who does what during bring-up

| Role | Bring-up week focus | Setup chapters |
|------|---------------------|----------------|
| **Remote / Smart Hands** | Rails, labels, photos, cable dress, serials | [2](./2_Crate_To_Live_Rack.md), [3](./3_Structured_Cabling_Bring_Up.md) |
| **Network eng (DC fabric)** | Leaf/spine, VLANs, port profiles, border | [4](./4_Switch_Roles_In_Practice.md)–[6](./6_LAN_Segmentation_Jobs.md) |
| **Bare-metal admin** | BMC, firmware, image, OS disks | [7](./7_OOB_BMC_Plane_Bring_Up.md)–[10](./10_RAID_And_Local_Disk_Setup.md) |
| **Storage admin** | Fabric, zones, multipath, datastores | [11](./11_Storage_Network_And_Array_Bring_Up.md), [13](./13_Petabyte_Capacity_Thinking.md) |
| **Facilities** | Power/cool capacity, IST awareness | Electrical/Mechanical tracks |
| **NOC** | Alarms for new gear, change calendar | [Jobs/4](../Jobs/4_Day_In_The_Life_NOC.md), [Jobs/13](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md) |

**Disconfirm:** One “full stack” hero doing LOTO + BGP + RAID without tickets is **not** a process.

**Confirm:** Who owns the switchport VLAN flip after imaging?

## 2. Advanced — sample daily rhythm (bring-up)

| Day | Network | Bare-metal | Hands |
|-----|---------|------------|-------|
| 1 | Leaf pair live; uplinks | BMC inventory | Rack first 10 chassis |
| 2 | Port profiles pxe/prod | Firmware baseline | Cable A/B |
| 3 | DHCP helpers | Image 2 pilots | Label verify |
| 4 | Prod flip automation | Scale image | Rear photos |
| 5 | Border/firewall zones | Hand to app owners | Spares shelf |

### Operator experience

Stand-ups beat chat sprawl during bring-up. Freeze unrelated hall changes. Keep a single shared elevation + VLAN matrix as source of truth.

## 3. Applications

**Staff checklist:** RACI for VLAN flip; shared DCIM; end-of-day photo evidence; NOC informed of new SNMP targets.

## References

- [Jobs/1 Role map](../Jobs/1_Role_Map.md) · [Jobs/2–5 day-in-life](../Jobs/README.md)  
- This track README  
