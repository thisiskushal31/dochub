# 11 — API tokens, keys, and service accounts

[← Previous](./10_Edge_Proxy_And_Streaming.md) · [README](./README.md) · [Next: SSO →](./12_SSO_RBAC_SCIM_And_Provisioning.md)

---

## 1. Concepts

Unleash authenticates machines differently from humans ([12](./12_SSO_RBAC_SCIM_And_Provisioning.md)).

| Credential | Typical caller |
|------------|----------------|
| **Client token** | Backend SDKs / Edge → Client API |
| **Frontend token** | Frontend SDKs / Edge → Frontend API |
| **Admin API token** | Automation, Terraform, Admin API scripts |
| **Service account** | Non-human admin identity with roles (Enterprise patterns) |

Tokens are usually bound to **projects/environments** (or broader admin scope). Least privilege: a checkout service gets a client token for `prod` in its project — not an admin token.

---

## 2. Advanced concepts

### Rotation

Treat tokens like cloud keys: store in a secret manager, rotate on cadence and on leak, never commit to Git. Frontend tokens are **visible to browsers** by nature — constrain what Frontend API can do; never put Admin tokens in SPAs.

### Edge and tokens

Edge needs credentials to upstream Unleash and serves client/frontend tokens downstream. Misconfigured Edge + overly broad tokens is a common foot-gun.

### API access vs UI roles

Admin API tokens bypass the human SSO path. Guard issuance with RBAC; prefer service accounts with narrow custom roles when available.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| App runtime | Client/Frontend token in secrets |
| GitOps flags | Admin/service account for Terraform ([15](./15_Integrations_Terraform_Webhooks_And_Chatops.md)) |
| Break-glass | Short-lived admin token, audited |

**Staff checklist**

- Token type matches API  
- Prod tokens not shared with local dev  
- Rotation owner named  
- No Admin token in mobile/SPA builds  

**Good:** per-app client tokens. **Bad:** one global admin token in every compose file.

---

## References

- [API tokens and client keys](https://docs.getunleash.io/concepts/api-tokens-and-client-keys)  
- [Service accounts](https://docs.getunleash.io/concepts/service-accounts)  
- [API overview](https://docs.getunleash.io/apis/overview)  
