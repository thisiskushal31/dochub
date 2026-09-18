# 1 — Rack standards and form factors

[README](./README.md) · [Next: Cabinet airflow →](./2_Cabinet_Airflow_And_Chimneys.md)

---

## Mental map

![Rack elevation sketch](../../Assets/Datacenter/White-Space/rack-elevation-sketch.svg)

*What to notice: the rack is the **unit of work**—U numbers, A/B PDUs, ToR, patch. Elevation must match reality or remote hands will land the wrong U. Bring-up: [Setup/2](../Setup-And-Bring-Up/2_Crate_To_Live_Rack.md).*

**Operator experience (verify locally):** Photos of the elevation after every change beat arguments with last week’s spreadsheet.

## 1. Concepts

White space is organized around **racks** (open frames) and **cabinets** (enclosed). Most IT gear mounts in a **19-inch** EIA/IEC rail opening; height is measured in **U** (1 U ≈ 1.75 in / 44.45 mm).

### What you buy

| Form | Traits |
|------|--------|
| **Open frame (2-post / 4-post)** | Cheap, open airflow, less security/noise control |
| **Cabinet (4-post enclosed)** | Doors, side panels, locks, cable managers, PDU mounts |
| **OCP / Open Rack** | Wider/different rail ecosystems; common in some hyperscale/OEM lines |

### Critical dimensions

| Spec | Why it matters |
|------|----------------|
| **Width (19")** | Rail opening standard |
| **Height (42U / 45U / 48U…)** | How much gear fits |
| **Depth (1000–1200 mm+)** | Deep servers, cable bend radius, rear PDUs |
| **Rail kit / square-hole vs round** | Mounting hardware must match |
| **Load rating** | Static/dynamic weight limits |

### Where it sits

Bolted or braced to slab/raised floor; aligned in hot/cold aisles; bonded to ground ([Electrical/12](../Electrical/12_Grounding_Bonding_And_Surge.md)).

---

## 2. Advanced concepts

### Failure modes / install traps

| Trap | Result |
|------|--------|
| Wrong depth cabinet | Doors won’t close; cables crushed |
| Rails not square / wrong U alignment | Ears bend; gear won’t slide |
| Mixing hole types without cage nuts | Soft mounts, vibration |
| Ignoring OEM rail kit | Server unsupported mid-chassis |
| Unbonded cabinet | Safety + ESD risk |

### How it connects

```text
Cabinet → rack PDUs ([Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md))
       → servers ([Compute](../Compute/README.md))
       → ToR/patch ([Fabric-Physical](../Fabric-Physical/README.md))
       → airflow/containment ([Mechanical/4](../Mechanical/4_Containment_Hot_And_Cold_Aisle.md))
```

### Global variants

EIA-310 / IEC 60297 families are the global 19" story. OCP deployments are operator-specific. Always match **this site’s** standard cabinet SKU in colo (landlord may mandate make/model).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Order colo cabinets | Confirm U, depth, PDU mount, perforation, lock type |
| Rack a deep GPU server | Depth + rear clearance + weight ([3](./3_Power_Density_And_Floor_Loading.md)) |
| Migrate from open frame | Plan cable managers and door airflow |
| Remote hands | Specify U position, rail type, and photo of rails |

**Staff checklist**

- Cabinet SKU matches gear depth and weight  
- Rails torqued and U markings visible  
- Cage nuts/rails correct for chassis  
- Ground bond present  
- Never force a chassis “because it almost fits”  

**Good:** standard SKU, labeled U, correct rail kits. **Bad:** mixed depths, unmarked U, floating unbonded frames.

---

## References

- [EIA / ECIA standards overview](https://www.ecianow.org/) (rack/cabinet dimensional heritage)  
- [IEC](https://www.iec.ch/) (IEC 60297 mechanical structures family)  
- [Open Compute Project](https://www.opencompute.org/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
