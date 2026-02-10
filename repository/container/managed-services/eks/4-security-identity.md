# EKS: Security and identity

[← EKS README](./README.md)

**IRSA** and **Pod Identity** let Pods assume IAM roles without keys. Cluster access uses IAM + RBAC. Based on EKS User Guide security and IAM.

---

## Kubernetes vs EKS

Kubernetes has RBAC and ServiceAccounts. EKS adds **IRSA** and **Pod Identity** for Pod-to-AWS API auth; cluster auth can use IAM (e.g. aws-auth / Access Entries) with RBAC.

---

## IRSA (IAM Roles for Service Accounts)

- Kubernetes ServiceAccount ↔ IAM role via OIDC. Pods get temporary credentials; no keys in cluster. Use for S3, DynamoDB, etc. Preferred over node role for least-privilege per workload.
- **Pod Identity:** Newer method; EKS Pod Identity agent on nodes. Built in for Auto Mode. Use when supported.

---

## Cluster access and RBAC

- Map IAM users/roles to K8s users/groups (e.g. aws-auth ConfigMap or **EKS Access Entries**). Use RBAC (Role/ClusterRole + Binding) for authorization. Avoid broad cluster-admin.

---

## Encryption and GuardDuty

- **etcd** encrypted at rest (AWS or customer KMS). **Secrets** can use envelope encryption (e.g. KMS). **Security groups** for nodes (and optional security group for Pods) restrict traffic. **GuardDuty** for threat detection; enable for EKS.

---

## References

- [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)
- [EKS access and authentication](https://docs.aws.amazon.com/eks/latest/userguide/security-iam.html)
- [EKS security](https://docs.aws.amazon.com/eks/latest/userguide/security.html)

[← EKS README](./README.md)
