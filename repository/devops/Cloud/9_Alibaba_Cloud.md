# 9 — Alibaba Cloud

[← Previous](./8_IBM_Cloud.md) · [README](./README.md) · [Next: Tencent →](./10_Tencent_Cloud.md)

---

## 1. Concepts

**Alibaba Cloud** (Aliyun) is the large public cloud in **China** with a growing **international** (non-Mainland) footprint. Assume **Mainland China ≠ international** for accounts, ICP, networking, and which SKUs exist. Many global companies run a **dedicated China account** plus AWS/GCP elsewhere.

| Job | Alibaba name |
|-----|----------------|
| Identity | RAM (users, roles, STS) |
| VM | ECS |
| Network | VPC |
| Object storage | OSS |
| Registry | ACR (Container Registry) |
| Managed K8s | **ACK** (Alibaba Cloud Container Service for Kubernetes) |
| Serverless containers | ACK Serverless / SAE (product names vary by region) |

ACK is the GKE/EKS analog. **ACK managed** = they run the control plane. **ACK dedicated** = masters on your ECS (closer to [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)). Unmanaged kubeadm on ECS is still Kubernetes 6.

---

## 2. Advanced concepts

**RAM roles** for ECS and ACK worker identities are the IRSA/WI family. RAM users with long-lived AccessKey IDs are the anti-pattern for CI.

China networking: **ICP filing** for public websites, different CDN/DNS, and cross-border links (Express Connect / CEN) are first-class design, not an afterthought. Do not copy a `us-east-1` VPC diagram into `cn-hangzhou` and expect the same egress story.

ACK supports managed clusters and registered external clusters (hybrid). Read whether **you** own etcd.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Users in Mainland | Aliyun account + ACK/ECS in a China region; ICP if public HTTP |
| Global + China | Two estates; replicate artifacts; do not one-VPC both |
| K8s | ACK unless installer standard is kubeadm |

**Staff checklist**

- Mainland vs international account split  
- RAM roles, not AccessKeys in git  
- ACK vs self-managed named  

**Good:** RAM + ACK + OSS in one China region with a documented cross-border path. **Bad:** one global AWS account “peered” with a laptop VPN to Hangzhou.

---

## References

- [Alibaba Cloud docs](https://www.alibabacloud.com/help)  
- [ACK](https://www.alibabacloud.com/help/en/ack)  
- [RAM](https://www.alibabacloud.com/help/en/ram)  
