# 9 — Environmental sensors and PDU meters

[← Previous](./8_Serial_Console_Servers.md) · [README](./README.md) · [Next: Failure and spares →](./10_Accelerator_Failure_And_Spares.md)

## 1. Concepts

**Environmental sensors** (temp/humidity/leak/door) and **metered PDUs** turn white-space physics into data for EPMS/DCIM/NOC.

They are small devices with outsized incident value—especially in dense GPU rows.

### What to measure

| Sensor | Why |
|--------|-----|
| Inlet / aisle temp | ASHRAE / throttle risk |
| Humidity | ESD / condensation ([Mechanical/10](../Mechanical/10_Humidity_Water_Treatment_And_Plumbing.md)) |
| Leak | Liquid rows ([Mechanical/7](../Mechanical/7_Leak_Detection_And_Fluid_Risk.md)) |
| Door / intrusion | Security + containment |
| Rack PDU amps/kW | Capacity and imbalance ([Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md)) |

### Where it sits

Sensor pods at aisle ends / rack tops; PDU network on OOB; aggregated in BMS/EPMS/DCIM ([Electrical/15](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Sensor placed in exhaust | False hot alarms or missed inlet issues |
| Uncalibrated / dead battery wireless | Blind |
| PDU SNMP down | Capacity decisions on fiction |
| Alarm storms | Real events ignored |
| Only nameplate in DCIM | Oversubscribe until trip |

### How it connects

GPU bring-up must watch PDU meters live ([1](./1_GPU_Trays_And_Power.md)). Mechanical failure walks use inlet sensors ([Mechanical/11](../Mechanical/11_Mechanical_Failure_Walks.md)).

### Global variants

Wired Modbus/SNMP vs wireless meshes—reliability and battery ops differ. Prefer monitored, powered sensors for critical halls.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dense row go-live | Temp + leak + PDU metering before production jobs |
| Capacity planning | Trend kW, not snapshot idle |
| Incident | Align sensor timestamps with BMC/CRAH |
| Audit | Spot-check sensor placement vs map |

**Staff checklist**

- Sensors at *inlets*, not only returns  
- PDU meters in same timezone/NTP as EPMS  
- Leak zones tested  
- Thresholds tuned (no chronic ignore)  
- Never disable alarming “temporarily” without ticket  

**Good:** calibrated placement, clean alerts, metered A/B. **Bad:** exhaust-as-inlet; dead sensors; decorative DCIM.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- PDU vendor MIB/Redfish docs for your models  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
