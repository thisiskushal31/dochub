# 0c — Whole hall mental map (start here for the big picture)

[← How to read](./0_How_To_Read_And_Quality_Bar.md) · [0b Equipment](./0b_Equipment_In_Plain_Language.md) · [README](./README.md) · [Setup bring-up →](./Setup-And-Bring-Up/README.md)

---

## Mental map

![Whole hall layers](../Assets/Datacenter/Integration/whole-hall-layers.svg)

*What to notice: software only runs if **all five layers** work. Learning one layer in isolation is how people get surprised on the floor.*

```text
POWER  →  COOLING  →  RACKS + SERVERS  →  NETWORK + STORAGE PLANES  →  PEOPLE + SCREENS
   Electrical           Mechanical     White-Space/Compute    Fabric/Storage/Setup      Jobs/Integration
```

---

## 1. Concepts — the whole product

A **datacenter** (or a colo cage inside one) is a machine that sells four promises to computers: **power, cool, connect, protect**—continuously. Your job, depending on role, is usually only one slice; **outages cross slices**.

| Layer | Track home | “Done” looks like |
|-------|------------|-------------------|
| Power | [Electrical/](./Electrical/README.md) | Dual path tested; EPMS tells truth |
| Cooling | [Mechanical/](./Mechanical/README.md) | Inlets in band; containment intact |
| Space + iron | [White-Space/](./White-Space/README.md), [Compute/](./Compute/README.md) | Elevation matches reality; BMC reachable |
| Packets + disks | [Fabric-Physical/](./Fabric-Physical/README.md), [Storage-Physical/](./Storage-Physical/README.md) | Dual-home; multipath; MMR known |
| Build / operate | [Setup-And-Bring-Up/](./Setup-And-Bring-Up/README.md), [Jobs/](./Jobs/README.md) | Rack→image playbook; tickets classed |

**Disconfirm:** Knowing Kubernetes is **not** knowing the hall. A Tier sticker is **not** a substitute for walking paths.

**Confirm:** Name the five layers. Which track do you open first for *your* role ([Jobs/1](./Jobs/1_Role_Map.md))?

---

## 2. How the folders fit (no boredom path)

| If you want… | Go |
|--------------|-----|
| Pictures + plain words | [0b](./0b_Equipment_In_Plain_Language.md) |
| **How to build** (rack→LAN→RAID) | [Setup-And-Bring-Up/](./Setup-And-Bring-Up/README.md) |
| End-to-end walk | [Integration/1 Utility→DIMM](./Integration/1_Utility_To_DIMM.md) |
| Screens → decisions | [Integration/11](./Integration/11_Aggregate_Telemetry_Reports_And_Steering.md) |
| Day job by role | [Jobs/](./Jobs/README.md) |

Every deep chapter should show a **mental map** and, for physical gear, an **Asset** plate. If one does not, that is a gap—not your fault.

---

## 3. Applications

**Staff checklist for newcomers:** print or save the whole-hall SVG; tick which layer you own; pair with the owner of the adjacent layer before your first change window.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/) · [TIA-942](https://tiaonline.org/standard/tia-942/) · [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- SVG: handbook `Assets/Datacenter/Integration/whole-hall-layers.svg`  
