# 11 — Latency for etcd and databases

[← Previous](./10_Encryption_And_Key_Custody.md) · [README](./README.md) · [Next: Failure walks →](./12_Storage_Failure_Walks.md)

## 1. Concepts

Some workloads are **latency-sensitive to disk and fsync**: etcd, consensus stores, classic RDBMS commit paths. A “fine for files” NFS or congested iSCSI path can strand a whole Kubernetes control plane.

### Where problems come from

| Source | Effect |
|--------|--------|
| High RTT IP storage | Slow commits |
| Contended shared array | Tail latency |
| Snapshot/rebuild storms | Latency spikes |
| Noisy neighbor VLAN | Same |
| Slow HDDs for WAL | Pain |

Engine tuning → Databases-Deep-Dive / Containerization. This chapter is **hall path honesty**.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| etcd on remote high-latency datastore | Cluster instability |
| DB on oversubscribed NFS | Timeouts |
| Stretch sync replication too far | Writes crawl |
| Ignoring p99 | Averages lie |

### How it connects

Prefer local NVMe for etcd/WAL when possible ([1](./1_DAS_Local_Disks_And_RAID.md)). Measure storage network ([4](./4_SAN_iSCSI_And_NVMe_oF.md)). Fabric separation ([Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md)).

### Global variants

Physics of RTT does not care about metro marketing. Stretch clusters need math, not hope.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| K8s control plane | Local SSD/NVMe for etcd |
| OLTP DB | Low-latency path; measured fsync |
| VDI file shares | Higher latency OK |
| Validate | fio/latency histograms before prod |

**Staff checklist**

- Classify workloads by latency class  
- Measure p99 before signing architecture  
- Avoid best-effort shared for consensus  
- Watch rebuild/snap windows  
- Never put etcd on cross-metro sync NFS  

**Good:** local fast media for consensus; measured paths. **Bad:** etcd on busy NFS; averages-only dashboards.

## References

- [etcd performance](https://etcd.io/docs/latest/op-guide/performance/)  
- [SNIA](https://www.snia.org/)  
- Linux fio documentation  
- Databases-Deep-Dive (engine specifics)  
