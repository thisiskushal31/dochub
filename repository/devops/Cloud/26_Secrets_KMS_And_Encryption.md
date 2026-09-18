# 26 — Secrets, KMS, and encryption

[← README](./README.md) · [IAM →](./15_Org_IAM_And_Identity_Federation.md) · [Storage →](./24_Object_Block_And_File_Storage.md)

## Mental map

```text
Secret value  →  secrets manager (ACL + audit)
Data at rest  →  encrypted with platform key or CMK (KMS)
CI / app      →  reads via identity (role/SA), not baked files
```

*What to notice: encryption without access control is theater; access without audit is hope.*

## 1. Concepts

| Job | Meaning |
|-----|---------|
| **Secrets store** | API for credentials, tokens, connection strings |
| **KMS / CMK** | Key management; customer-managed keys when policy demands |
| **Envelope encryption** | Data key encrypts data; KMS encrypts the data key |
| **Rotation** | New version; consumers must refresh |

App runtime secrets in clusters also touch Vault / external secrets — [Security/Vault](../Security/Vault/) and Security track. This chapter is **cloud-native tenant products**.

**Disconfirm:** Base64 in Kubernetes Secrets is **not** encryption. “SSE enabled” with a shared platform key does **not** always meet residency/CMK requirements.

**Confirm:** Who can `GetSecret`? Who can use the CMK? How does CI get a short-lived credential?

## 2. Advanced concepts

### Cross-cloud name map

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| Secrets | Secrets Manager / SSM | Secret Manager | Key Vault secrets | OCI Vault; Aliyun KMS/Secrets; similar |
| KMS | KMS | Cloud KMS | Key Vault keys / Managed HSM | Provider KMS |
| Workload access | IAM + resource policy | IAM on secret | RBAC + access policies | Provider IAM |

### Patterns

| Pattern | Use |
|---------|-----|
| App role reads secret at runtime | Prefer over env injection of long-lived values |
| CI OIDC → role → secret | Deploy-time only ([15](./15_Org_IAM_And_Identity_Federation.md), [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) |
| CMK with key admin ≠ key user | Separation of duties |
| Disable plaintext in Terraform state | State encryption + least privilege on state backend |

### Failure modes

| Failure | Impact |
|---------|--------|
| Secret in git / image | Compromise forever until rotated |
| Broad `secretsmanager:*` | Any role exfiltrates |
| CMK deleted / disabled | Data unreadable (intentional or outage) |
| No rotation | Leak window unbounded |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| App DB password | Secret Manager + runtime fetch; rotate with dual-version cutover |
| TLS private keys | Cert manager / LB certs ([23](./23_Load_Balancing_Ingress_And_TLS.md)) — not in git |
| Compliance CMK | Customer key; grant decrypt only to app roles |

**Staff checklist**

- No secrets in git or images  
- Identity-based access to secrets  
- CMK ownership and deletion protection clear  
- Rotation tested  
- Audit logs on secret access ([30](./30_Cloud_Observability_And_Audit_Doors.md))  

**Good:** OIDC + secrets API + CMK where required. **Bad:** `.env` in the repo; admin key in CI.

## References

- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/) · [AWS KMS](https://docs.aws.amazon.com/kms/)  
- [GCP Secret Manager](https://cloud.google.com/secret-manager/docs) · [Cloud KMS](https://cloud.google.com/kms/docs)  
- [Azure Key Vault](https://learn.microsoft.com/azure/key-vault/)  
- [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)  
