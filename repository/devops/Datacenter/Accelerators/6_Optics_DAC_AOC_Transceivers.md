# 6 — Optics, DAC, and AOC transceivers

[← Previous](./5_HBM_And_Accelerator_Memory.md) · [README](./README.md) · [Next: PTP →](./7_PTP_Grandmaster_And_Time.md)

---

## 1. Concepts

High-speed links use **direct attach copper (DAC)**, **active optical cables (AOC)**, or **transceivers + fiber**. Form factors (SFP/SFP+/SFP28, QSFP/QSFP28/QSFP-DD, OSFP, …) define the cage—not the protocol alone.

### When which

| Media | Typical use |
|-------|-------------|
| **DAC** | Short in-rack / adjacent rack; cheap; power-light |
| **AOC** | Longer than DAC without separate optics; fixed ends |
| **Transceiver + MMF/SMF** | Structured plant, MMR, long reach ([White-Space/5](../White-Space/5_Structured_Cabling_Fiber_MPO_MTP.md)) |

### Where it sits

NIC/HBA/GPU/DPU cages ↔ ToR/leaf/spine or breakout panels; trunks in trays; labels mandatory.

---

## 2. Advanced concepts

### Failure modes

| Failure | Symptom |
|---------|---------|
| Dirty endface | CRC, flaps |
| Wrong form factor / speed | No link |
| DAC too long / poor signal | Unstable |
| Incompatible optic coding (vendor lock) | Rejected DOM |
| Breakout polarity wrong | One-way/dark |
| Mixing SM/MM | No link |

### DOM / diagnostics literacy

Digital Optical Monitoring (temp, TX/RX power) on many optics—use before RMA. Clean/inspect discipline from structured fiber chapter applies.

### How it connects

Fabric equipment roles: [Fabric-Physical](../Fabric-Physical/README.md). GPU multi-node often burns optics budget first ([2](./2_GPU_Interconnect_Ideas.md)). Spares: [10](./10_Accelerator_Failure_And_Spares.md).

### Global variants

Same form factors worldwide; coded optics policies differ by switch vendor. Keep approved SKU list.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| In-rack 100G | DAC if distance allows |
| Row/spine | AOC or transceiver+fiber per design |
| Flap storm | Clean, reseat, check RX power, then replace |
| Order | Match speed, form factor, fiber type, breakout |

**Staff checklist**

- Approved optic/DAC SKU list  
- Clean before mate  
- Label both ends  
- DOM thresholds alerting  
- Never force wrong-form cages with adapters in prod without eng approval  

**Good:** clean labeled plant, approved SKUs, DOM watched. **Bad:** dusty MPO; random eBay optics; DAC as 30 m hope.

---

## References

- [TIA](https://tiaonline.org/) (fiber cabling)  
- [IEC](https://www.iec.ch/) (optical connector/transceiver related families)  
- Switch/NIC vendor transceiver compatibility matrices  
- [PCI-SIG](https://pcisig.com/) / IEEE Ethernet standards families as applicable  
