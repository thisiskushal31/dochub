# 1 — Shared cloud concepts

[← How to read](./0_How_To_Read.md) · [README](./README.md) · [Next: Spectrum →](./2_Spectrum_And_When_Which.md)

---

## 1. Concepts

A **public cloud** is someone else’s data centers, APIs, and IAM, billed as metered resources. A **datacenter operator** (colo, hosted VMware) sells buildings and sometimes a smaller API. Names differ; the **jobs** do not: identity, network, load balancing, compute, disks, object storage, DNS/CDN, secrets, and “which SKU runs my containers.”

This folder is **provider solutions + tenant jobs**. Metal and the hall: [Datacenter/](../Datacenter/README.md). Clusters you install: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes).

### Failure domains

| Idea | Meaning |
|------|---------|
| **Region** | Independent geography (latency, data residency, blast radius) |
| **Availability zone (AZ)** | Isolated building/power/network *inside* a region (names vary: AZ, availability domain, …) |
| **Multi-region** | Separate control planes and data copies — not “tick two AZs” |
| **Rack / feed / room** | The DC equivalent — [Datacenter/](../Datacenter/README.md) |

Put two nodes in two AZs (or two feeds) before you invent “global.”

### Shared responsibility

The provider secures **the cloud** (buildings, hypervisor, managed control planes they run). You secure **in the cloud**: identities, network paths, data, what you install on VMs, and cluster config you own. Managed Kubernetes moves *control-plane* ops to the provider; it does not move *your* RBAC, images, or app secrets.

**Disconfirm:** “Managed” does **not** mean “no IAM work.” A green checkbox on a compliance page does **not** replace least privilege.

**Confirm:** Who patches the Kubernetes API server on GKE/EKS/AKS? Who patches your Deployment YAML and image?

### Term map — majors (keep this)

| Job | AWS | GCP | Azure | Depth |
|-----|-----|-----|-------|-------|
| Org container | Organization / OU / account | Org / folder / project | Entra tenant / mgmt group / subscription | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Deploy grouping | Tags + accounts | Labels + project | Resource group | [19](./19_Portals_CLI_And_API_Patterns.md) |
| VM | EC2 | Compute Engine | Virtual Machines | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Autoscaled VM fleet | Auto Scaling group | Managed instance group | Virtual Machine Scale Set | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| VPC network | VPC | VPC | Virtual Network (VNet) | [16](./16_VPC_And_Network_Constructs.md) |
| Object storage | S3 | Cloud Storage (GCS) | Blob Storage | [24](./24_Object_Block_And_File_Storage.md) |
| Block disk | EBS | Persistent Disk | Managed Disks | [24](./24_Object_Block_And_File_Storage.md) |
| Container registry | ECR | Artifact Registry | ACR | [27](./27_Container_Registries_And_Artifacts.md) |
| Managed K8s | EKS | GKE | AKS | [3](./3_Managed_Kubernetes.md) |
| Serverless functions | Lambda | Cloud Functions | Azure Functions | [2](./2_Spectrum_And_When_Which.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Serverless containers | Fargate / App Runner | Cloud Run | Container Apps | [2](./2_Spectrum_And_When_Which.md) |
| Secrets | Secrets Manager / SSM | Secret Manager | Key Vault | [26](./26_Secrets_KMS_And_Encryption.md) |
| KMS / CMK | KMS | Cloud KMS | Key Vault keys | [26](./26_Secrets_KMS_And_Encryption.md) |
| DNS | Route 53 | Cloud DNS | Azure DNS | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| CDN / edge HTTP | CloudFront | Cloud CDN | Front Door / CDN | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| L7 load balancer | ALB | Cloud Load Balancing (HTTP) | Application Gateway | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| L4 load balancer | NLB | Network / TCP LB | Azure Load Balancer | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| Identity for machines | IAM role | Service account | Managed identity | [15](./15_Org_IAM_And_Identity_Federation.md) |
| CI federation | IAM OIDC provider | Workload Identity Federation | Federated credentials | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Audit logs | CloudTrail | Cloud Audit Logs | Activity Log | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Managed metrics/logs | CloudWatch | Cloud Monitoring / Logging | Azure Monitor | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Traces | X-Ray | Cloud Trace | Application Insights | [30](./30_Cloud_Observability_And_Audit_Doors.md) |

### Term map — other providers (same jobs)

| Job | OCI | IBM | Alibaba | Tencent | Huawei | OVH |
|-----|-----|-----|---------|---------|--------|-----|
| Isolation | Tenancy / compartment | Account / resource group | Account / RAM | Account / CAM | Account / IAM | Project / Public Cloud project |
| VM | Compute instance | Virtual Server | ECS | CVM | ECS | Instance / VPS |
| VPC | VCN | VPC | VPC | VPC | VPC | vRack / Private Network |
| Object storage | Object Storage | COS | OSS | COS | OBS | Object Storage |
| Managed K8s | OKE | IKS (ROKS = OpenShift) | ACK | TKE | CCE | MKS |
| Identity | IAM policies | IBM Cloud IAM | RAM | CAM | IAM | IAM / users+roles |

Exact wiring: provider chapters [4](./4_GCP_Literacy.md)–[14](./14_CtrlS_And_Yotta.md). Managed SQL, queues, warehouses — **recognize** here; depth in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive).

### Where to go

| Kind | Where |
|------|--------|
| How to read | [0](./0_How_To_Read.md) |
| Which *kind* of cloud | [2](./2_Spectrum_And_When_Which.md) |
| Kubernetes as a cloud SKU | [3](./3_Managed_Kubernetes.md) |
| Tenant jobs (permissions → observability) | [15](./15_Org_IAM_And_Identity_Federation.md)–[30](./30_Cloud_Observability_And_Audit_Doors.md) |
| GCP / AWS / Azure | [4](./4_GCP_Literacy.md)–[6](./6_Azure_Literacy.md) |
| OCI / IBM | [7](./7_Oracle_Cloud.md)–[8](./8_IBM_Cloud.md) |
| Alibaba / Tencent / Huawei | [9](./9_Alibaba_Cloud.md)–[11](./11_Huawei_Cloud.md) |
| OVHcloud / Deutsche Telekom | [12](./12_OVHcloud.md)–[13](./13_Deutsche_Telekom.md) |
| CtrlS / Yotta | [14](./14_CtrlS_And_Yotta.md) |
| Datacenter / vSphere / metal | [Datacenter/](../Datacenter/README.md) |
| Self-managed / vanilla kubeadm | [Kubernetes 6–7](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md) |
| OpenShift platform | [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift) |
| Rancher | [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher) |

---

## 2. Advanced concepts

### Identity sketch

Humans: SSO into the cloud console (IdP). Machines: **roles / service accounts / managed identities**, not long-lived keys in git. CI should **federate** (OIDC), not store JSON keys ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)). Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

Pods that call cloud APIs should use **workload identity** (IRSA / GKE WI / AKS WI), not a node-wide key.

### Network sketch

```text
Internet → edge (CDN / global LB) optional
        → load balancer (+ TLS)
        → public subnet (LB / NAT / bastion)
        → private subnet (VMs / nodes) — no public IPs by default
        → data plane (managed DB, object store endpoints)
```

Firewalls are **allow-lists**. NAT is how private VMs reach the internet without being reachable from it. LB depth: [23](./23_Load_Balancing_Ingress_And_TLS.md). VPC depth: [16](./16_VPC_And_Network_Constructs.md). Packet depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

### Quotas and billing

Every API has **quotas**. Autoscaling into a quota wall looks like an outage. Tags/labels are how FinOps attributes spend ([20](./20_FinOps_And_Cost_Controls.md), [Methodologies/8](../Methodologies/8_FinOps_Literacy.md)).

### What this folder is not

Not a list of every product SKU. Not kubeadm. Not hypervisor internals. Not Terraform HCL ([IAC/](../IAC/README.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First production app | One region, two AZs, private compute, LB, object storage, federated CI |
| Lift classic hosts | VMs + MIG/ASG/VMSS ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md), [28](./28_Deployment_Shapes_On_Cloud.md)) |
| Containers on a cloud | [3](./3_Managed_Kubernetes.md) vs Cloud Run/Fargate/Container Apps |
| Colo / metal | [Datacenter/](../Datacenter/README.md) |
| Multi-cloud *words* | Same jobs, different names — do not dual-run two clouds without a reason |

**Staff checklist**

- Region and AZ story written before the first cluster  
- No long-lived cloud keys in CI  
- Private-by-default compute; public only for LBs/ingress  
- Resource labels/tags present for cost  
- Kubernetes *SKU* named if you use the Kubernetes API — not “we use K8s” as a blank  
- Know which Floor 1 chapter owns IAM vs LB vs storage  

**Good:** two AZs, private nodes, OIDC from CI. **Bad:** one public VM with an access key in GitHub Secrets.

---

## References

- [AWS global infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)  
- [Google Cloud geography and regions](https://cloud.google.com/docs/geography-and-regions)  
- [Azure regions](https://learn.microsoft.com/azure/reliability/regions-overview)  
- [AWS shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/)  
