# 4 — SAN: iSCSI and NVMe-oF

[← Previous](./3_SAN_Fibre_Channel.md) · [README](./README.md) · [Next: HBA and multipath →](./5_HBA_HCA_And_Multipath.md)

## 1. Concepts

**iSCSI** and **NVMe over Fabrics (NVMe-oF)** deliver **block** storage over Ethernet (and NVMe-oF also over other fabrics). They replace or complement FC in many greenfield halls.

### Literacy

| Tech | Idea |
|------|------|
| **iSCSI** | SCSI over TCP; IQN initiators/targets |
| **NVMe-oF TCP / RDMA** | NVMe queueing over network; lower overhead when done right |
| **Discovery / portals** | How hosts find targets |

### Where it sits

Host NICs (or DPU) → dedicated storage VLAN/VRF or fabric → target portals on array/SDS gateway.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Storage on noisy prod VLAN | Latency spikes ([11](./11_Latency_For_Etcd_And_Databases.md)) |
| Single subnet/portal | Soft SPOF |
| Jumbo MTU mismatch | Mystery performance |
| Multipath misconfig | Path flaps / degraded |
| Security open (no CHAP/TLS where required) | Risk |

### How it connects

Separation: [Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md). Multipath: [5](./5_HBA_HCA_And_Multipath.md). SDS frontends often speak these protocols ([7](./7_Software_Defined_Ceph_vSAN_Kin.md)).

### Global variants

Same IP storage ideas worldwide. RDMA needs capable NICs/switches—don’t assume every leaf supports it.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| VM datastores | iSCSI with dual portals + multipath |
| High-perf disagg NVMe | NVMe-oF with measured latency |
| Hyperconverged edge | Local DAS may beat poor IP SAN RTT |
| Migrate off FC | Parallel fabrics during cutover |

**Staff checklist**

- Dedicated storage network path  
- Dual portals / dual NICs  
- MTU consistent end-to-end  
- Multipath policy documented  
- Never run cluster quorum disks on best-effort Wi-Fi-grade paths  

**Good:** isolated Ethernet storage, multipath, tested failovers. **Bad:** iSCSI on default VLAN; single portal; MTU folklore.

## References

- [SNIA](https://www.snia.org/)  
- [NVMe specifications](https://nvmexpress.org/)  
- [IETF](https://www.ietf.org/) (iSCSI RFCs family)  
- Linux NVMe-oF / open-iscsi documentation  
