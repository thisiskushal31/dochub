# 11 — API tokens, keys, and service accounts

[← Previous](./10_Edge_Proxy_And_Streaming.md) · [README](./README.md) · [Next: SSO →](./12_SSO_RBAC_SCIM_And_Provisioning.md)

## 1. Concepts

Unleash authenticates machines differently from humans ([12](./12_SSO_RBAC_SCIM_And_Provisioning.md)). Official token types:

| Credential | Typical caller | Secret? |
|------------|----------------|---------|
| **Backend token** | Backend SDKs / Edge → **Client API** | Yes — never in browsers |
| **Frontend token** | Frontend SDKs / Edge → **Frontend API** | Not a secret; scoped still |
| **Personal access token (PAT)** | Human debugging / temporary automation | Yes — mirrors the user’s permissions |
| **Service account token** | Terraform, integrations, durable bots | Yes — Enterprise identity for machines |

**Admin tokens are deprecated.** OSS: use PATs. Enterprise: use service accounts. Full endpoint list: [23](./23_Admin_Client_Frontend_And_Edge_APIs.md).

Backend and frontend tokens are scoped to **one environment** and one or more projects (`default`, `[]` for a set, `*` for all current and future). Least privilege: a checkout service gets a backend token for `production` in its project — not a PAT and not `*`.

## 2. Advanced concepts

### Token format

`{{projects}}:{{environment}}.{{hash}}` (64-hex hash). PATs start with `user:` and have no project/environment in the string. Pre-v4.3 tokens were hash-only.

### Edge needs two tokens for browsers

Frontend SDK → Edge uses a **frontend** token. Edge → Unleash server uses a **backend** token with **at least the same project/environment scope**. Mismatch is a common “flags missing in SPA” cause.

### Rotation and expiry

Backend/frontend tokens default to no expiry in the UI — rotate on a schedule. PATs and service-account tokens should expire (7/30/60 days or custom). Unleash can email the creator before PAT/service-account expiry (beta as of v8.1). Scope cannot be edited after create — mint a new token, cut over, delete the old one.

PATs follow the creator’s **current** RBAC; permission changes apply immediately. Do **not** put PATs in SDKs.

### Proxy client keys (legacy)

Unleash Proxy (maintenance) used arbitrary `clientKeys` you defined at Proxy start — not Unleash API tokens. Prefer Edge ([10](./10_Edge_Proxy_And_Streaming.md)).

### API access vs UI roles

Root Admin (or custom root with token permissions) can mint instance tokens; project Members can mint project tokens. Viewers cannot. Any role can create their own PAT.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| App runtime | Backend or frontend token in secrets / SPA as appropriate |
| Terraform / CI | Service account (Enterprise) or PAT (lab/OSS only) ([15](./15_Integrations_Terraform_Webhooks_And_Chatops.md)) |
| Debug Admin API | Short-lived PAT, then delete |

**Staff checklist**

- Token **type** matches API (backend ≠ frontend)  
- Prod tokens not shared with local dev  
- Rotation owner named; expired PATs gone  
- No PAT or deprecated admin token in mobile/SPA builds  
- Edge backend token scope ≥ frontend token scope  

**Good:** per-app backend tokens. **Bad:** one `*` backend token in every compose file.

## References

- [API tokens and client keys](https://docs.getunleash.io/concepts/api-tokens-and-client-keys)  
- [Service accounts](https://docs.getunleash.io/concepts/service-accounts)  
- [API overview](https://docs.getunleash.io/apis/overview)  
