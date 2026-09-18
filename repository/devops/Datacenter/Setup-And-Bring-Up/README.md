# Setup and Bring-Up

[← Datacenter](../README.md)

How engineers **actually stand up** a hall or cage: rack → cable → switch/gateway/LAN → OOB → server → image → disks/storage → (lab/office) WLAN—and what each role does day to day during bring-up.

**Not** a vendor CLI encyclopedia. Protocol/RF depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Device encyclopedias: [Fabric-Physical/](../Fabric-Physical/README.md), [Compute/](../Compute/README.md), [Storage-Physical/](../Storage-Physical/README.md), [White-Space/](../White-Space/README.md).

### Chapter structure

Concepts → Advanced → Applications → References (official only).

**Visual bar:** every chapter has a **Mental map** near the top and at least one **Asset photo/diagram** (see [Assets/Datacenter](../../Assets/Datacenter/README.md)).

**Experience bar:** **Operator experience (verify locally)** when lore helps—Disconfirm myths; never treat Reddit as a standard.

**Whole hall first:** [0c](../0c_Whole_Hall_Mental_Map.md) if you need the five-layer picture before planes and playbooks.

## Chapters

| # | File | Focus | Status |
|---|------|--------|--------|
| 1 | [Hall network mental map](./1_Hall_Network_Mental_Map.md) | Edge/AP vs LAN vs OOB vs storage vs MMR | **filled** |
| 2 | [Crate to live rack](./2_Crate_To_Live_Rack.md) | Receive, rails, U plan, labels | **filled** |
| 3 | [Structured cabling bring-up](./3_Structured_Cabling_Bring_Up.md) | Copper/fiber, test, docs | **filled** |
| 4 | [Switch roles in practice](./4_Switch_Roles_In_Practice.md) | ToR/leaf, spine—physical + first config | **filled** |
| 5 | [Gateway border firewall boxes](./5_Gateway_Border_Firewall_Boxes.md) | Edge boxes; HA; → Networks | **filled** |
| 6 | [LAN segmentation jobs](./6_LAN_Segmentation_Jobs.md) | Provisioning vs prod; PXE VLAN flip | **filled** |
| 7 | [OOB BMC plane bring-up](./7_OOB_BMC_Plane_Bring_Up.md) | Mgmt DHCP, Redfish, separation | **filled** |
| 8 | [Server setup playbook](./8_Server_Setup_Playbook.md) | PDU A/B, NICs, BMC, firmware, boot | **filled** |
| 9 | [Imaging path](./9_Imaging_Path.md) | PXE vs virtual media vs Ironic/MAAS | **filled** |
| 10 | [RAID and local disk setup](./10_RAID_And_Local_Disk_Setup.md) | Levels, HW vs SW, procedures | **filled** |
| 11 | [Storage network and array bring-up](./11_Storage_Network_And_Array_Bring_Up.md) | FC/iSCSI paths, zoning, multipath | **filled** |
| 12 | [WLAN and AP lab office edge](./12_WLAN_And_AP_Lab_Office_Edge.md) | AP, PoE, SSID→gateway; RF → Networks | **filled** |
| 13 | [Petabyte capacity thinking](./13_Petabyte_Capacity_Thinking.md) | Shelf math, erasure vs RAID, bandwidth | **filled** |
| 14 | [Role playbooks bring-up week](./14_Role_Playbooks_Bring_Up_Week.md) | Network, bare-metal, storage, hands | **filled** |
| 15 | [Bring-up failure walks](./15_Bring_Up_Failure_Walks.md) | Wrong VLAN, single path, RAID myths | **filled** |

## Related

- [Jobs/1 Role map](../Jobs/1_Role_Map.md) · [Fabric-Physical/](../Fabric-Physical/README.md) · [White-Space/](../White-Space/README.md)  
- [Networks Advanced Wireless](https://github.com/thisiskushal31/Networks-Deep-Dive/blob/main/Advanced/5_Wireless_Special_Networks.md)  
