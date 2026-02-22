# Security

Authentication, authorization, federated identity, gatekeeper, valet key, backup/DR, SSL/TLS.

## Topics

| Topic | File |
|--------|------|
| Security overview | [1-security-overview.md](1-security-overview.md) |
| Federated identity | [2-federated-identity.md](2-federated-identity.md) |
| Gatekeeper | [3-gatekeeper.md](3-gatekeeper.md) |
| Valet key | [4-valet-key.md](4-valet-key.md) |
| Data backup and disaster recovery | [5-data-backup-and-disaster-recovery.md](5-data-backup-and-disaster-recovery.md) |
| SSL and TLS | [6-ssl-and-tls.md](6-ssl-and-tls.md) |
| Authentication vs authorization | [7-authentication-vs-authorization.md](7-authentication-vs-authorization.md) |

## Quick reference

- **Authn/authz** — Who are you? What can you do? Use tokens and least privilege. See [Authentication vs authorization](7-authentication-vs-authorization.md).
- **Federated identity** — Delegate login to an IdP (OAuth/OIDC); SSO and fewer passwords to manage.
- **Gatekeeper** — Single entry point that validates, sanitizes, and enforces policy before forwarding to internal services.
- **Valet key** — Short-lived, scoped token for direct client access to storage; keeps bulk data off your servers.
- **Backup and DR** — RPO/RTO; backups and disaster recovery plans.
- **SSL/TLS** — Encryption and authentication in transit; HTTPS, mTLS.
