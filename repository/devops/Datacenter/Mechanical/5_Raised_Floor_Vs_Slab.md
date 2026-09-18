# 5 — Raised floor vs slab

[← Previous](./4_Containment_Hot_And_Cold_Aisle.md) · [README](./README.md) · [Next: Liquid cooling →](./6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md)

## 1. Concepts

White-space floors are usually one of:

| Type | Typical air strategy |
|------|----------------------|
| **Raised floor** | Underfloor supply plenum; perforated tiles in cold aisle |
| **Slab** | Overhead supply or in-row; cable trays overhead |

Neither is “more Tier.” Both can be excellent or miserable depending on sealing, loading, and cable practice.

### Where it sits

Raised floor: pedestals, stringers, tiles; underfloor power/data in older designs. Slab: structural concrete; services overhead or in galleries.

### What IT must care about

| Topic | Why |
|-------|-----|
| **Floor loading (psf / kN/m²)** | Batteries, liquid doors, GPU racks are heavy |
| **Tile cutouts** | Cable openings = bypass air if unsealed |
| **Ramp / lift path** | How iron enters |
| **Leak path** | Water under raised floor spreads ([7](./7_Leak_Detection_And_Fluid_Risk.md)) |

## 2. Advanced concepts

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Too many open / perforated tiles | Low static pressure | Distant racks starve |
| Blocked underfloor (cables/junk) | Same | Same |
| Broken pedestal / overloaded tile | Safety hazard; tilt | Injury + gear risk |
| Slab with underfloor mentality | Wrong “fixes” | Wasted effort |
| Ignoring overhead obstructions | Uneven supply | Hot spots |

### How it connects

Power distribution may be underfloor cable or overhead busway ([Electrical/9](../Electrical/9_Busway_Vs_Cable_Distribution.md)). Liquid manifolds may run overhead or in galleries. Floor choice constrains all of them.

### Modern trend literacy

Many high-density halls prefer **slab + overhead** for airflow predictability and cable management. Raised floor remains common worldwide—skills transfer; do not insult the floor type, seal it correctly.

### Global variants

Seismic pedestals, humidity effects on tiles, and flood risk differ by metro. Coastal and monsoon sites make underfloor leak detection non-optional.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Place GPU rack | Check floor loading and cooling type first |
| Airflow complaint on raised floor | Static pressure + tile map + cable dams |
| Deploy on slab | Confirm overhead supply/containment design |
| Move/add cables | Reseal every cutout |

**Staff checklist**

- Know floor type and design supply path  
- Perforated tile map matches cold aisle  
- Weight limits for dense SKUs  
- Underfloor kept clear of debris  
- Never “borrow” tiles from another aisle permanently  

**Good:** managed tile map, sealed cutouts, known loading. **Bad:** random perforations; cable landfill underfloor; overweight rack “because it fit.”

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75)  
