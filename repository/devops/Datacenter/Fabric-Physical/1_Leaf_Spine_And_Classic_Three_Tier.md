# 1 — Leaf-spine and classic three-tier

[README](./README.md) · [Next: ToR EoR MoR →](./2_ToR_EoR_MoR.md)

## Mental map

![Leaf-spine sketch](../../Assets/Datacenter/Fabric-Physical/leaf-spine-concept.svg)

*What to notice: every leaf uplinks to every spine; dual-home servers to a ToR pair. Bring-up jobs: [Setup-And-Bring-Up/4](../Setup-And-Bring-Up/4_Switch_Roles_In_Practice.md).*

## 1. Concepts

Hall fabrics are topologies of **failure domains**, not just drawings.

| Topology | Idea |
|----------|------|
| **Leaf-spine** | Every leaf connects to every spine; east-west scales |
| **Three-tier** (access/agg/core) | Classic enterprise; still in brownfield |
| **Collapsed / small** | Edge halls; fewer layers |

Protocols (BGP EVPN, STP, …) → [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Here: **what breaks when a box dies**.

### Where it sits

Leaves at rows ([2](./2_ToR_EoR_MoR.md)); spines in network rows; borders at edge ([6](./6_Border_And_Edge_Roles.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Leaf-spine expectation | Classic miss |
|---------|------------------------|--------------|
| One leaf | Dual-homed hosts OK | Single-homed hosts down |
| One spine | Traffic on remaining spines | Underbuilt spine count |
| Leaf-spine link | ECMP shifts | Polarization/hash issues (protocol book) |
| Entire row power | Leaves dark | Hosts dual-homed to same row pair only |

### How it connects

Dual-home: [7](./7_Bonding_MLAG_And_Dual_Home.md). Optics: [8](./8_Optics_And_Transceiver_Roles.md). Storage fabrics may be separate ([11](./11_Storage_Network_Separation.md)).

### Global variants

Same topologies worldwide. Hyperscaler internals unpublished—learn principles + your diagrams.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Greenfield | Leaf-spine + dual-home hosts |
| Brownfield | Document real failure domains honestly |
| Scale | Add leaves; watch spine oversubscription |
| GPU cluster | Bandwidth plan on spine/leaf early |

**Staff checklist**

- Oversubscription ratios known  
- Host dual-home mapped  
- Spine count vs failure math  
- Drawing matches labels  
- Never assume leaf-spine forgives single NIC hosts  

**Good:** clear domains, dual-home, sized spines. **Bad:** fancy name, single-home; mystery oversubscription.

## References

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [Open Compute Project](https://www.opencompute.org/)  
- Vendor leaf-spine design guides for your platform  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
