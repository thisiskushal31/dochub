# Auth design vs zero trust

[← security-tradeoffs](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Session cookies vs JWT vs opaque tokens — trade-offs at scale
- Service-to-service: mTLS, workload identity, SPIFFE (conceptual)
- Zero trust: never trust network alone; continuous verification
- Gatekeeper vs embedded auth in every service
- Performance: auth on hot path (cache introspection results)
- Link [Security/7_Authentication_vs_Authorization.md](../Security/7_Authentication_vs_Authorization.md)

## Cross-references

- [Networks-Deep-Dive/Service-Mesh/](../Networks-Deep-Dive/Service-Mesh/README.md) · [Security/2_Federated_Identity.md](../Security/2_Federated_Identity.md)

## Checklist before marking done

- [ ] Table: pattern → pros/cons → when to use
- [ ] BFF vs direct client-to-API auth note
