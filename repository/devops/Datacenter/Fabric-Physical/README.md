# Fabric-Physical

[← Datacenter](../README.md)

Physical network gear and roles in the hall: ToR/leaf, spine, OOB, MMR, optics, LB appliances. **Protocols** (BGP, spanning-tree deep): [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Survey on-ramp: [../5_Fabric_Cross_Connect_And_OOB.md](../5_Fabric_Cross_Connect_And_OOB.md).

### Chapter structure

Concepts → Advanced → Applications → References (official only).

## Chapters

| # | File | Focus | Status |
|---|------|--------|--------|
| 1 | [Leaf-spine and classic three-tier](./1_Leaf_Spine_And_Classic_Three_Tier.md) | Topologies as failure domains | **filled** |
| 2 | [ToR, EoR, and MoR](./2_ToR_EoR_MoR.md) | Placement; cabling length | **filled** |
| 3 | [OOB management network](./3_OOB_Management_Network.md) | BMC/PDU plane; separation rules | **filled** |
| 4 | [Provisioning network](./4_Provisioning_Network.md) | PXE/DHCP plane; not prod | **filled** |
| 5 | [MMR and cross-connect physical](./5_MMR_And_Cross_Connect_Physical.md) | Meet-me; LOA/CFA physical | **filled** |
| 6 | [Border and edge roles](./6_Border_And_Edge_Roles.md) | Border routers; firewalls as devices | **filled** |
| 7 | [Bonding, MLAG, and dual-home](./7_Bonding_MLAG_And_Dual_Home.md) | LACP; ToR pair failure | **filled** |
| 8 | [Optics and transceiver roles](./8_Optics_And_Transceiver_Roles.md) | Optics sparing; DOM | **filled** |
| 9 | [Load balancer appliances](./9_Load_Balancer_Appliances.md) | Hardware LB; VIP landing | **filled** |
| 10 | [DNS and NTP physical placement](./10_DNS_NTP_Physical_Placement.md) | Where time and DNS boxes sit | **filled** |
| 11 | [Storage network separation](./11_Storage_Network_Separation.md) | FC vs Ethernet storage VLANs/fabrics | **filled** |
| 12 | [Fabric failure walks](./12_Fabric_Failure_Walks.md) | Lose ToR; lose MMR; OOB down | **filled** |

Landlord interconnect *products* (Fabric portals, order jobs): [Provider-Use/](../Provider-Use/README.md).

Visual start: [ch1 mental map](./1_Leaf_Spine_And_Classic_Three_Tier.md) · plate [`leaf-spine-concept.svg`](../../Assets/Datacenter/Fabric-Physical/leaf-spine-concept.svg) · whole hall [0c](../0c_Whole_Hall_Mental_Map.md).

## Related

- [White-Space/](../White-Space/README.md) · [Storage-Physical/](../Storage-Physical/README.md) · [Provider-Use/](../Provider-Use/README.md) · Networks-Deep-Dive  
