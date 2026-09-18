# 6 — CPU interconnect ideas

[← Previous](./5_Chipset_PCIe_And_Platform_IO.md) · [README](./README.md) · [Next: Memory DIMM types →](./7_Memory_DIMM_Types_And_Channels.md)

## 1. Concepts

In multi-socket servers, CPUs talk over a **coherent interconnect**. Names differ; the *job* is the same: move cache lines and I/O ownership between sockets with non-uniform latency.

| Ecosystem | Name you will hear |
|-----------|--------------------|
| Intel | UPI (and successors) |
| AMD | Infinity Fabric (socket and on-package) |
| Others | Vendor-specific coherent links |

You rarely configure link PHY details—you **place memory, IRQs, and processes** with topology in mind ([8](./8_Memory_Population_And_NUMA.md), [9](./9_Allocation_Model_Socket_To_DIMM.md)).

### Where it sits

Between sockets on the motherboard; also between chiplets *inside* a package (still looks like NUMA or CCD domains to software).

## 2. Advanced concepts

### Failure modes / perf traps

| Trap | Impact |
|------|--------|
| Cross-socket memory access storm | Latency/bandwidth tax |
| Device interrupts on far socket | Extra hops |
| One socket empty DIMMs | Unbalanced bandwidth |
| Assuming UMA | Wrong for almost all dual-socket servers |
| Disabled link / degraded width | Silent perf loss |

### How it connects

```text
Socket0 memory ←→ interconnect ←→ Socket1 memory
PCIe roots often local to a socket — prefer local NICs/GPUs
```

Hypervisor CPU affinity and SR-IOV locality matter ([18](./18_Hypervisor_On_The_Box_Map.md)).

### Honesty

Exact hop counts and link speeds are generation-specific—read OEM topology diagrams for your SKU. This chapter teaches the **idea**, not a fake universal diagram.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Latency-sensitive DB | Pin to socket; local memory; local NIC |
| Throughput scale-out | Often OK with less pinning; still balance DIMMs |
| GPU + CPU | Keep controlling CPU near GPU root |
| Troubleshoot slow | Check `numactl` / `lscpu` topology first |

**Staff checklist**

- Topology exported (`lscpu -e`, OEM doc)  
- Dual-socket DIMMs balanced per guide  
- Critical devices socket-local when possible  
- Don’t leave one socket memory-light  
- Never invent interconnect tuning without OEM guidance  

**Good:** topology-aware placement, balanced memory. **Bad:** cross-socket chatter by default; “it’s dual socket so twice as fast” without locality.

## References

- [Intel Xeon documentation](https://www.intel.com/content/www/us/en/products/details/processors/xeon.html) (UPI/topology in platform docs)  
- [AMD EPYC documentation](https://www.amd.com/en/products/processors/server/epyc.html) (Infinity Fabric / NPS)  
- OEM NUMA topology guides for your platform  
- Linux `numa` documentation (kernel docs)  
