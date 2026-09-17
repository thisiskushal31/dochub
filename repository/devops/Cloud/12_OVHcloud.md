# 12 — OVHcloud

[← Previous](./11_Huawei_Cloud.md) · [README](./README.md) · [Next: Deutsche Telekom →](./13_Deutsche_Telekom.md)

---

## 1. Concepts

**OVHcloud** is a European hyperscaler: **Public Cloud** (OpenStack-based IaaS), **Bare Metal** (dedicated servers), **Hosted Private Cloud** (typically VMware-based), and **Managed Kubernetes Service (MKS)**. Identity is the OVHcloud customer account + IAM (users, roles) on the control panel / API.

This is a full public cloud, not a colo. It is also **not** AWS with French branding: APIs, Terraform providers, and Kubernetes CCM are OVH-specific.

| Job | OVHcloud name |
|-----|----------------|
| VM (public cloud) | Public Cloud instance (OpenStack) |
| Dedicated | Bare Metal |
| VMware DC-as-a-service | Hosted Private Cloud |
| Object storage | Object Storage (S3-compatible APIs in current products) |
| Managed K8s | MKS (Managed Kubernetes Service) |
| DNS | OVHcloud DNS |

---

## 2. Advanced concepts

Three estates people mix up:

1. **Public Cloud VM** + managed K8s — closest to “AWS lite.”  
2. **Bare Metal** — you get a server; vanilla kubeadm on it is [Kubernetes 7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md) (metal in someone else’s DC).  
3. **Hosted Private Cloud** — VMware ([Datacenter/7](../Datacenter/7_VMware_vSphere.md)) operated as a service ([Datacenter/2](../Datacenter/2_Ownership_Colo_And_Contracts.md)).

Managed Kubernetes on OVH is [3](./3_Managed_Kubernetes.md)-class (they run the control plane). kubeadm on Public Cloud instances is [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md).

Data residency in EU regions is a common **why**. Terraform: use the current OVH provider; do not assume AWS resource names.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| EU public cloud | Public Cloud + Managed Kubernetes |
| Dedicated performance | Bare Metal + your installer |
| Lift VMware | Hosted Private Cloud |

**Staff checklist**

- Public Cloud vs Bare Metal vs Hosted Private Cloud named  
- Managed K8s vs kubeadm named  
- API users least-privilege; 2FA on the account  

**Good:** Managed Kubernetes on Public Cloud for apps; Bare Metal only with a metal runbook. **Bad:** one dedicated box, public kube-apiserver, called “OVH EKS.”

---

## References

- [OVHcloud docs](https://help.ovhcloud.com/)  
- [Public Cloud](https://www.ovhcloud.com/en/public-cloud/)  
- [Managed Kubernetes (MKS)](https://www.ovhcloud.com/en/public-cloud/kubernetes/)  
- [Bare Metal](https://www.ovhcloud.com/en/bare-metal/)  
