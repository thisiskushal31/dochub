# 4 — Google Cloud Platform (GCP) literacy

[← Previous](./3_Managed_Kubernetes.md) · [README](./README.md) · [Next: AWS →](./5_AWS_Literacy.md)

---

## 1. Concepts

GCP’s unit of isolation for IAM and billing is the **project**, nested under **folders** and an **organization**. Most APIs are enabled per project. Folders exist so a company can apply policy once (prod vs sandbox) without a new org.

### Identity

| Principal | Use |
|-----------|-----|
| User / Google group / Workforce Identity | Humans (prefer org SSO) |
| **Service account** | Workloads and automation |
| **Workload Identity Federation** | CI or other clouds assuming a SA *without* a JSON key |

IAM is **role on a resource** (org/folder/project/bucket). Prefer predefined roles scoped to the project; custom roles when you must. JSON keys for SAs are an incident waiting to happen.

### Compute — when which

| Product | Job |
|---------|-----|
| **Compute Engine** | VMs; **MIGs** for fleets ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **GKE** | Managed Kubernetes control plane ([3](./3_Managed_Kubernetes.md)) |
| **GCE + kubeadm / CAPI** | Self-managed Kubernetes on GCP VMs ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |
| **Cloud Run** | Request-scoped containers; scale to zero |
| **Cloud Functions** | Event/function grain |
| **Batch / GKE Autopilot** | Jobs vs hands-off nodes |

Cloud Run is not “tiny GKE.” No cluster API, different networking and identity. Use it when the unit of deploy is a container image and you do not want nodes.

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

### Network

**VPC** is global in GCP (subnets are regional). Firewall rules are VPC-wide unless you target tags/SAs. **Cloud Load Balancing** covers HTTP(S), TCP/UDP, internal. **Cloud CDN** and **Cloud DNS** sit at the edge. Private Google Access / PSC patterns keep APIs off the public internet — learn the name before copying a public IP onto a node.

GKE and self-managed clusters both still need VPC, secondary ranges (pods/services) or equivalent, and a plan for how Services of type LoadBalancer get addresses (GCP CCM on unmanaged clusters).

### Workload Identity

On **GKE**, bind a Kubernetes ServiceAccount to a GCP SA so Pods get tokens, not node SA keys. On **Cloud Run**, the service’s runtime SA is the identity. From **GitHub Actions / GitLab**, Workload Identity Federation swaps an OIDC token for SA credentials ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

### Organization policy

Org policies constrain “who can make a public bucket” regardless of IAM on one project. Treat them as guardrails, not optional docs.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| API + workers | Cloud Run or GKE; AR for images; Cloud SQL + GCS |
| Classic fleet | GCE MIG + LB |
| CI deploy | WIF → SA; no downloaded keys |
| K8s without GKE | GCE VMs + kubeadm/CAPI ([Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md)) |

**Staff checklist**

- Org → folder → project layout matches prod/non-prod  
- Artifact Registry + IAM on the repo, not “allUsers”  
- WIF for CI; GKE Workload Identity for in-cluster GCP calls  
- VPC/firewall reviewed before the first public IP  

**Good:** project-per-env or folder-per-env with WIF. **Bad:** one project, SA JSON in CI, GKE node SA with `roles/owner`.

---

## References

- [Google Cloud docs](https://cloud.google.com/docs)  
- [Resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)  
- [IAM](https://cloud.google.com/iam/docs)  
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)  
- [GKE](https://cloud.google.com/kubernetes-engine/docs)  
- [Cloud Run](https://cloud.google.com/run/docs)  
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs)  
