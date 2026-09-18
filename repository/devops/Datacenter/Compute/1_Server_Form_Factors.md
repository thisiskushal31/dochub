# 1 — Server form factors

[README](./README.md) · [Next: Intel Xeon →](./2_CPU_Platforms_Intel_Xeon.md)

---

## Mental map

![Server anatomy](../../Assets/Datacenter/Compute/server-anatomy.svg)

*What to notice: form factor is a **package deal**—power cords, airflow, BMC, NICs, disks. Imaging and OOB: [Setup/7–9](../Setup-And-Bring-Up/7_OOB_BMC_Plane_Bring_Up.md).*

**Operator experience (verify locally):** Spares hell starts when “2U server” means three incompatible generations on the same shelf.

## 1. Concepts

A **server** is a chassis that packages CPU, memory, storage, NICs, BMC, and power into a rackable (or blade) unit. Form factor decides density, serviceability, and thermal/power headroom.

### Common shapes

| Form | Typical use |
|------|-------------|
| **1U / 2U / 4U rackmount** | General purpose; 2U common for dense GPU/storage |
| **Multi-node (twins/quads)** | Shared power/cooling sleds; high density compute |
| **Blade / chassis** | Shared interconnect and power in a enclosure |
| **OCP / Open Rack** | Hyperscale-oriented mechanicals |
| **Tower / edge mini** | Edge/ROBO—not hall density kings |

### Where it sits

Mounted in cabinets ([White-Space/1](../White-Space/1_Rack_Standards_And_Form_Factors.md)); dual-corded to A/B PDUs; BMC on OOB; NICs to ToR ([Fabric-Physical](../Fabric-Physical/README.md)).

### What “platform” means

OEM **generation + CPU family + board layout** (DIMM slots, PCIe risers, PSU wattage). Mixing generations without SKU discipline creates spares hell ([16](./16_Spares_SKU_Discipline.md)).

---

## 2. Advanced concepts

### Failure modes / selection traps

| Trap | Result |
|------|--------|
| 1U for hot GPU without liquid | Thermal wall |
| Blade fabric lock-in ignored | Surprise interconnect cost |
| Multi-node: one PSU failure domain misunderstood | Bigger blast radius |
| Depth exceeds cabinet | Won’t close doors; service blocked |
| No tool-less drive/fan design on large fleet | MTTR climbs |

### How it connects

```text
Form factor → slot budget ([13](./13_NICs_HBAs_And_Slot_Planning.md))
           → thermal/power ([14](./14_Thermal_And_Power_Of_The_Box.md))
           → accelerators ([Accelerators](../Accelerators/README.md))
```

### Global variants

OCP adoption varies by operator. OEM mainstream 19" remains the colo default worldwide. Match landlord cabinet depth and weight limits before PO.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| General VM host | 2U dual-socket, balanced DIMMs, dual NIC |
| Storage-heavy | 2U/4U drive density + HBA/NVMe plan |
| Dense compute | Multi-node or approved GPU form ([Accelerators](../Accelerators/README.md)) |
| Colo order | Confirm U, depth, weight, rail kit |

**Staff checklist**

- Form matches density + cooling SKU  
- Rail kit correct for cabinet  
- Service path (hot-swap fans/drives) known  
- BMC network planned before racking  
- Never force a chassis into wrong depth rack  

**Good:** SKU-standard fleet, serviceable form, matched cabinet. **Bad:** one-off towers in the hall; GPU in thermally impossible 1U.

---

## References

- [Open Compute Project](https://www.opencompute.org/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [IEC](https://www.iec.ch/) (mechanical structures / rackmount context)  
