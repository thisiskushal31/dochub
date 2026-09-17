# 2 — Spectrum and when which

[← Previous](./1_Shared_Cloud_Concepts.md) · [README](./README.md) · [Next: Managed Kubernetes →](./3_Managed_Kubernetes.md)

---

## 1. Concepts

Cloud literacy is **which kind of cloud you buy**, not a fashion contest. Delivery still has the same jobs: build, store, deploy, verify, rollback ([CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)).

```text
VM fleets on IaaS
  → containers on those VMs (ECS, Cloud Run, Container Apps — no cluster API)
  → managed Kubernetes (GKE, EKS, AKS, ACK, TKE, CCE, OKE, IKS, MKS, …)
  → managed OpenShift (ROSA, ARO, ROKS) as a *different* API on the same clouds
  → hosted private cloud / colo (vCenter or a cage, billed as a contract)
```

Installing kubeadm, OpenShift IPI, or Rancher is **not** this folder: [Kubernetes 6–7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md), [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift), [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher). Metal and the hall: [Datacenter/](../Datacenter/README.md).

### Decision table

| If you need… | Prefer | Chapter |
|--------------|--------|---------|
| SSH/systemd you already know | VM fleets on IaaS | [1](./1_Shared_Cloud_Concepts.md), [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) |
| Kubernetes API, least etcd work | Managed K8s | [3](./3_Managed_Kubernetes.md) |
| OpenShift API on a hyperscaler | ROSA / ARO / ROKS | [5](./5_AWS_Literacy.md), [6](./6_Azure_Literacy.md), [8](./8_IBM_Cloud.md) |
| Request-scoped containers | Cloud Run / Fargate / Container Apps | [4](./4_GCP_Literacy.md)–[6](./6_Azure_Literacy.md) |
| India DC residency | CtrlS / Yotta (colo or their cloud SKU) | [14](./14_CtrlS_And_Yotta.md) |
| EU public cloud (non-US majors) | OVH / OTC | [12](./12_OVHcloud.md), [13](./13_Deutsche_Telekom.md) |
| China regions | Aliyun / Tencent / Huawei | [9](./9_Alibaba_Cloud.md)–[11](./11_Huawei_Cloud.md) |
| A cage and your own iron | Colo / Datacenter | [Datacenter/](../Datacenter/README.md) |

ECS (AWS) is an orchestrator that is **not** Kubernetes. Valid. Do not translate every ECS service into a Deployment as a moral duty.

---

## 2. Advanced concepts

### Dual-run is a program

Running EKS **and** Cloud Run **and** a second cloud without owners is three platforms. Pick a **paved** path and a **documented exception** path ([Cloud-Native/3](../Cloud-Native/3_Platform_Engineering.md)).

### Cost is a topology choice

Managed control planes cost money *and* buy sleep. NAT, idle nodes, and unattached disks dominate many bills ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)). In colo the bill is also **amps and U**.

### Identity is the real multi-cloud

Multi-cloud that works is **OIDC and artifact digest**, not “Terraform module for three providers.” CI federation comes before a second region, let alone a second vendor ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

### IaC still applies

VMs and managed clusters should be declared ([IAC/](../IAC/README.md)). Click-ops on the control plane is how the second cluster drifts.

---

## 3. Applications and use cases

| Estate | Typical mix |
|--------|-------------|
| Startup, one cloud | Managed K8s or Cloud Run; VMs only if you must |
| Enterprise brownfield | VM fleets + one managed cluster |
| India residency | CtrlS/Yotta colo or their hosted SKU |
| EU non-US majors | OVH MKS or OTC CCE |
| China users | ACK / TKE / CCE in-region, not a VPN to `us-east-1` |
| OpenShift shop on AWS/Azure/IBM | ROSA / ARO / ROKS, not a second vanilla EKS “for apps” |

**Staff checklist**

- One sentence: which cloud *kind* and which vendor  
- VM vs managed-K8s vs serverless vs hosted-private chosen per **workload class**, not per ticket  
- Exception path requires a name and a review date  
- Cost tags (or rack U / kW in colo)  

**Good:** paved GKE plus a documented exception. **Bad:** every team picks a different home and calls it “multi-cloud strategy.”

---

## References

- [GKE](https://cloud.google.com/kubernetes-engine/docs) · [EKS](https://docs.aws.amazon.com/eks/latest/userguide/) · [AKS](https://learn.microsoft.com/azure/aks/)  
- [ROSA](https://docs.openshift.com/rosa/welcome/index.html) · [ARO](https://learn.microsoft.com/azure/openshift/)  
- [Cloud Run](https://cloud.google.com/run/docs) · [Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) · [Container Apps](https://learn.microsoft.com/azure/container-apps/)  
- [CiCd delivery spectrum](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)  
