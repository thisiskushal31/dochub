# AKS: Identity and security

[← AKS README](./README.md)

**Microsoft Entra ID** (Azure AD) for cluster access; **workload identity** (pod-managed identity) for Pod-to-Azure auth; **Azure Policy**; **Defender for Kubernetes**. Based on [AKS access and identity](https://learn.microsoft.com/en-us/azure/aks/concepts-identity) and [AKS security](https://learn.microsoft.com/en-us/azure/aks/concepts-security).

---

## Kubernetes vs AKS

Kubernetes has RBAC and ServiceAccounts. AKS integrates **Microsoft Entra ID** for user/group auth and **workload identity** so Pods call Azure APIs without secrets. **Azure Policy** and **Defender for Kubernetes** are Azure-specific.

---

## Cluster access (AKS-specific)

- **Microsoft Entra ID:** Integrate AKS with Entra ID (Azure AD). Users and groups authenticate to the cluster; combine with **Kubernetes RBAC** (Role/ClusterRole + Binding) for authorization. **Azure RBAC** can also be used for AKS (Azure resource-level and cluster-level roles).
- **Managed identity for cluster:** AKS cluster uses a **managed identity** (or service principal) for Azure operations (e.g. load balancers, disks). Prefer managed identity; no secret rotation.

---

## Workload identity (AKS-specific)

- **What it is:** Pods use **Azure AD workload identity** (or pod-managed identity) to obtain tokens and call Azure APIs (Storage, Key Vault, etc.) without storing secrets. Federated identity or managed identity bound to Pod/ServiceAccount.
- **Setup:** Enable workload identity on the cluster; create federated identity credential (or use pod-managed identity); grant the identity Azure RBAC. Pods use the Kubernetes ServiceAccount; token exchange is handled by the identity provider.
- See [Use Azure AD workload identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview) (or pod-managed identity docs).

---

## Azure Policy and Defender

- **Azure Policy:** Enforce org policies (e.g. allowed registries, no privileged Pods, required labels). Use add-on or Azure Arc for Kubernetes policy. Not part of upstream Kubernetes.
- **Microsoft Defender for Kubernetes:** Threat detection and security posture for AKS. Enable in Defender for Cloud. Integrates with cluster and container runtime.

---

## Other security

- **Key Vault:** Store secrets; use **Secrets Store CSI Driver** or workload identity to access from Pods. Avoid storing secrets in Kubernetes Secrets when possible.
- **Private clusters:** Restrict API server to private endpoint or authorized IPs. **Network isolation** for no public node IPs.
- **Best practices:** See [AKS security](https://learn.microsoft.com/en-us/azure/aks/concepts-security) and [Best practices](https://learn.microsoft.com/en-us/azure/aks/operator-best-practices-cluster-security).

---

## References

- [AKS access and identity](https://learn.microsoft.com/en-us/azure/aks/concepts-identity)
- [AKS security](https://learn.microsoft.com/en-us/azure/aks/concepts-security)
- [Workload identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)
- [Azure Policy for AKS](https://learn.microsoft.com/en-us/azure/aks/policy-reference)
- [Defender for Kubernetes](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-kubernetes-introduction)

[← AKS README](./README.md)
