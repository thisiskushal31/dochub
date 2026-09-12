# Security

Authentication, authorization, federated identity, gatekeeper, valet key, backup/DR, SSL/TLS.

## Topics

| Topic | File |
|--------|------|
| Security overview | [1_Security_Overview.md](1_Security_Overview.md) |
| Federated identity | [2_Federated_Identity.md](2_Federated_Identity.md) |
| Gatekeeper | [3_Gatekeeper.md](3_Gatekeeper.md) |
| Valet key | [4_Valet_Key.md](4_Valet_Key.md) |
| Data backup and disaster recovery | [5_Data_Backup_and_Disaster_Recovery.md](5_Data_Backup_and_Disaster_Recovery.md) |
| SSL and TLS | [6_SSL_and_TLS.md](6_SSL_and_TLS.md) |
| Authentication vs authorization | [7_Authentication_vs_Authorization.md](7_Authentication_vs_Authorization.md) |

## Quick reference

- **Authn/authz** — Who are you? What can you do? Use tokens and least privilege. See [Authentication vs authorization](7_Authentication_vs_Authorization.md).
- **Federated identity** — Delegate login to an IdP (OAuth/OIDC); SSO and fewer passwords to manage.
- **Gatekeeper** — Single entry point that validates, sanitizes, and enforces policy before forwarding to internal services.
- **Valet key** — Short-lived, scoped token for direct client access to storage; keeps bulk data off your servers.
- **Backup and DR** — RPO/RTO; backups and disaster recovery plans.
- **SSL/TLS** — Encryption and authentication in transit; HTTPS, mTLS.
