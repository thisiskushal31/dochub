# Azure Kubernetes Service (AKS) – Deep dive

[← Back to Managed services](../README.md)

Technical deep dive on **AKS**: standard Kubernetes plus **AKS-specific** behavior (control plane, node pools, CNI, identity, modes, pricing). Based on [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/).

---

## What is AKS?

**Azure manages the control plane at no extra cost**; you pay for agent nodes. CNCF-certified. Use cases: microservices, DevOps, ML, Windows Server containers. **Kubernetes vs AKS:** AKS adds node pools, CNI options (Azure CNI, kubenet, overlay), Microsoft Entra ID and workload identity, cluster modes (Automatic vs Standard), pricing tiers, and Azure integrations (ACR, Key Vault, Monitor).

---

## Architecture

**Control plane:** API server, etcd, scheduler, controllers—Azure-managed. **Nodes:** Azure VMs in **node pools** (system + user). **Node resource group:** AKS creates a second resource group for node infrastructure.

![Baseline AKS](../../assets/aks-baseline-architecture.svg)  
*Credit: Microsoft. [Baseline architecture for AKS](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks/baseline-aks).*

![Microservices on AKS](../../assets/aks-microservices-architecture.svg)  
*Credit: Microsoft. [Microservices on AKS](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices).*

---

## Topics

| # | Topic | Focus |
|---|--------|--------|
| 1 | [Architecture and modes](./1-architecture-and-modes.md) | Control plane, nodes, node pools, Automatic vs Standard, pricing tiers |
| 2 | [Node pools and compute](./2-node-pools-and-compute.md) | VM size/image, OS (Ubuntu, Azure Linux, Windows), containerd, reservations |
| 3 | [Networking](./3-networking.md) | Azure CNI, kubenet, overlay, egress, network policies, load balancing |
| 4 | [Identity and security](./4-identity-and-security.md) | Entra ID, workload identity, Azure Policy, Defender |
| 5 | [Operations and pricing](./5-operations-and-pricing.md) | Upgrades, scaling, storage, monitoring, pricing |

---

## Quick links

- [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [Core concepts](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [Baseline architecture](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks/baseline-aks)
- [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)

[← Back to Managed services](../README.md)
