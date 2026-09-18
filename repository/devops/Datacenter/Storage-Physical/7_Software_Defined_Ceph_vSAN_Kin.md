# 7 — Software-defined: Ceph, vSAN, and kin

[← Previous](./6_Array_Controllers_And_Shelves.md) · [README](./README.md) · [Next: Object →](./8_Object_On_Prem.md)

## 1. Concepts

**Software-defined storage (SDS)** places data planes on commodity servers: **Ceph**, **vSAN**, **Storage Spaces Direct**-class, and kin. Reliability comes from **replication/erasure + failure domain design**, not a dual-controller shelf alone.

### Failure domain literacy

| Domain | Example |
|--------|---------|
| Disk | OSD/device |
| Host | Server |
| Rack | Top-of-rack power/network blast |
| Room/row | Larger correlated risk |

Putting all replicas in one rack is the classic foot-gun.

### Where it sits

Storage or hyperconverged nodes; JBOD disks ([1](./1_DAS_Local_Disks_And_RAID.md)); dedicated or shared fabric carefully designed ([Fabric-Physical/11](../Fabric-Physical/11_Storage_Network_Separation.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Rack-correlated replicas | Dark data on row loss |
| Full / near-full cluster | Recovery storms |
| Noisy network | Slow recovery, app latency |
| Hardware RAID under OSD | Masked failures |
| Unbalanced CRUSH/fault domains | Hot spots |

### How it connects

Hypervisor map: [Compute/18](../Compute/18_Hypervisor_On_The_Box_Map.md). Object gateways: [8](./8_Object_On_Prem.md). Engines/apps still Databases-Deep-Dive for DB specifics.

### Global variants

Ceph common on Linux estates; vSAN on VMware; cloud uses provider SDS behind APIs. Jobs—domains, recovery, capacity headroom—transfer.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Greenfield block/file/object | Ceph with rack-aware CRUSH |
| VMware HCI | vSAN with documented stretch/rack rules |
| Expand | Add by failure domain, not random disks |
| Incident | Watch recovery IO vs app SLOs |

**Staff checklist**

- Failure domains match physical racks  
- No hardware RAID on data devices  
- Network capacity for rebuild  
- Free capacity headroom policy  
- Never place all copies in one PDU domain knowingly  

**Good:** rack-aware placement, headroom, clean JBOD. **Bad:** all replicas one rack; 95% full forever; RAID+OSD.

## References

- [Ceph documentation](https://docs.ceph.com/)  
- [VMware vSAN](https://techdocs.broadcom.com/us/en/vmware-cis/vsan.html)  
- [SNIA](https://www.snia.org/)  
- [Kubernetes CSI](https://kubernetes-csi.github.io/)  
