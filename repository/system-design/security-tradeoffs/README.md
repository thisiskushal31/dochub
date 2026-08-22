# Security trade-offs at design time

Architecture-level security decisions — extends [security/](../security/README.md). Full program depth → [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) via [Entry-Points/Security_Deep_Dive.md](../Entry-Points/Security_Deep_Dive.md).

*(New section — stubs August 2026)*

## Topics

| # | File | Focus |
|---|------|--------|
| 1 | [Threat modeling at design time](./1-threat-modeling-at-design-time.md) | STRIDE-lite, trust boundaries in HLD |
| 2 | [Auth design vs zero trust](./2-auth-design-vs-zero-trust.md) | Session vs JWT, mTLS, service identity |
| 3 | [Encryption, performance, and key rotation](./3-encryption-performance-and-key-rotation.md) | TLS overhead, field-level encryption, KMS |

## Learning path

After [security/1-security-overview.md](../security/1-security-overview.md): 1 → 2 → 3 → Security-Deep-Dive capstone

## Cross-references

- [Networks-Deep-Dive/Security/](../Networks-Deep-Dive/Security/README.md) — wire-level TLS, firewalls
- [DevOps-Handbook/Security/](../DevOps-Handbook/Security/README.md) — pipeline gates, secrets
