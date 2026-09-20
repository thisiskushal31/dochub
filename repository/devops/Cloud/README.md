# Cloud literacy

How software lands on a **cloud you can name**: public IaaS/PaaS, managed Kubernetes SKUs, hosted private cloud, colo-as-a-service, and **tenant how-to** (IAM *how you grant*, VPC, LB, storage, serverless, managed data, AI platforms, multi-tier topologies, FinOps). *Not cert dumps or console click-tours. Not kubeadm. Not plant encyclopedia.*

**Design rule:** the **jobs** are the same everywhere; **names, defaults, and knobs** differ by provider. Learn the job once (Floor 1), then apply it on a vendor (Floor 2). Literacy = how to grant access + **full product catalogs** ([Catalogs/](./Catalogs/README.md): what it is for · when · why not per primary SKU/family). Those catalog pages are the **final choice destination**; official docs are for **deeper API/quotas after you already chose**. Catalogs change; we keep **families and current primary SKUs**, not abandoned aliases.

Clusters you install yourself: [Containerization Kubernetes](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Kubernetes). OpenShift platform: [OpenShift](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/OpenShift). Rancher: [Rancher](https://github.com/thisiskushal31/Containerization-Deep-Dive/tree/main/Orchestration/Rancher). Metal and the hall: [Datacenter/](../Datacenter/README.md) (colo order/on-ramp: [Provider-Use](../Datacenter/Provider-Use/README.md)). Declare resources with [IAC/](../IAC/README.md). Delivery: [CiCd/](../CiCd/README.md).

Someone new should leave able to:

- Grant IAM the right way on GCP/AWS/Azure (and map the same job on other clouds)  
- Choose **VM vs function vs serverless container vs managed K8s** for a workload  
- Choose **managed DB vs DB-on-VM**, and **Bedrock/Vertex/Azure OpenAI vs SageMaker/Vertex/Azure ML vs GPU K8s**  
- Wire a multi-tier topology (edge → LB → app → data) without public databases  
- Federate CI ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) where the cloud supports it  
- Choose **native observability vs Managed Prometheus vs SaaS APM** without dropping audit trails  
- Land a **hybrid** path without mixing landlord vs tenant products  

### Chapter structure

Each numbered chapter: **Concepts → Advanced → Applications/use cases → References** (official docs only).

Start here if unsure: [0 — How to read](./0_How_To_Read.md).

### Staircase (read by floor, not by filename alone)

```text
Floor −1  How to read          →  0
Floor 0   Foundations          →  1–3   (shared concepts, spectrum, managed K8s)
Floor 1   Tenant jobs          →  15–34 (IAM how-to, VPC, LB, serverless, data, AI, N-tier…)
Floor 2   Provider solutions   →  4–14  (apply Floor 1 + choose-your-deploy tables)
Floor 3   Kin / hybrid         →  21–22 (VPS kin; hybrid colo+cloud)
```

**Suggested path:** **0 → 1 → 2 → 3**, then **15 (IAM how-to)**, then **28 + 31–34** (deploy / serverless / data / AI / topologies), then remaining Floor 1, then **4–14** by estate, then **21–22**.

| Phase | Chapters | Outcome |
|-------|----------|---------|
| How to read | [0](./0_How_To_Read.md) | Same job / different name; what literacy is *not* |
| Shared | [1](./1_Shared_Cloud_Concepts.md) | Jobs, responsibility, name map |
| Choose a *kind* of cloud | [2](./2_Spectrum_And_When_Which.md) | IaaS / PaaS / managed K8s / hosted private / colo |
| Kubernetes as a **cloud product** | [3](./3_Managed_Kubernetes.md) | SKU map; they run the API |
| **Tenant jobs (depth)** | [15](./15_Org_IAM_And_Identity_Federation.md)–[34](./34_Multi_Tier_And_Reference_Topologies.md) | Permissions through AI and N-tier |
| **Providers (apply)** | [4](./4_GCP_Literacy.md)–[14](./14_CtrlS_And_Yotta.md) | IAM quick + choose-your-deploy; full SKU choose → [Catalogs/](./Catalogs/README.md) |
| Kin / hybrid | [21](./21_Akamai_Linode_And_VPS_Kin.md)–[22](./22_Hybrid_Colo_And_Cloud.md) | VPS ≠ colo; hybrid interfaces |

## Floor −1 — How to read

| # | File | Focus |
|---|------|--------|
| 0 | [How to read](./0_How_To_Read.md) | Same job / different wiring; quality bar; first-week path |

## Floor 0 — Foundations

| # | File | Focus |
|---|------|--------|
| 1 | [Shared cloud concepts](./1_Shared_Cloud_Concepts.md) | Regions, shared responsibility, wide term map |
| 2 | [Spectrum and when which](./2_Spectrum_And_When_Which.md) | Which *kind* of cloud |
| 3 | [Managed Kubernetes](./3_Managed_Kubernetes.md) | GKE/EKS/AKS/ACK/… and ROSA/ARO/ROKS as SKUs |

## Floor 1 — Tenant jobs (concept once, name maps everywhere)

| # | File | Durable job |
|---|------|-------------|
| 15 | [Org, IAM, and identity federation](./15_Org_IAM_And_Identity_Federation.md) | Who can do what; SSO; OIDC; workload identity |
| 16 | [VPC and network constructs](./16_VPC_And_Network_Constructs.md) | Subnets, NAT, filters, DNS-in-VPC |
| 17 | [Private connectivity and on-ramps](./17_Private_Connectivity_And_On_Ramps.md) | DX/ER/Interconnect + colo path |
| 18 | [Compute instances and autoscaling](./18_Compute_Instances_And_Autoscaling.md) | VMs, ASG/MIG/VMSS, GPU quotas |
| 19 | [Portals, CLI, and API patterns](./19_Portals_CLI_And_API_Patterns.md) | Objects over UI; IaC boundary |
| 20 | [FinOps and cost controls](./20_FinOps_And_Cost_Controls.md) | Tags, budgets, waste, quotas |
| 23 | [Load balancing, ingress, and TLS](./23_Load_Balancing_Ingress_And_TLS.md) | L4/L7; health checks; certs; K8s entry |
| 24 | [Object, block, and file storage](./24_Object_Block_And_File_Storage.md) | Object vs block vs file; encryption; doors to DBs |
| 25 | [DNS, CDN, and edge HTTP](./25_DNS_CDN_And_Edge_HTTP.md) | Authoritative DNS; CDN; global entry |
| 26 | [Secrets, KMS, and encryption](./26_Secrets_KMS_And_Encryption.md) | Secrets stores; CMK; rotation |
| 27 | [Container registries and artifacts](./27_Container_Registries_And_Artifacts.md) | Registries; digest promote; scan doors |
| 28 | [Deployment shapes on cloud](./28_Deployment_Shapes_On_Cloud.md) | VM → serverless → K8s → data → AI when-which |
| 29 | [Landing zones and org guardrails](./29_Landing_Zones_And_Org_Guardrails.md) | Multi-account baselines; platform vs app |
| 30 | [Managed observability on cloud](./30_Cloud_Observability_And_Audit_Doors.md) | Native suite vs Managed Prom vs SaaS; trails + alarms |
| 31 | [Serverless functions and containers](./31_Serverless_Functions_And_Containers.md) | FaaS vs Cloud Run/Fargate/Container Apps |
| 32 | [Managed data and databases on cloud](./32_Managed_Data_And_Databases_On_Cloud.md) | Managed DB vs DB-on-VM; warehouse doors |
| 33 | [AI and ML platforms on cloud](./33_AI_And_ML_Platforms_On_Cloud.md) | Bedrock/Vertex/Azure OpenAI vs train/serve vs GPU |
| 34 | [Multi-tier and reference topologies](./34_Multi_Tier_And_Reference_Topologies.md) | Edge→LB→app→data (+ AI/hybrid patterns) |

*(Chapters 21–22 live on Floor 3 but keep their numbers.)*

## Floor 2 — Provider solutions (apply Floor 1)

| # | File | Focus | Full catalog (what / when / why not) |
|---|------|--------|-------------------------------------|
| 4 | [GCP](./4_GCP_Literacy.md) | IAM how-to + choose-your-deploy | [GCP products](./Catalogs/GCP_Products.md) |
| 5 | [AWS](./5_AWS_Literacy.md) | IAM how-to + choose-your-deploy | [AWS products](./Catalogs/AWS_Products.md) |
| 6 | [Azure](./6_Azure_Literacy.md) | IAM how-to + choose-your-deploy | [Azure products](./Catalogs/Azure_Products.md) |
| 7 | [Oracle Cloud](./7_Oracle_Cloud.md) | OCI, compartments, OKE | [OCI products](./Catalogs/OCI_Products.md) |
| 8 | [IBM Cloud](./8_IBM_Cloud.md) | VPC, IKS, ROKS | [IBM products](./Catalogs/IBM_Products.md) |
| 9 | [Alibaba Cloud](./9_Alibaba_Cloud.md) | RAM, ECS, ACK, China split | [Alibaba products](./Catalogs/Alibaba_Products.md) |
| 10 | [Tencent Cloud](./10_Tencent_Cloud.md) | CAM, CVM, TKE | [Tencent products](./Catalogs/Tencent_Products.md) |
| 11 | [Huawei Cloud](./11_Huawei_Cloud.md) | CCE, OBS, Cloud Stack | [Huawei products](./Catalogs/Huawei_Products.md) |
| 12 | [OVHcloud](./12_OVHcloud.md) | Public Cloud, Bare Metal, MKS | [OVH products](./Catalogs/OVH_Products.md) |
| 13 | [Deutsche Telekom](./13_Deutsche_Telekom.md) | Open Telekom Cloud, T-Systems | [OTC products](./Catalogs/OTC_Products.md) |
| 14 | [CtrlS and Yotta](./14_CtrlS_And_Yotta.md) | India colo / hosted private / regional cloud | [India products](./Catalogs/India_CtrlS_Yotta_Products.md) |

## Floor 3 — Kin / hybrid

| # | File | Focus |
|---|------|--------|
| 21 | [Akamai Linode and VPS kin](./21_Akamai_Linode_And_VPS_Kin.md) | Tenant VPS ≠ colo — catalog: [Linode & VPS kin](./Catalogs/Akamai_Linode_Products.md) |
| 22 | [Hybrid colo and cloud](./22_Hybrid_Colo_And_Cloud.md) | Interfaces across Datacenter + Cloud |

## Product catalogs (final choose surface)

[Catalogs/](./Catalogs/README.md) — every primary SKU/family with **what for · when · why not**. Click vendor docs from those pages only when you need API depth.

## Cross-links

- Datacenter / vSphere / metal: [Datacenter/](../Datacenter/README.md)  
- Colo on-ramp / XC / hands: [Datacenter/Provider-Use/](../Datacenter/Provider-Use/README.md)  
- IaC: [IAC/](../IAC/README.md)  
- OIDC for CI: [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)  
- WAF products: [Security/WAF](../Security/WAF/README.md)  
- FinOps program: [Methodologies/8](../Methodologies/8_FinOps_Literacy.md)  
- VM deploys: [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) · delivery spectrum: [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)  
- Cluster internals: [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive)  
- Monitoring & observability depth: [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md)  

## Further reading

- [Google Cloud docs](https://cloud.google.com/docs)  
- [AWS docs](https://docs.aws.amazon.com/)  
- [Azure docs](https://learn.microsoft.com/azure/)  
- [OCI docs](https://docs.oracle.com/en-us/iaas/) · [IBM Cloud docs](https://cloud.ibm.com/docs)  
- [Alibaba Cloud](https://www.alibabacloud.com/help) · [Tencent Cloud](https://www.tencentcloud.com/document/product) · [Huawei Cloud](https://www.huaweicloud.com/intl/en-us/product/cce.html)  
- [OVHcloud](https://help.ovhcloud.com/) · [Open Telekom Cloud](https://docs.otc.t-systems.com/)  
- [Akamai Linode docs](https://www.linode.com/docs/)  
