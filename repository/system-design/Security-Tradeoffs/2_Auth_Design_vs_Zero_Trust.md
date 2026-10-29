# Auth design vs zero trust

[← security-tradeoffs](./README.md)

Choose session and service identity patterns for **scale, revoke-ability, and blast radius** — not fashion. Vocabulary: [Security/7 Authentication vs Authorization](../Security/7_Authentication_vs_Authorization.md). Program Zero Trust: [Security-Deep-Dive Identity/2](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/2_Zero_Trust.md).

## Client / user session patterns

| Pattern | Pros | Cons | When |
|---------|------|------|------|
| **Server session + cookie** | Easy revoke; opaque to client | Sticky store; CSRF care | Browser apps you control |
| **JWT (bearer)** | Stateless scale; good for APIs | Revoke hard without denylist/short TTL | APIs with short TTL + refresh rotation |
| **Opaque token + introspection** | Central revoke | Introspection latency (cache it) | High revoke need |
| **BFF** | Tokens stay off browser JS | Extra hop | SPAs talking to first-party APIs |

**BFF vs direct client→API:** prefer BFF when the browser must not hold long-lived API tokens; direct when native/mobile confidential clients or public APIs with strict scopes.

## Service-to-service

| Pattern | Pros | Cons | When |
|---------|------|------|------|
| **mTLS** | Strong peer auth | Cert lifecycle cost | Mesh / high assurance |
| **Workload identity** (cloud SA / SPIFFE-class) | No static keys | Platform dependency | Cloud-native |
| **Gatekeeper / policy sidecar** | Central policy | Latency; ops surface | Many languages, shared rules |
| **Embedded authZ in each service** | Simple for one team | Drift across services | Small systems |

See also [Security/3 Gatekeeper](../Security/3_Gatekeeper.md) · [Security/2 Federated Identity](../Security/2_Federated_Identity.md).

## Zero Trust design impact

Never trust “inside the VPC” alone. Continuous verification: short credentials, device/workload posture where you have it, segment by identity not only subnet. Mesh depth: [Networks Service-Mesh](https://github.com/thisiskushal31/Networks-Deep-Dive/blob/main/Service-Mesh/README.md).

## Performance on the hot path

- Cache introspection / JWKS; respect TTL.  
- Terminate auth at the edge when policy allows; still enforce authZ in the service that owns the data.  
- Avoid encrypting-then-ignoring identity (TLS ≠ authorization).

## Cross-references

- Federated SSO patterns → [Security/2](../Security/2_Federated_Identity.md)
- OAuth how-to → Tooling `Specs-Standards/OAuth/`
