# Encryption, performance, and key rotation

[← security-tradeoffs](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- TLS everywhere: CPU, latency, connection setup — design impact
- Field-level encryption vs disk encryption vs application-layer
- Key rotation without downtime (dual keys, gradual re-encrypt)
- [Valet key](../Security/4_Valet_Key.md) and pre-signed URLs — scope and expiry
- Compliance drivers (PCI boundaries) at architecture sketch level
- Wire detail → [Networks Security/TLS](../Networks-Deep-Dive/Security/2_Encryption_Tls.md)

## Cross-references

- [Security/6_SSL_and_TLS.md](../Security/6_SSL_and_TLS.md) · [Caching/8_Edge_Caching.md](../Caching/8_Edge_Caching.md) (TLS at CDN)

## Checklist before marking done

- [ ] When to terminate TLS at LB vs end-to-end
- [ ] Key rotation runbook pointer → DevOps secrets management
