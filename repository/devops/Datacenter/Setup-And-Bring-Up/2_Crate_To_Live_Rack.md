# 2 — Crate to live rack

[← Previous](./1_Hall_Network_Mental_Map.md) · [README](./README.md) · [Next: Cabling →](./3_Structured_Cabling_Bring_Up.md)

## Mental map

```text
Dock / receive → uncrate / inventory serials
  → stage rails + elevation plan (U map)
    → slide chassis / switch → torque / ground
      → label (hostname, serial, U, asset tag)
        → dual PDU land (A/B) → ready for cable
```

![Populated server rack](../../Assets/Datacenter/Setup-And-Bring-Up/server-rack-populated.jpg)

*What to notice: vertical U stack, airflow front-to-back, cable management at sides—not a random shelf of towers. Image: [Wikimedia Foundation Servers (Commons)](https://commons.wikimedia.org/wiki/File:Wikimedia_Foundation_Servers-8055_13.jpg).*

## 1. Concepts

**Bring-up starts before power.** Wrong U or missing serial photos creates weeks of ticket pain.

| Step | Owner often | Output |
|------|-------------|--------|
| Receive / RMA check | Hands / dock | Serials vs PO |
| Elevation | Planner / bare-metal | U map in DCIM |
| Rails / chassis | Hands | Torque per OEM |
| Labels | Hands | Human + barcode |
| Power land | Hands + facilities rules | A and B PDUs |

White-space depth: [White-Space/](../White-Space/README.md).

**Disconfirm:** “We’ll label later” is **not** a plan. Both PSUs in one PDU is **not** dual power.

**Confirm:** What three fields go on a rack label before the first cable?

## 2. Advanced concepts

### Operator experience (verify locally)

Operators stress mid-rack ToR for cable length when dense; odd/even spine racks for diversity; never skip serial photography for remote hands. Weight and floor loading beat “it fits in U.”

### Failure modes

| Failure | Fix habit |
|---------|-----------|
| Wrong U | Stop; re-elevation before power |
| Missing blanking | Hotspots later—install now |
| No grounding | Safety stop |

## 3. Applications

**Staff checklist:** elevation signed; serials in DCIM; A/B PDUs identified; photos front/rear; next = cabling ([3](./3_Structured_Cabling_Bring_Up.md)).

## References

- [White-Space/1 Racks](../White-Space/1_Racks_Cabinets_And_U.md)  
- OEM rail install docs (per SKU)  
- Image credit: Wikimedia Commons as above  
