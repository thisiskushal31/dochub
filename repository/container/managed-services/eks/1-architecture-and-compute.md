# EKS: Architecture and compute

[← EKS README](./README.md)

Technical detail on **EKS control plane**, **compute options** (Auto Mode, Fargate, Karpenter, managed node groups, self-managed, Hybrid), and how they differ from plain Kubernetes. Based on [EKS architecture](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html).

---

## Kubernetes vs EKS

- **Same:** Kubernetes API (Pods, Deployments, Services, etc.). You use kubectl and standard resources.
- **EKS-specific:** Control plane is AWS-managed, multi-AZ, VPC-isolated. **Compute** is one of: EKS Auto Mode (managed data plane), Fargate (serverless nodes), Karpenter (autoscaler), managed node groups, self-managed nodes, or EKS Hybrid Nodes (on-prem/edge).

---

## Control plane (EKS-specific)

- **Unique per cluster:** Each cluster has its own control plane; no sharing between clusters or accounts.
- **Layout:** At least two API server instances and three etcd instances across **three Availability Zones** in the region. Amazon VPC isolates traffic between control plane components.
- **Resilience:** EKS monitors and replaces failing control plane instances; can use a different AZ.
- **SLA:** [API server endpoint availability SLA](https://aws.amazon.com/eks/sla) when running across multiple AZs.
- You never SSH into or manage control plane nodes; upgrades and patching are managed by AWS.

---

## Compute options (EKS-specific)

| Option | Who manages | Use when |
|--------|-------------|----------|
| **EKS Auto Mode** | AWS (data plane + nodes) | Minimal ops; AWS manages scaling, networking, DNS, storage |
| **Fargate** | AWS (serverless nodes) | No node management; pay per Pod resource |
| **Karpenter** | You install; AWS supports | Just-in-time, right-sized nodes; high efficiency |
| **Managed node groups** | AWS (lifecycle); you choose size/type | Balance of automation and control; IRSA, custom kubelet |
| **Self-managed nodes** | You (EC2, scaling, AMI) | Full control over node lifecycle and image |
| **EKS Hybrid Nodes** | You (on-prem/edge); control plane on AWS | Unified management for on-prem and edge |

See [EKS architecture](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html), [EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html), [Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html), [Managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html), [EKS Hybrid Nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html).

---

## Creating clusters (EKS-specific)

- **Tools:** eksctl, AWS Console, AWS CLI, Terraform, CloudFormation.
- **Example (eksctl):** `eksctl create cluster --name my-cluster --region us-east-1 --nodegroup-name workers --node-type t3.medium --nodes 3`
- **kubeconfig:** `aws eks update-kubeconfig --name my-cluster --region us-east-1`
- Console-created clusters get **EKS add-ons** (VPC CNI, kube-proxy, CoreDNS) by default.

---

## References

- [EKS architecture](https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html)
- [EKS Auto Mode](https://docs.aws.amazon.com/eks/latest/userguide/automode.html)
- [Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html)
- [Managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html)
- [Self-managed nodes](https://docs.aws.amazon.com/eks/latest/userguide/worker.html)
- [EKS Hybrid Nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html)
- [Karpenter](https://karpenter.sh/)
- [Getting started with EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html)

[← EKS README](./README.md)
