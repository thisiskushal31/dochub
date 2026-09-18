# 1 — Role map

[README](./README.md) · [Next: Colo tech day →](./2_Day_In_The_Life_Colo_Tech.md)

## Mental map

![Whole hall layers](../../Assets/Datacenter/Integration/whole-hall-layers.svg)

*What to notice: pick your **layer ownership** first, then the track list below. Adjacent layers are who you page when your screen lies. Big picture: [0c](../0c_Whole_Hall_Mental_Map.md) · bring-up week: [Setup/14](../Setup-And-Bring-Up/14_Role_Playbooks_Bring_Up_Week.md).*

## 1. Concepts

Who needs which Datacenter tracks:

| Role | Core tracks |
|------|-------------|
| **DC / facilities tech** | Electrical, Mechanical, White-Space, tickets, LOTO · bring-up: [Setup/2](../Setup-And-Bring-Up/2_Crate_To_Live_Rack.md) |
| **Critical facilities engineer** | Deeper Electrical+Mechanical, IST, capacity |
| **NOC analyst** | Alarms, escalation ([6](./6_Ticket_Taxonomy_And_Escalation.md)), change calendar · [Setup/14](../Setup-And-Bring-Up/14_Role_Playbooks_Bring_Up_Week.md) |
| **Remote / Smart Hands** | White-Space, Provider-Use hands, photo discipline · [Setup/2–3](../Setup-And-Bring-Up/2_Crate_To_Live_Rack.md) |
| **Structured cabling tech** | White-Space + Fabric physical · [Setup/3](../Setup-And-Bring-Up/3_Structured_Cabling_Bring_Up.md) |
| **Network engineer (DC fabric)** | Fabric-Physical + Networks-Deep-Dive · **start** [Setup-And-Bring-Up/1–6](../Setup-And-Bring-Up/README.md) |
| **Storage admin** | Storage-Physical · [Setup/10–11](../Setup-And-Bring-Up/10_RAID_And_Local_Disk_Setup.md), [13](../Setup-And-Bring-Up/13_Petabyte_Capacity_Thinking.md) |
| **Bare-metal / hypervisor admin** | Compute, Accelerators, imaging · [Setup/7–10](../Setup-And-Bring-Up/7_OOB_BMC_Plane_Bring_Up.md) |
| **Colo customer engineer** | Provider-Use, Markets, contracts |
| **Hyperscale / cloud DC ops** | Same vocabulary; different tooling/secrecy ([12](./12_Hyperscale_Ops_Honesty.md)) |
| **Lab / office / edge WLAN** | [Setup/12](../Setup-And-Bring-Up/12_WLAN_And_AP_Lab_Office_Edge.md) + Networks Wireless |

## 2. Advanced concepts

### Failure modes of role blur

| Blur | Risk |
|------|------|
| NOC doing LOTO | Safety |
| App on-call as only fabric owner | Slow MMR RCA |
| Hands without elevations | Wrong U |
| Bare-metal ignoring hall notices | Surprise outages |

### How it connects

Integration walks are shared literacy. Career paths: [10](./10_Career_Paths.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hire | Map JD to this table |
| Train | Assign track staircase per role |
| Incident | RACI from taxonomy ([6](./6_Ticket_Taxonomy_And_Escalation.md)) |
| Interview | [9](./9_Interview_Pack.md) |

**Staff checklist**

- Role→track map posted for the team  
- Escalation owners named  
- Safety boundaries clear  
- Never assume one person owns plant+BGP+BMC  

**Good:** clear RACI + learning paths. **Bad:** hero culture; unsafe improvisation.

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e)  
- Datacenter track READMEs  
