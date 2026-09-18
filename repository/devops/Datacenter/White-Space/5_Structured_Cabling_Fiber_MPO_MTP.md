# 5 — Structured cabling: fiber and MPO/MTP

[← Previous](./4_Structured_Cabling_Copper.md) · [README](./README.md) · [Next: Cable management →](./6_Cable_Management_And_Pathways.md)

## 1. Concepts

Fiber carries most **leaf-spine and uplink** bandwidth in modern halls. **MPO/MTP** multi-fiber connectors enable trunk cables and parallel optics (40/100/400G-class) without hundreds of discrete duplex jumps.

### Fiber literacy

| Term | Meaning |
|------|---------|
| **OM3/OM4/OM5** | Multimode grades (aqua/lime jackets common) |
| **OS2** | Single-mode for longer reaches |
| **LC duplex** | Common patch ends |
| **MPO/MTP** | Multi-fiber (8/12/16/24…) array connector |
| **Trunk** | Pre-terminated multi-fiber assembly |
| **Breakout / cassette** | MPO ↔ LC fanout at panels |

Polarity (Type A/B/C and method schemes) decides whether Tx hits Rx. Wrong polarity = dark link with “good” cables.

### Where it sits

MDA ↔ leaf/spine; spine ↔ spines; ToR uplinks; MMR/cross-connect handoffs ([Fabric-Physical](../Fabric-Physical/README.md), on-ramp [5](../5_Fabric_Cross_Connect_And_OOB.md)). Optics form factors: [Accelerators](../Accelerators/README.md) / Fabric optics chapters.

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Dirty endfaces | High loss, flaps |
| Wrong polarity / gender (MPO keying) | No light / one-way |
| Bend radius violated | Loss, latent failure |
| Mixed MM/SM | Won’t link |
| Overfilled trays | Crush + untraceable plant |
| Unlabeled MPO trunks | Nightmare MAC work |

### Inspect / clean / certify

| Practice | Why |
|----------|-----|
| Scope endfaces | Dirt is the #1 optical problem |
| Clean before mate | Every time for critical links |
| OLTS / OTDR as required | Loss budget proof |
| Keep dust caps on | Until mate |

### How it connects

DAC/AOC vs optical transceiver choices live at the equipment edge; structured fiber is the **permanent plant**. Cross-connects in MMR are often SM fiber ordered as a durable job ([Provider-Use](../Provider-Use/README.md)).

### Global variants

Same fiber physics. Color conventions and polarity methods must be **site-standard**—do not invent a second polarity scheme in one building.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| 100G+ leaf uplink | MPO trunks + correct optics + polarity method documented |
| Flapping optic | Clean/inspect before RMA |
| Cage build | Pre-term trunks to meet-me / main distribution |
| Remote hands | “Clean LC, reseat, photo scope if available” |

**Staff checklist**

- Media type (OM/OS) matches optics  
- Polarity method written for the hall  
- Clean before connect  
- Labels on both ends of trunks  
- Never coil fiber tighter than rating  

**Good:** clean, labeled, polarity-standard plant. **Bad:** dirty MPO mated blind; mystery trunks; mixed polarity methods.

## References

- [TIA](https://tiaonline.org/) (fiber cabling standards family)  
- [IEC](https://www.iec.ch/) (fiber connector/cable families)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
