# Keycloak — install and first use

[← Keycloak](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — Docker `start-dev`

Follow the live [Keycloak Docker getting started](https://www.keycloak.org/getting-started/getting-started-docker). Image tags change; copy the current `docker run … quay.io/keycloak/keycloak:<version> start-dev` command from that page (binds `127.0.0.1:8080`, bootstrap admin via env).

Open the Admin Console URL the guide shows (typically `http://localhost:8080`). **Dev mode is not production** — switch DB, TLS, and passwords before any shared use.

## First useful lab steps

1. Create a realm (do not practice only in `master`).
2. Create an OpenID Connect client; note client ID + redirect URIs.
3. Create a test user; enable OTP or WebAuthn in realm authentication flows.
4. Hit the realm OIDC discovery document: `/realms/<realm>/.well-known/openid-configuration`.
5. Practice RP validation habits from Security-Deep-Dive Identity notes 5 and 7.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Getting started (Docker)](https://www.keycloak.org/getting-started/getting-started-docker)
- [Documentation](https://www.keycloak.org/documentation)
- [Server administration](https://www.keycloak.org/docs/latest/server_admin/)
