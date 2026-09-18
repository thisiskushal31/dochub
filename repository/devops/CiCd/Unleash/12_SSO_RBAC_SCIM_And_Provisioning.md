# 12 — SSO, RBAC, SCIM, and provisioning

[← Previous](./11_API_Tokens_Keys_And_Service_Accounts.md) · [README](./README.md) · [Next: Change requests →](./13_Change_Requests_Release_Management_And_Governance.md)

## 1. Concepts

Human access to Unleash is separate from **SDK tokens** ([11](./11_API_Tokens_Keys_And_Service_Accounts.md)). Identity work has three layers:

| Layer | Job |
|-------|-----|
| **SSO** | Who can log in (SAML 2.0, OpenID Connect; username/password remains for labs/break-glass) |
| **RBAC** | What they may do once inside (root vs project scope) |
| **SCIM / provisioning** | Create, update, and soft-delete users and groups from the IdP |

SSO is configured under **Admin settings → Single sign-on**. Common IdP paths: OIDC (e.g. Okta), SAML with Okta/Keycloak/Entra ID. Group sync maps IdP groups into Unleash groups so membership is not hand-edited forever.

### RBAC mental model

Unleash applies roles at two levels:

1. **Root** — instance-wide resources (users, integrations, shared strategies, …).  
2. **Project** — flags, change requests, project-scoped tokens, collaboration mode.

Predefined **root** roles (all versions): **Admin**, **Editor**, **Viewer**. Enterprise adds **project** Owner/Member, **custom root/project roles**, and **user groups**. Custom roles are how you grant change-request approve/apply/skip without making everyone Admin ([13](./13_Change_Requests_Release_Management_And_Governance.md)).

## 2. Advanced concepts

### SCIM provisioning

SCIM syncs users and groups from the IdP into Unleash (Enterprise). Password sync and automatic role mapping are out of scope — you still assign roles/groups in Unleash (or via group SSO sync). Deprovisioning uses **soft-delete** so audit history remains.

**Break-glass:** before enabling SCIM, keep a non-SCIM recovery Admin (or an IdP group that maps to Admin). Lockout after SCIM misconfig is a known operational failure mode — document recovery in the runbook ([18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md)).

### Group SSO sync

IdP group membership can sync into Unleash groups so project access rides the same HR/IT groups as other apps. Prefer that over per-user project adds for regulated estates.

### Collaboration and invite links

Project **collaboration mode** (private/protected) and **public signup / invite links** affect who can join a project. Treat invite links like secrets: scope, expire, and audit.

### Login history and service accounts

**Login history** supports investigation. **Access requests** (in-app notifications) let users ask for project access instead of sharing Admin. Automations should use **service accounts** + tokens ([11](./11_API_Tokens_Keys_And_Service_Accounts.md)), not shared human Admin passwords.

### OSS vs Enterprise identity

Core flag evaluation works in OSS with basic root roles. SSO, SCIM, project/custom roles, and advanced audit retention are Enterprise surfaces — plan identity with the offering you actually run ([22](./22_Config_Catalog_Migrate_And_Spectrum.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Corporate login | OIDC or SAML → root Viewer/Editor by default; project roles for flag work |
| Regulated prod | Custom project roles + change requests; no shared Admin |
| Joiners/leavers | SCIM + group sync; soft-delete preserves audit |
| Break-glass | Documented recovery Admin outside SCIM |

**Staff checklist**

- SSO IdP owned; MFA enforced at IdP  
- Root Admin limited; custom roles for CR approve/apply/skip  
- SCIM break-glass Admin documented and tested  
- Groups, not individuals, for long-lived project access  
- Invite links and public signup reviewed  

**Good:** IdP groups → Unleash groups → project roles. **Bad:** everyone Root Admin “so flags move faster.”

## References

- [Single sign-on](https://docs.getunleash.io/concepts/sso)  
- [RBAC](https://docs.getunleash.io/concepts/rbac)  
- [SCIM / provisioning](https://docs.getunleash.io/concepts/scim)  
- [SSO how-tos](https://docs.getunleash.io/single-sign-on/how-to-add-sso-open-id-connect)  
