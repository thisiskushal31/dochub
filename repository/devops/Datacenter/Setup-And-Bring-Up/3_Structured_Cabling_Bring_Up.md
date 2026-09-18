# 3 — Structured cabling bring-up

[← Previous](./2_Crate_To_Live_Rack.md) · [README](./README.md) · [Next: Switch roles →](./4_Switch_Roles_In_Practice.md)

## Mental map

```text
Server NIC / HBA
  → in-rack cable (DAC/AOC/copper)
    → ToR or patch panel
      → horizontal / vertical pathway
        → row aggregator or spine fiber
          → MMR / XC (leave cage)
```

![Patch field](../../Assets/Datacenter/Setup-And-Bring-Up/patch-panel-fiber.jpg)

*What to notice: labeled ports, managed slack, separate copper vs fiber fields when possible. Review plate against your site standard. Source: Wikimedia Commons search hit used in Assets credit table.*

## 1. Concepts

**Structured cabling** is the permanent pathway; **patch** is the changeable last meter. Bring-up means: install, **test**, document, then hand to network for port config.

| Media | Typical use |
|-------|-------------|
| Cat6/6A | 1/10G copper server→ToR |
| DAC/AOC | Short high-speed in-rack |
| MMF/SMF | Leaf↔spine, MMR |
| Breakout | 40/100G → 4×25/10 |

**Disconfirm:** “Link light is green” is **not** a certification test. Mixing SMF/MMF optics is **not** fine.

**Confirm:** Where does permanent cabling end and patch begin in your cage?

## 2. Advanced concepts

### Operator experience

Color standards and A/B path colors prevent single-path mistakes. Document LOA/CFA circuit IDs at MMR the same day as XC land. Fluke/cert results live with the rack elevation—not in someone’s laptop Downloads.

### Failure modes

| Failure | Symptom |
|---------|---------|
| Untested pair | Flaps under load |
| Bend radius | Intermittent CRC |
| Undocumented XC | Hours of blame |

## 3. Applications

**Staff checklist:** test results archived; labels both ends; A/B paths diverse; photo of rear after dress; ready for switch config ([4](./4_Switch_Roles_In_Practice.md)).

## References

- [White-Space cabling](../White-Space/README.md)  
- [Fabric-Physical/8 Optics](../Fabric-Physical/8_Optics_And_Transceiver_Roles.md)  
- TIA cabling standards families  
