# Vault (HashiCorp)

[← Back to Security](../README.md) · [OIDC / CI](../5_OIDC_CI_And_Least_Privilege.md) · [CiCd config](../../CiCd/13_Config_Secrets_And_Env_Parity.md)

## 1. Concepts

**Vault** stores and **dynamically issues** secrets (tokens, DB creds, cloud creds) with audit, TTLs, and fine-grained policy—so apps and CI do not keep long-lived passwords in git or plain CI variables.

**Plain language:** A guarded vault with short-term visitor badges instead of a shared master key under the doormat.

**Disconfirm:** Putting production passwords in Vault **once** without rotation/TTL still fails the spirit. Vault is **not** a substitute for OIDC to cloud from CI ([5](../5_OIDC_CI_And_Least_Privilege.md)) when federation fits better.

**Confirm:** What is a dynamic secret vs a static KV secret?

## 2. Advanced concepts

| Surface | Job |
|---------|-----|
| KV secrets engine | Static secrets with versioning |
| Dynamic engines | DB, cloud IAM leases that expire |
| Auth methods | K8s SA, AppRole, OIDC/JWT, cloud IAM |
| Agents / injector / CSI | Deliver secrets to pods without baking env in images |
| Audit devices | Who read what, when |

High availability, unseal/auto-unseal, and backup of storage backend are **ops** responsibilities—treat Vault as tier-0.

## 3. Applications

| Goal | Pattern |
|------|---------|
| App runtime | K8s auth → short-lived DB creds |
| CI | Prefer OIDC to cloud; Vault for shared non-cloud secrets if needed |
| Break-glass | Documented emergency path; audited |

**Staff checklist:** TLS everywhere; least-privilege policies; rotate root; test restore; never log secret values.

## References

- [Vault documentation](https://developer.hashicorp.com/vault/docs)  
- [CiCd/13](../../CiCd/13_Config_Secrets_And_Env_Parity.md)  
- [Security/5 OIDC](../5_OIDC_CI_And_Least_Privilege.md)  
