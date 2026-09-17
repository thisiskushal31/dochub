# 1 — Shared cloud concepts

[← Cloud](./README.md) · [Next: Spectrum →](./2_Spectrum_And_When_Which.md)

---

## 1. Concepts

A **public cloud** is someone else’s data centers, APIs, and IAM, billed as metered resources. A **datacenter operator** (colo, hosted VMware) sells buildings and sometimes a smaller API. Names differ; the **jobs** do not: identity, network, compute, disks, object storage, and “which SKU runs my containers.”

This folder is **provider solutions**. Metal and the hall: [Datacenter/](../Datacenter/README.md). Clusters you install: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes).

### Failure domains

| Idea | Meaning |
|------|---------|
| **Region** | Independent geography (latency, data residency, blast radius) |
| **Availability zone (AZ)** | Isolated building/power/network *inside* a region |
| **Multi-region** | Separate control planes and data copies — not “tick two AZs” |
| **Rack / feed / room** | The DC equivalent — [Datacenter/](../Datacenter/README.md) |

Put two nodes in two AZs (or two feeds) before you invent “global.”

### Shared responsibility

The provider secures **the cloud** (buildings, hypervisor, managed control planes they run). You secure **in the cloud**: identities, network paths, data, what you install on VMs, and cluster config you own. Managed Kubernetes moves *control-plane* ops to the provider; it does not move *your* RBAC, images, or app secrets.

### Term map (keep this)

| Job | AWS | GCP | Azure |
|-----|-----|-----|-------|
| Org container | Organization / OU / account | Org / folder / project | Entra tenant / management group / subscription |
| Deploy grouping | Tags + accounts | Project | Resource group |
| VM | EC2 | Compute Engine | Virtual Machines |
| Autoscaled VM fleet | Auto Scaling group | Managed instance group | Virtual Machine Scale Set |
| VPC network | VPC | VPC | Virtual Network (VNet) |
| Object storage | S3 | Cloud Storage (GCS) | Blob Storage |
| Container registry | ECR | Artifact Registry | ACR |
| Managed K8s | EKS | GKE | AKS |
| Serverless functions | Lambda | Cloud Functions | Azure Functions |
| Serverless containers | Fargate / App Runner | Cloud Run | Container Apps |
| Secrets | Secrets Manager / SSM | Secret Manager | Key Vault |
| DNS | Route 53 | Cloud DNS | Azure DNS |
| CDN / edge HTTP | CloudFront | Cloud CDN | Front Door / CDN |
| L7 load balancer | ALB | Cloud Load Balancing (HTTP) | Application Gateway |
| Identity for machines | IAM role | Service account | Managed identity |
| CI federation | IAM OIDC provider | Workload Identity Federation | Federated credentials |

Block disks, managed SQL, queues, and warehouses have names too — **data depth** lives in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). Here you only need to *recognize* the family.

### Where to go (this handbook + Containerization)

| Kind | Where |
|------|--------|
| Which *kind* of cloud | [2](./2_Spectrum_And_When_Which.md) |
| Kubernetes as a cloud SKU | [3](./3_Managed_Kubernetes.md) |
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

Humans: SSO into the cloud console (IdP). Machines: **roles / service accounts / managed identities**, not long-lived keys in git. CI should **federate** (OIDC), not store JSON keys ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

Pods that call cloud APIs should use **workload identity** (IRSA / GKE WI / AKS WI), not a node-wide key.

### Network sketch

```text
Internet → edge (CDN / global LB) optional
        → load balancer
        → public subnet (LB / NAT / bastion) 
        → private subnet (VMs / nodes) — no public IPs by default
        → data plane (managed DB, object store endpoints)
```

Firewalls are **allow-lists**. NAT is how private VMs reach the internet without being reachable from it. DNS and TLS belong with the LB ([Servers/](../Servers/README.md), [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)).

### Quotas and billing

Every API has **quotas**. Autoscaling into a quota wall looks like an outage. Tags/labels are how FinOps attributes spend ([Methodologies/8](../Methodologies/8_FinOps_Literacy.md)).

### What this folder is not

Not a list of every product SKU. Not kubeadm. Not hypervisor internals. Not Terraform HCL (IAC).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First production app | One region, two AZs, private compute, LB, object storage, federated CI |
| Lift classic hosts | VMs + MIG/ASG/VMSS ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| Containers on a cloud | [3](./3_Managed_Kubernetes.md) vs Cloud Run/Fargate/Container Apps |
| Colo / metal | [Datacenter/](../Datacenter/README.md) |
| Multi-cloud *words* | Same jobs, different names — do not dual-run two clouds without a reason |

**Staff checklist**

- Region and AZ story written before the first cluster  
- No long-lived cloud keys in CI  
- Private-by-default compute; public only for LBs/ingress  
- Resource labels/tags present for cost  
- Kubernetes *SKU* named if you use the Kubernetes API — not “we use K8s” as a blank  

**Good:** two AZs, private nodes, OIDC from CI. **Bad:** one public VM with an access key in GitHub Secrets.

---

## References

- [AWS global infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)  
- [Google Cloud geography and regions](https://cloud.google.com/docs/geography-and-regions)  
- [Azure regions](https://learn.microsoft.com/azure/reliability/regions-overview)  
- [AWS shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/)  
