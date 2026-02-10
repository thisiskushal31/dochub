# EKS: Add-ons and Capabilities

[← EKS README](./README.md)

**EKS add-ons** are curated components (VPC CNI, CoreDNS, kube-proxy, EBS CSI, etc.) that EKS can install and manage. **EKS Capabilities** (ACK, Argo CD, kro) are fully managed controllers running in AWS-owned infrastructure. Based on [EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) and [Capabilities](https://docs.aws.amazon.com/eks/latest/userguide/capabilities.html).

---

## Kubernetes vs EKS

Kubernetes does not define “add-ons.” EKS ships default networking/DNS (VPC CNI, kube-proxy, CoreDNS) and offers **EKS add-ons** (AWS-managed, patched). **Capabilities** are EKS-managed APIs and controllers outside your cluster.

---

## EKS add-ons

- **VPC CNI, kube-proxy, CoreDNS:** Often installed by default. Prefer **EKS add-ons** for AWS patching and version compatibility. Console-created clusters get EKS add-ons; eksctl/CLI may install self-managed—you can add EKS add-ons later.
- **EBS CSI, EFS CSI:** For block and file storage. Install as EKS add-on or self-managed.
- **EKS Auto Mode:** Built-in Pod networking, DNS, block storage, LB controller, Pod Identity. VPC CNI/kube-proxy/CoreDNS/EBS CSI add-ons are redundant in pure Auto Mode; with mixed compute, add-ons run on supported node types.
- **VPC CNI** is not used on **EKS Hybrid Nodes**; check add-on compatibility for hybrid.
- **Types:** AWS (full support, patched by AWS); Marketplace (partner); Community (scanned, community-supported). Customize non-managed fields via server-side apply. Custom namespace optional at create.

---

## EKS Capabilities

- **ACK (AWS Controllers for Kubernetes):** Manage AWS resources (S3, RDS, DynamoDB, etc.) as Kubernetes CRs.
- **Argo CD:** GitOps CD; sync from Git; single- or multi-cluster.
- **kro:** Custom Kubernetes APIs that compose multiple resources for platform self-service.

Controllers run in AWS infrastructure; EKS manages lifecycle and monitoring.

---

## References

- [EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html)
- [AWS add-ons available](https://docs.aws.amazon.com/eks/latest/userguide/workloads-add-ons-available-eks.html)
- [EKS Capabilities](https://docs.aws.amazon.com/eks/latest/userguide/capabilities.html)

[← EKS README](./README.md)
