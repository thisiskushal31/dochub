# Encryption, performance, and key rotation

[← security-tradeoffs](./README.md)

Encrypt where the threat model requires it; pay the CPU/latency cost on purpose. Wire TLS detail: [Networks Security/2](https://github.com/thisiskushal31/Networks-Deep-Dive/blob/main/Security/2_Encryption_Tls.md) · pattern note: [Security/6 SSL and TLS](../Security/6_SSL_and_TLS.md).

## TLS placement

| Choice | Pros | Cons | When |
|--------|------|------|------|
| **Terminate at LB/CDN** | Cheap cert ops; edge offload | Hop to origin may be clear inside VPC | Trusted private network + threat model allows |
| **Re-encrypt to origin** | Better transit assurance | More certs / mTLS ops | Multi-tenant / higher assurance |
| **End-to-end app TLS** | Strongest path secrecy | Hardest ops; client complexity | High sensitivity; regulatory |

CDN/edge caching TLS: [Caching/8 Edge Caching](../Caching/8_Edge_Caching.md).

## What layer encrypts what

| Layer | Protects | Does not replace |
|-------|----------|------------------|
| **Disk / volume** | Stolen disk | App-level disclosure to authorized DB users |
| **DB TDE** | Files at rest | Over-broad SQL grants |
| **Field / app-level** | Specific columns from operators | Queryability; key access still critical |
| **TLS** | On the wire | AuthZ bugs |

## Key rotation without downtime

1. Introduce **new** key version; keep old for decrypt.  
2. Encrypt new writes with new key; dual-read.  
3. Re-encrypt backlog (job) or wait for natural rewrite.  
4. Retire old key after metrics show zero decrypts.  

Runbook ownership for secret stores: [DevOps-Handbook Security/1](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Security/1_Security_Practices_And_Secrets.md) and Vault tool notes. Pitfalls: [Security-Deep-Dive Cryptography](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Cryptography).

## Valet key / pre-signed URLs

Scoped, short-lived access to an object without proxying bytes: [Security/4 Valet Key](../Security/4_Valet_Key.md). Trade-off: convenience vs leaked URL window — keep TTL tight and audience narrow.

## Compliance at sketch level

PCI and similar regimes often force **segmented** cardholder data and encryption boundaries. Draw the boundary on the HLD before coding; do not “add crypto later” across a flat monolith.

## Pitfalls checklist

- [ ] TLS version and verification not disabled in prod clients  
- [ ] Rotation runbook exists before first production key  
- [ ] Field encryption keys not the same as TLS private keys  
