# mTLS and east–west traffic

[← service-mesh](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Why east–west needs identity (zero trust inside the cluster)
- mTLS handshake in mesh context (SNI, SAN, SPIFFE ID)
- Policy: allow/deny by service identity vs IP
- Performance: double encryption, CPU, connection pooling
- Failure modes: cert expiry, wrong trust bundle, partial rollout
- Relation to [Security/5_Firewalls_Aaa.md](../Security/5_Firewalls_Aaa.md) microsegmentation

## Cross-references

- [Security/2_Encryption_Tls.md](../Security/2_Encryption_Tls.md)
- [Services/3_Http_Tls.md](../Services/3_Http_Tls.md)

## Checklist before marking done

- [ ] PERMISSIVE vs STRICT mode explanation
- [ ] tcpdump/wireshark note: what encrypted east–west looks like on the wire
