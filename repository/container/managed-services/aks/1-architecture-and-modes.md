# AKS: Architecture and cluster modes

[← AKS README](./README.md)

**Control plane** (Azure-managed), **nodes** and **node resource group**, **node pools** (system/user), **cluster modes** (Automatic vs Standard), **pricing tiers**. Based on [Core concepts for AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads).

---

## Kubernetes vs AKS

Control plane is standard (API server, etcd, scheduler, controllers) but **Azure-managed at no extra cost**. **Node pools**, **cluster modes**, and **pricing tiers** are AKS-specific.

---

## Control plane and nodes

- **Control plane:** kube-apiserver, etcd, scheduler, controller-manager, cloud-controller-manager. Managed by Azure; label `kubernetes.azure.com/managedby: aks`.
- **Nodes:** Azure VMs (kubelet, kube-proxy, containerd). Live in **node resource group** (second resource group created by AKS). See [FAQ](https://learn.microsoft.com/en-us/azure/aks/faq) for resource group details.

---

## Node pools

- **System node pool:** Hosts system Pods (CoreDNS, konnectivity). Required.
- **User node pools:** Application workloads. Different VM sizes, OS, or features per pool. Create via [Create node pools](https://learn.microsoft.com/en-us/azure/aks/create-node-pools).

---

## Cluster modes and pricing tiers

- **AKS Automatic:** More managed (nodes, scaling, security). **AKS Standard:** More control (node pools, scaling). See [AKS Automatic and Standard](https://learn.microsoft.com/en-us/azure/aks/intro-aks-automatic).
- **Pricing tiers:** Free, Standard, Premium—affect management features and SLA. [Pricing tiers](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers). Control plane is free; you pay nodes, storage, LB, add-ons.

---

## References

- [Core concepts for AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [AKS Automatic and Standard](https://learn.microsoft.com/en-us/azure/aks/intro-aks-automatic)
- [Pricing tiers](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers)
- [Create node pools](https://learn.microsoft.com/en-us/azure/aks/create-node-pools)

[← AKS README](./README.md)
