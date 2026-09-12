# Azure Kubernetes Service (AKS) – Deep dive

[← Back to Managed services](../README.md)

Technical deep dive on **AKS**: standard Kubernetes plus **AKS-specific** behavior (control plane, node pools, CNI, identity, modes, pricing). Based on [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/).

---

## What is AKS?

**Azure manages the control plane at no extra cost**; you pay for agent nodes. CNCF-certified. Use cases: microservices, DevOps, ML, Windows Server containers. **Kubernetes vs AKS:** AKS adds node pools, CNI options (Azure CNI, kubenet, overlay), Microsoft Entra ID and workload identity, cluster modes (Automatic vs Standard), pricing tiers, and Azure integrations (ACR, Key Vault, Monitor).

---

## Architecture

**Control plane:** API server, etcd, scheduler, controllers—Azure-managed. **Nodes:** Azure VMs in **node pools** (system + user). **Node resource group:** AKS creates a second resource group for node infrastructure.

![Baseline AKS](../../Assets/Aks_Baseline_Architecture.svg)  
*Credit: Microsoft. [Baseline architecture for AKS](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks/baseline-aks).*

![Microservices on AKS](../../Assets/Aks_Microservices_Architecture.svg)  
*Credit: Microsoft. [Microservices on AKS](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices).*

---

## Topics

| # | Topic | Focus |
|---|--------|--------|
| 1 | [Architecture and modes](./1_Architecture_and_Modes.md) | Control plane, nodes, node pools, Automatic vs Standard, pricing tiers |
| 2 | [Node pools and compute](./2_Node_Pools_and_Compute.md) | VM size/image, OS (Ubuntu, Azure Linux, Windows), containerd, reservations |
| 3 | [Networking](./3_Networking.md) | Azure CNI, kubenet, overlay, egress, network policies, load balancing |
| 4 | [Identity and security](./4_Identity_and_Security.md) | Entra ID, workload identity, Azure Policy, Defender |
| 5 | [Operations and pricing](./5_Operations_and_Pricing.md) | Upgrades, scaling, storage, monitoring, pricing |

---

## Quick links

- [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [Core concepts](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [Baseline architecture](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks/baseline-aks)
- [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)

[← Back to Managed services](../README.md)
