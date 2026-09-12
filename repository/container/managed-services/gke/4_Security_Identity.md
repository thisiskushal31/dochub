# GKE: Security and identity

[← GKE README](./README.md)

Technical detail on **GKE security and identity**: Workload Identity Federation, Policy Controller, Binary Authorization, and hardening. Kubernetes provides RBAC and ServiceAccounts; **GKE** adds pod-to–Google-Cloud authentication and policy. Based on [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) and [GKE security overview](https://cloud.google.com/kubernetes-engine/docs/concepts/security-overview).

---

## Kubernetes vs GKE

- **Kubernetes:** RBAC, ServiceAccounts, NetworkPolicy, Pod Security. No built-in cloud IAM integration.
- **GKE:** **Workload Identity Federation for GKE** lets Pods authenticate to Google Cloud APIs without node or service-account keys. **Policy Controller** (Gatekeeper/Constraint templates) and **Binary Authorization** are GKE/Google extensions.

---

## Workload Identity Federation for GKE (GKE-specific)

- **What it is:** Pods get federated identity (OIDC) that maps to Google Cloud IAM. No need to mount service account keys; requests to the metadata server are routed to the **GKE metadata server**, which issues tokens.
- **Autopilot:** Always enabled. **Standard:** Enable at cluster level (`--workload-pool=PROJECT_ID.svc.id.goog`), then per node pool (`--workload-metadata=GKE_METADATA`).
- **Two patterns:**
  1. **IAM principal identifiers:** Grant IAM roles to `principal://iam.googleapis.com/.../workloadIdentityPools/PROJECT_ID.svc.id.goog/subject/ns/NAMESPACE/sa/KSA_NAME`. No Kubernetes SA ↔ IAM SA link.
  2. **Link Kubernetes SA to IAM SA:** Annotate Kubernetes ServiceAccount with `iam.gke.io/gcp-service-account=IAM_SA@project.iam.gserviceaccount.com` and grant that IAM SA `roles/iam.workloadIdentityUser` to the K8s SA. Pod uses the K8s SA; GKE exchanges token for IAM SA token.
- **Limitations:** See [Workload Identity Federation supported services](https://cloud.google.com/iam/docs/federated-identity-supported-services). For unsupported APIs, use the IAM SA link method.
- **Disable:** Only on Standard; set node pools to `--workload-metadata=GCE_METADATA` and cluster `--disable-workload-identity`.

---

## Policy Controller (GKE-specific)

- **What it is:** Policy-as-code using Constraint templates and Constraints (Open Policy Agent / Gatekeeper style). Enforce org policies (e.g. required labels, allowed image registries, no privileged Pods).
- **Install:** Via GKE add-on or Anthos Config Management. Not part of upstream Kubernetes.
- Use for governance and compliance across clusters.

---

## Binary Authorization (GKE-specific)

- **What it is:** Only allow container images that pass policy (e.g. signed by trusted attestors, from allowed registries). Enforced at deploy time.
- **GKE:** Configure attestors and policy in Google Cloud; GKE blocks deployment of images that fail policy. Not a standard Kubernetes feature.

---

## Other GKE security

- **Autopilot hardening:** Autopilot applies many [security measures](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-security) by default (e.g. node hardening, metadata protection).
- **Shielded nodes:** Integrity monitoring; optional in Standard.
- **Protecting cluster metadata:** Restrict node metadata access; use Workload Identity instead of node SA for cloud API access.
- **Private clusters / authorized networks:** Restrict control plane access; use network isolation for no public node IPs.

---

## References

- [Workload Identity Federation for GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)
- [Authenticate to Google Cloud from GKE workloads](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
- [GKE security overview](https://cloud.google.com/kubernetes-engine/docs/concepts/security-overview)
- [Policy Controller](https://cloud.google.com/kubernetes-engine/docs/how-to/policy-controller)
- [Binary Authorization](https://cloud.google.com/binary-authorization/docs)
- [Harden your cluster security](https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster)

[← GKE README](./README.md)
