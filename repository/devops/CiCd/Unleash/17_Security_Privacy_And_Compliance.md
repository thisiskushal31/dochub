# 17 — Security, privacy, and compliance

[← Previous](./16_AI_Assistants_MCP_And_Assisted_Delivery.md) · [README](./README.md) · [Next: Operate →](./18_Scale_Upgrade_Operate_And_Troubleshoot.md)

## 1. Concepts

Feature flags are a **production control plane**. Security work covers:

| Area | Focus |
|------|-------|
| **Access** | SSO, RBAC, SCIM, tokens ([12](./12_SSO_RBAC_SCIM_And_Provisioning.md), [11](./11_API_Tokens_Keys_And_Service_Accounts.md)) |
| **Privacy** | Context fields, impressions, what leaves the app |
| **Network** | Admin private; Edge for public frontend |
| **Compliance** | SOC2 / ISO / FedRAMP narratives as applicable to *your* hosting choice |
| **Change control** | Change requests, audit/events |

Architecture intent: evaluation happens in your runtime; Unleash distributes definitions. Still: **you** choose what context to send and what payloads to store.

## 2. Advanced concepts

### Flags are not a secret store

Anything in flag config can reach every SDK that syncs it. No API keys, private certs, or credentials in variants.

### Frontend trust boundary

Browser-visible flags are **hints**, not authorization. Enforce entitlements on the backend.

### Compliance literacy

Official docs cover SOC2, ISO 27001, FedRAMP, data privacy for the Unleash product/cloud. Self-host implies **your** controls on Postgres, backups, IAM, and logging. Map Unleash events into your SIEM if regulated.

### CORS and IP allow lists

Frontend API CORS defaults to `*` — restrict origins per environment so random sites cannot query evaluated flags. **IP allow lists** (cloud / support-configured) can lock Admin and Hosted Edge to VPN/office ranges. Edge should remain the only public flag endpoint; Admin API stays private.

### Maintenance mode / banners

Operational controls exist to signal degraded admin or freeze changes — know them before incident week.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Reduce leak risk | No secrets in flags; rotate tokens |
| Regulated prod | SSO+CR+audit export |
| Privacy review | Minimize context PII |

**Staff checklist**

- Admin API not public  
- Secret scan rejects flag payloads with key material  
- Audit retention meets policy  
- Frontend flags never sole authz  

**Good:** kill switch for risky processing. **Bad:** “security through obscurity” flag name hiding an open Admin token.

## References

- [Data and privacy](https://docs.getunleash.io/privacy-and-compliance/data-privacy)  
- [Compliance overview](https://docs.getunleash.io/privacy-and-compliance/compliance-overview)  
- [Security and compliance](https://docs.getunleash.io/guides/security-and-compliance)  
