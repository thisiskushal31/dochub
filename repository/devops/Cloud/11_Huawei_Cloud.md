# 11 — Huawei Cloud

[← Previous](./10_Tencent_Cloud.md) · [README](./README.md) · [Next: OVHcloud →](./12_OVHcloud.md)

---

## 1. Concepts

**Huawei Cloud** is Huawei’s public cloud (and a stack they also sell **on-prem** as **Huawei Cloud Stack / HCS**). Do not confuse the public API with an appliance in a customer DC — same vendor, different operating model ([Datacenter/8](../Datacenter/8_Other_Hypervisors_And_Private_IaaS.md)).

| Job | Huawei Cloud name |
|-----|-------------------|
| Identity | IAM |
| VM | ECS |
| Network | VPC |
| Object storage | OBS |
| Registry | SWR |
| Managed K8s | **CCE** (Cloud Container Engine) |
| On-prem cousin | Huawei Cloud Stack (private cloud) |

CCE is managed Kubernetes (Standard / Turbo / Autopilot SKUs — read who owns nodes). kubeadm on ECS is [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md).

---

## 2. Advanced concepts

Public Huawei Cloud vs **HCS in a bank DC** changes who you page, which IAM, and whether you get a global region map. Treat HCS as a **private cloud** that happens to look like Huawei APIs.

CCE supports clusters on VMs and (in some offerings) bare metal / Turbo. Read node ownership. CN Mainland vs international regions apply here too (accounts, licenses, network).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Public Huawei region | CCE + OBS + VPC |
| Sovereign / private looking like Huawei | HCS on customer metal — ops are yours + vendor support |
| Vanilla K8s standard | CCE or kubeadm — pick one paved path |

**Staff checklist**

- Public cloud vs Cloud Stack named in the runbook  
- IAM users/roles, not shared passwords  
- CCE vs self-managed  

**Good:** CCE with IAM agencies for nodes. **Bad:** HCS cluster treated as “managed GKE” with no etcd backup owner.

---

## References

- [Huawei Cloud docs](https://support.huaweicloud.com/)  
- [CCE](https://www.huaweicloud.com/intl/en-us/product/cce.html)  
- [Huawei Cloud Stack](https://www.huaweicloud.com/intl/en-us/product/hcs.html)  
