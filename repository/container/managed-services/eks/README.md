# Amazon EKS – Deep dive

[← Back to Managed services](../README.md)

This folder is a **technical deep dive** on **Amazon Elastic Kubernetes Service (EKS)**. It covers standard Kubernetes concepts and **EKS-specific behavior**: what AWS changes, extends, or manages for you.

Content is based on the official [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/). Use **References** at the end of each file for the latest from AWS.

---

## What is EKS?

EKS is AWS's fully managed Kubernetes service. **AWS runs the control plane**; you run worker nodes (or use **EKS Auto Mode** for a fully managed data plane). Kubernetes-conformant. Use kubectl, Helm; integrate with IAM, ECR, CloudWatch. **EKS Anywhere** and **EKS Hybrid Nodes** extend to on-prem and edge.

**Kubernetes vs EKS:** Kubernetes defines the API. EKS runs the control plane (multi-AZ, VPC-isolated), adds **compute options** (Auto Mode, Fargate, Karpenter, managed node groups, self-managed, Hybrid), **add-ons** (VPC CNI, CoreDNS, kube-proxy, EBS CSI, etc.), **EKS Capabilities** (ACK, Argo CD, etc.), **IRSA/Pod Identity**, and AWS integrations (ECR, IAM, VPC, CloudWatch).

---

## Architecture (high level)

EKS follows standard Kubernetes architecture: **control plane** + **compute (nodes)**. The control plane is fully managed by AWS, with at least two API server instances and three etcd instances across three Availability Zones. Traffic is isolated in the cluster’s VPC. **Compute** options: EKS Auto Mode, Fargate, Karpenter, managed node groups, self-managed nodes, EKS Hybrid Nodes.

![EKS standard and Auto Mode](../../assets/eks-whatis.png)

*Credit: AWS. Source: [What is Amazon EKS?](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html), [EKS architecture](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html).*

![Kubernetes in action](../../assets/eks-k8sinaction.png)

*Credit: AWS. Source: [Kubernetes concepts](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-concepts.html).*

---

## Topics in this folder

| # | Topic | What’s covered | Kubernetes vs EKS |
|---|--------|----------------|-------------------|
| 1 | [Architecture and compute](./1-architecture-and-compute.md) | Control plane, Auto Mode, Fargate, Karpenter, node groups | Who manages what; EKS compute options |
| 2 | [Add-ons and Capabilities](./2-addons-and-capabilities.md) | VPC CNI, CoreDNS, kube-proxy, EBS CSI; ACK, Argo CD | EKS-managed vs self-managed add-ons; Capabilities |
| 3 | [Networking and storage](./3-networking-and-storage.md) | VPC CNI, load balancing, EBS/EFS CSI | AWS CNI and storage drivers |
| 4 | [Security and identity](./4-security-identity.md) | IRSA, Pod Identity, RBAC, encryption, GuardDuty | IAM integration is EKS-specific |
| 5 | [Operations and pricing](./5-operations-and-pricing.md) | Upgrades, monitoring, pricing | EKS control plane and node pricing |

---

## Quick links

- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [EKS architecture](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html)
- [EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)
- [EKS Capabilities](https://docs.aws.amazon.com/eks/latest/userguide/capabilities.html)
- [EKS Pricing](https://aws.amazon.com/eks/pricing/)

[← Back to Managed services](../README.md)
