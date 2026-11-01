# Identity

[← Security](../README.md)

IdP, CIAM, directories, workload identity, authZ engines, IGA, and access-proxy **lab software**. Identity *program* (assurance, OAuth/OIDC/SAML, Zero Trust, SCIM, PAM concepts) → [Security-Deep-Dive Identity](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Identity) — start at the [tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md).

OAuth **protocol** literacy stubs → [Specs-Standards/OAuth](../../Specs-Standards/OAuth/README.md).  
SIEM for identity logs → [Defensive/Wazuh](../Defensive/Wazuh/README.md).

**Lab / authorized targets only.** Do not federate production user stores into disposable labs.

### One tool, one home

Pick **one** primary IdP for a learning estate (Keycloak *or* authentik is enough). Add Dex when you only need a broker. Add SPIRE/OpenBao for workloads/secrets — they are not human SSO replacements.

## By capability (open source first)

| Capability | Open-source alternatives (this folder) | Commercial / SaaS (evaluate; no install tree here) |
|------------|------------------------------------------|-----------------------------------------------------|
| **Full IdP / workforce IAM** | [Keycloak](./Keycloak/README.md) · [authentik](./authentik/README.md) · [Zitadel](./Zitadel/README.md) · [Casdoor](./Casdoor/README.md) | Okta · Microsoft Entra ID · Ping Identity · Auth0 |
| **Headless / embeddable CIAM** | [Ory](./Ory/README.md) · [Logto](./Logto/README.md) · [SuperTokens](./SuperTokens/README.md) | Clerk · FusionAuth · Amazon Cognito |
| **Forward-auth / identity-aware proxy** | [Authelia](./Authelia/README.md) · [oauth2-proxy](./oauth2-proxy/README.md) · [Pomerium](./Pomerium/README.md) | Commercial ZTNA / SSE suites |
| **OIDC broker** | [Dex](./Dex/README.md) | — |
| **Linux / directory IdM** | [Kanidm](./Kanidm/README.md) · [FreeIPA](./FreeIPA/README.md) | Active Directory · cloud managed AD |
| **Workload identity** | [SPIRE](./SPIRE/README.md) | Cloud workload identity (AWS/GCP/Azure) |
| **Engineer access plane** | [Teleport](./Teleport/README.md) (Community) | Teleport Enterprise · StrongDM · CyberArk (PAM-adjacent) |
| **Secrets / dynamic creds** | [OpenBao](./OpenBao/README.md) | HashiCorp Vault · cloud secret managers |
| **AuthZ engines** | [OPA](./OPA/README.md) · [Casbin](./Casbin/README.md) | Cedar-based services · commercial authZ |
| **IGA** | [midPoint](./midPoint/README.md) | SailPoint · Saviynt · Okta Identity Governance |
| **Human PAM** | Partial via Teleport + OpenBao | CyberArk · Delinea · BeyondTrust |
| **ITDR** | Compose IdP logs → [Wazuh](../Defensive/Wazuh/README.md) | Microsoft Defender for Identity / Entra ID Protection · CrowdStrike Falcon Identity · Okta ThreatInsight |
| **MFA / push vendors** | WebAuthn in IdPs above | Duo · vendor authenticators tied to Entra/Okta |


## All tool folders

| Folder | Job |
|--------|-----|
| [Keycloak](./Keycloak/README.md) | Full IdP / IAM (OIDC, SAML, LDAP federation) |
| [authentik](./authentik/README.md) | IdP + flows + outposts (OIDC/SAML/LDAP/RADIUS) |
| [Authelia](./Authelia/README.md) | Forward-auth / SSO portal (+ OIDC provider) |
| [Zitadel](./Zitadel/README.md) | Multi-tenant IdP (OIDC/SAML/SCIM-oriented) |
| [Ory](./Ory/README.md) | Headless identity stack (Kratos + Hydra + …) |
| [Dex](./Dex/README.md) | OIDC broker / federating IdP |
| [Kanidm](./Kanidm/README.md) | Rust identity for Linux/infra (OIDC, LDAP, RADIUS, SSH keys) |
| [Casdoor](./Casdoor/README.md) | All-in-one UI IdP (OIDC/SAML/CAS/SCIM) |
| [Logto](./Logto/README.md) | Developer CIAM / OIDC |
| [SuperTokens](./SuperTokens/README.md) | Embeddable auth (sessions + OIDC-oriented) |
| [SPIRE](./SPIRE/README.md) | Workload identity (SPIFFE) |
| [FreeIPA](./FreeIPA/README.md) | Linux IdM (LDAP + Kerberos + DNS + CA) |
| [midPoint](./midPoint/README.md) | Open-source IGA / identity governance |
| [Teleport](./Teleport/README.md) | Identity-aware access (SSH/K8s/DB/web) |
| [OpenBao](./OpenBao/README.md) | Secrets / dynamic credentials (Vault OSS fork) |
| [oauth2-proxy](./oauth2-proxy/README.md) | Reverse-proxy OIDC gate |
| [Pomerium](./Pomerium/README.md) | Identity-aware proxy / ZTNA-style access |
| [OPA](./OPA/README.md) | Policy decision point (Rego) |
| [Casbin](./Casbin/README.md) | AuthZ library (ACL/RBAC/ABAC) |
