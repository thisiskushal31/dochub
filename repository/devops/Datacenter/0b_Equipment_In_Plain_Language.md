# 0b — Equipment in plain language

[← How to read](./0_How_To_Read_And_Quality_Bar.md) · [0c whole-hall map](./0c_Whole_Hall_Mental_Map.md) · [README](./README.md) · [On-ramp 1 →](./1_On_Prem_As_A_Solution.md)

## Mental map

![Whole hall layers](../Assets/Datacenter/Integration/whole-hall-layers.svg)

*What to notice: jargon below names pieces **inside** these layers. If a word feels foggy, find which layer it belongs to first.*

## 1. Concepts — the building as a machine

Think of the hall as four machines working together:

1. **Power machine** — electricity from the street to the chip  
2. **Cooling machine** — removes heat the computers make  
3. **Network machine** — moves packets from server to the world  
4. **People/process machine** — badges, tickets, screens, change windows  

If any one fails hard, software fails—even if the code is perfect. Full folder map: [0c](./0c_Whole_Hall_Mental_Map.md).

## 2. Power path (street → chip)

![Power path](../Assets/Datacenter/Electrical/power-path-street-to-chip.svg)

Read top to bottom. Each line is “what it is” in everyday words.

| Name | Plain meaning | Why you care |
|------|---------------|--------------|
| **Utility** | The electric company feed into the site | When the grid dies, something else must take over |
| **Transformer** | Changes voltage to a level the building can use | Wrong voltage = dead or damaged gear |
| **Switchgear / breakers** | Big switches that connect and protect paths | A trip here can darken many racks |
| **ATS / STS** | Automatic chooser between power sources | Decides utility vs generator (or path A vs B) |
| **UPS** | Battery-backed conditioner that bridges short gaps | Covers the seconds/minutes until generators start |
| **Batteries** | Stored energy for the UPS | Old/weak batteries = short bridge |
| **Generator** | Engine that makes electricity when utility is gone | Needs fuel, tests, and time to start |
| **PDU (floor/row)** | Power distribution panel for a row | Often the real kW limit for your racks |
| **Rack PDU** | Power strip built for datacenters (often A and B) | Dual cords must land on **different** PDUs |
| **PSU** | Power supply inside the server | Turns building power into what the motherboard needs |
| **DIMM / CPU** | Memory stick / processor | Where your program’s work happens; needs clean power + cool air |

```text
Street power → transform → protect/switch → UPS+battery → (generator if outage)
    → row PDU → rack PDU A/B → server PSU → chips
```

**Disconfirm:** Two colored cords in one rack PDU is **not** dual power. Two UPS modules in one cabinet on one input is **not** automatically “2N.”

**Confirm:** Can you point to what keeps servers alive for the first minute of a blackout? (UPS+batteries.) What keeps them alive for hours? (Generators + fuel, after transfer.)

Deep track: [Electrical/](./Electrical/README.md). Walk: [Integration/1](./Integration/1_Utility_To_DIMM.md).

## 3. Cooling path (chips → outdoors)

![Heat airflow](../Assets/Datacenter/Mechanical/heat-airflow-loop.svg)

Computers turn almost all electricity into **heat**. Cooling moves that heat away.

| Name | Plain meaning | Why you care |
|------|---------------|--------------|
| **CRAH / CRAC** | Computer-room air unit (fan + coil) | Pushes cold air / takes hot air |
| **Chiller / tower** | Outdoor/plant gear that cools water or rejects heat | When plant dies, CRAHs lose capacity |
| **Hot / cold aisle** | Rack fronts face cold; backs dump hot | Mixing aisles creates hot spots |
| **Containment** | Doors/roofs that keep hot and cold air apart | Wasted air = wasted cooling |
| **Blanking panel** | Plastic filler in empty rack slots | Stops hot air looping to the front |
| **Liquid cooling / CDU** | Coolant to door or chip; distribution unit | Dense GPUs often need this |
| **Leak detection** | Sensors that notice water/coolant | Liquid + electricity = emergency |

**Disconfirm:** “The breaker held” does **not** mean the servers are fine—they can throttle or die from heat with power still on.

**Confirm:** What happens to inlet temperature if blanking panels are missing? (Hot exhaust mixes forward; hotspots.)

Deep track: [Mechanical/](./Mechanical/README.md).

## 4. White space and the rack

![Rack elevation](../Assets/Datacenter/White-Space/rack-elevation-sketch.svg)

| Name | Plain meaning | Why you care |
|------|---------------|--------------|
| **White space** | The room where IT racks live | Your daily workplace in colo |
| **U** | Height unit (~1.75 in); “2U server” | Elevations and tickets use U numbers |
| **Cabinet** | Locked rack with doors | Airflow + security |
| **Elevation** | Map of what sits in which U | Wrong U = wrong work |
| **ToR** | Switch at top of rack | First hop for server network |

Deep: [White-Space/](./White-Space/README.md).

## 5. Network path (server → world)

| Name | Plain meaning | Why you care |
|------|---------------|--------------|
| **NIC** | Network card in the server | Dual NICs should go to two switches |
| **ToR / leaf / spine** | Switches in a modern fabric | Failure domains for packets |
| **OOB** | Out-of-band management network | Talk to BMC when OS/network is dead |
| **BMC** | Tiny always-on computer on the server board | Remote power, sensors, console |
| **MMR** | Meet-me room where carriers interconnect | Where cross-connects land |
| **Cross-connect (XC)** | A cable between two parties in the building | Your link to ISP/cloud/peer |

**Disconfirm:** SSH working through the OS is **not** the same as OOB. When the OS is dead, you need BMC/console.

Deep: [Fabric-Physical/](./Fabric-Physical/README.md). Walk: [Integration/2](./Integration/2_NIC_To_MMR.md).

## 6. Storage in one breath

| Name | Plain meaning |
|------|---------------|
| **DAS** | Disks in/near the server |
| **NAS** | File share over the network (NFS/SMB) |
| **SAN** | Block disks over FC or Ethernet |
| **Snapshot** | Point-in-time on the same system—not offsite backup by itself |
| **Backup** | Independent copy you can restore after disaster/ransomware |

Deep: [Storage-Physical/](./Storage-Physical/README.md).

## 7. Screens that steer the hall (preview)

People do not only walk the floor. They **watch aggregated numbers** and **steer** (decide capacity, maintenance, load shed, tickets).

| System | Plain meaning |
|--------|---------------|
| **EPMS** | Electrical meters and breaker/UPS status on screens |
| **BMS** | Building sensors (cool, leak, sometimes power) |
| **DCIM** | Inventory + capacity + sometimes tickets in one ops view |
| **NOC** | Humans watching alarms and escalating |

Full treatment: [Integration/11](./Integration/11_Aggregate_Telemetry_Reports_And_Steering.md), [Jobs/13](./Jobs/13_Reading_Dashboards_Reports_And_Steering.md).

## 8. Applications

| Goal | Pattern |
|------|---------|
| First tour | Carry this glossary; match names to rooms |
| Study | Cover the table, explain each row aloud |
| Ticket | Use plain meaning + U/serial, not slang only |

**Confirm**

1. UPS vs generator—who covers seconds vs hours?  
2. Why blanking panels matter even if power is fine?  
3. What is OOB for?  
4. Why is a snapshot not enough for ransomware?

**Disconfirm**

- Equinix is **not** the same kind of company as Linode ([Markets](./Markets-And-Operators/README.md)).  
- A green LED wall is **not** proof of dual path independence.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
