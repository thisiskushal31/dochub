# 10 — Clusters on-prem

[← Previous](./9_Deploy_On_The_Estate.md) · [README](./README.md) · [Next: Identity →](./11_Identity_Access_And_Change.md)

---

## 1. Concepts

A cluster in the hall is **Kubernetes (or OpenShift) on the fabric in chapters 3–8**. This chapter is the **map**. Internals stay in Containerization.

| Path | Control plane | Nodes sit on | Home for depth |
|------|---------------|--------------|----------------|
| **kubeadm on VMs** | You | vSphere / KVM / Hyper-V | [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md) |
| **kubeadm on physical** | You | The box | [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md) |
| **RKE2 / k3s** | You (installer differs) | VMs or metal | [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher) |
| **Rancher manager** | Rancher server (itself a cluster) | Downstream = any of the above | Rancher — not a cloud |
| **OpenShift IPI/UPI/Assisted/Agent** | You + installer | Metal, vSphere, Nutanix, OpenStack, … | [OpenShift 2](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/OpenShift/2_Installation.md) |
| **Supervisor / TKG** | VMware SKU-dependent | vSphere VMs | [7](./7_VMware_vSphere.md) |
| **EKS Anywhere / Arc / attached** | Hybrid product | Your iron | [1](./1_On_Prem_As_A_Solution.md), [12](./12_Sites_DR_Hybrid_And_The_Job.md) |
| **ROSA / ARO / ROKS** | Provider | Their cloud | [Cloud/3](../Cloud/3_Managed_Kubernetes.md) — **not this folder** |

OpenShift on metal vs ROSA is the same fork as kubeadm-on-box vs EKS. Do not install IPI and then expect an EKS SLA.

### What the hall must provide (every path)

- **API VIP** (kube-vip, HAProxy, hardware LB, NSX/AVI) — not one node IP  
- **Ingress / Gateway path** to a VIP that exists on [5](./5_Fabric_Cross_Connect_And_OOB.md)  
- **Storage class** that is not hostPath for prod ([6](./6_Storage_Backup_And_Restore.md))  
- **Time sync**  
- **Failure domains** as racks/feeds, expressed as Kubernetes topology labels  
- **BMC/image** story for node replace ([4](./4_Rack_BMC_And_Provisioning.md))  

---

## 2. Advanced concepts

### OpenShift on this fabric (literacy)

Four install methods: Assisted, Agent-based (disconnected-friendly), **IPI** (installer provisions; talks BMC on metal; creates VMs on vSphere), **UPI** (you provision; installer emits Ignition). RHCOS + Ignition on every node. Bootstrap machine is **temporary**. Platform: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift).

IPI on bare metal still means **you** provide machines, DHCP/BMC, API/Ingress VIPs, and storage. The installer is not a colo contract.

Disconnected: mirror registry, Agent or UPI, no Docker Hub.

OpenShift **virtualization** (KubeVirt) runs VMs *as* cluster workloads — a fork from “VMs under the cluster.” [OpenShift 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/OpenShift/7_Virtualization.md).

### Rancher / RKE2 / k3s

Rancher is a **manager**. RKE2 is a CIS-leaning Kubernetes distro you still operate. k3s is small; HA k3s is still etcd (or SQL) you own. Edge sites often k3s; DC production often RKE2 or kubeadm. [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher).

### Topology labels

`topology.kubernetes.io/zone` should mean **rack or room**, not “dc1” on every node. etcd and replicas follow that. If all three control-plane VMs live on one ESXi host, HA is a story you tell yourself — anti-affinity on [7](./7_VMware_vSphere.md).

### LoadBalancer and Ingress

Without a cloud CCM: MetalLB (L2 or BGP), Cilium BGP, NSX/AVI, OpenShift `ingresscontroller` + VIP, hardware LB. Pick one. Mixing L2 MetalLB with stretched VLAN to DR is [5](./5_Fabric_Cross_Connect_And_OOB.md)’s anti-pattern.

### etcd disks

On-prem etcd on a contended NFS datastore is a classic outage. Fast local SSD or a dedicated low-latency LUN. Restore onto **new** members ([6](./6_Storage_Backup_And_Restore.md), Kubernetes 5/7).

### GPU and special NICs

Device plugins, VFIO, SR-IOV. Firmware and drivers are node images, not `apt` in a Job. Spare SKU is a GPU node ([4](./4_Rack_BMC_And_Provisioning.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Already vSphere, want K8s | Supervisor/TKG **or** OpenShift IPI **or** kubeadm VMs — one |
| Air-gapped rack | kubeadm HA or OpenShift Agent/UPI + mirror |
| Many clusters | Rancher or a true platform team; not 40 unmonitored kubeadm |
| Edge | k3s with eyes open; GitOps from hub |
| OpenShift because of Operators/SCC | OpenShift on metal/vSphere — not EKS with a Route CRD |

**Staff checklist**

- Path from the table named; ROSA/EKS not assumed  
- API and Ingress VIPs real  
- etcd disk latency and restore tested  
- Control plane spread across hosts/racks  
- CSI backend named; hostPath not prod  
- Node replace: BMC/image or VM template  
- Disconnected: mirror and cert story if required  

**Good:** VIP, rack topology, CSI, etcd restore, one installer family. **Bad:** `kubeadm init` on one VM, hostPath, public 6443, three CP on one ESXi, expecting `type: LoadBalancer` to invent a cloud.

---

## References

- [Kubernetes production environment](https://kubernetes.io/docs/setup/production-environment/)  
- [kubeadm HA](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)  
- [OpenShift installation overview](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/installation_overview)  
- [Rancher](https://ranchermanager.docs.rancher.com/)  
- [RKE2](https://docs.rke2.io/)  
- [k3s](https://docs.k3s.io/)  
- [MetalLB](https://metallb.io/)  
- [vSphere Supervisor](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere-supervisor.html)  
