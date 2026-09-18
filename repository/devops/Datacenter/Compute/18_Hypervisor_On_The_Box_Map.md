# 18 — Hypervisor on the box map

[← Previous](./17_Compute_Failure_Walks.md) · [README](./README.md)

## 1. Concepts

The metal underneath does not change when you install a hypervisor—but **what owns CPUs, memory, and devices** does. This chapter maps bare-metal platform facts onto on-ramp hypervisor chapters.

| Layer | Where depth lives |
|-------|-------------------|
| Box / NUMA / BMC / firmware | **This Compute track** |
| ESXi / vCenter / HA | [On-ramp 7](../7_VMware_vSphere.md) |
| KVM / Hyper-V / OpenStack | [On-ramp 8](../8_Other_Hypervisors_And_Private_IaaS.md) |
| Kubernetes on metal | [On-ramp 10](../10_Clusters_On_Prem.md) + Containerization |

### Placement ideas

| Choice | Platform implication |
|--------|----------------------|
| Pass-through GPU/NIC | Slot locality + IOMMU groups ([5](./5_Chipset_PCIe_And_Platform_IO.md)) |
| Overcommit memory | Still obey DIMM health and balloon vs NUMA |
| CPU affinity for VMs | NUMA nodes ([8](./8_Memory_Population_And_NUMA.md)) |
| Shared datastore | Storage paths ([Storage-Physical](../Storage-Physical/README.md)) |
| Nested virt | Extra complexity—rarely needed |

## 2. Advanced concepts

### Failure modes at the boundary

| Failure | Impact |
|---------|--------|
| Ignoring NUMA in VM placement | Latency noise |
| Firmware drift under hypervisor | Random purple/oops screens |
| SR-IOV without dual-home plan | Host net SPOF |
| Treating hypervisor HA as power HA | Still need A+B PDUs |
| Snapshots as backup of metal state | False comfort |

### How it connects

```text
SKU + firmware train + imaging
  → hypervisor or OS install
  → cluster join (vSphere/K8s/OpenStack)
  → workloads
```

Jobs: bare-metal admin vs virtualization admin ([Jobs](../Jobs/README.md)).

### Global variants

Same map worldwide. Licensing and support matrices differ by product—consult current vendor docs (no cert dump here).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New vSphere cluster | Freeze Compute SKU first; then HA/DRS design |
| K8s on metal | kubeadm/RKE2 on imaged nodes; hall still Compute+Fabric |
| GPU VMs | Pass-through with thermal/power SKU proven bare |
| Troubleshoot “HA failed” | Check host hardware/BMC before only vCenter blame |

**Staff checklist**

- Platform one-pager attached to cluster design  
- Firmware train approved for hypervisor version  
- NUMA/pass-through documented  
- Dual power + dual net under HA assumptions  
- Never assume hypervisor features replace hall redundancy  

**Good:** metal standards first, virt features second. **Bad:** HA theater on single PDU; NUMA-blind VIP VMs; ignored BMC under ESXi.

## References

- [VMware vSphere documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere.html)  
- [KVM](https://www.linux-kvm.org/) · [libvirt](https://libvirt.org/)  
- [OpenStack](https://docs.openstack.org/)  
- [Kubernetes production environment](https://kubernetes.io/docs/setup/production-environment/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
