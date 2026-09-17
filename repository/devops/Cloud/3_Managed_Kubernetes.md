# 3 — Managed Kubernetes (cloud product map)

[← Previous](./2_Spectrum_And_When_Which.md) · [README](./README.md) · [Next: GCP →](./4_GCP_Literacy.md)

---

## 1. Concepts

**Managed Kubernetes** as a *cloud product* means the provider runs the **control plane**. You get an API endpoint and credentials. You still run **workloads**, and often still run **nodes** (unless you pick Autopilot / EKS Auto Mode / similar).

This chapter is a **SKU map**. How Kubernetes works: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes). GKE/EKS/AKS internals: [Managed-Services](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Managed-Services). You run etcd yourself: [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md).

| Service | Provider | Notes |
|---------|----------|--------|
| **GKE** | GCP | Autopilot or Standard — [4](./4_GCP_Literacy.md) |
| **EKS** | AWS | Node groups, Fargate, Auto Mode — [5](./5_AWS_Literacy.md) |
| **AKS** | Azure | Node pools — [6](./6_Azure_Literacy.md) |
| **OKE** | OCI | [7](./7_Oracle_Cloud.md) |
| **IKS** | IBM | Vanilla managed K8s — [8](./8_IBM_Cloud.md) |
| **ROKS** | IBM | Managed **OpenShift** — [8](./8_IBM_Cloud.md) |
| **ACK** | Alibaba | China vs international — [9](./9_Alibaba_Cloud.md) |
| **TKE** | Tencent | [10](./10_Tencent_Cloud.md) |
| **CCE** | Huawei | Public vs Cloud Stack — [11](./11_Huawei_Cloud.md) |
| **MKS** | OVHcloud | [12](./12_OVHcloud.md) |
| **CCE** | Open Telekom Cloud | [13](./13_Deutsche_Telekom.md) |
| **ROSA** | AWS + Red Hat | Managed OpenShift — [5](./5_AWS_Literacy.md) |
| **ARO** | Azure + Red Hat | Managed OpenShift — [6](./6_Azure_Literacy.md) |

ROSA/ARO/ROKS are **OpenShift**, not vanilla Kubernetes. Platform (Routes, Operators, SCC): [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift). This folder only names who bills and which VPC.

### What you still own

IAM bindings, cluster RBAC, network policy, image provenance, node/OS upgrades (when you own nodes), add-ons, backups of **your** PVCs, cost of nodes and LBs, and the app.

### What the provider owns

Control-plane availability and patching (within their SLA), the Kubernetes API endpoint, and (on Autopilot/Auto Mode) more of the node lifecycle.

---

## 2. Advanced concepts

### Identity into the cluster (so you do not paste keys)

| Platform | In-cluster cloud calls | Humans |
|----------|------------------------|--------|
| GKE | Workload Identity (KSA → GCP SA) | Google / workforce identity |
| EKS | IRSA (KSA → IAM role) | IAM Identity Center / IAM |
| AKS | Workload identity (KSA → Entra) | Entra ID |

Do not put cloud keys in Secrets for Pods that only need to talk to the same cloud.

### Networking you must name on the *cloud*

- Private nodes; explicit API endpoint (public vs private)  
- How Ingress/Gateway gets a **cloud** LB  
- Pod/service CIDRs vs VPC secondary ranges / CNI plugin  

### Upgrades

Managed control planes upgrade on a **channel** or by you clicking a version. Nodes lag unless you automate. Treat upgrades as a delivery event ([CiCd/](../CiCd/README.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Default new greenfield on one cloud | Managed K8s (GKE/EKS/AKS or the regional cousin) |
| Least node ops | Autopilot / EKS Auto Mode / Cloud Run or Container Apps instead |
| OpenShift on a hyperscaler | ROSA / ARO / ROKS — not a second EKS “for the same apps” |
| Custom control plane | Self-managed — Kubernetes 6, not this chapter |

**Staff checklist**

- Control-plane vs node ownership written down  
- Workload identity configured before the first cloud SDK in a Pod  
- Upgrade channel + node surge plan  
- Cluster-admin bindings inventory  

**Good:** private nodes, WI/IRSA, version skew policy. **Bad:** public nodes, node instance profile with Owner, cluster-admin bound to the CI robot forever.

---

## References

- [GKE docs](https://cloud.google.com/kubernetes-engine/docs)  
- [EKS user guide](https://docs.aws.amazon.com/eks/latest/userguide/)  
- [AKS docs](https://learn.microsoft.com/azure/aks/)  
- [ROSA](https://docs.openshift.com/rosa/welcome/index.html) · [ARO](https://learn.microsoft.com/azure/openshift/) · [ROKS](https://cloud.ibm.com/docs/openshift)  
- [OKE](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm) · [IKS](https://cloud.ibm.com/docs/containers)  
- [ACK](https://www.alibabacloud.com/help/en/ack) · [TKE](https://www.tencentcloud.com/document/product/457) · [Huawei CCE](https://www.huaweicloud.com/intl/en-us/product/cce.html)  
- [OVHcloud MKS](https://www.ovhcloud.com/en/public-cloud/kubernetes/)  
- [OTC CCE](https://docs.otc.t-systems.com/cloud-container-engine/)  
