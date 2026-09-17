# 10 — Tencent Cloud

[← Previous](./9_Alibaba_Cloud.md) · [README](./README.md) · [Next: Huawei →](./11_Huawei_Cloud.md)

---

## 1. Concepts

**Tencent Cloud** is another major public cloud with **Mainland China** and **international** regions. Same split as Alibaba: accounts, compliance, and network are not one global fabric.

| Job | Tencent name |
|-----|----------------|
| Identity | CAM (users, roles) |
| VM | CVM |
| Network | VPC |
| Object storage | COS |
| Registry | TCR |
| Managed K8s | **TKE** (Tencent Kubernetes Engine) |
| Serverless containers | TKE Serverless (name varies by region; confirm in console) |

TKE is managed Kubernetes. Self-managed on CVM is [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md).

---

## 2. Advanced concepts

CAM roles for CVM/TKE are the machine-identity path. Sub-accounts + policies beat a company-wide root key.

Tencent’s ecosystem (WeChat, games, payments) often drives **why** a team is here — latency to those users — not a generic “third cloud.” Design for that, then pick TKE vs CVM fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| CN user base | TKE/CVM in a China region |
| Vanilla K8s | TKE |
| Existing installer | kubeadm on CVM only with CCM/CSI for Tencent |

**Staff checklist**

- China vs international  
- CAM roles for nodes and CI  
- TKE vs unmanaged named  

**Good:** CAM + TKE + COS. **Bad:** personal account AccessKeys on production CVMs.

---

## References

- [Tencent Cloud docs](https://www.tencentcloud.com/document/product)  
- [TKE](https://www.tencentcloud.com/document/product/457)  
- [CAM](https://www.tencentcloud.com/document/product/598)  
