# Auth design vs zero trust

[← security-tradeoffs](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Session cookies vs JWT vs opaque tokens — trade-offs at scale
- Service-to-service: mTLS, workload identity, SPIFFE (conceptual)
- Zero trust: never trust network alone; continuous verification
- Gatekeeper vs embedded auth in every service
- Performance: auth on hot path (cache introspection results)
- Link [security/7-authentication-vs-authorization.md](../security/7-authentication-vs-authorization.md)

## Cross-references

- [Networks-Deep-Dive/service-mesh/](../Networks-Deep-Dive/service-mesh/README.md) · [security/2-federated-identity.md](../security/2-federated-identity.md)

## Checklist before marking done

- [ ] Table: pattern → pros/cons → when to use
- [ ] BFF vs direct client-to-API auth note
