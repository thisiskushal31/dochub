# 10 — BMC, IPMI, and Redfish deep

[← Previous](./9_Allocation_Model_Socket_To_DIMM.md) · [README](./README.md) · [Next: Firmware trains →](./11_Firmware_Trains_And_Secure_Boot.md)

## 1. Concepts

The **BMC** (Baseboard Management Controller) is the always-on microcontroller that provides out-of-band control: power, sensors, consoles, inventory, updates. **IPMI** is the older common protocol family; **Redfish** (DMTF) is the modern HTTP/JSON standard.

### What you do with it

| Job | Via BMC |
|-----|---------|
| Power on/off/cycle | Chassis control |
| Serial-over-LAN / KVM | Break-glass console |
| Virtual media | Mount ISO for install |
| Sensors | Temp, fans, PSU, DIMM, voltage |
| Inventory | Serials, NIC MACs, firmware versions |
| Alerts | SNMP/email/Redfish events |

### Where it sits

Dedicated management NIC or shared NIC in limited modes; on **OOB network**—not the production data plane ([on-ramp 5](../5_Fabric_Cross_Connect_And_OOB.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| BMC unreachable | No remote power/console |
| Shared NIC mis-mode | OOB bridged to prod accidentally |
| Default passwords | Estate compromise |
| Sensor storm / false fans | Noise or ignored real alerts |
| Virtual media left mounted | Surprise boot source |
| IPMI-only on new gear | Automation debt vs Redfish |

### Security literacy

- Unique passwords / vault / Enterprise directory where supported  
- TLS for Redfish; disable unused IPMI ciphers  
- Firmware signed updates ([11](./11_Firmware_Trains_And_Secure_Boot.md))  
- Isolate OOB VLAN; no inbound from internet  

### How it connects

Provisioning at scale: [15](./15_Imaging_And_Provisioning_At_Scale.md). Crash carts when BMC dies: [White-Space/8](../White-Space/8_Crash_Cart_KVM_And_Serial_Aggregation.md).

### Global variants

iDRAC / iLO / XClarity / ASMB / OpenBMC—different UIs, same jobs. Prefer Redfish for automation when available.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-0 | Set password, NTP, syslog, network, TLS certs |
| Image | Redfish virtual media + UEFI boot order |
| Monitor | Fan/temp/PSU into observability |
| Incident | SOL/KVM before traveling to hall |

**Staff checklist**

- BMC on OOB only  
- Creds rotated; no defaults  
- Redfish inventory matches asset tag  
- Alerts reach NOC  
- Never expose IPMI to the internet  

**Good:** Redfish automation, vaulted creds, clean OOB. **Bad:** default admin/admin; BMC on prod VLAN; ignored thermal alerts.

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [OpenBMC](https://www.openbmc.org/)  
- [IPMI](https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-home.html) (historical/protocol literacy)  
- OEM iDRAC/iLO/XClarity docs for your fleet  
