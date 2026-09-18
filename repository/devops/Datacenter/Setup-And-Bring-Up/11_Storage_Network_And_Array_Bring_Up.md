# 11 — Storage network and array bring-up

[← Previous](./10_RAID_And_Local_Disk_Setup.md) · [README](./README.md) · [Next: WLAN/AP →](./12_WLAN_And_AP_Lab_Office_Edge.md)

## Mental map

```text
Host HBA/NIC ──► storage fabric (FC switch or Ethernet VLAN)
                    │
              zoning / ACL
                    │
              array controllers ──► disk shelves
```

Paths: [Storage-Physical/3–5](../Storage-Physical/README.md). Separation: [Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md).

## 1. Concepts

| Step | FC world | Ethernet storage |
|------|----------|------------------|
| Fabric up | ISLs, dual fabric A/B | Dual switches / VRFs |
| Host | WWPN register | IQN / NVMe-oF NQN |
| Masking | Zoning | CHAP / discovery ACL |
| Multipath | native multipath | multipathd / MPIO |
| LUN/NS | Present to host | Present / connect |

**Disconfirm:** One FC fabric is **not** HA. iSCSI on the same VLAN as users is **not** isolation.

**Confirm:** What two identifiers must match for a host to see a LUN (FC vs iSCSI)?

## 2. Advanced concepts

### Operator experience

Bring fabric up before hosts scream “no path.” Document controller ownership/failover. Never zone “all vs all.” Test path failover by pulling one cable on purpose in a window.

### Failure modes

| Failure | Symptom |
|---------|---------|
| Single path | Outage on one cable |
| Wrong zone | Invisible LUN |
| Snapshot ≠ backup | Ransomware surprise ([Storage 9](../Storage-Physical/9_Snapshots_Vs_Backups_Vs_Replication.md)) |

## 3. Applications

| Goal | Pattern |
|------|---------|
| VM datastore | Dual fabric + multipath verified |
| DB | Latency class known ([Storage 11](../Storage-Physical/11_Latency_For_Etcd_And_Databases.md)) |

**Staff checklist:** dual fabric; zones reviewed; multipath -ll OK; alerts on path down; backup independent of array snapshot.

## References

- [Storage-Physical README](../Storage-Physical/README.md)  
- Vendor SAN best-practice guides (References only)  
