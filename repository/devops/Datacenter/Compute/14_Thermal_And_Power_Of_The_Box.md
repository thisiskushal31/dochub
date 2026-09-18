# 14 — Thermal and power of the box

[← Previous](./13_NICs_HBAs_And_Slot_Planning.md) · [README](./README.md) · [Next: Imaging →](./15_Imaging_And_Provisioning_At_Scale.md)

## 1. Concepts

The server converts almost all watts to heat. **PSU redundancy**, **inlet temperature**, and **derating** decide whether the box runs at nameplate or throttles.

### Power literacy at the chassis

| Topic | Meaning |
|-------|---------|
| **PSU N+N / 1+1** | Dual cord to A/B PDUs ([Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md)) |
| **Rated vs input draw** | 80Plus / efficiency curves |
| **Inrush / cold boot** | Breaker trips on simultaneous rack power-on |
| **Capping / power policies** | BIOS/OS limits |

### Thermal literacy

| Topic | Meaning |
|-------|---------|
| Inlet sensors | BMC front temp |
| Fan zones | Acoustic and cooling response |
| Throttle | CPU/GPU clocks drop |
| Derating | High altitude / high inlet → less allowed wattage |

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Both PSUs on one PDU | Path loss = down |
| Undersized PSU for GPU option | Random reboots |
| Blocked blanking / wrong airflow | Hotspots ([White-Space/2](../White-Space/2_Cabinet_Airflow_And_Chimneys.md)) |
| Fan failure ignored | Throttle then shutdown |
| High inlet from hall | Estate-wide performance loss |

### How it connects

Hall cooling: [Mechanical](../Mechanical/README.md). Density budgets: [White-Space/3](../White-Space/3_Power_Density_And_Floor_Loading.md). Liquid for extreme TDP: [Mechanical/6](../Mechanical/6_Liquid_Cooling_Rear_Door_And_Direct_To_Chip.md).

### Global variants

Altitude derating matters in high metros. Ambient policies differ by operator ASHRAE class targets.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Rack bring-up | Stagger power-on; watch PDU amps |
| GPU SKU | PSU option kit mandatory on BOM |
| Thermal event | BMC fans/temps + aisle inlet before RMA CPU |
| Capacity | Measure draw, don’t sum nameplates blindly |

**Staff checklist**

- Dual PSU → dual PDUs verified  
- PSU wattage matches option cards  
- Inlet in policy range  
- Fan alerts to NOC  
- Never run production with known failed PSU “until next window” without risk accept  

**Good:** true PSU redundancy, measured draw, cool inlets. **Bad:** nameplate packing; single-path PSUs; ignored fan alerts.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- OEM power and thermal design guides for your SKU  
- [The Green Grid — PUE](https://www.thegreengrid.org/) (facility context)  
