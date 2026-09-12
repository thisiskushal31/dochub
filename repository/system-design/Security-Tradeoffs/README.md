# Security trade-offs at design time

Architecture-level security decisions — extends [Security/](../Security/README.md). Full program depth → [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

*(New section — stubs August 2026)*

## Topics

| # | File | Focus |
|---|------|--------|
| 1 | [Threat modeling at design time](./1_Threat_Modeling_At_Design_Time.md) | STRIDE-lite, trust boundaries in HLD |
| 2 | [Auth design vs zero trust](./2_Auth_Design_vs_Zero_Trust.md) | Session vs JWT, mTLS, service identity |
| 3 | [Encryption, performance, and key rotation](./3_Encryption_Performance_and_Key_Rotation.md) | TLS overhead, field-level encryption, KMS |

## Learning path

After [Security/1_Security_Overview.md](../Security/1_Security_Overview.md): 1 → 2 → 3 → Security-Deep-Dive capstone

## Cross-references

- [Networks-Deep-Dive/Security/](../Networks-Deep-Dive/Security/README.md) — wire-level TLS, firewalls
- [DevOps-Handbook/Security/](../DevOps-Handbook/Security/README.md) — pipeline gates, secrets
