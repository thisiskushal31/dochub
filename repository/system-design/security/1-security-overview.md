# Security Overview

## Goals

Security in system design aims to preserve **confidentiality** (only authorized parties see data), **integrity** (data is not altered improperly), and **availability** (authorized users can access the system). Failures can impact revenue, compliance, and trust.

## Key areas

- **Authentication** — Establishing identity (who is the user or service?). Examples: passwords, MFA, certificates, OAuth/OIDC.
- **Authorization** — Deciding what an authenticated identity can do (roles, permissions, ABAC/RBAC).
- **Encryption** — Data at rest (e.g. AES) and in transit (TLS). Protect keys; use key management (KMS, HSM).
- **Secrets management** — Store and rotate API keys, DB credentials, and certs securely; avoid hardcoding.
- **Isolation** — Network segmentation, tenant isolation, and principle of least privilege so a breach or bug is contained.
- **Monitoring** — Audit logs, security events (failed logins, access to sensitive resources), and alerts for anomalies.

**Use case:** Design auth and authz early; encrypt sensitive data; isolate components and tenants; monitor and respond to security events. See [Federated identity](2-federated-identity.md), [Gatekeeper](3-gatekeeper.md), and [Valet key](4-valet-key.md).
