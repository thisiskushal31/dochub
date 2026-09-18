# 7 — Vanilla Kubernetes on bare metal

[← Previous](./6_Self_Managed.md) · [Kubernetes](./README.md)

---

## 1. Concepts

**Vanilla Kubernetes on bare metal** means the Kubernetes project’s cluster (usually **kubeadm**) running **on physical servers** — not GKE/EKS/AKS, not OpenShift, not a distro control plane you treat as a black box.

On **physical servers** you own firmware, OS, disks, NICs, and etcd. On **cloud VMs** the same kubeadm binary is [6](./6_Self_Managed.md) (cloud disks, cloud CCM, cloud AZs). Do not mix the two runbooks.

This is **not** kind/minikube ([Local-Dev](../../Local-Dev/README.md)). The datacenter around the rack: DevOps [Datacenter/](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/README.md). HA procedures: [5](./5_Production_Operations.md).

```text
Rack servers (or colo cages, or dedicated rental)
  → Linux + containerd
  → kubeadm control plane (stacked or external etcd)
  → kubelet workers
  → CNI + CSI + MetalLB or hardware LB
```

| You must provide | Cloud managed equivalent |
|------------------|---------------------------|
| API load balancer (kube-vip, HAProxy, hardware) | EKS/GKE API NLB |
| etcd disks and backups | Provider etcd |
| MetalLB / BGP / hardware LB | `Service type=LoadBalancer` via CCM |
| Local / SAN / Ceph CSI | EBS / PD / Azure Disk |
| PXE / image + BMC | ASG instance replace |

---

## 2. Advanced concepts

### Minimum production shape

- **Three** control-plane nodes (odd etcd) in independent failure domains (racks/feeds, not just “three NICs”)  
- Separate **worker** machines  
- Time sync (NTP/PTP) — etcd dies on clock skew  
- **Pod Security**, ingress TLS, and an IdP for the API  
- Firmware + OS patching as a **cluster** event  

Single-node kubeadm is a lab.

### Bare metal vs “one server”

A tower under a desk is not a datacenter. Colo still counts as bare metal if **you** OS the box. Dedicated rental (OVH Bare Metal and kin) is metal you did not rack, but kubeadm on it is this chapter’s ops model. The hall, BMC, and remote-hands: DevOps [Datacenter/](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/README.md).

### Distributions that are still “you own CP”

RKE2, k3s (multi-node HA), kubeadm are installers. They do not become managed GKE because the binary is smaller. Rancher *managing* those clusters: [Rancher](../Rancher/README.md). OpenShift on metal: [OpenShift](../OpenShift/README.md) (not vanilla).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Air-gapped / regulated rack | kubeadm HA + your CNI/CSI + no cloud CCM |
| Colo | Same, plus remote-hands runbook ([Datacenter/2](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/2_Ownership_Colo_And_Contracts.md), [4](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/4_Rack_BMC_And_Provisioning.md)) |
| Edge site | k3s HA or single-node with eyes open |

**Staff checklist**

- Odd etcd, tested restore onto **new** disks  
- API endpoint is a VIP, not `https://192.168.1.10:6443` on one NIC  
- LB and storage that do not assume AWS  
- BMC/iLO/iDRAC access documented  
- Upgrade plan for kubeadm, etcd, OS, firmware  

**Good:** three CP + N workers, kube-vip or hardware LB, etcd snapshot off-box. **Bad:** `kubeadm init` on one blade, hostPath for everything, public 6443.

---

## References

- [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)  
- [Creating a cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)  
- [HA with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)  
- [MetalLB](https://metallb.io/)  
- [Cluster API (bare metal providers exist)](https://cluster-api.sigs.k8s.io/)  
