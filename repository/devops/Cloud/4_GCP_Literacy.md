# 4 — Google Cloud Platform (GCP) literacy

[← Previous](./3_Managed_Kubernetes.md) · [README](./README.md) · [Next: AWS →](./5_AWS_Literacy.md) · [Full catalog](./Catalogs/GCP_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md) · [LB](./23_Load_Balancing_Ingress_And_TLS.md)

---

## Mental map — Floor 1 jobs on GCP

| Job | GCP wiring | Depth |
|-----|------------|-------|
| Isolation | Org → folder → **project** | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Identity | Cloud Identity / WIF / service accounts | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | Global VPC; regional subnets; firewall rules | [16](./16_VPC_And_Network_Constructs.md) |
| LB / TLS | Cloud Load Balancing; Certificate Manager | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| DNS / CDN | Cloud DNS; Cloud CDN | [25](./25_DNS_CDN_And_Edge_HTTP.md) |
| Compute | GCE + MIG; Cloud Run; GKE | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Storage | GCS; Persistent Disk; Filestore | [24](./24_Object_Block_And_File_Storage.md) |
| Secrets / KMS | Secret Manager; Cloud KMS | [26](./26_Secrets_KMS_And_Encryption.md) |
| Registry | Artifact Registry | [27](./27_Container_Registries_And_Artifacts.md) |
| Audit | Cloud Audit Logs | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Metrics / logs / traces | Cloud Monitoring + Logging + Trace; Managed Prometheus optional | [30](./30_Cloud_Observability_And_Audit_Doors.md) |

---

## 1. Concepts

GCP’s unit of isolation for IAM and billing is the **project**, nested under **folders** and an **organization**. Most APIs are enabled per project. Folders exist so a company can apply policy once (prod vs sandbox) without a new org.

### Identity and permissions

| Principal | Use |
|-----------|-----|
| User / Google group / Workforce Identity | Humans (prefer org SSO) |
| **Service account** | Workloads and automation |
| **Workload Identity Federation** | CI or other clouds assuming a SA *without* a JSON key |

IAM is **role on a resource** (org/folder/project/bucket). Prefer predefined roles scoped to the project; custom roles when you must. JSON keys for SAs are an incident waiting to happen. Org policies are the outer fence ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Compute — when which

| Product | Job |
|---------|-----|
| **Compute Engine** | VMs; **MIGs** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **GKE** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **GCE + kubeadm / CAPI** | Self-managed Kubernetes on GCP VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Cloud Run** | Request-scoped containers; scale to zero |
| **Cloud Functions** | Event/function grain |
| **Batch / GKE Autopilot** | Jobs vs hands-off nodes |

Cloud Run is not “tiny GKE.” No cluster API, different networking and identity. Use it when the unit of deploy is a container image and you do not want nodes ([28](./28_Deployment_Shapes_On_Cloud.md)).

### Data and glue (names)

| Job | Product |
|-----|---------|
| Object storage | Cloud Storage |
| Images | Artifact Registry (prefer over legacy GCR) |
| Secrets | Secret Manager |
| Logs / metrics | Cloud Logging, Cloud Monitoring |
| SQL / warehouse doors | Cloud SQL, Spanner, BigQuery — [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) |

---

## 2. Advanced concepts

### Network and entry

**VPC** is global in GCP (subnets are regional). Firewall rules are VPC-wide unless you target tags/SAs. **Cloud Load Balancing** covers HTTP(S), TCP/UDP, internal — knobs differ from ALB/NLB but jobs match ([23](./23_Load_Balancing_Ingress_And_TLS.md)). **Cloud CDN** and **Cloud DNS** sit at the edge ([25](./25_DNS_CDN_And_Edge_HTTP.md)). Private Google Access / PSC patterns keep APIs off the public internet.

GKE and self-managed clusters need VPC, secondary ranges (pods/services) or equivalent, and a plan for how `LoadBalancer` Services get addresses (GCP CCM on unmanaged clusters).

### Workload Identity

On **GKE**, bind a Kubernetes ServiceAccount to a GCP SA so Pods get tokens, not node SA keys. On **Cloud Run**, the service’s runtime SA is the identity. From **GitHub Actions / GitLab**, Workload Identity Federation swaps an OIDC token for SA credentials ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

### Organization policy

Org policies constrain “who can make a public bucket” regardless of IAM on one project. Treat them as guardrails ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Quirks vs other majors

| Quirk | Meaning |
|-------|---------|
| Global VPC | Peering/firewall mental model differs from AWS regional VPC |
| Shared VPC | Host project + service projects — landing-zone pattern |
| Cloud Run vs GKE | Different deploy unit; pick deliberately ([28](./28_Deployment_Shapes_On_Cloud.md)) |

---


### How you grant permission on GCP (quick)

1. Prefer **groups** over users.  
2. `IAM & Admin` → grant a **role** on the **project** (or folder/org).  
3. Machines: **service account** + roles; attach to GCE/Run/GKE.  
4. CI: **Workload Identity Federation** (no JSON key).  
5. Pods: **GKE Workload Identity**.  
6. Outer fence: **org policies**.  

Full job: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on GCP

| Need | Product | See |
|------|---------|-----|
| Single/group VMs | Compute Engine (+ MIG) | [18](./18_Compute_Instances_And_Autoscaling.md), [28](./28_Deployment_Shapes_On_Cloud.md) |
| Event function | Cloud Functions | [31](./31_Serverless_Functions_And_Containers.md) |
| Container API scale-to-zero | Cloud Run | [31](./31_Serverless_Functions_And_Containers.md) |
| Kubernetes API | GKE | [3](./3_Managed_Kubernetes.md) |
| Managed Postgres/MySQL-class | Cloud SQL / AlloyDB | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| DB you patch | GCE + Persistent Disk | [32](./32_Managed_Data_And_Databases_On_Cloud.md) |
| GenAI feature (hosted models) | Vertex AI (Gemini / Model Garden APIs) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Custom train/serve | Vertex AI training + endpoints | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Distributed GPU | GKE GPU / GCE GPU | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Platform metrics/logs/traces | Cloud Monitoring + Logging + Trace | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Managed Prometheus | Managed Service for Prometheus | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| Full N-tier system | Wire [34](./34_Multi_Tier_And_Reference_Topologies.md) | |


## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| API + workers | Cloud Run or GKE; AR for images; Cloud SQL + GCS |
| Classic fleet | GCE MIG + HTTPS LB |
| CI deploy | WIF → SA; no downloaded keys |
| K8s without GKE | GCE VMs + kubeadm/CAPI ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |

**Staff checklist**

- Org → folder → project layout matches prod/non-prod  
- Artifact Registry + IAM on the repo, not “allUsers”  
- WIF for CI; GKE Workload Identity for in-cluster GCP calls  
- VPC/firewall reviewed before the first public IP  
- Org policies on for public IPs / public buckets  

**Good:** project-per-env or folder-per-env with WIF. **Bad:** one project, SA JSON in CI, GKE node SA with `roles/owner`.

---

## References

- **Choose surface:** [GCP product catalog (what / when / why not)](./Catalogs/GCP_Products.md)  
- [Google Cloud docs](https://cloud.google.com/docs) *(API depth after you chose)*  
- [Resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)  
- [IAM](https://cloud.google.com/iam/docs) · [WIF](https://cloud.google.com/iam/docs/workload-identity-federation)  
- [GKE](https://cloud.google.com/kubernetes-engine/docs) · [Cloud Run](https://cloud.google.com/run/docs)  
- [Load Balancing](https://cloud.google.com/load-balancing/docs) · [Artifact Registry](https://cloud.google.com/artifact-registry/docs)  
