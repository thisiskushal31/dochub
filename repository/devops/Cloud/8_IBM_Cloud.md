# 8 — IBM Cloud

[← Previous](./7_Oracle_Cloud.md) · [README](./README.md) · [Next: Alibaba →](./9_Alibaba_Cloud.md) · [Full catalog](./Catalogs/IBM_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map — Floor 1 jobs on IBM Cloud

| Job | IBM wiring | Depth |
|-----|------------|-------|
| Isolation | Account; resource groups | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Identity | IBM Cloud IAM; access groups; trusted profiles | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | **VPC** (prefer) vs classic VLANs | [16](./16_VPC_And_Network_Constructs.md) |
| Compute | Virtual Servers; bare metal / Power paths | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | Cloud Object Storage (COS) | [24](./24_Object_Block_And_File_Storage.md) |
| K8s | **IKS** (vanilla) / **ROKS** (OpenShift) | [3](./3_Managed_Kubernetes.md) |
| Registry | Container Registry | [27](./27_Container_Registries_And_Artifacts.md) |

---

## 1. Concepts

**IBM Cloud** has two historical planes: **classic** (older, VLAN-centric) and **VPC** (current). New work should be **VPC gen2** unless brownfield classic forces you.

| Product | What it is |
|---------|------------|
| **IKS** | Managed vanilla Kubernetes |
| **ROKS** | Managed **OpenShift** on IBM Cloud |

IBM also sells **satellite** / on-prem-adjacent patterns. That is hybrid ([22](./22_Hybrid_Colo_And_Cloud.md)), not “a VPC in Dallas.”

---

## 2. Advanced concepts

ROKS vs IKS is the same fork as ARO vs AKS: OpenShift API (Routes, Operators, SCC) vs vanilla Kubernetes ([28](./28_Deployment_Shapes_On_Cloud.md)). Do not assume Helm charts that need `LoadBalancer` + hostPath drop onto ROKS unchanged ([23](./23_Load_Balancing_Ingress_And_TLS.md)).

Classic vs VPC migrations fail when Terraform still talks classic APIs ([19](./19_Portals_CLI_And_API_Patterns.md)). PowerVS / zCloud / bare metal are **not** interchangeable with a VPC kube worker.

---


### How you grant permission on IBM Cloud (quick)

**IAM** access groups + roles/policies; **trusted profiles** for workloads. Prefer SSO. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on IBM Cloud

| Need | Product | See |
|------|---------|-----|
| VMs | Virtual Servers (VPC) | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Vanilla K8s | IKS | [3](./3_Managed_Kubernetes.md) |
| OpenShift | ROKS | [3](./3_Managed_Kubernetes.md) |
| Object / data | COS + managed DB SKUs | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| AI | watsonx (current docs) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | IBM Cloud Monitoring / Log Analysis (current docs) | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| OpenShift + IBM support | ROKS |
| Vanilla K8s on IBM | IKS |
| Mainframe-adjacent | Dedicated/Power paths; not IKS by default |

**Staff checklist**

- Classic vs VPC named on the account  
- IKS vs ROKS chosen before the first pipeline  
- Trusted profiles / IAM for automation; no standing API keys in git  
- Private VPC subnets for workers  

**Good:** VPC + IKS/ROKS named + IAM groups. **Bad:** classic leftovers + OpenShift charts on IKS.

---

## References

- **Choose surface:** [IBM product catalog (what / when / why not)](./Catalogs/IBM_Products.md)  
- [IBM Cloud docs](https://cloud.ibm.com/docs) *(API depth after you chose)*  
- [IAM](https://cloud.ibm.com/docs/account?topic=account-iamoverview)  
- [IKS](https://cloud.ibm.com/docs/containers) · [ROKS](https://cloud.ibm.com/docs/openshift)  
