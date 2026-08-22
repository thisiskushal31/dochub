# Encryption, performance, and key rotation

[← security-tradeoffs](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- TLS everywhere: CPU, latency, connection setup — design impact
- Field-level encryption vs disk encryption vs application-layer
- Key rotation without downtime (dual keys, gradual re-encrypt)
- [Valet key](../security/4-valet-key.md) and pre-signed URLs — scope and expiry
- Compliance drivers (PCI boundaries) at architecture sketch level
- Wire detail → [Networks Security/TLS](../Networks-Deep-Dive/Security/2_Encryption_Tls.md)

## Cross-references

- [security/6-ssl-and-tls.md](../security/6-ssl-and-tls.md) · [caching/8-edge-caching.md](../caching/8-edge-caching.md) (TLS at CDN)

## Checklist before marking done

- [ ] When to terminate TLS at LB vs end-to-end
- [ ] Key rotation runbook pointer → DevOps secrets management
