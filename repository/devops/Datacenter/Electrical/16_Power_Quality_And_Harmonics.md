# 16 — Power quality and harmonics

[← Previous](./15_EPMS_BMS_And_Power_Monitoring.md) · [README](./README.md) · [Next: Failure walks →](./17_Power_Path_Failure_Walks.md)

## 1. Concepts

**Power quality** is whether voltage and current stay within what equipment tolerates: magnitude, frequency, imbalance, distortion, and transients. **Harmonics** are currents/voltages at multiples of fundamental frequency, largely from non-linear loads (PSUs, VFDs, UPS electronics).

IT does not need to be a power-quality engineer. IT *does* need to recognize when facility power quality—not firmware—is the root cause.

### Where issues appear

| Symptom class | Possible PQ angle |
|---------------|-------------------|
| Random reboots | Sags, flicker, transfer events |
| Hot transformers / neutrals | Triplen harmonics |
| Nuisance breaker trips | Distorted current, inrush |
| UPS alarms | Input distortion / eco-mode transfers |
| Motor/CRAH issues | Imbalance, harmonics from VFDs |

## 2. Advanced concepts

### Literacy metrics

| Metric | Ops meaning |
|--------|-------------|
| **Sag / swell / interruption** | Magnitude-duration events |
| **THD** | Distortion level (voltage vs current) |
| **Power factor** | Real vs apparent; billing and capacity |
| **Imbalance** | Phase voltage/current asymmetry |
| **Transient** | Impulse from switching/lightning |

### Failure modes tied to harmonics

| Problem | Effect |
|---------|--------|
| Undersized neutral | Overheat on non-linear loads |
| Non K-rated XFMR | Thermal stress ([2](./2_Transformers.md)) |
| Resonance with PF caps | Amplify distortion (design issue) |
| Mixed eco UPS + dirty feed | Extra transfers |

### How it connects

Generators have different impedance than utility—some sites see worse distortion on generator. Commissioning should include quality checks ([18](./18_Commissioning_And_IST_Power.md)). Dense rectifier loads (GPU PSUs) raise the stakes.

### Global variants

50 Hz vs 60 Hz changes harmonic frequencies numerically; the management jobs stay: measure, compare to limits, fix plant or load, do not “set it in BIOS.”

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Mystery resets aligned to utility | Request PQ event capture / UPS log |
| New high-density row | Review XFMR K-rating and neutral design |
| After genset cutover complaints | Compare THD utility vs generator |
| Vendor blame loop | Share timestamps + waveforms, not opinions |

**Staff checklist**

- Know who owns PQ analyzers on site  
- Correlate IT events to EPMS sag counters  
- Don’t stack passive strips and adapters  
- Treat recurring “ghost” reboots as facility+IT joint  
- Never add random PF correction without engineering  

**Good:** measured events, correct XFMR/UPS design for IT loads. **Bad:** firmware churn for sag problems; ignored hot neutrals.

## References

- [IEEE](https://www.ieee.org/) (harmonic and PQ recommended practices families)  
- [IEC](https://www.iec.ch/) (EMC / PQ related standards families)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
