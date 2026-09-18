# 3 — DPU and SmartNIC

[← Previous](./2_GPU_Interconnect_Ideas.md) · [README](./README.md) · [Next: FPGA and IPU →](./4_FPGA_And_IPU.md)

## 1. Concepts

A **SmartNIC** / **DPU** (Data Processing Unit) is a NIC with substantial compute/offload (often its own cores, memory, accelerators) that can run networking, security, storage, or hypervisor dataplane functions off the host CPU.

### Why halls care

| Concern | Why |
|---------|-----|
| Power/thermal | Extra watts per slot |
| OOB / lifecycle | Second computer to image, patch, credential |
| Trust boundary | Can own host networking—security critical |
| Slot/lanes | x16 often; competing with GPUs |

### Where it sits

PCIe slot (or onboard); ports to ToR like a NIC; management via vendor tools/BMC-adjacent channels; sometimes hosts the hypervisor datapath (cloud-style).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| DPU hang | Host network dead even if CPU healthy |
| Firmware brick | Need vendor recovery / crash cart path |
| Dual-home forgotten | DPU ports both to one leaf |
| Host assumes “normal NIC” | Offload features misconfigured |
| Shared management plane exposed | Estate compromise |

### How it connects

```text
Host OS/hypervisor ↔ DPU ↔ ToR
BMC still separate for chassis power ([Compute/10](../Compute/10_BMC_IPMI_And_Redfish_Deep.md))
```

Provisioning must include DPU firmware trains ([Compute/11](../Compute/11_Firmware_Trains_And_Secure_Boot.md)). Fabric dual-home still applies.

### Global variants

NVIDIA BlueField-class, AMD/Pensando-class, Intel IPU-adjacent products, cloud custom ASICs—names churn. Jobs: offload, lifecycle, dual-home, secure management.

### vs FPGA/IPU

See [4](./4_FPGA_And_IPU.md). Overlap exists; classify by *what you operate* (NIC offload appliance vs reconfigurable card).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Secure multi-tenant metal | DPU enforces isolation; host least privilege |
| Storage networking | NVMe-oF / encryption offload on DPU |
| Ops model | Treat DPU as first-class node in CMDB |
| Incident | Check DPU health before reimaging host OS |

**Staff checklist**

- DPU in asset inventory with firmware version  
- Ports dual-homed  
- Mgmt auth vaulted  
- Recovery procedure tested  
- Never leave factory default DPU creds  

**Good:** lifecycle parity with hosts, dual-home, monitored. **Bad:** invisible second computer; single ToR; default passwords.

## References

- Vendor DPU/SmartNIC documentation for your card family  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [PCI-SIG](https://pcisig.com/)  
- [Open Compute Project](https://www.opencompute.org/)  
