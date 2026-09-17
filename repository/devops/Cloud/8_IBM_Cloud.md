# 8 — IBM Cloud

[← Previous](./7_Oracle_Cloud.md) · [README](./README.md) · [Next: Alibaba →](./9_Alibaba_Cloud.md)

---

## 1. Concepts

**IBM Cloud** is a public cloud with two historical planes you must not mix in your head: **classic** (older, VLAN-centric) and **VPC** (current, AWS-like VPCs). New work should be **VPC gen2** unless a brownfield classic account forces you.

Identity is **IBM Cloud IAM** (accounts, access groups, trusted profiles). Object storage is **Cloud Object Storage (COS)**. VMs are **Virtual Servers** in a VPC. Container registry exists as **Container Registry**.

Kubernetes offerings:

| Product | What it is |
|---------|------------|
| **IKS** | Managed vanilla Kubernetes |
| **ROKS** | Managed **OpenShift** on IBM Cloud ([OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift)) |

IBM also sells **satellite** / on-prem-adjacent patterns (run IBM Cloud locations on your hardware). That is hybrid, not “a VPC in Dallas.”

---

## 2. Advanced concepts

ROKS vs IKS is the same fork as ARO vs AKS: OpenShift API (Routes, Operators, SCC) vs vanilla Kubernetes. Do not assume Helm charts that need `LoadBalancer` + hostPath will drop onto ROKS unchanged.

Classic infrastructure used SSH keys and VLANs differently from VPC security groups. Migrations fail when Terraform still talks classic APIs.

PowerVS / zCloud / bare metal exist for mainframe-adjacent and dedicated hosts — literacy: they are **not** interchangeable with a VPC kube worker.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| OpenShift + IBM support | ROKS |
| Vanilla K8s on IBM | IKS |
| Mainframe-adjacent | Dedicated/Power paths; not IKS by default |

**Staff checklist**

- Classic vs VPC named on the account  
- IKS vs ROKS chosen before the first pipeline  
- IAM access groups, not shared “admin” API keys in CI  

**Good:** VPC + ROKS/IKS + COS in one region. **Bad:** classic VLAN cluster nobody can redraw, admin API key in Jenkins.

---

## References

- [IBM Cloud docs](https://cloud.ibm.com/docs)  
- [VPC](https://cloud.ibm.com/docs/vpc)  
- [IKS](https://cloud.ibm.com/docs/containers)  
- [ROKS](https://cloud.ibm.com/docs/openshift)  
