# 4 — Structured cabling: copper

[← Previous](./3_Power_Density_And_Floor_Loading.md) · [README](./README.md) · [Next: Fiber MPO/MTP →](./5_Structured_Cabling_Fiber_MPO_MTP.md)

---

## 1. Concepts

**Structured cabling** is the permanent and semi-permanent copper plant that connects racks to network rooms—not a spaghetti of random patch cords from ToR to every server forever (though short server patches still exist).

### Layers (literacy)

| Piece | Role |
|-------|------|
| **Permanent link** | Horizontal cable (often Cat6A etc.) in tray/conduit to patch panels |
| **Patch cord** | Equipment end / cross-connect jumpers |
| **Patch panel** | Termination and labeling point |
| **ToR / EoR / MoR** | Where switching sits relative to copper |

Categories (Cat5e/6/6A/…) set bandwidth and alien-crosstalk expectations. For datacenter access today, **Cat6A** (or site standard) is the common workhorse; always follow the site standard.

### Where it sits

From server NIC or ToR → cabinet managers → aisle tray → MDA/IDA/HDA rooms (TIA language) → core/leaf as designed. Protocol depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Physical switch roles: [Fabric-Physical](../Fabric-Physical/README.md).

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Untwist too long at terminate | Fail certification; flaky links |
| Sharp bends / crushed cords | CRC errors, drops |
| Mixed category permanent + garbage patches | Link trains down |
| Power/data bundled wrong | Noise ([6](./6_Cable_Management_And_Pathways.md)) |
| Unlabeled ports | Hours lost; wrong pull |

### Testing literacy

| Test | Why |
|------|-----|
| Wire map | Basics |
| Length / delay | Design check |
| NEXT / return loss / alien crosstalk | Category compliance |
| Certification report | Handover artifact |

### How it connects

PoE (if used for cameras/APs/phones—not typical server NICs) needs power budget and heat in bundles. Server ports are usually short patches to ToR in modern leaf-spine—but copper horizontal still appears in admin, OOB, and brownfield.

### Global variants

TIA-568 vs ISO/IEC 11801 naming differs; categories map. Color codes for jackets may be site-specific—learn local legend.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New cage | Install certified permanent links + labeled panels |
| Move/add/change | Update labels and database same day |
| Flaky NIC | Swap patch first; then certify permanent link |
| Colo | Follow landlord cabling rules / approved vendors |

**Staff checklist**

- Site category standard known  
- Patch length/bend radius OK  
- Labels match DCIM/elevation  
- No flat untwisted “cheater” cables in production  
- Keep certification PDFs for the run  

**Good:** certified links, short quality patches, labels. **Bad:** unlabeled spaghetti; category roulette; crushed cords under doors.

---

## References

- [TIA](https://tiaonline.org/) (TIA-568 cabling standards family)  
- [ISO/IEC 11801](https://www.iso.org/) (generic cabling)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
