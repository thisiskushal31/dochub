# AKS: Node pools and compute

[← AKS README](./README.md)

**VM size and image**, **OS** (Ubuntu, Azure Linux, Windows), **resource reservations**, **container runtime** (containerd). Based on [Core concepts](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads) and [Node images](https://learn.microsoft.com/en-us/azure/aks/node-images).

---

## Kubernetes vs AKS

Kubernetes does not define VM size or node OS. AKS uses **Azure VMs** and **node images** (Ubuntu, Azure Linux, Windows). **Resource reservations** (CPU/memory) are AKS-specific to reserve capacity for system components.

---

## VM size and image

- **VM size:** Defines CPU, memory, storage type. Choose by workload and pods-per-node. Default VM SKU/size can be dynamically selected by AKS if not specified (see quotas/SKUs doc).
- **VM image:** Ubuntu, **Azure Linux**, or Windows Server 2022. Azure Linux 2.0 is being retired; migrate to Azure Linux 3 or supported version. Nodes are billed as standard VMs; reservations apply.

---

## OS and container runtime

- **Linux:** Ubuntu (default) or Azure Linux. **Containerd** for Kubernetes 1.19+.
- **Windows:** Windows Server 2022 (LTSC). Containerd is GA; only option on 1.23+. One Windows version per node pool.
- **Resource reservations:** AKS reserves CPU and memory on each node for system components; see [Resource reservations in AKS](https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations). Allocatable resources = total minus reservations.

---

## Node pools (recap)

- **System pool:** For system Pods. **User pools:** For app workloads. Multiple user pools allow different VM sizes, OS, or features (e.g. confidential computing, GPU). Scaling: **cluster autoscaler** (nodes), **HPA** (pods), **KEDA** (event-driven).

---

## References

- [Core concepts (clusters, workloads)](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [Supported VM sizes](https://learn.microsoft.com/en-us/azure/aks/quotas-skus-regions#supported-vm-sizes)
- [Node images](https://learn.microsoft.com/en-us/azure/aks/node-images)
- [Azure Linux](https://learn.microsoft.com/en-us/azure/aks/use-azure-linux)
- [Resource reservations](https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations)
- [Create / manage node pools](https://learn.microsoft.com/en-us/azure/aks/create-node-pools)

[← AKS README](./README.md)
