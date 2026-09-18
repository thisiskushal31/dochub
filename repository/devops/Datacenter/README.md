# Datacenter

How software lands on **metal and in a hall**: physical plant, colo and wholesale landlords, compute platforms, how to use landlord environments, and the knowledge base for DC and bare-metal work—**globally**. *Not a public-cloud IAM textbook. Not kubeadm internals. Not nginx.*

| Need | Where |
|------|--------|
| Named **API cloud** / VPS tenant use (AWS, GCP, Azure, Linode/Akamai, …) | [Cloud/](../Cloud/README.md) |
| What Kubernetes / OpenShift / Rancher *are* | [Containerization](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| Packets, BGP, IX *on the wire* | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Host web tier | [Servers/](../Servers/README.md) |
| Config of hosts | [Automation/](../Automation/README.md) |
| Pipelines onto metal/VMs | [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md), [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md) |

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only). No Archive paths. No author-process narrative.

**Quality bar (accessibility):** define every term on first use in plain language; **mental map + asset plate** for physical topics; **Disconfirm** common myths; **Confirm** with short self-checks; show where the thing sits and why IT cares. Start here if you are new: [0 — How to read](./0_How_To_Read_And_Quality_Bar.md) · [0b — Equipment in plain language](./0b_Equipment_In_Plain_Language.md) · [0c — Whole hall mental map](./0c_Whole_Hall_Mental_Map.md).

### Staircase

```text
Floor −1 How to read + plain glossary + whole-hall map →  0, 0b, 0c
Floor 0  On-ramp 1–12     →  estate, hall survey, hypervisor, deploy, DR
Floor 1  Facility         →  site types, tiers, rooms, business models
Floor 2  Electrical       →  utility → rack PDU (device encyclopedia)
Floor 3  Mechanical       →  cooling, liquid, fire, water
Floor 4  White-Space      →  racks, cabling, density
Floor 5  Compute          →  servers, CPU, chipset, memory, NUMA, BMC
Floor 6  Accelerators     →  GPU, DPU, FPGA, optics, rare gear
Floor 7  Storage-Physical →  DAS/SAN/NAS/object iron + paths
Floor 8  Fabric-Physical  →  ToR/spine, MMR, OOB, optics
Floor 8b Setup-And-Bring-Up →  rack→cable→LAN→OOB→image→RAID (**how engineers build**)
Floor 9  Markets          →  operator kinds, regions, how halls are built/run
Floor 10 Provider-Use     →  order capacity, interconnect, remote hands, portals
Floor 11 Integration      →  end-to-end diagrams, failure walks, **reports & steering**
Floor 12 Jobs             →  role knowledge base + **reading dashboards**
```

**Suggested path:** If terms feel dense → **0 → 0b → 0c**, then on-ramp **1 → 12**. For **hands-on build literacy**, climb [Setup-And-Bring-Up/](./Setup-And-Bring-Up/README.md) early (after on-ramp 3–6). Add [Integration/11](./Integration/11_Aggregate_Telemetry_Reports_And_Steering.md) for aggregates. Then deep tracks by role ([Jobs/1](./Jobs/1_Role_Map.md)).

**Visual plates:** [Assets/Datacenter/](../Assets/Datacenter/README.md) — power, cool, rack, fabric, RAID, whole-hall layers. Each deep-track chapter **1** opens with a mental map.

## Floor −1 — Plain language (start here if needed)

| # | File | Focus |
|---|------|--------|
| 0 | [How to read + quality bar](./0_How_To_Read_And_Quality_Bar.md) | How chapters work; maps/assets; Disconfirm/Confirm; first-week path |
| 0b | [Equipment in plain language](./0b_Equipment_In_Plain_Language.md) | Power, cool, rack, net, storage, screens—without jargon fog |
| 0c | [Whole hall mental map](./0c_Whole_Hall_Mental_Map.md) | Five layers; which folder owns which; where to start by goal |

## Floor 0 — On-ramp (SE / first week)

| # | File | Focus | Go deeper |
|---|------|--------|-----------|
| 1 | [On-prem as a solution](./1_On_Prem_As_A_Solution.md) | Why metal exists; vs IaaS | [Facility/](./Facility/README.md), [Markets](./Markets-And-Operators/README.md) |
| 2 | [Ownership, colo, and contracts](./2_Ownership_Colo_And_Contracts.md) | Who owns building, iron, OS, app | [Provider-Use/](./Provider-Use/README.md), [Markets](./Markets-And-Operators/README.md) |
| 3 | [Facility, power, cooling, rooms](./3_Facility_Power_Cooling_And_Rooms.md) | Building as a product (survey) | [Facility/](./Facility/README.md), [Electrical/](./Electrical/README.md), [Mechanical/](./Mechanical/README.md) |
| 4 | [Rack, BMC, and provisioning](./4_Rack_BMC_And_Provisioning.md) | U, PDU, OOB, PXE/Redfish (survey) | [White-Space/](./White-Space/README.md), [Compute/](./Compute/README.md) |
| 5 | [Fabric, cross-connect, and OOB](./5_Fabric_Cross_Connect_And_OOB.md) | How packets leave the cage (survey) | [Fabric-Physical/](./Fabric-Physical/README.md), [Provider-Use/](./Provider-Use/README.md) |
| 6 | [Storage, backup, and restore](./6_Storage_Backup_And_Restore.md) | DAS/NAS/SAN/SDS (survey) | [Storage-Physical/](./Storage-Physical/README.md) |
| 7 | [VMware vSphere](./7_VMware_vSphere.md) | ESXi, vCenter, HA/DRS, Tanzu | [Compute/](./Compute/README.md), [Jobs/](./Jobs/README.md) |
| 8 | [Other hypervisors and private IaaS](./8_Other_Hypervisors_And_Private_IaaS.md) | KVM, Hyper-V, OpenStack, Stack/Outposts | [Compute/](./Compute/README.md), [Markets](./Markets-And-Operators/README.md) |
| 9 | [Deploy on the estate](./9_Deploy_On_The_Estate.md) | Metal OS, VM fleets, change windows | [Jobs/](./Jobs/README.md), [Provider-Use/](./Provider-Use/README.md) |
| 10 | [Clusters on-prem](./10_Clusters_On_Prem.md) | kubeadm / OpenShift / Rancher map | Containerization (depth) |
| 11 | [Identity, access, and change](./11_Identity_Access_And_Change.md) | IdP, jump, BMC, CAB | [Jobs/](./Jobs/README.md), [Provider-Use/](./Provider-Use/README.md) |
| 12 | [Sites, DR, hybrid, and the job](./12_Sites_DR_Hybrid_And_The_Job.md) | Two buildings, hybrid SKUs, first week | [Integration/](./Integration/README.md), [Jobs/](./Jobs/README.md) |

## Deep tracks (physical depth)

| Track | README | Status |
|-------|--------|--------|
| [Facility/](./Facility/README.md) | Site types, tiers, rooms, models | **filled** (6) |
| [Electrical/](./Electrical/README.md) | Utility → rack PDU encyclopedia | **1 filled** (18) |
| [Mechanical/](./Mechanical/README.md) | Cooling, liquid, fire, water | **2 filled** (12) |
| [White-Space/](./White-Space/README.md) | Racks, cabling, density | **3 filled** (10) |
| [Compute/](./Compute/README.md) | CPU, chipset, memory, NUMA, BMC | **4 filled** (18) |
| [Accelerators/](./Accelerators/README.md) | GPU, DPU, FPGA, rare gear | **5 filled** (10) |
| [Storage-Physical/](./Storage-Physical/README.md) | Arrays, fabrics, paths | **6 filled** (12) |
| [Fabric-Physical/](./Fabric-Physical/README.md) | ToR, spine, MMR, OOB, optics | **6 filled** (12) |
| [Setup-And-Bring-Up/](./Setup-And-Bring-Up/README.md) | How engineers rack, cable, LAN, image, RAID | **filled** (15) |
| [Markets-And-Operators/](./Markets-And-Operators/README.md) | Operator kinds, regions, build/run | **7 filled** (16) |
| [Provider-Use/](./Provider-Use/README.md) | Order, interconnect, hands, portals | **7 filled** (10) |
| [Integration/](./Integration/README.md) | End-to-end + failure walks + **reports/steering** | **filled** (11) |
| [Jobs/](./Jobs/README.md) | Role knowledge base + **dashboards** | **filled** (13) |

All deep-track chapter bodies filled (Batches 1–8 + Facility in Batch 9). Navigation contract = track READMEs.

**Operator awareness (majors + minor/regional):** living index lives in the private syllabus Part E (not this public tree)—so DocHub stays a handbook, not a phone book. Public Markets track teaches taxonomy + research method + peer hubs.

## Cross-links

- Cloud (API tenant + advanced how-to): [Cloud/](../Cloud/README.md) (esp. [15–22](../Cloud/README.md))  
- Colo on-ramp from cloud: [Provider-Use/7](./Provider-Use/7_Land_Cloud_On_Ramp.md) · [Cloud/17](../Cloud/17_Private_Connectivity_And_On_Ramps.md) · [Cloud/22](../Cloud/22_Hybrid_Colo_And_Cloud.md)  
- IaC: [IAC/](../IAC/README.md)  
- Self-managed Kubernetes: [Kubernetes 6–7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)  
- OpenShift: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)  
- Rancher: [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher)  
