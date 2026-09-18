# 11 — Storage network separation

[← Previous](./10_DNS_NTP_Physical_Placement.md) · [README](./README.md) · [Next: Fabric failure walks →](./12_Fabric_Failure_Walks.md)

## 1. Concepts

Storage traffic (FC fabrics, iSCSI/NVMe-oF Ethernet, replication) needs **known isolation** from general east-west and user traffic—dedicated fabrics, VLANs/VRFs, QoS, or all three.

### Patterns

| Pattern | Use |
|---------|-----|
| Dual FC fabrics | Classic SAN ([Storage-Physical/3](../Storage-Physical/3_SAN_Fibre_Channel.md)) |
| Dedicated Ethernet storage leaf/VRF | IP SAN/NAS |
| QoS on shared | Weaker; measure carefully |
| Replication VRF/WAN | DR links |

### Where it sits

Separate switches or VRFs; host vNICs/HBAs mapped intentionally; monitoring distinct.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Storage on default VLAN | Latency storms → etcd/DB pain |
| “Separate VLAN” on same congested uplink | False isolation |
| Single storage leaf | Soft SPOF |
| MTU mismatch only on storage | Hard-to-spot |
| Replication sharing backup storm window | Both fail |

### How it connects

Storage path chapters: [Storage-Physical](../Storage-Physical/README.md). Leaf-spine capacity planning: [1](./1_Leaf_Spine_And_Classic_Three_Tier.md).

### Global variants

Same jobs; some estates fully converge with careful QoS—only with measurement and expertise.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New IP SAN | Dedicated VRF + dual leaves + multipath |
| Brownfield merge | Prove isolation with latency histograms |
| Ceph | Enough backend bandwidth for recovery |
| Audit | Trace storage NICs to actual switches |

**Staff checklist**

- Storage path diagram exists  
- Dual paths independent  
- MTU consistent  
- Alarms on storage interface errors  
- Never “temporarily” bridge storage to prod for convenience  

**Good:** real isolation, dual paths, measured. **Bad:** VLAN theater; storage+vMotion+users fighting; single leaf.

## References

- [SNIA](https://www.snia.org/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Storage-Physical](../Storage-Physical/README.md)  
