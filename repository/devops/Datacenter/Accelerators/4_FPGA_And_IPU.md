# 4 — FPGA and IPU

[← Previous](./3_DPU_And_SmartNIC.md) · [README](./README.md) · [Next: HBM →](./5_HBM_And_Accelerator_Memory.md)

## 1. Concepts

**FPGAs** are reconfigurable accelerator cards used for networking, storage pipelines, video, fintech, and custom offload. **IPU** (Infrastructure Processing Unit) branding overlaps SmartNIC/DPU space—CPU-like devices aimed at infrastructure tasks.

### When they appear in halls

| Pattern | Note |
|---------|------|
| Telco / NFV | Packet processing |
| Finance / trading | Ultra-low latency paths (with time appliances [7](./7_PTP_Grandmaster_And_Time.md)) |
| Cloud infrastructure | Hidden in provider fleets |
| Enterprise POC | Often few cards—spares still required |

### Where it sits

PCIe add-in; sometimes with QSFP cages for inline networking; cooling/power like other accelerators; bitstream/firmware lifecycle separate from host OS.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Bad bitstream flash | Card dead / host hang |
| Thermal limit | Throttle or link down |
| Partial reconfig mistakes | Traffic blackhole |
| Treating as “NIC only” | Missing appliance ops |
| No golden bitstream vault | Unrecoverable field state |

### How it connects

Similar slot/power planning to GPUs/DPUs ([Compute/13](../Compute/13_NICs_HBAs_And_Slot_Planning.md)). Inline FPGA NICs are part of fabric failure walks. Security: signed bitstreams where supported.

### Honesty / naming

Marketing terms (IPU/DPU/SmartNIC/FPGA) blur. Classify by: programmable logic vs fixed offload SoC, who owns lifecycle, and whether it sits in the data path.

### Global variants

Availability is workload-driven more than metro-driven. Support matrices are vendor-specific.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Inline accelerate | Dual cards/paths if it carries production traffic |
| Lab → prod | Freeze bitstream version like firmware train |
| Incident | Rollback bitstream before host OS experiments |
| Spares | Keep matched FPGA SKU + approved bitstream |

**Staff checklist**

- Bitstream version in CMDB  
- Signed images where possible  
- Thermal/power on rounds  
- Recovery procedure documented  
- Never flash untested bitstreams on prod mid-day  

**Good:** versioned bitstreams, dual-path if inline, monitored thermals. **Bad:** one-off hero cards; no rollback; mystery flashes.

## References

- Vendor FPGA / IPU documentation for your cards (Intel/Altera, AMD/Xilinx, etc.)  
- [PCI-SIG](https://pcisig.com/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [Open Compute Project](https://www.opencompute.org/)  
