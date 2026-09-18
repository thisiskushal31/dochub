# 6 — Self-managed Kubernetes (you run the control plane)

[← Back to Kubernetes deep dive](./README.md) · [Next: Vanilla on metal →](./7_Vanilla_On_Bare_Metal.md)

---

## 1. Concepts

**Self-managed** (unmanaged) Kubernetes means **you run the control plane**: etcd, kube-apiserver, scheduler, controller-manager (or your installer does). You get no provider SLA on `https://….eks.amazonaws.com`. If the API dies at 3am, you (or your installer vendor) page.

The **machines** can be public-cloud VMs (the usual case) or metal. The machines do not change the definition: **you own etcd**.

Managed SKUs (GKE/EKS/AKS and cousins): [Managed-Services](../../Managed-Services/README.md) and DevOps [Cloud/3](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Cloud/3_Managed_Kubernetes.md). kubeadm on **physical** servers: [7](./7_Vanilla_On_Bare_Metal.md). The hall around the rack: DevOps [Datacenter/](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/README.md).

```text
Managed:      [Provider control plane] → your nodes (optional) → Pods
Self-managed: [Your etcd + API] → your workers → Pods
  on cloud VMs  →  still a cloud region/AZ, cloud disks, often a cloud CCM
  on metal      →  you supply LB, disks, CNI; see chapter 7
```

### Why it exists

| Reason | What you gain |
|--------|----------------|
| Version / API timing | A Kubernetes version or feature gate the managed SKU will not |
| Control-plane tenancy | You keep etcd; no provider-side multi-tenant API |
| Same installer everywhere | kubeadm/CAPI/RKE2 on AWS, GCP, Azure, or metal |
| Cost / SKU gaps | Avoid managed control-plane pricing or missing regions |
| Regulatory story | Some programs want “we operate the API server” |

None of these automatically beat managed. You inherited **production Kubernetes operations**. Install and HA procedures: [1](./1_Getting_Started_Install.md), [5](./5_Production_Operations.md).

### Installer families (names)

| Family | Shape |
|--------|--------|
| **kubeadm** | Kubernetes project bootstrap; you supply HA etcd, LB in front of API servers, nodes |
| **Cluster API (CAPI)** | Declarative machines; a management cluster creates workload clusters |
| **kops** | Historically AWS-strong cluster lifecycle |
| **Kubespray** | Ansible-driven kubeadm at fleet scale |
| **RKE2 / k3s** | Distributions you still operate — [Rancher](../Rancher/README.md) |
| **OpenShift UPI / IPI** | Self-managed OpenShift — not ROSA/ARO — [OpenShift](../OpenShift/README.md) |

Local toys (kind, minikube) are [Local-Dev](../../Local-Dev/README.md).

---

## 2. Advanced concepts

### If the nodes are cloud VMs

Self-managed does **not** mean “ignore IAM and VPC.” Production clusters need:

| Piece | Why |
|-------|-----|
| **Odd number of etcd members** across AZs | Split-brain and disk loss |
| **Load balancer in front of API servers** | kubelets and `kubectl` need a stable endpoint |
| **Cloud Controller Manager** | `Service type=LoadBalancer`, node lifecycle, zones |
| **CSI drivers** for cloud disks | PersistentVolumes that survive a node |
| **Instance IAM / SA** for CCM and CSI | Least privilege, not a VM with Owner |
| **CNI** that fits the VPC | Routing, NetworkPolicy, IP exhaustion |
| **Immutable images** for nodes | kubelet + containerd + patches |

Without CCM/CSI you have a cluster that cannot talk to cloud LBs or disks like the platform team expects.

### If the nodes are metal

You still need odd etcd, an API VIP, CNI, and storage — but **no** cloud CCM unless you fake one. LB is MetalLB, BGP, or hardware. Disks are local/SAN/Ceph. Facility: Datacenter chapter 2. The kubeadm shape: [7](./7_Vanilla_On_Bare_Metal.md).

### Cluster API mental model

A **management cluster** (often small, sometimes itself managed) holds Cluster/Machine objects. Providers (CAPA, CAPG, CAPZ, metal3, …) create machines. This is how self-managed workload clusters still get GitOps-shaped lifecycle without SSH snowflakes.

### Security shape

The API server is an endpoint **you** exposed. Private API + bastion/VPN, admission, and etcd encryption are not optional extras. Node SSH should be break-glass, not the control plane.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Learn production kubeadm on cloud | Three control-plane VMs + LB + workers in two AZs, **non-prod** |
| Multi-cloud same installer | CAPI providers per cloud; one management cluster |
| AWS-centric self-managed | kops or CAPI CAPA |
| “We refuse managed K8s SKUs” | Budget SRE time for etcd and upgrades explicitly |
| Metal + Kubernetes | Ops model here; install detail in [7](./7_Vanilla_On_Bare_Metal.md) |

**Staff checklist**

- Written: *we own etcd and API upgrades*  
- API behind an internal LB unless there is a documented public-API threat model  
- CCM + CSI + CNI chosen **or** explicitly absent because the nodes are metal  
- etcd backup/restore tested  
- Node images / OS patched on a cadence  
- Compared honestly to a managed SKU before building it in prod  

**Good:** CAPI or kubeadm HA on private VMs with CCM, tested etcd restore. **Bad:** one VM `kubeadm init`, public 6443, disks as `hostPath`, calling it “production EKS-equivalent.”

---

## References

- [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)  
- [Creating a cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)  
- [High availability with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)  
- [Cluster API](https://cluster-api.sigs.k8s.io/)  
- [kops](https://kops.sigs.k8s.io/)  
- [Cloud Controller Manager](https://kubernetes.io/docs/concepts/architecture/cloud-controller/)  
- [Turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)  
