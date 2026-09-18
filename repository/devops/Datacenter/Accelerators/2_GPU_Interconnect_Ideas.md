# 2 — GPU interconnect ideas

[← Previous](./1_GPU_Trays_And_Power.md) · [README](./README.md) · [Next: DPU and SmartNIC →](./3_DPU_And_SmartNIC.md)

## 1. Concepts

Multi-GPU training/inference often needs **fast GPU-to-GPU** paths beyond ordinary NIC east-west. Vendor technologies (NVLink/NVSwitch-class, Infinity Fabric GPU links, PCIe-only meshes) differ—the *jobs* are topology literacy and failure domains.

### Ideas (not a brand catalog)

| Idea | Meaning |
|------|---------|
| **PCIe-only GPUs** | GPUs talk via host root complexes; simpler, lower bandwidth |
| **Dedicated GPU interconnect** | High-bandwidth links between GPUs in a box or tray |
| **Switch/bridge silicon** | Fan-out among many GPUs (NVSwitch-class idea) |
| **Multi-node GPU fabric** | Extends domain across boxes (IB/Ethernet + GPU-aware stacks) |

Exact product names and generations churn—read **current** OEM topology for your tray.

### Where it sits

Inside the chassis (board links) and/or as external cables between sleds; east-west still hits leaf/spine for multi-node ([Fabric-Physical](../Fabric-Physical/README.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Broken bridge/link | Jobs fall back to slow path or fail |
| Wrong topology assumption in software | Terrible scaling |
| Cable/connector damage on dense trays | Intermittent training failures |
| Mixing generations in one domain | Unsupported |
| Ignoring NUMA/CPU locality to GPUs | Host bottleneck |

### How it connects

```text
GPU domain (in-tray links) → host PCIe/NIC → leaf-spine → other nodes
```

Slot/lane planning: [Compute/5](../Compute/5_Chipset_PCIe_And_Platform_IO.md), [Compute/13](../Compute/13_NICs_HBAs_And_Slot_Planning.md). Optics for node interconnect: [6](./6_Optics_DAC_AOC_Transceivers.md).

### Honesty

Hyperscaler internal GPU fabrics are often unpublished. Learn principles + your OEM’s diagram. No invented NVSwitch campus maps.

### Global variants

Same ideas worldwide; which interconnect appears depends on purchased SKU, not metro.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Single-node multi-GPU | Verify in-tray topology before software tuning |
| Multi-node training | Size NIC/IB + optics as first-class, not afterthought |
| Incident “slow all-reduce” | Check link health before blaming PyTorch |
| Refresh | Don’t mix interconnect gens in one job pool |

**Staff checklist**

- OEM topology one-pager per GPU SKU  
- Cables seated/torque per guide  
- Monitoring for link errors enabled  
- Software topology matches hardware  
- Never assume PCIe-only equals NVLink-class  

**Good:** documented domain, monitored links, matched software. **Bad:** mystery bridges; silent link down; fabric undersized for multi-node.

## References

- OEM multi-GPU platform topology guides (current SKU)  
- [PCI-SIG](https://pcisig.com/) (PCIe baseline)  
- InfiniBand / Ethernet fabric docs as used by your cluster  
- [Open Compute Project](https://www.opencompute.org/)  
