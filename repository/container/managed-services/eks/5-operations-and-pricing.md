# EKS: Operations and pricing

[← EKS README](./README.md)

Technical detail on **EKS upgrades**, monitoring, and **pricing**. Kubernetes has no notion of “EKS control plane fee” or “Fargate pricing”; these are **EKS-specific**. Based on EKS User Guide and [EKS Pricing](https://aws.amazon.com/eks/pricing/).

---

## Kubernetes vs EKS

- **Kubernetes:** You upgrade the cluster (control plane and nodes) yourself or via a vendor.
- **EKS:** **Control plane** is upgraded by AWS (you choose when to opt in to new versions). **Nodes** you upgrade (or they’re managed in Auto Mode/Fargate). **Pricing** is per cluster (control plane), per node (EC2/Fargate), and for storage/transfer.

---

## Upgrades (EKS-specific)

- **Control plane:** AWS maintains multiple Kubernetes versions. You upgrade the cluster to a supported version when ready. Old versions eventually go out of support; plan upgrades before EOL.
- **Node groups / Fargate:** After upgrading the control plane, upgrade node groups (or let Fargate/Karpenter pick new images). Stay within [supported version skew](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html).
- **EKS Auto Mode:** AWS manages node and component upgrades; you keep the cluster version current.
- **Add-ons:** Upgrade EKS add-ons to versions compatible with your cluster version. EKS can suggest or apply add-on updates.

---

## Monitoring and logging

- **CloudWatch Container Insights:** Metrics and logs from nodes and Pods. Enable in the EKS console or via CLI.
- **Control plane logging:** Send API server, audit, authenticator, scheduler logs to CloudWatch Logs. Configurable per log type.
- **Prometheus/Grafana:** Run in-cluster or use Amazon Managed Service for Prometheus. Not part of base EKS; you or an add-on install it.

---

## Pricing (EKS-specific)

- **Control plane:** Per cluster, per hour (e.g. ~$0.10/hour). No charge for Fargate or node capacity in this line item.
- **Compute – EC2:** You pay for EC2 instances used by node groups (on-demand or Spot). Savings Plans and Reserved Instances apply to EC2.
- **Compute – Fargate:** Per vCPU and per GB memory, per second (minimum 1 minute). No node to manage.
- **EKS Auto Mode:** Separate pricing; see [EKS Pricing](https://aws.amazon.com/eks/pricing/) and Auto Mode docs.
- **EKS Hybrid Nodes:** Billing for control plane and optional support; nodes are your hardware.
- **Storage:** EBS and EFS are billed separately (volumes, IOPS, throughput). Data transfer out has cost.
- **Add-ons:** No extra charge for EKS add-ons (you pay for resources they use, e.g. EC2 for nodes running CoreDNS). Third-party Marketplace add-ons may have their own fee.

---

## References

- [EKS Kubernetes versions](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html)
- [Updating a cluster](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html)
- [EKS monitoring](https://docs.aws.amazon.com/eks/latest/userguide/monitoring.html)
- [EKS Pricing](https://aws.amazon.com/eks/pricing/)
- [Control plane logging](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html)

[← EKS README](./README.md)
