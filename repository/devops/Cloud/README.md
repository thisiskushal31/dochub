# Cloud literacy

How software lands on a **cloud you can name**: public IaaS/PaaS, managed Kubernetes SKUs, hosted private cloud, colo-as-a-service, and **tenant how-to** (IAM, VPC, on-ramps, CLI/IaC, FinOps). *Not certification dumps. Not kubeadm. Not plant encyclopedia.*

Clusters you install yourself: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes). OpenShift platform: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift). Rancher: [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher). Metal and the hall: [Datacenter/](../Datacenter/README.md) (colo order/on-ramp jobs: [Provider-Use](../Datacenter/Provider-Use/README.md)). Declare resources with [IAC/](../IAC/README.md). Delivery: [CiCd/](../CiCd/README.md).

Someone new should leave able to:

- Map IAM / VPC / object storage / container SKUs across the providers below  
- Tell **managed Kubernetes vs Cloud Run vs VMs vs hosted private cloud vs colo** apart  
- Federate CI ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) where the cloud supports it  
- Land a **hybrid** path (cloud constructs + colo on-ramp) without mixing landlord vs tenant products  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Shared | [1](./1_Shared_Cloud_Concepts.md) | Jobs, responsibility, name map |
| Choose a *kind* of cloud | [2](./2_Spectrum_And_When_Which.md) | IaaS / PaaS / managed K8s / hosted private / colo |
| Kubernetes as a **cloud product** | [3](./3_Managed_Kubernetes.md) | SKU map; they run the API |
| Providers | [4](./4_GCP_Literacy.md)–[14](./14_CtrlS_And_Yotta.md) | Full deploy solution on that cloud |
| **Advanced (tenant how-to)** | [15](./15_Org_IAM_And_Identity_Federation.md)–[22](./22_Hybrid_Colo_And_Cloud.md) | Org/IAM, VPC, on-ramps, instances, CLI/API, FinOps, VPS kin, hybrid |

Suggested order: **1 → 2 → 3**, then **4–14** by estate, then **15–22** for cross-cloud tenant depth.

---

## Chapters

| # | File | Focus |
|---|------|--------|
| 1 | [Shared cloud concepts](./1_Shared_Cloud_Concepts.md) | Regions, IAM sketch, network, storage names |
| 2 | [Spectrum and when which](./2_Spectrum_And_When_Which.md) | Which *kind* of cloud |
| 3 | [Managed Kubernetes](./3_Managed_Kubernetes.md) | GKE/EKS/AKS/ACK/… and ROSA/ARO/ROKS as SKUs |
| 4 | [GCP](./4_GCP_Literacy.md) | Org/project, GCE, GKE, Cloud Run |
| 5 | [AWS](./5_AWS_Literacy.md) | Account/IAM, EC2, ECS/EKS, Lambda, ROSA |
| 6 | [Azure](./6_Azure_Literacy.md) | Sub/RG, Entra, VMs, AKS, ARO |
| 7 | [Oracle Cloud](./7_Oracle_Cloud.md) | OCI, compartments, OKE |
| 8 | [IBM Cloud](./8_IBM_Cloud.md) | VPC, IKS, ROKS |
| 9 | [Alibaba Cloud](./9_Alibaba_Cloud.md) | RAM, ECS, ACK, China split |
| 10 | [Tencent Cloud](./10_Tencent_Cloud.md) | CAM, CVM, TKE |
| 11 | [Huawei Cloud](./11_Huawei_Cloud.md) | CCE, OBS, Cloud Stack |
| 12 | [OVHcloud](./12_OVHcloud.md) | Public Cloud, Bare Metal, MKS |
| 13 | [Deutsche Telekom](./13_Deutsche_Telekom.md) | Open Telekom Cloud, T-Systems |
| 14 | [CtrlS and Yotta](./14_CtrlS_And_Yotta.md) | India colo / hosted private / regional cloud |
| 15 | [Org, IAM, and identity federation](./15_Org_IAM_And_Identity_Federation.md) | Org boundaries; SSO; OIDC roles |
| 16 | [VPC and network constructs](./16_VPC_And_Network_Constructs.md) | Subnets, NAT, filters, DNS |
| 17 | [Private connectivity and on-ramps](./17_Private_Connectivity_And_On_Ramps.md) | DX/ER/Interconnect + colo path |
| 18 | [Compute instances and autoscaling](./18_Compute_Instances_And_Autoscaling.md) | VMs, ASG/MIG, GPU quotas |
| 19 | [Portals, CLI, and API patterns](./19_Portals_CLI_And_API_Patterns.md) | Objects over UI; IaC |
| 20 | [FinOps and cost controls](./20_FinOps_And_Cost_Controls.md) | Tags, budgets, waste |
| 21 | [Akamai Linode and VPS kin](./21_Akamai_Linode_And_VPS_Kin.md) | Tenant VPS ≠ colo |
| 22 | [Hybrid colo and cloud](./22_Hybrid_Colo_And_Cloud.md) | Interfaces across Datacenter + Cloud |

---

## Cross-links

- Datacenter / vSphere / metal: [Datacenter/](../Datacenter/README.md)  
- Colo on-ramp / XC / hands: [Datacenter/Provider-Use/](../Datacenter/Provider-Use/README.md)  
- IaC: [IAC/](../IAC/README.md)  
- OIDC for CI: [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)  
- FinOps program: [Methodologies/8](../Methodologies/8_FinOps_Literacy.md)  
- VM deploys: [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
- Cluster internals: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive)  

## Further reading

- [Google Cloud docs](https://cloud.google.com/docs)  
- [AWS docs](https://docs.aws.amazon.com/)  
- [Azure docs](https://learn.microsoft.com/azure/)  
- [OCI docs](https://docs.oracle.com/en-us/iaas/) · [IBM Cloud docs](https://cloud.ibm.com/docs)  
- [Alibaba Cloud](https://www.alibabacloud.com/help) · [Tencent Cloud](https://www.tencentcloud.com/document/product) · [Huawei Cloud](https://www.huaweicloud.com/intl/en-us/product/cce.html)  
- [OVHcloud](https://help.ovhcloud.com/) · [Open Telekom Cloud](https://docs.otc.t-systems.com/)  
- [Akamai Linode docs](https://www.linode.com/docs/)  
