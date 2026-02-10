# EKS: Networking and storage

[← EKS README](./README.md)

**Networking:** Amazon VPC CNI (Pod IPs from VPC), kube-proxy, CoreDNS, AWS Load Balancer Controller for NLB/ALB and Ingress. **Storage:** EBS CSI (block), EFS CSI (file). Based on EKS User Guide.

---

## Kubernetes vs EKS

Kubernetes defines Service/Ingress APIs. EKS provides **VPC CNI** (Pod IPs in VPC), **AWS Load Balancer Controller**, and **EBS/EFS CSI** drivers.

---

## Networking

- **VPC CNI:** Pods get IPs from node subnet (or custom CIDR). Pods are addressable in VPC; use security groups for Pods for per-workload SGs. Not used on Hybrid Nodes.
- **Load balancing:** Use **AWS Load Balancer Controller** for LoadBalancer Services (NLB/ALB) and Ingress (ALB). Without it, classic ELB behavior may apply.
- **Auto Mode:** Pod networking, Service networking, cluster DNS built in; no VPC CNI add-on needed for Auto-only.

---

## Storage

- **EBS CSI:** PersistentVolumes backed by EBS. Required for standard block (RWO). EKS add-on or self-managed. Auto Mode includes block storage.
- **EFS CSI:** PersistentVolumes backed by EFS (NFS, RWX). Add-on or self-managed.
- Other storage (FSx, etc.) via their CSI drivers or operators.

---

## References

- [VPC CNI](https://docs.aws.amazon.com/eks/latest/userguide/cni.html)
- [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
- [EBS CSI](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)
- [EFS CSI](https://docs.aws.amazon.com/eks/latest/userguide/efs-csi.html)

[← EKS README](./README.md)
